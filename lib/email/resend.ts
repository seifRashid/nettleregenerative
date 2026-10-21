import { Resend } from "resend";
import fs from "fs";
import path from "path";

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

// Resend client singleton
let resendClient: Resend | null = null;
let lastApiKey: string | null = null;

export function getResendClient(): Resend | null {
  const apiKey = getEnvVar("RESEND_API_KEY");
  if (!apiKey || apiKey === "your_resend_api_key" || apiKey.trim() === "") {
    return null;
  }

  if (!resendClient || lastApiKey !== apiKey) {
    resendClient = new Resend(apiKey);
    lastApiKey = apiKey;
  }
  return resendClient;
}

export function getVerifiedSender(): string {
  return getEnvVar("RESEND_FROM_EMAIL") || "onboarding@resend.dev";
}


export interface SendReplyParams {
  to: string;
  subject: string;
  text: string;
  html?: string;
  inReplyTo?: string;
  references?: string;
}

export interface SendResult {
  success: boolean;
  resendId?: string;
  status: "sent" | "simulated" | "failed";
  errorMessage?: string;
}

/**
 * Sends a reply email via Resend with email threading headers
 */
export async function sendReplyEmail(params: SendReplyParams): Promise<SendResult> {
  const client = getResendClient();
  const from = getVerifiedSender();

  // If no live API key is set, log and simulate cleanly in development
  if (!client) {
    console.warn("[Resend] RESEND_API_KEY is not configured. Simulating reply sending in dev mode.");
    return {
      success: true,
      status: "simulated",
      resendId: `sim_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    };
  }

  try {
    const headers: Record<string, string> = {};
    if (params.inReplyTo) {
      headers["In-Reply-To"] = params.inReplyTo;
    }
    if (params.references) {
      headers["References"] = params.references;
    }

    const { data, error } = await client.emails.send({
      from,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html || params.text.replace(/\n/g, "<br>"),
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    if (error) {
      console.error("[Resend Send Error]:", error.message);
      return {
        success: false,
        status: "failed",
        errorMessage: error.message || "Failed to send email via Resend",
      };
    }

    return {
      success: true,
      status: "sent",
      resendId: data?.id,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected email transmission failure";
    console.error("[Resend Exception]:", message);
    return {
      success: false,
      status: "failed",
      errorMessage: message,
    };
  }
}

/**
 * Sends a notification email to the admin when a new contact form is submitted
 */
export async function notifyAdminOfContactSubmission(submission: {
  fullName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  preferredMethod?: string;
}): Promise<{ success: boolean; resendId?: string; error?: string }> {
  const client = getResendClient();
  const adminRecipient =
    getEnvVar("ADMIN_NOTIFICATION_EMAIL") ||
    getEnvVar("ADMIN_EMAIL") ||
    getEnvVar("RESEND_FROM_EMAIL") ||
    "info@nettleregenerativefarm.com";

  if (!client) {
    console.warn("[Resend Notification]: RESEND_API_KEY is not configured. Simulating delivery in development.");
    return { success: true, resendId: `sim_notice_${Date.now()}` };
  }

  try {
    const from = getVerifiedSender();
    const { data, error } = await client.emails.send({
      from,
      to: [adminRecipient],
      replyTo: submission.email,
      subject: `[Website Inquiry] ${submission.subject} from ${submission.fullName}`,
      text: `New contact form submission received on Nettle Regenerative website:

Name: ${submission.fullName}
Email: ${submission.email}
Phone: ${submission.phone || "Not provided"}
Preferred Contact Method: ${submission.preferredMethod || "Email"}
Subject: ${submission.subject}

Message:
${submission.message}

Reply directly to this email to contact the visitor at ${submission.email}.
Or view and manage this conversation in your Admin Email Hub: ${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/emails`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #113B2720; border-radius: 16px; background: #FAFDF8; color: #11231A;">
          <div style="border-bottom: 2px solid #84C135; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #113B27; margin: 0; font-size: 20px;">New Website Contact Inquiry</h2>
            <p style="color: #52665B; font-size: 13px; margin: 4px 0 0 0;">Received via Nettle Regenerative Farm contact page</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">
            <tr>
              <td style="padding: 6px 0; color: #52665B; width: 130px; font-weight: 600;">Full Name:</td>
              <td style="padding: 6px 0; color: #11231A; font-weight: bold;">${submission.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #52665B; font-weight: 600;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${submission.email}" style="color: #113B27; font-weight: 600;">${submission.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #52665B; font-weight: 600;">Phone:</td>
              <td style="padding: 6px 0; color: #11231A;">${submission.phone || "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #52665B; font-weight: 600;">Preferred Method:</td>
              <td style="padding: 6px 0; color: #11231A;">${submission.preferredMethod || "Email"}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #52665B; font-weight: 600;">Subject:</td>
              <td style="padding: 6px 0; color: #11231A; font-weight: 600;">${submission.subject}</td>
            </tr>
          </table>

          <div style="background: #ffffff; padding: 16px; border-radius: 12px; border: 1px solid #113B2715; margin: 16px 0;">
            <strong style="color: #113B27; font-size: 13px; display: block; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px;">Visitor Message:</strong>
            <p style="white-space: pre-wrap; margin: 0; color: #11231A; font-size: 14px; line-height: 1.6;">${submission.message}</p>
          </div>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #113B2715; display: flex; gap: 12px;">
            <a href="mailto:${submission.email}" style="display: inline-block; background: #113B27; color: #ffffff; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-size: 13px; font-weight: bold;">
              Reply directly to ${submission.fullName}
            </a>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend Notification Error]:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, resendId: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Admin Notification Exception]:", message);
    return { success: false, error: message };
  }
}
