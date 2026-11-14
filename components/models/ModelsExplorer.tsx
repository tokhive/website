"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Chip, Segmented } from "@/components/Chip";
import { CopyButton } from "@/components/CopyButton";
import { Modal } from "@/components/Modal";
import { VendorSelect } from "@/components/models/VendorSelect";
import { ModelsStatus, useModels } from "@/components/ModelsProvider";
import { useNetworkSnapshot } from "@/components/network/useNetworkSnapshot";
import {
  comparePrices, formatContextWindow, formatInputPrice,
  modelPlatformLabel, modelSavings, platformColor, PRICE_ITEMS,
  type PublicModelPrice as Model,
} from "@/lib/public-models";

const SORTS = ["Name", "Savings", "Price", "Capacity"] as const;
type Sort = (typeof SORTS)[number];

/** Free concurrency of a model: undefined while loading, null without online supply. */
const capacity = (free: Map<string, number> | null, id: string) => (free ? (free.get(id) ?? null) : undefined);

const COMPARE: Record<Exclude<Sort, "Capacity">, (a: Model, b: Model) => number> = {
  Name: (a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id),
  Savings: (a, b) => (modelSavings(b) ?? -1) - (modelSavings(a) ?? -1),
  Price: (a, b) => comparePrices(a.minimum_input_price, b.minimum_input_price),
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

/** Known capabilities are translated; others show as Hive reports them. */
function useCapabilityLabel() {
  const t = useTranslations("Models.capabilities");
  return (capability: string) => (t.has(capability as never) ? t(capability as never) : capability);
}

export function ModelsExplorer() {
  const t = useTranslations("Models.explorer");
  const capabilityLabel = useCapabilityLabel();
  const sortLabels = Object.fromEntries(SORTS.map((s) => [s, t(`sorts.${s}`)])) as Record<Sort, string>;
  const { models, status } = useModels();
  const network = useNetworkSnapshot();
  const freeByModel = useMemo(() => network && new Map(network.capacity.map((c) => [c.model, c.free_pct])), [network]);
  const VENDORS = [...new Set(models.map((model) => modelPlatformLabel(model.platform)))];
  const CAPABILITIES = [...new Set(models.flatMap((model) => model.capabilities))].sort();
  const vendorOptions = VENDORS.map((vendor) => ({
    value: vendor, label: vendor,
    count: models.filter((model) => modelPlatformLabel(model.platform) === vendor).length,
    color: platformColor(models.find((model) => modelPlatformLabel(model.platform) === vendor)!.platform),
  }));
  const params = useSearchParams();
  const [q, setQ] = useState(() => params.get("q") ?? "");
  const [vendors, setVendors] = useState<string[]>(() => params.get("vendor")?.split(",").filter(Boolean) ?? []);
  const [tags, setTags] = useState<string[]>(() => params.get("tag")?.split(",").filter(Boolean).map((tag) => tag.toLowerCase().replaceAll(" ", "_")) ?? []);
  const [sort, setSort] = useState<Sort>(() => parseList(params.get("sort"), SORTS)[0] ?? "Name");
  const [openId, setOpenId] = useState<string | null>(null);
  const search = useRef<HTMLInputElement>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [vendorQuery, setVendorQuery] = useState("");

  // Mirror filters into the URL without triggering a navigation.
  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set("q", q);
    if (vendors.length) next.set("vendor", vendors.join(","));
    if (tags.length) next.set("tag", tags.join(","));
    if (sort !== "Name") next.set("sort", sort);
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
    return models.filter(
      (m) =>
        (!vendors.length || vendors.includes(modelPlatformLabel(m.platform))) &&
        tags.every((t) => m.capabilities.includes(t)) &&
        (!needle || `${m.name} ${m.id}`.toLowerCase().includes(needle)),
    ).sort(sort === "Capacity"
      ? (a, b) => (capacity(freeByModel, b.id) ?? -1) - (capacity(freeByModel, a.id) ?? -1) || COMPARE.Name(a, b)
      : COMPARE[sort]);
  }, [models, q, vendors, tags, sort, freeByModel]);

  const toggleVendor = (v: string) => setVendors((vs) => (vs.includes(v) ? vs.filter((x) => x !== v) : [...vs, v]));
  const toggleTag = (t: string) => setTags((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));
  const reset = () => {
    setQ("");
    setVendors([]);
    setTags([]);
    setSort("Name");
  };

  if (status !== "ready" || models.length === 0) return <ModelsStatus />;

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
              placeholder={t("search")}
              aria-label={t("search")}
              className="min-w-0 flex-1 bg-transparent text-sm text-paper outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={`chip h-11 gap-2 md:hidden ${vendors.length + tags.length ? "chip-active" : ""}`}
          >
            {t("filters")}
            {vendors.length + tags.length > 0 && (
              <span className="rounded-full bg-ink px-1.5 py-0.5 text-[11px] text-volt">
                {vendors.length + tags.length}
              </span>
            )}
          </button>
          <div className="ml-auto flex flex-none items-center gap-2 font-mono text-xs whitespace-nowrap text-muted max-md:hidden">
            <span>{t("sort")}</span>
            <Segmented options={SORTS} value={sort} onChange={setSort} label={t("sortLabel")} labels={sortLabels} className="bg-surface" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 max-md:hidden">
          <VendorSelect options={vendorOptions} selected={vendors} onToggle={toggleVendor} onClear={() => setVendors([])} />
          {!!CAPABILITIES.length && <span className="h-6 w-px bg-line" aria-hidden="true" />}
          <div className="flex flex-wrap gap-1.5">
            {CAPABILITIES.map((t) => (
              <Chip key={t} active={tags.includes(t)} onClick={() => toggleTag(t)}>
                {capabilityLabel(t)}
              </Chip>
            ))}
          </div>
        </div>
        <div className="flex justify-between font-mono text-xs text-muted md:hidden">
          <span>{t("count", { count: rows.length })}</span>
          <span>
            {t("sort")} · <span className="text-paper">{sortLabels[sort]}</span>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto max-md:hidden">
        <div className="min-w-[940px]" role="table" aria-label={t("table")}>
          <div
            role="row"
            className={`${COLS} border-b border-line py-3 font-mono text-[11px] tracking-[0.06em] text-muted-2`}
          >
            <span role="columnheader">{t("columns.model")}</span>
            <span role="columnheader">{t("columns.vendor")}</span>
            <span role="columnheader">{t("columns.context")}</span>
            <span role="columnheader">
              {t.rich("columns.price", { official: (chunks) => <span className="line-through">{chunks}</span> })}
            </span>
            <span role="columnheader">{t("columns.capacity")}</span>
            <span role="columnheader" className="text-right">
              {t("columns.save")}
            </span>
            <span />
          </div>
          {rows.map((m) => (
            <ModelRow
              key={m.id}
              m={m}
              free={capacity(freeByModel, m.id)}
              open={openId === m.id}
              onToggle={() => setOpenId(openId === m.id ? null : m.id)}
            />
          ))}
          {rows.length === 0 && (
            <div className="px-5 py-16 text-center text-[15px] text-muted">
              {t("noMatch")}{" "}
              <button type="button" onClick={reset} className="cursor-pointer text-volt underline">
                {t("clear")}
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
            free={capacity(freeByModel, m.id)}
            open={openId === m.id}
            onToggle={() => setOpenId(openId === m.id ? null : m.id)}
          />
        ))}
        {!rows.length && (
          <p className="py-12 text-center text-[15px] text-muted">
            {t("noMatch")}{" "}
            <button type="button" onClick={reset} className="text-volt underline">
              {t("clear")}
            </button>
          </p>
        )}
      </div>
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} label={t("dialog")} className="filter-sheet">
        <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-paper/25" />
        <div className="flex shrink-0 items-center justify-between px-5 py-3">
          <h2 className="text-xl font-semibold">{t("filters")}</h2>
          <div className="flex gap-4">
            <button type="button" onClick={reset} className="min-h-11 font-mono text-[13px] text-volt">
              {t("reset")}
            </button>
            <button
              type="button"
              aria-label={t("closeFilters")}
              onClick={() => setFiltersOpen(false)}
              className="min-h-11 min-w-11 text-xl"
            >
              ×
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 pb-5">
          <fieldset>
            <legend className="mb-2.5 font-mono text-[11px] tracking-[.08em] text-muted">{t("sortBy")}</legend>
            <Segmented
              options={SORTS}
              value={sort}
              onChange={setSort}
              label={t("sortLabel")}
              labels={sortLabels}
              className="w-full justify-between bg-bg"
            />
          </fieldset>
          {!!CAPABILITIES.length && <fieldset>
            <legend className="mb-2.5 font-mono text-[11px] tracking-[.08em] text-muted">{t("capabilities")}</legend>
            <div className="flex flex-wrap gap-1.5">
              {CAPABILITIES.map((t) => (
                <Chip key={t} active={tags.includes(t)} onClick={() => toggleTag(t)}>
                  {capabilityLabel(t)}
                </Chip>
              ))}
            </div>
          </fieldset>}
          <fieldset>
            <legend className="mb-2.5 font-mono text-[11px] tracking-[.08em] text-muted">
              {t("vendorCount", { selected: vendors.length, total: VENDORS.length })}
            </legend>
            <input
              aria-label={t("filterVendors")}
              placeholder={t("filterVendors")}
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
                  <span className="clip-hex h-2.5 w-2.5" style={{ background: vendorOptions.find((option) => option.value === v)?.color }} />
                  <span className="text-[15px]">{v}</span>
                  <span className="font-mono text-xs text-muted-2">{models.filter((m) => modelPlatformLabel(m.platform) === v).length}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="shrink-0 border-t border-line-soft px-5 pt-3.5 pb-7">
          <button type="button" onClick={() => setFiltersOpen(false)} className="btn-primary min-h-[52px] w-full">
            {t("show", { count: rows.length })}
          </button>
        </div>
      </Modal>
      <div className="flex flex-wrap justify-between gap-3 pt-4 font-mono text-xs text-muted">
        <span>{t("notes.usd")}</span>
        <span>{t("notes.capacity")}</span>
        <span>{t("notes.quotes")}</span>
      </div>
    </>
  );
}

const priceLabel = (value: string | null | undefined) => value == null ? "—" : formatInputPrice(value);

function Savings({ model }: { model: Model }) {
  const savings = modelSavings(model);
  return savings === null ? null : (
    <span className="shrink-0 rounded-full bg-volt px-[9px] py-1 font-mono text-[13px] font-medium text-ink">−{savings}%</span>
  );
}

function PriceSummary({ model }: { model: Model }) {
  const t = useTranslations("Models.explorer");
  const common = useTranslations("Common");
  return (
    <span className="flex flex-col gap-[3px] font-mono">
      <span>{model.minimum_prices === null ? common("unavailable") : `${priceLabel(model.minimum_prices.input)} / ${priceLabel(model.minimum_prices.output)}`}</span>
      <span className="text-xs text-muted-2">{t("official", { input: priceLabel(model.official_prices.input), output: priceLabel(model.official_prices.output) })}</span>
    </span>
  );
}

function ModelDetails({ model, mobile = false }: { model: Model; mobile?: boolean }) {
  const t = useTranslations("Models.explorer");
  const capabilityLabel = useCapabilityLabel();
  const items = PRICE_ITEMS.filter((item) => Object.hasOwn(model.official_prices, item));
  return (
    <div className={`grid gap-6 font-mono text-xs ${mobile ? "" : "grid-cols-2"}`}>
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-2">
        <span className="text-muted-2">{t("details.perMillion")}</span>
        <span className="text-muted-2">{t("details.official")}</span>
        <span className="text-muted-2">{t("details.tokhive")}</span>
        {items.map((item) => (
          <Fragment key={item}>
            <span className="text-muted">{t(`items.${item}`)}</span>
            <span className="break-all text-muted-2">{priceLabel(model.official_prices[item])}</span>
            <span className="break-all">{priceLabel(model.minimum_prices?.[item])}</span>
          </Fragment>
        ))}
      </div>
      <div className="flex min-w-0 flex-col gap-3">
        {!!model.capabilities.length && <p className="text-muted">{model.capabilities.map(capabilityLabel).join(" · ")}</p>}
        <div className="flex min-w-0 items-center gap-2">
          <span className="min-w-0 flex-1 break-all text-volt">{model.id}</span>
          <CopyButton text={model.id} label={t("details.copyId")} className="shrink-0 rounded-input border border-paper/20 px-3 py-2" />
        </div>
        {!mobile && (
          <div className="min-w-0 rounded-xl border border-paper/8 bg-bg px-4 py-3.5 leading-[1.7]">
            <div className="mb-2 flex justify-between text-muted-2"><span>{t("details.quickStart")}</span><CopyButton text={curl(model.id)} /></div>
            {curl(model.id).split("\n").map((line, index) => <div key={index} className="overflow-x-auto whitespace-pre text-code">{line}</div>)}
          </div>
        )}
      </div>
    </div>
  );
}

function CapacityBar({ free, width }: { free: number | null | undefined; width: string }) {
  const t = useTranslations("Models.explorer");
  if (free === undefined) return null;
  if (free === null) return <span className="font-mono text-[11px] text-muted-2" title={t("noSupplyTitle")}>{t("noSupply")}</span>;
  return (
    <span className="flex items-center gap-2">
      <span className={`h-[5px] ${width} overflow-hidden rounded-[2px] bg-surface-3`}>
        <span className={`block h-full ${free < 25 ? "bg-warn" : "bg-volt"}`} style={{ width: `${free}%` }} />
      </span>
      <span className="font-mono text-[11px] text-muted">{free}%</span>
    </span>
  );
}

function MobileModelCard({ m, free, open, onToggle }: { m: Model; free: number | null | undefined; open: boolean; onToggle: () => void }) {
  return (
    <article className={`border-b border-line-soft ${open ? "bg-surface" : ""}`}>
      <button type="button" aria-expanded={open} aria-controls={`mobile-${m.id}`} onClick={onToggle}
        className="flex w-full cursor-pointer flex-col gap-3 px-5 py-[18px] text-left">
        <span className="flex w-full items-start justify-between gap-3">
          <span className="flex min-w-0 flex-col gap-1">
            <span className="text-base font-semibold">{m.name}</span>
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted">
              <span className="clip-hex h-[9px] w-[9px] shrink-0" style={{ background: platformColor(m.platform) }} />
              {modelPlatformLabel(m.platform)}{m.context_window !== null && ` · ${formatContextWindow(m.context_window)}`}
            </span>
          </span>
          <Savings model={m} />
        </span>
        <span className="flex w-full items-end justify-between gap-2 text-sm">
          <PriceSummary model={m} />
          <span className="flex items-center gap-2"><CapacityBar free={free} width="w-12" /><span className="w-3.5 text-right text-muted">{open ? "−" : "+"}</span></span>
        </span>
      </button>
      {open && <div id={`mobile-${m.id}`} className="px-5 pb-[22px]"><ModelDetails model={m} mobile /></div>}
    </article>
  );
}

function ModelRow({ m, free, open, onToggle }: { m: Model; free: number | null | undefined; open: boolean; onToggle: () => void }) {
  return (
    <div role="rowgroup" className={`border-b border-line-soft ${open ? "bg-surface" : ""}`}>
      <div role="row" tabIndex={0} aria-expanded={open} aria-controls={`model-${m.id}`} onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(); } }}
        className={`${COLS} cursor-pointer items-center py-[18px] text-[15px]`}>
        <span role="cell" className="flex min-w-0 flex-col gap-[3px]">
          <span className="font-semibold">{m.name}</span><span className="break-all font-mono text-xs text-muted-2">{m.id}</span>
        </span>
        <span role="cell" className="flex items-center gap-2 text-text-2">
          <span className="clip-hex h-2.5 w-2.5" style={{ background: platformColor(m.platform) }} />{modelPlatformLabel(m.platform)}
        </span>
        <span role="cell" className="font-mono text-text-2">{formatContextWindow(m.context_window)}</span>
        <span role="cell"><PriceSummary model={m} /></span>
        <span role="cell"><CapacityBar free={free} width="w-16" /></span>
        <span role="cell" className="text-right"><Savings model={m} /></span>
        <span role="cell" className="text-right font-mono text-sm text-muted" aria-hidden="true">{open ? "−" : "+"}</span>
      </div>
      {open && <div id={`model-${m.id}`} className="px-5 pt-1 pb-7"><ModelDetails model={m} /></div>}
    </div>
  );
}
