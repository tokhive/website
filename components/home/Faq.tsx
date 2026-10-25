import { Accordion } from "@/components/Accordion";
import { HOME_FAQ } from "@/lib/mock/faq";
import { LINKS } from "@/lib/links";

export function Faq() {
  return (
    <section className="site-container faq-section grid gap-20 pb-[120px] max-lg:gap-8 max-md:pb-[72px] lg:grid-cols-[360px_1fr]">
      <div className="flex flex-col gap-5">
        <span className="eyebrow">FAQ</span>
        <h2 className="h2">Questions, answered.</h2>
        <p className="faq-contact text-[15px] leading-[1.65] text-muted">
          Still unsure? Talk to us on{" "}
          <a className="text-paper underline underline-offset-4" href={LINKS.discord}>
            Discord
          </a>
          ,{" "}
          <a className="text-paper underline underline-offset-4" href={LINKS.telegram}>
            Telegram
          </a>{" "}
          or{" "}
          <a className="text-paper underline underline-offset-4" href={LINKS.email}>
            hello@tokhive.ai
          </a>
          .
        </p>
      </div>
      <Accordion items={HOME_FAQ} />
    </section>
  );
}
