import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_Heqnj68YrxlG@ep-lucky-hall-b7uztko8-pooler.c-13.us-east-1.aws.neon.tech/neondb?sslmode=require";

const sql = neon(connectionString);

async function migrate() {
  console.log("Migrating local JSON emails and replies into Neon...");

  const emailsPath = path.join(process.cwd(), "data", "emails.json");
  const repliesPath = path.join(process.cwd(), "data", "email-replies.json");

  if (fs.existsSync(emailsPath)) {
    const emails = JSON.parse(fs.readFileSync(emailsPath, "utf-8"));
    for (const email of emails) {
      await sql.query(
        `INSERT INTO emails (
          id, inbound_id, thread_id, sender_name, sender_email, recipient_email,
          subject, body_text, body_html, received_at, is_read, is_starred,
          is_archived, is_deleted, source, contact_metadata, headers
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17
        ) ON CONFLICT (id) DO UPDATE SET
          is_read = EXCLUDED.is_read,
          is_starred = EXCLUDED.is_starred,
          is_archived = EXCLUDED.is_archived,
          is_deleted = EXCLUDED.is_deleted`,
        [
          email.id,
          email.inboundId || null,
          email.threadId,
          email.senderName,
          email.senderEmail,
          email.recipientEmail,
          email.subject,
          email.bodyText,
          email.bodyHtml || null,
          email.receivedAt,
          email.isRead ?? false,
          email.isStarred ?? false,
          email.isArchived ?? false,
          email.isDeleted ?? false,
          email.source || "contact_form",
          email.contactMetadata ? JSON.stringify(email.contactMetadata) : null,
          email.headers ? JSON.stringify(email.headers) : null,
        ]
      );
      console.log(`Migrated email: ${email.id} (${email.senderName})`);
    }
  }

  if (fs.existsSync(repliesPath)) {
    const replies = JSON.parse(fs.readFileSync(repliesPath, "utf-8"));
    for (const reply of replies) {
      await sql.query(
        `INSERT INTO email_replies (
          id, email_id, thread_id, to_email, from_email,
          subject, body_text, body_html, resend_id, sent_at, status, error_message
        ) VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9, $10, $11, $12
        ) ON CONFLICT (id) DO NOTHING`,
        [
          reply.id,
          reply.emailId,
          reply.threadId,
          reply.to,
          reply.from,
          reply.subject,
          reply.bodyText,
          reply.bodyHtml || null,
          reply.resendId || null,
          reply.sentAt,
          reply.status || "sent",
          reply.errorMessage || null,
        ]
      );
      console.log(`Migrated reply: ${reply.id}`);
    }
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
