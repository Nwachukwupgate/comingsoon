import type { ReactNode } from "react";

/* <html> is rendered in app/[locale]/layout.tsx so `lang` and `dir` follow the
   language. This root layout only exists because app/not-found.tsx needs one. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
