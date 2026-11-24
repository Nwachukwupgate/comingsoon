import type { Testimonial } from "@/content/testimonials";

export default function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-8 text-navy">
      <blockquote className="text-lg leading-relaxed">{item.quote}</blockquote>
      <figcaption className="mt-auto pt-6">
        <span className="block font-bold">{item.name}</span>
        <span className="text-muted">{[item.role, item.company].filter(Boolean).join(", ")}</span>
      </figcaption>
    </figure>
  );
}
