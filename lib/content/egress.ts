// Order of the copy blocks on /egress and /egress/hosts; the text lives in messages/*.json.
export const EGRESS_STEPS = ["catalog", "prepay", "connect", "exit"] as const;
export const EGRESS_LIMITS = ["tcp", "ports", "private", "sla"] as const;
export const EGRESS_FAQ = ["experimental", "anonymous", "udp", "offline", "refund", "access"] as const;

/** What one session block buys, as Hive's egress service defaults define it. */
export const BLOCK_MINUTES = 5;
export const BLOCK_MIB = 16;
export const BLOCK_USD = 0.006;
export const MAX_BLOCKS_PER_LEASE = 24;

/** The three facts that define one block, shown as tiles above the price ladder. */
export const EGRESS_BLOCK_FACTS = ["duration", "traffic", "price"] as const;

/** Block counts a buyer is likely to pick; every exit costs the same. */
export const EGRESS_LADDER = [1, 2, 6, 12, MAX_BLOCKS_PER_LEASE] as const;

/** Plain-language rules for how a session is charged, in the order the page lists them. */
export const EGRESS_BILLING_RULES = ["prepay", "whichever", "stack", "norenew", "limits"] as const;

/** Client paths on the VLESS section, in the order the page lists them. */
export const EGRESS_CLIENTS = ["subscription", "clash", "single"] as const;

/** The subscription a client imports; both values come from the console. */
export const EGRESS_SUBSCRIPTION = `curl -fsSL \\
     -H "Authorization: Bearer $TOKHIVE_API_KEY" \\
     "$TOKHIVE_EGRESS_ENDPOINT/v1/egress/subscription?format=vless" \\
     -o tokhive-vless.txt`;

/** The buyer hero cycles through these states; each one spends more blocks. */
export const LIFECYCLE = ["catalog", "lease", "stream", "done"] as const;

/** Rules that hold for every session, shown in the scrolling tape under the hero. */
export const EGRESS_TAPE = ["tcp", "tls", "ports", "blocks", "concurrency", "identity", "holdback", "probe"] as const;

/** Orders the privacy matrix columns; every row is [payload, hostname, buyer identity, exit IP]. */
export const EGRESS_VISIBILITY_COLUMNS = ["payload", "hostname", "buyer", "exit"] as const;
export const EGRESS_VISIBILITY: { who: "relay" | "host" | "target"; cells: boolean[] }[] = [
  { who: "relay", cells: [false, true, true, true] },
  { who: "host", cells: [false, true, false, true] },
  { who: "target", cells: [true, true, false, false] },
];

/** The request a buyer can copy; both values come from the console. */
export const EGRESS_SAMPLE = `curl --proxy "$TOKHIVE_EGRESS_ENDPOINT" \\
     --proxy-header "Proxy-Authorization: Bearer $TOKHIVE_EGRESS_KEY" \\
     https://example.com/`;

export const HOST_STEPS = ["optin", "limits", "tokens", "earn"] as const;
export const HOST_SAFETY = ["lan", "tls", "tokens", "identity", "switch", "open"] as const;
export const HOST_STATS = ["block", "holdback", "mode"] as const;
export const HOST_REQUIREMENTS = ["line", "region", "isp", "bee"] as const;
export const HOST_RISKS = ["experimental", "availability", "abuse"] as const;
export const HOST_FAQ = ["what", "when", "howmuch", "safe", "stop"] as const;

/** Illustrative statement rows on the host page; the labels are translated. */
export const HOST_STATEMENT: { key: "sessions" | "gross" | "commission" | "credited"; value: string }[] = [
  { key: "sessions", value: "1,240" },
  { key: "gross", value: "$7.44" },
  { key: "commission", value: "−$2.23" },
  { key: "credited", value: "$5.21" },
];

/** How one session block's price is split; Hive's default commission is 30%. */
export const HOST_SPLIT: { key: "paid" | "platform" | "host"; value: string }[] = [
  { key: "paid", value: "$0.006" },
  { key: "platform", value: "−$0.0018" },
  { key: "host", value: "$0.0042" },
];
