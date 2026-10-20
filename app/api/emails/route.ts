import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { emailStorage } from "@/lib/email/storage";
import { EmailFilter } from "@/lib/email/storage-types";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder") as EmailFilter["folder"] | undefined;
    const search = searchParams.get("search") || undefined;
    const source = searchParams.get("source") as EmailFilter["source"] | undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const result = await emailStorage.getEmails({
      folder,
      search,
      source,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("[GET /api/emails Error]:", err);
    return NextResponse.json({ error: "Failed to fetch email records" }, { status: 500 });
  }
}
