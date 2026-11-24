import { useTranslations } from "next-intl";
import { Accordion } from "@/components/Accordion";
import { ExperimentalTag } from "@/components/egress/ExperimentalTag";
import { FaqStructuredData } from "@/components/FaqStructuredData";
import { Footer } from "@/components/Footer";
import { HeadingPrefix } from "@/components/HeadingPrefix";
import { HexField } from "@/components/HexField";
import { Nav } from "@/components/Nav";
import { StepList } from "@/components/StepList";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/links";
import {
  HOST_FAQ,
  HOST_REQUIREMENTS,
  HOST_RISKS,
  HOST_SAFETY,
  HOST_STATEMENT,
  HOST_STATS,
  HOST_STEPS,
} from "@/lib/content/egress";

export function EgressHostsPage() {
  const t = useTranslations("EgressHosts");
  const faq = HOST_FAQ.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));

  return (
    <>
      <main className="egress-hosts-page">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-80">
            <HexField
              cols={40}
              rows={22}
              s={24}
              mode="sparkle"
              interval={240}
              burst={3}
              lit="rgba(200,240,49,.5)"
              line="rgba(242,242,238,.07)"
              fadeMs={1600}
              holdMin={400}
              holdMax={900}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0B0C_0%,rgba(10,11,12,.94)_48%,rgba(10,11,12,.62)_100%)]" />
          <div className="site-container relative">
            <Nav />
            <header className="grid items-center gap-14 pt-[72px] pb-20 lg:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-6">
                <ExperimentalTag label={t("hero.badge")} />
                <h1 className="provider-title text-[84px] leading-[.92] font-bold tracking-[-.055em] max-lg:text-[64px]">
                  <HeadingPrefix page="egressHosts" />
                  {t("hero.titleLine1")}
                  <br />
                  <span className="text-volt">{t("hero.titleLine2")}</span>
                </h1>
                <p className="max-w-[520px] text-[19px] leading-[1.5] text-pretty text-text-2">{t("hero.lead")}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href={LINKS.shareQuota} className="btn-primary">
                    {t("hero.cta")}
                  </a>
                  <a href="#how" className="btn-ghost px-[22px] py-3.5 text-[15px] font-semibold">
                    {t("hero.how")}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-card border border-paper/10 bg-surface/80 p-7 backdrop-blur-sm">
                <span className="font-mono text-[11px] font-medium tracking-[.1em] text-volt uppercase">{t("hero.cardTitle")}</span>
                {HOST_STATS.map((key) => (
                  <div key={key} className="flex items-baseline justify-between gap-4 border-b border-line-soft py-3 last:border-b-0">
                    <span className="text-sm text-muted">{t(`hero.stats.${key}.label`)}</span>
                    <span className="font-mono text-sm text-paper">{t(`hero.stats.${key}.value`)}</span>
                  </div>
                ))}
                <span className="pt-1 text-xs leading-[1.5] text-muted-2">{t("hero.cardNote")}</span>
              </div>
            </header>
          </div>
        </div>

        <div className="site-container">
          <section className="mt-10 rounded-card-lg border border-dashed border-warn/50 bg-warn/5 p-7 max-md:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <ExperimentalTag label={t("notice.tag")} />
                <h2 className="text-xl font-semibold tracking-[-.01em]">{t("notice.title")}</h2>
              </div>
              <p className="max-w-[900px] text-[15px] leading-[1.6] text-text-2">{t("notice.lead")}</p>
            </div>
          </section>

          <section id="how" className="content-section scroll-mt-8 border-t border-line pt-24">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
              <div className="section-intro">
                <span className="eyebrow">{t("steps.eyebrow")}</span>
                <h2 className="h2">{t("steps.title")}</h2>
              </div>
              <span className="font-mono text-[13px] text-muted">{t("steps.meta")}</span>
            </div>
            <StepList
              steps={HOST_STEPS.map((key) => ({ t: t(`steps.items.${key}.title`), d: t(`steps.items.${key}.description`) }))}
              className="grid-cols-4 gap-7 max-md:grid-cols-2 max-sm:grid-cols-1"
            />
          </section>

          <section className="content-section flex flex-col gap-10 pt-[120px]">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="section-intro">
                <span className="eyebrow">{t("safety.eyebrow")}</span>
                <h2 className="section-title">{t("safety.title")}</h2>
              </div>
              <a
                href={LINKS.providerSecurity}
                target="_blank"
                rel="noreferrer"
                className="border-b border-volt pb-0.5 text-sm font-semibold"
              >
                {t("safety.details")}
              </a>
            </div>
            <div className="grid gap-2.5 md:grid-cols-3">
              {HOST_SAFETY.map((key) => (
                <article key={key} className="flex flex-col gap-3 rounded-[18px] bg-surface p-7 transition-colors duration-300 hover:bg-surface-2">
                  <span className="font-mono text-[11px] font-medium tracking-[.1em] text-volt">{t(`safety.items.${key}.label`)}</span>
                  <h3 className="text-lg font-semibold">{t(`safety.items.${key}.title`)}</h3>
                  <p className="text-sm leading-[1.6] text-muted">{t(`safety.items.${key}.description`)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="content-section grid items-start gap-14 pt-[120px] lg:grid-cols-2">
            <div className="section-intro">
              <span className="eyebrow">{t("earnings.eyebrow")}</span>
              <h2 className="section-title">{t("earnings.title")}</h2>
              <p className="text-base leading-[1.6] text-text-2">{t("earnings.lead")}</p>
              <ul className="mt-2 flex flex-col gap-2.5 text-sm leading-[1.6] text-muted">
                {(["session", "holdback", "payout"] as const).map((key) => (
                  <li key={key} className="flex gap-2.5">
                    <span aria-hidden="true" className="font-mono text-volt">
                      ✓
                    </span>
                    {t(`earnings.items.${key}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="overflow-hidden rounded-card bg-surface font-mono">
              <div className="flex justify-between gap-3 border-b border-line-soft px-6 py-[18px] text-xs text-muted">
                <span>{t("earnings.statement.title")}</span>
                <span>{t("earnings.statement.illustrative")}</span>
              </div>
              {HOST_STATEMENT.map((r) => (
                <div key={r.key} className="flex items-baseline justify-between gap-4 border-b border-paper/6 px-6 py-[13px] text-[13px]">
                  <span>{t(`earnings.statement.${r.key}`)}</span>
                  <span className={r.key === "credited" ? "text-volt" : "text-muted"}>{r.value}</span>
                </div>
              ))}
              <p className="px-6 py-4 text-[11px] leading-[1.6] text-muted-2">{t("earnings.statement.note")}</p>
            </div>
          </section>

          <section className="content-section grid gap-12 pt-[120px] lg:grid-cols-[.85fr_1.15fr]">
            <div className="section-intro">
              <span className="eyebrow">{t("requirements.eyebrow")}</span>
              <h2 className="section-title">{t("requirements.title")}</h2>
              <p className="text-sm leading-[1.6] text-muted">{t("requirements.lead")}</p>
            </div>
            <ol className="border-t border-line">
              {HOST_REQUIREMENTS.map((key, i) => (
                <li key={key} className="grid grid-cols-[44px_1fr] gap-3 border-b border-line-soft py-4">
                  <span className="font-mono text-[13px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold">{t(`requirements.items.${key}.title`)}</h3>
                    <p className="mt-1 text-sm leading-[1.55] text-muted">{t(`requirements.items.${key}.description`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="content-section pt-[120px]">
            <div className="compliance-panel grid gap-12 rounded-card-lg border border-dashed border-warn/45 p-12 max-md:p-6 lg:grid-cols-2">
              <div className="section-intro">
                <span className="eyebrow">{t("risks.eyebrow")}</span>
                <h2 className="section-title">{t("risks.title")}</h2>
                <div className="flex flex-col gap-2 rounded-xl border border-warn/30 bg-warn/6 px-5 py-[18px]">
                  <span className="font-mono text-[11px] font-medium tracking-[.1em] text-warn">{t("risks.title2")}</span>
                  {HOST_RISKS.map((key) => (
                    <p key={key} className="text-[15px] leading-[1.6] text-link-footer">
                      {t(`risks.items.${key}`)}
                    </p>
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <Link href={`${LINKS.terms}#providers`} className="self-start border-b border-volt pb-0.5 text-sm font-semibold">
                    {t("risks.terms")}
                  </Link>
                  <Link href={LINKS.aup} className="self-start border-b border-volt pb-0.5 text-sm font-semibold">
                    {t("risks.aup")}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center gap-4">
                <p className="text-base leading-[1.65] text-text-2">{t("risks.isp")}</p>
                <p className="rounded-xl border border-paper/10 bg-surface px-5 py-[18px] text-sm leading-[1.6] text-muted">
                  {t("risks.consent")}
                </p>
              </div>
            </div>
          </section>

          <section className="content-section split-section grid gap-20 pt-[120px] lg:grid-cols-[360px_1fr]">
            <div className="section-intro">
              <span className="eyebrow">{t("faq.eyebrow")}</span>
              <h2 className="section-title">{t("faq.title")}</h2>
            </div>
            <Accordion items={faq} />
            <FaqStructuredData items={faq} />
          </section>

          <section className="provider-cta my-[120px] flex flex-wrap items-center justify-between gap-8 rounded-card-lg bg-volt p-14 text-ink max-md:my-16 max-md:p-7">
            <div className="flex flex-col gap-2.5">
              <h2 className="text-5xl leading-none font-bold tracking-[-.04em] max-md:text-[34px]">{t("cta.title")}</h2>
              <p>{t("cta.lead")}</p>
            </div>
            <div className="flex flex-col gap-3 max-md:w-full">
              <a href={LINKS.shareQuota} className="rounded-full bg-ink px-[26px] py-4 text-center font-semibold whitespace-nowrap text-paper">
                {t("cta.button")}
              </a>
              <Link href="/egress" className="text-center text-sm font-semibold underline underline-offset-4">
                {t("cta.buyers")}
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer compact />
    </>
  );
}
