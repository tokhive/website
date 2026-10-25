"use client";

import { useId, useState } from "react";

export type FaqItem = { question: string; answer: string };

export function Accordion({ items }: { items: readonly FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <div className="accordion border-t border-line">
      {items.map((item, i) => (
        <div key={item.question} className="border-b border-line">
          <h3>
            <button
              id={`${id}-question-${i}`}
              type="button"
              aria-expanded={open === i}
              aria-controls={`${id}-answer-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left text-[19px] leading-[1.35] font-semibold max-md:gap-4 max-md:py-[18px] max-md:text-base"
            >
              {item.question}
              <span
                aria-hidden="true"
                className={`clip-hex flex h-9 w-8 shrink-0 items-center justify-center font-mono text-base ${open === i ? "bg-volt text-ink" : "bg-surface-2"}`}
              >
                {open === i ? "−" : "+"}
              </span>
            </button>
          </h3>
          <div id={`${id}-answer-${i}`} role="region" aria-labelledby={`${id}-question-${i}`} hidden={open !== i}>
            <p className="pb-6 pr-16 text-base leading-[1.65] text-pretty text-text-2 max-md:pr-0 max-md:text-[15px]">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
