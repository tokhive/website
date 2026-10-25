import { Footer } from "@/components/Footer";
import { AgentTools } from "@/components/home/AgentTools";
import { Earnings } from "@/components/home/Earnings";
import { Hero } from "@/components/home/Hero";
import { HiveMenu } from "@/components/home/HiveMenu";
import { Pipeline } from "@/components/home/Pipeline";
import { PriceTape } from "@/components/home/PriceTape";
import { VerifiedOrigin } from "@/components/home/VerifiedOrigin";
import { Faq } from "@/components/home/Faq";
import { LINKS } from "@/lib/links";
import Link from "next/link";

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
        <Faq />
        <div className="site-container mb-14 grid grid-cols-2 gap-2 md:hidden">
          <Link
            href="/providers"
            className="flex min-h-[132px] flex-col justify-between gap-5 rounded-[18px] bg-volt px-[18px] py-5 text-ink"
          >
            <span className="font-mono text-[11px] tracking-[.1em]">HAVE IDLE QUOTA?</span>
            <span className="text-lg font-bold tracking-[-.02em]">Start earning →</span>
          </Link>
          <a
            href={LINKS.getApiKey}
            className="flex min-h-[132px] flex-col justify-between gap-5 rounded-[18px] bg-paper px-[18px] py-5 text-ink"
          >
            <span className="font-mono text-[11px] tracking-[.1em]">NEED TOKENS?</span>
            <span className="text-lg font-bold tracking-[-.02em]">Get API key →</span>
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
