import type { ButtonHTMLAttributes } from "react";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean };

/** Pill filter chip: volt when active, outlined otherwise. */
export function Chip({ active, className = "", ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`chip ${active ? "chip-active" : ""} ${className}`}
      {...rest}
    />
  );
}

type SegmentedProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
};

/** Segmented control: dark track, paper-filled active item. */
export function Segmented<T extends string>({ options, value, onChange, label, className = "" }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className={`flex gap-0.5 rounded-full p-[3px] ${className}`}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={`cursor-pointer rounded-full px-3 py-[7px] font-mono text-xs font-medium ${
            o === value ? "bg-paper text-ink" : "text-muted hover:opacity-80"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
