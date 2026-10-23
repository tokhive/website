"use client";

import { memo, useEffect, useMemo, useRef } from "react";

type HexFieldProps = {
  cols: number;
  rows: number;
  /** Cell radius in SVG units. */
  s: number;
  /**
   * flow: "bees" enter at column 0 and drift right, lighting cells as they pass.
   * sparkle: random online cells light up in bursts.
   */
  mode: "flow" | "sparkle";
  /** Tick interval in ms. */
  interval: number;
  /** Colour a cell lights up with. */
  lit: string;
  /** Stroke colour for outlined cells. */
  line: string;
  /** Fade-out duration in ms. */
  fadeMs: number;
  /** Min / max ms a lit cell holds before fading. */
  holdMin: number;
  holdMax: number;
  /** sparkle: cells lit per tick. */
  burst?: number;
  /** Share of cells that are "online". Online cells are filled with `idleFill`; the rest are outline only. */
  onlineRatio?: number;
  idleFill?: string;
  className?: string;
};

type Cell = { points: string; online: boolean };

const hash = (r: number, c: number) => Math.abs(Math.sin(r * 12.9898 + c * 78.233) * 43758.5453) % 1;

/**
 * Animated honeycomb background. Cells are rendered once; animation mutates the SVG DOM
 * directly so no React state changes per frame. Static when the user prefers reduced motion.
 */
export const HexField = memo(function HexField({
  cols,
  rows,
  s,
  mode,
  interval,
  lit,
  line,
  fadeMs,
  holdMin,
  holdMax,
  burst = 3,
  onlineRatio = 1,
  idleFill,
  className,
}: HexFieldProps) {
  const ref = useRef<SVGSVGElement>(null);
  const w = Math.sqrt(3) * s;

  const cells = useMemo<Cell[]>(() => {
    const out: Cell[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * w + (r % 2 ? w / 2 : 0) + w / 2;
        const cy = r * 1.5 * s + s;
        const points = [0, 1, 2, 3, 4, 5]
          .map((i) => {
            const a = (Math.PI / 180) * (60 * i - 30);
            return `${(cx + (s - 1.5) * Math.cos(a)).toFixed(1)},${(cy + (s - 1.5) * Math.sin(a)).toFixed(1)}`;
          })
          .join(" ");
        out.push({ points, online: hash(r, c) < onlineRatio });
      }
    }
    return out;
  }, [cols, rows, s, w, onlineRatio]);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lights = Array.from(svg.querySelectorAll<SVGPolygonElement>("polygon[data-light]"));
    const byIndex = new Map(lights.map((el) => [Number(el.dataset.light), el]));
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let id: ReturnType<typeof setInterval> | undefined;
    let bees: { r: number; c: number }[] = [];

    const light = (el: SVGPolygonElement | undefined) => {
      if (!el) return;
      el.style.transition = "none";
      el.style.fillOpacity = "1";
      const ms = holdMin + Math.random() * (holdMax - holdMin);
      requestAnimationFrame(() => {
        el.style.transition = `fill-opacity ${fadeMs}ms ease-out`;
        const t = setTimeout(() => {
          el.style.fillOpacity = "0";
          timers.delete(t);
        }, ms);
        timers.add(t);
      });
    };

    const tick = () => {
      if (mode === "flow") {
        if (Math.random() < 0.5) bees.push({ r: Math.floor(Math.random() * rows), c: 0 });
        for (const b of bees) {
          light(byIndex.get(b.r * cols + b.c));
          b.c++;
          const q = Math.random();
          if (q < 0.2 && b.r > 0) b.r--;
          else if (q > 0.8 && b.r < rows - 1) b.r++;
        }
        bees = bees.filter((b) => b.c < cols);
      } else {
        for (let k = 0; k < burst; k++) light(lights[Math.floor(Math.random() * lights.length)]);
      }
    };

    const stop = () => {
      clearInterval(id);
      id = undefined;
      timers.forEach(clearTimeout);
      timers.clear();
      bees = [];
      lights.forEach((el) => {
        el.style.transition = "none";
        el.style.fillOpacity = "0";
      });
    };
    const sync = () => {
      if (mq.matches || document.hidden) stop();
      else if (!id) id = setInterval(tick, interval);
    };

    sync();
    mq.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      mq.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [cells, mode, interval, fadeMs, holdMin, holdMax, burst, cols, rows]);

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${cols * w + w / 2} ${rows * 1.5 * s + s / 2}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ display: "block" }}
      aria-hidden="true"
    >
      {cells.map((cell, i) => {
        const filled = cell.online && idleFill;
        return (
          <g key={i}>
            {filled && <polygon points={cell.points} fill={idleFill} />}
            {cell.online ? (
              <polygon
                points={cell.points}
                data-light={i}
                fill={lit}
                fillOpacity={0}
                stroke={filled ? "none" : line}
                strokeWidth={1}
              />
            ) : (
              <polygon points={cell.points} fill="none" stroke={line} strokeWidth={1} />
            )}
          </g>
        );
      })}
    </svg>
  );
});
