import type { FaqItem } from "@/components/Accordion";

const CONTENT: [string, string][] = [
  [
    "How do I know the tokens really come from the official vendor?",
    "Every request is relayed from inside an AMD SEV-SNP confidential VM that can only open TLS connections to official vendor endpoints. Each response carries a signed attestation report (application measurement, upstream host, model, token counts) that you can check with our open-source verifier.",
  ],
  [
    "Can TokHive or other users see my credentials or prompts?",
    "No. Provider credentials are sealed inside the enclave and never leave it in plaintext, not even to TokHive operators. Prompts and completions pass through in memory and are not stored.",
  ],
  [
    "How much can I earn as a provider?",
    "It depends on your plan and how much of it sits idle. The average active provider earns about $186 a month. The dashboard shows a live estimate before you switch sharing on.",
  ],
  [
    "Will sharing affect my own usage?",
    "You choose how much quota to keep for yourself. TokHive only routes traffic to the remainder, and it pauses automatically while you are actively using your plan.",
  ],
  [
    "How are prices set?",
    "Prices float hourly with pooled provider capacity, and they never go above the vendor list price. There is no subscription or minimum. You pay per 1M tokens from a prepaid balance.",
  ],
  [
    "Which tools and SDKs work with TokHive?",
    "Anything that speaks the OpenAI or Anthropic API: Claude Code, Codex, OpenCode, Pi, Cursor, the official SDKs, LangChain and more. You only change the base URL and the API key.",
  ],
  [
    "How and when do providers get paid?",
    "Payouts run weekly in USDC or by bank transfer once your balance passes $20. Every payout is itemised per request in your dashboard.",
  ],
];

export const HOME_FAQ: FaqItem[] = CONTENT.map(([question, answer]) => ({ question, answer }));
