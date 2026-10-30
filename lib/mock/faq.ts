import type { FaqItem } from "@/components/Accordion";

const CONTENT: [string, string][] = [
  [
    "How do I know the tokens really come from the official vendor?",
    "Every request is relayed from inside an AMD SEV-SNP confidential VM that can only open TLS connections to official vendor endpoints. Each response carries a signed attestation report (application measurement, upstream host and response hash) that you can check with our open-source verifier.",
  ],
  [
    "Can TokHive or other users see my credentials or prompts?",
    "Bee encrypts upstream credentials with the TEE public key before uploading them. Hive processes buyer requests for routing and execution, and failure diagnostics can retain request and response content. Providers do not see buyer content through Bee's encrypted relay.",
  ],
  [
    "How much can I earn as a provider?",
    "Earnings depend on your available quota, provider rates and the requests you successfully serve. Each request is settled individually, and you can review your settled earnings in the dashboard.",
  ],
  [
    "Will sharing affect my own usage?",
    "Sharing uses your subscription quota. You can stop sharing at any time when you need that quota for your own requests.",
  ],
  [
    "How are prices set?",
    "Prices are set at a discount to the official vendor prices. The discount is adjusted periodically based on supply and demand.",
  ],
  [
    "Which tools and SDKs work with TokHive?",
    "Anything that speaks the OpenAI or Anthropic API: Claude Code, Codex, OpenCode, Pi, Cursor, the official SDKs, LangChain and more. You only change the base URL and the API key.",
  ],
  [
    "How do settlement and withdrawals work?",
    "Earnings are credited to your earnings balance in real time as each successful request settles. Withdrawals are separate, with a $20 minimum via Web3 stablecoins. You can review per-request settlement records in your dashboard.",
  ],
];

export const HOME_FAQ: FaqItem[] = CONTENT.map(([question, answer]) => ({ question, answer }));
