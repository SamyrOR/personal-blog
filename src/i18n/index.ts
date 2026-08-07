import type { UiType } from "./utils";
import type { UIStrings } from "./types";
import { DEFAULT_LANG } from "./utils";

const modules = import.meta.glob<{ default: UIStrings }>("./lang/*.ts", {
  eager: true,
});

const translations = {} as Record<UiType, UIStrings>;
for (const [path, mod] of Object.entries(modules)) {
  const locale = path.slice("./lang/".length, -".ts".length) as UiType;
  translations[locale] = mod.default;
}

/** Returns the UI strings object for the given locale, falling back to DEFAULT_LANG. */
export function useTranslations(lang?: UiType): UIStrings {
  return translations[lang ?? DEFAULT_LANG] ?? translations[DEFAULT_LANG];
}
