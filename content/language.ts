import type { Locale } from "@/i18n/config";

/** Offered to visitors whose browser prefers this language. Written in it. */
export const languageOffer: Partial<Record<Locale, { text: string; accept: string; dismiss: string }>> = {
  ar: { text: "هل تفضل عرض الموقع بالعربية؟", accept: "عرض بالعربية", dismiss: "إغلاق" },
};
