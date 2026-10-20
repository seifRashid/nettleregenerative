import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { emailStorage } from "@/lib/email/storage";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const stats = await emailStorage.getStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("[GET /api/emails/stats Error]:", err);
    return NextResponse.json({ error: "Failed to compute stats" }, { status: 500 });
  }
}
