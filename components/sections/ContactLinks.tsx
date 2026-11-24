import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/href";
import type { PageKey } from "@/lib/pages";

export default function ContactLinks({ page, address = false }: { page: PageKey; address?: boolean }) {
  const t = useTranslations("common");
  const w = useTranslations("whatsapp");
  const row = "flex items-start gap-4 py-4";
  const icon = "mt-1 h-6 w-6 shrink-0 text-accent-ink";
  const link = "font-bold underline decoration-navy/25 underline-offset-4 transition hover:decoration-accent";
  return (
    <ul className="divide-y divide-navy/15 border-y border-navy/15 text-lg">
      <li className={row}>
        <Phone aria-hidden="true" className={icon} />
        <div>
          <span className="block text-base text-muted">{t("phone")}</span>
          {site.phones.map(({ display, tel }) => (
            <a key={tel} href={`tel:${tel}`} className={`${link} block w-fit py-1`}><bdi dir="ltr">{display}</bdi></a>
          ))}
        </div>
      </li>
      <li className={row}>
        <WhatsAppIcon className={icon} />
        <div>
          <span className="block text-base text-muted">{t("whatsapp")}</span>
          <a href={whatsappHref(site.whatsapp, w(page))} target="_blank" rel="noopener noreferrer" className={`${link} inline-block py-1`}>
            <bdi dir="ltr">{site.phones[0].display}</bdi>
            <span className="sr-only"> ({t("opensNewTab")})</span>
          </a>
        </div>
      </li>
      <li className={row}>
        <Mail aria-hidden="true" className={icon} />
        <div>
          <span className="block text-base text-muted">{t("email")}</span>
          <a href={`mailto:${site.email}`} className={`${link} inline-block py-1`}>{site.email}</a>
        </div>
      </li>
      {address && (
        <li className={row}>
          <MapPin aria-hidden="true" className={icon} />
          <div>
            <span className="block text-base text-muted">{t("office")}</span>
            <address className="py-1 font-bold not-italic">
              {site.address.line1}
              <br />
              {site.address.line2}
            </address>
          </div>
        </li>
      )}
    </ul>
  );
}
