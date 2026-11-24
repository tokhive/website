import { useTranslations } from "next-intl";

type Page = "models" | "network" | "providers" | "security" | "egress" | "egressHosts";

/**
 * The page's search title at the start of its h1, for search engines and
 * screen readers. It is visually hidden, so the designed heading looks the same.
 */
export function HeadingPrefix({ page }: { page: Page }) {
  const t = useTranslations();
  return <span className="sr-only">{t("Common.headingPrefix", { title: t(`Metadata.${page}.title`) })}</span>;
}
