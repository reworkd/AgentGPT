/*
import universalLanguageDetect from "@unly/universal-language-detector";
import type { GetServerSidePropsContext } from "next";
import NextCookies from "next-cookies";
import nextI18NextConfig, { i18n } from "../next-i18next.config";
import { serverSideTranslations as _serverSideTranslations } from "next-i18next/serverSideTranslations";

export const serverSideTranslations = async (
  context: GetServerSidePropsContext,
  namespacesRequired = ["translation"]
) => {
  const lng = context.query.lng as string;
  const locale = i18n.locales.includes(lng)
    ? lng
    : universalLanguageDetect({
        supportedLanguages: i18n.locales,
        serverCookies: NextCookies(context),
        fallbackLanguage: i18n.defaultLocale,
        acceptLanguageHeader: context.req.headers["accept-language"],
      });

  return _serverSideTranslations(locale, namespacesRequired);
};
*/
