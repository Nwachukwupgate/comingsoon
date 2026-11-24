import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import type { PageKey } from "./pages";
import { pageMetadata } from "./seo";

export type PageProps = { params: Promise<{ locale: string }> };

/** Every page calls this first. It lets next-intl render the page statically. */
export async function pageLocale(params: PageProps["params"]) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return locale;
}

export const metadataFor =
  (page: PageKey) =>
  async ({ params }: PageProps): Promise<Metadata> =>
    pageMetadata((await params).locale, page);
