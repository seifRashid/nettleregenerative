import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { emailStorage } from "@/lib/email/storage";
import { sendReplyEmail, getVerifiedSender } from "@/lib/email/resend";
import { validateReplyForm } from "@/lib/validation/email";
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
    const validation = validateReplyForm(body);

    if (!validation.isValid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 }
      );
    }

    const { to, subject, bodyText } = validation.sanitized;

    // Email threading headers
    const inReplyTo = email.headers?.["message-id"] || email.inboundId;
    const references = email.headers?.["references"]
      ? `${email.headers["references"]} ${inReplyTo}`
      : inReplyTo;

    // Send via Resend
    const sendResult = await sendReplyEmail({
      to,
      subject,
      text: bodyText,
      inReplyTo,
      references,
    });

    if (!sendResult.success) {
      return NextResponse.json(
        {
          error: sendResult.errorMessage || "Failed to send email via Resend",
        },
        { status: 502 }
      );
    }

    // Record outgoing reply in storage
    const replyRecord: EmailReplyRecord = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      emailId: email.id,
      threadId: email.threadId,
      to,
      from: getVerifiedSender(),
      subject,
      bodyText,
      resendId: sendResult.resendId,
      sentAt: new Date().toISOString(),
      status: sendResult.status,
    };

    let storageSaved = false;
    try {
      await emailStorage.addReply(replyRecord);
      storageSaved = true;

      // Also mark original email as read
      if (!email.isRead) {
        await emailStorage.updateEmail(email.id, { isRead: true });
      }
    } catch (storageErr) {
      console.warn(
        "[Reply API] Reply storage persistence failed:",
        storageErr instanceof Error ? storageErr.message : storageErr
      );
    }

    return NextResponse.json({
      success: true,
      reply: replyRecord,
      simulated: sendResult.status === "simulated",
      storageSaved,
      message:
        sendResult.status === "simulated"
          ? "Reply recorded in development mode (configure RESEND_API_KEY in .env.local for live dispatch)"
          : "Reply sent successfully via Resend",
    });
  } catch (err) {
    console.error("[POST /api/emails/[id]/reply Error]:", err);
    const msg = err instanceof Error ? err.message : "An unexpected error occurred while processing reply";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
