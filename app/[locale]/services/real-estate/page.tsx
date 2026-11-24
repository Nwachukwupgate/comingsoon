import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";
import EnquiryForm from "@/components/forms/EnquiryForm";
import CTABand from "@/components/sections/CTABand";
import Disclaimer from "@/components/sections/Disclaimer";
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

export const generateMetadata = metadataFor("realEstate");

type Option = { title: string; text: string; checksTitle: string; checks: string[] };

export default async function RealEstatePage({ params }: PageProps) {
  await pageLocale(params);
  const t = await getTranslations("realEstate");
  const c = await getTranslations("common");
  const testimonial = testimonials.find((x) => x.service === "realEstate");
  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} image="/images/residential-towers.webp" alt={t("imageAlt")}>
        <a href="#enquiry" className="btn btn-primary">{c("makeEnquiry")}</a>
      </PageHero>
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead title={t("compare.title")} lead={t("compare.lead")} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {(t.raw("compare.options") as Option[]).map((o, i) => (
              <div
                key={o.title}
                data-reveal={i}
                className={`rounded-2xl p-8 sm:p-10 ${i ? "border-2 border-navy" : "on-dark border-2 border-navy bg-navy text-white"}`}
              >
                <h3 className="text-3xl">{o.title}</h3>
                <p className={`mt-4 text-lg ${i ? "text-muted" : "text-white/80"}`}>{o.text}</p>
                <p className="mt-8 font-bold">{o.checksTitle}</p>
                <ul className={`mt-3 divide-y ${i ? "divide-line" : "divide-white/20"}`}>
                  {o.checks.map((x) => (
                    <li key={x} className="flex items-center gap-3 py-3 text-lg">
                      <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" strokeWidth={2.5} />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-mist-blue">
        <div className="wrap">
          <SectionHead title={t("checks.title")} />
          <div className="mt-12">
            <FeatureGrid items={t.raw("checks.items") as Feature[]} cols={4} />
          </div>
          <div data-reveal className="mt-6 flex flex-col gap-2 rounded-2xl bg-white p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
            <Icon name="key" className="h-12 w-12" />
            <div>
              <h3 className="text-2xl">{t("checks.keysTitle")}</h3>
              <p className="mt-1 text-lg text-muted">{t("checks.keysText")}</p>
            </div>
          </div>
        </div>
      </section>
      <ScrollStory3D
        scene="building"
        title={t("story.title")}
        lead={t("story.lead")}
        points={t.raw("story.points") as string[]}
        image="/images/story-building.webp"
        imageAlt={t("story.modelAlt")}
        modelUrl={suppliedModel("building")}
        closing={testimonial ? <TestimonialCard item={testimonial} /> : <Disclaimer text={t("disclaimer")} />}
      />
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead title={t("management.title")} lead={t("management.lead")} />
          <div className="mt-12">
            <FeatureGrid items={t.raw("management.items") as Feature[]} cols={3} />
          </div>
        </div>
      </section>
      <ProcessTimeline
        title={t("journey.title")}
        lead={t("journey.lead")}
        steps={t.raw("journey.steps") as Step[]}
        layout="row"
        className="bg-mist-blue !pb-12"
      />
      <div className="bg-mist-blue pb-20 sm:pb-28">
        <div className="wrap">
          <Disclaimer text={t("disclaimer")} />
        </div>
      </div>
      <FormSection title={t("form.title")} body={t("form.body")} page="realEstate" className="bg-mist">
        <EnquiryForm service="realEstate" />
      </FormSection>
      <CTABand title={t("cta.title")} body={t("cta.body")} page="realEstate" service="realEstate" />
    </>
  );
}
