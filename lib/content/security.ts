// Sample security content. Platform terminology follows tokhive/tee's AWS SEV-SNP implementation.
// Retention and audit require confirmation; terminal output is illustrative.
export const HEROSTATS: { v: string; l: string; c: string }[] = [
  {
    v: "0",
    l: "plaintext upstream credentials uploaded",
    c: "#C8F031",
  },
  {
    v: "100%",
    l: "of responses carry an attestation",
    c: "#F2F2EE",
  },
  {
    v: "MIT",
    l: "enclave image and verifier, open source",
    c: "#F2F2EE",
  },
];

export const ENCLAVE: { t: string; d: string }[] = [
  {
    t: "Credential vault",
    d: "Provider sessions sealed to the enclave key. Not exportable.",
  },
  {
    t: "Pinned relay",
    d: "TLS only to an allow-list of vendor certificates.",
  },
  {
    t: "Signer",
    d: "Signs the upstream host, response hash, execution times and policy hash.",
  },
];

export const VERIFY: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "Grab the request ID",
    d: "Use the X-Request-Id header returned by your TokHive API call.",
  },
  {
    n: "02",
    t: "Run the verifier",
    d: "The verifier checks the AMD SEV-SNP report, AWS NitroTPM evidence and the signing-key binding.",
  },
  {
    n: "03",
    t: "Compare the measurement",
    d: "The snp-app: identity must match the SHA-256 digest of the expected application bundle.",
  },
  {
    n: "04",
    t: "Check the upstream",
    d: "The signed upstream host must match the expected vendor endpoint.",
  },
];

export const VERIFY_COMMAND = [
  "./bin/tokhive-verify verify \\",
  '  --request-id "$TOKHIVE_REQUEST_ID" \\',
  '  --expected-app "$TOKHIVE_EXPECTED_APP" \\',
  "  --expected-host api.anthropic.com \\",
  "  --response response.raw",
].join("\n");

/**
 * The long-term key that signs the TEE release catalog. This page is the independent channel
 * users compare the key against; it must match `release-signing.pub` in tokhive/tee releases.
 */
export const RELEASE_SIGNING = {
  fingerprint: "SHA256:m026+ZqXRdHDXGxMRBj7qBFjqiqYLeMiBqBlz+SLHPQ",
  allowedSigners:
    'tokhive-release namespaces="tokhive-tee-release" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIL1MU/PMAnvHhQg87AUU4kMHbqJ+nKT8IOYylAS5QGBF',
  details: [
    ["Format", "SSHSIG, Ed25519"],
    ["Namespace", "tokhive-tee-release"],
    ["Identity", "tokhive-release"],
  ] as [string, string][],
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

export const OSS: { k: string; t: string; d: string; m: string; bg: string; bd: string; ac: string }[] = [
  {
    k: "GITHUB",
    t: "Enclave image",
    d: "Full source of the relay that runs in the TEE, with reproducible builds and published measurements per release.",
    m: "tokhive/tee ↗",
    bg: "#141517",
    bd: "transparent",
    ac: "#C8F031",
  },
  {
    k: "GITHUB",
    t: "Verifier CLI & SDK",
    d: "Verify attestations from the terminal, or in CI with the TypeScript and Python SDKs.",
    m: "tokhive/verifier ↗",
    bg: "#141517",
    bd: "transparent",
    ac: "#C8F031",
  },
  {
    k: "PLACEHOLDER",
    t: "Independent audit",
    d: "Third-party security review of the enclave and key management. Firm, scope and report link to be added once the audit is complete.",
    m: "[auditor] · [date]",
    bg: "transparent",
    bd: "rgba(200,240,49,.4)",
    ac: "#C8F031",
  },
];

export const DATA: { k: string; v: string; c: string; d: string }[] = [
  {
    k: "Prompts & completions",
    v: "processed",
    c: "#C8F031",
    d: "Hive and the upstream service process request content. Failure diagnostics can retain request and response content.",
  },
  {
    k: "Provider credentials",
    v: "sealed",
    c: "#C8F031",
    d: "Bee encrypts upstream access credentials with the TEE public key before upload. Only the TEE can decrypt the uploaded envelope.",
  },
  {
    k: "Usage metadata",
    v: "under review",
    c: "#F2F2EE",
    d: "Model, token counts and timestamps, kept for billing, settlement and dispute resolution.",
  },
  {
    k: "Attestation reports",
    v: "under review",
    c: "#F2F2EE",
    d: "Signed receipts stay retrievable by request ID for independent verification.",
  },
  {
    k: "Account data",
    v: "under review",
    c: "#F2F2EE",
    d: "Account identifiers, access settings and transaction references. Deletion requests are subject to applicable recordkeeping obligations.",
  },
];

export const VISIBILITY: { who: string; cells: boolean[] }[] = [
  {
    who: "Builder",
    cells: [true, false, true, true],
  },
  {
    who: "Authorized operators",
    cells: [true, false, true, true],
  },
  {
    who: "Provider",
    cells: [false, true, true, false],
  },
  {
    who: "Hive router",
    cells: [true, false, true, true],
  },
  {
    who: "TEE enclave",
    cells: [true, true, true, false],
  },
];
