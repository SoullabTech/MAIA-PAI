import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { sendEmail, sendBatchEmails } from '@/lib/email/sendEmail';

/**
 * 📧 EMAIL TOOL for GANESHA
 *
 * Allows GANESHA to send emails on behalf of the user
 * Perfect for:
 * - Notifying members about updates
 * - Sending invites to testers
 * - Automated communication
 * - Follow-ups and reminders
 */

// Schema for single email
const EmailSchema = z.object({
  to: z.union([z.string(), z.array(z.string())]).describe("Email address(es) to send to"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Email body content (supports line breaks with \\n)"),
  fromName: z.string().optional().describe("Sender name (defaults to 'Soullab')"),
});

// Schema for batch emails
const BatchEmailSchema = z.object({
  emails: z.array(EmailSchema).describe("Array of emails to send"),
  delayMs: z.number().optional().describe("Delay between sends in milliseconds (default: 2000)"),
});

export const emailTool = new DynamicStructuredTool({
  name: "send_email",
  description: `Send an email via Resend. Use this when the user asks to email someone, notify members, send invites, or communicate with testers. Supports single or multiple recipients.`,
  schema: EmailSchema,
  func: async ({ to, subject, body, fromName }) => {
    console.log('[EMAIL TOOL] Sending email...');
    console.log(`   To: ${Array.isArray(to) ? to.join(', ') : to}`);
    console.log(`   Subject: ${subject}`);

    const result = await sendEmail({
      to,
      subject,
      body,
      fromName,
      tags: [
        { name: 'source', value: 'ganesha' },
        { name: 'tool', value: 'email_tool' }
      ]
    });

    if (result.success) {
      const recipientList = Array.isArray(to) ? to.join(', ') : to;
      return `✅ Email sent successfully!\n\nTo: ${recipientList}\nSubject: ${subject}\nEmail ID: ${result.id}\n\nYour message has been delivered.`;
    } else {
      return `❌ Failed to send email: ${result.error}\n\nPlease check the email addresses and try again.`;
    }
  },
});

export const batchEmailTool = new DynamicStructuredTool({
  name: "send_batch_emails",
  description: `Send multiple emails at once with a delay between sends. Use this when the user wants to email multiple people or send announcements to a list of members/testers.`,
  schema: BatchEmailSchema,
  func: async ({ emails, delayMs = 2000 }) => {
    console.log(`[BATCH EMAIL TOOL] Sending ${emails.length} emails with ${delayMs}ms delay...`);

    const result = await sendBatchEmails(
      emails.map(e => ({
        to: e.to,
        subject: e.subject,
        body: e.body,
        fromName: e.fromName,
        tags: [
          { name: 'source', value: 'ganesha' },
          { name: 'tool', value: 'batch_email_tool' }
        ]
      })),
      delayMs
    );

    if (result.successful > 0) {
      return `✅ Batch email complete!\n\nTotal: ${result.total}\nSuccessful: ${result.successful}\nFailed: ${result.failed}\n\n${result.successful === result.total ? 'All emails sent successfully! 🎉' : 'Some emails failed - check logs for details.'}`;
    } else {
      return `❌ All emails failed to send.\n\nPlease check the configuration and try again.`;
    }
  },
});

export default emailTool;
