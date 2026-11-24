import Link from "next/link";
import type { ComponentProps } from "react";
import { siteHref } from "@/lib/href";

/** Internal link. Give it the plain path ("/about"); it adds /v2 until launch. */
export default function SiteLink({ href, ...rest }: Omit<ComponentProps<typeof Link>, "href"> & { href: string }) {
  return <Link href={siteHref(href)} {...rest} />;
}
