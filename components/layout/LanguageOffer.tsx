"use client";

import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { languageOffer } from "@/content/language";
import { dirOf, isLocale, type Locale } from "@/i18n/config";
import { savedLanguage, switchLanguage } from "@/lib/language";

const DISMISSED = "upsworth-language-offer";

/** Offers the visitor's browser language once. Never switches by itself. */
export default function LanguageOffer() {
  const locale = useLocale();
  const [to, setTo] = useState<Locale | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      const wanted = navigator.languages?.[0]?.split("-")[0];
      if (!isLocale(wanted) || wanted === locale || !languageOffer[wanted] || savedLanguage()) return;
      try {
        if (localStorage.getItem(DISMISSED)) return;
      } catch {}
      setTo(wanted);
    }, 1200);
    return () => clearTimeout(id);
  }, [locale]);

  if (!to) return null;
  const offer = languageOffer[to]!;
  const close = () => {
    setTo(null);
    try {
      localStorage.setItem(DISMISSED, "1");
    } catch {}
  };

  return (
    <aside
      lang={to}
      dir={dirOf(to)}
      aria-label={offer.text}
      className="on-dark font-arabic fixed bottom-4 left-4 right-24 z-40 flex items-center gap-3 rounded-2xl bg-navy p-3 pe-2 ps-5 text-white shadow-[0_18px_50px_-12px_rgb(4_23_51/0.6)] sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-md"
    >
      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2">
        <p className="font-semibold leading-snug">{offer.text}</p>
        <button
          type="button"
          onClick={() => switchLanguage(to).catch(close)}
          className="min-h-[2.75rem] rounded-lg bg-accent px-4 font-bold text-navy-deep"
        >
          {offer.accept}
        </button>
      </div>
      <button type="button" onClick={close} aria-label={offer.dismiss} className="grid h-11 w-11 shrink-0 place-items-center self-start rounded-lg hover:bg-white/10">
        <X aria-hidden="true" className="h-5 w-5" />
      </button>
    </aside>
  );
}
