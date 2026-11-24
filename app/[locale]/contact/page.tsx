import { getTranslations } from "next-intl/server";
import EnquiryForm from "@/components/forms/EnquiryForm";
import ContactLinks from "@/components/sections/ContactLinks";
import CTABand from "@/components/sections/CTABand";
import OfficeMap from "@/components/sections/OfficeMap";
import { metadataFor, pageLocale, type PageProps } from "@/lib/page";

export const generateMetadata = metadataFor("contact");

export default async function ContactPage({ params }: PageProps) {
  await pageLocale(params);
  const t = await getTranslations("contact");
  const a = await getTranslations("about");
  return (
    <>
      <section className="bg-mist pb-20 pt-[calc(var(--header)+3rem)] sm:pb-28 sm:pt-[calc(var(--header)+4.5rem)]">
        <div className="wrap">
          <h1 className="h-display">{t("title")}</h1>
          <p className="lead mt-5 max-w-xl">{t("lead")}</p>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <div id="enquiry" className="rounded-2xl bg-white p-6 sm:p-10">
              <h2 className="mb-6 text-3xl">{t("formTitle")}</h2>
              <EnquiryForm />
            </div>
            <div>
              <h2 className="mb-6 text-2xl">{t("directTitle")}</h2>
              <ContactLinks page="contact" address />
            </div>
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="wrap">
          <h2 className="h-section mb-10">{a("office.title")}</h2>
          <OfficeMap />
        </div>
      </section>
      <CTABand title={a("cta.title")} body={a("cta.body")} page="contact" />
    </>
  );
}
