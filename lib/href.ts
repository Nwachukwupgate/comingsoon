import { basePath } from "@/content/site";

/** Turns "/about" into its public path, e.g. "/v2/about". Same in every language. */
export const siteHref = (path: string) => `${basePath}${path === "/" ? "" : path}` || "/";

export const whatsappHref = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
