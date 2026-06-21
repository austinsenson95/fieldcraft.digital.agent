import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const playbookSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = playbookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    // TODO: Wire up ConvertKit/Beehiiv/EmailOctopus automation to send the playbook PDF.
    console.log("[Playbook Download]", parsed.data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
