"use client";

import { useEffect, useState } from "react";

/** Increments every `ms` while the tab is visible. Stand-in for the network SSE stream. */
export function useTick(ms: number): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden) setTick((t) => t + 1);
    }, ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}
