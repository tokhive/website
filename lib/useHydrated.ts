"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False while rendering on the server and hydrating, true once the page runs in the browser. */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
