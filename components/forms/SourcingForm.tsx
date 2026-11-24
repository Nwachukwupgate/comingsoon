"use client";

import { useTranslations } from "next-intl";
import type { FormEvent } from "react";
import { detailErrors, detailFields } from "@/lib/enquiry";
import { ContactFields, Field, Honeypot } from "./fields";
import { Failed, Sent } from "./Outcome";
import { useEnquiry } from "./useEnquiry";

export default function SourcingForm() {
  const t = useTranslations("form");
  const { values, set, errors, setErrors, status, send, reset, form, result } = useEnquiry({});

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    const { contactSchema, fieldErrors } = await import("@/lib/enquirySchema");
    const r = contactSchema.safeParse(values);
    const found = { ...detailErrors("sourcing", values), ...(r.success ? {} : fieldErrors(r.error)) };
    if (!r.success || Object.keys(found).length) return setErrors(found);
    const details = Object.fromEntries(detailFields.sourcing.map((f) => [f.name, values[f.name] ?? ""]));
    return send({ ...r.data, service: "sourcing", details });
  }

  if (status === "sent") return <Sent focusRef={result} onAgain={reset} />;

  return (
    <form ref={form} onSubmit={submit} noValidate className="relative space-y-6">
      {detailFields.sourcing.map((f) => (
        <Field key={f.name} {...f} id={`sourcing-${f.name}`} value={values[f.name] ?? ""} error={errors[f.name]} onChange={set} />
      ))}
      <ContactFields prefix="sourcing" values={values} errors={errors} onChange={set} />
      <Honeypot value={values.website ?? ""} onChange={set} />
      <p role="alert" className="font-bold text-[#B42318] empty:hidden">
        {Object.keys(errors).length > 0 ? t("errors.summary") : ""}
      </p>
      {status === "failed" && <Failed focusRef={result} />}
      <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-70">
        {status === "sending" ? t("sending") : t("submitSourcing")}
      </button>
    </form>
  );
}
