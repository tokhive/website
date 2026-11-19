"use client";

import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchModelPrices, platformOrder, type PublicModelPrice } from "@/lib/public-models";
import { HIVE_API_BASE_URL } from "@/lib/public-api";

type ModelsState = {
  status: "loading" | "ready" | "error";
  models: PublicModelPrice[];
};

const ModelsContext = createContext<(ModelsState & { retry: () => void }) | null>(null);

/** offeredOnly drops models nobody offers right now, which have no price. */
export function ModelsProvider({ children, offeredOnly = false }: { children: ReactNode; offeredOnly?: boolean }) {
  const [state, setState] = useState<ModelsState>({ status: "loading", models: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 10_000);
    fetchModelPrices(HIVE_API_BASE_URL, controller.signal)
      .then((models) => {
        // Hive lists platforms alphabetically; every list here leads with OpenAI.
        const ordered = [...models].sort(platformOrder);
        if (active) setState({ status: "ready", models: offeredOnly ? ordered.filter((m) => m.minimum_prices !== null) : ordered });
      })
      .catch(() => { if (active) setState({ status: "error", models: [] }); })
      .finally(() => clearTimeout(timeout));
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [attempt, offeredOnly]);

  const retry = () => {
    setState({ status: "loading", models: [] });
    setAttempt((value) => value + 1);
  };

  return <ModelsContext.Provider value={{ ...state, retry }}>{children}</ModelsContext.Provider>;
}

export function useModels() {
  const context = useContext(ModelsContext);
  if (!context) throw new Error("Model data requires ModelsProvider");
  return context;
}

export function ModelsStatus() {
  const t = useTranslations("ModelsStatus");
  const common = useTranslations("Common");
  const { status, models, retry } = useModels();
  if (status === "ready" && models.length) return null;
  return (
    <div role="status" className="px-7 py-5 font-mono text-[13px] text-muted">
      {status === "loading" ? t("loading") : status === "error" ? (
        <>
          {t("error")}{" "}
          <button type="button" onClick={retry} className="cursor-pointer text-volt underline">{common("tryAgain")}</button>
        </>
      ) : t("empty")}
    </div>
  );
}
