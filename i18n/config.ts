/** To add a language: add messages/<code>.json, then add the code here. */
export const locales = ["en"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];

const rtl = ["ar", "he", "fa", "ur"];
export const dirOf = (locale: string) => (rtl.includes(locale) ? "rtl" : "ltr");
export const isLocale = (value: string | undefined): value is Locale =>
  (locales as readonly string[]).includes(value ?? "");
