import type { MetadataRoute } from "next";
import { launched, site } from "@/content/site";
import { locales } from "@/i18n/config";
import { localHref } from "@/lib/href";
import { pagePaths } from "@/lib/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!launched) return [{ url: site.url }];
  return Object.values(pagePaths).flatMap((path) =>
    locales.map((locale) => ({
      url: `${site.url}${localHref(locale, path)}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}${localHref(l, path)}`])) },
    })),
  );
}
