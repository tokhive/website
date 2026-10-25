# Instructions for coding agents (Codex, Claude Code, etc.)

Read `README.md` in this folder first. It is the full spec.

Task: build the TokHive marketing site from the HTML design references in `designs/`. It has five pages: /, /models, /network, /providers and /security, each responsive down to the mobile layouts in `TokHive Mobile.dc.html`.
- Default stack if none exists: Next.js App Router + TypeScript + Tailwind, fonts Sora + JetBrains Mono via next/font.
- Home = option **2a** in `designs/TokHive Website.dc.html` only. Ignore 1a/1b/1c.
- Dark theme only.
- Treat the HTML as visual and behavioral reference. Do not port `support.js` or the `.dc.html` runtime.
- Put tokens (colors, fonts, radii) in the Tailwind config, and keep sample data in `/lib/mock/*.ts` behind typed interfaces.
- Shared components:
  - Nav (desktop + mobile menu)
  - Footer
  - HexField (flow + sparkle modes, honors prefers-reduced-motion)
  - Chip
  - Segmented control
  - Accordion (FAQ)
  - CodeBlock with Copy
  - ChevronSteps
- Items marked PLACEHOLDER (legal compliance copy, audit card, retention values) must stay clearly marked for the team to fill in.
- Verify each page against the reference in a browser at 1280px, 900px and 390px.
