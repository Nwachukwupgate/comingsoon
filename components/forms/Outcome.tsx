"use client";

import { CircleCheck, TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RefObject } from "react";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/href";

export function Sent({ focusRef, onAgain }: { focusRef: RefObject<HTMLDivElement | null>; onAgain: () => void }) {
  const t = useTranslations("form.success");
  return (
    <div ref={focusRef} tabIndex={-1} role="status" className="py-6 outline-none">
      <CircleCheck aria-hidden="true" className="h-12 w-12 text-[#12805C]" strokeWidth={1.6} />
      <h3 className="mt-5 text-2xl">{t("title")}</h3>
      <p className="mt-3 text-lg text-muted">{t("body")}</p>
      <button type="button" onClick={onAgain} className="btn btn-line mt-8">{t("again")}</button>
    </div>
  );
}

export function Failed({ focusRef }: { focusRef: RefObject<HTMLDivElement | null> }) {
  const t = useTranslations("form.failure");
  const c = useTranslations("common");
  return (
    <div ref={focusRef} tabIndex={-1} role="alert" className="rounded-xl border border-[#B42318] bg-[#FEF3F2] p-5 outline-none">
      <p className="flex items-center gap-2 font-bold text-[#B42318]">
        <TriangleAlert aria-hidden="true" className="h-5 w-5 shrink-0" />
        {t("title")}
      </p>
      <p className="mt-1">{t("body")}</p>
      <p className="mt-3 flex flex-wrap gap-x-6 gap-y-2 font-bold">
        <a href={whatsappHref(site.whatsapp, "")} target="_blank" rel="noopener noreferrer" className="text-link">
          <WhatsAppIcon /> {c("whatsapp")}
        </a>
        <a href={`mailto:${site.email}`} className="text-link">{site.email}</a>
      </p>
    </div>
  );
}
