import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { StepList } from "@/components/StepList";
import { CostCalculator } from "@/components/models/CostCalculator";
import { ModelsExplorer } from "@/components/models/ModelsExplorer";
import { MODELS } from "@/lib/mock/models";

export const metadata: Metadata = {
  title: "Models & Pricing",
  description: "Official Claude, GPT, Gemini and more, below list price. Live capacity and per-token pricing.",
};

const HOW = [
  { t: "Pay per token", d: "No subscription and no minimum. Top up with card or USDC and draw down per 1M tokens." },
  {
    t: "Prices float with supply",
    d: "Rates reprice hourly from pooled provider capacity, and they never go above the vendor list price.",
  },
  {
    t: "Same tokens, same models",
    d: "Requests hit the official endpoint from inside a TEE. Model IDs and responses match the vendor API.",
  },
  {
    t: "Cache reads included",
    d: "Prompt caching is passed through at the discounted rate, so long agent sessions get cheaper.",
  },
];

function Stat({ value, label, accent }: { value: string | number; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`font-mono text-[34px] font-medium tracking-[-0.03em] ${accent ? "text-volt" : ""}`}>{value}</span>
      <span className="font-mono text-xs text-muted">{label}</span>
    </div>
  );
}

export default function ModelsPage() {
  return (
    <>
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
          <div className="flex gap-10">
            <Stat value="−58%" label="avg. vs list" accent />
            <Stat value={MODELS.length} label="models live" />
            <Stat value={0} label="monthly fee" />
          </div>
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
    </>
  );
}
