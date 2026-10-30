"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { HIVE_API_BASE_URL } from "@/lib/public-api";
import {
  fetchNetworkRequests, fetchPublicNetwork, mergeRequests, type NetworkRequest, type PublicNetwork,
} from "@/lib/public-network";

// Hive caches the summary for a minute and the feed in 10-second buckets.
const SUMMARY_MS = 60_000;
const FEED_MS = 10_000;
const FEED_ROWS = 9;

type NetworkState = {
  status: "loading" | "ready" | "error";
  data: PublicNetwork | null;
  requests: NetworkRequest[];
  /** When the summary or feed last arrived. */
  updatedAt: number | null;
};
const NetworkContext = createContext<NetworkState | null>(null);

/** Polls while the tab is visible; a failed poll keeps the last good data. */
function usePoll(ms: number, poll: (signal: AbortSignal) => Promise<void>) {
  useEffect(() => {
    let controller: AbortController | null = null;
    const run = () => {
      if (document.hidden) return;
      controller?.abort();
      controller = new AbortController();
      const timeout = setTimeout(() => controller?.abort(), 10_000);
      poll(controller.signal).finally(() => clearTimeout(timeout));
    };
    run();
    const id = setInterval(run, ms);
    document.addEventListener("visibilitychange", run);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", run);
      controller?.abort();
    };
  }, [ms, poll]);
}

const pollSummary = (set: React.Dispatch<React.SetStateAction<NetworkState>>) => (signal: AbortSignal) =>
  fetchPublicNetwork(HIVE_API_BASE_URL, signal)
    .then((data) => set((s) => ({ ...s, status: "ready", data, updatedAt: Date.now() })))
    .catch(() => set((s) => (s.data || signal.aborted ? s : { ...s, status: "error" })));

const pollFeed = (set: React.Dispatch<React.SetStateAction<NetworkState>>) => (signal: AbortSignal) =>
  fetchNetworkRequests(HIVE_API_BASE_URL, signal)
    .then((incoming) => set((s) => ({ ...s, requests: mergeRequests(s.requests, incoming, FEED_ROWS), updatedAt: Date.now() })))
    .catch(() => undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NetworkState>({ status: "loading", data: null, requests: [], updatedAt: null });
  const [summary] = useState(() => pollSummary(setState));
  const [feed] = useState(() => pollFeed(setState));
  usePoll(SUMMARY_MS, summary);
  usePoll(FEED_MS, feed);
  return <NetworkContext.Provider value={state}>{children}</NetworkContext.Provider>;
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (!context) throw new Error("Network data requires NetworkProvider");
  return context;
}
