"use client";

import { useModels } from "@/components/ModelsProvider";

export function ModelsSummary() {
  const { models, status } = useModels();
  const values = [
    { value: status === "ready" ? models.length : "—", label: "models available now" },
    { value: "$0", label: "monthly fee" },
  ];
  return (
    <div className="flex gap-10">
      {values.map(({ value, label }, index) => (
        <div key={label} className="flex flex-col gap-1">
          <span className={`font-mono text-[34px] font-medium tracking-[-0.03em] ${index === 0 ? "text-volt" : ""}`}>{value}</span>
          <span className="font-mono text-xs text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
