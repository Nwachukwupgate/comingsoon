"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, type FormEvent } from "react";
import { detailErrors, detailFields, serviceOptions, type ServiceOption } from "@/lib/enquiry";
import { ContactFields, Field, Honeypot, RadioCards } from "./fields";
import { Failed, Sent } from "./Outcome";
import { useEnquiry } from "./useEnquiry";

/** Three steps: service, details, contact. `service` preselects step 1 and
    opens on step 2. /contact?service=logistics does the same. */
export default function EnquiryForm({ service }: { service?: ServiceOption }) {
  const t = useTranslations("form");
  const { values, set, step, setStep, restored, errors, setErrors, status, send, reset, form, result } = useEnquiry(
    service ? { service } : {},
    service ? 1 : 0,
  );
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const steps = t.raw("steps") as string[];
  const chosen = values.service as ServiceOption | undefined;

  // /contact?service=... is read after mount so the page itself stays static.
  useEffect(() => {
    if (service) return;
    const wanted = new URLSearchParams(location.search).get("service");
    if (!wanted || !(serviceOptions as readonly string[]).includes(wanted)) return;
    const id = requestAnimationFrame(() => {
      if (restored.current) return; // Answers kept from before a language change.
      set("service", wanted);
      setStep(1);
    });
    return () => cancelAnimationFrame(id);
    // Once, on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [step]);

  const go = (n: number) => {
    moved.current = true;
    setErrors({});
    setStep(n);
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    if (step === 0) {
      return chosen ? go(1) : setErrors({ service: "service" });
    }
    if (step === 1) {
      const found = detailErrors(chosen!, values);
      return Object.keys(found).length ? setErrors(found) : go(2);
    }
    const { contactSchema, fieldErrors } = await import("@/lib/enquirySchema");
    const r = contactSchema.safeParse(values);
    if (!r.success) return setErrors(fieldErrors(r.error));
    const details = Object.fromEntries(detailFields[chosen!].map((f) => [f.name, values[f.name] ?? ""]));
    return send({ ...r.data, service: chosen, details });
  }

  if (status === "sent") {
    return (
      <Sent
        focusRef={result}
        onAgain={() => {
          reset();
          moved.current = false;
        }}
      />
    );
  }

  return (
    <form ref={form} onSubmit={submit} noValidate className="relative space-y-7">
      <div>
        <ol aria-hidden="true" className="flex gap-2">
          {steps.map((label, i) => (
            <li key={label} className={`flex-1 border-t-4 pt-2 text-sm font-bold ${i <= step ? "border-accent" : "border-line text-muted"}`}>
              {label}
            </li>
          ))}
        </ol>
        <h3 ref={heading} tabIndex={-1} className="mt-6 text-2xl outline-none">
          <span className="sr-only">{t("progress", { current: step + 1, total: steps.length })}: </span>
          {step === 0 ? t("service.legend") : step === 1 ? t(`details.${chosen!}`) : t("steps.2")}
        </h3>
      </div>

      {step === 0 && (
        <RadioCards
          legend={t("service.legend")}
          hideLegend
          name="service"
          value={values.service ?? ""}
          error={errors.service}
          onChange={set}
          options={serviceOptions.map((v) => ({ value: v, label: t(`service.${v}`) }))}
        />
      )}
      {step === 1 && (
        <div className="space-y-6">
          {detailFields[chosen!].map((f) => (
            <Field key={f.name} {...f} id={`enquiry-${f.name}`} value={values[f.name] ?? ""} error={errors[f.name]} onChange={set} />
          ))}
        </div>
      )}
      {step === 2 && <ContactFields prefix="enquiry" values={values} errors={errors} onChange={set} />}

      <Honeypot value={values.website ?? ""} onChange={set} />
      <p role="alert" className="font-bold text-[#B42318] empty:hidden">
        {Object.keys(errors).length > 0 ? t("errors.summary") : ""}
      </p>
      {status === "failed" && <Failed focusRef={result} />}

      <div className="flex flex-wrap gap-3">
        {step > 0 && (
          <button type="button" onClick={() => go(step - 1)} className="btn btn-line">{t("back")}</button>
        )}
        <button type="submit" disabled={status === "sending"} className="btn btn-primary disabled:opacity-70">
          {step < 2 ? t("next") : status === "sending" ? t("sending") : t("submit")}
        </button>
      </div>
    </form>
  );
}
