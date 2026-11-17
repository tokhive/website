import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LANGUAGE_TAGS, localizedPath, routing, type Locale } from "./routing";

export const SITE_URL = "https://tokhive.ai";

/** Pages search engines should index, without a locale prefix. Legal drafts stay out. */
export const INDEXED_PAGES = ["/", "/models", "/network", "/providers", "/security"] as const;

/** Open Graph locale for each site locale. */
const OG_LOCALES: Record<Locale, string> = { en: "en_US", zh: "zh_CN" };

/** The link-preview card for each locale, in `public/og`. */
const OG_IMAGE_ALT: Record<Locale, string> = {
  en: "TokHive: official AI for less. Claude and GPT below list price, verified in a TEE.",
  zh: "TokHive：官方 AI，更低价格。Claude 与 GPT 低于官方定价，由 TEE 验证。",
};

/** Canonical URL and hreflang alternates for a page; `pathname` has no locale prefix. */
export function alternates(pathname: string, locale: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [LANGUAGE_TAGS[l], localizedPath(pathname, l)]),
  );
  languages["x-default"] = localizedPath(pathname, routing.defaultLocale);
  return { canonical: localizedPath(pathname, locale), languages };
}

/**
 * Link previews for social apps and chat. A page's `openGraph` replaces its
 * layout's rather than merging with it, so every page sets the whole object.
 */
export function socialMetadata(
  pathname: string,
  locale: Locale,
  title: string,
  description: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const image = { url: `/og/${locale}.png`, width: 1200, height: 630, alt: OG_IMAGE_ALT[locale] };
  return {
    openGraph: {
      type: "website",
      siteName: "TokHive",
      url: localizedPath(pathname, locale),
      title,
      description,
      locale: OG_LOCALES[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      images: [image],
    },
    twitter: { card: "summary_large_image", site: "@tokhive", title, description, images: [image] },
  };
}

type PageKey = "models" | "network" | "providers" | "security";

/** Translated title and description for a marketing page. */
export async function pageMetadata(page: PageKey, locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  return {
    title,
    description,
    alternates: alternates(`/${page}`, locale),
    ...socialMetadata(`/${page}`, locale, `${title} · TokHive`, description),
  };
}

/** A legal draft: shareable, but kept out of search results until it is final. */
export function legalMetadata(pathname: string, locale: Locale, title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: alternates(pathname, locale),
    ...socialMetadata(pathname, locale, `${title} · TokHive`, description),
  };
}
