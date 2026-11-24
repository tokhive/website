"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Chip, Segmented } from "@/components/Chip";
import { NetworkProvider, useNetwork } from "@/components/network/NetworkProvider";
import { formatInt } from "@/lib/format";
import { openingTiles, tokensPerTile } from "@/lib/live-hive";
import type { NetVendor } from "@/lib/public-network";
import type { Backdrop, HiveScene, Palette } from "./hive-scene";

const BACKDROPS = ["dust", "orbits", "floor", "plain"] as const;
const PALETTES = ["duo", "mono"] as const;
const MODELS_SHOWN = 6;
const STORE = { backdrop: "tokhive.live.backdrop", palette: "tokhive.live.palette" };

/** A choice the visitor made earlier, if the browser kept it and it is still on offer. */
function stored<T extends string>(key: string, options: readonly T[]): T | null {
  try {
    const value = localStorage.getItem(key);
    return options.includes(value as T) ? (value as T) : null;
  } catch {
    return null;
  }
}
function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // A browser that refuses storage just forgets the choice.
  }
}

export function LiveHive() {
  return (
    <NetworkProvider>
      <LiveHiveView />
    </NetworkProvider>
  );
}

function LiveHiveView() {
  const t = useTranslations("Live");
  const { status, data, requests } = useNetwork();
  const canvas = useRef<HTMLCanvasElement>(null);
  const hive = useRef<HiveScene | null>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [backdrop, setBackdrop] = useState<Backdrop>("dust");
  const [palette, setPalette] = useState<Palette>("duo");
  const [playing, setPlaying] = useState(true);

  // What the browser knows and the server does not: earlier choices, and a wish for less motion.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- these only exist on the client */
    const savedBackdrop = stored(STORE.backdrop, BACKDROPS), savedPalette = stored(STORE.palette, PALETTES);
    if (savedBackdrop) setBackdrop(savedBackdrop);
    if (savedPalette) setPalette(savedPalette);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // three.js is large and only this page needs it, so it loads after the page does.
  useEffect(() => {
    let wanted = true;
    let mounted: HiveScene | null = null;
    import("./hive-scene")
      .then(({ mountHive }) => {
        if (!wanted || !canvas.current) return;
        mounted = mountHive(canvas.current, { backdrop: "dust", palette: "duo", playing: true });
        hive.current = mounted;
        setReady(true);
      })
      .catch(() => wanted && setFailed(true));
    return () => {
      wanted = false;
      mounted?.dispose();
      hive.current = null;
    };
  }, []);
  useEffect(() => hive.current?.setBackdrop(backdrop), [backdrop, ready]);
  useEffect(() => hive.current?.setPalette(palette), [palette, ready]);
  useEffect(() => hive.current?.setPlaying(playing), [playing, ready]);

  // One tile stands for a round number of tokens, picked from the day's average so the hive is
  // neither dark nor saturated.
  const perTile = data ? tokensPerTile(data.traffic.tokens_24h / 86_400) : null;
  const opened = useRef(false);
  const played = useRef<Set<number> | null>(null);
  useEffect(() => {
    const scene = hive.current;
    if (!ready || !scene || !data || perTile === null) return;
    if (!opened.current) {
      // Open at the day's average pace rather than dark.
      opened.current = true;
      const tiles = openingTiles(data.traffic.tokens_24h, data.models, perTile);
      for (const vendor of Object.keys(tiles) as NetVendor[]) scene.add(vendor, tiles[vendor] ?? 0);
    }
    if (!requests.length) return;
    if (!played.current) {
      // The first feed is already inside that average; only requests finishing from now on are new.
      played.current = new Set(requests.map((r) => r.id));
      return;
    }
    for (const r of requests) {
      if (played.current.has(r.id)) continue;
      played.current.add(r.id);
      scene.add(r.vendor, r.tokens / perTile);
    }
  }, [ready, data, requests, perTile]);

  const models = data ? [...data.models].sort((a, b) => b.tokens - a.tokens).slice(0, MODELS_SHOWN) : [];
  const total = data ? data.models.reduce((sum, m) => sum + m.tokens, 0) : 0;
  const swatch = (vendor: NetVendor) => (palette === "mono" || vendor === "anthropic" ? "bg-volt" : "bg-paper");

  return (
    <section className="live-hive relative h-[calc(100svh-72px)] min-h-[620px] overflow-hidden max-sm:h-[calc(100svh-64px)]">
      <h1 className="sr-only">{t("heading")}</h1>
      <canvas
        ref={canvas}
        role="img"
        aria-label={t("canvas")}
        className="absolute inset-0 block h-full w-full cursor-grab touch-pan-y data-[dragging]:cursor-grabbing"
      />
      {failed && (
        <p className="absolute inset-0 m-auto h-max max-w-[26em] px-6 text-center text-[15px] leading-[1.6] text-text-2">
          {t("noWebgl")}
        </p>
      )}

      <div className="pointer-events-none relative mx-auto h-full max-w-[1280px] site-px">
        <div className="w-[min(320px,100%)] pt-10 max-sm:pt-4">
          <span className="eyebrow text-muted">{t("eyebrow")}</span>
          <div className="mt-1.5 text-[clamp(38px,4.6vw,62px)] leading-[1.05] font-semibold tracking-[-0.035em] tabular-nums max-sm:text-4xl">
            {data ? formatInt(data.traffic.tokens_24h) : "—"}
          </div>
          <div className="mt-1.5 text-[13px] text-text-2 tabular-nums">
            {data
              ? t("rate", { count: formatInt(Math.round(data.traffic.tokens_24h / 86_400)) })
              : status === "error" ? t("unavailable") : " "}
          </div>
          {models.length > 0 && (
            <ul aria-label={t("models")} className="mt-6 grid gap-2.5 max-sm:mt-4 max-sm:gap-1.5">
              {models.map((m) => {
                const share = total > 0 ? (m.tokens / total) * 100 : 0;
                return (
                  <li
                    key={m.model}
                    className="grid grid-cols-[11px_minmax(0,1fr)_76px_46px] items-center gap-2.5 font-mono text-[12.5px] text-link-footer max-sm:grid-cols-[11px_minmax(0,1fr)_46px] max-sm:text-xs"
                  >
                    <i className={`clip-hex h-3 w-[11px] ${swatch(m.vendor)}`} />
                    <span className="truncate">{m.model}</span>
                    <span className="h-1 overflow-hidden rounded-sm bg-paper/10 max-sm:hidden">
                      <b className={`block h-full rounded-sm ${swatch(m.vendor)}`} style={{ width: `${share.toFixed(1)}%` }} />
                    </span>
                    <span className="text-right text-text-2 tabular-nums">{share.toFixed(1)}%</span>
                  </li>
                );
              })}
            </ul>
          )}
          {perTile !== null && (
            <p className="mt-5 text-xs leading-[1.65] text-muted max-sm:hidden">
              {palette === "duo" && `${t("keyDuo")} `}
              {t("key", { tokens: formatInt(perTile) })} {t("drag")}
            </p>
          )}
        </div>

        <div className="pointer-events-auto absolute inset-x-0 bottom-5 flex flex-wrap items-center justify-center gap-2 px-5">
          <Segmented
            options={BACKDROPS}
            value={backdrop}
            onChange={(value) => {
              setBackdrop(value);
              store(STORE.backdrop, value);
            }}
            label={t("backdrop.label")}
            labels={{ dust: t("backdrop.dust"), orbits: t("backdrop.orbits"), floor: t("backdrop.floor"), plain: t("backdrop.plain") }}
            className="bg-surface"
          />
          <Segmented
            options={PALETTES}
            value={palette}
            onChange={(value) => {
              setPalette(value);
              store(STORE.palette, value);
            }}
            label={t("palette.label")}
            labels={{ duo: t("palette.duo"), mono: t("palette.mono") }}
            className="bg-surface"
          />
          <Chip active={false} className="bg-surface" onClick={() => setPlaying((on) => !on)}>
            {playing ? t("pause") : t("play")}
          </Chip>
        </div>
      </div>
    </section>
  );
}
