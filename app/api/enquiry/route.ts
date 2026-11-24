import { Resend } from "resend";
import en from "@/messages/en.json";
import { site } from "@/content/site";
import { detailFields } from "@/lib/enquiry";
import { enquirySchema, fieldErrors } from "@/lib/enquirySchema";

const MAX_BYTES = 20_000;
const clean = (v: string) => v.replace(/[\r\n]+/g, " ").trim();

export async function POST(request: Request) {
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BYTES) return Response.json({ ok: false, error: "tooLong" }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false, error: "invalid" }, { status: 400 });
  }

  // Honeypot: people never see this field. Answer as if it worked.
  if (body && typeof body === "object" && (body as { website?: string }).website) {
    return Response.json({ ok: true });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("Enquiry not sent: RESEND_API_KEY is not set.");
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const v = parsed.data;
  const labels = en.form.fields as Record<string, string>;
  const options = en.form.options as Record<string, string>;
  const serviceName = en.form.service[v.service];
  const lines = [
    `Service: ${serviceName}`,
    ...detailFields[v.service]
      .filter((f) => v.details[f.name]?.trim())
      .map((f) => `${labels[f.name]}: ${f.options ? options[v.details[f.name]] : v.details[f.name].trim()}`),
    "",
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    `Phone: ${v.phone}`,
    `Preferred contact: ${options[v.method]}`,
    "",
    "Message:",
    v.message || "(none)",
    "",
    `Sent from: ${v.page || "unknown page"} (${v.locale})`,
  ];

  try {
    const { error } = await new Resend(key).emails.send({
      from: process.env.ENQUIRY_FROM || "Upsworth PMS <onboarding@resend.dev>",
      to: [process.env.ENQUIRY_TO || site.email],
      replyTo: v.email,
      subject: clean(`Website enquiry: ${serviceName}, ${v.name}`),
      text: lines.join("\n"),
    });
    if (error) throw new Error(error.message);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("Enquiry not sent:", e instanceof Error ? e.message : e);
    return Response.json({ ok: false, error: "unavailable" }, { status: 502 });
  }
}
