"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { LIFECYCLE } from "@/lib/content/egress";

/** How many of the 24 blocks are spent in each lifecycle state. */
const FILLED = [0, 6, 14, 24];

/**
 * Cycles a sample lease through its four states: matched, prepaid, streaming, complete.
 * Labelled as a sample because these are not live numbers. With reduced motion it stays
 * on the first state instead of cycling.
 */
export function SessionLifecycle() {
  const t = useTranslations("Egress.hero.lifecycle");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => {
      if (!document.hidden) setStep((s) => (s + 1) % LIFECYCLE.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const filled = FILLED[step];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] font-medium tracking-[.1em] text-volt uppercase">{t("title")}</span>
        <span className="rounded-badge border border-chip-border px-2 py-0.5 font-mono text-[10px] tracking-[.08em] text-muted">
          {t("sample")}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            className={`clip-hex h-9 w-8 shrink-0 transition-colors duration-500 ${i < filled ? "bg-volt" : "bg-surface-3"}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-line-soft pt-3 text-sm">
        <span
          aria-hidden="true"
          className={`size-1.5 shrink-0 rounded-full ${step === 3 ? "bg-muted-2" : "animate-pulse-dot bg-volt"}`}
        />
        <span className="text-text-2">{t(`states.${LIFECYCLE[step]}`)}</span>
      </div>
      <div className="flex items-baseline justify-between gap-3 font-mono text-sm">
        <span>5 min</span>
        <span className="text-muted">16 MiB</span>
        <span className="text-volt">$0.006</span>
      </div>
    </div>
  );
}
