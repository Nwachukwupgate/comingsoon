import { useTranslations } from "next-intl";
import SiteLink from "@/components/ui/SiteLink";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="bg-mist">
      <div className="wrap flex min-h-[80svh] flex-col justify-center pb-20 pt-[calc(var(--header)+3rem)]">
        {/* A bridge with its middle span missing. */}
        <svg viewBox="0 0 640 120" aria-hidden="true" className="mb-10 w-full max-w-2xl">
          <g fill="none" strokeWidth="5">
            <path d="M0 84H236M404 84H640" className="stroke-navy" />
            <path d="M120 12V116M520 12V116" className="stroke-navy" strokeWidth="9" />
            <path d="M120 14C138 58 176 78 236 82M520 14C502 58 464 78 404 82" className="stroke-accent" />
            <path d="M248 84H392" className="stroke-navy" strokeDasharray="3 14" strokeLinecap="round" />
          </g>
        </svg>
        <h1 className="h-display max-w-3xl">{t("title")}</h1>
        <p className="lead mt-5">{t("body")}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <SiteLink href="/" className="btn btn-primary">{t("home")}</SiteLink>
          <SiteLink href="/contact" className="btn btn-line">{t("contact")}</SiteLink>
        </div>
      </div>
    </section>
  );
}
