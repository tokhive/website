import type { MetadataRoute } from "next";
import { INDEXED_PAGES, SITE_URL } from "@/i18n/metadata";
import { LANGUAGE_TAGS, localizedPath, routing } from "@/i18n/routing";

// A static export only writes route handlers it is told are static.
export const dynamic = "force-static";

// Every indexed page in each locale, each listing its translations so search
// engines pair them.
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXED_PAGES.flatMap((pathname) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [LANGUAGE_TAGS[locale], `${SITE_URL}${localizedPath(pathname, locale)}`]),
    );
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}${localizedPath(pathname, locale)}`,
      alternates: { languages },
    }));
  });
}
