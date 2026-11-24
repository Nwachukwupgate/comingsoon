"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import ArtPicture from "@/components/ui/ArtPicture";
import { loadGsap } from "@/lib/gsap";
import { useCan3D, useMotionMode } from "@/lib/useMotionMode";

const scenes = {
  truck: dynamic(() => import("@/components/three/TruckScene"), { ssr: false }),
  building: dynamic(() => import("@/components/three/BuildingScene"), { ssr: false }),
};

type Props = {
  scene: keyof typeof scenes;
  title: string;
  lead: string;
  points: string[];
  /** Shown last: a testimonial when there is one, otherwise the disclaimer. */
  closing: ReactNode;
  image: string;
  imageAlt: string;
  modelUrl?: string;
};

export default function ScrollStory3D({ scene, title, lead, points, closing, image, imageAlt, modelUrl }: Props) {
  const mode = useMotionMode();
  const can3D = useCan3D();
  const root = useRef<HTMLElement>(null);
  const pin = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const still = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const scroll = mode === "scroll";
  const Scene = scenes[scene];

  // Load 3D only when the section is about to appear.
  useEffect(() => {
    if (!scroll || !can3D || !root.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    io.observe(root.current);
    return () => {
      io.disconnect();
      setNear(false);
      setReady(false);
    };
  }, [scroll, can3D]);

  useEffect(() => {
    if (!scroll) return;
    let cancelled = false;
    let revert = () => {};
    loadGsap().then(({ gsap }) => {
      if (cancelled || !pin.current) return;
      const ctx = gsap.context(() => {
        const items = Array.from(list.current!.children);
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
        tl.to(progress, { current: 1, duration: 1, ease: "none" }, 0);
        tl.to(still.current, { scale: 1.2, transformOrigin: "70% 55%", duration: 1, ease: "none" }, 0);
        tl.from(
          intro.current!.lastElementChild,
          { autoAlpha: 0, y: 40, duration: 0.1 },
          0.05,
        );
        items.forEach((item, i) => tl.from(item, { autoAlpha: 0, x: -32, duration: 0.1 }, 0.22 + i * 0.13));
        tl.from(end.current, { autoAlpha: 0, y: 40, duration: 0.1 }, 0.82);
      });
      revert = () => ctx.revert();
    });
    return () => {
      cancelled = true;
      revert();
      progress.current = 0;
    };
  }, [scroll]);

  return (
    <section ref={root} className="on-dark bg-navy-deep text-white">
      <div
        ref={pin}
        data-mode={mode}
        className="group relative overflow-hidden bg-[radial-gradient(60rem_40rem_at_72%_45%,#134179_0%,#062450_55%,#041733_100%)] data-[mode=scroll]:h-[100svh] data-[mode=scroll]:min-h-[35rem]"
      >
        <div className="relative aspect-[5/4] w-full lg:absolute lg:inset-0 lg:aspect-auto lg:h-full">
          <div ref={still} className="absolute inset-0">
            <ArtPicture
              desktop={image}
              mobile={image.replace(".webp", "-mobile.webp")}
              alt={imageAlt}
              className={`object-contain transition-opacity duration-700 lg:object-cover rtl:lg:-scale-x-100 ${ready ? "opacity-0" : ""}`}
            />
          </div>
          {scroll && can3D && near && (
            <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${ready ? "" : "opacity-0"}`}>
              <Scene progress={progress} modelUrl={modelUrl} onReady={() => setReady(true)} />
            </div>
          )}
        </div>
        <div className="wrap relative flex h-full flex-col justify-center pb-16 pt-2 lg:py-24 group-data-[mode=scroll]:lg:pb-8 group-data-[mode=scroll]:lg:pt-[var(--header)]">
          <div className="lg:max-w-[min(33rem,44%)]">
            <div ref={intro}>
              <h2 className="h-section">{title}</h2>
              <p className="lead mt-4">{lead}</p>
            </div>
            <ul ref={list} className="mt-8 space-y-4">
              {points.map((p) => (
                <li key={p} className="border-s-[3px] border-accent ps-5 text-lg font-semibold leading-snug">
                  {p}
                </li>
              ))}
            </ul>
            <div ref={end} className="mt-8">
              {closing}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
