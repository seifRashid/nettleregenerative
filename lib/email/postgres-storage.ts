import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import {
  EmailRecord,
  EmailReplyRecord,
  EmailFilter,
  DashboardStats,
  StorageAdapter,
} from "./storage-types";

function mapRowToEmail(row: any, replyCount = 0): EmailRecord {
  return {
    id: row.id,
    inboundId: row.inbound_id || undefined,
    threadId: row.thread_id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    recipientEmail: row.recipient_email,
    subject: row.subject,
    bodyText: row.body_text,
    bodyHtml: row.body_html || undefined,
    receivedAt: new Date(row.received_at).toISOString(),
    isRead: Boolean(row.is_read),
    isStarred: Boolean(row.is_starred),
    isArchived: Boolean(row.is_archived),
    isDeleted: Boolean(row.is_deleted),
    source: row.source as "inbound" | "contact_form",
    contactMetadata: row.contact_metadata || undefined,
    headers: row.headers || undefined,
    replyCount,
  };
}

function mapRowToReply(row: any): EmailReplyRecord {
  return {
    id: row.id,
    emailId: row.email_id,
    threadId: row.thread_id,
    to: row.to_email,
    from: row.from_email,
    subject: row.subject,
    bodyText: row.body_text,
    bodyHtml: row.body_html || undefined,
    resendId: row.resend_id || undefined,
    sentAt: new Date(row.sent_at).toISOString(),
    status: row.status as "sent" | "failed" | "simulated",
    errorMessage: row.error_message || undefined,
  };
}

export class PostgresStorageAdapter implements StorageAdapter {
  private sql: NeonQueryFunction<false, false>;

  constructor(connectionString: string) {
    this.sql = neon(connectionString);
  }

  async getEmails(filter?: EmailFilter): Promise<{ emails: EmailRecord[]; total: number }> {
    let query = `
      SELECT e.*, COALESCE(r.reply_count, 0)::int as reply_count
      FROM emails e
      LEFT JOIN (
        SELECT email_id, COUNT(*) as reply_count
        FROM email_replies
        GROUP BY email_id
      ) r ON e.id = r.email_id
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;

    // Folder filtering
    if (filter?.folder) {
      switch (filter.folder) {
        case "inbox":
          query += ` AND e.is_archived = false AND e.is_deleted = false`;
          break;
        case "unread":
          query += ` AND e.is_read = false AND e.is_archived = false AND e.is_deleted = false`;
          break;
        case "starred":
          query += ` AND e.is_starred = true AND e.is_deleted = false`;
          break;
        case "contact_form":
          query += ` AND e.source = 'contact_form' AND e.is_deleted = false`;
          break;
        case "archived":
          query += ` AND e.is_archived = true AND e.is_deleted = false`;
          break;
        case "trash":
          query += ` AND e.is_deleted = true`;
          break;
        case "sent":
          query += ` AND COALESCE(r.reply_count, 0) > 0 AND e.is_deleted = false`;
          break;
      }
    } else {
      query += ` AND e.is_deleted = false`;
    }

    if (filter?.isRead !== undefined) {
      query += ` AND e.is_read = $${paramIndex++}`;
      params.push(filter.isRead);
    }
    if (filter?.isStarred !== undefined) {
      query += ` AND e.is_starred = $${paramIndex++}`;
      params.push(filter.isStarred);
    }
    if (filter?.source) {
      query += ` AND e.source = $${paramIndex++}`;
      params.push(filter.source);
    }

    if (filter?.search && filter.search.trim()) {
      query += ` AND (
        e.subject ILIKE $${paramIndex} OR
        e.sender_name ILIKE $${paramIndex} OR
        e.sender_email ILIKE $${paramIndex} OR
        e.body_text ILIKE $${paramIndex}
      )`;
      params.push(`%${filter.search.trim()}%`);
      paramIndex++;
    }

    const sortDirection = filter?.sortBy === "oldest" ? "ASC" : "DESC";
    query += ` ORDER BY e.received_at ${sortDirection}`;

    // Count total before pagination
    const countQuery = `SELECT COUNT(*) FROM (${query}) as filtered_count`;
    const countResult = await this.sql.query(countQuery, params);
    const total = parseInt((countResult[0] as any)?.count || "0", 10);

    const page = Math.max(1, filter?.page || 1);
    const limit = Math.max(1, filter?.limit || 50);
    const offset = (page - 1) * limit;

    query += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const rows = await this.sql.query(query, params);
    const emails = rows.map((r: any) => mapRowToEmail(r, r.reply_count));

    return { emails, total };
  }

  async getEmailById(id: string): Promise<EmailRecord | null> {
    const rows = await this.sql.query(
      `SELECT e.*, COALESCE(r.reply_count, 0)::int as reply_count
       FROM emails e
       LEFT JOIN (
         SELECT email_id, COUNT(*) as reply_count
         FROM email_replies
         GROUP BY email_id
       ) r ON e.id = r.email_id
       WHERE e.id = $1`,
      [id]
    );
    if (!rows || rows.length === 0) return null;
    return mapRowToEmail(rows[0], rows[0].reply_count);
  }

  async saveEmail(email: EmailRecord): Promise<EmailRecord> {
    // Deduplicate by inbound_id if provided
    if (email.inboundId) {
      const existing = await this.sql.query(
        `SELECT id FROM emails WHERE inbound_id = $1 LIMIT 1`,
        [email.inboundId]
      );
      if (existing && existing.length > 0) {
        await this.updateEmail(existing[0].id, email);
        return (await this.getEmailById(existing[0].id))!;
      }
    }

    // Check by ID
    const existingById = await this.sql.query(
      `SELECT id FROM emails WHERE id = $1 LIMIT 1`,
      [email.id]
    );
    if (existingById && existingById.length > 0) {
      await this.updateEmail(email.id, email);
      return (await this.getEmailById(email.id))!;
    }

    await this.sql.query(
      `INSERT INTO emails (
        id, inbound_id, thread_id, sender_name, sender_email, recipient_email,
        subject, body_text, body_html, received_at, is_read, is_starred,
        is_archived, is_deleted, source, contact_metadata, headers
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17
      )`,
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
        email.isRead,
        email.isStarred,
        email.isArchived,
        email.isDeleted,
        email.source,
        email.contactMetadata ? JSON.stringify(email.contactMetadata) : null,
        email.headers ? JSON.stringify(email.headers) : null,
      ]
    );

    return email;
  }

  async updateEmail(id: string, updates: Partial<EmailRecord>): Promise<EmailRecord | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (updates.isRead !== undefined) {
      fields.push(`is_read = $${idx++}`);
      values.push(updates.isRead);
    }
    if (updates.isStarred !== undefined) {
      fields.push(`is_starred = $${idx++}`);
      values.push(updates.isStarred);
    }
    if (updates.isArchived !== undefined) {
      fields.push(`is_archived = $${idx++}`);
      values.push(updates.isArchived);
    }
    if (updates.isDeleted !== undefined) {
      fields.push(`is_deleted = $${idx++}`);
      values.push(updates.isDeleted);
    }
    if (updates.subject !== undefined) {
      fields.push(`subject = $${idx++}`);
      values.push(updates.subject);
    }
    if (updates.bodyText !== undefined) {
      fields.push(`body_text = $${idx++}`);
      values.push(updates.bodyText);
    }

    if (fields.length === 0) {
      return this.getEmailById(id);
    }

    values.push(id);
    await this.sql.query(
      `UPDATE emails SET ${fields.join(", ")} WHERE id = $${idx}`,
      values
    );

    return this.getEmailById(id);
  }

  async deleteEmail(id: string, hardDelete = false): Promise<boolean> {
    if (hardDelete) {
      const res = await this.sql.query(`DELETE FROM emails WHERE id = $1 RETURNING id`, [id]);
      return res.length > 0;
    } else {
      const res = await this.sql.query(
        `UPDATE emails SET is_deleted = true WHERE id = $1 RETURNING id`,
        [id]
      );
      return res.length > 0;
    }
  }

  async addReply(reply: EmailReplyRecord): Promise<EmailReplyRecord> {
    await this.sql.query(
      `INSERT INTO email_replies (
        id, email_id, thread_id, to_email, from_email,
        subject, body_text, body_html, resend_id, sent_at, status, error_message
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11, $12
      )`,
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
        reply.status,
        reply.errorMessage || null,
      ]
    );

    return reply;
  }

  async getRepliesForEmail(emailId: string): Promise<EmailReplyRecord[]> {
    const rows = await this.sql.query(
      `SELECT * FROM email_replies WHERE email_id = $1 ORDER BY sent_at ASC`,
      [emailId]
    );
    return rows.map(mapRowToReply);
  }

  async getAllReplies(): Promise<EmailReplyRecord[]> {
    const rows = await this.sql.query(
      `SELECT * FROM email_replies ORDER BY sent_at DESC`
    );
    return rows.map(mapRowToReply);
  }

  async hasEventBeenProcessed(eventId: string): Promise<boolean> {
    const rows = await this.sql.query(
      `SELECT event_id FROM processed_events WHERE event_id = $1 LIMIT 1`,
      [eventId]
    );
    return rows && rows.length > 0;
  }

  async markEventProcessed(eventId: string): Promise<void> {
    await this.sql.query(
      `INSERT INTO processed_events (event_id, processed_at)
       VALUES ($1, NOW())
       ON CONFLICT (event_id) DO NOTHING`,
      [eventId]
    );
  }

  async getStats(): Promise<DashboardStats> {
    const statsQuery = `
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE is_archived = false AND is_deleted = false) as inbox,
        COUNT(*) FILTER (WHERE is_read = false AND is_archived = false AND is_deleted = false) as unread,
        COUNT(*) FILTER (WHERE is_starred = true AND is_deleted = false) as starred,
        COUNT(*) FILTER (WHERE source = 'contact_form' AND is_deleted = false) as contact_form,
        COUNT(*) FILTER (WHERE is_archived = true AND is_deleted = false) as archived,
        COUNT(*) FILTER (WHERE is_deleted = true) as trash
      FROM emails
    `;

    const replyCountQuery = `SELECT COUNT(*) as sent FROM email_replies`;

    const [statsResult, replyResult] = await Promise.all([
      this.sql.query(statsQuery),
      this.sql.query(replyCountQuery),
    ]);

    const s = statsResult[0] || {};
    const sent = parseInt((replyResult[0] as any)?.sent || "0", 10);

    return {
      total: parseInt(s.total || "0", 10),
      inbox: parseInt(s.inbox || "0", 10),
      unread: parseInt(s.unread || "0", 10),
      starred: parseInt(s.starred || "0", 10),
      contactForm: parseInt(s.contact_form || "0", 10),
      sent,
      archived: parseInt(s.archived || "0", 10),
      trash: parseInt(s.trash || "0", 10),
    };
  }
}
