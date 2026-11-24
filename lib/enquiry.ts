/** Shared by the forms and the API. Error values are keys in `form.errors`. */
export const serviceOptions = ["project", "logistics", "realEstate", "sourcing", "other"] as const;
export type ServiceOption = (typeof serviceOptions)[number];
export const contactMethods = ["call", "whatsapp", "email"] as const;

/** Accepts +971 50 123 4567, 00971..., and UAE numbers such as 050 123 4567. */
export function normalisePhone(value: string) {
  let v = value.replace(/[\s().-]/g, "");
  if (v.startsWith("00")) v = `+${v.slice(2)}`;
  else if (/^0\d{8,9}$/.test(v)) v = `+971${v.slice(1)}`;
  return v;
}

/** Step 2 fields per service. `required` ones must be filled in. */
export type DetailField = { name: string; required?: boolean; kind?: "textarea"; options?: string[]; hint?: string };
export const detailFields: Record<ServiceOption, DetailField[]> = {
  project: [
    { name: "projectNeed", required: true, options: ["inspection", "support", "maintenance", "handling", "notSure"] },
    { name: "projectLocation" },
    { name: "projectStage", options: ["planning", "underway", "closing"] },
  ],
  logistics: [
    { name: "budget", hint: "budget" },
    { name: "truckType", options: ["dryBox", "chiller", "van", "heavyDuty", "notSure"] },
    { name: "timeline" },
  ],
  realEstate: [
    { name: "propertyGoal", required: true, options: ["offPlan", "secondary", "manage", "resale", "notSure"] },
    { name: "budget", hint: "budget" },
    { name: "area" },
  ],
  sourcing: [
    { name: "item", required: true },
    { name: "specification", kind: "textarea", hint: "specification" },
    { name: "quantity", required: true },
    { name: "destination", required: true },
  ],
  other: [{ name: "subject", required: true }],
};

/** Validates step 2 for a service. Returns { field: errorKey }. */
export function detailErrors(service: ServiceOption, details: Record<string, string>) {
  const errors: Record<string, string> = {};
  for (const f of detailFields[service]) {
    const value = (details[f.name] ?? "").trim();
    if (f.required && !value) errors[f.name] = "required";
    else if (value.length > 1000) errors[f.name] = "tooLong";
    else if (value && f.options && !f.options.includes(value)) errors[f.name] = "required";
  }
  return errors;
}
