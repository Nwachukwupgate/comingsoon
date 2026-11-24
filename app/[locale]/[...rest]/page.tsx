import { notFound } from "next/navigation";

/** Any unknown address inside the site shows app/[locale]/not-found.tsx. */
export default function UnknownPage() {
  notFound();
}
