import { Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Logo from "@/components/ui/Logo";
import SiteLink from "@/components/ui/SiteLink";
import { services, servicePath } from "@/content/services";
import { site } from "@/content/site";

export default function Footer() {
  const t = useTranslations("footer");
  const n = useTranslations("nav");
  const s = useTranslations("services");
  const c = useTranslations("common");
  const a = "inline-block py-1.5 text-white/80 transition hover:text-white hover:underline underline-offset-4";
  const row = "flex items-start gap-3";
  const icon = "mt-2 h-5 w-5 shrink-0 text-accent";

  return (
    <footer className="on-dark bg-navy-deep text-white">
      <div className="wrap grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.2fr_0.8fr_1.6fr]">
        <div>
          <Logo layout="stacked" light className="h-36" />
          <p className="mt-5 max-w-[16rem] text-white/75">{t("tagline")}</p>
        </div>
        <nav aria-label={t("services")}>
          <h2 className="mb-3 text-base tracking-normal">{t("services")}</h2>
          <ul>
            {services.map(({ key }) => (
              <li key={key}>
                <SiteLink href={servicePath(key)} className={a}>
                  {s(`${key}.name`)}
                </SiteLink>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label={t("company")}>
          <h2 className="mb-3 text-base tracking-normal">{t("company")}</h2>
          <ul>
            <li><SiteLink href="/about" className={a}>{n("about")}</SiteLink></li>
            <li><SiteLink href="/contact" className={a}>{n("contact")}</SiteLink></li>
            {site.social.map(({ name, url }) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" className={a}>
                  {name}
                  <span className="sr-only"> ({c("opensNewTab")})</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 text-base tracking-normal">{t("contact")}</h2>
          <ul>
            {site.phones.map(({ display, tel }) => (
              <li key={tel} className={row}>
                <Phone aria-hidden="true" className={icon} />
                <a href={`tel:${tel}`} className={a}><bdi dir="ltr">{display}</bdi></a>
              </li>
            ))}
            <li className={row}>
              <Mail aria-hidden="true" className={icon} />
              <a href={`mailto:${site.email}`} className={a}>{site.email}</a>
            </li>
            <li className={row}>
              <MapPin aria-hidden="true" className={icon} />
              <address className="py-1.5 not-italic text-white/80">
                {site.address.line1}
                <br />
                {site.address.line2}
              </address>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="wrap flex flex-col gap-2 py-6 pe-24 text-sm text-white/70 sm:flex-row sm:justify-between">
          <p>{t("rights", { year: String(new Date().getFullYear()) })}</p>
          {site.credit.name && (
            <p>
              {t("credit")}{" "}
              {site.credit.url ? (
                <a href={site.credit.url} className="underline underline-offset-4">{site.credit.name}</a>
              ) : (
                site.credit.name
              )}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
