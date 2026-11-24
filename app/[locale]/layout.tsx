import "../globals.css";
import type { Viewport } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Footer from "@/components/layout/Footer";
import LanguageOffer from "@/components/layout/LanguageOffer";
import Header from "@/components/layout/Header";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import RevealObserver from "@/components/ui/RevealObserver";
import StructuredData from "@/components/layout/StructuredData";
import { dirOf, isLocale, locales } from "@/i18n/config";
import { arabic, manrope } from "@/lib/fonts";

export const viewport: Viewport = { themeColor: "#062450" };
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  // Only the copy used by client components is sent to the browser.
  const { nav, common, whatsapp, services, form } = await getMessages();

  return (
    <html lang={locale} dir={dirOf(locale)} className={`${manrope.variable} ${arabic.variable}`}>
      <body>
        <NextIntlClientProvider messages={{ nav, common, whatsapp, services, form }}>
          <a
            href="#main"
            className="btn btn-dark fixed start-4 top-3 z-[60] -translate-y-24 focus:translate-y-0"
          >
            {t("skip")}
          </a>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <LanguageOffer />
          <RevealObserver />
        </NextIntlClientProvider>
        <StructuredData />
      </body>
    </html>
  );
}
