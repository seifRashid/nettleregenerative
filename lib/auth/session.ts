import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
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

const COOKIE_NAME = "nr_admin_session";
const SESSION_DURATION = 7 * 24 * 60 * 60; // 7 days in seconds

// Ensure secret is converted to a Uint8Array for jose
function getSecretKey(): Uint8Array {
  const secret = getEnvVar("SESSION_SECRET") || "fallback_default_secret_for_nettle_regenerative_dashboard_2026!";
  return new TextEncoder().encode(secret);
}


export interface AdminSession {
  email: string;
  role: "admin";
  iat?: number;
  exp?: number;
}

/**
 * Creates a signed JWT session token
 */
export async function createSessionToken(email: string): Promise<string> {
  const secretKey = getSecretKey();
  return await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(secretKey);
}

/**
 * Verifies and decodes a session token
 */
export async function verifySessionToken(token: string): Promise<AdminSession | null> {
  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    if (payload.role !== "admin" || !payload.email) {
      return null;
    }

    return {
      email: payload.email as string,
      role: "admin",
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

/**
 * Retrieves the current admin session from server cookies
 */
export async function getSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Sets the session cookie on the server
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

/**
 * Clears the session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Timing-safe password verification to guard against timing attacks
 */
export function verifyAdminCredentials(password: string, email?: string): boolean {
  const expectedPassword = getEnvVar("ADMIN_PASSWORD") || "admin123456";
  const expectedEmail = getEnvVar("ADMIN_EMAIL") || "admin@nettleregenerative.com";


  if (email && email.trim().toLowerCase() !== expectedEmail.toLowerCase()) {
    return false;
  }

  // Constant-time string comparison
  const passwordBuffer = Buffer.from(password);
  const expectedBuffer = Buffer.from(expectedPassword);

  if (passwordBuffer.length !== expectedBuffer.length) {
    // Fake timing comparison to avoid length leakage
    crypto.timingSafeEqual(passwordBuffer, passwordBuffer);
    return false;
  }

  return crypto.timingSafeEqual(passwordBuffer, expectedBuffer);
}

// ============================================================================
// Brute Force & Rate Limiting Protection
// ============================================================================

interface RateLimitRecord {
  attempts: number;
  lockedUntil?: number;
  lastAttempt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout
const RESET_WINDOW_MS = 30 * 60 * 1000; // 30 minutes window

/**
 * Check if the given identifier (e.g. client IP) is currently rate limited
 */
export function checkRateLimit(identifier: string): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  // Check if locked
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // Reset if window has elapsed
  if (now - record.lastAttempt > RESET_WINDOW_MS) {
    rateLimitMap.delete(identifier);
    return { allowed: true, remainingAttempts: MAX_ATTEMPTS };
  }

  return {
    allowed: record.attempts < MAX_ATTEMPTS,
    remainingAttempts: Math.max(0, MAX_ATTEMPTS - record.attempts),
  };
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(identifier: string): { locked: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { attempts: 0, lastAttempt: now };

  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    rateLimitMap.set(identifier, record);
    return { locked: true, retryAfterSeconds: Math.ceil(LOCKOUT_MS / 1000) };
  }

  rateLimitMap.set(identifier, record);
  return { locked: false };
}

/**
 * Clear rate limit record on successful login
 */
export function clearRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}
