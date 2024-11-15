import { ui } from "./ui";

export const LANGUAGES = {
  en: "English",
  "pt-br": "Portuges",
};

export const LANGUAGES_KEYS: UiType[] = ["pt-br", "en"];

export const DEFAULT_LANG = "pt-br";

export type UiType = keyof typeof ui;

export function getLangFromUrl(url: URL) {
  const langCodeMatch = url.pathname.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
  return langCodeMatch
    ? (langCodeMatch[1] as UiType)
    : (DEFAULT_LANG as UiType);
}
export function getLangFromLocation(url: string) {
  const langCodeMatch = url.match(/\/([a-z]{2}-?[a-z]{0,2})\//);
  return langCodeMatch
    ? (langCodeMatch[1] as UiType)
    : (DEFAULT_LANG as UiType);
}

export function useTranslations(lang?: UiType) {
  return function t(
    key: keyof (typeof ui)[typeof DEFAULT_LANG],
    ...args: any[]
  ) {
    let translation = ui[lang ?? DEFAULT_LANG][key] || ui[DEFAULT_LANG][key];
    if (args.length > 0) {
      for (let i = 0; i < args.length; i++) {
        translation = translation.replace(`{${i}}`, args[i]);
      }
    }
    return translation;
  };
}

export function pathNameIsInLanguage(pathname: string, lang: UiType) {
  return (
    pathname.startsWith(`/${lang}`) ||
    (lang === DEFAULT_LANG && !pathNameStartsWithLanguage(pathname))
  );
}

function pathNameStartsWithLanguage(pathname: string) {
  let startsWithLanguage = false;
  const languages = Object.keys(LANGUAGES);

  for (let i = 0; i < languages.length; i++) {
    const lang = languages[i];
    if (pathname.startsWith(`/${lang}`)) {
      startsWithLanguage = true;
      break;
    }
  }

  return startsWithLanguage;
}

export function getLocalizedPathname(pathname: string, lang: UiType) {
  if (pathNameStartsWithLanguage(pathname)) {
    const availableLanguages = Object.keys(LANGUAGES).join("|");
    const regex = new RegExp(`^/(${availableLanguages})`);
    return pathname.replace(regex, `/${lang}`);
  }
  return `/${lang}${pathname}`;
}
