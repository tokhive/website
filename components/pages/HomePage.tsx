import { Footer } from "@/components/Footer";
import { AgentTools } from "@/components/home/AgentTools";
import { Earnings } from "@/components/home/Earnings";
import { EarningsProvider } from "@/components/home/EarningsProvider";
import { Hero } from "@/components/home/Hero";
import { ModelsProvider } from "@/components/ModelsProvider";
import { HiveMenu } from "@/components/home/HiveMenu";
import { Pipeline } from "@/components/home/Pipeline";
import { PriceTape } from "@/components/home/PriceTape";
import { VerifiedOrigin } from "@/components/home/VerifiedOrigin";
import { Faq } from "@/components/home/Faq";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/links";
import { useTranslations } from "next-intl";

export function HomePage() {
  const t = useTranslations("Home.mobileCta");
  return (
    <EarningsProvider>
      <ModelsProvider>
        <main>
          <Hero />
          <PriceTape />
          <VerifiedOrigin />
          <Pipeline />
          <Earnings />
          <HiveMenu />
          <AgentTools />
          <Faq />
          <div className="site-container mb-14 grid grid-cols-2 gap-2 md:hidden">
            <Link
              href="/providers"
              className="flex min-h-[132px] flex-col justify-between gap-5 rounded-[18px] bg-volt px-[18px] py-5 text-ink"
            >
              <span className="font-mono text-[11px] tracking-[.1em]">{t("quotaEyebrow")}</span>
              <span className="text-lg font-bold tracking-[-.02em]">{t("startEarning")}</span>
            </Link>
            <a
              href={LINKS.getApiKey}
              className="flex min-h-[132px] flex-col justify-between gap-5 rounded-[18px] bg-paper px-[18px] py-5 text-ink"
            >
              <span className="font-mono text-[11px] tracking-[.1em]">{t("tokensEyebrow")}</span>
              <span className="text-lg font-bold tracking-[-.02em]">{t("getApiKey")}</span>
            </a>
          </div>
        </main>
        <Footer />
      </ModelsProvider>
    </EarningsProvider>
  );
}
