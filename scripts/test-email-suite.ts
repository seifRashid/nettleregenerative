import assert from "assert";
import {
  createSessionToken,
  verifySessionToken,
  verifyAdminCredentials,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
} from "../lib/auth/session";
import { emailStorage } from "../lib/email/storage";
import {
  validateContactForm,
  validateReplyForm,
  sanitizeHtml,
} from "../lib/validation/email";
import { EmailRecord, EmailReplyRecord } from "../lib/email/storage-types";

async function runTestSuite() {
  console.log("=================================================");
  console.log(" Running Nettle Regenerative Email Dashboard Tests");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    total++;
    try {
      const res = fn();
      if (res instanceof Promise) {
        return res
          .then(() => {
            console.log(`  ✓ ${name}`);
            passed++;
          })
          .catch((err) => {
            console.error(`  ✗ ${name}:`, err.message);
          });
      } else {
        console.log(`  ✓ ${name}`);
        passed++;
      }
    } catch (err: any) {
      console.error(`  ✗ ${name}:`, err.message);
    }
  }

  // --- Test Suite 1: Authentication & Sessions ---
  console.log("Suite 1: Authentication & Sessions");

  await test("Admin credentials validation with environment password", () => {
    // Default fallback in session.ts is admin123456
    assert.strictEqual(verifyAdminCredentials("admin123456"), true);
    assert.strictEqual(verifyAdminCredentials("wrong_password"), false);
  });

  await test("Session JWT creation and verification", async () => {
    const email = "admin@nettleregenerative.com";
    const token = await createSessionToken(email);
    assert(token && typeof token === "string");

    const session = await verifySessionToken(token);
    assert(session !== null);
    assert.strictEqual(session.email, email);
    assert.strictEqual(session.role, "admin");
  });

  await test("Tampered session token rejection", async () => {
    const email = "admin@nettleregenerative.com";
    const token = await createSessionToken(email);
    const tampered = token.slice(0, -6) + "xxxxxx";
    const session = await verifySessionToken(tampered);
    assert.strictEqual(session, null);
  });

  await test("Rate limiting tracks failed attempts and enforces lockout", () => {
    const testIp = `test_ip_${Date.now()}`;
    clearRateLimit(testIp);

    assert.strictEqual(checkRateLimit(testIp).allowed, true);

    // Record 4 failed attempts
    for (let i = 0; i < 4; i++) {
      const res = recordFailedAttempt(testIp);
      assert.strictEqual(res.locked, false);
    }

    // 5th attempt locks out
    const lockedRes = recordFailedAttempt(testIp);
    assert.strictEqual(lockedRes.locked, true);
    assert(lockedRes.retryAfterSeconds! > 0);

    // Next check should disallow
    assert.strictEqual(checkRateLimit(testIp).allowed, false);

    // Clear rate limit
    clearRateLimit(testIp);
    assert.strictEqual(checkRateLimit(testIp).allowed, true);
  });

  // --- Test Suite 2: Storage Operations & Concurrency ---
  console.log("\nSuite 2: Storage Operations & Concurrency");

  await test("Storage initializes cleanly and retrieves emails", async () => {
    const { emails, total } = await emailStorage.getEmails();
    assert(Array.isArray(emails));
    assert(typeof total === "number");
  });


  await test("Add incoming email and retrieve by ID", async () => {
    const testId = `msg_test_${Date.now()}`;
    const testEmail: EmailRecord = {
      id: testId,
      inboundId: `inb_${testId}`,
      threadId: `thread_${testId}`,
      senderName: "Wanjira Mathai",
      senderEmail: "wanjira@example.com",
      recipientEmail: "hello@nettleregenerative.com",
      subject: "Inquiry on Nettle Soil Mulching Practices",
      bodyText: "How does nettle residue affect organic nitrogen levels?",
      receivedAt: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      isArchived: false,
      isDeleted: false,
      source: "inbound",
    };

    await emailStorage.saveEmail(testEmail);
    const fetched = await emailStorage.getEmailById(testId);
    assert(fetched !== null);
    assert.strictEqual(fetched.senderEmail, "wanjira@example.com");
    assert.strictEqual(fetched.isRead, false);
  });

  await test("Deduplication prevents duplicate message insertion for same inboundId", async () => {
    const uniqueInboundId = `dup_test_${Date.now()}`;
    const email1: EmailRecord = {
      id: `msg_dup1_${Date.now()}`,
      inboundId: uniqueInboundId,
      threadId: "thread_dup",
      senderName: "Duplicate Test",
      senderEmail: "dup@example.com",
      recipientEmail: "hello@nettleregenerative.com",
      subject: "Original Message",
      bodyText: "Body 1",
      receivedAt: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      isArchived: false,
      isDeleted: false,
      source: "inbound",
    };

    await emailStorage.saveEmail(email1);

    const email2: EmailRecord = {
      ...email1,
      id: `msg_dup2_${Date.now()}`,
      subject: "Updated Duplicate Message",
    };

    await emailStorage.saveEmail(email2);

    const { emails } = await emailStorage.getEmails({ search: "Duplicate Test" });
    const matching = emails.filter((e) => e.inboundId === uniqueInboundId);
    assert.strictEqual(matching.length, 1, "Should have deduplicated by inboundId");
    assert.strictEqual(matching[0].subject, "Updated Duplicate Message");
  });

  await test("Update status flags (isStarred, isRead, isArchived)", async () => {
    const testId = `msg_flags_${Date.now()}`;
    await emailStorage.saveEmail({
      id: testId,
      threadId: "thread_flags",
      senderName: "Flag Tester",
      senderEmail: "flags@example.com",
      recipientEmail: "hello@nettleregenerative.com",
      subject: "Flag Test",
      bodyText: "Testing flags",
      receivedAt: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      isArchived: false,
      isDeleted: false,
      source: "inbound",
    });

    await emailStorage.updateEmail(testId, { isStarred: true, isRead: true });
    const updated = await emailStorage.getEmailById(testId);
    assert.strictEqual(updated?.isStarred, true);
    assert.strictEqual(updated?.isRead, true);

    // Clean up
    await emailStorage.deleteEmail(testId, true);
  });

  await test("Thread replies association and reply count update", async () => {
    const parentId = `msg_parent_${Date.now()}`;
    const threadId = `thread_conv_${Date.now()}`;
    await emailStorage.saveEmail({
      id: parentId,
      threadId,
      senderName: "Kariuki Green",
      senderEmail: "kariuki@farm.co.ke",
      recipientEmail: "hello@nettleregenerative.com",
      subject: "Seedling Delivery Timelines",
      bodyText: "When can we expect the next delivery batch?",
      receivedAt: new Date().toISOString(),
      isRead: true,
      isStarred: false,
      isArchived: false,
      isDeleted: false,
      source: "inbound",
    });

    const reply: EmailReplyRecord = {
      id: `rep_${Date.now()}`,
      emailId: parentId,
      threadId,
      to: "kariuki@farm.co.ke",
      from: "hello@nettleregenerative.com",
      subject: "Re: Seedling Delivery Timelines",
      bodyText: "Hi Kariuki, your order is scheduled for dispatch on Wednesday.",
      sentAt: new Date().toISOString(),
      status: "sent",
    };

    await emailStorage.addReply(reply);

    const replies = await emailStorage.getRepliesForEmail(parentId);
    assert.strictEqual(replies.length, 1);
    assert.strictEqual(replies[0].to, "kariuki@farm.co.ke");

    const parent = await emailStorage.getEmailById(parentId);
    assert.strictEqual(parent?.replyCount, 1);

    // Clean up
    await emailStorage.deleteEmail(parentId, true);
  });

  await test("Contact form email persistence and folder querying", async () => {
    const contactId = `msg_contact_${Date.now()}`;
    await emailStorage.saveEmail({
      id: contactId,
      inboundId: `form_${Date.now()}`,
      threadId: `thread_${contactId}`,
      senderName: "Test Visitor",
      senderEmail: "visitor@example.com",
      recipientEmail: "info@nettleregenerativefarm.com",
      subject: "Visiting the farm",
      bodyText: "I would love to arrange a tour for our school group.",
      receivedAt: new Date().toISOString(),
      isRead: false,
      isStarred: false,
      isArchived: false,
      isDeleted: false,
      source: "contact_form",
    });

    const { emails: inboxEmails } = await emailStorage.getEmails({ folder: "inbox" });
    const inInbox = inboxEmails.some((e) => e.id === contactId);
    assert.strictEqual(inInbox, true, "Contact inquiry must appear in Inbox");

    const { emails: contactEmails } = await emailStorage.getEmails({ folder: "contact_form" });
    const inContact = contactEmails.some((e) => e.id === contactId);
    assert.strictEqual(inContact, true, "Contact inquiry must appear in Contact Form folder");

    const stats = await emailStorage.getStats();
    assert(stats.contactForm >= 1, "Contact form stats counter must reflect submission");

    // Clean up
    await emailStorage.deleteEmail(contactId, true);
  });

  await test("Event deduplication tracking", async () => {
    const eventId = `evt_svix_${Date.now()}`;
    assert.strictEqual(await emailStorage.hasEventBeenProcessed(eventId), false);

    await emailStorage.markEventProcessed(eventId);
    assert.strictEqual(await emailStorage.hasEventBeenProcessed(eventId), true);
  });

  // --- Test Suite 3: Validation & Sanitization ---
  console.log("\nSuite 3: Validation & Sanitization");

  await test("Contact form input validation passes for valid payload", () => {
    const result = validateContactForm({
      fullName: "Jane Doe",
      email: "jane.doe@regenerative.ke",
      phone: "+254 700 123 456",
      subject: "Farm Tour",
      preferredMethod: "email",
      message: "We would like to book a tour next week for 5 people.",
    });

    assert.strictEqual(result.isValid, true);
    assert.strictEqual(result.sanitized.fullName, "Jane Doe");
  });

  await test("Contact form rejects invalid email and short messages", () => {
    const result = validateContactForm({
      fullName: "",
      email: "invalid-email-address",
      message: "hi",
    });

    assert.strictEqual(result.isValid, false);
    assert(result.errors.fullName !== undefined);
    assert(result.errors.email !== undefined);
    assert(result.errors.message !== undefined);
  });

  await test("Reply form validation prevents empty body or invalid recipient", () => {
    const result = validateReplyForm({
      to: "not-an-email",
      subject: "",
      bodyText: "   ",
    });

    assert.strictEqual(result.isValid, false);
    assert(result.errors.to !== undefined);
    assert(result.errors.subject !== undefined);
    assert(result.errors.bodyText !== undefined);
  });

  await test("HTML sanitization strips harmful scripts and attributes", () => {
    const malicious = `
      <div>
        <p>Legitimate paragraph content.</p>
        <script>alert('xss')</script>
        <img src="pic.jpg" onerror="alert('hack')" />
        <a href="javascript:void(0)">Click me</a>
      </div>
    `;

    const cleaned = sanitizeHtml(malicious);
    assert(!cleaned.includes("<script>"), "Scripts should be stripped");
    assert(!cleaned.includes("onerror"), "Inline event handlers should be stripped");
    assert(!cleaned.includes("javascript:"), "javascript: pseudo protocol should be stripped");
    assert(cleaned.includes("Legitimate paragraph content."));
  });

  console.log("\n=================================================");
  console.log(` Test Results: ${passed} / ${total} passed`);
  console.log("=================================================\n");

  if (passed !== total) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
