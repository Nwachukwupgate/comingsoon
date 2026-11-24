import type { MetadataRoute } from "next";
import { launched, site } from "@/content/site";

/* Before launch, /v2 pages carry a noindex tag. They are not blocked here,
   because a crawler has to read the page to see that tag. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: launched ? `${site.url}/sitemap.xml` : undefined,
  };
}
