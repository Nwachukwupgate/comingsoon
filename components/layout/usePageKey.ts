"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import type { PageKey } from "@/lib/pages";

const bySlug: Record<string, PageKey> = {
  "project-management": "project",
  "logistics-investment": "logistics",
  "real-estate": "realEstate",
  "sourcing-shipping": "sourcing",
  about: "about",
  contact: "contact",
};

/** Which page is showing. Uses route segments, not the URL, because the URL is
    rewritten (/v2/about to /en/about) and would differ between server and browser. */
export function usePageKey(): PageKey {
  const segments = useSelectedLayoutSegments() ?? [];
  return bySlug[segments[segments.length - 1]] ?? "home";
}
