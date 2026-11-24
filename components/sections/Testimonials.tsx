import { useTranslations } from "next-intl";
import { testimonials } from "@/content/testimonials";
import TestimonialCard from "./TestimonialCard";

/** TODO: the owner must supply real testimonials (content/testimonials.ts).
    Renders nothing until then. */
export default function Testimonials() {
  const t = useTranslations("testimonials");
  if (!testimonials.length) return null;
  return (
    <section className="section bg-white">
      <div className="wrap">
        <h2 className="h-section">{t("title")}</h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={`${item.name}-${item.quote.slice(0, 12)}`} data-reveal>
              <TestimonialCard item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
