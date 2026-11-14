import { defineRouting } from "next-intl/routing";

// English lives at the root and Simplified Chinese under /zh. The site is a static
// export with no middleware, so there is no locale cookie or redirect to keep in sync.
export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeCookie: false,
});

export type Locale = (typeof routing.locales)[number];

/** BCP 47 tag for `<html lang>` and hreflang. */
export const LANGUAGE_TAGS: Record<Locale, string> = { en: "en", zh: "zh-CN" };

/** The same page in another locale; `pathname` has no locale prefix. */
export function localizedPath(pathname: string, locale: Locale): string {
  const path = pathname === "/" ? "" : pathname.replace(/\/+$/, "");
  const prefixed = locale === routing.defaultLocale ? path : `/${locale}${path}`;
  return `${prefixed}/`;
}
