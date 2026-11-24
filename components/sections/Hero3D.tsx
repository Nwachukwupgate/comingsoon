"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import ArtPicture from "@/components/ui/ArtPicture";
import { loadGsap } from "@/lib/gsap";
import { useMotionMode } from "@/lib/useMotionMode";

const Scene = dynamic(() => import("@/components/three/SkylineScene"), { ssr: false });

type Props = {
  title: string;
  lead: string;
  secondTitle: string;
  secondLead: string;
  imageAlt: string;
  modelUrl?: string;
  actions: ReactNode;
};

export default function Hero3D({ title, lead, secondTitle, secondLead, imageAlt, modelUrl, actions }: Props) {
  const mode = useMotionMode();
  const pin = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [load, setLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const scroll = mode === "scroll";

  // Let the page paint and settle before loading 3D.
  useEffect(() => {
    if (!scroll) return;
    const id = setTimeout(() => setLoad(true), 350);
    return () => {
      clearTimeout(id);
      setLoad(false);
      setReady(false);
    };
  }, [scroll]);

  useEffect(() => {
    if (!scroll) return;
    let cancelled = false;
    let revert = () => {};
    loadGsap().then(({ gsap }) => {
      if (cancelled || !pin.current) return;
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: pin.current,
            start: "top top",
            end: "+=170%",
            pin: true,
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });
        tl.to(progress, { current: 1, duration: 1 }, 0)
          .to(first.current!.children, { autoAlpha: 0, y: -60, duration: 0.2, stagger: 0.04 }, 0.1)
          .fromTo(
            second.current!.children,
            { autoAlpha: 0, y: 70 },
            { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.08, ease: "power2.out" },
            0.5,
          );
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
    <section>
      <div
        ref={pin}
        data-mode={mode}
        className="group relative overflow-hidden bg-[linear-gradient(180deg,#F4F5F7_0%,#E6EBF1_100%)] data-[mode=scroll]:h-[100svh]"
      >
        <div className="relative lg:h-[100svh] lg:min-h-[38rem]">
        <div className="wrap relative z-10 flex flex-col pb-4 pt-[calc(var(--header)+2.5rem)] lg:h-full lg:justify-center lg:pb-16">
          <div ref={first} className="max-w-[36rem] lg:max-w-[min(36rem,44vw)]">
            <h1 className="h-display">{title}</h1>
            <p className="lead mt-6 max-w-lg !text-navy/80 lg:max-w-[25rem]">{lead}</p>
            <div className="mt-9 flex flex-wrap gap-3">{actions}</div>
          </div>
        </div>

        <div className="relative mx-auto aspect-[6/5] w-full max-w-3xl lg:absolute lg:inset-0 lg:aspect-auto lg:h-full lg:max-w-none">
          <ArtPicture
            desktop="/images/hero-skyline.webp"
            mobile="/images/hero-skyline-mobile.webp"
            alt={imageAlt}
            eager
            className={`object-cover transition-opacity lg:object-right duration-700 rtl:lg:-scale-x-100 ${ready ? "opacity-0" : ""}`}
          />
          {scroll && load && (
            <div aria-hidden="true" className={`absolute inset-0 transition-opacity duration-700 ${ready ? "" : "opacity-0"}`}>
              <Scene progress={progress} modelUrl={modelUrl} onReady={() => setReady(true)} />
            </div>
          )}
        </div>

          {/* Soft veil that keeps the text readable over the scene. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 start-0 hidden w-[60%] lg:block bg-[linear-gradient(90deg,#F1F3F6_50%,rgb(241_243_246/0)_100%)] rtl:-scale-x-100" />
        </div>

        {/* Second message: scrolls in over the scene, or sits below it when static. */}
        <div className="relative z-10 bg-white group-data-[mode=scroll]:pointer-events-none group-data-[mode=scroll]:absolute group-data-[mode=scroll]:inset-0 group-data-[mode=scroll]:bg-transparent">
          <div className="wrap flex h-full items-center">
            <div ref={second} className="max-w-[36rem] py-16 lg:max-w-[min(31rem,40vw)] group-data-[mode=scroll]:py-0">
              <h2 className="h-section lg:text-[clamp(2.5rem,1.4rem+2.4vw,3.6rem)]">{secondTitle}</h2>
              <p className="lead mt-6 max-w-[25rem] !text-navy/80">{secondLead}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
