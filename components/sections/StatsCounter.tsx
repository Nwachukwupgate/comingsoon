import { useTranslations } from "next-intl";
import CountUp from "@/components/ui/CountUp";
import { stats } from "@/content/stats";

/** Shows only stats with a confirmed value (content/stats.ts). */
export default function StatsCounter() {
  const t = useTranslations("stats");
  const shown = stats.filter((s) => s.value !== null);
  if (!shown.length) return null;
  return (
    <section className="section bg-white">
      <div className={`wrap grid items-center gap-10 ${shown.length === 1 ? "lg:grid-cols-[auto_1fr] lg:gap-20" : ""}`}>
        <dl className="flex flex-wrap gap-x-16 gap-y-8">
          {shown.map((s) => (
            <div key={s.key} className="flex flex-col-reverse">
              <dt className="mt-3 text-lg font-bold text-muted">{t(`labels.${s.key}`)}</dt>
              <dd className="text-[clamp(5.5rem,14vw,11rem)] font-extrabold leading-[0.85] tracking-[-0.06em] tabular-nums">
                <CountUp value={s.value!} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <div data-reveal className="max-w-xl border-s-4 border-accent ps-7">
          <h2 className="h-section">{t("title")}</h2>
          <p className="lead mt-4">{t("lead")}</p>
        </div>
      </div>
    </section>
  );
}
