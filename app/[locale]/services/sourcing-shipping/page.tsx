import { getTranslations } from "next-intl/server";
import SourcingForm from "@/components/forms/SourcingForm";
import CTABand from "@/components/sections/CTABand";
import FeatureGrid, { type Feature } from "@/components/sections/FeatureGrid";
import FormSection from "@/components/sections/FormSection";
import PageHero from "@/components/sections/PageHero";
import ProcessTimeline, { type Step } from "@/components/sections/ProcessTimeline";
import SectionHead from "@/components/ui/SectionHead";
import { metadataFor, pageLocale, type PageProps } from "@/lib/page";

export const generateMetadata = metadataFor("sourcing");

export default async function SourcingShippingPage({ params }: PageProps) {
  await pageLocale(params);
  const t = await getTranslations("sourcing");
  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} image="/images/container-port.webp" alt={t("imageAlt")}>
        <a href="#enquiry" className="btn btn-primary">{t("form.title")}</a>
      </PageHero>
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead title={t("what.title")} />
          <div className="mt-12">
            <FeatureGrid items={t.raw("what.items") as Feature[]} cols={3} />
          </div>
        </div>
      </section>
      <ProcessTimeline
        title={t("process.title")}
        lead={t("process.lead")}
        steps={t.raw("process.steps") as Step[]}
        layout="row"
        className="bg-mist-blue"
      />
      <FormSection title={t("form.title")} body={t("form.body")} page="sourcing" className="bg-mist">
        <SourcingForm />
      </FormSection>
      <CTABand title={t("cta.title")} body={t("cta.body")} page="sourcing" service="sourcing" />
    </>
  );
}
