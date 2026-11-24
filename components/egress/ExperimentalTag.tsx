/** Marks a feature as experimental; the amber dot sets it apart from the product's volt accents. */
export function ExperimentalTag({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 rounded-full border border-warn/45 bg-warn/8 px-3 py-1 font-mono text-[11px] font-medium tracking-[.1em] text-warn uppercase ${className}`}
    >
      <span aria-hidden="true" className="animate-pulse-dot size-1.5 rounded-full bg-warn" />
      {label}
    </span>
  );
}
