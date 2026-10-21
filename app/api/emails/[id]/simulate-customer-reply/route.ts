import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { emailStorage } from "@/lib/email/storage";
import { EmailReplyRecord } from "@/lib/email/storage-types";

export async function POST(
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
      return NextResponse.json({ error: "Parent email not found" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const message =
      typeof body.message === "string" && body.message.trim()
        ? body.message.trim()
        : `Hi team, thanks for getting back to me! I received your response and wanted to confirm everything looks good on my end. Looking forward to your next steps.`;

    // Record incoming reply from the customer
    const replyRecord: EmailReplyRecord = {
      id: `rep_inb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      emailId: email.id,
      threadId: email.threadId,
      to: email.recipientEmail,
      from: email.senderEmail,
      subject: email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`,
      bodyText: message,
      resendId: `sim_${Date.now()}`,
      sentAt: new Date().toISOString(),
      status: "sent",
    };

    await emailStorage.addReply(replyRecord);

    // Mark parent conversation unread so it alerts the admin
    await emailStorage.updateEmail(email.id, {
      isRead: false,
      isArchived: false,
      isDeleted: false,
    });

    return NextResponse.json({
      success: true,
      message: "Customer reply recorded in thread successfully",
      reply: replyRecord,
    });
  } catch (err) {
    console.error("[Simulate Customer Reply Error]:", err);
    return NextResponse.json(
      { error: "Failed to simulate customer reply" },
      { status: 500 }
    );
  }
}
