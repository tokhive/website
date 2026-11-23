import { Footer } from "@/components/Footer";
import { AgentTools } from "@/components/home/AgentTools";
import { Earnings } from "@/components/home/Earnings";
import { EarningsProvider } from "@/components/home/EarningsProvider";
import { Hero } from "@/components/home/Hero";
import { ModelsProvider } from "@/components/ModelsProvider";
import { HiveMenu } from "@/components/home/HiveMenu";
import { Pipeline } from "@/components/home/Pipeline";
import { PrivateFromProviders } from "@/components/home/PrivateFromProviders";
import { PriceTape } from "@/components/home/PriceTape";
import { PromoVideo } from "@/components/home/PromoVideo";
import { StructuredData } from "@/components/home/StructuredData";
import { VerifiedOrigin } from "@/components/home/VerifiedOrigin";
import { Faq } from "@/components/home/Faq";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/links";
import { useTranslations } from "next-intl";
import type { PublicModelPrice } from "@/lib/public-models";

// The closing call to action: one card per audience, as in the hero.
const CTA_CARD =
  "flex min-h-[132px] flex-col justify-between gap-5 rounded-[18px] px-[18px] py-5 text-ink md:min-h-[240px] md:rounded-card-lg md:p-10 lg:p-14";
const CTA_EYEBROW = "font-mono text-[11px] tracking-[.1em] md:text-[13px]";
// Sized so each label stays on one line in its half of the row.
const CTA_LABEL = "text-lg font-bold tracking-[-.02em] md:text-3xl md:tracking-[-.04em] lg:text-4xl xl:text-5xl";

export function HomePage({ initialModels }: { initialModels: PublicModelPrice[] | null }) {
  const t = useTranslations("Home.closingCta");
  return (
    <EarningsProvider>
      <ModelsProvider initial={initialModels}>
        <main>
          <StructuredData />
          <Hero />
          <PriceTape />
          <PromoVideo />
          <VerifiedOrigin />
          <Pipeline />
          <PrivateFromProviders />
          <Earnings />
          <HiveMenu />
          <AgentTools />
          <Faq />
          <div className="site-container mb-14 grid grid-cols-2 gap-2 md:mb-[120px] md:gap-2.5">
            <Link href="/providers" className={`${CTA_CARD} bg-volt`}>
              <span className={CTA_EYEBROW}>{t("quotaEyebrow")}</span>
              <span className={CTA_LABEL}>{t("startEarning")}</span>
            </Link>
            <a href={LINKS.getApiKey} className={`${CTA_CARD} bg-paper`}>
              <span className={CTA_EYEBROW}>{t("tokensEyebrow")}</span>
              <span className={CTA_LABEL}>{t("getApiKey")}</span>
            </a>
          </div>
        </main>
        <Footer />
      </ModelsProvider>
    </EarningsProvider>
  );
}
