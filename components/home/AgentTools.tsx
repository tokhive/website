"use client";

import { useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { AGENT_SNIPPETS, type AgentTool } from "@/lib/mock/home";

const TOOLS = Object.keys(AGENT_SNIPPETS) as AgentTool[];

function lineColor(line: string) {
  if (line.startsWith("#") || line.startsWith("//")) return "text-muted-2";
  if (/tokhive/i.test(line)) return "text-volt";
  return "text-code";
}

export function AgentTools() {
  const [tool, setTool] = useState<AgentTool>("Claude Code");
  const lines = AGENT_SNIPPETS[tool];

  return (
    <section className="agent-tools site-container flex flex-col gap-8 pb-[120px] max-[899px]:pb-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="h2">Works in your agents.</h2>
        <span className="text-[15px] text-muted">Anthropic + OpenAI compatible</span>
      </div>
      <div role="tablist" aria-label="Agent tool" className="grid grid-cols-4 gap-2 max-[899px]:grid-cols-2">
        {TOOLS.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={t === tool}
            onClick={() => setTool(t)}
            className={`cursor-pointer rounded-code border p-[22px] text-left text-lg font-semibold ${
              t === tool ? "border-transparent bg-volt text-ink" : "border-paper/15 text-muted hover:opacity-80"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="relative min-h-[240px] overflow-x-auto rounded-code bg-surface px-8 py-7 font-mono text-[15px] leading-[1.8] max-sm:px-5 max-sm:text-[13px]">
        <CopyButton
          text={lines.join("\n")}
          className="absolute top-5 right-6 rounded-full border border-chip-border px-3 py-1 font-mono text-xs text-text-2"
        />
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre ${lineColor(l)}`}>
            {l || " "}
          </div>
        ))}
      </div>
    </section>
  );
}
