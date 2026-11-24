import "./globals.css";
import Link from "next/link";
import en from "@/messages/en.json";
import { defaultLocale } from "@/i18n/config";
import { manrope } from "@/lib/fonts";

export const metadata = { title: "Page not found | Upsworth PMS", robots: { index: false } };

/** Addresses outside the marketing site, e.g. /something. */
export default function RootNotFound() {
  return (
    <html lang={defaultLocale} className={manrope.variable}>
      <body>
        <main className="grid min-h-screen place-items-center bg-mist px-6 text-center">
          <div>
            <h1 className="h-section">{en.notFound.title}</h1>
            <p className="lead mt-4">{en.notFound.body}</p>
            <Link href="/" className="btn btn-primary mt-8">{en.notFound.home}</Link>
          </div>
        </main>
      </body>
    </html>
  );
}
