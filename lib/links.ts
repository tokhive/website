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

export type NavLink = { label: string; href: string; external?: boolean };

export const FOOTER_COLUMNS: { heading: string; links: NavLink[] }[] = [
  {
    heading: "PRODUCT",
    links: [
      { label: "Models & Pricing", href: "/models" },
      { label: "Network", href: "/network" },
      { label: "Providers", href: "/providers" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    heading: "RESOURCES",
    links: [
      { label: "Docs", href: LINKS.docs, external: true },
      { label: "Blog", href: LINKS.blog, external: true },
      { label: "GitHub", href: LINKS.github, external: true },
      { label: "Twitter / X", href: LINKS.twitter, external: true },
    ],
  },
  {
    heading: "LEGAL",
    links: [
      { label: "Terms of Service", href: LINKS.terms },
      { label: "Privacy Policy", href: LINKS.privacy },
      { label: "Acceptable Use", href: LINKS.aup },
    ],
  },
  {
    heading: "CONTACT",
    links: [
      { label: "hello@tokhive.ai", href: LINKS.email },
      { label: "Telegram", href: LINKS.telegram, external: true },
      { label: "Discord", href: LINKS.discord, external: true },
    ],
  },
];
