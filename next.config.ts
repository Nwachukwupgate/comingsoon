import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { basePath, launched } from "./content/site";
import { defaultLocale, locales } from "./i18n/config";

/* Pages live in app/[locale]. Visitors see them under `basePath` ("/v2" for
   now), with no prefix for the default language: /v2/about, /v2/ar/about. */
const others = locales.filter((l) => l !== defaultLocale);
// Once launched, the site shares "/" with files and API routes: skip those.
// Rewrites run one after another, so paths that already start with a language
// must be skipped too, or "/" would become "/en" and then "/en/en".
const skip = ["api/", "_next/", ".*\\.", ...locales.map((l) => `${l}(?:/|$)`)].join("|");
const rest = launched ? `/:path((?!${skip}).+)` : `${basePath}/:path*`;

const config: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      { source: `/${defaultLocale}`, destination: basePath || "/", permanent: false },
      { source: `/${defaultLocale}/:path*`, destination: `${basePath}/:path*`, permanent: false },
      ...(launched
        ? [
            { source: "/v2", destination: "/", permanent: false },
            { source: "/v2/:path*", destination: "/:path*", permanent: false },
          ]
        : []),
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        ...others.flatMap((l) => [
          { source: `${basePath}/${l}`, destination: `/${l}` },
          { source: `${basePath}/${l}/:path*`, destination: `/${l}/:path*` },
        ]),
        { source: basePath || "/", destination: `/${defaultLocale}` },
        { source: rest, destination: `/${defaultLocale}/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default createNextIntlPlugin("./i18n/request.ts")(config);
