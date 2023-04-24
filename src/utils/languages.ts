import { i18n } from 'next-i18next';

export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const ENGLISH = { code: "en", name: `${i18n?.t('ENGLISH','ENGLISH',{ns:'languages'})}`, flag: "🇺🇸" };

export const languages: Language[] = [
  ENGLISH,
  { code: "fr", name: `${i18n?.t('FRENCH','FRENCH',{ns:'languages'})}`, flag: "🇫🇷" },
  { code: "es", name: `${i18n?.t('SPANISH','SPANISH',{ns:'languages'})}`, flag: "🇪🇸" },
  { code: "de", name: `${i18n?.t('GERMAN','GERMAN',{ns:'languages'})}`, flag: "🇩🇪" },
  { code: "ja", name: `${i18n?.t('JAPANESE','JAPANESE',{ns:'languages'})}`, flag: "🇯🇵" },
  { code: "ko", name: `${i18n?.t('KOREAN','KOREAN',{ns:'languages'})}`, flag: "🇰🇷" },
  { code: "zh", name: `${i18n?.t('CHINESE','CHINESE',{ns:'languages'})}`, flag: "🇨🇳" },
  { code: "pt", name: `${i18n?.t('PORTUGEES','PORTUGEES',{ns:'languages'})}`, flag: "🇵🇹" },
  { code: "it", name: `${i18n?.t('ITALIAN','ITALIAN',{ns:'languages'})}`, flag: "🇮🇹" },
  { code: "nl", name: `${i18n?.t('DUTCH','DUTCH',{ns:'languages'})}`, flag: "🇳🇱" },
  { code: "pl", name: `${i18n?.t('POLSKI','POLSKI',{ns:'languages'})}`, flag: "🇵🇱" },
  { code: "hu", name: `${i18n?.t('HUNGARIAN','HUNGARIAN',{ns:'languages'})}`, flag: "🇭🇺" },
  { code: "ro", name: `${i18n?.t('ROMANIAN','ROMANIAN',{ns:'languages'})}`, flag: "🇷🇴" },
  { code: "sk", name: `${i18n?.t('SLOVAK','SLOVAK',{ns:'languages'})}`, flag: "🇸🇰" },
];
