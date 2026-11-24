import { z } from "zod";
import { contactMethods, detailErrors, normalisePhone, serviceOptions } from "./enquiry";

/* Validation rules. The browser loads this file only when a form is submitted.
   Messages are keys in `form.errors`. */
const text = (max: number) => z.string("required").trim().max(max, "tooLong");
const needed = (max: number) => text(max).min(1, "required");

export const contactFields = {
  name: needed(120),
  email: z.string("required").trim().min(1, "required").max(200, "tooLong").pipe(z.email("email")),
  phone: z
    .string("required")
    .trim()
    .min(1, "required")
    .transform(normalisePhone)
    .pipe(z.string().regex(/^\+[1-9]\d{7,14}$/, "phone")),
  message: text(4000).optional().default(""),
  method: z.enum(contactMethods, "method"),
};

export const contactSchema = z.object(contactFields);

export const enquirySchema = z
  .object({
    service: z.enum(serviceOptions, "service"),
    details: z.record(z.string().max(40), z.string().max(1000)).default({}),
    ...contactFields,
    page: z.string().max(300).default(""),
    locale: z.string().max(10).default("en"),
  })
  .superRefine((v, ctx) => {
    for (const [field, message] of Object.entries(detailErrors(v.service, v.details))) {
      ctx.addIssue({ code: "custom", path: ["details", field], message });
    }
  });

export type Enquiry = z.infer<typeof enquirySchema>;

/** First error per field, as { field: errorKey }. */
export function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of error.issues) out[String(i.path[i.path.length - 1])] ??= i.message;
  return out;
}
