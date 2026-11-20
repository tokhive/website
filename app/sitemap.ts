import type { MetadataRoute } from "next";
import { INDEXED_PAGES, SITE_URL } from "@/i18n/metadata";
import { LANGUAGE_TAGS, localizedPath, routing } from "@/i18n/routing";
import { EFFECTIVE, LEGAL_PAGES } from "@/lib/legal";

// A static export only writes route handlers it is told are static.
export const dynamic = "force-static";

// Every indexed page in each locale, each listing its translations so search
// engines pair them, then the policies, which exist in English only.
export default function sitemap(): MetadataRoute.Sitemap {
  const translated = INDEXED_PAGES.flatMap((pathname) => {
    const languages: Record<string, string> = Object.fromEntries(
      routing.locales.map((locale) => [LANGUAGE_TAGS[locale], `${SITE_URL}${localizedPath(pathname, locale)}`]),
    );
    languages["x-default"] = `${SITE_URL}${localizedPath(pathname, routing.defaultLocale)}`;
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(pathname, locale)}`,
      alternates: { languages },
    }));
  });
  const policies = LEGAL_PAGES.map((pathname) => ({
    url: `${SITE_URL}${localizedPath(pathname, routing.defaultLocale)}`,
    lastModified: EFFECTIVE.iso,
  }));
  return [...translated, ...policies];
}
