# TokHive website

Marketing site: Home (`/`), Models & Pricing (`/models`), Network (`/network`),
Providers (`/providers`), and Security (`/security`). All five pages include mobile layouts.
Built from the design handoff in `design_handoff_tokhive_website/` (spec: its `README.md`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Deployment

The site exports static HTML to `out/`. Every push to `main` runs lint and a
production build, then deploys to GitHub Pages through `.github/workflows/deploy.yml`.
The repository's Pages publishing source must be **GitHub Actions** and its custom
domain must be **tokhive.ai**. The custom domain is configured in GitHub settings,
not through a CNAME file (the workflow publishes an Actions artifact).

Configure the following DNS records at the domain provider:

| Type | Name | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | tokhive.github.io |

After DNS propagates and GitHub issues a certificate, enable **Enforce HTTPS**
in the repository's Pages settings.

## Layout

- `app/globals.css`: design tokens (`@theme`, Tailwind v4's config) and shared utilities: `clip-hex`, `clip-chevron`, `outline-word`, `eyebrow`, `chip`, buttons.
- `components/HexField.tsx`: animated honeycomb (`flow` on Home, `sparkle` on Network). Mutates the SVG DOM directly and goes static under `prefers-reduced-motion`.
- `components/{home,models,network,providers}/`: page sections, mobile model cards and filters, and the provider earnings calculator.
- `components/Accordion.tsx`: single-open FAQs shared by Home and Providers.
- `lib/mock/*.ts`: sample data behind typed interfaces. Swap for the backend endpoints listed in the handoff spec (`/v1/models`, `/v1/network/*`, SSE stream).
- `lib/links.ts`: external links (Docs, Blog, GitHub, legal, contact). Most are placeholders.

The Models filters (`q`, `vendor`, `tag`, `sort`) are mirrored to the URL query string.
On mobile, filters open in a bottom sheet; pricing and network attestations use cards.
Provider earnings use sample plan rates. Legal copy, the independent audit and data
retention assumptions remain marked as placeholders in the new pages.

TEE platform copy follows the implementation in `tokhive/tee`: AWS EC2 confidential
VMs using AMD SEV-SNP, combined AMD/NitroTPM attestation and RA-TLS/mTLS. This
supersedes the Intel TDX terminology in the original design references. Attestation
examples use the `snp-app:<sha256>` application identity and remain sample data.
