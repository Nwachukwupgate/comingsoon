"use client";

import { useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import type { DetailField } from "@/lib/enquiry";

type Common = {
  id: string;
  name: string;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
};

/** Label, hint and error wrapper. Wires up aria for the control inside. */
export function Field({
  id, name, value, error, onChange, required, kind, options, hint, type = "text", autoComplete, inputMode,
}: Common & Omit<DetailField, "name"> & { type?: string; autoComplete?: string; inputMode?: "tel" | "email" }) {
  const t = useTranslations("form");
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  const props = {
    id,
    name,
    value,
    className: "field mt-2",
    "aria-invalid": error ? true : undefined,
    "aria-required": required || undefined,
    "aria-describedby": describedBy,
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(name, e.target.value),
  };
  return (
    <div>
      <label htmlFor={id} className="font-bold">
        {t(`fields.${name}`)}
        {!required && <span className="font-medium text-muted"> ({t("optional")})</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-sm text-muted">{t(`hints.${hint}`)}</p>}
      {options ? (
        <select {...props}>
          <option value="">{t("options.choose")}</option>
          {options.map((o) => (
            <option key={o} value={o}>{t(`options.${o}`)}</option>
          ))}
        </select>
      ) : kind === "textarea" ? (
        <textarea {...props} rows={4} />
      ) : (
        <input {...props} type={type} autoComplete={autoComplete} inputMode={inputMode} dir={type === "tel" || type === "email" ? "ltr" : undefined} />
      )}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm font-bold text-[#B42318]">{t(`errors.${error}`)}</p>}
    </div>
  );
}

type RadioProps = {
  legend: string;
  name: string;
  value: string;
  error?: string;
  options: { value: string; label: string }[];
  onChange: (name: string, value: string) => void;
  columns?: string;
  hideLegend?: boolean;
};

export function RadioCards({ legend, name, value, error, options, onChange, columns = "sm:grid-cols-2", hideLegend }: RadioProps) {
  const t = useTranslations("form");
  const id = `${name}-error`;
  return (
    <fieldset aria-describedby={error ? id : undefined} data-invalid={error ? "" : undefined}>
      <legend className={hideLegend ? "sr-only" : "font-bold"}>{legend}</legend>
      <div className={`mt-3 grid gap-3 ${columns}`}>
        {options.map((o) => (
          <label
            key={o.value}
            className="flex min-h-[3.25rem] cursor-pointer items-center gap-3 rounded-lg border border-[#8A94A3] bg-white px-4 py-3 font-bold transition hover:border-navy has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-navy"
          >
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(name, o.value)}
              className="h-5 w-5 shrink-0 accent-accent !outline-none"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error && <p id={id} className="mt-2 text-sm font-bold text-[#B42318]">{t(`errors.${error}`)}</p>}
    </fieldset>
  );
}

/** Name, email, phone, message and preferred method. */
export function ContactFields({
  prefix, values, errors, onChange,
}: {
  prefix: string;
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  const t = useTranslations("form");
  const p = (name: string) => ({ id: `${prefix}-${name}`, name, value: values[name] ?? "", error: errors[name], onChange });
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field {...p("name")} required autoComplete="name" />
        <Field {...p("email")} required type="email" inputMode="email" autoComplete="email" />
      </div>
      <Field {...p("phone")} required type="tel" inputMode="tel" autoComplete="tel" hint="phone" />
      <Field {...p("message")} kind="textarea" />
      <RadioCards
        legend={t("fields.method")}
        name="method"
        value={values.method ?? ""}
        error={errors.method}
        columns="sm:grid-cols-3"
        onChange={onChange}
        options={["call", "whatsapp", "email"].map((v) => ({ value: v, label: t(`options.${v}`) }))}
      />
    </div>
  );
}

/** Hidden from people, tempting to bots. */
export function Honeypot({ value, onChange }: { value: string; onChange: (name: string, value: string) => void }) {
  const t = useTranslations("form");
  return (
    <div aria-hidden="true" className="absolute -start-[200vw] top-0 h-px w-px overflow-hidden">
      <label>
        {t("honeypot")}
        <input name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange("website", e.target.value)} />
      </label>
    </div>
  );
}
