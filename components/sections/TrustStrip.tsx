import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import type { Feature } from "./FeatureGrid";

export default function TrustStrip() {
  const t = useTranslations("home.trust");
  const items = t.raw("items") as Feature[];
  return (
    <section className="on-dark section bg-navy text-white">
      <div className="wrap">
        <h2 data-reveal className="h-section">{t("title")}</h2>
        <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item, i) => (
            <li key={item.title} data-reveal={i} className="border-t-2 border-white/20 pt-6">
              <Icon name={item.icon} className="h-8 w-8" />
              <h3 className="mt-5 text-xl">{item.title}</h3>
              <p className="mt-2 text-white/75">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
