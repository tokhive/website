import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Accordion } from "@/components/Accordion";
import { LINKS } from "@/lib/links";

const QUESTIONS = ["vendor", "credentials", "earn", "usage", "prices", "tools", "settlement"] as const;

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
  const items = QUESTIONS.map((key) => ({ question: t(`items.${key}.question`), answer: t(`items.${key}.answer`) }));
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
    </section>
  );
}
