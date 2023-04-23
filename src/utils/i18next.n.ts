import i18next from 'i18next';
import Backend from "i18next-http-backend";
import LanguageDetector from 'i18next-browser-languagedetector';
import {initReactI18next} from "react-i18next";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: ['en'],
    debug: true,
    interpolation: {
      escapeValue: false // react already safes from xss
  },
  keySeparator: false,
    react: {
      useSuspense: false,
    },
    defaultNS: 'translation',
	       backend: {
	      loadPath: "./public/locales/{{lng}}/{{ns}}.json",
	      crossDomain: false
	     }
  });

  export default i18next;
