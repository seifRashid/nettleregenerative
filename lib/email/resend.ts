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
}): Promise<void> {
  const client = getResendClient();
  const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

  if (!client || !adminRecipient) {
    return;
  }

  try {
    const from = getVerifiedSender();
    await client.emails.send({
      from,
      to: [adminRecipient],
      subject: `[New Inquiry] ${submission.subject} from ${submission.fullName}`,
      text: `New contact form submission received on Nettle Regenerative website:

Name: ${submission.fullName}
Email: ${submission.email}
Phone: ${submission.phone || "Not provided"}
Preferred Contact Method: ${submission.preferredMethod || "Email"}
Subject: ${submission.subject}

Message:
${submission.message}

View and reply to this message directly in your Email Hub at /admin/emails`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #113B2720; border-radius: 12px; background: #FAFDF8;">
          <h2 style="color: #113B27; margin-top: 0;">New Contact Form Submission</h2>
          <p style="color: #52665B; font-size: 14px;">A new inquiry was submitted on the Nettle Regenerative website.</p>
          <hr style="border: none; border-top: 1px solid #113B2720; margin: 16px 0;" />
          <p><strong>Name:</strong> ${submission.fullName}</p>
          <p><strong>Email:</strong> <a href="mailto:${submission.email}">${submission.email}</a></p>
          <p><strong>Phone:</strong> ${submission.phone || "Not provided"}</p>
          <p><strong>Preferred Method:</strong> ${submission.preferredMethod || "Email"}</p>
          <p><strong>Subject:</strong> ${submission.subject}</p>
          <div style="background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #113B2715; margin-top: 12px;">
            <strong>Message:</strong>
            <p style="white-space: pre-wrap; margin: 8px 0 0 0; color: #11231A;">${submission.message}</p>
          </div>
          <p style="margin-top: 24px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || ""}/admin/emails" style="display: inline-block; background: #113B27; color: #ffffff; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
              Open Admin Email Hub
            </a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("[Admin Notification Error]:", err);
  }
}
