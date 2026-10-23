"use client";

import { useEffect, useRef, useState } from "react";
import { MODELS, VENDOR_COLORS, VENDORS, type Vendor } from "@/lib/mock/models";

const COUNTS = Object.fromEntries(VENDORS.map((v) => [v, MODELS.filter((m) => m.vendor === v).length]));

type Props = { selected: Vendor[]; onToggle: (v: Vendor) => void; onClear: () => void };

/** Multi-select vendor dropdown with a filter box; scales to many vendors. */
export function VendorSelect({ selected, onToggle, onClear }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options = VENDORS.filter((v) => !query || v.toLowerCase().includes(query.toLowerCase()));
  const active = selected.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <div ref={root} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className={`chip gap-2 ${open ? "border-transparent bg-paper text-ink hover:opacity-100" : ""}`}
        >
          {active ? `Vendor · ${selected.length}` : "All vendors"}
          <span className="text-[10px]">▾</span>
        </button>
        {open && (
          <div className="absolute top-11 left-0 z-20 flex w-[300px] flex-col gap-1.5 rounded-code border border-line-hero bg-surface p-2 shadow-popover">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter vendors"
              aria-label="Filter vendors"
              className="h-9 rounded-lg border border-paper/10 bg-bg px-3 text-[13px] text-paper outline-none"
            />
            <div role="listbox" aria-multiselectable="true" className="flex max-h-[300px] flex-col overflow-auto">
              {options.map((v) => {
                const on = selected.includes(v);
                return (
                  <button
                    key={v}
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={() => onToggle(v)}
                    className="grid cursor-pointer grid-cols-[16px_10px_1fr_auto] items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-left text-sm text-paper hover:bg-paper/6"
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border text-[11px] text-ink ${
                        on ? "border-volt bg-volt" : "border-paper/30"
                      }`}
                    >
                      {on ? "✓" : ""}
                    </span>
                    <span className="clip-hex h-2.5 w-2.5" style={{ background: VENDOR_COLORS[v] }} />
                    <span>{v}</span>
                    <span className="font-mono text-xs text-muted-2">{COUNTS[v]}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between border-t border-paper/8 px-2.5 pt-2 pb-1 font-mono text-xs text-muted">
              <span>{active ? `${selected.length} of ${VENDORS.length} selected` : `${VENDORS.length} vendors`}</span>
              <button type="button" onClick={onClear} className="cursor-pointer text-volt hover:opacity-80">
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
      {selected.map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onToggle(v)}
          aria-label={`Remove ${v}`}
          className="chip gap-1.5 border-volt/35 bg-volt/12 pr-2.5 text-volt"
        >
          {v}
          <span className="text-sm leading-none">×</span>
        </button>
      ))}
    </div>
  );
}
