"use client";

import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Chip, Segmented } from "@/components/Chip";
import { CopyButton } from "@/components/CopyButton";
import { Modal } from "@/components/Modal";
import { VendorSelect } from "@/components/models/VendorSelect";
import { formatPrice } from "@/lib/format";
import {
  CAPABILITIES,
  MODELS,
  VENDOR_COLORS,
  VENDORS,
  savingsPct,
  type Capability,
  type Model,
  type Vendor,
} from "@/lib/mock/models";

const SORTS = ["Popular", "Savings", "Price", "Capacity"] as const;
type Sort = (typeof SORTS)[number];

const COMPARE: Record<Sort, (a: Model, b: Model) => number> = {
  Popular: (a, b) => b.popularity - a.popularity,
  Savings: (a, b) => savingsPct(b) - savingsPct(a),
  Price: (a, b) => a.tokhive.in - b.tokhive.in,
  Capacity: (a, b) => b.capacityPct - a.capacityPct,
};

const COLS = "grid grid-cols-[2.2fr_1fr_.8fr_1.8fr_1fr_.9fr_32px] gap-4 px-5";

const parseList = <T extends string>(raw: string | null, allowed: readonly T[]) =>
  (raw ? raw.split(",") : []).filter((x): x is T => (allowed as readonly string[]).includes(x));

const curl = (id: string) =>
  [
    "curl https://api.tokhive.ai/v1/chat/completions \\",
    '  -H "Authorization: Bearer $TOKHIVE_API_KEY" \\',
    `  -d '{"model":"${id}","messages":[…]}'`,
  ].join("\n");

export function ModelsExplorer() {
  const params = useSearchParams();
  const [q, setQ] = useState(() => params.get("q") ?? "");
  const [vendors, setVendors] = useState<Vendor[]>(() => parseList(params.get("vendor"), VENDORS));
  const [tags, setTags] = useState<Capability[]>(() => parseList(params.get("tag"), CAPABILITIES));
  const [sort, setSort] = useState<Sort>(() => parseList(params.get("sort"), SORTS)[0] ?? "Popular");
  const [openId, setOpenId] = useState<string | null>("claude-sonnet-4-5");
  const search = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [vendorQuery, setVendorQuery] = useState("");

  // Mirror filters into the URL without triggering a navigation.
  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (vendors.length) next.set("vendor", vendors.join(","));
    if (tags.length) next.set("tag", tags.join(","));
    if (sort !== "Popular") next.set("sort", sort);
    const qs = next.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, vendors, tags, sort]);

  // "/" focuses search, as the hint glyph suggests.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(t.tagName)) {
        e.preventDefault();
        search.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return MODELS.filter(
      (m) =>
        (!vendors.length || vendors.includes(m.vendor)) &&
        tags.every((t) => m.tags.includes(t)) &&
        (!needle || `${m.name} ${m.id}`.toLowerCase().includes(needle)),
    ).sort(COMPARE[sort]);
  }, [q, vendors, tags, sort]);

  const toggleVendor = (v: Vendor) => setVendors((vs) => (vs.includes(v) ? vs.filter((x) => x !== v) : [...vs, v]));
  const toggleTag = (t: Capability) => setTags((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));
  const reset = () => {
    setQ("");
    setVendors([]);
    setTags([]);
    setSort("Popular");
  };

  return (
    <>
      <div className="models-filters sticky top-0 z-10 flex flex-col gap-3 border-t border-line bg-bg py-5">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex h-10 max-w-[480px] min-w-0 flex-1 items-center gap-2.5 rounded-full border border-paper/10 bg-surface px-4">
            <span className="font-mono text-[13px] text-muted-2" aria-hidden="true">
              /
            </span>
            <input
              ref={search}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search models"
              aria-label="Search models"
              className="min-w-0 flex-1 bg-transparent text-sm text-paper outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={`chip h-11 gap-2 md:hidden ${vendors.length + tags.length ? "chip-active" : ""}`}
          >
            Filters
            {vendors.length + tags.length > 0 && (
              <span className="rounded-full bg-ink px-1.5 py-0.5 text-[11px] text-volt">
                {vendors.length + tags.length}
              </span>
            )}
          </button>
          <div className="ml-auto flex flex-none items-center gap-2 font-mono text-xs whitespace-nowrap text-muted max-md:hidden">
            <span>sort</span>
            <Segmented options={SORTS} value={sort} onChange={setSort} label="Sort models" className="bg-surface" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 max-md:hidden">
          <VendorSelect selected={vendors} onToggle={toggleVendor} onClear={() => setVendors([])} />
          <span className="h-6 w-px bg-line" aria-hidden="true" />
          <div className="flex flex-wrap gap-1.5">
            {CAPABILITIES.map((t) => (
              <Chip key={t} active={tags.includes(t)} onClick={() => toggleTag(t)}>
                {t}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex justify-between font-mono text-xs text-muted md:hidden">
          <span>{rows.length} models</span>
          <span>
            sort · <span className="text-paper">{sort}</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto max-md:hidden">
        <div className="min-w-[860px]" role="table" aria-label="Models and pricing">
          <div
            role="row"
            className={`${COLS} border-b border-line py-3 font-mono text-[11px] tracking-[0.06em] text-muted-2`}
          >
            <span role="columnheader">MODEL</span>
            <span role="columnheader">VENDOR</span>
            <span role="columnheader">CONTEXT</span>
            <span role="columnheader">
              PRICE in / out · <span className="line-through">official</span>
            </span>
            <span role="columnheader">CAPACITY</span>
            <span role="columnheader" className="text-right">
              SAVE
            </span>
            <span />
          </div>
          {rows.map((m) => (
            <ModelRow
              key={m.id}
              m={m}
              open={openId === m.id}
              onToggle={() => setOpenId(openId === m.id ? null : m.id)}
            />
          ))}
          {rows.length === 0 && (
            <div className="px-5 py-16 text-center text-[15px] text-muted">
              No models match.{" "}
              <button type="button" onClick={reset} className="cursor-pointer text-volt underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mobile-models md:hidden">
        {rows.map((m) => (
          <MobileModelCard
            key={m.id}
            m={m}
            open={openId === m.id}
            onToggle={() => setOpenId(openId === m.id ? null : m.id)}
          />
        ))}
        {!rows.length && (
          <p className="py-12 text-center text-[15px] text-muted">
            No models match.{" "}
            <button type="button" onClick={reset} className="text-volt underline">
              Clear filters
            </button>
          </p>
        )}
      </div>
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} label="Model filters" className="filter-sheet">
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-paper/25" />
        <div className="flex shrink-0 items-center justify-between px-5 py-3">
          <h2 className="text-xl font-semibold">Filters</h2>
          <div className="flex gap-4">
            <button type="button" onClick={reset} className="min-h-11 font-mono text-[13px] text-volt">
              Reset
            </button>
            <button
              type="button"
              aria-label="Close filters"
              onClick={() => setFiltersOpen(false)}
              className="min-h-11 min-w-11 text-xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-5">
          <fieldset>
            <legend className="mb-2.5 font-mono text-[11px] tracking-[.08em] text-muted">SORT BY</legend>
            <Segmented
              options={SORTS}
              value={sort}
              onChange={setSort}
              label="Sort models"
              className="w-full justify-between bg-bg"
            />
          </fieldset>
          <fieldset>
            <legend className="mb-2.5 font-mono text-[11px] tracking-[.08em] text-muted">CAPABILITIES</legend>
            <div className="flex flex-wrap gap-1.5">
              {CAPABILITIES.map((t) => (
                <Chip key={t} active={tags.includes(t)} onClick={() => toggleTag(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2.5 font-mono text-[11px] tracking-[.08em] text-muted">
              VENDOR · {vendors.length} of {VENDORS.length}
            </legend>
            <input
              aria-label="Filter vendors"
              placeholder="Filter vendors"
              value={vendorQuery}
              onChange={(e) => setVendorQuery(e.target.value)}
              className="mb-2 h-11 w-full rounded-input border border-paper/10 bg-bg px-3.5 text-[15px]"
            />
            <div>
              {VENDORS.filter((v) => v.toLowerCase().includes(vendorQuery.trim().toLowerCase())).map((v) => (
                <label
                  key={v}
                  className="grid min-h-[52px] cursor-pointer grid-cols-[22px_10px_1fr_auto] items-center gap-3 border-b border-paper/6"
                >
                  <input
                    type="checkbox"
                    checked={vendors.includes(v)}
                    onChange={() => toggleVendor(v)}
                    className="h-[22px] w-[22px] accent-volt"
                  />
                  <span className="clip-hex h-2.5 w-2.5" style={{ background: VENDOR_COLORS[v] }} />
                  <span className="text-[15px]">{v}</span>
                  <span className="font-mono text-xs text-muted-2">{MODELS.filter((m) => m.vendor === v).length}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="shrink-0 border-t border-line-soft px-5 pt-3.5 pb-7">
          <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary min-h-[52px] w-full">
            Show {rows.length} models
          </button>
        </div>
      </Modal>
      <div className="flex flex-wrap justify-between gap-3 pt-4 font-mono text-xs text-muted">
        <span>USD per 1M tokens · prices float with provider supply, last repriced 14:00 UTC</span>
        <span>Capacity = share of pooled quota still free this hour</span>
      </div>
    </>
  );
}

function MobileModelCard({ m, open, onToggle }: { m: Model; open: boolean; onToggle: () => void }) {
  const low = m.capacityPct < 25;
  return (
    <article className={`border-b border-line-soft ${open ? "bg-surface" : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`mobile-${m.id}`}
        onClick={onToggle}
        className="flex w-full cursor-pointer flex-col gap-3 px-5 py-[18px] text-left"
      >
        <span className="flex w-full items-start justify-between gap-3">
          <span className="flex min-w-0 flex-col gap-1">
            <span className="text-base font-semibold">{m.name}</span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
              <span className="clip-hex h-[9px] w-[9px] shrink-0" style={{ background: VENDOR_COLORS[m.vendor] }} />
              {m.vendor} · {m.context}
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-volt px-[9px] py-1 font-mono text-[13px] font-medium text-ink">
            −{savingsPct(m)}%
          </span>
        </span>
        <span className="flex w-full items-end justify-between gap-2 font-mono">
          <span className="flex flex-col gap-[3px]">
            <span className="text-sm">
              {formatPrice(m.tokhive.in)} / {formatPrice(m.tokhive.out)}
            </span>
            <span className="text-[11px] text-muted-2 line-through">
              {formatPrice(m.official.in)} / {formatPrice(m.official.out)}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="h-[5px] w-12 overflow-hidden rounded-[2px] bg-surface-3">
              <span className={`block h-full ${low ? "bg-warn" : "bg-volt"}`} style={{ width: `${m.capacityPct}%` }} />
            </span>
            <span className="text-[11px] text-muted">{m.capacityPct}%</span>
            <span className="w-3.5 text-right text-sm text-muted">{open ? "−" : "+"}</span>
          </span>
        </span>
      </button>
      {open && (
        <div id={`mobile-${m.id}`} className="flex flex-col gap-4 px-5 pb-[22px] font-mono text-xs">
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-3.5 gap-y-1.5">
            <span className="text-[10px] text-muted-2">PER 1M</span>
            <span className="text-[10px] text-muted-2">OFFICIAL</span>
            <span className="text-[10px] text-muted-2">TOKHIVE</span>
            {(
              [
                ["input", m.official.in, m.tokhive.in],
                ["output", m.official.out, m.tokhive.out],
                ["cache read", m.official.cacheRead, m.tokhive.cacheRead],
              ] as const
            ).map(([label, official, ours]) => (
              <Fragment key={label}>
                <span className="text-muted">{label}</span>
                <span className="text-muted-2 line-through">{formatPrice(official)}</span>
                <span>{formatPrice(ours)}</span>
              </Fragment>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              ["PROVIDERS", m.providers],
              ["P50 LATENCY", `${m.p50Ms} ms`],
              ["THROUGHPUT", `${m.tokPerSec} tok/s`],
              ["UPSTREAM", m.upstreamHost],
            ].map(([k, v]) => (
              <div key={k} className="flex min-w-0 flex-col gap-[3px]">
                <span className="text-[10px] text-muted-2">{k}</span>
                <span className="break-words">{v}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <span className="flex h-11 min-w-0 flex-1 items-center rounded-input border border-paper/10 bg-bg px-3 text-volt">
              <span className="truncate">{m.id}</span>
            </span>
            <CopyButton text={m.id} label="Copy ID" className="shrink-0 rounded-input border border-paper/20 px-3.5" />
          </div>
        </div>
      )}
    </article>
  );
}

function ModelRow({ m, open, onToggle }: { m: Model; open: boolean; onToggle: () => void }) {
  const low = m.capacityPct < 25;
  const prices: [string, number, number][] = [
    ["input", m.official.in, m.tokhive.in],
    ["output", m.official.out, m.tokhive.out],
    ["cache read", m.official.cacheRead, m.tokhive.cacheRead],
  ];
  const live: [string, string][] = [
    ["providers", String(m.providers)],
    ["p50 latency", `${m.p50Ms} ms`],
    ["throughput", `${m.tokPerSec} tok/s`],
    ["upstream", m.upstreamHost],
  ];
  return (
    <div role="rowgroup" className={`border-b border-line-soft ${open ? "bg-surface" : ""}`}>
      <div
        role="row"
        tabIndex={0}
        aria-expanded={open}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className={`${COLS} cursor-pointer items-center py-[18px] text-[15px]`}
      >
        <span role="cell" className="flex flex-col gap-[3px]">
          <span className="font-semibold">{m.name}</span>
          <span className="font-mono text-xs text-muted-2">{m.id}</span>
        </span>
        <span role="cell" className="flex items-center gap-2 text-text-2">
          <span className="clip-hex h-2.5 w-2.5" style={{ background: VENDOR_COLORS[m.vendor] }} />
          {m.vendor}
        </span>
        <span role="cell" className="font-mono text-text-2">
          {m.context}
        </span>
        <span role="cell" className="flex flex-col gap-[3px] font-mono">
          <span>
            {formatPrice(m.tokhive.in)} / {formatPrice(m.tokhive.out)}
          </span>
          <span className="text-xs text-muted-2 line-through">
            {formatPrice(m.official.in)} / {formatPrice(m.official.out)}
          </span>
        </span>
        <span role="cell" className="flex items-center gap-2">
          <span className="h-1.5 max-w-16 flex-1 overflow-hidden rounded-[2px] bg-surface-3">
            <span className={`block h-full ${low ? "bg-warn" : "bg-volt"}`} style={{ width: `${m.capacityPct}%` }} />
          </span>
          <span className="font-mono text-xs text-muted">{m.capacityPct}%</span>
        </span>
        <span role="cell" className="text-right">
          <span className="rounded-full bg-volt px-[9px] py-1 font-mono text-[13px] font-medium text-ink">
            −{savingsPct(m)}%
          </span>
        </span>
        <span role="cell" className="text-right font-mono text-sm text-muted" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </div>
      {open && (
        <div className="grid grid-cols-[1fr_1fr_1.3fr] gap-8 px-5 pt-1 pb-7">
          <div className="flex flex-col gap-2.5 font-mono text-[13px]">
            <span className="text-[11px] tracking-[0.06em] text-muted-2">PRICE / 1M TOKENS</span>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1.5">
              {prices.map(([k, off, ours]) => (
                <Fragment key={k}>
                  <span className="text-muted">{k}</span>
                  <span className="text-muted-2 line-through">{formatPrice(off)}</span>
                  <span>{formatPrice(ours)}</span>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2.5 font-mono text-[13px]">
            <span className="text-[11px] tracking-[0.06em] text-muted-2">LIVE · 1H</span>
            <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5">
              {live.map(([k, v]) => (
                <Fragment key={k}>
                  <span className="text-muted">{k}</span>
                  <span>{v}</span>
                </Fragment>
              ))}
            </div>
          </div>
          <div className="flex flex-col rounded-xl border border-paper/8 bg-bg px-4 py-3.5 font-mono text-xs leading-[1.7]">
            <div className="mb-1.5 flex justify-between text-[11px] text-muted-2">
              <span>QUICK START</span>
              <CopyButton text={curl(m.id)} />
            </div>
            {curl(m.id)
              .split("\n")
              .map((l, i) => (
                <span key={i} className={`overflow-hidden whitespace-pre ${i === 2 ? "text-volt" : "text-code"}`}>
                  {l}
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
