import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

/** Required on both investment pages. Do not remove or hide. */
export default function Disclaimer({ text, className = "", compact = false }: { text: string; className?: string; compact?: boolean }) {
  const c = useTranslations("common");
  return (
    <aside
      aria-label={c("disclaimer")}
      className={`flex gap-4 rounded-xl border-2 border-accent bg-white text-navy ${compact ? "p-5" : "p-6 sm:p-7"} ${className}`}
    >
      <Info aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0 text-accent-ink" />
      <p className={`font-semibold ${compact ? "leading-relaxed" : "text-lg leading-relaxed"}`}>{text}</p>
    </aside>
  );
}
