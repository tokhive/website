import { useTranslations } from "next-intl";
import { EGRESS_TAPE } from "@/lib/content/egress";

/** Full-bleed marquee of the rules that never change, as a scrolling spec tape. */
export function EgressTape() {
  const t = useTranslations("Egress");
  const items = EGRESS_TAPE.map((key) => t(`tape.${key}`));
  return (
    <div className="egress-tape overflow-hidden border-y border-line" aria-hidden="true">
      <div className="egress-tape-track flex w-max items-center">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center">
            {items.map((label) => (
              <span
                key={label}
                className="flex items-center gap-2.5 border-r border-line-soft px-7 py-3.5 font-mono text-[13px] whitespace-nowrap text-text-2"
              >
                <span className="clip-hex h-2.5 w-2 bg-volt" />
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
