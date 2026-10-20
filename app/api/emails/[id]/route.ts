import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { emailStorage } from "@/lib/email/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const email = await emailStorage.getEmailById(id);
    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const replies = await emailStorage.getRepliesForEmail(id);

    return NextResponse.json({ email, replies });
  } catch (err) {
    console.error("[GET /api/emails/[id] Error]:", err);
    return NextResponse.json({ error: "Failed to fetch email" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    // Allow updating specific status flags only
    const allowedUpdates: Record<string, boolean> = {};
    if (typeof body.isRead === "boolean") allowedUpdates.isRead = body.isRead;
    if (typeof body.isStarred === "boolean") allowedUpdates.isStarred = body.isStarred;
    if (typeof body.isArchived === "boolean") allowedUpdates.isArchived = body.isArchived;
    if (typeof body.isDeleted === "boolean") allowedUpdates.isDeleted = body.isDeleted;

    const updated = await emailStorage.updateEmail(id, allowedUpdates);
    if (!updated) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, email: updated });
  } catch (err) {
    console.error("[PATCH /api/emails/[id] Error]:", err);
    return NextResponse.json({ error: "Failed to update email status" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const hard = searchParams.get("hard") === "true";

    const deleted = await emailStorage.deleteEmail(id, hard);
    if (!deleted) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Email removed" });
  } catch (err) {
    console.error("[DELETE /api/emails/[id] Error]:", err);
    return NextResponse.json({ error: "Failed to delete email" }, { status: 500 });
  }
}
