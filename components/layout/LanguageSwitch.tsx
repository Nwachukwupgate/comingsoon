"use client";

import { Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, type FormEvent } from "react";
import { languageNames, locales } from "@/i18n/config";
import { savedLanguage, switchLanguage } from "@/lib/language";

/** Button named in the language it switches to. The form also works without JavaScript. */
export default function LanguageSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("common");
  const [busy, setBusy] = useState(false);
  const next = locales[(locales.findIndex((l) => l === locale) + 1) % locales.length];

  // Going back can restore a page saved before the language changed.
  useEffect(() => {
    const onShow = (e: PageTransitionEvent) => {
      const saved = savedLanguage();
      if (e.persisted && saved && saved !== document.documentElement.lang) location.reload();
    };
    addEventListener("pageshow", onShow);
    return () => removeEventListener("pageshow", onShow);
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    try {
      await switchLanguage(next);
    } catch {
      (form.elements.namedItem("path") as HTMLInputElement).value = location.pathname;
      form.submit();
    }
  }

  return (
    <form method="post" action="/api/language" onSubmit={submit} className={className}>
      <input type="hidden" name="to" value={next} />
      <input type="hidden" name="path" value="" />
      <button
        type="submit"
        disabled={busy}
        className="inline-flex min-h-[2.75rem] items-center gap-2 rounded-lg border border-line px-2.5 font-bold min-[375px]:px-3 transition hover:border-navy hover:bg-mist disabled:opacity-60 sm:px-4"
      >
        <Languages aria-hidden="true" className="hidden h-[1.125rem] w-[1.125rem] text-accent-ink min-[400px]:block" />
        <span className="sr-only">{t("switchLanguage")}: </span>
        <span lang={next} className={next === "ar" ? "font-arabic" : undefined}>{languageNames[next]}</span>
      </button>
    </form>
  );
}
