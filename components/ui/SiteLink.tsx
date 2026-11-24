import Link from "next/link";
import { useLocale } from "next-intl";
import type { ComponentProps } from "react";
import { localHref } from "@/lib/href";

/** Internal link. Give it the plain path ("/about"); it adds /v2 and language. */
export default function SiteLink({ href, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  const locale = useLocale();
  return <Link href={localHref(locale, href)} {...rest} />;
}
