import { useTranslations } from "next-intl";
import SiteLink from "@/components/ui/SiteLink";
import WhatsAppIcon from "@/components/layout/WhatsAppIcon";
import { site } from "@/content/site";
import { whatsappHref } from "@/lib/href";
import type { PageKey } from "@/lib/pages";
import type { ServiceKey } from "@/content/services";

type Props = { title: string; body: string; page: PageKey; service?: ServiceKey };

/** Call to action before the footer. The line drawing is a suspension bridge. */
export default function CTABand({ title, body, page, service }: Props) {
  const t = useTranslations("cta");
  const w = useTranslations("whatsapp");
  const c = useTranslations("common");
  return (
    <section className="on-dark relative overflow-hidden bg-navy text-white">
      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      >
        <g fill="none" vectorEffect="non-scaling-stroke">
          <path d="M0 262H1200" stroke="#fff" strokeOpacity=".16" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d="M-220 40C-80 250 40 262 180 262S500 250 640 40C780 250 900 262 1300 262" stroke="#fff" strokeOpacity=".14" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d="M640 40V300" className="stroke-accent" strokeOpacity=".7" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <div className="wrap relative grid items-end gap-10 py-20 sm:py-24 lg:grid-cols-[1.3fr_1fr]">
        <div data-reveal>
          <h2 className="h-section max-w-xl">{title}</h2>
          <p className="lead mt-5 max-w-xl">{body}</p>
        </div>
        <div data-reveal={1} className="flex flex-wrap gap-3 lg:justify-end">
          <SiteLink href={service ? `/contact?service=${service}` : "/contact"} className="btn btn-primary">
            {t("enquire")}
          </SiteLink>
          <a
            href={whatsappHref(site.whatsapp, w(page))}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-line !bg-navy hover:!bg-navy-soft"
          >
            <WhatsAppIcon />
            {t("whatsapp")}
            <span className="sr-only"> ({c("opensNewTab")})</span>
          </a>
        </div>
      </div>
    </section>
  );
}
