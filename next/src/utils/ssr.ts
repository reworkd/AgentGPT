import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nextI18NextConfig from "../../next-i18next.config.js"; // Change path to your config file
import type { GetServerSidePropsContext } from "next";
import { languages } from "./languages";

/*
 * Utility functions to retrieve props for server-side rendering
 */

export const getTranslations = async (context: GetServerSidePropsContext) => {
  const locale = context.locale || "en";
  const supportedLocales = languages.map((language) => language.code);
  const chosenLocale = supportedLocales.includes(locale) ? locale : "en";

  return await serverSideTranslations(chosenLocale, nextI18NextConfig.ns);
};

export type DeviceType = "mobile" | "desktop" | undefined;
export const getDeviceType = (context: GetServerSidePropsContext): DeviceType => {
  const userAgent = context.req.headers["user-agent"] as string;

  const mobileUserAgents = [
    "Android",
    "webOS", // for Palm devices
    "iPhone",
    "iPad",
    "iPod",
    "BlackBerry",
    "IEMobile", // for Windows Mobile 7 phones
    "Windows Phone", // for Windows Mobile 8 phones
    "WPDesktop", // for Windows Phone devices
    "Opera Mini",
    "Opera Mobi", // for Opera Mobile
    "Mobile", // generic string used in many mobile devices
    "Silk", // for Amazon Kindle devices
    "Kindle", // for Amazon Kindle devices
    "Symbian", // for Symbian devices
    "nokia", // for Nokia devices
    "SamsungBrowser", // for Samsung devices
    "Tizen", // for Samsung Tizen devices
    "UCBrowser", // for UC Browser
  ];

  return mobileUserAgents.some((mobileUserAgent) => userAgent.includes(mobileUserAgent))
    ? "mobile"
    : "desktop";
};
