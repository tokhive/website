import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LANGUAGE_TAGS, localizedPath, routing, type Locale } from "./routing";

export const SITE_URL = "https://tokhive.ai";

/** Canonical URL and hreflang alternates for a page; `pathname` has no locale prefix. */
export function alternates(pathname: string, locale: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [LANGUAGE_TAGS[l], localizedPath(pathname, l)]),
  );
  languages["x-default"] = localizedPath(pathname, routing.defaultLocale);
  return { canonical: localizedPath(pathname, locale), languages };
}

type PageKey = "models" | "network" | "providers" | "security";

/** Translated title and description for a marketing page. */
export async function pageMetadata(page: PageKey, locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    title: t(`${page}.title`),
    description: t(`${page}.description`),
    alternates: alternates(`/${page}`, locale),
  };
}
