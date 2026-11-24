"use client";

import { useRef } from "react";
import Icon from "@/components/ui/Icon";
import Logo from "@/components/ui/Logo";
import { useScrollProgress } from "@/lib/useScrollProgress";

type Props = {
  title: string;
  lead: string;
  centre: string;
  centreSub: string;
  nodes: { icon: string; title: string; text: string }[];
};

function draw(p: number, el: HTMLElement) {
  el.style.setProperty("--p", String(Math.min(p * 1.8, 1)));
}

/* Drawn as a bridge: Upsworth is the deck, each party is a pier joined to it. */
export default function Ecosystem({ title, lead, centre, centreSub, nodes }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, draw);
  return (
    <section className="section bg-mist-blue">
      <div className="wrap">
        <div data-reveal className="max-w-2xl">
          <h2 className="h-section">{title}</h2>
          <p className="lead mt-5">{lead}</p>
        </div>
        <div ref={ref} className="mt-14 [--p:1]">
          <div className="on-dark relative z-10 flex flex-col gap-3 rounded-2xl bg-navy px-7 py-7 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <span className="sr-only">{centre}</span>
            <span aria-hidden="true"><Logo light className="h-14 sm:h-16" /></span>
            <p className="text-lg font-bold text-white/85">{centreSub}</p>
          </div>
          <ul className="grid ps-7 lg:grid-cols-3 lg:gap-6 lg:ps-0">
            {nodes.map((n, i) => (
              <li key={n.title} className="relative flex lg:flex-col">
                <span
                  aria-hidden="true"
                  className="absolute -start-px top-0 h-full w-[3px] bg-navy/15 lg:relative lg:start-1/2 lg:h-24 lg:-translate-x-1/2 rtl:lg:translate-x-1/2"
                >
                  <span className="block h-full w-full origin-top bg-accent [transform:scaleY(var(--p))]" />
                  <span
                    className="pier-dot absolute -start-[5px] top-0 h-[13px] w-[13px] rounded-full border-[3px] border-accent bg-white"
                    style={{ animationDelay: `${i * 0.7}s` }}
                  />
                </span>
                <div className="mt-6 flex-1 ps-7 lg:mt-0 lg:ps-0">
                  <div data-reveal={i} className="h-full rounded-2xl bg-white p-7 sm:p-8">
                    <Icon name={n.icon} className="h-8 w-8" />
                    <h3 className="mt-5 text-xl">{n.title}</h3>
                    <p className="mt-2 text-muted">{n.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
