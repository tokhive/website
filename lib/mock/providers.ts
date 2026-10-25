import type { FaqItem } from "@/components/Accordion";

export type ProviderPlan = { name: string; price: number; rate: number };
// Sample rates from the design; replace with the provider earnings API.
export const PROVIDER_PLANS: ProviderPlan[] = [
  { name: "Claude Max 20x", price: 200, rate: 5.4 },
  { name: "Claude Max 5x", price: 100, rate: 2.5 },
  { name: "Claude Pro", price: 20, rate: 0.5 },
  { name: "ChatGPT Pro", price: 200, rate: 4.6 },
  { name: "ChatGPT Plus", price: 20, rate: 0.45 },
  { name: "Gemini AI Ultra", price: 250, rate: 3.5 },
];
export type ProviderDetail = { title: string; description: string };
export const PROVIDER_STEPS: (ProviderDetail & { meta: string })[] = [
  {
    title: "Connect your plan",
    description:
      "Sign in to your subscription from inside our TEE. The session is sealed in the enclave, and nobody at TokHive ever sees it.",
    meta: "Claude · ChatGPT · Gemini",
  },
  {
    title: "Set your reserve",
    description:
      "Choose how much quota to keep for yourself and when sharing is allowed. You can change it at any time.",
    meta: "reserve · schedule · daily cap",
  },
  {
    title: "Get paid weekly",
    description:
      "Every token you serve is metered and attested. Earnings settle every Monday in USDC or by bank transfer.",
    meta: "min. payout $20",
  },
];
export const PROVIDER_CONTROLS: ProviderDetail[] = [
  {
    title: "Reserve you set",
    description: "TokHive only routes traffic to quota above your reserve. Your share never eats into your own limit.",
  },
  {
    title: "Auto-pause when you work",
    description: "When you start using your plan, sharing pauses on that account and picks up again once you go idle.",
  },
  { title: "Daily caps and schedules", description: "Limit tokens per day, or only share overnight and at weekends." },
  {
    title: "Revoke in one click",
    description: "Disconnect at any time. The sealed session is destroyed inside the enclave straight away.",
  },
];
export const PROVIDER_SAFETY: ProviderDetail[] = [
  {
    title: "Credentials never leave the enclave",
    description: "Your session is sealed inside an AMD SEV-SNP confidential VM and cannot be exported by TokHive operators.",
  },
  {
    title: "Vetted, rate-limited buyers",
    description:
      "Builders pass KYC and are bound by the Acceptable Use Policy. Abusive keys are cut off automatically.",
  },
  {
    title: "Per-account limits",
    description: "Each provider account has its own hard ceiling on concurrency and daily volume.",
  },
  {
    title: "Full audit trail",
    description: "Every request served from your plan is attested and listed in your dashboard.",
  },
];
export const PAYOUT_STATEMENT: { model: string; tokens: string; amount: string }[] = [
  { model: "claude-sonnet-4-5", tokens: "18.4M tok", amount: "$31.62" },
  { model: "claude-opus-4-1", tokens: "1.1M tok", amount: "$11.88" },
  { model: "claude-haiku-4-5", tokens: "9.2M tok", amount: "$6.21" },
  { model: "cache reads", tokens: "41.0M tok", amount: "$2.47" },
];
export const PROVIDER_FAQ: FaqItem[] = [
  {
    question: 'What does "idle quota" mean?',
    answer:
      "Most subscriptions give you a usage allowance that resets on a rolling window. Whatever you do not use before it resets is idle, and that is the only part TokHive sells.",
  },
  {
    question: "Will my own requests ever be slower or blocked?",
    answer: "No. Your reserve is never shared, and sharing pauses automatically when you are active on the account.",
  },
  {
    question: "Can I stop at any time?",
    answer:
      "Yes. Disconnect from the dashboard and routing stops immediately. Earnings already accrued are paid out on the next Monday.",
  },
  {
    question: "How are earnings calculated?",
    answer:
      "You earn a share of what builders pay for the tokens served from your plan, at per-model rates shown in the dashboard. The estimate above uses the last 30 days of network demand.",
  },
  {
    question: "Do I need to keep my computer on?",
    answer: "No. Your sealed session runs in our enclave, not on your machine.",
  },
];
