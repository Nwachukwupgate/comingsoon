import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";

export default function WhoWeServe() {
  const t = useTranslations("serve");
  const clients = t.raw("clients") as string[];
  const industries = t.raw("industries") as { icon: string; name: string }[];
  return (
    <section className="section bg-mist-blue">
      <div className="wrap">
        <SectionHead title={t("title")} lead={t("lead")} />
        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <h3 className="text-lg text-muted">{t("clientsTitle")}</h3>
            <ul className="mt-4 text-[clamp(1.75rem,1.2rem+2vw,2.75rem)] font-extrabold leading-[1.25] tracking-[-0.03em]">
              {clients.map((name, i) => (
                <li key={name} data-reveal={i}>{name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg text-muted">{t("industriesTitle")}</h3>
            <ul className="mt-4 divide-y divide-navy/15 border-y border-navy/15">
              {industries.map((item, i) => (
                <li key={item.name} data-reveal={i} className="flex items-center gap-5 py-5 text-lg font-bold">
                  <Icon name={item.icon} />
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
