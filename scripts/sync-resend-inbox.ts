import { emailStorage } from "../lib/email/storage";
import { getResendClient } from "../lib/email/resend";
import { EmailRecord } from "../lib/email/storage-types";

function parseAddress(fromStr: string): { name: string; email: string } {
  if (!fromStr) return { name: "Unknown Sender", email: "unknown@example.com" };
  const match = fromStr.match(/^(.*?)\s*<([^>]+)>$/);
  if (match) {
    const name = match[1].trim().replace(/^["']|["']$/g, "") || match[2].trim();
    return { name, email: match[2].trim() };
  }
  return { name: fromStr.split("@")[0] || fromStr, email: fromStr.trim() };
}

export async function syncResendInbox() {
  const client = getResendClient();
  const apiKey = process.env.RESEND_API_KEY;

  console.log("Checking Resend inbound emails...");
  const res = await fetch("https://api.resend.com/emails/receiving", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  const data = await res.json();
  const receivingList: any[] = data.data || [];
  console.log(`Found ${receivingList.length} inbound email(s) on Resend.`);

  const { emails: existingEmails } = await emailStorage.getEmails({ limit: 500 });
  const allReplies = await emailStorage.getAllReplies();

  for (const item of receivingList) {
    const emailId = item.id;

    // Check if already in emails or replies
    const existsInEmails = existingEmails.find(
      (e) => e.inboundId === emailId || (e.headers && e.headers["message-id"] === item.message_id)
    );
    const existsInReplies = allReplies.find(
      (r) => r.resendId === emailId
    );

    if (existsInEmails || existsInReplies) {
      console.log(`- Email ${emailId} ("${item.subject}") already recorded. Skipping.`);
      continue;
    }

    console.log(`+ Processing new inbound email: ${emailId} ("${item.subject}")...`);
    // Fetch full details
    let fullEmail: any = item;
    try {
      if (client && typeof (client.emails as any)?.receiving?.get === "function") {
        const fullRes = await (client.emails as any).receiving.get(emailId);
        fullEmail = fullRes?.data || fullRes || item;
      } else {
        const directRes = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        });
        fullEmail = await directRes.json();
      }
    } catch (err: any) {
      console.warn("Could not fetch full email content:", err.message);
    }

    const fromRaw = typeof fullEmail.from === "string" ? fullEmail.from : (fullEmail.from?.[0] || item.from || "");
    const { name: senderName, email: senderEmail } = parseAddress(fromRaw);
    const recipientEmail = Array.isArray(fullEmail.to) ? fullEmail.to[0] : (fullEmail.to || "info@nettleregenerativefarm.com");
    const subject = fullEmail.subject || item.subject || "(No subject)";
    const bodyText = fullEmail.text || (fullEmail.html ? fullEmail.html.replace(/<[^>]+>/g, " ") : "(Empty message)");
    const bodyHtml = fullEmail.html || null;
    const emailHeaders = fullEmail.headers || {};

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
      console.log(`  -> Linking as reply to parent thread: ${parentEmail.id}`);
      await emailStorage.addReply({
        id: `rep_inb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
    } else {
      console.log(`  -> Saving as new email conversation`);
      const newEmail = await emailStorage.saveEmail({
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
      existingEmails.unshift(newEmail);
    }
  }

  console.log("Sync complete!");
}

if (require.main === module) {
  syncResendInbox().catch(console.error);
}
