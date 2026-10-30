"use client";

import { useEffect, useState } from "react";
import { HIVE_API_BASE_URL } from "@/lib/public-api";
import { fetchPublicNetwork, type PublicNetwork } from "@/lib/public-network";

// One request per page load, shared by every component that reads the snapshot.
let snapshot: Promise<PublicNetwork> | null = null;
function loadSnapshot(): Promise<PublicNetwork> {
  snapshot ??= fetchPublicNetwork(HIVE_API_BASE_URL, AbortSignal.timeout(10_000)).catch((error) => {
    snapshot = null;
    throw error;
  });
  return snapshot;
}

/** Reads the network summary once; null while loading or when Hive is unavailable. */
export function useNetworkSnapshot(): PublicNetwork | null {
  const [data, setData] = useState<PublicNetwork | null>(null);
  useEffect(() => {
    let active = true;
    loadSnapshot()
      .then((value) => { if (active) setData(value); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  return data;
}
