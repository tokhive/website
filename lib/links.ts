// Shared destinations for navigation, calls to action and policy pages.
const CONSOLE_URL = "https://console.tokhive.ai";

export const LINKS = {
  docs: "https://docs.tokhive.ai",
  blog: "https://docs.tokhive.ai/blog",
  github: "https://github.com/tokhive",
  twitter: "https://x.com/tokhive",
  terms: "/terms",
  privacy: "/privacy",
  aup: "/acceptable-use",
  email: "mailto:hello@tokhive.ai",
  telegram: "https://t.me/tokhive",
  discord: "https://discord.gg/nrVU4vSShw",
  signIn: CONSOLE_URL,
  getApiKey: CONSOLE_URL,
  shareQuota: CONSOLE_URL,
  connectPlan: CONSOLE_URL,
  verifier: "https://github.com/tokhive/verifier",
  webVerifier: "https://verifier.tokhive.ai/",
  teeReleases: "https://github.com/tokhive/tee/releases",
  teeCatalog: "https://github.com/tokhive/tee/blob/main/releases/catalog.json",
  verificationGuide: "https://github.com/tokhive/tee/blob/main/docs/public-verification.md",
  reportVulnerability: "https://github.com/tokhive/tee/security/advisories/new",
} as const;

/** `label` is a message key, or the text itself when `literal` is set. */
export type NavLink<K extends string = string> = { label: K; href: string; external?: boolean; literal?: boolean };

type FooterKey =
  | "modelsPricing" | "network" | "providers" | "security" | "docs" | "blog" | "github" | "twitter"
  | "terms" | "privacy" | "aup" | "telegram" | "discord";

export const FOOTER_COLUMNS: { heading: "product" | "resources" | "legal" | "contact"; links: NavLink<FooterKey | "hello@tokhive.ai">[] }[] = [
  {
    heading: "product",
    links: [
      { label: "modelsPricing", href: "/models" },
      { label: "network", href: "/network" },
      { label: "providers", href: "/providers" },
      { label: "security", href: "/security" },
    ],
  },
  {
    heading: "resources",
    links: [
      { label: "docs", href: LINKS.docs, external: true },
      { label: "blog", href: LINKS.blog, external: true },
      { label: "github", href: LINKS.github, external: true },
      { label: "twitter", href: LINKS.twitter, external: true },
    ],
  },
  {
    heading: "legal",
    links: [
      { label: "terms", href: LINKS.terms },
      { label: "privacy", href: LINKS.privacy },
      { label: "aup", href: LINKS.aup },
    ],
  },
  {
    heading: "contact",
    links: [
      { label: "hello@tokhive.ai", href: LINKS.email, literal: true },
      { label: "telegram", href: LINKS.telegram, external: true },
      { label: "discord", href: LINKS.discord, external: true },
    ],
  },
];
