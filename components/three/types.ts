import type { RefObject } from "react";

/** Scroll position of the pinned section, 0 to 1. Written by GSAP, read each frame. */
export type Progress = RefObject<number>;
export type SceneProps = { progress: Progress; modelUrl?: string; onReady: () => void };
