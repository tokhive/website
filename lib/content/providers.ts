import type { FaqItem } from "@/components/Accordion";

/**
 * A plan Bee can share. `platform` and `plan` match what Hive reports; `sample` is the
 * illustrative monthly earning with all quota sold, used until Hive has measured the plan.
 */
export type ProviderPlan = { name: string; platform: string; plan: string; price: number; priceLabel: string; sample: number };
export const PROVIDER_PLANS: ProviderPlan[] = [
  { name: "Claude Max", platform: "claude", plan: "max", price: 100, priceLabel: "$100–200/mo", sample: 212 },
  { name: "Claude Pro", platform: "claude", plan: "pro", price: 20, priceLabel: "$20/mo", sample: 42 },
  { name: "ChatGPT Pro", platform: "openai", plan: "pro", price: 200, priceLabel: "$200/mo", sample: 391 },
  { name: "ChatGPT Pro Lite", platform: "openai", plan: "prolite", price: 100, priceLabel: "$100/mo", sample: 195 },
  { name: "ChatGPT Plus", platform: "openai", plan: "plus", price: 20, priceLabel: "$20/mo", sample: 38 },
];
export type ProviderDetail = { title: string; description: string };
export const PROVIDER_STEPS: (ProviderDetail & { meta: string })[] = [
  {
    title: "Sign in locally",
    description:
      "Sign in to your subscription account on your computer. Bee encrypts your credentials with the TEE public key before uploading them. Only the TEE can decrypt them; nobody at TokHive can see your credentials in plaintext.",
    meta: "Claude · ChatGPT",
  },
  {
    title: "Start sharing with Bee",
    description:
      "Run Bee on your computer and keep it connected to share your subscription quota. You can start or stop sharing at any time.",
    meta: "keep Bee online · stop anytime",
  },
  {
    title: "Earn in real time",
    description:
      "Each successful request is metered and verified. Earnings are credited to your earnings balance in real time as settlement completes.",
    meta: "per-request settlement",
  },
];
export const PROVIDER_CONTROLS: ProviderDetail[] = [
  {
    title: "Stop sharing anytime",
    description: "Stop sharing whenever you need your subscription quota for your own work.",
  },
  {
    title: "Start on your terms",
    description: "Start and stop sharing manually as your needs change.",
  },
  { title: "Track your earnings", description: "Review your settled earnings and per-request records in the dashboard." },
  {
    title: "Keep what you earned",
    description: "Stopping sharing does not affect earnings already settled.",
  },
];
export const PROVIDER_SAFETY: ProviderDetail[] = [
  {
    title: "Credentials encrypted before upload",
    description: "Bee encrypts upstream access credentials with the TEE public key. Only the TEE can decrypt the uploaded envelope.",
  },
  {
    title: "Bound by the Acceptable Use Policy",
    description: "Buyers agree to the Acceptable Use Policy, and keys that break it can be revoked.",
  },
  {
    title: "Per-account limits",
    description: "Hive applies per-account concurrency limits when assigning requests.",
  },
  {
    title: "Full audit trail",
    description: "Every request served from your plan carries a signed receipt you can download from your dashboard.",
  },
];
// Illustrative, at roughly TokHive's floor prices (mostly input, ~10% output).
export const SETTLEMENT_EXAMPLE: { model: string; tokens: string; amount: string }[] = [
  { model: "claude-opus-5-5", tokens: "18.4M tok", amount: "$11.33" },
  { model: "gpt-6-sol", tokens: "22.0M tok", amount: "$6.78" },
  { model: "claude-sonnet-5-5", tokens: "9.2M tok", amount: "$2.83" },
  { model: "cache reads", tokens: "41.0M tok", amount: "$0.74" },
];
/** Sum of the example amounts. */
export const SETTLEMENT_TOTAL = "+$21.68";
export const PROVIDER_FAQ: FaqItem[] = [
  {
    question: 'What does "idle quota" mean?',
    answer:
      "Idle quota is unused capacity in your subscription. You choose when to share it by starting or stopping sharing.",
  },
  {
    question: "Will my own requests ever be slower or blocked?",
    answer: "You can stop sharing at any time.",
  },
  {
    question: "Can I stop at any time?",
    answer:
      "Yes. Pause sharing from Bee on your computer with the bee pause command, and start again with bee resume. Stopping sharing does not affect earnings already settled.",
  },
  {
    question: "When are earnings settled, and how do I withdraw them?",
    answer:
      "Each successful request is settled in real time and credited to your earnings balance. Withdraw from your wallet in Web3 stablecoins, with a $10 minimum and a network fee based on the actual on-chain cost. Settlement does not wait for your balance to reach the withdrawal minimum.",
  },
  {
    question: "How are earnings calculated?",
    answer:
      "Earnings are calculated from your successfully served usage and the applicable provider rates. The calculator above uses illustrative assumptions.",
  },
  {
    question: "Do I need to keep my computer on?",
    answer:
      "Yes. Keep your computer on, connected to the internet and running Bee while sharing. Your computer must stay awake; while it is asleep or offline, it cannot receive new requests.",
  },
];
