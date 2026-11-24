import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

/** Required on both investment pages. Do not remove or hide. */
export default function Disclaimer({ text, className = "" }: { text: string; className?: string }) {
  const c = useTranslations("common");
  return (
    <aside
      aria-label={c("disclaimer")}
      className={`flex gap-4 rounded-xl border-2 border-accent bg-white p-6 text-navy sm:p-7 ${className}`}
    >
      <Info aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-accent-ink" />
      <p className="text-lg font-semibold leading-relaxed">{text}</p>
    </aside>
  );
}
