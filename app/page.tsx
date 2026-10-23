import { Footer } from "@/components/Footer";
import { AgentTools } from "@/components/home/AgentTools";
import { Earnings } from "@/components/home/Earnings";
import { Hero } from "@/components/home/Hero";
import { HiveMenu } from "@/components/home/HiveMenu";
import { Pipeline } from "@/components/home/Pipeline";
import { PriceTape } from "@/components/home/PriceTape";
import { VerifiedOrigin } from "@/components/home/VerifiedOrigin";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <PriceTape />
        <VerifiedOrigin />
        <Pipeline />
        <Earnings />
        <HiveMenu />
        <AgentTools />
      </main>
      <Footer />
    </>
  );
}
