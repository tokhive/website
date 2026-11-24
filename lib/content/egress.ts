// Order of the copy blocks on /egress and /egress/hosts; the text lives in messages/*.json.
export const EGRESS_STEPS = ["catalog", "prepay", "connect", "exit"] as const;
export const EGRESS_PRICING = ["block", "units", "payment", "concurrency", "refund", "ports"] as const;
export const EGRESS_LIMITS = ["tcp", "ports", "private", "sla"] as const;
export const EGRESS_FAQ = ["experimental", "anonymous", "udp", "offline", "refund", "access"] as const;

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

/** Illustrative rent rows on the host page; the labels are translated. */
export const HOST_STATEMENT: { key: "sessions" | "commission" | "credited"; value: string }[] = [
  { key: "sessions", value: "1,240" },
  { key: "commission", value: "−20%" },
  { key: "credited", value: "$5.95" },
];
