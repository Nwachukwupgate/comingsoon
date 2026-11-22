
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address.",
      });
    }

    const { error } = await resend.emails.send({
      from: "Upsworth PMS <onboarding@resend.dev>",
      to: ["info@upsworth-pms.com"],
      subject: "New Upsworth PMS Subscriber",
      text: `New subscriber: ${email}`,
      replyTo: email,
    });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({
      message: "Thank you! We'll notify you when we launch.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Something went wrong. Please try again.",
    });
  }
}
