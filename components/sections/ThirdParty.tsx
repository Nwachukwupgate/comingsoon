import { useTranslations } from "next-intl";
import SectionHead from "@/components/ui/SectionHead";
import FeatureGrid, { type Feature } from "./FeatureGrid";

export default function ThirdParty({ className = "bg-mist-blue" }: { className?: string }) {
  const t = useTranslations("thirdParty");
  return (
    <section className={`section ${className}`}>
      <div className="wrap">
        <SectionHead title={t("title")} lead={t("lead")} />
        <div className="mt-12">
          <FeatureGrid items={t.raw("items") as Feature[]} cols={3} />
        </div>
      </div>
    </section>
  );
}
