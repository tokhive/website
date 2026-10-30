"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { HIVE_API_BASE_URL } from "@/lib/public-api";
import { fetchPublicEarnings, type PublicEarnings } from "@/lib/public-earnings";

type EarningsState = { status: "loading" | "ready" | "error"; data: PublicEarnings | null };
const EarningsContext = createContext<(EarningsState & { retry: () => void }) | null>(null);

export function EarningsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EarningsState>({ status: "loading", data: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 10_000);
    fetchPublicEarnings(HIVE_API_BASE_URL, controller.signal)
      .then((data) => { if (active) setState({ status: "ready", data }); })
      .catch(() => { if (active) setState({ status: "error", data: null }); })
      .finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);
  const retry = () => {
    setState({ status: "loading", data: null });
    setAttempt((value) => value + 1);
  };
  return <EarningsContext.Provider value={{ ...state, retry }}>{children}</EarningsContext.Provider>;
}

export function useEarnings() {
  const context = useContext(EarningsContext);
  if (!context) throw new Error("Earnings data requires EarningsProvider");
  return context;
}
