"use client";

import { useSyncExternalStore } from "react";

/**
 * "scroll": pinned scroll scenes with real-time 3D.
 * "static": still images and plain layout. Used on the server, without
 * JavaScript, on small or touch screens, on low-power devices, when the visitor
 * prefers reduced motion or has data saver on, and when WebGL is unavailable.
 */
export type MotionMode = "static" | "scroll";

const queries = ["(min-width: 1024px)", "(min-height: 560px)", "(pointer: fine)", "(prefers-reduced-motion: no-preference)"];
const SLOW = "upsworth-3d-off";
let capable: boolean | undefined;
const listeners = new Set<() => void>();

/** Called when the 3D runs slowly. Uses stills for the rest of the visit, and
    switches now if the visitor is still at the top, so the page does not jump. */
export function reportSlow() {
  try {
    sessionStorage.setItem(SLOW, "1");
  } catch {}
  if (scrollY > 40) return;
  capable = false;
  listeners.forEach((l) => l());
}

function deviceIsCapable() {
  if (capable !== undefined) return capable;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if ((nav.hardwareConcurrency ?? 8) < 2 || (nav.deviceMemory ?? 8) < 4 || nav.connection?.saveData) {
    return (capable = false);
  }
  try {
    if (sessionStorage.getItem(SLOW)) return (capable = false);
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    capable = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    capable = false;
  }
  return capable;
}

function subscribe(onChange: () => void) {
  const lists = queries.map((q) => matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  listeners.add(onChange);
  return () => {
    lists.forEach((l) => l.removeEventListener("change", onChange));
    listeners.delete(onChange);
  };
}

const read = (): MotionMode => (queries.every((q) => matchMedia(q).matches) && deviceIsCapable() ? "scroll" : "static");

export const useMotionMode = () => useSyncExternalStore<MotionMode>(subscribe, read, () => "static");
