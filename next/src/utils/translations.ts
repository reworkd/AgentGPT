import {i18n} from "next-i18next";

type Namespace =
  'errors' | 'drawer'


export const translate = (key: string, ns: Namespace | undefined) => {
  const opts = !!ns ? { ns } : undefined
  return i18n?.t(key, key, opts) ?? key;
}
