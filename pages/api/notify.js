import { sendToCompany } from "@/lib/mail";

/** Coming soon page: tells the company about a new subscriber. */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const email = String(req.body?.email ?? "").trim();
  if (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address." });
  }

  const sent = await sendToCompany({
    replyTo: email,
    subject: "New Upsworth PMS Subscriber",
    text: `New subscriber: ${email}`,
  });
  if (!sent.ok) {
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
  return res.status(200).json({ message: "Thank you! We'll notify you when we launch." });
}
