import { IBM_Plex_Sans_Arabic, Manrope } from "next/font/google";

export const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });

/* Manrope has no Arabic letters. Not preloaded, so it never delays English pages,
   which use it only for the switcher label.
   The order for Arabic pages is set in app/globals.css under "Arabic". */
export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});
