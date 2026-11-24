"use client";

import { useEffect, type RefObject } from "react";

/** Calls back with 0 to 1 as the element travels through the viewport.
    Stays at 1 when the visitor prefers reduced motion. */
export function useScrollProgress(ref: RefObject<HTMLElement | null>, onChange: (p: number, el: HTMLElement) => void) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onChange(1, el);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const { top, height } = el.getBoundingClientRect();
      onChange(Math.min(Math.max((innerHeight * 0.72 - top) / height, 0), 1), el);
    };
    const request = () => {
      frame ||= requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      removeEventListener("scroll", request);
      if (e.isIntersecting) addEventListener("scroll", request, { passive: true });
      request();
    });
    io.observe(el);
    addEventListener("resize", request);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", request);
      removeEventListener("resize", request);
    };
    // onChange must be a module-level function or otherwise stable.
  }, [ref, onChange]);
}
