import { Resend } from "resend";
import { site } from "@/content/site";

/**
 * Sends a website email to the company inbox. Used by the enquiry forms and the
 * coming soon signup.
 *
 * The sender is on the company domain, which must be verified in Resend. It does
 * not need a mailbox: replies go to the visitor through `replyTo`.
 */
const from = process.env.ENQUIRY_FROM || "Upsworth Website <website@upsworth-pms.com>";
const to = process.env.ENQUIRY_TO || site.email;

export type MailResult = { ok: true } | { ok: false; reason: "not-configured" | "failed" };

export async function sendToCompany(mail: { subject: string; text: string; replyTo: string }): Promise<MailResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Email not sent: RESEND_API_KEY is not set.");
    return { ok: false, reason: "not-configured" };
  }
  try {
    const { error } = await new Resend(key).emails.send({ from, to: [to], ...mail });
    if (!error) return { ok: true };
    console.error("Email not sent:", error.message);
  } catch (e) {
    console.error("Email not sent:", e instanceof Error ? e.message : e);
  }
  return { ok: false, reason: "failed" };
}
