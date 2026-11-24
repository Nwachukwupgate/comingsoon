import { basePath } from "@/content/site";
import { defaultLocale } from "@/i18n/config";

/** Turns "/about" into the public path for a language, e.g. "/v2/about". */
export function localHref(locale: string, path: string) {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${basePath}${prefix}${path === "/" ? "" : path}` || "/";
}

export const whatsappHref = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
