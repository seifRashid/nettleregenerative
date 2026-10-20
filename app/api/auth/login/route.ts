import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  verifyAdminCredentials,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

    // 1. Rate limiting check
    const rateCheck = checkRateLimit(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed attempts. Access locked for security. Please try again in ${rateCheck.retryAfterSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { email, password } = body;

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // 2. Validate credentials
    const isValid = verifyAdminCredentials(password, email);
    if (!isValid) {
      const failRecord = recordFailedAttempt(ip);
      if (failRecord.locked) {
        return NextResponse.json(
          {
            error: `Maximum login attempts exceeded. Access locked for ${failRecord.retryAfterSeconds} seconds.`,
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          error: "Invalid email or password",
          remainingAttempts: rateCheck.remainingAttempts - 1,
        },
        { status: 401 }
      );
    }

    // 3. Clear rate limit on successful authentication
    clearRateLimit(ip);

    // 4. Create and set session cookie
    const adminEmail = email || process.env.ADMIN_EMAIL || "admin@nettleregenerative.com";
    const token = await createSessionToken(adminEmail);
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      email: adminEmail,
    });
  } catch (err) {
    console.error("[Login Route Error]:", err);
    return NextResponse.json({ error: "An unexpected server error occurred" }, { status: 500 });
  }
}
