import type { Metadata } from "next";
import { Fragment } from "react";
import { CopyButton } from "@/components/CopyButton";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { LINKS } from "@/lib/links";
import { DATA, ENCLAVE, HEROSTATS, OSS, TERM, VERIFY, VISIBILITY } from "@/lib/mock/security";

export const metadata: Metadata = {
  title: "Security & Verification",
  description:
    "Explore TokHive’s AMD SEV-SNP confidential VM, credential isolation, signed attestations and open-source verification.",
};

function Arrow() {
  return (
    <span className="flow-arrow flex items-center justify-center font-mono text-base text-muted-2" aria-hidden="true">
      <span className="hidden md:inline">→</span>
      <span className="md:hidden">↓</span>
    </span>
  );
}

export default function SecurityPage() {
  return (
    <>
      <main className="site-container security-page">
        <Nav />
        <header className="security-hero grid items-end gap-14 border-b border-line pt-[72px] pb-14 lg:grid-cols-[1fr_240px]">
          <div className="section-intro">
            <span className="eyebrow">Security &amp; verification</span>
            <h1 className="h1">
              Trust the hardware,
              <br />
              <span className="outline-word">not us.</span>
            </h1>
            <p className="max-w-[620px] text-[19px] leading-[1.5] text-pretty text-text-2">
              TokHive&apos;s relay runs inside a hardware enclave. It holds provider credentials, can only talk to
              official vendor APIs, and signs a receipt for every call. You don&apos;t have to take our word for any of
              it.
            </p>
          </div>
          <div className="security-stats flex flex-col gap-5">
            {HEROSTATS.map((s) => (
              <div key={s.l} className="flex flex-col gap-0.5 border-t border-paper/20 pt-2.5">
                <span className="font-mono text-[30px] font-medium tracking-[-.03em]" style={{ color: s.c }}>
                  {s.v}
                </span>
                <span className="text-[13px] text-muted">{s.l}</span>
              </div>
            ))}
          </div>
        </header>
        <section className="content-section flex flex-col gap-9 pt-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="section-intro">
              <span className="eyebrow">Architecture</span>
              <h2 className="h2">Where the trust boundary sits.</h2>
            </div>
            <span className="font-mono text-[13px] text-muted">AMD SEV-SNP · measured boot · RA-TLS</span>
          </div>
          <div className="architecture-flow">
            <div className="architecture-node rounded-2xl bg-surface p-[22px]">
              <span className="font-mono text-[11px] text-muted-2">CLIENT</span>
              <div>
                <h3 className="text-[17px] font-semibold">Builder</h3>
                <p className="mt-2 text-[13px] leading-[1.5] text-muted">Your app or agent, using a TokHive key</p>
              </div>
            </div>
            <Arrow />
            <div className="architecture-node rounded-2xl bg-surface p-[22px]">
              <span className="font-mono text-[11px] text-muted-2">UNTRUSTED</span>
              <div>
                <h3 className="text-[17px] font-semibold">Router</h3>
                <p className="mt-2 text-[13px] leading-[1.5] text-muted">
                  Billing and provider selection. Sees an encrypted payload only.
                </p>
              </div>
            </div>
            <Arrow />
            <div className="enclave-box flex min-w-0 flex-col gap-3 rounded-[18px] border-[1.5px] border-dashed border-volt bg-volt/4 p-4">
              <div className="flex justify-between gap-2 font-mono text-[11px] font-medium tracking-[.1em] text-volt">
                <span>TEE ENCLAVE · AMD SEV-SNP</span>
                <span>sealed memory</span>
              </div>
              <div className="enclave-parts grid flex-1 grid-cols-3 gap-2">
                {ENCLAVE.map((e) => (
                  <div key={e.t} className="rounded-xl bg-surface-2 p-4">
                    <h3 className="text-[15px] font-semibold">{e.t}</h3>
                    <p className="mt-1.5 text-xs leading-[1.5] text-muted">{e.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <Arrow />
            <div className="architecture-node rounded-2xl bg-volt p-[22px] text-ink">
              <span className="font-mono text-[11px] opacity-70">OFFICIAL</span>
              <div>
                <h3 className="text-[17px] font-semibold">Vendor API</h3>
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
            <span className="eyebrow">Who sees what</span>
            <h2 className="section-title">Least privilege, enforced by silicon.</h2>
          </div>
          <div className="overflow-hidden rounded-card bg-surface">
            <table className="visibility-matrix w-full table-fixed border-collapse">
              <thead>
                <tr className="border-b border-line-soft font-mono text-[11px] tracking-[.06em] text-muted-2">
                  <th aria-label="Party" />
                  <th scope="col">
                    <span className="max-md:hidden">PROMPTS</span>
                    <span className="md:hidden">PROMPT</span>
                  </th>
                  <th scope="col">
                    <span className="max-md:hidden">PROVIDER CREDS</span>
                    <span className="md:hidden">CREDS</span>
                  </th>
                  <th scope="col">
                    <span className="max-md:hidden">USAGE METERS</span>
                    <span className="md:hidden">USAGE</span>
                  </th>
                  <th scope="col">
                    <span className="max-md:hidden">BUILDER IDENTITY</span>
                    <span className="md:hidden">ID</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {VISIBILITY.map((r) => (
                  <tr key={r.who} className="border-b border-paper/6">
                    <th scope="row" className="text-left text-[15px] font-semibold">
                      {r.who}
                    </th>
                    {r.cells.map((visible, i) => (
                      <td key={i}>
                        <span
                          aria-label={visible ? "Can see" : "Cannot see"}
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
              ✓ can see · — cannot see · Vendors see prompts as they would for any API call.
            </p>
          </div>
        </section>
        <section className="content-section grid items-start gap-12 pt-24 lg:grid-cols-2">
          <div className="section-intro">
            <span className="eyebrow">Verify it yourself</span>
            <h2 className="section-title">Check any response in one command.</h2>
            <ol>
              {VERIFY.map((v) => (
                <li key={v.n} className="grid grid-cols-[44px_1fr] gap-3 border-t border-paper/10 py-4">
                  <span className="font-mono text-[13px] text-volt">{v.n}</span>
                  <div>
                    <h3 className="font-semibold">{v.t}</h3>
                    <p className="mt-1 text-sm leading-[1.55] text-muted">{v.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="min-w-0 overflow-hidden rounded-2xl border border-paper/10 bg-surface">
            <div className="flex justify-between border-b border-line-soft px-5 py-3.5 font-mono text-xs text-muted">
              <span>terminal</span>
              <CopyButton text={TERM[0].t.replace(/^\$ /, "")} />
            </div>
            <pre className="overflow-x-auto px-[22px] py-5 font-mono text-[13px] leading-[1.85] max-md:text-[11px]">
              <code>
                {TERM.map((l, i) => (
                  <Fragment key={i}>
                    <span style={{ color: l.c }}>{l.t}</span>
                    {"\n"}
                  </Fragment>
                ))}
              </code>
            </pre>
          </div>
        </section>
        <section className="content-section flex flex-col gap-7 pt-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="section-title">Open source and audited.</h2>
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
            {OSS.map((o, i) => {
              const content = (
                <>
                  <span className="font-mono text-[11px] font-medium tracking-[.1em] text-volt">{o.k}</span>
                  <h3 className="text-xl font-semibold tracking-[-.01em]">{o.t}</h3>
                  <p className="text-sm leading-[1.55] text-muted">{o.d}</p>
                  <span className="mt-auto pt-2 font-mono text-xs text-text-2">{o.m}</span>
                </>
              );
              const className = `flex min-h-[220px] flex-col gap-3 rounded-[18px] border p-7 ${i === 2 ? "border-volt/40" : "border-transparent bg-surface"}`;
              return i === 2 ? (
                <article key={o.t} className={className}>
                  {content}
                </article>
              ) : (
                <a
                  key={o.t}
                  className={className}
                  href={`${LINKS.github}/${i === 0 ? "tee" : "verify"}`}
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
            <span className="eyebrow">Data handling</span>
            <h2 className="section-title">What we keep, and for how long.</h2>
            <p className="rounded-xl border border-dashed border-volt/40 p-4 font-mono text-[11px] leading-[1.6] text-volt">
              PLACEHOLDER · Retention values are assumptions, pending confirmation.
            </p>
          </div>
          <dl className="retention-table border-t border-line">
            {DATA.map((d) => (
              <div
                key={d.k}
                className="grid grid-cols-[1.2fr_1fr_2fr] items-baseline gap-6 border-b border-line-soft py-[18px]"
              >
                <dt className="text-[15px] font-semibold">{d.k}</dt>
                <dd className="font-mono text-[13px]" style={{ color: d.c }}>
                  {d.v}
                </dd>
                <dd className="text-sm leading-[1.55] text-muted">{d.d}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="disclosure-card my-[120px] flex flex-wrap items-center justify-between gap-8 rounded-card-lg bg-surface p-12">
          <div className="section-intro max-w-[640px]">
            <span className="eyebrow">Responsible disclosure</span>
            <h2 className="text-[32px] leading-[1.15] font-semibold tracking-[-.025em]">
              Found something? Tell us first.
            </h2>
            <p className="text-[15px] leading-[1.6] text-muted">
              We reply within 48 hours and reward valid reports through our bug bounty.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a href="mailto:security@tokhive.ai" className="btn-primary">
              security@tokhive.ai
            </a>
            <a
              href="mailto:security@tokhive.ai?subject=PGP%20public%20key%20request"
              className="btn-ghost px-[22px] py-3.5 text-[15px] font-semibold"
            >
              PGP key
            </a>
          </div>
        </section>
      </main>
      <Footer compact />
    </>
  );
}
