/**
 * Email and form input validation and sanitization utilities
 */

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  return EMAIL_REGEX.test(email.trim());
}

export interface ContactFormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: {
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    preferredMethod: string;
    message: string;
  };
}

export function validateContactForm(input: {
  fullName?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  preferredMethod?: unknown;
  message?: unknown;
}): ContactFormValidationResult {
  const errors: Record<string, string> = {};

  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const subject = typeof input.subject === "string" ? input.subject.trim() : "Website Inquiry";
  const preferredMethod = typeof input.preferredMethod === "string" ? input.preferredMethod.trim() : "email";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!fullName) {
    errors.fullName = "Please enter your full name";
  } else if (fullName.length > 100) {
    errors.fullName = "Name is too long (maximum 100 characters)";
  }

  if (!email) {
    errors.email = "Please enter your email address";
  } else if (!isValidEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (phone && phone.length > 30) {
    errors.phone = "Phone number is too long";
  }

  if (!subject) {
    errors.subject = "Please select or provide a subject";
  } else if (subject.length > 150) {
    errors.subject = "Subject is too long (maximum 150 characters)";
  }

  if (!message) {
    errors.message = "Please enter your message";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters";
  } else if (message.length > 5000) {
    errors.message = "Message exceeds maximum length of 5000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      fullName,
      email,
      phone,
      subject,
      preferredMethod,
      message,
    },
  };
}

export interface ReplyValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  sanitized: {
    to: string;
    subject: string;
    bodyText: string;
  };
}

export function validateReplyForm(input: {
  to?: unknown;
  subject?: unknown;
  bodyText?: unknown;
}): ReplyValidationResult {
  const errors: Record<string, string> = {};

  const to = typeof input.to === "string" ? input.to.trim() : "";
  const subject = typeof input.subject === "string" ? input.subject.trim() : "";
  const bodyText = typeof input.bodyText === "string" ? input.bodyText.trim() : "";

  if (!to || !isValidEmail(to)) {
    errors.to = "A valid recipient email address is required";
  }

  if (!subject) {
    errors.subject = "Subject is required";
  } else if (subject.length > 200) {
    errors.subject = "Subject is too long (maximum 200 characters)";
  }

  if (!bodyText) {
    errors.bodyText = "Reply message cannot be empty";
  } else if (bodyText.length > 10000) {
    errors.bodyText = "Reply exceeds maximum allowed length of 10,000 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      to,
      subject,
      bodyText,
    },
  };
}

/**
 * Basic server-side HTML sanitizer for rendering incoming emails safely
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  // Strip script tags and content
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // Strip style tags and content to prevent style injection
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // Strip embedded objects, iframes, and meta
  clean = clean.replace(/<\/?(iframe|object|embed|applet|meta|link|base|form|input|button)\b[^>]*>/gi, "");

  // Strip inline JavaScript event attributes (e.g. onload, onerror, onclick)
  clean = clean.replace(/\son\w+\s*=\s*(['"]).*?\1/gi, "");
  clean = clean.replace(/\son\w+\s*=\s*[^ >]+/gi, "");

  // Strip javascript: URLs in href or src
  clean = clean.replace(/href\s*=\s*(['"])javascript:[^'"]*\1/gi, 'href="#"');
  clean = clean.replace(/src\s*=\s*(['"])javascript:[^'"]*\1/gi, 'src=""');

  return clean;
}
