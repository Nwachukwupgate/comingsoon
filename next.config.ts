import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { basePath, launched } from "./content/site";
import { defaultLocale, languageCookie, locales } from "./i18n/config";

/* Pages live in app/[locale] and are built once per language. Visitors see one
   address for all languages (/v2/about): the language cookie decides which
   built page is served, and English is used when there is no cookie. */
const others = locales.filter((l) => l !== defaultLocale);
// Once launched, the site shares "/" with files and API routes: skip those.
// Rewrites run one after another, so paths that already start with a language
// must be skipped too, or "/" would become "/en" and then "/en/en".
const skip = ["api/", "_next/", ".*\\.", ...locales.map((l) => `${l}(?:/|$)`)].join("|");
const rest = launched ? `/:path((?!${skip}).+)` : `${basePath}/:path*`;
const root = basePath || "/";

const config: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async redirects() {
    return [
      // The built pages are not public addresses.
      ...locales.flatMap((l) => [
        { source: `/${l}`, destination: root, permanent: false },
        { source: `/${l}/:path*`, destination: `${basePath}/:path*`, permanent: false },
      ]),
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
        ...others.flatMap((l) => {
          const has = [{ type: "cookie" as const, key: languageCookie, value: l }];
          return [
            { source: root, has, destination: `/${l}` },
            { source: rest, has, destination: `/${l}/:path*` },
          ];
        }),
        { source: root, destination: `/${defaultLocale}` },
        { source: rest, destination: `/${defaultLocale}/:path*` },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default createNextIntlPlugin("./i18n/request.ts")(config);
