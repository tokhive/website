import { useTranslations } from "next-intl";
import { Accordion } from "@/components/Accordion";
import { CopyButton } from "@/components/CopyButton";
import { ExperimentalTag } from "@/components/egress/ExperimentalTag";
import { EgressTape } from "@/components/egress/EgressTape";
import { SessionLifecycle } from "@/components/egress/SessionLifecycle";
import { FaqStructuredData } from "@/components/FaqStructuredData";
import { Footer } from "@/components/Footer";
import { HeadingPrefix } from "@/components/HeadingPrefix";
import { HexField } from "@/components/HexField";
import { Nav } from "@/components/Nav";
import { StepList } from "@/components/StepList";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/links";
import {
  EGRESS_CLIENTS,
  EGRESS_FAQ,
  EGRESS_LIMITS,
  EGRESS_PRICING,
  EGRESS_SAMPLE,
  EGRESS_STEPS,
  EGRESS_SUBSCRIPTION,
  EGRESS_VISIBILITY,
  EGRESS_VISIBILITY_COLUMNS,
} from "@/lib/content/egress";

export function EgressPage() {
  const t = useTranslations("Egress");
  const faq = EGRESS_FAQ.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }));

  return (
    <>
      <main className="egress-page">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-80">
            <HexField
              cols={40}
              rows={22}
              s={24}
              mode="flow"
              interval={180}
              lit="rgba(200,240,49,.45)"
              line="rgba(242,242,238,.07)"
              fadeMs={1400}
              holdMin={300}
              holdMax={700}
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#0A0B0C_0%,rgba(10,11,12,.94)_48%,rgba(10,11,12,.62)_100%)]" />
          <div className="site-container relative">
            <Nav />
            <header className="grid items-end gap-14 pt-[72px] pb-16 lg:grid-cols-[1fr_330px]">
              <div className="section-intro">
                <ExperimentalTag label={t("hero.badge")} />
                <h1 className="h1">
                  <HeadingPrefix page="egress" />
                  {t("hero.titleLine1")}
                  <br />
                  <span className="text-volt">{t("hero.titleLine2")}</span>
                </h1>
                <p className="max-w-[620px] text-[19px] leading-[1.5] text-pretty text-text-2">{t("hero.lead")}</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <a href={LINKS.getApiKey} className="btn-primary">
                    {t("hero.cta")}
                  </a>
                  <a href="#how" className="btn-ghost px-[22px] py-3.5 text-[15px] font-semibold">
                    {t("hero.how")}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-4 rounded-card border border-volt/35 bg-surface/70 p-6 backdrop-blur-sm max-md:hidden">
                <SessionLifecycle />
                <span className="text-xs leading-[1.5] text-muted">{t("hero.cardNote")}</span>
              </div>
            </header>
          </div>
        </div>

        <EgressTape />

        <div className="site-container">
          <section className="mt-10 rounded-card-lg border border-dashed border-warn/50 bg-warn/5 p-7 max-md:p-5">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <ExperimentalTag label={t("notice.tag")} />
                <h2 className="text-xl font-semibold tracking-[-.01em]">{t("notice.title")}</h2>
              </div>
              <p className="max-w-[860px] text-[15px] leading-[1.6] text-text-2">{t("notice.lead")}</p>
              <ul className="grid gap-2.5 text-sm leading-[1.6] text-muted md:grid-cols-3">
                {(["relay", "sla", "changes"] as const).map((key) => (
                  <li key={key} className="flex gap-2.5">
                    <span aria-hidden="true" className="font-mono text-warn">
                      !
                    </span>
                    {t(`notice.items.${key}`)}
                  </li>
                ))}
              </ul>
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
            <StepList steps={EGRESS_STEPS.map((key) => ({ t: t(`steps.items.${key}.title`), d: t(`steps.items.${key}.description`) }))} className="grid-cols-4 gap-7 max-md:grid-cols-2 max-sm:grid-cols-1" />
          </section>

          <section className="content-section grid items-start gap-12 pt-[120px] lg:grid-cols-[1fr_1.1fr]">
            <div className="section-intro">
              <span className="eyebrow">{t("protocol.eyebrow")}</span>
              <h2 className="section-title">{t("protocol.title")}</h2>
              <p className="text-base leading-[1.6] text-text-2">{t("protocol.lead")}</p>
              <p className="text-sm leading-[1.6] text-muted">{t("protocol.note")}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
                <a href={LINKS.docs} target="_blank" rel="noreferrer" className="border-b border-volt pb-0.5">
                  {t("protocol.docs")}
                </a>
                <a href={LINKS.aup} className="border-b border-volt pb-0.5">
                  {t("protocol.aup")}
                </a>
              </div>
            </div>
            <div className="min-w-0 overflow-hidden rounded-2xl border border-paper/10 bg-surface">
              <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5 font-mono text-xs text-muted">
                <span>{t("protocol.terminal")}</span>
                <CopyButton text={EGRESS_SAMPLE} />
              </div>
              <pre className="overflow-x-auto px-[22px] py-5 font-mono text-[12.5px] leading-[1.9] text-code max-md:text-[11px]">
                {EGRESS_SAMPLE}
              </pre>
              <dl className="grid grid-cols-[96px_1fr] gap-y-2 border-t border-line-soft px-[22px] py-4 font-mono text-xs">
                {(["auth", "tls", "scheme"] as const).map((key) => (
                  <div key={key} className="contents">
                    <dt className="text-muted">{t(`protocol.fields.${key}.label`)}</dt>
                    <dd className="text-text-2">{t(`protocol.fields.${key}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="content-section grid items-start gap-12 pt-[120px] lg:grid-cols-[1fr_1.1fr]">
            <div className="section-intro">
              <span className="eyebrow">{t("clients.eyebrow")}</span>
              <h2 className="section-title">{t("clients.title")}</h2>
              <p className="text-base leading-[1.6] text-text-2">{t("clients.lead")}</p>
              <ul className="flex flex-col gap-4">
                {EGRESS_CLIENTS.map((key) => (
                  <li key={key} className="flex flex-col gap-1.5 border-l border-line pl-4">
                    <span className="text-sm font-semibold">{t(`clients.items.${key}.title`)}</span>
                    <span className="text-sm leading-[1.6] text-muted">{t(`clients.items.${key}.description`)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm leading-[1.6] text-muted">{t("clients.note")}</p>
            </div>
            <div className="min-w-0 overflow-hidden rounded-2xl border border-paper/10 bg-surface">
              <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5 font-mono text-xs text-muted">
                <span>{t("clients.terminal")}</span>
                <CopyButton text={EGRESS_SUBSCRIPTION} />
              </div>
              <pre className="overflow-x-auto px-[22px] py-5 font-mono text-[12.5px] leading-[1.9] text-code max-md:text-[11px]">
                {EGRESS_SUBSCRIPTION}
              </pre>
              <dl className="grid grid-cols-[96px_1fr] gap-y-2 border-t border-line-soft px-[22px] py-4 font-mono text-xs">
                {(["format", "header"] as const).map((key) => (
                  <div key={key} className="contents">
                    <dt className="text-muted">{t(`clients.fields.${key}.label`)}</dt>
                    <dd className="text-text-2">{t(`clients.fields.${key}.value`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          <section className="content-section grid gap-12 pt-[120px] lg:grid-cols-[.8fr_1.2fr]">
            <div className="section-intro">
              <span className="eyebrow">{t("pricing.eyebrow")}</span>
              <h2 className="section-title">{t("pricing.title")}</h2>
              <p className="text-base leading-[1.6] text-text-2">{t("pricing.lead")}</p>
              <p className="rounded-xl border border-dashed border-volt/35 p-4 font-mono text-xs leading-[1.7] text-text-2">
                {t("pricing.note")}
              </p>
            </div>
            <dl className="overflow-hidden rounded-card bg-surface">
              <div className="hidden grid-cols-[.9fr_1.1fr_1.4fr] gap-4 border-b border-line-soft px-6 py-3.5 font-mono text-[11px] tracking-[.06em] text-muted-2 md:grid">
                <span>{t("pricing.columns.item")}</span>
                <span>{t("pricing.columns.value")}</span>
                <span>{t("pricing.columns.detail")}</span>
              </div>
              {EGRESS_PRICING.map((key) => (
                <div
                  key={key}
                  className="flex flex-col gap-1 border-b border-paper/6 px-6 py-4 last:border-b-0 md:grid md:grid-cols-[.9fr_1.1fr_1.4fr] md:items-baseline md:gap-4"
                >
                  <dt className="text-sm font-semibold">{t(`pricing.items.${key}.label`)}</dt>
                  <dd className="font-mono text-sm text-volt">{t(`pricing.items.${key}.value`)}</dd>
                  <dd className="text-[13px] leading-[1.5] text-muted">{t(`pricing.items.${key}.detail`)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="content-section grid gap-12 pt-[120px] lg:grid-cols-[.85fr_1.15fr]">
            <div className="section-intro">
              <span className="eyebrow">{t("visibility.eyebrow")}</span>
              <h2 className="section-title">{t("visibility.title")}</h2>
              <p className="text-sm leading-[1.6] text-muted">{t("visibility.lead")}</p>
            </div>
            <div className="overflow-hidden rounded-card bg-surface">
              <table className="visibility-matrix w-full table-fixed border-collapse">
                <thead>
                  <tr className="border-b border-line-soft font-mono text-[11px] tracking-[.06em] text-muted-2">
                    <th aria-label={t("visibility.party")} />
                    {EGRESS_VISIBILITY_COLUMNS.map((col) => (
                      <th key={col} scope="col">
                        <span className="max-md:hidden">{t(`visibility.columns.${col}`)}</span>
                        <span className="md:hidden">{t(`visibility.columns.${col}Short`)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EGRESS_VISIBILITY.map((r) => (
                    <tr key={r.who} className="border-b border-paper/6">
                      <th scope="row" className="text-left text-[15px] font-semibold">
                        {t(`visibility.parties.${r.who}`)}
                      </th>
                      {r.cells.map((visible, i) => (
                        <td key={i}>
                          <span
                            aria-label={visible ? t("visibility.canSee") : t("visibility.cannotSee")}
                            className={`clip-hex mx-auto flex h-8 w-7 items-center justify-center font-mono text-[13px] ${visible ? "bg-volt text-ink" : "bg-surface-2 text-muted-2"}`}
                          >
                            {visible ? "✓" : "—"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="px-6 py-3.5 font-mono text-xs leading-[1.6] text-muted">{t("visibility.note")}</p>
            </div>
          </section>

          <section className="content-section pt-[120px]">
            <div className="section-intro mb-9">
              <span className="eyebrow">{t("limits.eyebrow")}</span>
              <h2 className="section-title">{t("limits.title")}</h2>
            </div>
            <div className="grid gap-2.5 md:grid-cols-2">
              {EGRESS_LIMITS.map((key) => (
                <article key={key} className="flex gap-4 rounded-[18px] bg-surface p-6 transition-colors duration-300 hover:bg-surface-2">
                  <span aria-hidden="true" className="clip-hex mt-0.5 flex h-8 w-7 shrink-0 items-center justify-center bg-surface-2 font-mono text-sm text-warn">
                    !
                  </span>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold">{t(`limits.items.${key}.title`)}</h3>
                    <p className="text-sm leading-[1.6] text-muted">{t(`limits.items.${key}.description`)}</p>
                  </div>
                </article>
              ))}
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
              <a
                href={LINKS.getApiKey}
                className="rounded-full bg-ink px-[26px] py-4 text-center font-semibold whitespace-nowrap text-paper"
              >
                {t("cta.button")}
              </a>
              <Link href="/egress/hosts" className="text-center text-sm font-semibold underline underline-offset-4">
                {t("cta.hosts")}
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer compact />
    </>
  );
}
