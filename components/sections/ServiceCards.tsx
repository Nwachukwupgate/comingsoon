import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import SiteLink from "@/components/ui/SiteLink";
import { services, servicePath } from "@/content/services";

const icons = { project: "hardhat", logistics: "truck", realEstate: "building", sourcing: "package" };

export default function ServiceCards() {
  const t = useTranslations("services");
  const h = useTranslations("home.services");
  const c = useTranslations("common");
  return (
    <section id="services" className="section bg-mist-blue">
      <div className="wrap">
        <SectionHead title={h("title")} lead={h("lead")} />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2">
          {services.map(({ key, image }, i) => (
            <li key={key} data-reveal={i % 2}>
              <SiteLink
                href={servicePath(key)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-shadow duration-300 hover:shadow-[0_28px_60px_-20px_rgb(4_23_51/0.35)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-mist">
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1248px) 590px, (min-width: 640px) 48vw, 92vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <Icon name={icons[key]} />
                    <h3 className="text-2xl">{t(`${key}.name`)}</h3>
                  </div>
                  <p className="mt-3 text-muted">{t(`${key}.line`)}</p>
                  <span className="mt-auto flex items-center gap-2 pt-6 font-bold">
                    {c("learnMore")}
                    <ArrowRight aria-hidden="true" className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1 rtl:-scale-x-100" />
                  </span>
                </div>
              </SiteLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
