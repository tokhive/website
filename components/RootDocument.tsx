import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { alternates, SITE_URL } from "@/i18n/metadata";
import { LANGUAGE_TAGS, type Locale } from "@/i18n/routing";
import { jetbrains, sora } from "@/app/fonts";
import "@/app/globals.css";

export async function rootMetadata(locale: Locale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("site.title"), template: "%s · TokHive" },
    description: t("site.description"),
    alternates: alternates("/", locale),
  };
}

/** The `<html>` shell shared by each locale's root layout. */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  setRequestLocale(locale);
  return (
    <html lang={LANGUAGE_TAGS[locale]} className={`${sora.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen overflow-x-clip">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
