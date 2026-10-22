import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import fs from "fs";
import path from "path";
import { emailStorage } from "@/lib/email/storage";
import { EmailRecord } from "@/lib/email/storage-types";
import { getResendClient } from "@/lib/email/resend";

function getEnvVar(key: string): string | undefined {
  const val = process.env[key];
  if (val && !val.startsWith("your_")) {
    return val;
  }

  // Only attempt filesystem fallback in local development (Vercel is read-only)
  if (process.env.NODE_ENV !== "production") {
    try {
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (trimmed.startsWith(`${key}=`)) {
            return trimmed.substring(key.length + 1).trim();
          }
        }
      }
    } catch {}
  }

  return val;
}

// Helper to extract clean name and email from RFC 2822 "Name <email@example.com>" format
function parseAddress(fromStr: string): { name: string; email: string } {
  if (!fromStr) return { name: "Unknown Sender", email: "unknown@example.com" };

  const match = fromStr.match(/^(.*?)\s*<([^>]+)>$/);
  if (match) {
    const name = match[1].trim().replace(/^["']|["']$/g, "") || match[2].trim();
    return { name, email: match[2].trim() };
  }

  return { name: fromStr.split("@")[0] || fromStr, email: fromStr.trim() };
}

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = getEnvVar("RESEND_WEBHOOK_SECRET");
    const rawBody = await req.text();


    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");

    let eventPayload: any;

    // 1. Verify webhook signature if secret is configured
    if (webhookSecret && webhookSecret !== "your_resend_webhook_secret") {
      if (!svixId || !svixTimestamp || !svixSignature) {
        return NextResponse.json(
          { error: "Missing Svix signature headers" },
          { status: 400 }
        );
      }

      try {
        const wh = new Webhook(webhookSecret);
        eventPayload = wh.verify(rawBody, {
          "svix-id": svixId,
          "svix-timestamp": svixTimestamp,
          "svix-signature": svixSignature,
        });
      } catch (err: any) {
        console.error("[Resend Webhook Verification Failed]:", err.message);
        return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 });
      }
    } else {
      // In local dev without secret, parse JSON directly with a warning
      console.warn(
        "[Resend Webhook] RESEND_WEBHOOK_SECRET not configured. Parsing payload without verification (dev mode only)."
      );
      try {
        eventPayload = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Malformed JSON payload" }, { status: 400 });
      }
    }

    // 2. Deduplication check
    const eventId = svixId || eventPayload?.id || `evt_${Date.now()}`;
    const alreadyProcessed = await emailStorage.hasEventBeenProcessed(eventId);
    if (alreadyProcessed) {
      return NextResponse.json({ message: "Event already processed (deduplicated)" }, { status: 200 });
    }

    const eventType = eventPayload?.type;
    const data = eventPayload?.data || eventPayload;

    // 3. Process inbound email
    // Resend triggers 'email.received' or inbound delivery events
    if (eventType === "email.received" || data?.from) {
      const fromRaw = typeof data.from === "string" ? data.from : (data.from?.[0] || "");
      const { name: senderName, email: senderEmail } = parseAddress(fromRaw);

      const recipientEmail = Array.isArray(data.to)
        ? data.to[0]
        : typeof data.to === "string"
        ? data.to
        : (process.env.RESEND_FROM_EMAIL || "hello@nettleregenerative.com");

      const subject = data.subject || "(No subject)";
      let bodyText = data.text;
      let bodyHtml = data.html;
      let emailHeaders = data.headers || {};

      // Resend keeps the webhook lightweight; fetch the full body and HTML using email_id
      const emailId = data.email_id || data.id;
      if (emailId && (!bodyText && !bodyHtml)) {
        try {
          const client = getResendClient();
          if (client && typeof client.emails?.receiving?.get === "function") {
            const resendResponse = await client.emails.receiving.get(emailId);
            const fullEmail = (resendResponse as any)?.data || resendResponse;
            if (fullEmail) {
              bodyText = fullEmail.text || bodyText;
              bodyHtml = fullEmail.html || bodyHtml;
              emailHeaders = fullEmail.headers || emailHeaders;
            }
          }
        } catch (fetchErr) {
          console.warn("[Resend Receiving Fetch]:", fetchErr);
        }
      }

      bodyText = bodyText || (bodyHtml ? bodyHtml.replace(/<[^>]+>/g, " ") : "(Empty message)");

      // Thread matching: check if In-Reply-To header or references match an existing email or reply
      const inReplyTo =
        emailHeaders?.["in-reply-to"] ||
        data.headers?.["in-reply-to"] ||
        data.in_reply_to ||
        emailHeaders?.["references"] ||
        data.headers?.["references"];

      let parentEmail: EmailRecord | undefined;

      if (inReplyTo) {
        const cleanInReplyTo = inReplyTo.replace(/^<|>$/g, "").trim();
        const { emails } = await emailStorage.getEmails({ limit: 200 });

        parentEmail = emails.find(
          (e) =>
            e.inboundId === cleanInReplyTo ||
            e.inboundId === inReplyTo ||
            e.headers?.["message-id"] === cleanInReplyTo ||
            e.headers?.["message-id"] === inReplyTo ||
            (e.inboundId && cleanInReplyTo.includes(e.inboundId))
        );

        if (!parentEmail) {
          const allReplies = await emailStorage.getAllReplies();
          const matchedReply = allReplies.find(
            (r) =>
              r.resendId === cleanInReplyTo ||
              r.resendId === inReplyTo ||
              (r.resendId && cleanInReplyTo.includes(r.resendId))
          );
          if (matchedReply) {
            parentEmail = emails.find((e) => e.id === matchedReply.emailId);
          }
        }
      }

      // Subject fallback (Re: ...) matching
      if (!parentEmail && subject.toLowerCase().startsWith("re:")) {
        const baseSubject = subject.replace(/^re:\s*/i, "").trim().toLowerCase();
        const { emails } = await emailStorage.getEmails({ limit: 100 });
        parentEmail = emails.find(
          (e) =>
            e.senderEmail.toLowerCase() === senderEmail.toLowerCase() &&
            e.subject.toLowerCase().replace(/^re:\s*/i, "").trim() === baseSubject
        );
      }

      if (parentEmail) {
        // Customer replied to an existing conversation
        const replyRecord = {
          id: `rep_inb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          emailId: parentEmail.id,
          threadId: parentEmail.threadId,
          to: recipientEmail,
          from: senderEmail,
          subject,
          bodyText,
          bodyHtml,
          resendId: data.email_id || data.id,
          sentAt: data.created_at || new Date().toISOString(),
          status: "sent" as const,
        };

        try {
          await emailStorage.addReply(replyRecord);
          // Reopen / highlight parent email in admin inbox
          await emailStorage.updateEmail(parentEmail.id, {
            isRead: false,
            isArchived: false,
            isDeleted: false,
          });
        } catch (storageErr) {
          console.warn("[Webhook] Reply storage write failed:", storageErr);
        }
      } else {
        // Brand new inbound inquiry
        const emailRecord: EmailRecord = {
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          inboundId: data.email_id || data.id || eventId,
          threadId: `thread_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          senderName,
          senderEmail,
          recipientEmail,
          subject,
          bodyText,
          bodyHtml,
          receivedAt: data.created_at || new Date().toISOString(),
          isRead: false,
          isStarred: false,
          isArchived: false,
          isDeleted: false,
          source: "inbound",
          headers: emailHeaders || data.headers || {},
        };

        try {
          await emailStorage.saveEmail(emailRecord);
        } catch (storageErr) {
          console.error(
            "[Webhook] Storage write error:",
            storageErr instanceof Error ? storageErr.message : storageErr
          );
        }
      }
    }

    // Mark event processed for deduplication (best-effort)
    try {
      await emailStorage.markEventProcessed(eventId);
    } catch {
      // Ignore on read-only runtimes
    }

    return NextResponse.json({ success: true, processedEventId: eventId });
  } catch (err) {
    console.error("[Resend Webhook Processing Error]:", err);
    return NextResponse.json({ error: "Webhook processing failure" }, { status: 500 });
  }
}
