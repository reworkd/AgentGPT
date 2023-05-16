import { i18n } from "next-i18next";
import type nextI18NextConfig from "../../next-i18next.config.js";

type Namespace = (typeof nextI18NextConfig.ns)[number];

export const translate = (
  key: string,
  defaultText?: string | null,
  ns?: Namespace | undefined | null
) => {
  const opts = !!ns ? { ns } : undefined;
  const text = !!defaultText ? defaultText : key;
  return i18n?.t(key, text, opts) ?? key;
};
