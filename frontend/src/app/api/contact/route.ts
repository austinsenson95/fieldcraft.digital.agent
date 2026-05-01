import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import type { ContactRequest, ContactResponse } from "@fieldcraft/shared";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequest = await request.json();

    // Validate
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json<ContactResponse>(
        {
          success: false,
          message: "Name, email, and message are required",
        },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json<ContactResponse>(
        {
          success: false,
          message: "Please enter a valid email address",
        },
        { status: 400 }
      );
    }

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? "Fieldcraft <hello@fieldcraft.digital>",
      to: process.env.EMAIL_TO ?? "austin@fieldcraft.digital",
      replyTo: body.email,
      subject: `New contact from ${body.name}`,
      text: `Name: ${body.name}\nEmail: ${body.email}\n\nMessage:\n${body.message}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1A1A18; background: #F5F1EB;">
          <h2 style="color: #0F2B1E; font-size: 20px; margin-bottom: 16px;">New contact from fieldcraft.digital</h2>
          <p><strong>Name:</strong> ${body.name}</p>
          <p><strong>Email:</strong> ${body.email}</p>
          <hr style="border: none; border-top: 1px solid #E8E2D8; margin: 20px 0;" />
          <p style="white-space: pre-wrap;">${body.message}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json<ContactResponse>(
        {
          success: false,
          message: "Failed to send message. Please try again.",
        },
        { status: 500 }
      );
    }

    console.log("Email sent:", data?.id);

    return NextResponse.json<ContactResponse>({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json<ContactResponse>(
      {
        success: false,
        message: "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
