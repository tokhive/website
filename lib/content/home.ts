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
    'export ANTHROPIC_BASE_URL="https://api.tokhive.ai/anthropic"',
    'export ANTHROPIC_AUTH_TOKEN="hive_••••••••"',
    "",
    "# then just run",
    "claude",
  ],
  Codex: [
    "# ~/.codex/config.toml",
    'model = "gpt-6-sol"',
    'model_provider = "tokhive"',
    "",
    "[model_providers.tokhive]",
    'name = "TokHive"',
    'base_url = "https://api.tokhive.ai/v1/codex"',
    'model_catalog_url = "https://api.tokhive.ai/v1/codex/models"',
    'env_key = "HIVE_API_KEY"',
    'wire_api = "responses"',
    "requires_openai_auth = false",
  ],
  OpenCode: [
    "// ~/.config/opencode/opencode.json",
    "{",
    '  "provider": {',
    '    "tokhive": {',
    '      "npm": "@ai-sdk/openai",',
    '      "options": { "baseURL": "https://api.tokhive.ai/v1", "apiKey": "{env:HIVE_API_KEY}" },',
    '      "models": { "gpt-6-sol": {} }',
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
    '      "apiKey": "HIVE_API_KEY"',
    "    }",
    "  }",
    "}",
  ],
};
