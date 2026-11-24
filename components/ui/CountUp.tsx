"use client";

import { useEffect, useRef } from "react";

/** Counts up once when scrolled into view. Renders the final value on the
    server, so it reads correctly without JavaScript or with reduced motion. */
export default function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / 1400, 1);
          el.textContent = `${Math.round(value * (1 - (1 - p) ** 3))}${suffix}`;
          if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = `${value}${suffix}`;
    };
  }, [value, suffix]);

  return (
    <>
      <span ref={ref} aria-hidden="true">{`${value}${suffix}`}</span>
      <span className="sr-only">{`${value}${suffix}`}</span>
    </>
  );
}
