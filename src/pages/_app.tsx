import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "../utils/api";

import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "nextjs-google-analytics";

import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  return (
    <SessionProvider session={session}>
      <I18nextProvider i18n={i18n}>
        <Analytics />
        <GoogleAnalytics trackPageViews />
        <Component {...pageProps} />
      </I18nextProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
