"use client";

import { ArrowRight, Check } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/ui/Icon";
import SiteLink from "@/components/ui/SiteLink";
import { loadGsap } from "@/lib/gsap";
import { useCan3D, useMotionMode } from "@/lib/useMotionMode";

const Scene = dynamic(() => import("@/components/three/ServicesScene"), { ssr: false });

export type ServiceStep = {
  key: string;
  href: string;
  icon: string;
  name: string;
  line: string;
  points: string[];
  /** Shown last: a testimonial when there is one, otherwise a key fact. */
  closing: ReactNode;
  image: string;
};

type Props = { title: string; lead: string; more: string; steps: ServiceStep[]; children: ReactNode };

/**
 * Desktop: a pinned section. Each service plays in turn as the visitor scrolls:
 * its description, then its highlights, then a testimonial or key fact, while the
 * turntable brings round the next model. Scrolling back reverses it.
 * Everywhere else it renders `children`, the plain cards.
 */
export default function ServiceStory({ title, lead, more, steps, children }: Props) {
  const scroll = useMotionMode() === "scroll";
  return scroll ? <Pinned title={title} lead={lead} more={more} steps={steps} /> : children;
}

function Pinned({ title, lead, more, steps }: Omit<Props, "children">) {
  const can3D = useCan3D();
  const root = useRef<HTMLDivElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const jump = useRef<(i: number) => void>(() => {});
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const count = steps.length;

  // Load 3D only when the section is about to appear.
  useEffect(() => {
    if (!can3D || !root.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setNear(true);
        io.disconnect();
      },
      { rootMargin: "120% 0px" },
    );
    io.observe(root.current);
    return () => io.disconnect();
  }, [can3D]);

  useEffect(() => {
    let cancelled = false;
    let revert = () => {};
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      const el = pin.current;
      if (cancelled || !el) return;
      const ctx = gsap.context(() => {
        const bars = el.querySelectorAll<HTMLElement>("[data-bar]");
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${innerHeight * count * 1.05}`,
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
            refreshPriority: 1,
            onUpdate: (self) => {
              const at = self.progress * count;
              bars.forEach((bar, i) => bar.style.setProperty("--p", String(Math.min(Math.max(at - i, 0), 1))));
              setActive(Math.min(Math.floor(at + 0.12), count - 1));
            },
          },
        });
        tl.to(progress, { current: 1, duration: count, ease: "none" }, 0);
        el.querySelectorAll<HTMLElement>("[data-step]").forEach((step, i) => {
          const part = (name: string) => step.querySelector<HTMLElement>(`[data-part="${name}"]`)!;
          const still = el.querySelector(`[data-still="${i}"]`);
          const last = i === count - 1;
          if (i > 0) {
            tl.fromTo(step, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.12 }, i - 0.06);
            tl.fromTo(still, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, i - 0.16);
          }
          tl.fromTo(still, { scale: 0.92 }, { scale: 1.14, duration: 1, ease: "none" }, i);
          tl.from(part("points").children, { autoAlpha: 0, x: -28, duration: 0.07, stagger: 0.055 }, i + 0.12);
          tl.to(part("points"), { autoAlpha: 0, y: -24, duration: 0.06 }, i + 0.44);
          tl.fromTo(part("closing"), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.08 }, i + 0.49);
          if (!last) {
            tl.to(step, { autoAlpha: 0, y: -50, duration: 0.08, ease: "power1.in" }, i + 0.75);
            tl.to(still, { autoAlpha: 0, duration: 0.14 }, i + 0.86);
          }
        });
        jump.current = (i) => {
          const st = tl.scrollTrigger!;
          scrollTo({ top: st.start + ((i + 0.4) / count) * (st.end - st.start), behavior: "smooth" });
        };
        // Sections pinned higher up must be measured first.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
      progress.current = 0;
    };
  }, [count]);

  return (
    <div ref={root}>
      <div
        ref={pin}
        className="relative h-[100svh] min-h-[35rem] overflow-hidden bg-[radial-gradient(70rem_46rem_at_70%_48%,#FFFFFF_0%,#EDF2F9_55%,#DFE7F3_100%)]"
      >
        <div aria-hidden="true" className={`absolute inset-y-0 end-0 w-[58%] transition-opacity duration-700 ${ready ? "opacity-0" : ""}`}>
          {steps.map((s, i) => (
            <div key={s.key} data-still={i} className={`absolute inset-[14%_4%_16%] ${i ? "invisible opacity-0" : ""}`}>
              <Image src={s.image} alt="" fill sizes="52vw" className="object-contain" />
            </div>
          ))}
        </div>
        {can3D && near && (
          <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${ready ? "" : "opacity-0"}`}>
            <Scene progress={progress} onReady={() => setReady(true)} />
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 start-0 w-[58%] bg-[linear-gradient(90deg,#EEF2F9_52%,rgb(238_242_249/0)_100%)] rtl:-scale-x-100"
        />

        <div className="wrap relative flex h-full flex-col pb-6 pt-[calc(var(--header)+1.75rem)] [@media(max-height:720px)]:pb-3 [@media(max-height:720px)]:pt-[calc(var(--header)+1rem)]">
          <div className="max-w-[min(34rem,46%)]">
            <h2 className="text-2xl xl:text-[1.75rem] [@media(max-height:720px)]:text-xl">{title}</h2>
            <p className="mt-1.5 text-muted [@media(max-height:800px)]:hidden">{lead}</p>
          </div>

          <div className="relative grid flex-1 items-center">
            {steps.map((s, i) => (
              <div
                key={s.key}
                data-step={i}
                className={`max-w-[min(32rem,43%)] [grid-area:1/1] ${i ? "invisible opacity-0" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white ring-1 ring-navy/10">
                    <Icon name={s.icon} className="h-7 w-7" />
                  </span>
                  <h3 className="text-[clamp(1.7rem,0.85rem+1.8vw,2.9rem)] leading-[1.06]">{s.name}</h3>
                </div>
                <p className="mt-5 text-lg leading-relaxed text-navy/80 [@media(max-height:720px)]:mt-3 [@media(max-height:720px)]:text-base">{s.line}</p>
                <div className="mt-6 grid min-h-[10.5rem] items-start [@media(max-height:720px)]:mt-3 [@media(max-height:720px)]:min-h-[8.5rem]">
                  <ul data-part="points" className="space-y-3 [grid-area:1/1] [@media(max-height:720px)]:space-y-1.5">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-3 text-lg font-bold [@media(max-height:720px)]:text-base">
                        <Check aria-hidden="true" className="h-5 w-5 shrink-0 text-accent-ink" strokeWidth={2.75} />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div data-part="closing" className="invisible opacity-0 [grid-area:1/1]">{s.closing}</div>
                </div>
                <SiteLink href={s.href} className="btn btn-primary mt-6 [@media(max-height:720px)]:mt-3 [@media(max-height:720px)]:!min-h-[2.75rem]">
                  {more}
                  <span className="sr-only">: {s.name}</span>
                  <ArrowRight aria-hidden="true" className="h-5 w-5 rtl:-scale-x-100" />
                </SiteLink>
              </div>
            ))}
          </div>

          <ul className="me-20 grid gap-5 rounded-2xl bg-white/90 px-6 pb-2 pt-4 [@media(max-height:720px)]:pb-0 [@media(max-height:720px)]:pt-3 shadow-[0_18px_40px_-24px_rgb(4_23_51/0.35)]" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
            {steps.map((s, i) => (
              <li key={s.key}>
                <button
                  type="button"
                  aria-current={active === i ? "step" : undefined}
                  onClick={() => jump.current(i)}
                  className={`w-full text-start font-bold transition-colors hover:text-navy ${active === i ? "text-navy" : "text-muted"}`}
                >
                  <span data-bar className="block h-1 overflow-hidden rounded-full bg-navy/15 [--p:0]">
                    <span className="block h-full w-full origin-left bg-accent [transform:scaleX(var(--p))] rtl:origin-right" />
                  </span>
                  <span className="block truncate py-2.5 text-[0.95rem]">{s.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
