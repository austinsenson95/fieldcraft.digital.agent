import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const bmsToolkitSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = bmsToolkitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    // TODO: Wire up ConvertKit, Beehiiv, or EmailOctopus automation to tag BMS Toolkit subscribers.
    console.log("[BMS Toolkit Download]", parsed.data.email);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
