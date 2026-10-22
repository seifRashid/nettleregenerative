import { emailStorage } from "./storage";
import { getResendClient, getVerifiedSender } from "./resend";
import { EmailRecord } from "./storage-types";

function parseAddress(fromStr: string): { name: string; email: string } {
  if (!fromStr) return { name: "Unknown Sender", email: "unknown@example.com" };
  const match = fromStr.match(/^(.*?)\s*<([^>]+)>$/);
  if (match) {
    const name = match[1].trim().replace(/^["']|["']$/g, "") || match[2].trim();
    return { name, email: match[2].trim() };
  }
  return { name: fromStr.split("@")[0] || fromStr, email: fromStr.trim() };
}

let lastSyncTimestamp = 0;
const SYNC_THROTTLE_MS = 15000; // 15 seconds

export async function syncInboundEmailsFromResend(force: boolean = false): Promise<{
  success: boolean;
  newImportedCount: number;
  message: string;
}> {
  const now = Date.now();
  if (!force && now - lastSyncTimestamp < SYNC_THROTTLE_MS) {
    return {
      success: true,
      newImportedCount: 0,
      message: "Sync recently completed",
    };
  }
  lastSyncTimestamp = now;

  const client = getResendClient();
  const apiKey = process.env.RESEND_API_KEY;

  try {
    let receivingList: any[] = [];

    if (client && typeof (client.emails as any)?.receiving?.list === "function") {
      const listRes = await (client.emails as any).receiving.list({ limit: 50 });
      if (listRes?.data) {
        if (Array.isArray(listRes.data)) {
          receivingList = listRes.data;
        } else if (Array.isArray(listRes.data?.data)) {
          receivingList = listRes.data.data;
        }
      }
    }

    // Direct HTTP fallback if SDK did not return items
    if (receivingList.length === 0 && apiKey) {
      try {
        const httpRes = await fetch("https://api.resend.com/emails/receiving", {
          headers: { Authorization: `Bearer ${apiKey}` },
          next: { revalidate: 0 },
        });
        if (httpRes.ok) {
          const json = await httpRes.json();
          if (Array.isArray(json.data)) {
            receivingList = json.data;
          }
        }
      } catch {}
    }

    if (receivingList.length === 0) {
      return {
        success: true,
        newImportedCount: 0,
        message: "No inbound emails found on Resend",
      };
    }

    const { emails: existingEmails } = await emailStorage.getEmails({ limit: 500 });
    const allReplies = await emailStorage.getAllReplies();

    const existingInboundIds = new Set(
      existingEmails.map((e) => e.inboundId).filter(Boolean)
    );
    const existingMessageIds = new Set(
      existingEmails.map((e) => e.headers?.["message-id"]).filter(Boolean)
    );
    const existingReplyResendIds = new Set(
      allReplies.map((r) => r.resendId).filter(Boolean)
    );

    let newImportedCount = 0;

    for (const item of receivingList) {
      const emailId = item.id;
      if (!emailId) continue;

      if (
        existingInboundIds.has(emailId) ||
        existingReplyResendIds.has(emailId) ||
        (item.message_id && existingMessageIds.has(item.message_id))
      ) {
        continue;
      }

      // Fetch full email content
      let fullEmail: any = item;
      try {
        if (client && typeof (client.emails as any)?.receiving?.get === "function") {
          const detailRes = await (client.emails as any).receiving.get(emailId);
          fullEmail = detailRes?.data || detailRes || item;
        } else {
          const detailRes = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
            headers: { Authorization: `Bearer ${apiKey}` },
          });
          if (detailRes.ok) {
            fullEmail = await detailRes.json();
          }
        }
      } catch (e) {
        console.warn(`[Sync] Could not fetch details for ${emailId}:`, e);
      }

      const fromRaw =
        typeof fullEmail.from === "string"
          ? fullEmail.from
          : fullEmail.from?.[0] || item.from || "";
      const { name: senderName, email: senderEmail } = parseAddress(fromRaw);
      const recipientEmail = Array.isArray(fullEmail.to)
        ? fullEmail.to[0]
        : fullEmail.to || item.to?.[0] || getVerifiedSender();
      const subject = fullEmail.subject || item.subject || "(No subject)";
      const bodyText =
        fullEmail.text ||
        (fullEmail.html ? fullEmail.html.replace(/<[^>]+>/g, " ") : "(Inbound message)");
      const bodyHtml = fullEmail.html || null;
      const emailHeaders = fullEmail.headers || {};

      // Check if this email is a reply to an existing thread
      const inReplyTo =
        emailHeaders["in-reply-to"] ||
        emailHeaders["references"];

      let parentEmail: EmailRecord | undefined;
      if (inReplyTo) {
        const cleanInReplyTo = inReplyTo.replace(/^<|>$/g, "").trim();
        parentEmail = existingEmails.find(
          (e) =>
            e.inboundId === cleanInReplyTo ||
            e.inboundId === inReplyTo ||
            e.headers?.["message-id"] === cleanInReplyTo ||
            e.headers?.["message-id"] === inReplyTo ||
            (e.inboundId && cleanInReplyTo.includes(e.inboundId))
        );

        if (!parentEmail) {
          const matchedReply = allReplies.find(
            (r) =>
              r.resendId === cleanInReplyTo ||
              r.resendId === inReplyTo ||
              (r.resendId && cleanInReplyTo.includes(r.resendId))
          );
          if (matchedReply) {
            parentEmail = existingEmails.find((e) => e.id === matchedReply.emailId);
          }
        }
      }

      if (!parentEmail && subject.toLowerCase().startsWith("re:")) {
        const baseSubject = subject.replace(/^re:\s*/i, "").trim().toLowerCase();
        parentEmail = existingEmails.find(
          (e) =>
            e.senderEmail.toLowerCase() === senderEmail.toLowerCase() &&
            e.subject.toLowerCase().replace(/^re:\s*/i, "").trim() === baseSubject
        );
      }

      if (parentEmail) {
        // Record as threaded reply
        const replyId = `rep_inb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        await emailStorage.addReply({
          id: replyId,
          emailId: parentEmail.id,
          threadId: parentEmail.threadId,
          to: recipientEmail,
          from: senderEmail,
          subject,
          bodyText,
          bodyHtml,
          resendId: emailId,
          sentAt: fullEmail.created_at || new Date().toISOString(),
          status: "sent",
        });

        await emailStorage.updateEmail(parentEmail.id, {
          isRead: false,
          isArchived: false,
          isDeleted: false,
        });

        existingReplyResendIds.add(emailId);
        newImportedCount++;
      } else {
        // Record as brand new parent conversation
        const newEmailId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const newRecord = await emailStorage.saveEmail({
          id: newEmailId,
          inboundId: emailId,
          threadId: `thread_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          senderName,
          senderEmail,
          recipientEmail,
          subject,
          bodyText,
          bodyHtml,
          receivedAt: fullEmail.created_at || new Date().toISOString(),
          isRead: false,
          isStarred: false,
          isArchived: false,
          isDeleted: false,
          source: "inbound",
          headers: emailHeaders,
        });

        existingEmails.unshift(newRecord);
        existingInboundIds.add(emailId);
        if (fullEmail.message_id) existingMessageIds.add(fullEmail.message_id);
        newImportedCount++;
      }
    }

    return {
      success: true,
      newImportedCount,
      message:
        newImportedCount > 0
          ? `Imported ${newImportedCount} new incoming email(s) from Resend.`
          : "Inbox is up to date.",
    };
  } catch (err: any) {
    console.error("[Sync Inbound Emails Error]:", err);
    return {
      success: false,
      newImportedCount: 0,
      message: err.message || "Failed to sync inbound emails",
    };
  }
}
