// Sample figures for the home page.

/** Shown until Hive's latest receipt arrives, or when there is none. */
export const ATTESTATION_SAMPLE = {
  enclave: "AMD SEV-SNP",
  upstream: "api.anthropic.com",
  model: "claude-opus-5-5",
  measurement: "snp-app:9f3a…c71e",
};

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
