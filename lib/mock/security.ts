// Sample security content. Platform terminology follows tokhive/tee's AWS SEV-SNP implementation.
// Retention and audit require confirmation; terminal output is illustrative.
export const HEROSTATS: { v: string; l: string; c: string }[] = [
  {
    v: "0",
    l: "plaintext credentials outside the enclave",
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
    d: "Signs model, upstream, token counts and the response hash.",
  },
];

export const VERIFY: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "Grab the request ID",
    d: "Every response includes an x-tokhive-request-id header and an attestation URL.",
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
    d: "The signed upstream host and certificate fingerprint must belong to the vendor.",
  },
];

export const TERM: { t: string; c: string }[] = [
  {
    t: "$ npx @tokhive/verify req_01J9XQ7K2",
    c: "#F2F2EE",
  },
  {
    t: " ",
    c: "#F2F2EE",
  },
  {
    t: "  quote        AMD SEV-SNP",
    c: "#B4B6B0",
  },
  {
    t: "  roots        AMD + AWS NitroTPM       ✓",
    c: "#B4B6B0",
  },
  {
    t: "  measurement  snp-app:9f3a…c71e",
    c: "#B4B6B0",
  },
  {
    t: "  application  matches expected bundle  ✓",
    c: "#B4B6B0",
  },
  {
    t: "  upstream     api.anthropic.com",
    c: "#B4B6B0",
  },
  {
    t: "  tls_cert     sha256:4b1e…09aa          ✓",
    c: "#B4B6B0",
  },
  {
    t: "  model        claude-sonnet-4-5",
    c: "#B4B6B0",
  },
  {
    t: "  tokens       12,804 in · 1,377 out",
    c: "#B4B6B0",
  },
  {
    t: " ",
    c: "#F2F2EE",
  },
  {
    t: "✓ Verified: served by the official vendor",
    c: "#C8F031",
  },
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
    m: "tokhive/verify ↗",
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
    v: "not stored",
    c: "#C8F031",
    d: "They are processed in enclave memory only and never written to disk or to logs.",
  },
  {
    k: "Provider credentials",
    v: "sealed",
    c: "#C8F031",
    d: "Encrypted to the enclave key and destroyed when you disconnect.",
  },
  {
    k: "Usage metadata",
    v: "13 months",
    c: "#F2F2EE",
    d: "Model, token counts and timestamps, kept for billing, payouts and dispute resolution.",
  },
  {
    k: "Attestation reports",
    v: "90 days",
    c: "#F2F2EE",
    d: "Signed receipts stay retrievable by request ID for independent verification.",
  },
  {
    k: "Account data",
    v: "until deletion",
    c: "#F2F2EE",
    d: "Email, KYC status and payout details. Delete from settings at any time.",
  },
];

export const VISIBILITY: { who: string; cells: boolean[] }[] = [
  {
    who: "Builder",
    cells: [true, false, true, true],
  },
  {
    who: "TokHive operators",
    cells: [false, false, true, true],
  },
  {
    who: "Provider",
    cells: [false, true, true, false],
  },
  {
    who: "Router (untrusted)",
    cells: [false, false, true, false],
  },
  {
    who: "TEE enclave",
    cells: [true, true, true, false],
  },
];
