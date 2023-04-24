module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: [
      "en",
      "hu",
      "fr",
      "de",
      "it",
      "ja",
      "zh",
      "ko",
      "pl",
      "pt",
      "ro",
      "ru",
      "uk",
      "es",
      "nl",
      "sk",
      "hr",
    ]
  },
  localePath: typeof window === "undefined" ? "./public/locales" : "/locales",
  debug: true,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  defaultNS: "common",
  ns: ["common", "help", "settings", "chat", "agent", "errors", "languages", "drawer", "indexPage"],
  react: {
    useSuspense: false,
  },
  saveMissing: true,
  //updateMissing: true
};
