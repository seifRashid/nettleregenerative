import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation/email";
import { emailStorage } from "@/lib/email/storage";
import { notifyAdminOfContactSubmission, getVerifiedSender } from "@/lib/email/resend";
import { EmailRecord } from "@/lib/email/storage-types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const validation = validateContactForm(body);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Invalid form submission",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const { fullName, email, phone, subject, preferredMethod, message } = validation.sanitized;

    const submissionId = `form_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const threadId = `thread_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Build formatted message text & html
    const formattedText = `Website Contact Form Submission:

From: ${fullName} <${email}>
Phone: ${phone || "Not provided"}
Preferred Contact Method: ${preferredMethod}
Subject: ${subject}

Message:
${message}`;

    const formattedHtml = `
      <div style="font-family: sans-serif; line-height: 1.6; color: #11231A;">
        <div style="background-color: #EBF7D9; border-left: 4px solid #84C135; padding: 12px 16px; margin-bottom: 20px; border-radius: 4px;">
          <strong style="color: #113B27;">Website Contact Inquiry</strong><br/>
          <span style="font-size: 13px; color: #52665B;">Submitted via Nettle Regenerative contact page</span>
        </div>
        <p style="white-space: pre-wrap; font-size: 15px;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
        <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 20px 0;" />
        <div style="font-size: 13px; color: #52665B;">
          <strong>Contact Information:</strong><br />
          Full Name: ${fullName}<br />
          Email: <a href="mailto:${email}">${email}</a><br />
          Phone: ${phone || "None"}<br />
          Preferred Method: ${preferredMethod}
        </div>
      </div>
    `;

    // 1. Store in email storage
    const emailRecord: EmailRecord = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      inboundId: submissionId,
      threadId,
      senderName: fullName,
      senderEmail: email,
      recipientEmail: getVerifiedSender(),
      subject,
      bodyText: formattedText,
      bodyHtml: formattedHtml,
      receivedAt: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      isArchived: false,
      isDeleted: false,
      source: "contact_form",
      contactMetadata: {
        phone: phone || undefined,
        preferredMethod,
        inquiryType: subject,
      },
    };

    let storageSucceeded = false;
    let storageError: string | null = null;
    try {
      await emailStorage.saveEmail(emailRecord);
      storageSucceeded = true;
    } catch (err) {
      storageError = err instanceof Error ? err.message : String(err);
      console.error("[Contact API] Storage write failed:", storageError);
    }

    // 2. Dispatch notification to admin via Resend
    let notificationResult: { success: boolean; resendId?: string; error?: string } = {
      success: false,
    };
    try {
      notificationResult = await notifyAdminOfContactSubmission({
        fullName,
        email,
        phone,
        subject,
        message,
        preferredMethod,
      });
    } catch (err) {
      notificationResult = {
        success: false,
        resendId: undefined,
        error: err instanceof Error ? err.message : String(err),
      };
      console.warn("[Contact API] Admin notification exception:", notificationResult.error);
    }

    // 3. Verify that at least one reliable persistence/delivery channel succeeded
    if (!storageSucceeded && !notificationResult.success) {
      return NextResponse.json(
        {
          error: "Unable to record or deliver your message due to a server error. Please contact us directly at info@nettleregenerativefarm.com or +254 115 198 300.",
          details: {
            storageError,
            notificationError: notificationResult.error,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been successfully received. We will respond shortly.",
      submissionId,
      emailId: emailRecord.id,
      storedInDashboard: storageSucceeded,
      emailDelivered: notificationResult.success,
    });
  } catch (err) {
    console.error("[Contact API Error]:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your message." },
      { status: 500 }
    );
  }
}
