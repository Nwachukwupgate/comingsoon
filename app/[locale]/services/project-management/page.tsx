import { getTranslations } from "next-intl/server";
import CTABand from "@/components/sections/CTABand";
import Ecosystem from "@/components/sections/Ecosystem";
import FeatureGrid, { type Feature } from "@/components/sections/FeatureGrid";
import PageHero from "@/components/sections/PageHero";
import ProcessTimeline, { type Step } from "@/components/sections/ProcessTimeline";
import ThirdParty from "@/components/sections/ThirdParty";
import SectionHead from "@/components/ui/SectionHead";
import SiteLink from "@/components/ui/SiteLink";
import { metadataFor, pageLocale, type PageProps } from "@/lib/page";

export const generateMetadata = metadataFor("project");

export default async function ProjectManagementPage({ params }: PageProps) {
  await pageLocale(params);
  const t = await getTranslations("project");
  const c = await getTranslations("common");
  return (
    <>
      <PageHero title={t("title")} lead={t("lead")} image="/images/construction-site.webp" alt={t("imageAlt")}>
        <SiteLink href="/contact?service=project" className="btn btn-primary">{c("makeEnquiry")}</SiteLink>
      </PageHero>
      <section className="section bg-white">
        <div className="wrap">
          <SectionHead title={t("subTitle")} />
          <div className="mt-12">
            <FeatureGrid items={t.raw("sub") as Feature[]} cols={2} />
          </div>
        </div>
      </section>
      <Ecosystem
        title={t("ecosystem.title")}
        lead={t("ecosystem.lead")}
        centre={t("ecosystem.centre")}
        centreSub={t("ecosystem.centreSub")}
        nodes={t.raw("ecosystem.nodes") as Required<Feature>[]}
      />
      <ProcessTimeline title={t("process.title")} lead={t("process.lead")} steps={t.raw("process.steps") as Step[]} />
      <ThirdParty />
      <CTABand title={t("cta.title")} body={t("cta.body")} page="project" service="project" />
    </>
  );
}
