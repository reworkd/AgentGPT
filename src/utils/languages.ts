export type Language = {
  code: string;
  name: string;
  flag: string;
};

export const ENGLISH = { code: "en", name: "ENGLISH", flag: "🇺🇸" };

export const languages: Language[] = [
  ENGLISH,
  { code: "fr", name: "FRENCH", flag: "🇫🇷" },
  { code: "es", name: "SPANISH", flag: "🇪🇸" },
  { code: "de", name: "GERMAN", flag: "🇩🇪" },
  { code: "ja", name: "JAPANESE", flag: "🇯🇵" },
  { code: "ko", name: "KOREAN", flag: "🇰🇷" },
  { code: "zh", name: "CHINESE", flag: "🇨🇳" },
  { code: "pt", name: "PORTUGEES", flag: "🇵🇹" },
  { code: "it", name: "ITALIAN", flag: "🇮🇹" },
  { code: "nl", name: "DUTCH", flag: "🇳🇱" },
  { code: "pl", name: "POLSKI", flag: "🇵🇱" },
  { code: "hu", name: "HUNGARIAN", flag: "🇭🇺" },
  { code: "ro", name: "ROMANIAN", flag: "🇷🇴" },
  { code: "sk", name: "SLOVAK", flag: "🇸🇰" },
];
