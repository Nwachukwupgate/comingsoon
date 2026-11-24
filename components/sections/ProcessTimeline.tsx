"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/lib/useScrollProgress";

export type Step = { title: string; text?: string };
type Props = { title: string; lead?: string; steps: Step[]; layout?: "rail" | "row"; className?: string };

/* The line is drawn by default (--p: 1) so the timeline is complete without
   JavaScript. Scrolling then drives --p and lights each marker as it passes. */
function draw(p: number, el: HTMLElement) {
  el.style.setProperty("--p", String(p));
  // End the line at the last marker, whatever the height of the last step.
  el.style.setProperty("--end", `${Math.max((el.lastElementChild as HTMLElement).offsetHeight - 24, 0)}px`);
  const marks = el.querySelectorAll<HTMLElement>("[data-mark]");
  marks.forEach((m, i) => {
    m.dataset.mark = p >= (i + 0.15) / marks.length ? "on" : "off";
  });
}

const mark =
  "relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 text-lg font-extrabold transition-colors duration-500 data-[mark=on]:border-accent data-[mark=on]:bg-accent data-[mark=on]:text-navy-deep data-[mark=off]:border-navy/30 data-[mark=off]:bg-white data-[mark=off]:text-navy";

export default function ProcessTimeline({ title, lead, steps, layout = "rail", className = "bg-white" }: Props) {
  const ref = useRef<HTMLOListElement>(null);
  useScrollProgress(ref, draw);

  if (layout === "row") {
    return (
      <section className={`section ${className}`}>
        <div className="wrap">
          <div className="max-w-2xl">
            <h2 className="h-section">{title}</h2>
            {lead && <p className="lead mt-5">{lead}</p>}
          </div>
          <ol
            ref={ref}
            style={{ "--n": steps.length } as React.CSSProperties}
            className="relative mt-14 grid gap-8 [--p:1] lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-6"
          >
            <span aria-hidden="true" className="absolute bottom-[var(--end,1.5rem)] start-[1.4375rem] top-6 w-0.5 bg-navy/15 lg:bottom-auto lg:end-[calc(100%/var(--n)-3rem)] lg:start-6 lg:top-[1.4375rem] lg:h-0.5 lg:w-auto">
              <span className="block h-full w-full origin-top bg-accent [transform:scaleY(var(--p))] lg:origin-left lg:[transform:scaleX(var(--p))] rtl:lg:origin-right" />
            </span>
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-5 lg:flex-col">
                <span data-mark="on" aria-hidden="true" className={mark}>{i + 1}</span>
                <div className="pt-2 lg:pe-4 lg:pt-1">
                  <h3 className="text-xl">{s.title}</h3>
                  {s.text && <p className="mt-2 text-muted">{s.text}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  return (
    <section className={`section ${className}`}>
      <div className="wrap grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="h-section">{title}</h2>
          {lead && <p className="lead mt-5">{lead}</p>}
        </div>
        <ol ref={ref} className="relative [--p:1]">
          <span aria-hidden="true" className="absolute bottom-[var(--end,2.5rem)] start-[1.4375rem] top-6 w-0.5 bg-navy/15">
            <span className="block h-full w-full origin-top bg-accent [transform:scaleY(var(--p))]" />
          </span>
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-6 pb-12 last:pb-0 sm:gap-8">
              <span data-mark="on" aria-hidden="true" className={mark}>{i + 1}</span>
              <div data-reveal className="pt-2">
                <h3 className="text-2xl">{s.title}</h3>
                {s.text && <p className="mt-2 max-w-lg text-lg text-muted">{s.text}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
