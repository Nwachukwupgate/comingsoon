"use client";

import { useSyncExternalStore } from "react";

/**
 * "scroll": pinned sections that play as the visitor scrolls.
 * "static": plain page flow. Used on the server, without JavaScript, on small or
 * touch screens, and when the visitor prefers reduced motion.
 */
export type MotionMode = "static" | "scroll";

const queries = ["(min-width: 1024px)", "(min-height: 560px)", "(pointer: fine)", "(prefers-reduced-motion: no-preference)"];

function subscribe(onChange: () => void) {
  const lists = queries.map((q) => matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

const readMode = (): MotionMode => (queries.every((q) => matchMedia(q).matches) ? "scroll" : "static");

export const useMotionMode = () => useSyncExternalStore<MotionMode>(subscribe, readMode, () => "static");

let capable: boolean | undefined;

function readCapable() {
  if (capable !== undefined) return capable;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if ((nav.deviceMemory ?? 8) < 4 || nav.connection?.saveData) return (capable = false);
  try {
    const gl = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    capable = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    capable = false;
  }
  return capable;
}

const never = () => () => {};

/** Whether real-time 3D can run. When it cannot, the pinned sections still play,
    with still images in place of the models. */
export const useCan3D = () => useSyncExternalStore(never, readCapable, () => false);
