# Instructions for coding agents (Codex, Claude Code, etc.)

Read `README.md` in this folder first. It is the full spec.

Task: build the TokHive marketing site (Home, /models, /network) from the HTML design references in `designs/`.
- Default stack if none exists: Next.js App Router + TypeScript + Tailwind, fonts Sora + JetBrains Mono via next/font.
- Home = option **2a** in `designs/TokHive Website.dc.html` only.
- Treat the HTML as visual and behavioral reference. Do not port `support.js` or the `.dc.html` runtime.
- Put tokens (colors, fonts, radii) in Tailwind config, and keep sample data in `/lib/mock/*.ts` behind typed interfaces.
- Build HexField as one reusable client component (flow + sparkle modes) that honors prefers-reduced-motion.
- Verify each page against the reference in a browser at 1280px and 900px.
