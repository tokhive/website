import { useLocale, useTranslations } from "next-intl";
import { SITE_URL } from "@/i18n/metadata";
import { LANGUAGE_TAGS, localizedPath, type Locale } from "@/i18n/routing";
import { LINKS, PROMO_VIDEO } from "@/lib/links";

// Tells search engines who runs the site and where else TokHive lives, so a
// search for the name can show the right logo and profiles.
export function StructuredData() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Metadata.site");
  const video = useTranslations("Home.promo");
  const organization = `${SITE_URL}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organization,
        name: "TokHive",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/logo-512.png`,
        sameAs: [LINKS.github, LINKS.twitter, LINKS.telegram, LINKS.discord],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "TokHive",
        url: `${SITE_URL}${localizedPath("/", locale)}`,
        description: t("description"),
        inLanguage: LANGUAGE_TAGS[locale],
        publisher: { "@id": organization },
      },
      {
        "@type": "VideoObject",
        name: video("title"),
        description: t("description"),
        thumbnailUrl: `${SITE_URL}${PROMO_VIDEO.poster}`,
        contentUrl: PROMO_VIDEO.src,
        duration: PROMO_VIDEO.isoDuration,
        uploadDate: PROMO_VIDEO.uploadDate,
        inLanguage: "en",
        publisher: { "@id": organization },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so nothing in the data can close the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
