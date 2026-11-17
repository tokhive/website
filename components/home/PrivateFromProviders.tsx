import { useTranslations } from "next-intl";
import { StepList } from "@/components/StepList";
import { LINKS } from "@/lib/links";

const STEPS = ["sealed", "anonymous", "disclosed"] as const;

// What a Provider can and cannot see of a buyer's requests, and where the
// rest is written down.
export function PrivateFromProviders() {
  const t = useTranslations("Home.privacy");
  const steps = STEPS.map((key) => ({ t: t(`steps.${key}.title`), d: t(`steps.${key}.description`) }));
  return (
    <section className="home-privacy site-container grid gap-12 pb-[120px] max-[899px]:gap-8 max-[899px]:pb-20 min-[900px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="flex flex-col gap-5">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h2 className="h2">{t("title")}</h2>
        <a
          href={LINKS.trustModel}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit text-sm text-text-2 underline underline-offset-4 hover:text-paper"
        >
          {t("trustModel")}
        </a>
      </div>
      {/* One column until all three fit side by side, so none sits alone. */}
      <StepList steps={steps} className="gap-6 min-[1200px]:grid-cols-3" />
    </section>
  );
}
