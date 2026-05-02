import en from "./locales/en";
import es from "./locales/es";
import pa from "./locales/pa";
import tl from "./locales/tl";
import type { LanguageInfo, Locale, Strings } from "./types";

export type { Locale, LanguageInfo, Strings };

/** All supported locales, keyed by code. */
export const LOCALES: Record<Locale, Strings> = { en, es, tl, pa };

/**
 * Display order for the language menu. English first, then by community
 * size in San Joaquin Valley.
 */
export const LANGUAGES: LanguageInfo[] = [
  en.language,
  es.language,
  tl.language,
  pa.language,
];

export const DEFAULT_LOCALE: Locale = "en";

export function getStrings(locale: Locale): Strings {
  return LOCALES[locale] ?? LOCALES[DEFAULT_LOCALE];
}
