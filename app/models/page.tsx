import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { StepList } from "@/components/StepList";
import { CostCalculator } from "@/components/models/CostCalculator";
import { ModelsExplorer } from "@/components/models/ModelsExplorer";
import { ModelsSummary } from "@/components/models/ModelsSummary";
import { ModelsProvider } from "@/components/ModelsProvider";

export const metadata: Metadata = {
  title: "Models & Pricing",
  description: "Compare official model prices with TokHive quotes for input, output and cached tokens.",
};

const HOW = [
  { t: "Pay per token", d: "No subscription and no minimum. Top up with card or USDC and draw down per 1M tokens." },
  {
    t: "Prices float with supply",
    d: "Displayed quotes reflect current provider supply. The applicable price is locked when your request is dispatched.",
  },
  {
    t: "Same tokens, same models",
    d: "Requests hit the official endpoint from inside a TEE. Model IDs and responses match the vendor API.",
  },
  {
    t: "Model-specific caching",
    d: "Cache read and write prices are shown where those billing items apply.",
  },
];

export default function ModelsPage() {
  return (
    <ModelsProvider offeredOnly>
      <main className="site-container models-page">
        <Nav />
        <header className="flex flex-wrap items-end justify-between gap-8 pt-[72px] pb-10 max-sm:pt-12">
          <div className="flex flex-col gap-4">
            <span className="eyebrow">MODELS &amp; PRICING</span>
            <h1 className="h1">
              Official models.
              <br />
              <span className="outline-word">Below list.</span>
            </h1>
          </div>
          <ModelsSummary />
        </header>

        <Suspense>
          <ModelsExplorer />
        </Suspense>

        <CostCalculator />

        <section className="flex flex-col gap-10 pt-24 pb-[120px]">
          <h2 className="h2">How pricing works.</h2>
          <StepList steps={HOW} className="grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6" />
        </section>
      </main>
      <Footer compact />
    </ModelsProvider>
  );
}
