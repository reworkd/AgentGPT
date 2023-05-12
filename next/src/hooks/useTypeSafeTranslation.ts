import { useTranslation } from "next-i18next";

export function useTypeSafeTranslation() {
  const [t] = useTranslation();
  return (key: string) => t(key) ?? key;
}
