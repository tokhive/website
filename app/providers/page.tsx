import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { Footer } from "@/components/Footer";
import { HexField } from "@/components/HexField";
import { Nav } from "@/components/Nav";
import { EarningsProvider } from "@/components/home/EarningsProvider";
import { EarningsCalculator } from "@/components/providers/EarningsCalculator";
import { LINKS } from "@/lib/links";
import {
  SETTLEMENT_EXAMPLE,
  SETTLEMENT_TOTAL,
  PROVIDER_CONTROLS,
  PROVIDER_FAQ,
  PROVIDER_RISKS,
  PROVIDER_SAFETY,
  PROVIDER_STEPS,
} from "@/lib/content/providers";

export const metadata: Metadata = {
  title: "Providers",
  description: "Earn from idle AI subscription quota with real-time settlement. Withdraw from your wallet in Web3 stablecoins with a $10 minimum.",
};

export default function ProvidersPage() {
  return (
    <>
      <main className="providers-page">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-90">
            <HexField
              cols={40}
              rows={22}
              s={24}
              mode="sparkle"
              interval={220}
              burst={3}
              lit="rgba(200,240,49,.5)"
              line="rgba(242,242,238,.07)"
              fadeMs={1600}
              holdMin={400}
              holdMax={400}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0B0C_0%,rgba(10,11,12,.92)_45%,rgba(10,11,12,.6)_100%)]" />
          <div className="site-container relative">
            <Nav />
            <header className="provider-hero grid items-center gap-14 pt-[72px] pb-24 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-6">
                <span className="eyebrow">For providers</span>
                <h1 className="provider-title text-[84px] leading-[.92] font-bold tracking-[-.055em]">
                  Your plan resets.
                  <br />
                  <span className="text-volt">Your earnings don&apos;t.</span>
                </h1>
                <p className="max-w-[520px] text-[19px] leading-[1.5] text-pretty text-text-2">
                  Share unused quota from your Claude or ChatGPT subscription and earn as each successful
                  request settles in real time. You can stop sharing at any time.
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href={LINKS.connectPlan} className="btn-primary">
                    Connect a plan →
                  </a>
                  <a href="#how" className="btn-ghost px-[22px] py-3.5 text-[15px] font-semibold">
                    How it works
                  </a>
                </div>
              </div>
              <EarningsProvider>
                <EarningsCalculator />
              </EarningsProvider>
            </header>
          </div>
        </div>
        <div className="site-container">
          <section id="how" className="content-section scroll-mt-8 border-t border-line pt-24">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <h2 className="h2">Three steps to your first earnings.</h2>
              <span className="font-mono text-[13px] text-muted">~3 minutes to set up</span>
            </div>
            <ol className="provider-steps grid grid-cols-3 gap-2.5">
              {PROVIDER_STEPS.map((s, i) => (
                <li
                  key={s.title}
                  className={`clip-chevron flex min-h-60 flex-col gap-3.5 px-11 pt-8 pb-9 ${i === 2 ? "bg-volt text-ink" : i === 1 ? "bg-surface-2" : "bg-surface"}`}
                >
                  <span className={`font-mono text-[13px] ${i === 1 ? "text-volt" : "opacity-70"}`}>0{i + 1}</span>
                  <h3 className="text-2xl font-semibold tracking-[-.02em]">{s.title}</h3>
                  <p className="text-[15px] leading-[1.55] text-pretty opacity-80">{s.description}</p>
                  <span className="mt-auto pt-2 font-mono text-xs opacity-70">{s.meta}</span>
                </li>
              ))}
            </ol>
          </section>
          <section className="content-section split-section grid gap-[72px] pt-[120px] lg:grid-cols-[360px_1fr]">
            <div className="section-intro">
              <span className="eyebrow">You stay in control</span>
              <h2 className="section-title">Share on your terms.</h2>
              <p className="text-base leading-[1.6] text-text-2">
                Choose when to share. Stop sharing whenever you need your subscription quota for your own work.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-md:grid-cols-1">
              {PROVIDER_CONTROLS.map((c, i) => (
                <article key={c.title} className="flex flex-col gap-3 rounded-[18px] bg-surface p-7">
                  <span className="clip-hex flex h-[46px] w-10 items-center justify-center bg-surface-2 font-mono text-[13px] text-volt">
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{c.title}</h3>
                  <p className="text-sm leading-[1.6] text-muted">{c.description}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="content-section pt-[120px]">
            <div className="compliance-panel grid gap-12 rounded-card-lg border border-dashed border-volt/50 p-12 lg:grid-cols-2">
              <div className="section-intro">
                <span className="eyebrow">Account safety &amp; compliance</span>
                <h2 className="section-title">Is sharing my plan allowed?</h2>
                <div className="flex flex-col gap-2 rounded-xl border border-volt/30 bg-volt/6 px-5 py-[18px]">
                  <span className="font-mono text-[11px] font-medium tracking-[.1em] text-volt">
                    RISKS YOU TAKE ON
                  </span>
                  {PROVIDER_RISKS.map((p) => (
                    <p key={p} className="text-[15px] leading-[1.6] text-link-footer">
                      {p}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <a href={`${LINKS.terms}#providers`} className="self-start border-b border-volt pb-0.5 text-sm font-semibold">
                    Read the Terms for Providers →
                  </a>
                  <a href={LINKS.aup} className="self-start border-b border-volt pb-0.5 text-sm font-semibold">
                    Read the Acceptable Use Policy →
                  </a>
                </div>
              </div>
              <div>
                {PROVIDER_SAFETY.map((s) => (
                  <div key={s.title} className="grid grid-cols-[28px_1fr] gap-3.5 border-b border-line-soft py-[18px]">
                    <span className="font-mono text-sm text-volt">✓</span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold">{s.title}</h3>
                      <p className="text-sm leading-[1.55] text-muted">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="content-section grid items-start gap-14 pt-[120px] lg:grid-cols-2">
            <div className="section-intro">
              <span className="eyebrow">Settlement &amp; withdrawals</span>
              <h2 className="section-title">Earnings settle in real time.</h2>
              <p className="text-base leading-[1.6] text-text-2">
                Each successful request credits your earnings balance as it settles. Withdraw from your wallet in
                Web3 stablecoins, with a $10 minimum withdrawal and a network fee based on the actual on-chain cost.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-5">
                {[
                  ["Real time", "earnings settlement"],
                  ["$10", "minimum withdrawal"],
                  ["Web3", "stablecoin withdrawals"],
                ].map(([v, l]) => (
                  <div key={l} className="flex flex-col gap-1 border-t border-paper/20 pt-3">
                    <span className="font-mono text-2xl font-medium tracking-[-.02em] max-md:text-lg">{v}</span>
                    <span className="text-[13px] text-muted">{l}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="payout-statement overflow-hidden rounded-card bg-surface font-mono">
              <div className="flex justify-between gap-3 border-b border-line-soft px-6 py-[18px] text-xs text-muted">
                <span>SETTLEMENT EXAMPLE</span>
                <span>Illustrative figures</span>
              </div>
              {SETTLEMENT_EXAMPLE.map((r) => (
                <div
                  key={r.model}
                  className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 border-b border-paper/6 px-6 py-[13px] text-[13px]"
                >
                  <span>{r.model}</span>
                  <span className="text-right text-muted">{r.tokens}</span>
                  <span className="text-right">{r.amount}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-6 py-[18px] text-sm">
                <span className="text-muted">Credited to earnings balance</span>
                <span className="text-[22px] font-medium text-volt">{SETTLEMENT_TOTAL}</span>
              </div>
            </div>
          </section>
          <section className="content-section split-section grid gap-20 pt-[120px] lg:grid-cols-[360px_1fr]">
            <div className="section-intro">
              <span className="eyebrow">Provider FAQ</span>
              <h2 className="section-title">Before you connect.</h2>
            </div>
            <Accordion items={PROVIDER_FAQ} />
          </section>
          <section className="provider-cta my-[120px] flex flex-wrap items-center justify-between gap-8 rounded-card-lg bg-volt p-14 text-ink">
            <div className="flex flex-col gap-2.5">
              <h2 className="text-5xl leading-none font-bold tracking-[-.04em]">Put your idle quota to work.</h2>
              <p>Connect in minutes. Stop whenever you want.</p>
            </div>
            <a
              href={LINKS.connectPlan}
              className="rounded-full bg-ink px-[26px] py-4 font-semibold whitespace-nowrap text-paper"
            >
              Connect a plan →
            </a>
          </section>
        </div>
      </main>
      <Footer compact />
    </>
  );
}
