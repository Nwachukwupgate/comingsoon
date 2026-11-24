import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { launched, site } from "@/content/site";
import { isLocale } from "@/i18n/config";
import { siteHref } from "./href";
import { pagePaths, type PageKey } from "./pages";

export async function pageMetadata(locale: string, page: PageKey): Promise<Metadata> {
  if (!isLocale(locale)) return {};
  const t = await getTranslations({ locale, namespace: "seo" });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const url = siteHref(pagePaths[page]);
  const image = `/og/${page}.jpg`;
  return {
    metadataBase: new URL(site.url),
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      locale,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    // The preview at /v2 stays out of search results until launch.
    robots: launched ? undefined : { index: false, follow: false },
  };
}
