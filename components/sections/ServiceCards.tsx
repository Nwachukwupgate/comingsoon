import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Icon from "@/components/ui/Icon";
import SectionHead from "@/components/ui/SectionHead";
import SiteLink from "@/components/ui/SiteLink";
import { services, servicePath } from "@/content/services";

const icons = { project: "hardhat", logistics: "truck", realEstate: "building", sourcing: "package" };

export default function ServiceCards() {
  const h = useTranslations("home.services");
  return (
    <section id="services" className="section bg-mist-blue">
      <div className="wrap">
        <SectionHead title={h("title")} lead={h("lead")} />
        <PhoneCards />
        <GridCards />
      </div>
    </section>
  );
}

/* Phones: tall cards that slide up and stack over each other. Pure CSS, see
   .stack-card in globals.css. Two tones alternate so each card stands apart. */
function PhoneCards() {
  const t = useTranslations("services");
  const c = useTranslations("common");
  return (
    <ul className="-mx-2 mt-10 sm:hidden">
      {services.map(({ key, cutout }, i) => {
        const dark = i % 2 === 0;
        return (
          <li key={key} className="stack-card" style={{ "--i": i } as React.CSSProperties}>
            <SiteLink
              href={servicePath(key)}
              className={`stack-face relative flex flex-col overflow-hidden rounded-[1.75rem] ${
                dark
                  ? "on-dark bg-[radial-gradient(110%_60%_at_62%_30%,#1D5CA8_0%,#0B356B_45%,#062450_75%,#041733_100%)] text-white"
                  : "bg-[radial-gradient(110%_60%_at_60%_30%,#FFFFFF_0%,#EAF1FB_55%,#CFDDF1_100%)] text-navy"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute start-5 top-5 z-10 grid h-14 w-14 place-items-center rounded-2xl ${
                  dark ? "bg-white/10 ring-1 ring-white/25" : "bg-white ring-1 ring-navy/10"
                }`}
              >
                <Icon name={icons[key]} className="h-7 w-7" />
              </span>
              <div className="relative min-h-0 flex-1">
                {/* The service's line continues behind the model, like a route. */}
                <svg viewBox="0 0 360 300" aria-hidden="true" preserveAspectRatio="none" className="absolute inset-0 h-full w-full rtl:-scale-x-100">
                  <path
                    d="M-10 236C70 250 120 214 180 150S300 40 372 34"
                    fill="none"
                    className="stroke-accent"
                    strokeWidth="2"
                    strokeOpacity={dark ? 0.8 : 0.65}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <Image
                  src={cutout}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 100vw, 1px"
                  className="stack-model object-contain object-bottom px-1 pt-4"
                />
              </div>
              <div className="relative flex flex-col px-6 pb-6 pt-4">
                <h3 className="text-[clamp(1.75rem,8.2vw,2.15rem)] leading-[1.06]">{t(`${key}.name`)}</h3>
                <p className={`mt-3 text-[1.0625rem] leading-relaxed ${dark ? "text-white/80" : "text-muted"}`}>
                  {t(`${key}.line`)}
                </p>
                <span
                  className={`mt-5 flex min-h-[3.5rem] items-center justify-between rounded-2xl ps-5 pe-2 text-lg font-bold ${
                    dark ? "bg-white text-navy" : "bg-navy text-white"
                  }`}
                >
                  {c("learnMore")}
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-navy-deep">
                    <ArrowRight aria-hidden="true" className="h-5 w-5 rtl:-scale-x-100" />
                  </span>
                </span>
              </div>
            </SiteLink>
          </li>
        );
      })}
    </ul>
  );
}

function GridCards() {
  const t = useTranslations("services");
  const c = useTranslations("common");
  return (
    <ul className="mt-14 hidden gap-6 sm:grid sm:grid-cols-2">
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
                sizes="(min-width: 1248px) 590px, (min-width: 640px) 48vw, 1px"
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
  );
}
