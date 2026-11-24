/** To add a language: add messages/<code>.json, then add the code and its own
    name here. Every language is served from the same address. The visitor's
    choice is kept in a cookie and next.config.ts picks the page from it. */
export const locales = ["en", "ar"] as const;
export const defaultLocale = "en";
export type Locale = (typeof locales)[number];

/** Each language named in that language, for the switcher. */
export const languageNames: Record<Locale, string> = { en: "English", ar: "العربية" };

export const languageCookie = "upsworth-lang";

const rtl = ["ar", "he", "fa", "ur"];
export const dirOf = (locale: string) => (rtl.includes(locale) ? "rtl" : "ltr");
export const isLocale = (value: string | undefined | null): value is Locale =>
  (locales as readonly string[]).includes(value ?? "");
