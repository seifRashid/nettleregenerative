import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import {
  EmailRecord,
  EmailReplyRecord,
  EmailFilter,
  DashboardStats,
  StorageAdapter,
} from "./storage-types";

// Base directory resolver for file storage (handles execution from either workspace root or my-app)
function resolveDataDir(): string {
  if (process.env.DATA_DIR) {
    return path.resolve(process.env.DATA_DIR);
  }
  const cwd = process.cwd();
  if (fsSync.existsSync(path.join(cwd, "my-app", "data"))) {
    return path.join(cwd, "my-app", "data");
  }
  if (fsSync.existsSync(path.join(cwd, "my-app", "package.json"))) {
    return path.join(cwd, "my-app", "data");
  }
  return path.join(cwd, "data");
}

function getDataPaths() {
  const dir = resolveDataDir();
  return {
    dir,
    emailsFile: path.join(dir, "emails.json"),
    repliesFile: path.join(dir, "email-replies.json"),
    eventsFile: path.join(dir, "processed-events.json"),
  };
}

// Mutex queue to prevent concurrent write collisions
class AsyncLock {
  private queue: Promise<void> = Promise.resolve();

  async acquire<T>(task: () => Promise<T>): Promise<T> {
    const nextInQueue = this.queue.then(async () => {
      return await task();
    });
    this.queue = nextInQueue.then(() => {}, () => {});
    return nextInQueue;
  }
}

const fileLock = new AsyncLock();

// Fresh production/clean initial state (no seed emails)
const INITIAL_SEED_EMAILS: EmailRecord[] = [];
const INITIAL_SEED_REPLIES: EmailReplyRecord[] = [];


export class JsonFileStorageAdapter implements StorageAdapter {
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      try {
        const { dir, emailsFile, repliesFile, eventsFile } = getDataPaths();
        await fs.mkdir(dir, { recursive: true });

        // Initialize emails file if absent
        try {
          await fs.access(emailsFile);
        } catch {
          await this.atomicWrite(emailsFile, JSON.stringify(INITIAL_SEED_EMAILS, null, 2));
        }

        // Initialize replies file if absent
        try {
          await fs.access(repliesFile);
        } catch {
          await this.atomicWrite(repliesFile, JSON.stringify(INITIAL_SEED_REPLIES, null, 2));
        }

        // Initialize processed events file if absent
        try {
          await fs.access(eventsFile);
        } catch {
          await this.atomicWrite(eventsFile, JSON.stringify([], null, 2));
        }

        this.initialized = true;
      } catch (err) {
        console.error("Failed to initialize JsonFileStorageAdapter:", err);
      } finally {
        this.initPromise = null;
      }
    })();

    return this.initPromise;
  }


  /**
   * Atomic file writing with Windows-safe fallback (handles EPERM on Windows rename)
   */
  private async atomicWrite(filePath: string, data: string): Promise<void> {
    const parentDir = path.dirname(filePath);
    await fs.mkdir(parentDir, { recursive: true });
    const tmpPath = `${filePath}.${Date.now()}.${Math.random().toString(36).substring(2, 7)}.tmp`;
    try {
      await fs.writeFile(tmpPath, data, "utf-8");
      try {
        await fs.rename(tmpPath, filePath);
      } catch {
        // Windows EPERM fallback: copyFile + unlink
        await fs.copyFile(tmpPath, filePath);
        await fs.unlink(tmpPath).catch(() => {});
      }
    } catch {
      // Fallback: direct atomic write to target file
      await fs.writeFile(filePath, data, "utf-8");
    }
  }


  private async readEmails(): Promise<EmailRecord[]> {
    await this.ensureInitialized();
    try {
      const { emailsFile } = getDataPaths();
      const content = await fs.readFile(/* turbopackIgnore: true */ emailsFile, "utf-8");
      return JSON.parse(content) as EmailRecord[];
    } catch {
      return [];
    }
  }

  private async writeEmails(emails: EmailRecord[]): Promise<void> {
    const { emailsFile } = getDataPaths();
    await this.atomicWrite(emailsFile, JSON.stringify(emails, null, 2));
  }

  private async readReplies(): Promise<EmailReplyRecord[]> {
    await this.ensureInitialized();
    try {
      const { repliesFile } = getDataPaths();
      const content = await fs.readFile(/* turbopackIgnore: true */ repliesFile, "utf-8");
      return JSON.parse(content) as EmailReplyRecord[];
    } catch {
      return [];
    }
  }

  private async writeReplies(replies: EmailReplyRecord[]): Promise<void> {
    const { repliesFile } = getDataPaths();
    await this.atomicWrite(repliesFile, JSON.stringify(replies, null, 2));
  }

  private async readEvents(): Promise<string[]> {
    await this.ensureInitialized();
    try {
      const { eventsFile } = getDataPaths();
      const content = await fs.readFile(/* turbopackIgnore: true */ eventsFile, "utf-8");
      return JSON.parse(content) as string[];
    } catch {
      return [];
    }
  }

  private async writeEvents(events: string[]): Promise<void> {
    const { eventsFile } = getDataPaths();
    await this.atomicWrite(eventsFile, JSON.stringify(events, null, 2));
  }

  async getEmails(filter?: EmailFilter): Promise<{ emails: EmailRecord[]; total: number }> {
    const allEmails = await this.readEmails();
    const allReplies = await this.readReplies();

    // Map reply counts to emails
    const replyCountMap = new Map<string, number>();
    for (const reply of allReplies) {
      replyCountMap.set(reply.emailId, (replyCountMap.get(reply.emailId) || 0) + 1);
    }

    let filtered = allEmails.map((e) => ({
      ...e,
      replyCount: replyCountMap.get(e.id) || e.replyCount || 0,
    }));

    // Filter by folder / category
    if (filter?.folder) {
      switch (filter.folder) {
        case "inbox":
          filtered = filtered.filter((e) => !e.isArchived && !e.isDeleted);
          break;
        case "unread":
          filtered = filtered.filter((e) => !e.isRead && !e.isDeleted && !e.isArchived);
          break;
        case "starred":
          filtered = filtered.filter((e) => e.isStarred && !e.isDeleted);
          break;
        case "contact_form":
          filtered = filtered.filter((e) => e.source === "contact_form" && !e.isDeleted);
          break;
        case "archived":
          filtered = filtered.filter((e) => e.isArchived && !e.isDeleted);
          break;
        case "trash":
          filtered = filtered.filter((e) => e.isDeleted);
          break;
        case "sent":
          filtered = filtered.filter((e) => (replyCountMap.get(e.id) || 0) > 0 && !e.isDeleted);
          break;
      }
    } else {
      // Default: exclude trash
      filtered = filtered.filter((e) => !e.isDeleted);
    }

    // Direct filter flags
    if (filter?.isRead !== undefined) {
      filtered = filtered.filter((e) => e.isRead === filter.isRead);
    }
    if (filter?.isStarred !== undefined) {
      filtered = filtered.filter((e) => e.isStarred === filter.isStarred);
    }
    if (filter?.source) {
      filtered = filtered.filter((e) => e.source === filter.source);
    }

    // Search query filter
    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      filtered = filtered.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.senderName.toLowerCase().includes(q) ||
          e.senderEmail.toLowerCase().includes(q) ||
          e.bodyText.toLowerCase().includes(q)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      const timeA = new Date(a.receivedAt).getTime();
      const timeB = new Date(b.receivedAt).getTime();
      return filter?.sortBy === "oldest" ? timeA - timeB : timeB - timeA;
    });

    const total = filtered.length;
    const page = filter?.page || 1;
    const limit = filter?.limit || 50;
    const paginated = filtered.slice((page - 1) * limit, page * limit);

    return { emails: paginated, total };
  }

  async getEmailById(id: string): Promise<EmailRecord | null> {
    const allEmails = await this.readEmails();
    const email = allEmails.find((e) => e.id === id);
    if (!email) return null;

    const replies = await this.getRepliesForEmail(id);
    return {
      ...email,
      replyCount: replies.length,
    };
  }

  async saveEmail(email: EmailRecord): Promise<EmailRecord> {
    return await fileLock.acquire(async () => {
      const emails = await this.readEmails();
      // Deduplicate if inboundId exists
      if (email.inboundId) {
        const existingIndex = emails.findIndex((e) => e.inboundId === email.inboundId);
        if (existingIndex >= 0) {
          emails[existingIndex] = { ...emails[existingIndex], ...email };
          await this.writeEmails(emails);
          return emails[existingIndex];
        }
      }

      // Check by ID
      const existingByIdIndex = emails.findIndex((e) => e.id === email.id);
      if (existingByIdIndex >= 0) {
        emails[existingByIdIndex] = { ...emails[existingByIdIndex], ...email };
        await this.writeEmails(emails);
        return emails[existingByIdIndex];
      }

      emails.unshift(email);
      await this.writeEmails(emails);
      return email;
    });
  }

  async updateEmail(id: string, updates: Partial<EmailRecord>): Promise<EmailRecord | null> {
    return await fileLock.acquire(async () => {
      const emails = await this.readEmails();
      const index = emails.findIndex((e) => e.id === id);
      if (index === -1) return null;

      emails[index] = { ...emails[index], ...updates };
      await this.writeEmails(emails);
      return emails[index];
    });
  }

  async deleteEmail(id: string, hardDelete: boolean = false): Promise<boolean> {
    return await fileLock.acquire(async () => {
      const emails = await this.readEmails();
      const index = emails.findIndex((e) => e.id === id);
      if (index === -1) return false;

      if (hardDelete) {
        emails.splice(index, 1);
      } else {
        emails[index].isDeleted = true;
      }

      await this.writeEmails(emails);
      return true;
    });
  }

  async addReply(reply: EmailReplyRecord): Promise<EmailReplyRecord> {
    return await fileLock.acquire(async () => {
      const replies = await this.readReplies();
      replies.push(reply);
      await this.writeReplies(replies);

      // Increment reply count on parent email
      const emails = await this.readEmails();
      const email = emails.find((e) => e.id === reply.emailId);
      if (email) {
        email.replyCount = (email.replyCount || 0) + 1;
        await this.writeEmails(emails);
      }

      return reply;
    });
  }

  async getRepliesForEmail(emailId: string): Promise<EmailReplyRecord[]> {
    const replies = await this.readReplies();
    return replies
      .filter((r) => r.emailId === emailId)
      .sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }

  async getAllReplies(): Promise<EmailReplyRecord[]> {
    const replies = await this.readReplies();
    return replies.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
  }

  async hasEventBeenProcessed(eventId: string): Promise<boolean> {
    const events = await this.readEvents();
    return events.includes(eventId);
  }

  async markEventProcessed(eventId: string): Promise<void> {
    await fileLock.acquire(async () => {
      const events = await this.readEvents();
      if (!events.includes(eventId)) {
        events.push(eventId);
        // Retain only last 5000 event IDs to prevent unbounded file growth
        if (events.length > 5000) {
          events.splice(0, events.length - 5000);
        }
        await this.writeEvents(events);
      }
    });
  }

  async getStats(): Promise<DashboardStats> {
    const emails = await this.readEmails();
    const replies = await this.readReplies();

    let inbox = 0;
    let unread = 0;
    let starred = 0;
    let contactForm = 0;
    let archived = 0;
    let trash = 0;

    for (const e of emails) {
      if (e.isDeleted) {
        trash++;
      } else {
        if (!e.isArchived) inbox++;
        if (!e.isRead && !e.isArchived) unread++;
        if (e.isStarred) starred++;
        if (e.source === "contact_form") contactForm++;
        if (e.isArchived) archived++;
      }
    }

    return {
      total: emails.length,
      inbox,
      unread,
      starred,
      contactForm,
      sent: replies.length,
      archived,
      trash,
    };
  }
}

// Global singleton storage adapter instance
export const emailStorage: StorageAdapter = new JsonFileStorageAdapter();
