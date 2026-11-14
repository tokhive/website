// Sample security content. Platform terminology follows tokhive/tee's AWS SEV-SNP implementation.
// Retention and audit require confirmation; terminal output is illustrative.
// Copy for these lists lives in messages/*.json under Security; the keys fix their order.
export const HEROSTATS = [
  { v: "0", key: "plaintext", c: "#C8F031" },
  { v: "100%", key: "attested", c: "#F2F2EE" },
  { v: "MIT", key: "license", c: "#F2F2EE" },
] as const;

export const ENCLAVE = ["vault", "relay", "signer"] as const;

export const VERIFY = ["requestId", "run", "measurement", "upstream"] as const;

export const VERIFY_COMMAND = [
  "./bin/tokhive-verify verify \\",
  '  --request-id "$TOKHIVE_REQUEST_ID" \\',
  '  --expected-app "$TOKHIVE_EXPECTED_APP" \\',
  "  --expected-host api.anthropic.com \\",
  "  --response response.raw",
].join("\n");

/**
 * The production key that signs the TEE release catalog (first used for 0.2.1); staging
 * releases use a separate key. This page is the independent channel
 * users compare the key against; it must match `release-signing.pub` in tokhive/tee releases.
 */
export const RELEASE_SIGNING = {
  fingerprint: "SHA256:A7HhHJgJmWp4xbtwhD/4IL5Ua6XUWG9FahuP0KNPoNk",
  allowedSigners:
    'tokhive-release namespaces="tokhive-tee-release" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDY37j7Z7Akukw/a5J66WQbTEEfMXJGoEjnt7vBaDFsg',
  details: [
    ["format", "SSHSIG, Ed25519"],
    ["namespace", "tokhive-tee-release"],
    ["identity", "tokhive-release"],
  ] as const,
};

export const SAMPLE_MEASUREMENT = "snp-app:9f3a…c71e";

/** Example verifier output; `measurement` is Hive's pinned TEE image when known. */
export const verifyTerminal = (measurement: string): { t: string; c: string }[] => [
  ...VERIFY_COMMAND.split("\n").map((line, i) => ({ t: i === 0 ? `$ ${line}` : line, c: "#F2F2EE" })),
  { t: " ", c: "#F2F2EE" },
  { t: "  quote        AMD SEV-SNP", c: "#B4B6B0" },
  { t: "  roots        AMD + AWS NitroTPM       ✓", c: "#B4B6B0" },
  { t: `  measurement  ${measurement}`, c: "#B4B6B0" },
  { t: "  application  matches expected bundle  ✓", c: "#B4B6B0" },
  { t: "  upstream     api.anthropic.com", c: "#B4B6B0" },
  { t: "  policy_hash  c8d1…3f02", c: "#B4B6B0" },
  { t: "  stream_hash  7b2e…a810", c: "#B4B6B0" },
  { t: " ", c: "#F2F2EE" },
  { t: "✓ Verified: served by the official vendor", c: "#C8F031" },
];

/** The audit card is a placeholder until a third-party review is published. */
export const OSS = [
  { key: "tee", href: "tee" },
  { key: "verifier", href: "verifier" },
  { key: "audit", href: null },
] as const;

export const DATA = [
  { key: "prompts", state: "processed", c: "#C8F031" },
  { key: "credentials", state: "sealed", c: "#C8F031" },
  { key: "usage", state: "review", c: "#F2F2EE" },
  { key: "attestations", state: "review", c: "#F2F2EE" },
  { key: "account", state: "review", c: "#F2F2EE" },
] as const;

export const VISIBILITY = [
  { who: "builder", cells: [true, false, true, true] },
  { who: "operators", cells: [true, false, true, true] },
  { who: "provider", cells: [false, true, true, false] },
  { who: "router", cells: [true, false, true, true] },
  { who: "enclave", cells: [true, true, true, false] },
] as const;
