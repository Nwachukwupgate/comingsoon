"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Fades in [data-reveal] elements as they enter the viewport. */
export default function RevealObserver() {
  const path = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.replace("reveal-wait", "reveal-in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    items.forEach((el) => {
      if (el.classList.contains("reveal-in") || el.getBoundingClientRect().top < innerHeight * 0.92) return;
      const order = Number(el.dataset.reveal || 0);
      if (order) el.style.setProperty("--reveal-delay", `${order * 80}ms`);
      el.classList.add("reveal-wait");
      io.observe(el);
    });
    return () => {
      io.disconnect();
      items.forEach((el) => el.classList.remove("reveal-wait"));
    };
  }, [path]);

  return null;
}
