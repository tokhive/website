import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Accordion } from "@/components/Accordion";
import { FaqStructuredData } from "@/components/FaqStructuredData";
import { LINKS } from "@/lib/links";

// Grouped by reader: what TokHive is, trust, providers, buyers, then balances.
const QUESTIONS = [
  "roles", "vendor", "credentials",
  "supply", "earn", "usage", "stop",
  "prices", "tools", "payment", "costs", "failures",
  "settlement", "withdraw",
] as const;

function contactLink(href: string) {
  return function ContactLink(chunks: ReactNode) {
    return (
      <a className="text-paper underline underline-offset-4" href={href}>
        {chunks}
      </a>
    );
  };
}

export function Faq() {
  const t = useTranslations("Home.faq");
  // An answer may link to the docs with <docs>; structured data gets its text only.
  const items = QUESTIONS.map((key) => ({
    question: t(`items.${key}.question`),
    answer: t.markup(`items.${key}.answer`, { docs: (chunks) => chunks }),
    content: t.rich(`items.${key}.answer`, { docs: contactLink(LINKS.beeRequirements) }),
  }));
  return (
    <section className="site-container faq-section grid gap-20 pb-[120px] max-lg:gap-8 max-md:pb-[72px] lg:grid-cols-[360px_1fr]">
      <div className="flex flex-col gap-5">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h2 className="h2">{t("title")}</h2>
        <p className="faq-contact text-[15px] leading-[1.65] text-muted">
          {t.rich("contact", {
            discord: contactLink(LINKS.discord),
            telegram: contactLink(LINKS.telegram),
            email: contactLink(LINKS.email),
          })}
        </p>
      </div>
      <Accordion items={items} />
      <FaqStructuredData items={items} />
    </section>
  );
}
