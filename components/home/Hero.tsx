import { HexField } from "@/components/HexField";
import { LogoMark } from "@/components/Logo";
import { Nav } from "@/components/Nav";
import { LINKS } from "@/lib/links";
import { HERO_STATS } from "@/lib/mock/home";

export function Hero() {
  return (
    <section className="relative min-[900px]:h-[720px]">
      <div className="absolute inset-0 overflow-hidden">
        <HexField
          cols={34}
          rows={20}
          s={24}
          mode="flow"
          interval={120}
          lit="rgba(200,240,49,.45)"
          line="rgba(242,242,238,.07)"
          fadeMs={1400}
          holdMin={60}
          holdMax={60}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,11,12,.5)_0%,rgba(10,11,12,.2)_30%,rgba(10,11,12,.88)_55%,#0A0B0C_80%)]" />

      <div className="relative mx-auto flex h-full max-w-[1280px] flex-col">
        <div className="site-px">
          <Nav />
        </div>
        <div className="relative grid flex-1 grid-cols-1 min-[900px]:grid-cols-2">
          <div className="flex flex-col gap-6 border-line-hero px-12 pt-24 pb-16 max-[899px]:border-b max-sm:px-4 max-sm:pt-16 min-[900px]:border-r min-[900px]:pr-14">
            <span className="eyebrow">PROVIDERS</span>
            <div className="giant-word text-volt">Earn.</div>
            <p className="max-w-[440px] text-xl leading-[1.45] text-pretty">
              Monetize the idle tokens in your Claude, ChatGPT or Gemini subscription.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
              <a href={LINKS.shareQuota} className="btn-primary">
                Share your quota →
              </a>
              <span className="font-mono text-[13px] text-muted">{HERO_STATS.paidOut}</span>
            </div>
          </div>
          <div className="flex flex-col gap-6 px-12 pt-24 pb-16 max-sm:px-4 max-sm:pt-16 min-[900px]:pl-14">
            <span className="eyebrow text-paper">BUILDERS</span>
            <div className="giant-word outline-word self-start">Save.</div>
            <p className="max-w-[440px] text-xl leading-[1.45] text-pretty">
              Access official AI for less: Claude, GPT and Gemini from the vendors, TEE-verified.
            </p>
            <div className="mt-auto flex flex-wrap items-center gap-4 pt-4">
              <a href={LINKS.getApiKey} className="btn-secondary">
                Get API key →
              </a>
              <span className="font-mono text-[13px] text-muted">{HERO_STATS.avgSaving}</span>
            </div>
          </div>
          <div className="clip-hex absolute top-[44%] left-1/2 flex h-32 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-bg max-[899px]:hidden">
            <LogoMark size={70} />
          </div>
        </div>
      </div>
    </section>
  );
}
