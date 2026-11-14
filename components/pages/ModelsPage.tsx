import { useTranslations } from "next-intl";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { StepList } from "@/components/StepList";
import { CostCalculator } from "@/components/models/CostCalculator";
import { ModelsExplorer } from "@/components/models/ModelsExplorer";
import { ModelsSummary } from "@/components/models/ModelsSummary";
import { ModelsProvider } from "@/components/ModelsProvider";

const HOW = ["perToken", "float", "same", "caching", "longContext"] as const;

export function ModelsPage() {
  const t = useTranslations("Models");
  const how = HOW.map((key) => ({ t: t(`how.items.${key}.title`), d: t(`how.items.${key}.description`) }));
  return (
    <ModelsProvider offeredOnly>
      <main className="site-container models-page">
        <Nav />
        <header className="flex flex-wrap items-end justify-between gap-8 pt-[72px] pb-10 max-sm:pt-12">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">{t("eyebrow")}</span>
            <h1 className="h1">
              {t("titleLine1")}
              <br />
              <span className="outline-word">{t("titleLine2")}</span>
            </h1>
          </div>
          <ModelsSummary />
        </header>

        <Suspense>
          <ModelsExplorer />
        </Suspense>

        <CostCalculator />

        <section className="flex flex-col gap-10 pt-24 pb-[120px]">
          <h2 className="h2">{t("how.title")}</h2>
          <StepList steps={how} className="grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" />
        </section>
      </main>
      <Footer compact />
    </ModelsProvider>
  );
}
