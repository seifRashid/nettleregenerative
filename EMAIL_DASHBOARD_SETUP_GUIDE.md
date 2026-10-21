# Nettle Regenerative — Secure Email Management Dashboard Guide

Welcome to the **Nettle Regenerative Email Management Dashboard** documentation. This guide explains how the secure email hub works, how to configure Resend for incoming and outgoing communications, how authentication and storage are structured, and how to deploy safely to production.

---

## 1. Quick Start & Local Development

### 1.1 Running the Application
From the `my-app` directory:

```bash
# Run Next.js development server
npm run dev

# Run the automated email & auth test suite
npm run test:emails

# Build for production
npm run build
```

### 1.2 Accessing the Dashboard
- **Admin Login:** [`http://localhost:3000/admin/emails/login`](http://localhost:3000/admin/emails/login)
- **Email Dashboard:** [`http://localhost:3000/admin/emails`](http://localhost:3000/admin/emails)

Default development credentials configured in `.env.local`:
- **Admin Email:** `admin@nettleregenerative.com`
- **Admin Password:** `admin123456`

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env.local` if creating a fresh environment:

```bash
cp .env.example .env.local
```

### Required Configuration Variables

| Variable | Description | Example / Recommended Value |
|---|---|---|
| `RESEND_API_KEY` | Resend API key with sending permissions | `re_123456789...` (from [Resend API Keys](https://resend.com/api-keys)) |
| `RESEND_FROM_EMAIL` | Verified sender email address | `Nettle Regenerative <contact@nettleregenerative.com>` |
| `RESEND_WEBHOOK_SECRET` | Signing secret for verifying inbound webhook payloads | `whsec_...` (from Resend Dashboard -> Webhooks) |
| `ADMIN_EMAIL` | Administrator login email | `admin@nettleregenerative.com` |
| `ADMIN_PASSWORD` | Strong password required to access `/admin/emails` | Generate a strong password (minimum 12 chars) |
| `SESSION_SECRET` | Secret key used to sign and verify JWT session cookies | Minimum 32-character random string (`openssl rand -base64 32`) |
| `ADMIN_NOTIFICATION_EMAIL` | *(Optional)* Address notified when contact form is submitted | `admin@nettleregenerative.com` |
| `STORAGE_TYPE` | Storage engine adapter (`file` by default) | `file` |

> **Security Note:** `.env.local` is excluded from Git in `.gitignore`. Secrets will never be committed or exposed to browser bundles.

---

## 3. Receiving Incoming Emails (Resend Inbound Setup)

Resend supports receiving inbound emails and forwarding them as HTTP webhooks to your application.

### Step 3.1: Configure Your Inbound Domain in Resend
1. Go to your [Resend Domains Dashboard](https://resend.com/domains).
2. Add your domain (e.g. `nettleregenerative.com` or a subdomain like `mail.nettleregenerative.com`).
3. Add the required DNS records provided by Resend to your DNS registrar (Route 53, Cloudflare, Namecheap, etc.):
   - **MX Record:** Points incoming emails to Resend's inbound servers (e.g., `inbound.resend.com` with priority `10`).
   - **TXT Records:** For SPF and DKIM validation.

### Step 3.2: Configure the Resend Webhook
1. Go to **Webhooks** in the Resend dashboard.
2. Click **Add Webhook**.
3. Set the **Endpoint URL**:
   - Production: `https://your-domain.com/api/webhooks/resend`
   - Local testing: Use an ngrok/Cloudflare tunnel (e.g. `https://xyz.ngrok-free.app/api/webhooks/resend`).
4. Select the events to listen for:
   - Check `email.received` (or all email events).
5. Copy the **Signing Secret** (starts with `whsec_`) and save it to `RESEND_WEBHOOK_SECRET` in `.env.local` or your production environment settings.

### Step 3.3: How Inbound Emails are Processed
When an email is received by Resend:
1. Resend sends a `POST` request with Svix headers (`svix-id`, `svix-timestamp`, `svix-signature`) to `/api/webhooks/resend`.
2. The route verifies the Svix signature using `RESEND_WEBHOOK_SECRET`.
3. The event ID is checked against `data/processed-events.json` to prevent duplicate insertions from webhook retries.
4. The message, sender, recipient, plain text, and HTML are parsed and stored as `source: "inbound"` in `data/emails.json`.
5. If the incoming message references an existing conversation via `In-Reply-To` or `References` headers, it is threaded into the existing conversation.

---

## 4. Contact Form Ingestion

Website contact inquiries submitted at `/contact-us`:
1. Are validated on the server at `POST /api/contact` (valid email, sanitization, length boundaries).
2. Are stored in `data/emails.json` with `source: "contact_form"` and metadata (phone number, preferred contact method, inquiry topic).
3. Distinguishable in the dashboard with an amber **Contact Form** badge.
4. Triggers an instant notification email to `ADMIN_NOTIFICATION_EMAIL` via Resend if configured.

---

## 5. Replying to Messages from the Dashboard

When an admin clicks **Reply** in `/admin/emails`:
1. The reply composer opens with recipient pre-filled and `Re: [Subject]`.
2. Outgoing messages are sent from `RESEND_FROM_EMAIL`.
3. Outgoing headers include `In-Reply-To` and `References` referencing the original message ID.
4. The reply record is stored in `data/email-replies.json` and linked to the email thread ID.
5. In development mode without a live API key, replies are safely simulated (`status: "simulated"`), allowing full UI and workflow verification without crashing.

---

## 6. Storage Architecture (Neon PostgreSQL)

The system uses a dedicated **Neon PostgreSQL** database (`@neondatabase/serverless`) via `PostgresStorageAdapter` for both local development and production.

### Database Tables:
- **`emails`**: Inbound emails and contact form inquiries with threading, status flags, and metadata.
- **`email_replies`**: Outgoing replies and incoming thread responses linked to parent conversations.
- **`processed_events`**: Unique webhook event tracking for deduplication.

### Environment Variable:
```env
DATABASE_URL=postgresql://neondb_owner:npg_Heqnj68YrxlG@ep-lucky-hall-b7uztko8-pooler.c-13.us-east-1.aws.neon.tech/neondb?sslmode=require
```

---

## 7. Automated Testing

To run the automated test suite verifying auth tokens, rate-limiting, storage operations, and HTML sanitization:

```bash
npm run test:emails
```

Test coverage includes:
- Constant-time admin password verification
- Session JWT issuance, expiry, and tampering resistance
- Rate limiting lockout on 5 consecutive failed login attempts
- Inbound email deduplication by message/event ID
- Status flag updates (`isStarred`, `isRead`, `isArchived`, `isDeleted`)
- Email threading and reply association
- Form validation and XSS HTML sanitization
