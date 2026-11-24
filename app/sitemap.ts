import type { MetadataRoute } from "next";
import { launched, site } from "@/content/site";
import { siteHref } from "@/lib/href";
import { pagePaths } from "@/lib/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!launched) return [{ url: site.url }];
  return Object.values(pagePaths).map((path) => ({ url: `${site.url}${siteHref(path)}` }));
}
