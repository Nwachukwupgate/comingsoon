import { getTranslations } from "next-intl/server";
import ContactLinks from "@/components/sections/ContactLinks";
import CTABand from "@/components/sections/CTABand";
import OfficeMap from "@/components/sections/OfficeMap";
import PageHero from "@/components/sections/PageHero";
import Themes from "@/components/sections/Themes";
import ThirdParty from "@/components/sections/ThirdParty";
import WhoWeServe from "@/components/sections/WhoWeServe";
import CountUp from "@/components/ui/CountUp";
import SiteLink from "@/components/ui/SiteLink";
import { stats } from "@/content/stats";
import { metadataFor, pageLocale, type PageProps } from "@/lib/page";

export const generateMetadata = metadataFor("about");

export default async function AboutPage({ params }: PageProps) {
  await pageLocale(params);
  const t = await getTranslations("about");
  const c = await getTranslations("common");
  const years = stats.find((s) => s.key === "years");
  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} image="/images/dubai-skyline.webp" alt={t("imageAlt")}>
        <SiteLink href="/contact" className="btn btn-primary">{c("talkToUs")}</SiteLink>
      </PageHero>
      <section className="section bg-white">
        <div className="wrap grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          <div data-reveal>
            <h2 className="h-section">{t("story.title")}</h2>
            {(t.raw("story.body") as string[]).map((p) => (
              <p key={p} className="lead mt-6">{p}</p>
            ))}
          </div>
          {years?.value != null && (
            <dl className="flex flex-col-reverse justify-end border-s-4 border-accent ps-8 lg:self-center">
              <dt className="mt-3 text-lg font-bold text-muted">{t("story.yearsLabel")}</dt>
              <dd className="text-[clamp(5rem,11vw,9rem)] font-extrabold leading-[0.85] tracking-[-0.06em]">
                <CountUp value={years.value} suffix={years.suffix} />
              </dd>
            </dl>
          )}
        </div>
      </section>
      <section className="section bg-mist">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-20">
          <h2 data-reveal className="h-section">{t("themesTitle")}</h2>
          <Themes />
        </div>
      </section>
      <WhoWeServe />
      <ThirdParty className="bg-white" />
      <section className="section bg-mist">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="h-section">{t("office.title")}</h2>
              <p className="lead mt-5">{t("office.body")}</p>
            </div>
            <ContactLinks page="about" address />
          </div>
          <div className="mt-12">
            <OfficeMap />
          </div>
        </div>
      </section>
      <CTABand title={t("cta.title")} body={t("cta.body")} page="about" />
    </>
  );
}
