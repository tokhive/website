import { useTranslations } from "next-intl";
import { Accordion } from "@/components/Accordion";
import { Footer } from "@/components/Footer";
import { HexField } from "@/components/HexField";
import { Nav } from "@/components/Nav";
import { EarningsProvider } from "@/components/home/EarningsProvider";
import { EarningsCalculator } from "@/components/providers/EarningsCalculator";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/links";
import {
  SETTLEMENT_EXAMPLE,
  SETTLEMENT_STATS,
  SETTLEMENT_TOTAL,
  PROVIDER_CONTROLS,
  PROVIDER_FAQ,
  PROVIDER_RISKS,
  PROVIDER_SAFETY,
  PROVIDER_STEPS,
} from "@/lib/content/providers";

export function ProvidersPage() {
  const t = useTranslations("Providers");
  const faq = PROVIDER_FAQ.map((key) => ({ question: t(`faq.items.${key}.question`), answer: t(`faq.items.${key}.answer`) }));
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
                <span className="eyebrow">{t("hero.eyebrow")}</span>
                <h1 className="provider-title text-[84px] leading-[.92] font-bold tracking-[-.055em]">
                  {t("hero.titleLine1")}
                  <br />
                  <span className="text-volt">{t("hero.titleLine2")}</span>
                </h1>
                <p className="max-w-[520px] text-[19px] leading-[1.5] text-pretty text-text-2">
                  {t("hero.lead")}
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href={LINKS.connectPlan} className="btn-primary">
                    {t("hero.connect")}
                  </a>
                  <a href="#how" className="btn-ghost px-[22px] py-3.5 text-[15px] font-semibold">
                    {t("hero.how")}
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
              <h2 className="h2">{t("steps.title")}</h2>
              <span className="font-mono text-[13px] text-muted">{t("steps.setup")}</span>
            </div>
            <ol className="provider-steps grid grid-cols-3 gap-2.5">
              {PROVIDER_STEPS.map((key, i) => (
                <li
                  key={key}
                  className={`clip-chevron flex min-h-60 flex-col gap-3.5 px-11 pt-8 pb-9 ${i === 2 ? "bg-volt text-ink" : i === 1 ? "bg-surface-2" : "bg-surface"}`}
                >
                  <span className={`font-mono text-[13px] ${i === 1 ? "text-volt" : "opacity-70"}`}>0{i + 1}</span>
                  <h3 className="text-2xl font-semibold tracking-[-.02em]">{t(`steps.items.${key}.title`)}</h3>
                  <p className="text-[15px] leading-[1.55] text-pretty opacity-80">{t(`steps.items.${key}.description`)}</p>
                  <span className="mt-auto pt-2 font-mono text-xs opacity-70">{t(`steps.items.${key}.meta`)}</span>
                </li>
              ))}
            </ol>
          </section>
          <section className="content-section split-section grid gap-[72px] pt-[120px] lg:grid-cols-[360px_1fr]">
            <div className="section-intro">
              <span className="eyebrow">{t("controls.eyebrow")}</span>
              <h2 className="section-title">{t("controls.title")}</h2>
              <p className="text-base leading-[1.6] text-text-2">
                {t("controls.lead")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-md:grid-cols-1">
              {PROVIDER_CONTROLS.map((key, i) => (
                <article key={key} className="flex flex-col gap-3 rounded-[18px] bg-surface p-7">
                  <span className="clip-hex flex h-[46px] w-10 items-center justify-center bg-surface-2 font-mono text-[13px] text-volt">
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-semibold">{t(`controls.items.${key}.title`)}</h3>
                  <p className="text-sm leading-[1.6] text-muted">{t(`controls.items.${key}.description`)}</p>
                </article>
              ))}
            </div>
          </section>
          <section className="content-section pt-[120px]">
            <div className="compliance-panel grid gap-12 rounded-card-lg border border-dashed border-volt/50 p-12 lg:grid-cols-2">
              <div className="section-intro">
                <span className="eyebrow">{t("compliance.eyebrow")}</span>
                <h2 className="section-title">{t("compliance.title")}</h2>
                <div className="flex flex-col gap-2 rounded-xl border border-volt/30 bg-volt/6 px-5 py-[18px]">
                  <span className="font-mono text-[11px] font-medium tracking-[.1em] text-volt">
                    {t("compliance.risksTitle")}
                  </span>
                  {PROVIDER_RISKS.map((key) => (
                    <p key={key} className="text-[15px] leading-[1.6] text-link-footer">
                      {t(`compliance.risks.${key}`)}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Link href={`${LINKS.terms}#providers`} className="self-start border-b border-volt pb-0.5 text-sm font-semibold">
                    {t("compliance.terms")}
                  </Link>
                  <Link href={LINKS.aup} className="self-start border-b border-volt pb-0.5 text-sm font-semibold">
                    {t("compliance.aup")}
                  </Link>
                </div>
              </div>
              <div>
                {PROVIDER_SAFETY.map((key) => (
                  <div key={key} className="grid grid-cols-[28px_1fr] gap-3.5 border-b border-line-soft py-[18px]">
                    <span className="font-mono text-sm text-volt">✓</span>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold">{t(`compliance.safety.${key}.title`)}</h3>
                      <p className="text-sm leading-[1.55] text-muted">{t(`compliance.safety.${key}.description`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="content-section grid items-start gap-14 pt-[120px] lg:grid-cols-2">
            <div className="section-intro">
              <span className="eyebrow">{t("settlement.eyebrow")}</span>
              <h2 className="section-title">{t("settlement.title")}</h2>
              <p className="text-base leading-[1.6] text-text-2">
                {t("settlement.lead")}
              </p>
              <div className="mt-3 grid grid-cols-3 gap-5">
                {SETTLEMENT_STATS.map((key) => (
                  <div key={key} className="flex flex-col gap-1 border-t border-paper/20 pt-3">
                    <span className="font-mono text-2xl font-medium tracking-[-.02em] max-md:text-lg">{t(`settlement.stats.${key}.value`)}</span>
                    <span className="text-[13px] text-muted">{t(`settlement.stats.${key}.label`)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="payout-statement overflow-hidden rounded-card bg-surface font-mono">
              <div className="flex justify-between gap-3 border-b border-line-soft px-6 py-[18px] text-xs text-muted">
                <span>{t("settlement.example")}</span>
                <span>{t("settlement.illustrative")}</span>
              </div>
              {SETTLEMENT_EXAMPLE.map((r) => (
                <div
                  key={r.model ?? "cache"}
                  className="grid grid-cols-[1.4fr_1fr_1fr] gap-3 border-b border-paper/6 px-6 py-[13px] text-[13px]"
                >
                  <span>{r.model ?? t("settlement.cacheReads")}</span>
                  <span className="text-right text-muted">{t("settlement.tokens", { tokens: r.tokens })}</span>
                  <span className="text-right">{r.amount}</span>
                </div>
              ))}
              <div className="flex items-center justify-between px-6 py-[18px] text-sm">
                <span className="text-muted">{t("settlement.credited")}</span>
                <span className="text-[22px] font-medium text-volt">{SETTLEMENT_TOTAL}</span>
              </div>
            </div>
          </section>
          <section className="content-section split-section grid gap-20 pt-[120px] lg:grid-cols-[360px_1fr]">
            <div className="section-intro">
              <span className="eyebrow">{t("faq.eyebrow")}</span>
              <h2 className="section-title">{t("faq.title")}</h2>
            </div>
            <Accordion items={faq} />
          </section>
          <section className="provider-cta my-[120px] flex flex-wrap items-center justify-between gap-8 rounded-card-lg bg-volt p-14 text-ink">
            <div className="flex flex-col gap-2.5">
              <h2 className="text-5xl leading-none font-bold tracking-[-.04em]">{t("cta.title")}</h2>
              <p>{t("cta.lead")}</p>
            </div>
            <a
              href={LINKS.connectPlan}
              className="rounded-full bg-ink px-[26px] py-4 font-semibold whitespace-nowrap text-paper"
            >
              {t("cta.connect")}
            </a>
          </section>
        </div>
      </main>
      <Footer compact />
    </>
  );
}
