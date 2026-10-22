import { NextRequest, NextResponse } from "next/server";
import dns from "dns/promises";
import { getSession } from "@/lib/auth/session";
import { syncInboundEmailsFromResend } from "@/lib/email/sync";
import { getResendClient } from "@/lib/email/resend";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const client = getResendClient();

  // Check MX records for the domain
  let mxRecords: string[] = [];
  let mxPointsToResend = false;
  try {
    const records = await dns.resolveMx("nettleregenerativefarm.com");
    mxRecords = records.map((r) => `${r.exchange} (priority ${r.priority})`);
    mxPointsToResend = records.some((r) => {
      const ex = r.exchange.toLowerCase();
      return ex.includes("resend") || ex.includes("rmta") || ex.includes("forge");
    });
  } catch (dnsErr) {
    mxRecords = ["Unable to resolve MX records: " + (dnsErr instanceof Error ? dnsErr.message : String(dnsErr))];
  }

  // Force sync from Resend inbox
  const syncResult = await syncInboundEmailsFromResend(true);

  return NextResponse.json({
    hasApiKey: Boolean(client),
    apiKeyRestricted: false,
    webhookSecretConfigured: Boolean(process.env.RESEND_WEBHOOK_SECRET),
    mxRecords,
    mxPointsToResend,
    newImportedCount: syncResult.newImportedCount,
    message: syncResult.message,
  });
}
