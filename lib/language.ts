"use client";

import { languageCookie, type Locale } from "@/i18n/config";

/** Forms listen for this and keep their answers. See components/forms/useEnquiry.ts. */
export const languageEvent = "upsworth:language";

export function savedLanguage() {
  return document.cookie.match(new RegExp(`(?:^|; )${languageCookie}=([^;]*)`))?.[1];
}

/** Saves the choice, then reloads the same address in the new language. */
export async function switchLanguage(to: Locale) {
  dispatchEvent(new Event(languageEvent));
  const body = new FormData();
  body.set("to", to);
  body.set("path", location.pathname);
  const res = await fetch("/api/language", { method: "POST", body, redirect: "manual" });
  // A redirect answer is opaque here, and means the cookie was set.
  if (res.type !== "opaqueredirect" && !res.ok) throw new Error("language");
  location.reload();
}
