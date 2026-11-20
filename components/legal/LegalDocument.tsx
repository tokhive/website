import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { Nav } from "@/components/Nav";
import { EFFECTIVE } from "@/lib/legal";
import { LINKS } from "@/lib/links";

export type LegalSection = { id: string; title: string; content: ReactNode };

type Props = {
  title: string;
  summary: string;
  href: string;
  sections: LegalSection[];
};

const policies = [
  { title: "Terms of Service", href: LINKS.terms },
  { title: "Privacy Policy", href: LINKS.privacy },
  { title: "Acceptable Use", href: LINKS.aup },
];

/** Policies stay in English in every locale; other locales get a note saying so. */
export function LegalDocument({ title, summary, href, sections }: Props) {
  const locale = useLocale();
  const t = useTranslations("Legal");
  return (
    <>
      <main className="site-container">
        <Nav />
        {locale !== "en" && (
          <p className="mt-6 rounded-xl border border-line px-5 py-3 text-sm leading-relaxed text-text-2">{t("englishOnly")}</p>
        )}
        <header lang="en" className="border-b border-line pt-16 pb-10 max-sm:pt-10">
          <p className="eyebrow mb-5">TokHive policies</p>
          <h1 className="max-w-[900px] text-[clamp(36px,6vw,72px)] leading-[1.05] font-semibold tracking-[-.045em]">{title}</h1>
          <p className="mt-6 max-w-[740px] text-lg leading-relaxed text-text-2">{summary}</p>
          <p className="mt-6 font-mono text-xs text-muted">
            Effective <time dateTime={EFFECTIVE.iso}>{EFFECTIVE.label}</time>
          </p>
          <nav aria-label="Legal policies" className="mt-8 flex flex-wrap gap-2">
            {policies.map((policy) => (
              <Link key={policy.href} href={policy.href} aria-current={href === policy.href ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm ${href === policy.href ? "border-volt bg-volt text-ink" : "border-line text-text-2"}`}>
                {policy.title}
              </Link>
            ))}
          </nav>
        </header>
        <div lang="en" className="grid items-start gap-10 py-10 pb-24 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="On this page" className="lg:sticky lg:top-8">
            <h2 className="mb-4 font-mono text-xs tracking-[.1em] text-muted-2 uppercase">On this page</h2>
            <ol className="grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3 lg:grid-cols-1">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="flex items-baseline gap-2 text-sm leading-relaxed text-text-2">
                    <span className="font-mono text-[11px] text-muted-2">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <article className="min-w-0 max-w-[800px]">
            <div className="space-y-10">
              {sections.map((section, index) => (
                <section key={section.id} id={section.id} className="scroll-mt-8 border-t border-line-soft pt-7">
                  <h2 className="mb-4 flex items-baseline gap-3 text-2xl font-semibold tracking-[-.02em]">
                    <span className="font-mono text-sm text-volt">{String(index + 1).padStart(2, "0")}</span>
                    {section.title}
                  </h2>
                  <div className="text-[15px] leading-[1.85] text-text-2 [&_a]:break-words [&_a]:text-volt [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_p+p]:mt-4 [&_strong]:font-medium [&_strong]:text-paper [&_ul]:my-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-12 rounded-card bg-surface p-6">
              <h2 className="text-lg font-semibold">Questions about this policy?</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Contact <a href={LINKS.email} className="text-volt underline underline-offset-4">hello@tokhive.ai</a>.
                Include relevant request IDs, but never send passwords, API keys, subscription credentials or wallet private keys.
              </p>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
