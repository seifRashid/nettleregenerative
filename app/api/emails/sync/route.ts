import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";
import { getSession } from "@/lib/auth/session";
import { emailStorage } from "@/lib/email/storage";
import { getResendClient, getVerifiedSender } from "@/lib/email/resend";
import { EmailRecord } from "@/lib/email/storage-types";

interface SyncDiagnostic {
  hasApiKey: boolean;
  apiKeyRestricted: boolean;
  webhookSecretConfigured: boolean;
  mxRecords: string[];
  mxPointsToResend: boolean;
  newImportedCount: number;
  message: string;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const client = getResendClient();
  let apiKeyRestricted = false;
  let newImportedCount = 0;
  let syncMessage = "";

  // 1. Check MX records for the domain
  let mxRecords: string[] = [];
  let mxPointsToResend = false;
  try {
    const records = await dns.resolveMx("nettleregenerativefarm.com");
    mxRecords = records.map((r) => `${r.exchange} (priority ${r.priority})`);
    mxPointsToResend = records.some((r) => r.exchange.toLowerCase().includes("resend"));
  } catch (dnsErr) {
    mxRecords = ["Unable to resolve MX records: " + (dnsErr instanceof Error ? dnsErr.message : String(dnsErr))];
  }

  // 2. If Resend client is configured, try to pull received emails
  if (client) {
    try {
      if (typeof (client.emails as any)?.receiving?.list === "function") {
        const resendRes = await (client.emails as any).receiving.list({ limit: 50 });
        if (resendRes?.error) {
          if (resendRes.error.statusCode === 401 || resendRes.error.name === "restricted_api_key") {
            apiKeyRestricted = true;
            syncMessage =
              "Your Resend API key is configured with 'Sending only' permissions. Direct API inbox sync requires an API key with 'Full access'. Inbound messages are received in real-time via the webhook endpoint (/api/webhooks/resend).";
          } else {
            syncMessage = `Resend receiving API notice: ${resendRes.error.message || resendRes.error}`;
          }
        } else if (resendRes?.data && Array.isArray(resendRes.data)) {
          const { emails: existingEmails } = await emailStorage.getEmails({ limit: 500 });
          const existingIds = new Set(
            existingEmails.map((e) => e.inboundId).filter(Boolean)
          );

          for (const item of resendRes.data) {
            const inboundId = item.id || item.email_id;
            if (inboundId && !existingIds.has(inboundId)) {
              const fromStr = typeof item.from === "string" ? item.from : item.from?.[0] || "Unknown Sender";
              const senderMatch = fromStr.match(/^(.*?)\s*<([^>]+)>$/);
              const senderName = senderMatch ? senderMatch[1].trim() : fromStr.split("@")[0];
              const senderEmail = senderMatch ? senderMatch[2].trim() : fromStr;

              const record: EmailRecord = {
                id: `msg_sync_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                inboundId,
                threadId: `thread_${inboundId}`,
                senderName,
                senderEmail,
                recipientEmail: Array.isArray(item.to) ? item.to[0] : (item.to || getVerifiedSender()),
                subject: item.subject || "(No subject)",
                bodyText: item.text || item.snippet || "(Inbound message)",
                bodyHtml: item.html,
                receivedAt: item.created_at || new Date().toISOString(),
                isRead: false,
                isStarred: false,
                isArchived: false,
                isDeleted: false,
                source: "inbound",
              };

              await emailStorage.saveEmail(record);
              newImportedCount++;
            }
          }

          syncMessage =
            newImportedCount > 0
              ? `Imported ${newImportedCount} new incoming email(s) from Resend.`
              : "Dashboard is up to date. No new incoming emails found.";
        }
      }
    } catch (apiErr: any) {
      console.warn("[Sync Error]:", apiErr.message || apiErr);
      syncMessage = `Sync notice: ${apiErr.message || "Failed to reach Resend receiving API."}`;
    }
  } else {
    syncMessage = "RESEND_API_KEY is not configured in environment.";
  }

  const diagnostic: SyncDiagnostic = {
    hasApiKey: Boolean(client),
    apiKeyRestricted,
    webhookSecretConfigured: Boolean(process.env.RESEND_WEBHOOK_SECRET),
    mxRecords,
    mxPointsToResend,
    newImportedCount,
    message: syncMessage,
  };

  return NextResponse.json(diagnostic);
}

export async function GET(req: NextRequest) {
  return POST(req);
}
