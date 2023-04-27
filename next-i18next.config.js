import { languages } from "./src/utils/languages";
module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: languages.map((language) => language.code),
  },
  localePath: typeof window === "undefined" ? "./public/locales" : "/locales",
  debug: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  defaultNS: "common",
  ns: [
    "common",
    "help",
    "settings",
    "chat",
    "agent",
    "errors",
    "languages",
    "drawer",
    "indexPage",
  ],
  react: {
    useSuspense: false,
  },
  saveMissing: true,
};
