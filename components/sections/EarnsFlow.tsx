import { useTranslations } from "next-intl";

export default function EarnsFlow() {
  const t = useTranslations("logistics.earns");
  const chain = t.raw("chain") as string[];
  const parts = [
    ...chain.map((label, i) => ({ label, op: i ? "→" : "", word: i ? t("then") : "" })),
    { label: t("minus"), op: t("less"), word: "" },
    { label: t("equals"), op: t("is"), word: "" },
  ];
  return (
    <ol className="grid gap-x-3 lg:grid-cols-5 lg:gap-x-16">
      {parts.map((p, i) => {
        const last = i === parts.length - 1;
        return (
          <li key={p.label} data-reveal={i} className="relative flex flex-col items-stretch">
            {p.op && (
              <span className="grid h-12 place-items-center font-extrabold text-accent-ink lg:absolute lg:-start-16 lg:top-0 lg:h-full lg:w-16">
                {p.word ? (
                  <>
                    <span aria-hidden="true" className="rotate-90 text-2xl lg:rotate-0 rtl:lg:rotate-180">{p.op}</span>
                    <span className="sr-only">{p.word}</span>
                  </>
                ) : (
                  p.op
                )}
              </span>
            )}
            <span
              className={`grid min-h-[6rem] flex-1 place-items-center rounded-xl px-4 py-5 text-center text-lg font-extrabold leading-snug tracking-[-0.02em] ${
                last ? "bg-navy text-white" : i === parts.length - 2 ? "border-2 border-navy/40" : "bg-white"
              }`}
            >
              {p.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
