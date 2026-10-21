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
      const candidates = [
        path.join(process.cwd(), ".env.local"),
        path.join(process.cwd(), "my-app", ".env.local"),
      ];
      for (const envPath of candidates) {
        if (fs.existsSync(envPath)) {
          const content = fs.readFileSync(envPath, "utf-8");
          for (const line of content.split("\n")) {
            const trimmed = line.trim();
            if (trimmed.startsWith(`${key}=`)) {
              return trimmed.substring(key.length + 1).trim();
            }
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
        : (getEnvVar("RESEND_FROM_EMAIL") || "info@nettleregenerativefarm.com");

      const subject = data.subject || "(No subject)";
      let bodyText = data.text || data.snippet || data.body || data.raw?.text;
      let bodyHtml = data.html || data.raw?.html;
      let emailHeaders = data.headers || {};

      // Resend keeps webhook payloads lightweight; attempt to fetch full body if API key allows
      const emailId = data.email_id || data.id;
      if (emailId && (!bodyText && !bodyHtml)) {
        try {
          const client = getResendClient();
          if (client && typeof (client.emails as any)?.receiving?.get === "function") {
            const resendResponse = await (client.emails as any).receiving.get(emailId);
            if (resendResponse && !resendResponse.error) {
              const fullEmail = resendResponse.data || resendResponse;
              bodyText = fullEmail.text || bodyText;
              bodyHtml = fullEmail.html || bodyHtml;
              emailHeaders = fullEmail.headers || emailHeaders;
            } else if (resendResponse?.error) {
              console.warn(
                "[Resend Receiving Fetch]: API key is restricted or call failed:",
                resendResponse.error.message || resendResponse.error
              );
            }
          }
        } catch (fetchErr) {
          console.warn("[Resend Receiving Fetch Notice]:", fetchErr);
        }
      }

      bodyText =
        bodyText ||
        (bodyHtml ? bodyHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : "") ||
        `Inbound message received via Resend from ${senderEmail}`;

      // Thread matching: check if In-Reply-To header references an existing email
      const inReplyTo = emailHeaders?.["in-reply-to"] || data.headers?.["in-reply-to"] || data.in_reply_to;
      let threadId = `thread_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      if (inReplyTo) {
        // Search if we have an email with this inboundId
        const { emails } = await emailStorage.getEmails({ limit: 100 });
        const parent = emails.find((e) => e.inboundId === inReplyTo || e.headers?.["message-id"] === inReplyTo);
        if (parent) {
          threadId = parent.threadId;
        }
      }

      const emailRecord: EmailRecord = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        inboundId: data.email_id || data.id || eventId,
        threadId,
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
        headers: emailHeaders,
      };

      try {
        await emailStorage.saveEmail(emailRecord);
      } catch (storageErr) {
        console.error(
          "[Webhook] Storage write failed:",
          storageErr instanceof Error ? storageErr.message : storageErr
        );
        return NextResponse.json({ error: "Failed to persist inbound email" }, { status: 500 });
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
