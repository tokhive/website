// External destinations are not designed here; fill in real URLs when they exist.
export const LINKS = {
  docs: "https://docs.tokhive.ai",
  blog: "https://blog.tokhive.ai",
  github: "https://github.com/tokhive",
  twitter: "https://x.com/tokhive",
  terms: "#",
  privacy: "#",
  aup: "#",
  email: "mailto:hello@tokhive.ai",
  telegram: "#",
  discord: "#",
  signIn: "#",
  getApiKey: "#",
  shareQuota: "/providers",
  connectPlan: "#", // Provider dashboard destination is pending.
  verifier: "https://github.com/tokhive",
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
