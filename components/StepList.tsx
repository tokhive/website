export type Step = { t: string; d: string };

/** Numbered steps with a volt top rule, used on Home and Models. */
export function StepList({ steps, className = "" }: { steps: Step[]; className?: string }) {
  return (
    <div className={`grid ${className}`}>
      {steps.map((s, i) => (
        <div key={s.t} className="flex flex-col gap-2 border-t border-volt pt-4">
          <span className="font-mono text-[13px] font-medium text-volt">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-[17px] font-semibold">{s.t}</span>
          <span className="text-sm leading-[1.55] text-pretty text-muted">{s.d}</span>
        </div>
      ))}
    </div>
  );
}
