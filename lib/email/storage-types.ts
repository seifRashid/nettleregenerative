export type EmailSource = "inbound" | "contact_form";

export interface ContactMetadata {
  phone?: string;
  preferredMethod?: string;
  inquiryType?: string;
}

export interface EmailReplyRecord {
  id: string;
  emailId: string;
  threadId: string;
  to: string;
  from: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  resendId?: string;
  sentAt: string;
  status: "sent" | "failed" | "simulated";
  errorMessage?: string;
}

export interface EmailRecord {
  id: string;
  inboundId?: string;
  threadId: string;
  senderName: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  receivedAt: string;
  isRead: boolean;
  isStarred: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  source: EmailSource;
  contactMetadata?: ContactMetadata;
  headers?: Record<string, string>;
  replyCount?: number;
}

export interface EmailFilter {
  folder?: "inbox" | "unread" | "starred" | "contact_form" | "sent" | "archived" | "trash";
  search?: string;
  isRead?: boolean;
  isStarred?: boolean;
  source?: EmailSource;
  sortBy?: "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  total: number;
  inbox: number;
  unread: number;
  starred: number;
  contactForm: number;
  sent: number;
  archived: number;
  trash: number;
}

export interface StorageAdapter {
  getEmails(filter?: EmailFilter): Promise<{ emails: EmailRecord[]; total: number }>;
  getEmailById(id: string): Promise<EmailRecord | null>;
  saveEmail(email: EmailRecord): Promise<EmailRecord>;
  updateEmail(id: string, updates: Partial<EmailRecord>): Promise<EmailRecord | null>;
  deleteEmail(id: string, hardDelete?: boolean): Promise<boolean>;
  addReply(reply: EmailReplyRecord): Promise<EmailReplyRecord>;
  getRepliesForEmail(emailId: string): Promise<EmailReplyRecord[]>;
  getAllReplies(): Promise<EmailReplyRecord[]>;
  hasEventBeenProcessed(eventId: string): Promise<boolean>;
  markEventProcessed(eventId: string): Promise<void>;
  getStats(): Promise<DashboardStats>;
}
