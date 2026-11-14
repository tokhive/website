import { useTranslations } from "next-intl";
import { CopyButton } from "@/components/CopyButton";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { Link } from "@/i18n/navigation";
import { LINKS } from "@/lib/links";
import {
  DATA,
  ENCLAVE,
  HEROSTATS,
  OSS,
  RELEASE_SIGNING,
  VERIFY,
  VERIFY_COMMAND,
  VISIBILITY,
} from "@/lib/content/security";
import { VerifyTerminal } from "@/components/security/VerifyTerminal";

function Arrow() {
  return (
    <span className="flow-arrow flex items-center justify-center font-mono text-base text-muted-2" aria-hidden="true">
      <span className="hidden md:inline">→</span>
      <span className="md:hidden">↓</span>
    </span>
  );
}

const code = (chunks: React.ReactNode) => <code>{chunks}</code>;

export function SecurityPage() {
  const t = useTranslations("Security");
  return (
    <>
      <main className="site-container security-page">
        <Nav />
        <header className="security-hero grid items-end gap-14 border-b border-line pt-[72px] pb-14 lg:grid-cols-[1fr_240px]">
          <div className="section-intro">
            <span className="eyebrow">{t("hero.eyebrow")}</span>
            <h1 className="h1">
              {t("hero.titleLine1")}
              <br />
              <span className="outline-word">{t("hero.titleLine2")}</span>
            </h1>
            <p className="max-w-[620px] text-[19px] leading-[1.5] text-pretty text-text-2">
              {t("hero.lead")}
            </p>
          </div>
          <div className="security-stats flex flex-col gap-5">
            {HEROSTATS.map((s) => (
              <div key={s.key} className="flex flex-col gap-0.5 border-t border-paper/20 pt-2.5">
                <span className="font-mono text-[30px] font-medium tracking-[-.03em]" style={{ color: s.c }}>
                  {s.v}
                </span>
                <span className="text-[13px] text-muted">{t(`hero.stats.${s.key}`)}</span>
              </div>
            ))}
          </div>
        </header>
        <section className="content-section flex flex-col gap-9 pt-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="section-intro">
              <span className="eyebrow">{t("architecture.eyebrow")}</span>
              <h2 className="h2">{t("architecture.title")}</h2>
            </div>
            <span className="font-mono text-[13px] text-muted">{t("architecture.tech")}</span>
          </div>
          <div className="architecture-flow">
            <div className="architecture-node rounded-2xl bg-surface p-[22px]">
              <span className="font-mono text-[11px] text-muted-2">{t("architecture.client")}</span>
              <div>
                <h3 className="text-[17px] font-semibold">{t("architecture.builder")}</h3>
                <p className="mt-2 text-[13px] leading-[1.5] text-muted">{t("architecture.builderDetail")}</p>
              </div>
            </div>
            <Arrow />
            <div className="architecture-node rounded-2xl bg-surface p-[22px]">
              <span className="font-mono text-[11px] text-muted-2">{t("architecture.untrusted")}</span>
              <div>
                <h3 className="text-[17px] font-semibold">{t("architecture.router")}</h3>
                <p className="mt-2 text-[13px] leading-[1.5] text-muted">
                  {t("architecture.routerDetail")}
                </p>
              </div>
            </div>
            <Arrow />
            <div className="enclave-box flex min-w-0 flex-col gap-3 rounded-[18px] border-[1.5px] border-dashed border-volt bg-volt/4 p-4">
              <div className="flex justify-between gap-2 font-mono text-[11px] font-medium tracking-[.1em] text-volt">
                <span>{t("architecture.enclave")}</span>
                <span>{t("architecture.sealed")}</span>
              </div>
              <div className="enclave-parts grid flex-1 grid-cols-3 gap-2">
                {ENCLAVE.map((key) => (
                  <div key={key} className="rounded-xl bg-surface-2 p-4">
                    <h3 className="text-[15px] font-semibold">{t(`architecture.parts.${key}.title`)}</h3>
                    <p className="mt-1.5 text-xs leading-[1.5] text-muted">{t(`architecture.parts.${key}.description`)}</p>
                  </div>
                ))}
              </div>
            </div>
            <Arrow />
            <div className="architecture-node rounded-2xl bg-volt p-[22px] text-ink">
              <span className="font-mono text-[11px] opacity-70">{t("architecture.official")}</span>
              <div>
                <h3 className="text-[17px] font-semibold">{t("architecture.vendorApi")}</h3>
                <p className="mt-2 font-mono text-xs leading-[1.6]">
                  api.anthropic.com
                  <br />
                  api.openai.com
                  <br />
                  googleapis.com
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="content-section grid gap-14 pt-24 lg:grid-cols-[.85fr_1.15fr]">
          <div className="section-intro">
            <span className="eyebrow">{t("visibility.eyebrow")}</span>
            <h2 className="section-title">{t("visibility.title")}</h2>
          </div>
          <div className="overflow-hidden rounded-card bg-surface">
            <table className="visibility-matrix w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-line-soft font-mono text-[11px] tracking-[.06em] text-muted-2">
                  <th aria-label={t("visibility.party")} />
                  {(["prompts", "creds", "usage", "identity"] as const).map((col) => (
                    <th key={col} scope="col">
                      <span className="max-md:hidden">{t(`visibility.columns.${col}`)}</span>
                      <span className="md:hidden">{t(`visibility.columns.${col}Short`)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VISIBILITY.map((r) => (
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
            <p className="px-6 py-3.5 font-mono text-xs leading-[1.6] text-muted">
              {t("visibility.note")}
            </p>
          </div>
        </section>
        <section className="content-section grid items-start gap-12 pt-24 lg:grid-cols-2">
          <div className="section-intro">
            <span className="eyebrow">{t("verify.eyebrow")}</span>
            <h2 className="section-title">{t("verify.title")}</h2>
            <ol>
              {VERIFY.map((key, i) => (
                <li key={key} className="grid grid-cols-[44px_1fr] gap-3 border-t border-paper/10 py-4">
                  <span className="font-mono text-[13px] text-volt">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold">{t(`verify.steps.${key}.title`)}</h3>
                    <p className="mt-1 text-sm leading-[1.55] text-muted">{t(`verify.steps.${key}.description`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-paper/10 bg-surface">
            <div className="flex justify-between border-b border-line-soft px-5 py-3.5 font-mono text-xs text-muted">
              <span>{t("verify.terminal")}</span>
              <CopyButton text={VERIFY_COMMAND} />
            </div>
            <pre className="overflow-x-auto px-[22px] py-5 font-mono text-[13px] leading-[1.85] max-md:text-[11px]">
              <VerifyTerminal />
            </pre>
            <p className="border-t border-line-soft px-5 py-4 text-xs leading-[1.7] text-muted">
              {t.rich("verify.instructions", { code, sha: "<sha256>" })}
            </p>
          </div>
        </section>
        <section id="release-signing" className="content-section grid items-start gap-12 pt-24 lg:grid-cols-2">
          <div className="section-intro">
            <span className="eyebrow">{t("release.eyebrow")}</span>
            <h2 className="section-title">{t("release.title")}</h2>
            <p className="text-base leading-[1.6] text-text-2">
              {t("release.lead")}
            </p>
            <p className="text-sm leading-[1.6] text-muted">
              {t.rich("release.note", { code })}
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
              <a href={LINKS.teeReleases} target="_blank" rel="noreferrer" className="border-b border-volt pb-0.5">
                {t("release.teeReleases")}
              </a>
              <a href={LINKS.teeCatalog} target="_blank" rel="noreferrer" className="border-b border-volt pb-0.5">
                {t("release.catalog")}
              </a>
              <a href={LINKS.verificationGuide} target="_blank" rel="noreferrer" className="border-b border-volt pb-0.5">
                {t("release.guide")}
              </a>
              <a href={LINKS.webVerifier} target="_blank" rel="noreferrer" className="border-b border-volt pb-0.5">
                {t("release.webVerifier")}
              </a>
            </div>
          </div>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-paper/10 bg-surface">
            <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-3.5 font-mono text-xs text-muted">
              <span>{t("release.fingerprint")}</span>
              <CopyButton text={RELEASE_SIGNING.fingerprint} />
            </div>
            <p className="px-[22px] py-5 font-mono text-[15px] break-all text-volt max-md:text-[13px]">
              {RELEASE_SIGNING.fingerprint}
            </p>
            <dl className="grid grid-cols-[110px_1fr] gap-y-2 border-t border-line-soft px-[22px] py-4 font-mono text-xs">
              {RELEASE_SIGNING.details.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted">{t(`release.details.${k}`)}</dt>
                  <dd className="text-text-2">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex items-center justify-between gap-3 border-t border-line-soft px-5 py-3.5 font-mono text-xs text-muted">
              <span>allowed_signers</span>
              <CopyButton text={RELEASE_SIGNING.allowedSigners} />
            </div>
            <pre className="overflow-x-auto px-[22px] pb-5 font-mono text-[12px] leading-[1.7] whitespace-pre-wrap break-all text-text-2">
              {RELEASE_SIGNING.allowedSigners}
            </pre>
          </div>
        </section>
        <section className="content-section flex flex-col gap-7 pt-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="section-title">{t("oss.title")}</h2>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer"
              className="border-b border-volt pb-0.5 text-sm font-semibold"
            >
              github.com/tokhive ↗
            </a>
          </div>
          <div className="grid grid-cols-3 gap-2.5 max-md:grid-cols-1">
            {OSS.map((o) => {
              const content = (
                <>
                  <span className="font-mono text-[11px] font-medium tracking-[.1em] text-volt">{t(`oss.items.${o.key}.kicker`)}</span>
                  <h3 className="text-xl font-semibold tracking-[-.01em]">{t(`oss.items.${o.key}.title`)}</h3>
                  <p className="text-sm leading-[1.55] text-muted">{t(`oss.items.${o.key}.description`)}</p>
                  <span className="mt-auto pt-2 font-mono text-xs text-text-2">
                    {o.href ? `tokhive/${o.href} ↗` : t("oss.items.audit.meta")}
                  </span>
                </>
              );
              const className = `flex min-h-[220px] flex-col gap-3 rounded-[18px] border p-7 ${o.href ? "border-transparent bg-surface" : "border-volt/40"}`;
              return o.href === null ? (
                <article key={o.key} className={className}>
                  {content}
                </article>
              ) : (
                <a
                  key={o.key}
                  className={className}
                  href={`${LINKS.github}/${o.href}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {content}
                </a>
              );
            })}
          </div>
        </section>
        <section className="content-section grid gap-14 pt-24 lg:grid-cols-[.85fr_1.15fr]">
          <div className="section-intro">
            <span className="eyebrow">{t("data.eyebrow")}</span>
            <h2 className="section-title">{t("data.title")}</h2>
            <p className="rounded-xl border border-dashed border-volt/40 p-4 text-sm leading-relaxed text-text-2">
              {t.rich("data.review", {
                privacy: (chunks) => <Link href={LINKS.privacy} className="text-volt underline underline-offset-4">{chunks}</Link>,
              })}
            </p>
          </div>
          <dl className="retention-table border-t border-line">
            {DATA.map((d) => (
              <div
                key={d.key}
                className="grid grid-cols-[1.2fr_1fr_2fr] items-baseline gap-6 border-b border-line-soft py-[18px]"
              >
                <dt className="text-[15px] font-semibold">{t(`data.items.${d.key}.title`)}</dt>
                <dd className="font-mono text-[13px]" style={{ color: d.c }}>
                  {t(`data.states.${d.state}`)}
                </dd>
                <dd className="text-sm leading-[1.55] text-muted">{t(`data.items.${d.key}.description`)}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="disclosure-card my-[120px] flex flex-wrap items-center justify-between gap-8 rounded-card-lg bg-surface p-12">
          <div className="section-intro max-w-[640px]">
            <span className="eyebrow">{t("disclosure.eyebrow")}</span>
            <h2 className="text-[32px] leading-[1.15] font-semibold tracking-[-.025em]">
              {t("disclosure.title")}
            </h2>
            <p className="text-[15px] leading-[1.6] text-muted">
              {t("disclosure.lead")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a href={LINKS.reportVulnerability} target="_blank" rel="noreferrer" className="btn-primary">
              {t("disclosure.report")}
            </a>
          </div>
        </section>
      </main>
      <Footer compact />
    </>
  );
}
