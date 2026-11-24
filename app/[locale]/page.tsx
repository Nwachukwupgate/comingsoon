import { getTranslations } from "next-intl/server";
import CTABand from "@/components/sections/CTABand";
import Hero3D from "@/components/sections/Hero3D";
import ServiceCards from "@/components/sections/ServiceCards";
import StatsCounter from "@/components/sections/StatsCounter";
import TestimonialCard from "@/components/sections/TestimonialCard";
import Testimonials from "@/components/sections/Testimonials";
import Themes from "@/components/sections/Themes";
import TrustStrip from "@/components/sections/TrustStrip";
import WhoWeServe from "@/components/sections/WhoWeServe";
import SiteLink from "@/components/ui/SiteLink";
import { testimonials } from "@/content/testimonials";
import { suppliedModel } from "@/lib/models";
import { metadataFor, pageLocale, type PageProps } from "@/lib/page";

export const generateMetadata = metadataFor("home");

export default async function HomePage({ params }: PageProps) {
  await pageLocale(params);
  const t = await getTranslations("home");
  const c = await getTranslations("common");
  const featured = testimonials.find((x) => !x.service);
  return (
    <>
      <Hero3D
        title={t("hero.title")}
        lead={t("hero.lead")}
        secondTitle={t("hero.secondTitle")}
        secondLead={t("hero.secondLead")}
        imageAlt={t("hero.imageAlt")}
        modelUrl={suppliedModel("skyline")}
        closing={featured && <TestimonialCard item={featured} />}
        actions={
          <>
            <a href="#services" className="btn btn-primary">{c("exploreServices")}</a>
            <SiteLink href="/contact" className="btn btn-dark">{c("talkToUs")}</SiteLink>
          </>
        }
      />
      <section className="section bg-white">
        <div className="wrap grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <h2 className="h-section">{t("about.title")}</h2>
            <p className="lead mt-6">{t("about.body")}</p>
            <SiteLink href="/about" className="text-link mt-8">{t("about.link")}</SiteLink>
          </div>
          <Themes />
        </div>
      </section>
      <ServiceCards />
      <TrustStrip />
      <StatsCounter />
      <WhoWeServe />
      <Testimonials />
      <CTABand title={t("cta.title")} body={t("cta.body")} page="home" />
    </>
  );
}
