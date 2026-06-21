import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const briefSchema = z.object({
  bottleneck: z.string().min(1).max(5000),
  budget: z.string().min(1),
  allocated: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = briefSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    // TODO: Send qualifying data to CRM, Airtable, Notion, or email intake.
    console.log("[Brief Intake]", parsed.data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
