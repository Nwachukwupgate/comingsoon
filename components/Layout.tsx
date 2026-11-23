import React, { ReactNode } from "react";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div className="page-min-height relative flex flex-col items-center overflow-hidden bg-hero bg-cover">
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta
        name="description"
        content="Coming Soon | Upsworth PMS"
      />
      <meta property="og:title" content={title} />
      <meta
        property="og:description"
        content="Coming Soon | Upsworth PMS"
      />
      <meta property="og:url" content="https://www.upsworth-pms.com/" />
      <meta property="og:type" content="website" />
    </Head>
    {children}
  </div>
);

export default Layout;
