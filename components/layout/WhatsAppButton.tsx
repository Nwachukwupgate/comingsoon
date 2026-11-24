"use client";

import { useTranslations } from "next-intl";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/href";
import { usePageKey } from "./usePageKey";
import WhatsAppIcon from "./WhatsAppIcon";

export default function WhatsAppButton() {
  const page = usePageKey();
  const t = useTranslations("whatsapp");
  const c = useTranslations("common");
  return (
    <a
      href={whatsappHref(site.whatsapp, t(page))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${c("floatingWhatsapp")} (${c("opensNewTab")})`}
      className="fixed bottom-4 end-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-navy text-white shadow-[0_8px_24px_rgb(4_23_51/0.28)] ring-2 ring-white transition hover:bg-[#128C4B] sm:bottom-6 sm:end-6"
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
