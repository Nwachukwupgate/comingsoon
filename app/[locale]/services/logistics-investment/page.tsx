import { getTranslations } from "next-intl/server";
import EnquiryForm from "@/components/forms/EnquiryForm";
import CTABand from "@/components/sections/CTABand";
import Disclaimer from "@/components/sections/Disclaimer";
import EarnsFlow from "@/components/sections/EarnsFlow";
import FeatureGrid, { type Feature } from "@/components/sections/FeatureGrid";
import FormSection from "@/components/sections/FormSection";
import PageHero from "@/components/sections/PageHero";
import ProcessTimeline, { type Step } from "@/components/sections/ProcessTimeline";
import ScrollStory3D from "@/components/sections/ScrollStory3D";
import TestimonialCard from "@/components/sections/TestimonialCard";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import { testimonials } from "@/content/testimonials";
import { suppliedModel } from "@/lib/models";
import { metadataFor, pageLocale, type PageProps } from "@/lib/page";

export const generateMetadata = metadataFor("logistics");

export default async function LogisticsInvestmentPage({ params }: PageProps) {
  await pageLocale(params);
  const t = await getTranslations("logistics");
  const c = await getTranslations("common");
  const testimonial = testimonials.find((x) => x.service === "logistics");
  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} image="/images/truck-fleet.webp" alt={t("imageAlt")}>
        <a href="#enquiry" className="btn btn-primary">{c("makeEnquiry")}</a>
      </PageHero>
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead title={t("keyTitle")} />
          <div className="mt-12">
            <FeatureGrid items={t.raw("keyPoints") as Feature[]} cols={4} />
          </div>
          <div data-reveal className="mt-6 flex flex-col gap-6 rounded-2xl bg-mist-blue p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-12">
            <Icon name="key" className="h-14 w-14" />
            <div>
              <h2 className="h-section">{t("ownership.title")}</h2>
              <p className="lead mt-3 max-w-2xl">{t("ownership.body")}</p>
            </div>
          </div>
        </div>
      </section>
      <ScrollStory3D
        scene="truck"
        title={t("story.title")}
        lead={t("story.lead")}
        points={t.raw("story.points") as string[]}
        image="/images/story-truck.webp"
        imageAlt={t("story.modelAlt")}
        modelUrl={suppliedModel("truck")}
        closing={testimonial ? <TestimonialCard item={testimonial} /> : <Disclaimer text={t("disclaimer")} />}
      />
      <ProcessTimeline title={t("process.title")} lead={t("process.lead")} steps={t.raw("process.steps") as Step[]} />
      <section className="section bg-mist-blue">
        <div className="wrap">
          <SectionHead title={t("portfolio.title")} lead={t("portfolio.lead")} />
          <div className="mt-12">
            <FeatureGrid items={t.raw("portfolio.items") as Feature[]} cols={3} />
          </div>
        </div>
      </section>
      <section className="section bg-mist">
        <div className="wrap">
          <SectionHead title={t("earns.title")} lead={t("earns.lead")} />
          <div className="mt-12">
            <EarnsFlow />
          </div>
          <Disclaimer text={t("disclaimer")} className="mt-12" />
        </div>
      </section>
      <FormSection title={t("form.title")} body={t("form.body")} page="logistics" className="bg-mist-blue">
        <EnquiryForm service="logistics" />
      </FormSection>
      <CTABand title={t("cta.title")} body={t("cta.body")} page="logistics" service="logistics" />
    </>
  );
}
