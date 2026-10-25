# Handoff: TokHive Marketing Website (Home · Models · Network · Providers · Security · Mobile)

## Overview
TokHive is a two-sided marketplace. **Providers** resell the unused quota of their AI subscriptions (Claude Max, ChatGPT Pro, Gemini Ultra…). **Builders** consume that quota through a standard OpenAI- and Anthropic-compatible API, at below list price. Every request is relayed from inside a TEE (Intel TDX), which only talks to official vendor endpoints and signs an attestation report.

This package covers three public pages:
1. **Home** (`/`)
2. **Models & Pricing** (`/models`)
3. **Network** (`/network`): live provider and token-usage data
4. **Providers** (`/providers`): earnings calculator, onboarding, controls, compliance, payouts
5. **Security** (`/security`): TEE architecture, data visibility, verification, open source, data retention
6. **Mobile** (390pt): mobile layouts for all of the above

The following are external links and are not designed here: Docs, Blog, GitHub, Twitter/X, Terms of Service, Privacy Policy, Acceptable Use, and Contact (email, Telegram, Discord).

## About the Design Files
The files in `designs/` are **design references built in HTML**. They are prototypes that show the intended look and behavior. They are **not production code to copy**. Recreate them in the target codebase's stack. If no codebase exists yet, use **Next.js (App Router) + TypeScript + Tailwind CSS**, with components split per section.

- Open any `.dc.html` directly in a browser. `support.js` must sit next to them.
- `TokHive Website.dc.html` is an exploration canvas with several directions. **Implement only option `2a`** (the top section, labelled "2a"). Ignore 1a, 1b and 1c.
- `TokHive Models.dc.html` and `TokHive Network.dc.html` are single final pages.
- All numbers are **sample data**. Wire them to real APIs, or keep them as mocks behind a typed interface.

## Fidelity
**High-fidelity.** Match colors, type, spacing and interactions closely. The design is dark-only for now.

---

## Design Tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `bg` | `#0A0B0C` | page background |
| `surface` | `#141517` | cards, code blocks, table header |
| `surface-2` | `#1C1E20` | secondary tiles |
| `surface-3` | `#26292B` | tertiary tiles, empty bar track |
| `hex-idle` | `#2A2D2F` | idle hive cell |
| `volt` | `#C8F031` | brand accent, primary CTA, active chip, savings badge |
| `paper` | `#F2F2EE` | primary text, secondary CTA bg |
| `text-2` | `#B4B6B0` | nav links, secondary text |
| `muted` | `#9A9D97` | captions, labels |
| `muted-2` | `#7E817B` | table headers, code comments, strikethrough prices |
| `link-footer` | `#D6D8D2` | footer links |
| `warn` | `#FF9B6B` | capacity < 25% |
| `line` | `rgba(242,242,238,.12)` | section dividers |
| `line-soft` | `rgba(242,242,238,.06–.08)` | row dividers |
| `chip-border` | `rgba(242,242,238,.18)` | inactive chip border |

On the volt background, text is always `#0A0B0C`. Never put paper-colored text on volt.

### Typography
- **Sora** (Google Fonts, weights 300–700) for UI and headings.
- **JetBrains Mono** (400/500) for all numbers, prices, labels/eyebrows, code and IDs.

| Role | Font | Size / line-height / weight / tracking |
|---|---|---|
| Hero giant word ("Earn." / "Save.") | Sora | 150 / .85 / 700 / −0.06em |
| Page H1 (Models, Network) | Sora | 96 / .9 / 700 / −0.055em |
| Section H2 | Sora | 52 / 1.04 / 600 / −0.035em |
| Card title | Sora | 17–28 / 600 / −0.02em |
| Body large | Sora | 20 / 1.45 |
| Body | Sora | 14–16 / 1.55–1.6 |
| Eyebrow | JetBrains Mono | 12 / 500 / +0.14em / UPPERCASE / volt |
| Big stat | JetBrains Mono | 34–96 / 500 / −0.03 to −0.05em |
| Table / mono body | JetBrains Mono | 13 |
| Table header | JetBrains Mono | 11 / +0.06em / UPPERCASE / muted-2 |

**Outline word** ("Save.", "Below list."): `color:#0A0B0C; -webkit-text-stroke:4px #F2F2EE; paint-order:stroke fill;`. Without `paint-order` the inner glyph contours show through.

### Layout & shape
- Content max-width is **1280px**, centered, with **48px** side padding.
- Section vertical rhythm is **120px** on Home and **96px** on Models.
- Radii: pill buttons and chips `999px`; cards `20–24px`; code blocks and attestation strips `14px`; inputs `8–10px`; badges `6px`.
- There are no shadows except the vendor dropdown: `0 24px 48px rgba(0,0,0,.55)`.
- **Hexagon clip-path** (pointy-top), used for tiles, legend dots and the logo plate: `polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)`.
- **Chevron clip-path** (TEE pipeline steps): `polygon(0 0,calc(100% - 24px) 0,100% 50%,calc(100% - 24px) 100%,0 100%,24px 50%)`.

### Buttons
- **Primary:** volt bg, `#0A0B0C` text, Sora 15/600, padding `15px 24px`, pill.
- **Secondary:** paper bg, `#0A0B0C` text, same size.
- **Ghost (Sign in):** 1px `rgba(242,242,238,.3)` border, paper text, `9px 16px`, `white-space:nowrap`.
- **Chip:** JetBrains Mono 12–13/500, height 36, padding `0 14px`, pill. Inactive is transparent with a chip-border border and text-2 text. Active is volt bg with `#0A0B0C` text and no border.
- **Segmented control** (sort, range): `#141517` track, 3px padding. Active item has paper bg and dark text.
- **Hover:** links and buttons use `opacity:.8`. Dropdown rows use bg `rgba(242,242,238,.06)`.

---

## Logo
Files are in `assets/logo-svg` and `assets/logo-png`. On dark backgrounds use `mark-volt.svg`, or inline it:

```svg
<svg viewBox="0 0 100 100"><polygon points="50,6 88.1,28 88.1,72 50,94 11.9,72 11.9,28" fill="#C8F031"/><rect x="11.9" y="36.5" width="76.2" height="9" fill="#0A0B0C"/><rect x="11.9" y="54.5" width="76.2" height="9" fill="#0A0B0C"/></svg>
```
The stripes must use the **page background color**, so they read as cut-outs.

- **Wordmark:** "Tok" in Sora 300 and "Hive" in Sora 700, 20px, −0.02em, gap 10px after the 28px mark.
- **Footer:** 22px mark and 17px wordmark.

---

## Shared components

### Nav (height 72)
- Logo on the left, linking to `/`.
- Right side, gap 28, 14px, text-2: Models · Network · Providers · Security · Docs ↗ · GitHub · [Sign in ghost].
- The current page link is volt.

### Footer
- 1px top border.
- Grid of `repeat(auto-fit,minmax(160px,1fr))`, gap 32, padding 48.
- Col 1 has the logo and "© 2026 TokHive".
- Columns, each headed by a mono 12 muted header:
  - PRODUCT: Models & Pricing, Network, Docs
  - RESOURCES: Blog, GitHub, Twitter / X
  - LEGAL: Terms of Service, Privacy Policy, Acceptable Use
  - CONTACT: hello@tokhive.ai, Telegram, Discord

### HexField (animated honeycomb background)
- An SVG grid of pointy-top hexagons. Cell radius `s`, width `√3·s`, row step `1.5·s`, and odd rows offset by `w/2`. Each polygon is inset 1.5px.
- Every polygon has `fill=volt fill-opacity=0` and a 1px stroke of the line color.
- **Flow mode** (Home hero): every 120ms, with probability .5, spawn a "bee" at column 0 on a random row.
  - Each tick, every bee lights its cell, advances one column, and drifts ±1 row with probability .2 each way.
  - Lighting a cell sets `fill-opacity:1` instantly, then transitions to 0 over `1.4s ease-out` after a 60ms hold.
  - The metaphor is tokens flowing from providers (left) to builders (right).
- **Sparkle mode** (Network): every 160ms, light 7 random "online" cells. Hold 500–1400ms, fade 1.6s.
- Respect `prefers-reduced-motion` by disabling the animation and rendering a static grid.
- Use canvas or SVG with direct DOM mutation, not React state per frame.

---

## Screen 1: Home (`/`) · design option 2a
Sections, top to bottom:

1. **Hero** (height 720, full-bleed)
   - **Background:** a HexField in flow mode (34 cols × 20 rows, s=24, lit color `rgba(200,240,49,.45)`, stroke `rgba(242,242,238,.07)`).
   - **Overlay gradient:** `linear-gradient(180deg, rgba(10,11,12,.5) 0%, rgba(10,11,12,.2) 30%, rgba(10,11,12,.88) 55%, #0A0B0C 80%)`.
   - The nav sits on top.
   - **Two equal columns**, with a 1px `rgba(242,242,238,.14)` vertical divider between them.
     - **Left (PROVIDERS):**
       - Eyebrow "PROVIDERS".
       - "Earn." at 150px in volt.
       - Body: "Monetize the idle tokens in your Claude, ChatGPT or Gemini subscription."
       - Pinned to the bottom: primary button "Share your quota →" and mono caption "$2.4M paid out".
     - **Right (BUILDERS):**
       - Eyebrow "BUILDERS" in paper.
       - "Save." as an outline word.
       - Body: "Access official AI for less: Claude, GPT and Gemini from the vendors, TEE-verified."
       - Pinned to the bottom: secondary button "Get API key →" and caption "avg. −58% vs list".
   - **Centered logo plate** on the seam at top 44%: a 112×128 hexagon in `#0A0B0C` with a 70px mark inside.
   - Column padding: `96px 56px 64px 48px` (left) and `96px 48px 64px 56px` (right).
2. **Price tape**
   - One row with top and bottom borders, `overflow:hidden`, nowrap.
   - Items are mono 13 with padding `16px 28px` and a right divider: `model-id` (text-2), price `$1.20/M`, saving `−60%` (volt).
   - A future enhancement is a slow marquee scroll.
3. **Verified origin**
   - Grid of `360px 1fr`, gap 80, padding `120px 48px`.
   - **Left:** a hexagon seal (320×368 SVG). The outer hex has a volt 1.5px stroke. The inner hex has a dashed `rgba(200,240,49,.4)` stroke and a `rgba(200,240,49,.06)` fill. Text inside: "TEE ATTESTED" eyebrow, "100%" at 64/700, "official endpoints".
   - **Right:** H2 "No resellers of resellers. No swapped models. Proof attached.", then 3 columns of steps. Each step has a 1px volt top border, a mono number, a 17/600 title and a 14 muted description:
     - 01 Enclave-locked relay: "Provider credentials live inside an Intel TDX enclave. Nobody can read them, including us."
     - 02 Official endpoints only: "The enclave pins TLS to vendor certificates, so it cannot route to a proxy or a cheaper model."
     - 03 Signed receipt per call: "Every response carries an attestation report you can check with our open-source verifier."
4. **TEE request pipeline** (pulled up with −40px margin-top)
   - Header row: mono label "HOW A REQUEST TRAVELS" and "every hop is sealed and signed".
   - 4 chevron tiles, gap 10, padding `28px 28px 32px`:
     1. Your request · `api.tokhive.ai`. Bg `#141517`.
     2. TokHive router · picks a provider. Bg `#1C1E20`.
     3. TEE enclave · Intel TDX · sealed. Bg `#26292B`, with a volt step number.
     4. Official API · anthropic · openai · google. Volt bg, dark text.
   - **Attestation strip:** a surface card with 4 key/value columns (ENCLAVE Intel TDX · v1.5, UPSTREAM api.anthropic.com, MODEL claude-sonnet-4-5, MEASUREMENT 0x9f3a…c71e) and a volt badge "✓ Signature valid".
5. **Provider earnings**
   - A surface card, radius 24, padding 56, grid `1.2fr 1fr`.
   - **Left:** eyebrow "PAID TO PROVIDERS · ALL TIME", the stat "$2,418,906" (mono 96), and the body "Weekly payouts in USDC or bank transfer. The average active provider earns $186 a month from quota they weren't using."
   - **Right:** a 12-bar monthly chart (height 180, gap 6).
     - Each bar is clipped with a peaked top: `polygon(50% 0,100% 6px,100% 100%,0 100%,0 6px)`.
     - Past months use `rgba(242,242,238,.16)`; the current month is volt.
     - Axis labels: "Nov ’25 · monthly payouts · Oct ’26".
6. **Models: "The hive menu."**
   - H2 on the left, vendor chips on the right (All / Anthropic / OpenAI / Google), filtering live.
   - **Honeycomb tiles:** 236×272 hexagons, rows of 4, gap 8. Every second row is offset 244px right and pulled up −60px.
   - Tile fills cycle through volt (dark text), `#1C1E20` and `#26292B` (paper text).
   - Tile content: vendor (mono 11), model name (19/600), price "$1.20 ~~$3.00~~" with "per 1M input" underneath, and saving "−60%".
7. **Agent tools: "Works in your agents."**
   - Right-hand caption: "Anthropic + OpenAI compatible".
   - **Tool tabs:** 4 large buttons in a 4-column grid (Claude Code, Codex, OpenCode, Pi), Sora 18/600, padding 22, radius 14. Active is volt. Inactive is transparent with a `rgba(242,242,238,.15)` border.
   - **Code block:** `#141517`, radius 14, mono 15/1.8, padding `28px 32px`.
     - Comment lines are `#7E817B`.
     - Lines containing "tokhive"/"TOKHIVE" are volt.
     - Everything else is `#E6E7E2`.
   - Snippets: copy exactly from `CODE` in the source file.
   - Add a working **Copy** button.
8. **FAQ**
   - Grid of `360px 1fr`, gap 80.
   - **Left:** eyebrow "FAQ", H2 "Questions, answered.", and a contact line linking Discord, Telegram and email.
   - **Right:** accordion, single-open, with the first item open by default. Each question is Sora 19/600, padding 24px 0, with 1px dividers. The toggle is a 32×36 hexagon: `#1C1E20` with "+", or volt with "−" when open. Answers are 16/1.65 text-2. Copy the questions and answers from the `faq` array in the source.
9. **Footer**

## Screen 2: Models & Pricing (`/models`)
1. **Header**
   - Eyebrow "MODELS & PRICING".
   - H1 on two lines: "Official models." / "Below list." (the second line is an outline word).
   - Right-hand stats: −58% avg. vs list (volt), {count} models live, 0 monthly fee.
2. **Sticky filter bar** (`position:sticky; top:0`, page bg, 1px top border, two rows with gap 12)
   - **Row 1:**
     - Search input: pill, `#141517`, height 40, flex 1, max 480, with a "/" hint glyph. It matches model name and id.
     - Sort segmented control on the right: Popular / Savings / Price / Capacity. It is nowrap.
   - **Row 2:**
     - **Vendor multi-select dropdown**, built to scale to many vendors.
       - The button reads "All vendors ▾", or "Vendor · N" when some are selected.
       - The popover is 300px wide, `#141517`, radius 14. It contains a filter input, then a scrollable list (max-height 300) of rows, then a footer showing "N of M selected" and a volt "Clear" button.
       - Each row is a checkbox (16px; volt fill and ✓ when on) + vendor color hex dot + name + model count.
       - Close the popover on outside click and on Esc.
       - Each selected vendor appears as a removable chip next to the button: `rgba(200,240,49,.12)` bg, volt text and border, "×".
     - A 1px divider.
     - Capability chips (multi, AND logic): Coding, Reasoning, Vision, Long context.
3. **Table** (columns `2.2fr 1fr .8fr 1.8fr 1fr .9fr 32px`, row padding `18px 20px`)
   - **Columns:**
     - MODEL: name 600 plus id (mono 12, muted-2).
     - VENDOR: hex dot + name.
     - CONTEXT.
     - PRICE in / out: TokHive price on top, official price struck through below in mono 12 muted-2.
     - CAPACITY: a 64px bar plus %. The bar is volt, or warn below 25%.
     - SAVE: volt pill.
     - Expander: "+" / "−".
   - **Row expand** (one row open at a time; the open row gets a `#141517` bg). Three columns:
     - Price per 1M: input, output and cache read, official struck vs TokHive.
     - Live · 1h: providers, p50 latency, throughput, upstream host.
     - Quick-start curl snippet using the model id, with Copy.
   - **Empty state:** "No models match. Clear filters".
   - **Footnote:** "USD per 1M tokens · prices float with provider supply, last repriced 14:00 UTC" and "Capacity = share of pooled quota still free this hour".
4. **Cost calculator** (2 cards, `repeat(auto-fit,minmax(min(100%,520px),1fr))`)
   - **Left card** (surface):
     - Model `<select>`, default Claude Sonnet 4.5.
     - Range "INPUT TOKENS / MONTH", 1–2000 M, default 300.
     - Range "OUTPUT TOKENS / MONTH", 1–500 M, default 60.
     - Labels format ≥1000M as "1.2B".
   - **Right card** (volt bg, dark text):
     - "YOU SAVE / MONTH" with the amount in mono 80.
     - "{pct}% less than paying the vendor directly".
     - Two comparison bars: official at 100%, TokHive at its % width.
     - A dark CTA "Get API key →".
   - **Math:** `official = in·oi + out·oo` and `ours = in·ti + out·to`.
5. **How pricing works:** 4 columns with volt top rules:
   - 01 Pay per token: "No subscription and no minimum. Top up with card or USDC and draw down per 1M tokens."
   - 02 Prices float with supply: "Rates reprice hourly from pooled provider capacity, and they never go above the vendor list price."
   - 03 Same tokens, same models: "Requests hit the official endpoint from inside a TEE. Model IDs and responses match the vendor API."
   - 04 Cache reads included: "Prompt caching is passed through at the discounted rate, so long agent sessions get cheaper."
6. **Footer**

**Model data shape:**

```ts
type Model = {
  id: string; name: string; vendor: string; context: string;
  official: { in: number; out: number; cacheRead: number };   // USD / 1M
  tokhive:  { in: number; out: number; cacheRead: number };
  tags: ('Coding'|'Reasoning'|'Vision'|'Long context')[];
  capacityPct: number; popularity: number; providers: number;
  p50Ms: number; tokPerSec: number; upstreamHost: string;
};
```
Savings % is `round((1 - tokhive.in / official.in) * 100)`.

**Price formatting:**
- ≥10 → `$15`
- ≥0.1 → `$1.20`
- otherwise up to 3 decimals, trailing zeros trimmed

The sample list of 18 models is in `M` in the source.

**Vendor colors** (hex dots):
- Anthropic `#C8F031`
- OpenAI `#F2F2EE`
- Google `#8A8D92`
- xAI `#5E6163`
- DeepSeek `#9CCB00`
- Moonshot `#D6D8D2`
- Zhipu `#6E8A1F`
- Alibaba `#B4B6B0`

## Screen 3: Network (`/network`)
1. **Header**
   - Eyebrow "LIVE NETWORK" with a pulsing 8px volt dot (opacity 1 → .25 → 1, 1.6s loop).
   - H1 "The hive, live."
   - Right-hand caption: "updated HH:MM:SS · all times UTC".
2. **KPI row** (`repeat(auto-fit,minmax(200px,1fr))`, top and bottom borders). Each KPI has a label (mono 12 muted), a value (mono 34) and a delta (mono 12; volt when positive). The five KPIs:
   - Providers online
   - Tokens · 24h
   - Requests / sec
   - Paid to providers
   - Routing overhead (p50)
3. **Hive and live feed** (`repeat(auto-fit,minmax(min(100%,480px),1fr))`)
   - **Providers online card:**
     - Height 400. A HexField in sparkle mode, 30×13, s=18.
     - Cells are 82% "online" (filled `#2A2D2F`) and the rest offline (stroke only).
     - Legend: serving (volt) · idle · offline.
     - Caption: "Each cell is a provider. It lights up while serving a request."
     - In production, map cells to real providers and light them on request events (WebSocket/SSE).
   - **Live requests card:**
     - "{rps} req/s" in the header.
     - 9 rows with columns MODEL / REGION / TOKENS / MS. MS is volt. All cells are nowrap.
     - Rows fade older entries (opacity 1 → .52). A new row arrives every ~1.4s.
4. **Token usage**
   - A surface card with "TOKEN USAGE", the total (mono 48) and "tokens · last 24 hours".
   - Controls: vendor chips and a range segmented control (24h / 7d / 30d).
   - **Chart:** a stacked bar chart, height 240, gap 4. The bar count matches the range (24 hourly, 7 or 30 daily). Each bar stacks:
     - Anthropic (volt) at the bottom
     - OpenAI (paper)
     - Google (`#5E6163`)
     - 2px gaps between segments, radius 2
   - The vendor filter hides segments, and the y-axis rescales.
   - Below the chart: axis labels and a legend.
5. **Two cards** (`repeat(auto-fit,minmax(420px,1fr))`)
   - **Model share & capacity:** each row has the model, a share bar (vendor color, scaled to the max share), the share %, and capacity "% free" (warn below 25%).
   - **Providers by plan:** each plan has its name and count, plus a row of 30 small hexagons. Filled hexes are volt, the rest `#26292B`. 1 cell ≈ 40 providers.
     - Plans: Claude Max 20x 1,128 · ChatGPT Pro 864 · Claude Max 5x 702 · Gemini AI Ultra 341 · ChatGPT Plus 236 · Claude Pro 141.
6. **TEE transparency**
   - Title "Recent attestations".
   - Header caption: "99.998% verified · 30d" and "Open-source verifier ↗".
   - **Table:** columns REQUEST (linked id) / MODEL / ENCLAVE / UPSTREAM / MEASUREMENT / SIGNED / STATUS (volt "✓ valid" badge). It scrolls horizontally below 900px.
7. **Footer**

---

## Screen 4: Providers (`/providers`)
1. **Hero** (two columns, auto-fit, faint sparkle HexField behind a left-to-right dark gradient)
   - **Left:** eyebrow "FOR PROVIDERS", H1 84px "Your plan resets." / "Your earnings don't." (second line volt), body copy, primary "Connect a plan →" and ghost "How it works" (anchors to #how).
   - **Right: earnings calculator card** (surface, radius 24).
     - Plan picker: 3×2 grid of plan buttons (name + $/mo). Active is volt.
     - Range "How much you use yourself" 0–95%, default 45.
     - Range "Extra reserve, never shared" 0–40%, default 10. Clamp reserve to 100 − use.
     - Split bar: you (#5E6163) · reserve (#26292B) · shared (volt), with a legend.
     - Volt footer: "EST. MONTHLY EARNINGS" (mono 60), plus yearly and "covers your plan ×N" or "covers N% of your plan".
     - **Math (sample):** `monthly = planRate × shared% × 0.85`. Plan rates live in `PLANS` in the source. Replace with the real model.
2. **Three steps** (`#how`): 3 chevron tiles (same clip-path as the TEE pipeline). Fills are #141517, #1C1E20 and volt.
3. **You stay in control:** grid `360px 1fr`. Four cards with a hexagon number badge: reserve, auto-pause, daily caps/schedules, one-click revoke.
4. **Account safety & compliance:** a dashed-volt bordered panel.
   - The "Is sharing my plan allowed?" copy is a **PLACEHOLDER: legal must supply it**.
   - The right column lists four ✓ safety points.
5. **Payouts:** three facts (Weekly · $20 min · USDC/Bank) and a sample weekly statement table.
6. **Provider FAQ:** same accordion as Home.
7. **Volt CTA band**, then the footer.

## Screen 5: Security (`/security`)
1. **Hero:** H1 "Trust the hardware," / "not us." (outline word), body copy, and three stacked stats on the right.
2. **Architecture:** a flex-wrap row: Builder → Router (untrusted) → TEE enclave (dashed volt box with Credential vault / Pinned relay / Signer) → Vendor API (volt).
   - The enclave wraps to its own line on narrow widths.
3. **Who sees what:** a matrix of 5 parties × 4 data types (prompts, provider creds, usage meters, builder identity). Cells are hexagon ✓ (volt) or — (#1C1E20).
4. **Verify it yourself:** 4 numbered steps plus a terminal block showing `npx @tokhive/verify <req_id>` output.
5. **Open source and audited:** three cards (enclave repo, verifier CLI, audit). The audit card is a **PLACEHOLDER**.
6. **Data handling:** a retention table. **The retention values are assumptions; confirm them.**
7. **Responsible disclosure** card, then the footer.

## Screen 6: Mobile (`TokHive Mobile.dc.html`, 390pt artboards)
The canvas holds six artboards:
- **m1 Home**
- **m2 Models**
- **m3 Models filter sheet**
- **m4 Network**
- **m5 Providers**
- **m6 Security**

General mobile rules:
- Side padding is 20px. Cards sit inside 12px gutters.
- H1 is 48–56px and H2 is 32–34px.
- The nav is the logo plus a 44px menu button that opens a full-width dropdown listing every page, with Sign in and Get API key buttons.
- Every tap target is at least 44px.

Per-screen changes:
- **Home:**
  - "Earn." and "Save." stack vertically, with the logo plate as a divider.
  - The price tape scrolls horizontally.
  - The TEE pipeline becomes vertical chevrons.
  - The honeycomb runs 2-1-2.
  - The agent tabs form a 2×2 grid.
  - Two CTA cards sit before the footer.
- **Models:**
  - The table becomes a card list, and tapping a card expands it.
  - A sticky bar holds search plus a "Filters" button with a count badge.
  - The filters open a **bottom sheet** (m3) with sort, capabilities, and a searchable vendor multi-select. Its bottom button reads "Show N models".
- **Network:** KPIs in a 2×2 grid, then single-column cards, and attestations as cards.
- **Providers:** the calculator plan grid is 2 columns, and the steps are vertical chevrons.
- **Security:** the architecture is a vertical flow (↓), the matrix uses compact 46px columns, and the terminal scrolls horizontally.

## Responsive breakpoints
- **≥1024:** desktop as designed.
- **768–1023:** grids use the `auto-fit` values already in the source, and the hero columns stack.
- **<768:** follow the Mobile artboards.

## State summary
- **Home:**
  - `vendorFilter` for the honeycomb.
  - `activeTool` for the agent tabs.
- **Models:**
  - `q`, `vendors[]`, `vendorPopoverOpen`, `vendorQuery`, `tags[]`, `sort`, `openRowId`.
  - Calculator: `modelId`, `inM`, `outM`.
  - Sync the filters to URL query params.
- **Providers:** `plan`, `usePct`, `reservePct`, `openFaq`.
- **Network:**
  - `range`, `vendor`.
  - Live data from a stream: KPIs, feed, hive events and attestations. Poll or use SSE.

## Suggested data endpoints (to be defined by backend)
- `GET /v1/models`: the model list with pricing and capacity.
- `GET /v1/network/summary`: KPIs.
- `GET /v1/network/usage?range=24h&vendor=`: usage series.
- `GET /v1/network/attestations?limit=6`: recent attestations.
- `SSE /v1/network/stream`: request events for the feed and hive.

## Responsive
- **Below 900px:**
  - Hero columns stack.
  - Giant words scale to roughly 96px.
  - The honeycomb becomes 2 per row.
  - Tables scroll horizontally.
  - Card grids already use `auto-fit`.
- **Nav:** collapse to a menu button below 768px.

## Files
- `designs/TokHive Website.dc.html`: Home. Implement **section 2a** only.
- `designs/TokHive Models.dc.html`: Models & Pricing.
- `designs/TokHive Network.dc.html`: Network.
- `designs/TokHive Providers.dc.html`: Providers.
- `designs/TokHive Security.dc.html`: Security.
- `designs/TokHive Mobile.dc.html`: all mobile layouts (m1–m6).
- `designs/support.js`: runtime needed only to open the references in a browser. Do not port it.
- `assets/logo-svg/`, `assets/logo-png/`: logo marks, lockups, app icons and avatar. On dark pages use `mark-volt`, `lockup-dark` and `app-icon-dark`.
