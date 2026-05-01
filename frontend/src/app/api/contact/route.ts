import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

// Lazy init — don't crash at build time if env var is missing
let resend: Resend | null = null;
function getResend(): Resend {
  if (!resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set");
    }
    resend = new Resend(key);
  }
  return resend;
}

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5; // requests per hour
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required").max(5000),
  source: z.string().optional(),
  company: z.string().optional(), // honeypot field
});

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstIssue?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const { name, email, message, source, company } = parsed.data;

    // Honeypot check
    if (company && company.trim().length > 0) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Send email via Resend
    // Note: Resend free tier only sends to account owner until domain is verified
    const fromEmail = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
    const toEmail = process.env.EMAIL_TO ?? "austinsenson95@gmail.com";

    const { data, error } = await getResend().emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSource: ${source ?? "website"}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1A1A18; background: #F5F1EB;">
          <h2 style="color: #0F2B1E; font-size: 20px; margin-bottom: 16px;">New contact from fieldcraft.digital</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Source:</strong> ${source ?? "website"}</p>
          <hr style="border: none; border-top: 1px solid #E8E2D8; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return NextResponse.json(
        { success: false, error: "Failed to send message. Please try again." },
        { status: 500 }
      );
    }

    console.log("[Contact Form] Email sent:", data?.id, { name, email, source, ip });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
