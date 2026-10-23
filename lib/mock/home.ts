// Sample figures for the home page.

export type KeyValue = { k: string; v: string };

export type PayoutsSummary = {
  allTimeUsd: number;
  avgMonthlyPerProvider: number;
  /** Monthly payouts in $K, oldest first; the last entry is the current month. */
  monthly: number[];
  fromLabel: string;
  toLabel: string;
};

export const HERO_STATS = {
  paidOut: "$2.4M paid out",
  avgSaving: "avg. −58% vs list",
};

export const PAYOUTS: PayoutsSummary = {
  allTimeUsd: 2418906,
  avgMonthlyPerProvider: 186,
  monthly: [42, 58, 71, 90, 118, 140, 171, 205, 236, 281, 322, 368],
  fromLabel: "Nov ’25",
  toLabel: "Oct ’26",
};

export const ATTESTATION_SAMPLE: KeyValue[] = [
  { k: "ENCLAVE", v: "Intel TDX · v1.5" },
  { k: "UPSTREAM", v: "api.anthropic.com" },
  { k: "MODEL", v: "claude-sonnet-4-5" },
  { k: "MEASUREMENT", v: "0x9f3a…c71e" },
];

export type AgentTool = "Claude Code" | "Codex" | "OpenCode" | "Pi";

export const AGENT_SNIPPETS: Record<AgentTool, string[]> = {
  "Claude Code": [
    "# ~/.zshrc",
    'export ANTHROPIC_BASE_URL="https://api.tokhive.ai"',
    'export ANTHROPIC_AUTH_TOKEN="thk_live_••••••••"',
    "",
    "# then just run",
    "claude",
  ],
  Codex: [
    "# ~/.codex/config.toml",
    'model = "gpt-5-codex"',
    'model_provider = "tokhive"',
    "",
    "[model_providers.tokhive]",
    'name = "TokHive"',
    'base_url = "https://api.tokhive.ai/v1"',
    'env_key = "TOKHIVE_API_KEY"',
  ],
  OpenCode: [
    "// opencode.json",
    "{",
    '  "provider": {',
    '    "tokhive": {',
    '      "npm": "@ai-sdk/openai-compatible",',
    '      "options": { "baseURL": "https://api.tokhive.ai/v1" },',
    '      "models": { "claude-sonnet-4.5": {} }',
    "    }",
    "  }",
    "}",
  ],
  Pi: [
    "// ~/.pi/agent/models.json",
    "{",
    '  "providers": {',
    '    "tokhive": {',
    '      "baseUrl": "https://api.tokhive.ai/v1",',
    '      "api": "openai-completions",',
    '      "apiKey": "TOKHIVE_API_KEY"',
    "    }",
    "  }",
    "}",
  ],
};
