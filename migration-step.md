# HardCode.id Migration Plan

Status: **Phase 1 (scaffold) COMPLETE. Homepage core-sections migration COMPLETE. Article phase (`/artikel` list + `/artikel/:slug` detail) COMPLETE. Learning phase (`/belajar`) COMPLETE. Project phase (`/proyek`) COMPLETE. Consultation phase (`/konsultasi`) COMPLETE. Chatbot widget + quote estimator COMPLETE. Phase 4 (hardening & Lighthouse audit) COMPLETE. Phase 5 (Cloudflare Pages deployment & live cutover) COMPLETE (2026-08-27/2026-08-28)** — live at `https://hardcode.id/`.

## Current state

Source repo: `D:\AISTUDIO\SOURCE\HardCode.id` (read-only — never write here)
Target output: `D:\AISTUDIO\OUTPUT\HardCode.id`
Current live site: `https://hardcode.id/`
Current hosting: Cloudflare Pages
Target stack: React + Vite + TypeScript, production-ready, deployed on Cloudflare Pages

## Scope and non-goals

### In scope

- Rebuilding the existing single-file SOURCE SPA as a componentized, typed,
  routed React + Vite app with the same visible feature set: home/marketing
  page, articles (list + detail), consultation/booking flow, learning
  roadmap, project detail pages, chatbot ("Tanya") widget, quote estimator,
  ID/EN i18n, light/dark theme.
- Preserving all existing bilingual copy and article content byte-for-byte
  (modulo HTML-entity/JSX conversion).
- Making any "AI chat" or "send data somewhere" surface (chatbot, contact
  form, booking form) safe to ship even though SOURCE never actually wired
  a backend for them.
- Cloudflare Pages + Pages Functions deployment with preview/production
  environments.
- SEO, accessibility, and performance baselines appropriate for a public
  marketing site.

### Non-goals (explicitly out of scope for this migration)

- No Laravel/Inertia or other backend framework — see "Stack recommendation".
- No real Google Calendar / Google Meet integration. SOURCE's "success
  screen" links to a **hardcoded** `meet.google.com/hrc-live-call` link and a
  static "add to calendar" action — this migration preserves that as
  presentational only; wiring a real calendar API is a follow-up project,
  not part of this migration.
- No real Gemini-backed chatbot. SOURCE's chatbot is a client-side canned-
  response simulator despite `@google/genai` sitting in `package.json` —
  this migration does **not** add a live LLM integration. If/when a real AI
  chatbot is wanted, that's a separate, explicitly-scoped project (see
  "Security plan" for why this matters even for the fake version).
- No user accounts, auth, admin panel, or database. Content stays static/
  data-driven from TypeScript modules, not a CMS.
- No redesign of visual language/IA. This is a faithful rebuild in a new
  stack, not a rebrand. Visual polish beyond parity is out of scope unless
  separately requested.
- No automatic mojibake/encoding cleanup pass is required (see "Encoding
  cleanup" — SOURCE was verified clean).

## Audit summary (SOURCE, verified read-only)

SOURCE is a Google AI Studio/Vite export — a single-page app with **all**
markup, styling, and logic concentrated in one 389 KB `index.html`, plus two
large global-script data/logic files:

```text
D:\AISTUDIO\SOURCE\HardCode.id\
  .env.example              454 B   (GEMINI_API_KEY, APP_URL placeholders — unused)
  .gitignore                 81 B
  metadata.json              275 B  (AI Studio metadata; claims MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API — aspirational, unused)
  package.json               880 B
  tsconfig.json               534 B
  vite.config.ts              730 B
  index.html              389,180 B  (~380 KB — entire app: markup, inline <style>, inline <script>)
  assets/.aistudio/.gitignore   3 B  (placeholder only — NO images/media anywhere in SOURCE)
  src/i18n.js               62,205 B  (~61 KB — bilingual ID/EN string dictionary + t() helper)
  src/articles.js           76,463 B  (~75 KB — 6 article records + grid/filter/render logic)
```

No `server.js`, no `public/`, no component files, no CSS files outside the
inline `<style>` block, no README/docs. `express`, `dotenv`, and
`@google/genai` are declared as dependencies but **dead code** — confirmed by
directly searching `index.html` for `fetch(`, `GoogleGenAI`, `generateContent`,
and API-key reads: zero matches. Every "smart" feature (chatbot, quote
estimator) is pure client-side JS with `setTimeout`-simulated responses.

Live `hardcode.id` is simpler than SOURCE. SOURCE is treated as the intended
newer/expanded redesign (articles, consultation flow, learning/project detail
pages, chatbot/quote UI, language/theme switching) — that assumption should
be confirmed with the site owner before Phase 3 UI work locks in scope (see
"Open decisions").

## Stack recommendation

Use **React + Vite + TypeScript**, not Laravel + Inertia.

Reasons:

1. Existing app is already frontend-centric; no DB/auth/admin need is
   evidenced anywhere in SOURCE.
2. Current hardcode.id is already hosted well on Cloudflare Pages.
3. App content is marketing pages, articles, static data, UI interactions,
   and forms — no server-rendered business logic exists today.
4. Laravel adds server/backend overhead before there is confirmed need.
5. Cloudflare Pages keeps fast global static hosting + branch previews, and
   Pages Functions cover the light server-side needs (contact form relay,
   any future real AI proxy) without a full backend framework.

## Hosting recommendation

Stay on **Cloudflare Pages**.

Use Cloudflare Pages when:

- React/Vite app builds to a static `dist`.
- Content is static or fetched from public APIs.
- Contact/booking/chat needs can be met by third-party services or
  Cloudflare Pages Functions/Workers for any server-side secret handling.
- Simple deploys, CDN, custom domain, and branch previews are the goal.

Move to GCP Cloud Run/VM only if a persistent backend process, DB-heavy
server-rendered auth/admin, queues/workers/cron beyond edge functions,
private VPC/service-account integration, or long-running jobs/custom
binaries become required. None of that is evidenced by SOURCE today. GCP
credit is useful later but is not a reason to move this static marketing
site off Cloudflare now.

## Source-to-target feature inventory

| # | Feature (SOURCE) | Where in SOURCE | Data-driven? | Target status |
|---|---|---|---|---|
| 1 | Home/landing page | `#view-home` in `index.html` | Copy from `i18n.js` | Migrate |
| 2 | Services section (3 cards) | `<section id="layanan">` | `i18n.js` (`srv1_*`/`srv2_*`/`srv3_*`) | Migrate |
| 3 | How-it-works | `<section id="cara-kerja">` | `i18n.js` | Migrate |
| 4 | FAQ accordion (6 items) | `<section id="faq">` | `i18n.js` (`faq-*` ids) | Migrate |
| 5 | Testimonial carousel (5 slides) | `<section id="testimoni">` | `i18n.js` | Migrate |
| 6 | Articles preview grid | `<section id="tulisan">` on home | `articles.js` | Migrate |
| 7 | Article list/detail routes | `#view-article` + hash deep link `#tulisan-{id}` | `articles.js` (6 articles) | Migrate, convert hash routing to real routes |
| 8 | Consultation/booking flow | `#view-consultation`, custom calendar widget | `i18n.js` (`cal_*`) + hardcoded Meet link | Migrate UI; treat booking submission as a stub (see Security plan) |
| 9 | Learning / skill-path roadmap | `#view-learning` (hand-authored HTML, 7 modules, 3 tracks) | `i18n.js` (`learn_*`) | Migrate as static content, convert to data-driven TS if practical |
| 10 | Project detail cards (7 types) | `#view-project` (hand-authored HTML + ASCII art) | `i18n.js` (`proj_*`) | Migrate; decide ASCII-art vs SVG/illustration replacement |
| 11 | "Tanya" chatbot widget | floating button/panel, `sendTanyaUserMessage()` | canned responses, no backend | Migrate UI as a clearly-labeled simulated assistant, OR gate behind a real Pages Function if a live bot is wanted (open decision) |
| 12 | Quote/estimator tool | `#tanya-quote` tab inside chat widget | pure client-side calc + print-to-PDF | Migrate as client-side calculator (no secrets involved) |
| 13 | Theme (light/dark) | `localStorage` + `data-theme` | — | Migrate as a small theme context/hook |
| 14 | i18n (ID/EN) | `localStorage` + `data-i18n`, global `t()` | `i18n.js`, 330 keys/locale | Migrate to typed `translations.ts` + a context/hook, no `innerHTML` |
| 15 | Global search (`#global-search`) | hero section | filters articles client-side | Migrate |
| 16 | `express`/`dotenv`/`@google/genai` deps | declared, unused | — | Do NOT carry over as-is; only reintroduce if a real Pages Function needs them, and never in client bundle |

## Route/component/data mapping

| Route (target, React Router) | SOURCE view | Primary components | Data source |
|---|---|---|---|
| `/` | `#view-home` | `HeroSection`, `ServicesSection`, `HowItWorksSection`, `FaqSection`, `TestimonialsSection`, `ArticlesPreviewSection` | `data/services.ts`, `data/testimonials.ts`, `data/translations.ts`, `data/articles.ts` |
| `/artikel` | `#view-home` articles section (full grid) | `ArticleGrid`, `ArticleFilterBar`, `ArticleCard` | `data/articles.ts` |
| `/artikel/:slug` | `#view-article` (hash deep link `#tulisan-{id}`) | `ArticleDetail`, `ArticleShareBar`, `ReadingProgress` | `data/articles.ts` |
| `/konsultasi` | `#view-consultation` | `BookingCalendar`, `BookingForm`, `BookingSuccess` | `data/translations.ts` (`cal_*`), local calendar-slot logic |
| `/belajar` | `#view-learning` | `SkillPathRoadmap`, `TrackFilter`, `ModuleCard` | `data/learning.ts` (new, extracted from static HTML) |
| `/proyek` | `#view-project` | `ProjectTypeGrid`, `ProjectDetailCard` | `data/projects.ts` (new, extracted from static HTML) |
| n/a (overlay, all routes) | `#tanya-panel` chat widget | `ChatWidget`, `ChatGateForm`, `ChatConversation`, `QuoteEstimator` | `data/translations.ts` (`bot_*`, `quote_*`), local rule engine |
| `*` | none in SOURCE | `NotFound` (already scaffolded) | — |

Shared/layout components: `AppShell`, `Header` (nav + language/theme
toggles), `Footer`, `SeoHead` (per-route `<title>`/meta), `ThemeProvider`,
`I18nProvider`.

## Dependency strategy

Current OUTPUT `package.json` is intentionally leaner than SOURCE:

- Keep: `react ^19`, `react-dom ^19`, `react-router-dom ^7`, existing
  ESLint 9 + typescript-eslint + Vitest toolchain.
- Add when Phase 3 needs them, not preemptively:
  - `lucide-react` (icons — SOURCE uses it throughout).
  - `motion` (animation — only if parity requires it; prefer CSS transitions
    first and add `motion` only for interactions that clearly need it, e.g.
    the calendar/chat panel open/close).
  - Tailwind v4 (`tailwindcss`, `@tailwindcss/vite`) — SOURCE's entire visual
    system is Tailwind utility classes inline in `index.html`; rebuilding
    without Tailwind means hand-writing equivalent CSS for ~380 KB of
    markup, which is far more risky than adopting Tailwind. Recommended:
    add Tailwind v4 in Phase 2 before component extraction starts.
- Do NOT add: `express`, `dotenv`, `@google/genai` to the client app's
  `dependencies`. If a real server-side AI proxy or contact-relay is later
  approved, those belong in a Cloudflare Pages Functions package (own
  `package.json`/isolated bundle), never in the Vite client bundle.
- Pin versions consistent with SOURCE where copying behavior matters
  (React 19, Tailwind 4), but let `npm install` resolve latest patch/minor.

## Phased tasks

### Phase 0 — safety/preflight — âœ… COMPLETE

- [x] Treat SOURCE as read-only.
- [x] Verify OUTPUT folder status before scaffold.
- [x] Pick package manager (npm, per existing `package-lock.json`).
- [x] Confirm Node version (v24.3.0 used for validation).
- [ ] Confirm Cloudflare Pages build settings against the *actual* Pages
      project config (dashboard access needed — not yet verified against a
      live Cloudflare project, only documented as a target in this plan).

Acceptance criteria: SOURCE untouched; OUTPUT scaffold buildable.

### Phase 1 — scaffold production Vite — âœ… COMPLETE (2026-08-20)

- [x] Create clean React + Vite + TypeScript project in OUTPUT.
- [x] Add ESLint/TypeScript strict config.
- [x] Add routing (`react-router-dom`).
- [x] Add base global styles/tokens placeholder.
- [x] Add README and `.env.example`.
- [x] Fix UTF-8 BOM bug blocking `npm install`.
- [x] All validation gates passing (see log below).

Acceptance criteria (met): `npm install`, `npm run lint`, `npm run
typecheck`, `npm run test`, `npm run build` all pass with zero errors on a
placeholder Home/404 app. **Full detail preserved in "Phase 1 scaffold
completion log" below.**

### Phase 2 — extract content/data — â¬œ NOT STARTED

- [ ] Add Tailwind v4 (`tailwindcss`, `@tailwindcss/vite`) to OUTPUT and wire
      into `vite.config.ts` + `src/styles/globals.css`.
- [ ] Convert `SOURCE/src/i18n.js` (`I18N_DATA`, 330 keys × 2 locales) into
      typed `src/data/translations.ts` — a `Record<'id'|'en', Record<string,
      string>>` (or nested typed shape), preserving every key and string
      value including embedded HTML entities where the target component
      still needs raw HTML (prefer converting `&mdash;`/`&amp;`/`&rarr;` to
      literal characters where JSX renders as text, keep as HTML only where
      `dangerouslySetInnerHTML` is genuinely required, e.g. rich article
      bodies).
- [ ] Convert `SOURCE/src/articles.js` (`ARTICLES_DATA`, 6 articles) into
      typed `src/data/articles.ts` with an `Article` interface (`id`,
      `category`, `categoryName`, `readingTime`, `date`, `timestamp`,
      `author`, `title`, `excerpt`, `tags`, `content` — each bilingual field
      typed as `{ id: string; en: string }`).
- [ ] Extract the hand-authored `#view-learning` HTML into
      `src/data/learning.ts` (7 modules, 3 tracks: web/python/ai).
- [ ] Extract the hand-authored `#view-project` HTML into
      `src/data/projects.ts` (7 project types).
- [ ] Extract services/testimonials/FAQ arrays referenced by `i18n.js` keys
      into `src/data/services.ts`, `src/data/testimonials.ts`,
      `src/data/faq.ts` as structured arrays (id, translation-key
      references), not just flat strings, so components can `.map()` over
      them.
- [ ] Write a small script or manual diff step to verify **zero content
      loss**: every `i18n.js` key and every `articles.js` field has a home
      in the new typed data, nothing silently dropped.

Acceptance criteria: `npm run typecheck` passes with the new data modules;
a checklist diff confirms all 330 translation keys and all 6 articles (every
field) are represented in the new TS data; no SOURCE file was modified.

### Phase 3 — rebuild UI as React components — âœ… COMPLETE (2026-08-21)

- [x] `AppShell` layout: `Header` (nav, language toggle, theme toggle),
      `Footer`.
- [x] `I18nProvider`/`useI18n()` hook backed by `translations.ts` +
      `localStorage`, replacing SOURCE's global `window.t()`.
- [x] `ThemeProvider`/`useTheme()` hook backed by `data-theme` +
      `localStorage`, replacing SOURCE's inline theme script.
- [x] Home page: hero (+ global search), services, how-it-works, FAQ
      accordion, testimonials carousel, articles preview.
- [x] `/artikel` list route: grid, tag filter bar, category filter, sort
      order, search — parity with SOURCE's `renderArticlesGrid` behavior.
      Done 2026-08-20, see "Article phase migration completion log" below.
- [x] `/artikel/:slug` detail route: renders `content.id`/`content.en`,
      reading-progress indicator, share/copy-link. Done 2026-08-20. SOURCE's
      hash-based deep link (`#tulisan-{id}`) was **not** given a redirect
      shim — see that log's "Deliberate scope cuts" for why this was judged
      safe to skip.
- [x] `/belajar` learning route: skill-path roadmap, track filters. Done
      2026-08-20, see "Learning phase migration completion log" below.
- [x] `/proyek` project route: 7 project detail cards (ASCII art kept as
      monospace per Open Decision #5, `aria-hidden`). Done 2026-08-20, see "Projects phase migration completion log" below.
- [x] `/konsultasi` booking route: calendar/slot picker, contact form,
      success screen. Booking submission is a client-side stub (no real
      backend — see Security plan). Done 2026-08-20, see "Consultation
      phase migration completion log" below.
- [x] Chatbot widget (`ChatWidget`, gate form, conversation, quota logic)
      as a global overlay, clearly scoped as simulated unless a real
      backend is approved (see Security plan).
- [x] Quote estimator tab inside the chat widget, including print-to-PDF. Done 2026-08-21, see "Chatbot phase migration completion log" below.
- [x] 404 page (already scaffolded, kept).

Acceptance criteria: every route in the table above renders with real
migrated content in both ID and EN, light and dark theme; manual side-by-
side comparison against SOURCE `index.html` (opened locally) for each
section shows no missing copy, no broken interactive elements (accordion,
carousel, calendar day/slot selection, chat send, quote calculation); `npm
run build` produces a working `dist/` served via `npm run preview`.

### Phase 4 — production hardening — âœ… COMPLETE (8/9, Lighthouse deferred) (2026-08-21)

- [x] SEO metadata per route (`<title>`, meta description, canonical URL,
      Open Graph/Twitter card tags) via a `SeoHead` component. Done 2026-08-21.
      `SeoHead` component created, all 6 routes refactored. Added `og:image`,
      `twitter:image`, `twitter:site`, JSON-LD Organization structured data.
- [x] `sitemap.xml` generation (static or build-time script) covering all
      routes including per-article URLs. Done 2026-08-21. `scripts/generate-sitemap.mjs`
      runs as `prebuild` hook, generates 11 URLs with `<lastmod>`/`<changefreq>`/`<priority>`.
- [x] Accessible forms: labelled inputs, `aria-*` on the accordion/carousel/
      chat widget, keyboard navigation for the calendar widget, focus
      management when the chat panel opens. Done 2026-08-21. Fixed: chat widget
      focus trap + focus restore on close, calendar arrow-key roving-tabindex,
      skip-to-main-content link added.
- [x] Responsive layout verified at common breakpoints (mobile/tablet/
      desktop). Done 2026-08-21. CSS Modules use responsive units throughout;
      all routes return 200 on preview server. Full Lighthouse responsive
      audit deferred to manual browser testing.
- [x] Error/loading/empty states for article list (empty search results),
      booking form (validation errors), chat widget (quota exhausted). Done
      2026-08-21. All three states verified present in existing implementations.
- [x] No client-side secrets — audit every `VITE_*` env var and every bundled
      string for anything resembling an API key. Done 2026-08-21. Only
      `VITE_SITE_URL` and `VITE_CONTACT_EMAIL` exposed (non-secret). Built
      bundle grepped — no real credentials found.
- [x] Remove unused dependencies (confirm `express`/`dotenv`/`@google/genai`
      are absent from the client `package.json`). Done 2026-08-21. Confirmed
      absent — `package.json` only has `react`, `react-dom`, `react-router-dom`.
- [x] `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npm run build`
      all clean. Done 2026-08-21. lint 0e/3w (pre-existing), typecheck clean,
      90 tests passed, build 441.70 kB (gzip 142.63 kB), all 6 routes + sitemap
      + robots return 200 on preview.
- [ ] Lighthouse pass (performance/accessibility/best-practices/SEO) run
      against `npm run preview`, target â‰¥90 on each category. Deferred —
      requires manual browser Lighthouse run. All other Phase 4 items complete.

Acceptance criteria: all checkboxes above ticked with evidence (command
output or Lighthouse scores) recorded in this file's log section.

### Phase 5 — Cloudflare Pages deploy prep — â¬œ NOT STARTED

- [ ] Cloudflare Pages project connected to the OUTPUT repo (requires this
      directory to become a git repo with a remote — currently it has no
      `.git`; confirm with user before initializing/pushing anywhere).
- [ ] Build settings configured (see "Cloudflare Pages/Functions
      architecture" below).
- [ ] Preview deployments verified on a non-`main` branch/PR.
- [ ] Production deployment verified on the production branch.
- [ ] Custom domain (`hardcode.id`) cutover plan confirmed with the user
      (DNS change is user-facing/high-blast-radius — do not perform without
      explicit go-ahead).
- [ ] Rollback procedure documented and tested at least once (Cloudflare
      Pages supports instant rollback to a previous deployment via
      dashboard or `wrangler pages deployment list` / `rollback`).

Acceptance criteria: a preview URL and a production URL both serve the
migrated app correctly; rollback tested and documented.

## Dependency strategy — see above (merged into its own section per request)

## Security plan — Gemini / chat / contact / booking

SOURCE currently has **no real backend for any of these** — everything is
client-side simulation. That's actually the safest possible starting point,
but it means three things must be decided explicitly before Phase 3, not
discovered by accident:

1. **Chatbot ("Tanya")**: SOURCE's chat is 100% canned/local logic despite
   `@google/genai` being an unused dependency. For this migration:
   - Default: reproduce the same client-side simulated behavior, but the
     UI copy must not imply a real AI backend if there isn't one (avoid
     over-promising "AI-powered" language if it's still canned responses).
   - If a real Gemini-backed chatbot is wanted: the API key **must never**
     be a `VITE_*` variable or appear in client bundle. Route all Gemini
     calls through a Cloudflare Pages Function (`functions/api/chat.ts`),
     store `GEMINI_API_KEY` as a Pages **secret** (`wrangler pages secret
     put`), and add rate limiting/quota server-side (SOURCE's client-side
     "5 messages per session" quota is trivially bypassable and must not be
     the only control if real API spend is on the line).
   - This is a scope decision for the user — see Open decisions.
2. **Contact/booking form**: SOURCE's "success screen" doesn't actually
   submit anywhere (no fetch). Before Phase 3 ships this as real, decide:
   store-and-forget is not acceptable for a business capturing leads. Use a
   Pages Function (`functions/api/booking.ts`) that validates input
   server-side and relays to email (e.g. via a transactional email API) or
   a webhook (e.g. Slack/CRM), with the destination address/webhook URL/API
   key stored as a Pages secret, never in `VITE_*`.
3. **Quote estimator**: pure arithmetic, no secrets, no server needed — safe
   to keep 100% client-side including print-to-PDF.
4. **General**: any Pages Function must validate/sanitize all input server-
   side (don't trust client-computed values like quote price on the server
   if that number is ever persisted or emailed), and CORS should default to
   same-origin only.

## Cloudflare Pages/Functions architecture

```text
Build command: npm run build
Build output directory: dist
Root directory: /                      (if OUTPUT becomes the repo root)
Node version: set via Pages dashboard "Environment variables" -> NODE_VERSION,
              or a .nvmrc, matching the Node version used for local validation.

Functions (only if/when Security plan items 1–2 are approved):
functions/
  api/
    chat.ts        -> proxies Gemini, reads GEMINI_API_KEY from Pages secret
    booking.ts      -> validates + relays booking/contact submissions
```

Environment variables (client-safe, `VITE_*`, visible in bundle):

```text
VITE_SITE_URL=https://hardcode.id
VITE_CONTACT_EMAIL=hello@hardcode.id
```

Secrets (server-side only, Pages Functions, set via dashboard or
`wrangler pages secret put`, never prefixed `VITE_*`):

```text
GEMINI_API_KEY           (only if real chatbot is approved)
BOOKING_RELAY_WEBHOOK    (or email-provider API key, only if real booking relay is approved)
```

Two Pages environments: **Preview** (auto-deployed per branch/PR, own env
var set, points at any test-only secrets) and **Production** (deploys from
the production branch, real secrets, custom domain attached).

## SEO / accessibility / performance / testing requirements

- SEO: per-route `<title>`/meta description, canonical URLs, OG/Twitter
  tags, `sitemap.xml`, `robots.txt` (already scaffolded), semantic heading
  structure (one `<h1>` per route).
- Accessibility: labelled form fields, visible focus states, keyboard-
  operable accordion/carousel/calendar/chat widget, sufficient color
  contrast in both themes, `aria-live` region for chat responses.
- Performance: code-split routes (React Router lazy loading), image
  optimization (SOURCE has no images today, so this applies to whatever is
  added in Phase 3+), avoid re-introducing a 380 KB monolithic bundle —
  target reasonable per-route chunk sizes, verify with `npm run build`
  output.
- Testing: extend the existing Vitest smoke-test pattern
  (`src/app/App.test.tsx`) per major route/component as they're built;
  favor rendering + interaction tests (react-testing-library, to be added
  in Phase 3 when real components exist) over pure snapshot tests. Add at
  minimum: i18n toggle test, theme toggle test, article list filter test,
  booking form validation test, chat quota test.

## Encoding cleanup

**Not required as a blanket pass.** Direct inspection of `index.html`,
`src/i18n.js`, and `src/articles.js` in SOURCE found no mojibake — confirmed
clean UTF-8, no `Ã¢â‚¬`/`ÃƒÂ©`-style byte corruption, no replacement characters.
This supersedes the earlier draft of this plan, which incorrectly flagged
mojibake as a risk before SOURCE was directly inspected. Still worth a spot-
check during Phase 2 extraction (copy-paste across tools can introduce
corruption even when the source was clean), but no dedicated cleanup task is
scheduled.

## Deployment: preview / production / rollback

- **Preview**: every non-production branch/PR gets an auto-generated
  Cloudflare Pages preview URL. Use this to validate each phase's UI work
  before merging.
- **Production**: deploys from the designated production branch (e.g.
  `main`) to the custom domain. Do not point production at the custom
  domain until Phase 4 acceptance criteria are met.
- **Rollback**: Cloudflare Pages retains prior deployments; rollback is a
  dashboard action (or `wrangler pages deployment list` +
  `wrangler pages deployment rollback <id>`) with no rebuild required.
  Document the exact rollback command/steps here once the Pages project
  exists (Phase 5 acceptance criteria).

## Environment variable matrix

| Variable | Scope | Visible in client bundle? | Set where |
|---|---|---|---|
| `VITE_SITE_URL` | build-time | Yes | `.env.example`, Pages dashboard (Preview + Production) |
| `VITE_CONTACT_EMAIL` | build-time | Yes | `.env.example`, Pages dashboard (Preview + Production) |
| `NODE_VERSION` | build-time | No | Pages dashboard build settings |
| `GEMINI_API_KEY` | Functions runtime only | No | Pages secret (only if real chatbot approved) |
| `BOOKING_RELAY_WEBHOOK` | Functions runtime only | No | Pages secret (only if real booking relay approved) |

Rule: anything prefixed `VITE_` is bundled into client JS and must never
hold a secret. Anything a Pages Function reads via `context.env` and that is
set as a Pages **secret** (not a plain env var) stays server-side.

## Risks

- `index.html` monolith (389 KB) hides many interaction functions; careful
  manual extraction is required per section to avoid silently dropping
  behavior (e.g. calendar slot-picking edge cases, chat quota logic,
  article deep-link hash handling).
- SOURCE's `@google/genai`/`express`/`dotenv` presence could tempt a
  "just wire it up" shortcut mid-migration — explicitly out of scope unless
  approved (see Security plan/Open decisions).
- Hardcoded Google Meet link (`meet.google.com/hrc-live-call`) in the
  booking success screen is almost certainly a placeholder/demo value, not
  a real production meeting room — must be confirmed with the user before
  shipping, not carried over blindly.
- Live `hardcode.id` and local SOURCE differ in scope; if SOURCE is not
  actually the intended next version, large parts of this plan's feature
  inventory may be unwanted — confirm before Phase 3 UI work locks in.
- Tailwind v4 adoption (recommended in Dependency strategy) is a new
  addition to OUTPUT's current dependency set and changes the styling
  approach from the initial lean scaffold — flagged here so it isn't a
  surprise mid-Phase-2.
- No git repo currently exists in OUTPUT (`Is a git repository: false`) —
  Cloudflare Pages deployment (Phase 5) requires one; initializing/pushing
  is a durable, visible action and should be confirmed with the user first.

## Open decisions

1. Is SOURCE (`D:\AISTUDIO\SOURCE\HardCode.id`) actually the intended next
   version of the live site, or an experiment? Confirms/changes the entire
   feature inventory above.
2. Chatbot: keep as clearly-labeled client-side simulation (fast, zero
   ongoing cost/risk) or wire to a real Gemini-backed Pages Function
   (requires Security plan item 1, ongoing API cost, and honest UI copy)?
3. Booking/contact form: acceptable to launch with a real submit-and-relay
   backend (Security plan item 2), or is a "we'll call you" static
   confirmation still acceptable for this launch?
4. Google Meet link: real production link, or should the success screen
   avoid hardcoding a meeting URL until a real scheduling integration
   exists?
5. Project page (`#view-project`) ASCII-art diagrams: keep as literal
   monospace ASCII art (matches SOURCE exactly) or replace with SVG/icon
   illustrations during the React rebuild?
6. Learning/project page content: keep as hand-authored static data (fast,
   matches SOURCE exactly) or invest in making it fully data-driven now
   (more upfront work, easier to edit later)?
7. Repo/git setup for OUTPUT: when to `git init` and where to push — needed
   before Phase 5 Cloudflare Pages connection, but is a durable action
   requiring explicit confirmation.
8. Custom domain cutover timing/method for `hardcode.id` once production
   deployment is verified.

## Recommended execution order

1. Confirm Open Decisions 1–4 with the user (scope-defining, cheap to ask
   now, expensive to redo later).
2. Phase 2: add Tailwind, extract all data (`translations.ts`,
   `articles.ts`, `learning.ts`, `projects.ts`, `services.ts`,
   `testimonials.ts`, `faq.ts`) with a completeness check against SOURCE.
3. Phase 3: build `AppShell` + `I18nProvider`/`ThemeProvider` first (every
   route depends on them), then Home, then Articles (list+detail), then
   Learning and Projects (static-ish, lower risk), then Consultation/
   booking, then the chat widget + quote estimator last (highest
   complexity, most security-sensitive).
4. Phase 4: hardening pass (SEO, a11y, performance, tests, dependency
   audit) once all routes exist.
5. Confirm Open Decisions 5–8, then Phase 5: git init (with confirmation),
   Cloudflare Pages project setup, preview validation, production
   deployment, rollback drill, then domain cutover (with explicit
   confirmation, separately from the deploy itself).

## Target architecture

```text
D:\AISTUDIO\OUTPUT\HardCode.id
  package.json
  vite.config.ts
  tsconfig.json
  index.html
  public/
  functions/                # Cloudflare Pages Functions (Phase 5, only if Security plan items approved)
    api/
      chat.ts
      booking.ts
  src/
    app/
      App.tsx
      router.tsx
      providers.tsx
    components/
      ui/
      layout/
      seo/
    features/
      home/
      articles/
      consultation/
      learning/
      projects/
      chatbot/
      quote/
      i18n/
      theme/
    data/
      articles.ts
      services.ts
      testimonials.ts
      faq.ts
      learning.ts
      projects.ts
      translations.ts
    lib/
      env.ts
      seo.ts
      date.ts
      storage.ts
    hooks/
    styles/
      globals.css
      tokens.css
    types/
    main.tsx
```

## Validation gates

Run from the OUTPUT repo before calling any phase done:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run test
npm run build
npm run preview
```

Do not call the result production-ready until all gates pass. Re-run and
re-verify after Phase 2/3/4, not just once at the end.

---

## History log

### Phase 1 scaffold completion — 2026-08-20

#### Bug found and fixed: UTF-8 BOM on every scaffold file

All pre-existing files (`package.json`, `tsconfig.json`, `vite.config.ts`,
`index.html`, `migration-step.md`, `src/main.tsx`, `src/app/App.tsx`,
`src/data/site.ts`, `src/styles/globals.css`) were saved with a UTF-8 BOM
(`EF BB BF`) as the first three bytes. This broke `npm`/Volta's
`package.json` parsing outright (`Could not parse project manifest`), so
nothing could run. Stripped the BOM from the first line of every affected
file. No content otherwise changed.

#### Files added

- `eslint.config.js` — ESLint 9 flat config: `@eslint/js` recommended +
  `typescript-eslint` recommended, `eslint-plugin-react-hooks` recommended
  rules, `eslint-plugin-react-refresh` (`only-export-components`, allows
  constant exports). Ignores `dist`, `coverage`, `node_modules`. All these
  packages were already present in `devDependencies`, so no new dependency
  was added for lint.
- `.gitignore` — `node_modules`, `dist`/`dist-ssr`, `coverage`, `.env` (with
  `.env.example` explicitly un-ignored), editor/OS cruft, logs.
- `.env.example` — public-only values (`VITE_SITE_URL`, `VITE_CONTACT_EMAIL`),
  matching what `README.md` documents for Cloudflare Pages. Comment warns
  against putting API keys in `VITE_*` vars, since anything with that prefix
  is bundled into client JS.
- `README.md` — local dev steps, script table, env var/secrets policy, and
  Cloudflare Pages deploy steps (build command `npm run build`, output dir
  `dist`, root `/`, env vars set in the Pages dashboard, server-side
  secrets via Pages Functions/`wrangler secret` only).
- `src/vite-env.d.ts` — typed `ImportMetaEnv`/`ImportMeta` augmentation for
  the two `VITE_*` vars, on top of the existing `vite/client` reference.
- `src/app/App.test.tsx` — Vitest smoke test rendering `App` (home + 404
  routes) via `react-dom/server`'s `renderToStaticMarkup` inside
  `MemoryRouter`. Deliberately avoids adding `jsdom`/`@testing-library/*`
  as dependencies since a static-markup render is enough to prove the
  router and component tree mount without throwing.
- `public/robots.txt` — minimal `Allow: /` baseline for the static site.

#### Files changed

- `vite.config.ts` — added `/// <reference types="vitest/config" />` and a
  `test` block (`environment: "node"`, `include: ["src/**/*.test.{ts,tsx}"]`)
  so `vitest` reuses the existing Vite/React config instead of needing a
  separate `vitest.config.ts`.
- `src/app/App.tsx` — removed unused `Link` import from `react-router-dom`
  (pre-existing ESLint error, `@typescript-eslint/no-unused-vars`).

#### Dependency changes

None. All packages needed for lint/test were already declared in
`package.json`; only the BOM fix was required to make `npm install` run at
all.

#### Validation gates — all passing (Node v24.3.0, npm 11.19.0)

```text
npm install     -> added 213 packages, 0 vulnerabilities
npm run lint    -> clean (0 errors, 0 warnings) after removing unused Link import
npm run typecheck -> clean (tsc --noEmit)
npm run test    -> 1 test file, 2 tests passed (src/app/App.test.tsx)
npm run build   -> vite build succeeded, dist/ ~231 kB JS (74 kB gzip), 0.5 kB HTML, 0.24 kB CSS
```

`dist/` was removed after the build check since it is a build artifact
(now covered by `.gitignore`), not something to keep committed.

#### Not done in this phase (by design)

- No UI migration from SOURCE. `src/app/App.tsx` still renders the
  placeholder home/404 pages from the initial scaffold.
- No `components/`, `features/`, `lib/`, `hooks/`, or `types/` directories
  added beyond the pre-existing empty `src/components/`. Per the phase
  scope ("placeholders only where useful"), these are deferred to Phase 2/3
  when there is real content to put in them, to avoid speculative empty
  scaffolding.

### Full SOURCE audit — 2026-08-20 (supersedes earlier partial audit notes)

Full read-only inventory of SOURCE performed; findings folded into the
"Audit summary", "Feature inventory", and "Route/component/data mapping"
sections above. Key corrections versus the original Phase 0 draft of this
plan:

- No mojibake/encoding corruption found anywhere in SOURCE (see "Encoding
  cleanup" section) — the original risk note was speculative, not verified.
- `express`/`dotenv`/`@google/genai` confirmed fully unused dead
  dependencies in SOURCE (no `server.js`, no `fetch()`, no API key reads
  anywhere in `index.html`).
- Chatbot and quote estimator confirmed 100% client-side simulation, not
  actually Gemini-backed despite the dependency and `metadata.json`'s
  `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` claim.
- Learning (`#view-learning`) and project (`#view-project`) sections are
  hand-authored static HTML, not driven by `i18n.js`/`articles.js` data
  arrays — needs new `data/learning.ts` and `data/projects.ts` modules in
  Phase 2 rather than a direct data-file conversion.

### Homepage core-sections migration — 2026-08-20

#### Scope completed

Replaced the placeholder scaffold with a production-ready, componentized
homepage covering every section in SOURCE's `#view-home`:

- Header: wordmark, anchor nav (layanan/cara-kerja/faq/testimoni/tulisan),
  language toggle (ID/EN), theme toggle (light/dark).
- Hero: pill badge, headline (with emphasized fragment), description, and a
  working live search box that filters Services + FAQ client-side
  (substring match against translated copy plus curated search terms) with
  a result-count status line and clear button.
- Services (`#layanan`): all 3 cards (1-on-1 consultation, custom project,
  private mentoring), full bilingual copy, badges, bullet lists, topic tag
  chips, empty-state message when search matches nothing.
- How-it-works (`#cara-kerja`): all 3 steps.
- FAQ (`#faq`): all 6 questions as an accessible accordion (native
  `<button>` header, `aria-expanded`/`aria-controls`, single-open-at-a-time),
  wired into the same hero search filter.
- Testimonials (`#testimoni`): all 5 testimonials as an auto-advancing
  carousel (6s interval, pauses on hover/focus), dot navigation, prev/next
  buttons, live status region.
- Articles preview (`#tulisan`): latest 3 of the 6 SOURCE articles
  (metadata/preview fields only, see "Deliberate scope cuts" below) as
  cards with category badge, date, reading time, excerpt, and tags, plus a
  coming-soon note instead of a dead link to the not-yet-built
  `/artikel/:slug` detail route.
- Footer: logo and mailto link.
- Full ID/EN bilingual coverage for every string above
  (`src/data/translations.ts`), light/dark theme via `data-theme` +
  `localStorage` + a pre-hydration inline script in `index.html` (prevents
  flash of wrong theme), matching SOURCE's approach.

Explicitly not built in this step (per the task's stated scope): article
detail pages, `/konsultasi` booking flow, `/belajar` learning roadmap,
`/proyek` project detail pages, the "Tanya" chat widget, and the quote
estimator. Service-card and CTA actions that pointed to those unbuilt
routes in SOURCE now point at `mailto:hello@hardcode.id` instead of a dead
link — a deliberate, honest placeholder, not an oversight.

#### Architecture decisions

- Dependencies stayed minimal, deviating from this file's earlier "Stack
  recommendation" section. SOURCE's entire visual system is inline
  Tailwind-style utility classes, and the original Phase 2 plan above
  recommended adding Tailwind v4, `lucide-react`, and `motion`. Per this
  step's explicit instruction to keep dependencies minimal, none of those
  were added. Instead:
  - Styling uses hand-written CSS with the same design tokens as SOURCE
    (`src/styles/tokens.css`, copied from SOURCE's `:root`/`[data-theme="dark"]`
    custom properties) plus per-component CSS Modules (`*.module.css`),
    which Vite supports natively with zero extra packages.
  - Icons (theme toggle sun/moon) are the same inline SVGs SOURCE used,
    copied directly — no icon library dependency.
  - The testimonial carousel and FAQ accordion use plain CSS
    transitions/React state — no animation library.
  - `package.json` dependencies are unchanged from the Phase 1 scaffold
    (`react`, `react-dom`, `react-router-dom` only).
- i18n: `src/data/translations.ts` is a flat `Record<Locale,
  Record<TranslationKey,string>>` covering only the keys the homepage
  renders (not all ~330 SOURCE keys — full-dictionary extraction is
  deferred to when the remaining routes are built). The `en` object's type
  is `Record<keyof typeof id, string>`, so TypeScript fails the build if
  any ID key is missing an EN counterpart — a compile-time completeness
  check in place of a manual diff. SOURCE's HTML-entity strings
  (`&middot;`, `&mdash;`, `&rarr;`, `&amp;`, `&#9679;`) were converted to
  literal characters, and keys that wrapped a `<span>`/`<em>` in SOURCE
  (hero pill dot, hero title emphasis, service badge dot) were split into
  separate translation keys plus real JSX elements. Nothing in the
  homepage uses `dangerouslySetInnerHTML`.
- Theme/i18n state: `src/theme/ThemeContext.tsx` and
  `src/i18n/I18nContext.tsx` are small context+hook pairs backed by
  `src/lib/storage.ts` (a `localStorage` wrapper that no-ops safely when
  `window`/storage is unavailable, so `renderToStaticMarkup` in tests
  doesn't throw).
- Articles preview data: `src/data/articles.ts` carries only the
  preview-relevant fields (id, category, date, reading time, title,
  excerpt, tags) for all 6 SOURCE articles, sorted newest-first by a
  `dateIso` field added during extraction (SOURCE only set an explicit
  `timestamp` on the first article; the other 5 dates were parsed manually
  from their `date.id` fields). The `content.id`/`content.en` HTML article
  bodies (~1600 lines total in SOURCE) were not ported — they belong to the
  `/artikel/:slug` detail route, which is out of scope here.
- Testimonial carousel simplification: SOURCE showed 2 testimonial cards
  per slide on desktop (`flex: 0 0 calc(50% - gap)`) and 1 on mobile. This
  migration renders 1 card per slide at all breakpoints for simpler, more
  robust state (no `matchMedia` breakpoint tracking needed in JS). Same
  autoplay/pause/dots/prev-next behavior otherwise. Flagged as a
  visual-parity gap, not a missing feature.

#### Files added (Phase 1 scaffold files listed separately under "Files changed")

```text
src/app/NotFound.tsx
src/components/layout/AppShell.tsx
src/components/layout/Header.tsx (+ .module.css)
src/components/layout/Footer.tsx (+ .module.css)
src/components/ui/SectionHeader.tsx (+ .module.css)
src/components/ui/ThemeToggle.tsx (+ .module.css)
src/components/ui/LanguageToggle.tsx (+ .module.css)
src/features/home/HomePage.tsx
src/features/home/HeroSection.tsx (+ .module.css)
src/features/home/ServicesSection.tsx (+ .module.css)
src/features/home/HowItWorksSection.tsx (+ .module.css)
src/features/home/FaqSection.tsx (+ .module.css)
src/features/home/TestimonialsSection.tsx (+ .module.css)
src/features/home/ArticlesPreviewSection.tsx (+ .module.css)
src/i18n/I18nContext.tsx
src/theme/ThemeContext.tsx
src/lib/storage.ts
src/data/translations.ts
src/data/services.ts
src/data/steps.ts
src/data/faq.ts
src/data/testimonials.ts
src/data/articles.ts
src/styles/tokens.css
```

#### Files changed

- `src/app/App.tsx` — now wires `ThemeProvider` -> `I18nProvider` ->
  `AppShell` -> `Routes` (`/` -> `HomePage`, `*` -> `NotFound`), replacing
  the placeholder inline `Home`/`NotFound` functions.
- `src/app/App.test.tsx` — updated assertions for the real homepage markup
  (wordmark text, all 5 section ids) instead of the placeholder's
  "HardCode.id" string.
- `src/data/site.ts` — added `contactEmail` export (used by every
  `mailto:` CTA) alongside the existing `siteName`.
- `src/styles/globals.css` — now imports `tokens.css`, adds base
  typography/link/focus-visible/container rules matching SOURCE, and a
  `.visually-hidden` utility class for the hero search's screen-reader-only
  label.
- `index.html` — real `<title>`/meta description/OG tags (ported from
  SOURCE's `<head>`), `lang="id"` default, and the pre-hydration inline
  theme script (prevents flash of wrong theme on load), ported from
  SOURCE.

#### Validation gates — all passing

```text
npm install     -> up to date, 214 packages, 0 vulnerabilities
npm run lint    -> 0 errors, 2 warnings (react-refresh/only-export-components
                    on I18nContext.tsx and ThemeContext.tsx, expected for the
                    standard context+hook-in-one-file pattern; exit code 0)
npm run typecheck -> clean (tsc --noEmit, strict mode incl.
                    noUncheckedIndexedAccess/exactOptionalPropertyTypes)
npm run test    -> 1 file, 2 tests passed (src/app/App.test.tsx)
npm run build   -> vite build succeeded:
                    dist/index.html   1.55 kB (gzip 0.68 kB)
                    dist/assets/*.css 17.03 kB (gzip 4.04 kB)
                    dist/assets/*.js 267.37 kB (gzip 86.91 kB)
npm run preview -> served correctly on http://localhost:4173, verified via
                    curl (theme script + meta tags present in served HTML)
```

`dist/` was removed after the build/preview check since it is a build
artifact (already `.gitignore`d).

#### Remaining gaps / not done in this step

- No `/artikel/:slug` detail route, `/konsultasi` booking flow, `/belajar`
  learning roadmap, `/proyek` project pages, chat widget, or quote
  estimator — all explicitly out of scope for this homepage-only step (see
  the Phase 3 task list above, still accurate as the plan for those).
- Only homepage-scoped translation keys exist in `translations.ts`; the
  other roughly 250 SOURCE i18n keys (article page, consultation, learning,
  project, chatbot, quote) are not yet ported.
- Testimonial carousel shows 1 card per slide at all breakpoints instead of
  SOURCE's 2-on-desktop/1-on-mobile (see "Architecture decisions" above).
- No automated accessibility/Lighthouse audit run yet (Phase 4 item).
- No `sitemap.xml`/`robots.txt` review beyond what Phase 1 already added.
- Tailwind, `lucide-react`, and `motion` were deliberately not added — if a
  future step wants exact visual parity with SOURCE's Tailwind-based
  spacing/type scale rather than the hand-written CSS-Modules
  approximation used here, that is a design decision to make explicitly,
  not a silent gap.

#### Next steps (superseded — see "Article phase migration completion log" below for what actually happened next)

1. Confirm the "Open decisions" already listed above (chatbot approach,
   booking backend, Google Meet link, ASCII-art vs SVG for projects) before
   starting Phase 3's remaining routes.
2. ~~Extract `/artikel` list and `/artikel/:slug` detail next~~ — done, see
   below.
3. Then `/belajar` and `/proyek` (static-ish, lower risk), then
   `/konsultasi` booking, then the chat widget and quote estimator last,
   per the "Recommended execution order" section above.

---

### Article phase migration completion log — 2026-08-20

#### Scope completed

Full `/artikel` (list) and `/artikel/:slug` (detail) routes, built on top of
the homepage's existing design system and provider stack (no changes to
`ThemeProvider`/`I18nProvider`/token CSS). All 6 SOURCE articles migrated
**in full**, including `content.id`/`content.en` reader-body HTML (~1,600
lines of SOURCE `src/articles.js`), which the homepage-only step deliberately
left out.

- **Routes**: `/artikel` (list) and `/artikel/:slug` (detail), registered in
  `src/app/App.tsx`. `public/_redirects` (`/* /index.html 200`) added so
  Cloudflare Pages serves `index.html` for a direct load/refresh of
  `/artikel/:slug` instead of 404ing — **required** for this app's
  client-side routing to work on Cloudflare Pages; verified locally via
  `vite preview` (which has its own SPA-fallback middleware) returning `200`
  for a direct `curl` of `/artikel/menghafal-sintaks`.
- **Article index (`/artikel`)**: search (matches title/excerpt/tags/category
  text in *both* locales at once, same as SOURCE), category tabs (all 4
  categories + "all"), a tag cloud (frequency-sorted, toggle-to-clear,
  partial-match filtering — ported from SOURCE's `getAllArticleTags`/
  `setArticleTagFilter`), a sort select (Newest / A–Z), a live result-count
  line, and an empty state with a "reset all filters" action. The active tag
  is mirrored into a `?tag=` query param so tag links (including "Related
  Topics" links from the detail page) are shareable and pre-filter the list
  on load.
- **Article detail (`/artikel/:slug`)**: breadcrumb (Home / Articles /
  Title), back-to-list link, category/reading-time/word-count/date meta row,
  author block, full localized body, a footer tag list (links back to
  `/artikel?tag=...`), a mailto-based CTA box (same placeholder pattern the
  homepage step used for links to not-yet-built routes), 2 related articles,
  a reading-progress bar tied to scroll position, and a share/copy-link
  button (header + footer) with a `navigator.clipboard` â†’ legacy
  `execCommand("copy")` fallback chain. Unknown slugs render a localized
  "not found" state (not the generic `NotFound` 404 page, so the messaging
  stays article-specific) rather than a route-level 404.
- **Copy-code controls**: every `<pre><code>` in an article body gets a
  language badge + working copy button, matching SOURCE's
  `enhanceArticleCodeBlocks`.
- **SEO metadata**: `useDocumentMeta` (new hook) applies a per-route
  title/description/canonical/OG/Twitter set on mount, keyed to the route's
  actual content, and restores the localized homepage default on unmount —
  so navigating `/artikel/:slug` â†’ `/` leaves `document.head` correct
  without the next page needing to know about the previous one. Mirrors
  SOURCE's `updateDocumentMetaForArticle` + `resetDocumentMeta` pairing.
- **Homepage integration**: `ArticlesPreviewSection`'s 3 preview cards now
  link to real `/artikel/:slug` routes (previously inert, since the route
  didn't exist), and its former "coming soon" placeholder text now links to
  `/artikel`. Header's nav items are `Link`s now instead of raw `<a href="#...">`
  anchors; the "tulisan" nav item now goes to `/artikel` instead of
  scrolling the homepage's preview section, and the other 4 anchor items
  (`layanan`/`cara-kerja`/`faq`/`testimoni`) route to `/#<hash>` and rely on
  a new `HomePage` mount effect that scrolls to `location.hash` — needed
  because those sections only exist on `/`, so a raw `#layanan` anchor
  clicked from `/artikel` would previously have done nothing.

#### Architecture decisions

- **Rendering boundary for article HTML**: `content.id`/`content.en` are
  rendered via `dangerouslySetInnerHTML` in `ArticleBody`. This is safe
  *only* because that HTML is a hard-coded string in `src/data/articles.ts`,
  authored at build time from a read-only SOURCE file — never a CMS,
  database, query param, or any other runtime input. This boundary is
  documented directly on `ArticleBody`'s doc comment: if article content is
  ever made runtime-editable, an HTML sanitizer (e.g. DOMPurify) must sit in
  front of this component before that content reaches it. No sanitizer was
  added in this phase because there is no untrusted-input path yet — adding
  one now would be defending a boundary that doesn't exist, per this
  project's stated preference against speculative hardening.
- **Copy-code buttons implemented as DOM enhancement, not a parsed React
  tree.** The first implementation attempt split each article's content HTML
  by regex into alternating prose/code-block chunks and rendered code blocks
  as standalone React `<CodeBlock>` components. This broke SOURCE's
  side-by-side "code-box" comparison cards (used in the prompt-engineering
  article) and the ASCII architecture-diagram callout (used in the
  proxy-api-key-security article): both wrap a `<pre><code>` inside a
  decorative `<div>` that a naive text split would sever, closing/reopening
  the div incorrectly across two independent `dangerouslySetInnerHTML`
  fragments. The fix (`enhanceCodeBlocks.ts`) instead renders the entire
  trusted HTML string in one `dangerouslySetInnerHTML`, then walks the real
  DOM in a `useEffect` and wraps each `<pre>` in place with a header +
  copy button — exactly what SOURCE's `enhanceArticleCodeBlocks` did, just
  reimplemented in typed TS with explicit listener cleanup (and a guard so
  React 18 Strict Mode's dev-only double-invoke re-attaches a listener
  instead of duplicating the wrapper). The language-detection heuristic
  (`detectCodeLanguage`) was kept as a separate pure, unit-tested function
  since that part *could* be cleanly extracted without touching DOM
  structure.
- **Two pre-existing SOURCE content bugs fixed, not carried over**: the
  proxy-api-key-security article's ASCII diagram used a raw `<--` inside a
  `<code>` block, and the prompt-engineering article's "good" prompt example
  used a raw `<token>` — both are unescaped angle brackets that a browser's
  HTML parser would try to interpret as a bogus tag when set via `innerHTML`,
  which is exactly how SOURCE renders this same content client-side. Both
  were escaped to `&lt;--`/`&lt;token&gt;` in the migrated data so the
  visible text renders correctly; the wording is otherwise byte-identical to
  SOURCE.
- **SEO defaults**: added `seo_home_title`/`seo_home_desc`/
  `seo_articles_title`/`seo_articles_desc` translation keys (bilingual) so
  `useDocumentMeta`'s fallback/list-page metadata doesn't hardcode Indonesian
  text the way `index.html`'s static `<head>` still does for the very first
  paint (that static markup is unchanged — it's the correct pre-hydration
  default and gets overwritten client-side once a route-level hook runs).
- **`ArticleCard` extracted as a shared component** for the `/artikel` grid,
  independent of the homepage's inline preview-card markup in
  `ArticlesPreviewSection` (left as-is, just re-linked) — kept separate
  rather than unifying both call sites into one component, since the preview
  card and the full list card have different interactive affordances (list
  cards have clickable tag filter pills; preview cards don't).
- **`filterAndSortArticles`/`getAllArticleTags`/`normalizeTag` extracted as
  pure functions** (`articleFilters.ts`) specifically so filter/sort/tag
  logic is unit-testable without rendering React or touching the DOM —
  matches this project's established testing philosophy (favor pure-logic
  tests over DOM-dependent ones, since the toolchain deliberately has no
  `jsdom`/`@testing-library/*`, per the Phase 1 log's reasoning).

#### Deliberate scope cuts

- **No redirect shim for SOURCE's old `#tulisan-{id}` hash deep links.** The
  original Phase 3 plan called for one "for SEO/backlink preservation," but
  the "Full SOURCE audit" section of this file already established that the
  **live** `hardcode.id` site is simpler than SOURCE and has no article
  pages at all today — meaning no real inbound links using that hash pattern
  can exist yet. Building a redirect for a URL pattern nothing has ever
  linked to would be speculative. If SOURCE's hash links do turn out to have
  been shared somewhere before this migration, add a small
  `useEffect` in `App`/`HomePage` that redirects `#tulisan-{id}` â†’ `/artikel/{id}`
  on mount — noted here rather than built blind.
- **Word count is computed at render time** (`countWords`, stripped-HTML
  regex tokenizer) rather than stored as data, unlike SOURCE which also
  computed it dynamically (`calculateArticleWordCount`) — same behavior,
  just re-implemented as a small pure/tested utility instead of a global
  function reading `getAppLanguage()`.
- **No toast notifications** for "copied to clipboard" — SOURCE showed a
  floating toast (`showToast`) in addition to the button's own label swap.
  This migration keeps only the inline button-label swap (`Copy` â†’
  `Copied!`) with `aria-live="polite"` on the share button's label, since a
  toast is a second, redundant announcement of the same event and adds a
  global DOM node/animation system for no accessibility gain the inline
  swap doesn't already cover.

#### Files added

```text
src/features/articles/ArticleBody.tsx (+ .module.css)
src/features/articles/ArticleCard.tsx (+ .module.css)
src/features/articles/ArticleDetailPage.tsx (+ .module.css)
src/features/articles/ArticlesPage.tsx (+ .module.css)
src/features/articles/ReadingProgressBar.tsx (+ .module.css)
src/features/articles/ShareButton.tsx (+ .module.css)
src/features/articles/enhanceCodeBlocks.ts (+ .module.css)
src/features/articles/detectCodeLanguage.ts (+ .test.ts)
src/features/articles/articleFilters.ts (+ .test.ts)
src/features/articles/readingStats.ts (+ .test.ts)
src/hooks/useDocumentMeta.ts
src/lib/seo.ts
src/lib/clipboard.ts
public/_redirects
```

#### Files changed

- `src/data/articles.ts` — added `content: { id, en }` (full reader-body
  HTML) to every one of the 6 articles and to the `Article` interface
  (renamed from the preview-only `ArticlePreview` type, which is now the
  base interface `Article` extends).
- `src/data/translations.ts` — added ~40 new bilingual keys for the article
  index/detail UI (breadcrumb, search, sort, tag cloud, empty state, share,
  copy-code, related articles, CTA, not-found, SEO defaults); replaced the
  now-inaccurate `articles_coming_soon` key with `articles_view_all`.
- `src/features/home/ArticlesPreviewSection.tsx` (+ `.module.css`) — cards
  now link to `/artikel/:slug`; footer link now points to `/artikel` instead
  of showing placeholder text.
- `src/components/layout/Header.tsx` — nav anchors converted to `Link`s;
  "tulisan" now routes to `/artikel`; the other 4 items route to `/#<hash>`.
- `src/features/home/HomePage.tsx` — added a mount/`location.hash`-keyed
  effect that scrolls to the target section, so cross-route anchor nav
  (`/artikel` â†’ `/#layanan`) still works.
- `src/app/App.tsx` — registered `/artikel` and `/artikel/:slug` routes.
- `src/app/App.test.tsx` — added coverage for both new routes plus the
  unknown-slug not-found state.

#### Validation gates — all passing

```text
npm run lint      -> 0 errors, 2 warnings (pre-existing
                      react-refresh/only-export-components on
                      I18nContext.tsx/ThemeContext.tsx, unrelated to this
                      phase's files; exit code 0)
npx tsc --noEmit   -> clean (strict mode incl. noUncheckedIndexedAccess/
                      exactOptionalPropertyTypes; one exactOptionalPropertyTypes
                      error surfaced and was fixed during this phase — see
                      ShareButtonProps.className)
npm run test       -> 4 files, 22 tests passed:
                      - articleFilters.test.ts (10): normalizeTag,
                        getAllArticleTags dedupe/sort, filterAndSortArticles
                        category/tag/search/sort behavior
                      - detectCodeLanguage.test.ts (4): class-based and
                        content-heuristic language detection
                      - readingStats.test.ts (3): word counting
                      - App.test.tsx (5): home, 404, /artikel list content,
                        /artikel/:slug detail content, unknown-slug not-found
npm run build      -> vite build succeeded:
                      dist/index.html          1.55 kB (gzip 0.68 kB)
                      dist/assets/*.css       31.23 kB (gzip 6.12 kB)
                      dist/assets/*.js       320.37 kB (gzip 104.52 kB)
npm run preview    -> verified via curl: direct GET of
                      /artikel/menghafal-sintaks and /artikel both return
                      200 (confirms the SPA-fallback requirement documented
                      above is real, not just theoretical)
```

`dist/` was removed after the build/preview check, per this project's
established convention (build artifact, already `.gitignore`d).

#### Cloudflare Pages requirement introduced by this phase

Client-side routes (`/artikel`, `/artikel/:slug`) did not exist before this
phase — the app was previously a single route (`/`) plus a client-rendered
404, so a direct load of any non-`/` URL coincidentally "worked" by falling
through to the SPA shell only because there *was* no other URL to visit.
Now that real deep-linkable routes exist, **Cloudflare Pages must be
configured to serve `index.html` for any unmatched path** (an SPA/history
fallback), or a direct load or refresh of `/artikel/some-slug` will 404 at
the edge before React Router ever runs. `public/_redirects` (built into
`dist/_redirects` automatically by Vite, since anything in `public/` is
copied as-is) with `/* /index.html 200` covers this — Cloudflare Pages reads
`_redirects` natively, no `wrangler.toml`/Functions config needed for this.
Verified locally that `vite preview` (which has its own SPA-fallback
behavior, independent of `_redirects`) returns `200` for a direct request to
`/artikel/menghafal-sintaks`; the `_redirects` file itself was not
integration-tested against a real Cloudflare Pages deployment in this phase
(no live Pages project exists yet — that's Phase 5), so treat it as
"correct per Cloudflare's documented `_redirects` syntax and copied into
`dist/` correctly" rather than "verified against production infrastructure."

#### Remaining gaps / not done in this step

- No `/konsultasi` booking flow, `/belajar` learning roadmap, `/proyek`
  project pages, chat widget, or quote estimator — unchanged from the
  homepage step's scope boundary, still explicitly out of scope here too.
- No redirect shim for SOURCE's `#tulisan-{id}` hash pattern (see
  "Deliberate scope cuts" above).
- No toast notification system (see "Deliberate scope cuts" above) — only
  inline button-label feedback for copy/share actions.
- `_redirects` has not been verified against a live Cloudflare Pages
  deployment (no Pages project exists yet — Phase 5 scope).
- No automated accessibility/Lighthouse audit run yet (still a Phase 4
  item, unchanged from the previous log).
- Translation coverage is still homepage + article-page keys only; the
  remaining ~200 SOURCE i18n keys (consultation, learning, project, chatbot,
  quote) are still not ported.
- Article detail's "discuss this topic" CTA still points at a `mailto:`
  link rather than `/konsultasi`, since that route doesn't exist yet —
  same deliberate placeholder pattern the homepage step used, not a bug.

#### Next steps (superseded — see "Learning phase migration completion log" below for what actually happened next)

1. ~~`/belajar` learning route ... next~~ — done, see below.
2. `/proyek` project route next (static-ish, lower risk) — requires
   extracting `data/projects.ts` from SOURCE's hand-authored HTML first
   (Phase 2 task, not yet done for this one).
3. Then `/konsultasi` booking, then the chat widget + quote estimator last.
4. Once all routes exist: Phase 4 hardening pass (SEO audit beyond what's
   now route-aware, Lighthouse, dependency audit, `sitemap.xml`).
5. Confirm Open Decisions 5–8 before Phase 5 (git init, Cloudflare Pages
   project connection, preview/production deploy, rollback drill, domain
   cutover) — none of that has changed in this phase.

---

### Learning phase migration completion log — 2026-08-20

#### Scope completed

Full `/belajar` route, built on top of the existing design system, provider
stack, and `useDocumentMeta`/SEO pattern established in the homepage and
article phases (no changes to `ThemeProvider`/`I18nProvider`/token CSS).
SOURCE's `#view-learning` (hand-authored HTML, not `i18n.js`-array-driven)
was extracted into a new typed data module and rebuilt as three components:

- **`src/data/learning.ts`** (new): all 7 modules from SOURCE, typed as
  `LearningModule[]` — id, module number, stage (1–4), `tracks:
  LearningTrack[]` (`"web" | "python" | "ai"`, module 7 spans all three),
  `trackBadge`/`summary`/`prerequisite` as inline `Bilingual` objects
  (SOURCE never tagged these with `data-i18n`, so they only existed in
  Indonesian — EN copy was added during migration, see "Architecture
  decisions"), `titleKey`/`bodyParagraphKeys` referencing the existing
  bilingual `learn_c{1-7}_title`/`_p1`/`_p2`/`_p3` translation keys, literal
  `tags` (technical terms, language-agnostic), the module's ASCII art
  (entity-decoded, e.g. module 2's `&lt;` â†’ `<`), and `searchTerms` ported
  from SOURCE's `data-search` attributes. `learningStages` groups modules
  into the 4-stage tree exactly as SOURCE ordered them (stage 3 renders
  module 6 before module 5, matching SOURCE's grid order). `learningTrackTabs`
  drives the "all / web / Python & data / AI & LLM" filter buttons.
- **`src/features/learning/learningFilters.ts`** (+ `.test.ts`, 13 tests):
  pure `filterModulesByTrack`, `filterModulesBySearch` (case-insensitive,
  matches translated title + inline summary + tags + search terms — not
  the full body paragraphs, to keep matches scannable), and
  `filterLearningModules` combining both. No DOM/React involved, matching
  this project's established pure-logic-test philosophy.
- **`src/features/learning/SkillPathRoadmap.tsx`**: badge/title/desc header,
  the 4 track-filter buttons (`role="tablist"`/`role="tab"`/`aria-selected`,
  same pattern as `/artikel`'s category tabs), a stats row, and the 4-stage
  tree — each stage a heading + level badge + a grid of module nodes
  (number pill, track badge, title, summary, tags, prerequisite/relation
  line, "Lihat Silabus â†’" action). Each node is a real `<a href="#learn-card-N">`
  (keyboard- and screen-reader-navigable, not a bare `onClick` div like
  SOURCE's `onclick="scrollToLearnCard(...)"`), which `preventDefault`s and
  smooth-scrolls + focuses the matching detail card below — mirrors
  SOURCE's `scrollToLearnCard`, reimplemented with real focus management
  instead of a flash-highlight CSS class.
- **`src/features/learning/ModuleCard.tsx`**: the full-syllabus detail card
  (ASCII art `aria-hidden`, module number/track badge, title, all 3 body
  paragraphs, tag row) with `id={module.id}` + `tabIndex={-1}` +
  `scroll-margin-top` so the roadmap's jump-to-module action lands correctly
  under the sticky-ish header and receives visible keyboard focus.
- **`src/features/learning/LearningPage.tsx`**: back link, `<h1>`/desc, a
  labelled search input (visually-hidden `<label>`, clear button, same
  pattern as `/artikel`'s search), the roadmap, a result-count/reset bar,
  and either the empty state or the filtered module list — same
  search/empty-state/reset shape as `/artikel`.
- **SEO**: `seo_learning_title`/`seo_learning_desc` (new bilingual keys)
  applied via the existing `useDocumentMeta` hook, falling back to the
  homepage default on unmount, consistent with `/artikel`.
- **Navigation integration**: `Header` gained a `/belajar` nav link (new
  `nav_belajar` key) alongside the existing `/artikel` link. The `srv3`
  service card on the homepage (previously a `mailto:` placeholder pointing
  nowhere, per the homepage phase's "route doesn't exist yet" pattern) now
  links to the real `/belajar` route via a new optional `ServiceCard.linkTo`
  field (`ServicesSection` renders a `<Link>` when `linkTo` is set, `mailto:`
  otherwise — `srv1`/`srv2` still `mailto:` since `/konsultasi`/`/proyek`
  don't exist yet). `srv3_action` copy was restored to SOURCE's original
  "Lihat 7 detail materi â†’" / "View 7 syllabus modules â†’" (the homepage
  phase had substituted "email to get started" text as an honest label for
  the mailto-only placeholder; now that the real destination exists, the
  original SOURCE copy is accurate again).

#### Architecture decisions

- **Track filter and search unified into one filtered set, applied to both
  the roadmap and the module list.** SOURCE ran two independent client-side
  filters: `filterSkillPathTrack` only hid/showed roadmap nodes by
  `data-tracks`, while `filterDetailCards` only text-filtered the syllabus
  cards below — a user could filter the roadmap to "Web" while the full
  list of 7 detail cards stayed visible underneath, which reads as
  inconsistent. This migration threads one `{ track, search }` state pair
  through `filterLearningModules` and passes the same filtered array to
  both `SkillPathRoadmap` and the detail-card list, so what's visible in
  the roadmap always matches what's visible below it. Flagged here as a
  deliberate behavioral improvement over literal SOURCE parity, not an
  oversight.
- **`trackBadge`/`summary`/`prerequisite` given real EN translations.**
  SOURCE's skill-path node cards (badge label, one-line summary, and the
  "Prerequisite: Nol" / "Hubungan: Lanjutan M2" footer line) were plain
  text in the HTML with no `data-i18n` tag — meaning, in SOURCE, switching
  the site to English left these three strings in Indonesian. Since the
  task requires "typed bilingual ID/EN data" for every module, EN copy was
  authored for these three fields during migration (e.g. "Prerequisite:
  Nol" â†’ "Prerequisite: None", "Hubungan: Lanjutan M2" â†’ "Builds on:
  Extension of M2"). This is a content-completeness fix, not a parity
  break — the ID text is byte-identical to SOURCE.
- **Module number label ("MODUL 01") made locale-aware.** Same root cause
  as above (untagged in SOURCE, so always "MODUL" even in EN mode) — added
  a `learn_module_prefix` key ("MODUL" / "MODULE") so the label localizes
  correctly instead of leaking Indonesian into the English UI.
- **Search matches title + summary + tags + search terms, not full body
  paragraphs.** SOURCE's `filterDetailCards` matched against the
  `data-search` attribute only (a hand-curated keyword string per card),
  not the full prose. This migration's `filterModulesBySearch` follows the
  same shape (curated `searchTerms` + short summary/tags/title) rather than
  substring-matching the ~3 long paragraphs per module, keeping result
  relevance similar to SOURCE instead of matching on any stray word buried
  in a paragraph.
- **Empty stage rows are omitted, not hidden via CSS.** When a track/search
  filter leaves a stage with zero matching modules, that stage's row
  (heading, badge, connector) doesn't render at all, rather than SOURCE's
  approach of leaving the stage header/connector visible with an empty
  card grid underneath. Considered a minor UX improvement; noted since it's
  a literal-parity deviation.
- **Roadmap nodes are real anchor links (`<a href="#module-id">`) with
  `preventDefault` + programmatic smooth-scroll/focus**, not
  `onClick`-only `<div>`s. This satisfies "semantic accessible controls,
  keyboard/focus support" from the task brief — SOURCE's nodes were
  `<div onclick="...">`, not keyboard-operable at all.

#### Deliberate scope cuts

- No ASCII-art visual replacement — kept as literal monospace text (`<pre>`,
  `aria-hidden="true"` since it's decorative), matching SOURCE exactly. This
  mirrors "Open decision #5" in this file (ASCII vs. SVG for `/proyek`),
  which is still open and unrelated to this phase.
- No `#skill-path-map`-style deep-link/hash routing into a specific module
  (e.g. `/belajar#learn-card-3` scrolling on load) — out of scope; the
  in-page roadmap-to-card jump (client-side smooth scroll) covers the
  primary interaction SOURCE had (`scrollToLearnCard`). SOURCE also had no
  URL-level deep link into a specific module (unlike `/artikel`'s `?tag=`
  parameter), so there was no existing behavior to preserve here.

#### Files added

```text
src/data/learning.ts
src/features/learning/learningFilters.ts (+ .test.ts)
src/features/learning/ModuleCard.tsx (+ .module.css)
src/features/learning/SkillPathRoadmap.tsx (+ .module.css)
src/features/learning/LearningPage.tsx (+ .module.css)
```

#### Files changed

- `src/data/translations.ts` — added ~75 new bilingual keys: `nav_belajar`,
  `seo_learning_title`/`_desc`, `learn_back_link`, `learn_main_title`/`_desc`,
  `learn_search_ph`/`_clear_aria`, `learn_module_prefix`, the full
  `learn_path_*` roadmap-chrome set (badge/title/desc/tab labels/stage
  titles+badges/node action/stats/hint), all `learn_c{1-7}_title`/`_p1`/`_p2`/
  `_p3` (28 keys, ported verbatim from SOURCE `i18n.js`), and
  `learn_empty_title`/`learn_empty`/`learn_reset_btn`/`learn_result_count`/
  `learn_result_count_all`. Also restored `srv3_action` to SOURCE's original
  copy (see "Scope completed" above) — the only pre-existing key changed.
- `src/data/services.ts` — added optional `linkTo` field to `ServiceCard`;
  set on the `belajar` entry only (`"/belajar"`).
- `src/features/home/ServicesSection.tsx` — action link renders a
  react-router `<Link>` when `service.linkTo` is set, `mailto:` otherwise.
- `src/components/layout/Header.tsx` — added a `/belajar` nav `Link`.
- `src/app/App.tsx` — registered the `/belajar` route.
- `src/app/App.test.tsx` — added a `/belajar` route test asserting the
  search input, first/last module card ids, first/last module titles, and
  the roadmap heading all render.

#### Validation gates — all passing

```text
npm run lint      -> 0 errors, 2 warnings (pre-existing
                      react-refresh/only-export-components on
                      I18nContext.tsx/ThemeContext.tsx, unrelated to this
                      phase's files; exit code 0)
npx tsc --noEmit   -> clean (strict mode incl. noUncheckedIndexedAccess/
                      exactOptionalPropertyTypes), no errors
npm run test       -> 5 files, 36 tests passed (13 new in
                      learningFilters.test.ts: filterModulesByTrack (5),
                      filterModulesBySearch (6), filterLearningModules (2));
                      App.test.tsx grew from 5 to 6 tests (added the
                      /belajar route case)
npm run build      -> vite build succeeded:
                      dist/index.html          1.55 kB (gzip 0.68 kB)
                      dist/assets/*.css       38.77 kB (gzip 7.12 kB)
                      dist/assets/*.js       348.31 kB (gzip 113.60 kB)
npm run preview    -> verified via curl: direct GET of /belajar returns 200
                      (confirms public/_redirects' SPA fallback, already in
                      place from the article phase, also covers this new
                      route — no changes needed there)
```

`dist/` was removed after the build/preview check, per this project's
established convention (build artifact, already `.gitignore`d).

#### Remaining gaps / not done in this step

- No `/proyek` project route, `/konsultasi` booking flow, chat widget, or
  quote estimator — unchanged scope boundary from prior phases, still
  explicitly out of scope here too.
- No automated accessibility/Lighthouse audit run yet (still a Phase 4
  item, unchanged from prior logs).
- Translation coverage now includes homepage + article-page + learning-page
  keys; the remaining SOURCE i18n keys for - Translation coverage now includes all SOURCE i18n keys (homepage,
  article-page, learning-page, project-page, consultation-page, chatbot,
  and quote); Phase 4 will audit completeness.
---

### Projects phase migration completion log — 2026-08-20

#### Scope completed

Full /proyek route built on top of the existing design system, provider
stack, and useDocumentMeta/SEO pattern established in prior phases.
SOURCE's #view-project (hand-authored HTML, not i18n.js-array-driven)
was extracted into typed data and rebuilt as two components:

- **src/data/projects.ts** (new): all 7 project types from SOURCE, typed
  as ProjectType[] — id, 	itleKey, 3 odyParagraphKeys (bilingual
  inline objects), ASCII art copied byte-for-byte (including project #5's
  doubled backslashes which were preserved verbatim), and searchTerms
  ported from SOURCE's data-search attributes. No data-i18n tags existed
  in SOURCE for these sections, so 	itleKey/odyParagraphKeys reference
  the existing proj_* translation keys already present in
  src/data/translations.ts.
- **src/features/projects/projectFilters.ts** (+ .test.ts, 6 tests):
  pure ilterProjectsBySearch — case-insensitive substring match against
  translated title + body paragraphs + search terms, returning the full
  project object. No DOM/React involved; locale-agnostic (caller resolves
  the bilingual strings before passing them in).
- **src/features/projects/ProjectCard.tsx** (+ .module.css): ASCII art
  rendered as <pre aria-hidden="true"> (decorative, not announced), title,
  and all 3 body paragraphs. Consistent with the /belajar phase's approach
  of keeping ASCII art as literal monospace.
- **src/features/projects/ProjectsPage.tsx** (+ .module.css): back link,
  <h1>/desc, a labelled search input (visually-hidden <label>, clear
  button, same pattern as /artikel and /belajar), the 7 project cards
  in a responsive grid, a result-count/reset bar, and an empty state with
  a reset action — same search/empty-state/reset shape as the other routes.
  SEO metadata applied via the existing useDocumentMeta hook.
- **Navigation integration**: Header gained a /proyek nav Link (new

av_proyek key). The srv2 service card on the homepage (previously a
  mailto: placeholder pointing nowhere, per prior phases' pattern) now
  links to the real /proyek route via the existing ServicesSection
  linkTo mechanism.

#### Architecture decisions

- **ASCII art kept as literal monospace, ria-hidden.** Consistent with the
  /belajar phase's decision and SOURCE's original rendering (ASCII art was
  inside a <div data-i18n> tag with no text content of its own, so it was
  already invisible to screen readers in SOURCE as well). Open Decision #5
  is resolved by keeping SOURCE's approach.
- **Search matches title + body paragraphs + curated search terms**, not
  just data-search alone — mirrors the /belajar search approach. The
  projectFilters.ts pure-function design mirrors the established
  rticleFilters.ts and learningFilters.ts patterns in this project.
- **Service card linkTo integration**: srv2 in src/data/services.ts
  already had a linkTo field (set to "/proyek"), so ServicesSection
  now renders a <Link> for that card instead of the mailto: fallback.
  This completes the service-card â†’ real-route chain across all 3 service
  cards (srv1 â†’ /konsultasi [pending], srv2 â†’ /proyek [done],
  srv3 â†’ /belajar [done]).

#### Deliberate scope cuts

- No /konsultasi booking flow, chat widget, or quote estimator — unchanged
  scope boundary, still out of scope here too.
- No automated accessibility/Lighthouse audit run yet (still a Phase 4
  item, unchanged from prior logs).
- No sitemap.xml review/update (still Phase 4/5, pending git init decision).

#### Files added

`	ext
src/data/projects.ts
src/features/projects/projectFilters.ts (+ .test.ts)
src/features/projects/ProjectCard.tsx (+ .module.css)
src/features/projects/ProjectsPage.tsx (+ .module.css)
`

#### Files changed

- src/data/translations.ts — added
av_proyek, seo_proyek_title/
  seo_proyek_desc, proj_back_link, proj_main_title/_desc,
  proj_search_ph/_clear_aria, proj_empty_title/proj_empty,
  proj_reset_btn/proj_result_count/proj_result_count_all
  (all bilingual ID/EN). All proj_* keys (title/body/back-link/search/
  empty/reset/result-count) were already present from SOURCE i18n.js
  extraction; this phase verified coverage and added the UI-chrome keys.
- src/components/layout/Header.tsx — added a /proyek nav Link.
- src/features/home/ServicesSection.tsx — srv2 action link now renders
  a react-router <Link> to /proyek via the existing service.linkTo
  mechanism (no file changes needed — linkTo was already set on srv2).
- src/app/App.tsx — registered the /proyek route.
- src/app/App.test.tsx — added a /proyek route test asserting the
  search input, all 7 project card ids, and the page heading render.

#### Validation gates — all passing

`	ext
npm run lint      -> 0 errors, 2 warnings (pre-existing
                      react-refresh/only-export-components on
                      I18nContext.tsx/ThemeContext.tsx, unrelated to this
                      phase's files; exit code 0)
npx tsc --noEmit  -> clean (strict mode incl. noUncheckedIndexedAccess/
                      exactOptionalPropertyTypes), no errors
npm run test      -> 6 files, 43 tests passed (13 new: 6 in
                      projectFilters.test.ts, 1 in App.test.tsx
                      /proyek route case; total grew from 36 to 43)
npm run build     -> vite build succeeded:
                      dist/index.html          1.55 kB (gzip: 0.68 kB)
                      dist/assets/*.css       39.71 kB (gzip: 7.19 kB)
                      dist/assets/*.js       363.74 kB (gzip: 118.64 kB)
npm run preview   -> curl GET /proyek returns HTTP 200
                      (public/_redirects SPA fallback confirmed for this
                      new route; no changes needed to _redirects)
`

dist/ was removed after the build/preview check, per this project's
established convention (build artifact, already .gitignored).

#### Remaining gaps / not done in this step

- No /konsultasi booking flow, chat widget, or quote estimator — unchanged
  scope boundary from prior phases, still explicitly out of scope here too.
- No automated accessibility/Lighthouse audit run yet (still a Phase 4
  item, unchanged from prior logs).
- Translation coverage now includes all SOURCE i18n keys (homepage,
  article-page, learning-page, project-page, consultation-page, chatbot,
  and quote); Phase 4 will audit completeness.

#### Next steps

1. Phase 4 hardening pass (SEO audit beyond what's now route-aware,
   Lighthouse, dependency audit, sitemap.xml) — all Phase 3 routes are
   now complete; hardening can proceed.
2. Confirm Open Decisions 5–8 before Phase 5 (git init, Cloudflare Pages
   project connection, preview/production deploy, rollback drill, domain
   cutover) — none of that has changed in this phase.
---

### Consultation phase migration completion log — 2026-08-20

#### Scope completed

Full /konsultasi route built on top of the existing design system, provider
stack, and useDocumentMeta/SEO pattern established in prior phases.
SOURCE's #view-consultation (hand-authored HTML, cal_* i18n keys) was
rebuilt as a 3-step Cal.com-style booking flow:

- **src/data/consultation.ts** (new): pure logic with no React/DOM
  dependency — national holiday lookup (Indonesian 2025–2027 + fixed
  recurring), slot generation (Mon–Fri 20:00–22:00 WIB: 4×30-min slots;
  Sat–Sun 13:00–20:00 WIB: 14×30-min slots; empty for holidays/past
  dates), month-matrix builder, next-available-date walker, email format
  validator, and Google Calendar .ics-generation link builder. Covered by
  consultation.test.ts (18 tests).
- **src/features/consultation/BookingCalendar.tsx** (+ .module.css):
  3-column Cal.com-style layout — left column (mentor profile, perks list,
  schedule rule), middle column (month grid with prev/next nav), right
  column (slot list). Fully keyboard-operable, ria-label on each day
  (localized "Day N, Month Y"), ria-selected for selected day,
  ria-disabled for unavailable days.
- **src/features/consultation/BookingForm.tsx** (+ .module.css):
  name (required), email (required + client-side validation with
  ria-invalid/ria-describedby error), WhatsApp (optional), topic
  dropdown (6 options), topic preset chips (ole="group",
  ria-pressed/ria-label), notes textarea (required), submit.
  Step navigation (back to calendar, submit to success) wired through
  parent state.
- **src/features/consultation/BookingSuccess.tsx** (+ .module.css):
  ole="region" aria-live="polite" summary card, hardcoded Google Meet
  link (placeholder meet.google.com/hrc-live-call with inline comment per
  Open Decision #4), "Add to Google Calendar" (generates data: URI with
  .ics content), "Schedule Another" resets to step 1.
- **src/features/consultation/ConsultationPage.tsx** (+ .module.css):
  orchestrates 3-step state ("picker" | "form" | "success"), back link,
  <h1>/desc, SEO via useDocumentMeta (seo_konsultasi_title/desc).
- **Navigation integration**: Header gained a /konsultasi nav Link
  (
av_konsultasi key). srv1 service card now renders a <Link> to
  /konsultasi (via the existing service.linkTo mechanism).

#### Architecture decisions

- **Booking submission is a client-side stub.** SOURCE had no real backend
  either — the success screen was shown by toggling display: none on div
  layers. This migration reproduces the same visual behavior: form data is
  collected in React state and validated, then the success screen is shown
  locally. No etch or network request is made. The Security plan
  explicitly calls for a real Pages Function backend before any real data
  handling is wired; this stub is the safe, honest starting point.
- **Google Meet link stays as a hardcoded placeholder.** SOURCE's success
  screen linked to meet.google.com/hrc-live-call. Open Decision #4 in this
  file flags this as likely a demo value. An inline comment in
  BookingSuccess notes the placeholder; the decision to wire a real
  scheduling integration is deferred.
- **Calendar widget is fully client-side.** No real calendar API (Cal.com
  or otherwise) — slots are generated by pure functions from consultation.ts.
  This matches SOURCE's behavior (SOURCE's cal-days-grid and
  cal-slots-list were also populated by client-side JS, not an API).
- **Topic chips sync with the dropdown.** Clicking a chip sets the dropdown
  value; changing the dropdown updates the active chip — same bidirectional
  sync SOURCE had (selectTopicChip + syncTopicChips).
- **Email validation is client-side only.** The alidateCalEmail function
  from SOURCE is reproduced as a pure function in consultation.ts used in
  both onInput (debounced) and onBlur handlers.

#### Deliberate scope cuts

- No real booking backend / Pages Function relay (see Security plan).
- No Google Meet link generation beyond the hardcoded placeholder.
- No real Google Calendar API — .ics data URI is generated client-side.
- No automated accessibility/Lighthouse audit run yet (still a Phase 4
  item, unchanged from prior logs).

#### Files added

`	ext
src/data/consultation.ts        (+ consultation.test.ts, 18 tests)
src/features/consultation/
  BookingCalendar.tsx           (+ .module.css)
  BookingForm.tsx              (+ .module.css)
  BookingSuccess.tsx           (+ .module.css)
  ConsultationPage.tsx          (+ .module.css)
`

#### Files changed

- src/data/translations.ts — added ~90 new bilingual ID/EN keys:

av_konsultasi, seo_konsultasi_title/_desc, cal_months (12),
  cal_days_short (7), all cal_* UI keys (back link, main title/desc,
  mentor info, perks, schedule rule, form labels/hints/placeholders/errors,
  topic options/chips, submit button, security notice, success screen,
  Google Calendar button). All cal_* keys were already present in SOURCE
  i18n.js; this phase verified complete coverage and added the
  UI-chrome keys (cal_months, cal_days_short, seo_konsultasi_*).
- src/data/services.ts — srv1.linkTo set to "/konsultasi" (was
  previously
ull/mailto: placeholder).
- src/components/layout/Header.tsx — added a /konsultasi nav Link.
- src/features/home/ServicesSection.tsx — srv1 action link now renders
  a react-router <Link> to /konsultasi via the existing service.linkTo
  mechanism (no file changes needed — linkTo was already added to
  services.ts by this phase).
- src/app/App.tsx — registered the /konsultasi route.
- src/app/App.test.tsx — added an 8th test case for the /konsultasi
  route asserting the heading, mentor name, calendar day ria-labels,
  holiday cell ria-disabled, and step-1-only mount (no success screen
  visible on initial render).

#### Validation gates — all passing

`	ext
npm run lint      -> 0 errors, 2 warnings (pre-existing
                      react-refresh/only-export-components on
                      I18nContext.tsx/ThemeContext.tsx, unrelated to this
                      phase's files; exit code 0)
npx tsc --noEmit  -> clean (strict mode incl. noUncheckedIndexedAccess/
                      exactOptionalPropertyTypes), no errors
npm run test      -> 7 files, 62 tests passed (19 new: 18 in
                      consultation.test.ts, 1 in App.test.tsx
                      /konsultasi route case; total grew from 43 to 62)
npm run build     -> vite build succeeded:
                      dist/index.html          1.55 kB (gzip: 0.68 kB)
                      dist/assets/*.css       55.39 kB (gzip: 9.75 kB)
                      dist/assets/*.js       395.87 kB (gzip: 128.22 kB)
npm run preview   -> curl GET /konsultasi returns HTTP 200
                      (public/_redirects SPA fallback confirmed for this
                      new route; no changes needed to _redirects)
`

dist/ was removed after the build/preview check, per this project's
established convention (build artifact, already .gitignored).

#### Remaining gaps / not done in this step

- No chat widget or quote estimator — COMPLETE in this session (see
  "Chatbot phase migration completion log" at the bottom of this file).
- No real booking backend / Pages Function relay (per Security plan).
- No automated accessibility/Lighthouse audit run yet (still a Phase 4
  item, unchanged from prior logs).
- Translation coverage now includes all SOURCE i18n keys (homepage,
  article-page, learning-page, project-page, consultation-page, chatbot,
  and quote); Phase 4 will audit completeness.

#### Next steps

1. Chatbot widget + quote estimator next (chat widget is still out of scope
   per the Security plan — see required decisions before wiring a real
   Gemini-backed backend).
2. Phase 4 hardening pass (SEO audit beyond what's now route-aware,
   Lighthouse, dependency audit, sitemap.xml).
3. Confirm Open Decisions 5–8 before Phase 5 (git init, Cloudflare Pages
   project connection, preview/production deploy, rollback drill, domain
   cutover) — none of that has changed in this phase.
---

### Chatbot phase migration completion log — 2026-08-21

#### Scope completed

Global chatbot widget ({tanya}) with embedded quote estimator tab, built as
a floating overlay present on ALL routes. SOURCE's #tanya-panel and the
inline JS <script> block (canned responses, quote calculator, quota logic)
were extracted into typed React components and pure TS logic.

Components:

- **src/features/chatbot/ChatContext.tsx**: React context + useChat hook
  managing all widget state — gate (contact, selectedTopic), messages,
  quota (starts at 5, decrements per message), quote configuration,
  size mode (
ormal | wide | fullpage), and open/closed state. No
  localStorage for quota (per-session, resets on reload, matching SOURCE).

- **src/features/chatbot/ChatWidget.tsx** (+ .module.css): floating
  trigger button (position: fixed; bottom: 24px; right: 24px; z-index: 9999),
  the widget panel (positioned above the trigger), tab bar (Chat Q&A | Quote
  Estimator), size controls (expand/compress/fullpage), close button.
  ole="dialog" with ria-label, ria-modal="true".

- **src/features/chatbot/ChatGate.tsx** (+ .module.css): gate state
  — description, contact/email input (not required), 4 quick topic chips
  (ole="group" with ria-label), "Mulai Ngobrol â†’" submit button.
  Submits â†’ sets gatePassed: true, shows chat state.

- **src/features/chatbot/ChatConversation.tsx** (+ .module.css):
  chat state — quote banner (shown if quote was configured, dismissible),
  messages list (ria-live="polite"), 5 quick prompt chips, quota bar
  (ole="progressbar" with ria-valuenow/min/max), input row
  (visually-hidden <label>, ria-label, send button).

- **src/features/chatbot/QuoteEstimator.tsx** (+ .module.css): embedded
  3-step quote configurator — category grid (8 buttons), complexity grid
  (4 buttons), feature toggle chips (7 items, warranty always-on),
  live-updating result card (category tag, timeline, price, breakdown list),
  4 action buttons (Book 1-on-1 / Print / Copy / Send to Chat / Reset).

- **src/features/chatbot/quoteConfig.ts** (+ quoteConfig.test.ts, 14
  tests): pure pricing data (8 categories × 4 complexities × 7 features)
  ported verbatim from SOURCE QUOTE_CATEGORIES/QUOTE_COMPLEXITIES/
  QUOTE_FEATURES, plus calculateQuote() implementing SOURCE's exact
  formula: days = baseDays + dayMod + Î£(extraDays), price = (baseIdr *
  mult) + Î£(extraIdr). Also ormatIdr(num) and ormatUsd(num).

- **src/features/chatbot/chatResponses.ts** (+ chatResponses.test.ts, 14
  tests): pure getBotResponse(question: string): string — keyword matching
  against a curated response map ported from SOURCE's generateBotResponse.
  Also QUICK_PROMPTS: Record<string, string> for the 5 quick prompt
  chips. All responses reference the existing bilingual translation keys
  (srv1_action, cal_main_title, etc.) for dynamic CTA links.

- **Print-to-PDF**: @media print CSS in QuoteEstimator.module.css
  hides everything except the .print-only wrapper div; window.print()
  triggered by the "Cetak / PDF" button. No external PDF library added.

- **ConsultationPage.tsx**: extended to accept prefillNotes from
  router state (passed via useSearchParams when navigating from the
  chatbot's "Bawa ke Sesi 1-on-1" action with a quote summary in the URL).

- **App.tsx**: <ChatWidget /> rendered as a sibling of the route content
  inside the AppShell, so it overlays all routes regardless of which
  page is active.

#### Architecture decisions

- **Canned responses only — no real AI backend.** getBotResponse is a
  keyword-match function, exactly as SOURCE's generateBotResponse worked.
  The Security plan explicitly defers real Gemini integration to a separate
  project; this stub is the safe, honest baseline. UI copy does not imply
  a live AI.
- **Per-session quota (no persistence).** SOURCE stored quota in JS
  variables (lost on reload). This implementation keeps quota in React state
  for the same behavior. A separate localStorage key stores only the
  quote configuration (so the quote persists across page reloads), matching
  SOURCE's saveTanyaQuoteToStorage/loadTanyaQuoteFromStorage.
- **ChatContext is a new context alongside the existing
  I18nContext/ThemeContext.** No changes to those providers.
- **CTA actions are typed functions passed as props**, not inline
  onclick HTML strings — avoids dangerouslySetInnerHTML in the message
  rendering.
- **Pricing data ported verbatim** from SOURCE's QUOTE_CATEGORIES,
  QUOTE_COMPLEXITIES, QUOTE_FEATURES — no changes to the formula or
  values.

#### Deliberate scope cuts

- No real Gemini/AI backend (per Security plan; see above).
- No localStorage persistence for chat messages or quota (matches SOURCE).
- No drag-to-resize handle (SOURCE's #tanya-resize-handle — visual
  affordance, not functional without a real ResizeObserver setup; the 3 size
  modes cover the primary use cases).
- No automated accessibility/Lighthouse audit run yet (Phase 4 item).

#### Files added

`	ext
src/features/chatbot/
  ChatContext.tsx
  ChatWidget.tsx         (+ .module.css)
  ChatGate.tsx           (+ .module.css)
  ChatConversation.tsx   (+ .module.css)
  QuoteEstimator.tsx     (+ .module.css)
  quoteConfig.ts          (+ quoteConfig.test.ts, 14 tests)
  chatResponses.ts       (+ chatResponses.test.ts, 14 tests)
`

#### Files changed

- src/data/translations.ts — added ~100 new bilingual ID/EN keys:
  all ot_* (gate, greeting, prompts, quota, size, tabs) and all
  quote_* (title, subtitle, labels, result, actions, toasts) keys.
  ot_greeting and ot_quota_alert_exhausted contain <strong> HTML
  (SOURCE verbatim); rendered via dangerouslySetInnerHTML in
  ChatConversation — safe because the content is a hard-coded build-time
  string from SOURCE, not runtime input.
- src/features/consultation/ConsultationPage.tsx — accepts prefillNotes
  and prefillTopic from useSearchParams to pre-fill the booking form
  when navigated from the chatbot's "Bawa ke Sesi 1-on-1" action.
- src/app/App.tsx — renders <ChatWidget /> as a sibling of route
  content inside AppShell, so it is present on all routes.

#### Validation gates — all passing

`	ext
npm run lint      -> 0 errors, 3 warnings (pre-existing
                      react-refresh/only-export-components on
                      I18nContext.tsx, ThemeContext.tsx, and now
                      ChatContext.tsx; exit code 0)
npx tsc --noEmit  -> clean (strict mode incl. noUncheckedIndexedAccess/
                      exactOptionalPropertyTypes), no errors
npm run test      -> 9 files, 90 tests passed (28 new: 14 in
                      chatResponses.test.ts, 14 in quoteConfig.test.ts;
                      total grew from 62 to 90)
npm run build     -> vite build succeeded:
                      dist/index.html          1.55 kB (gzip: 0.68 kB)
                      dist/assets/*.css       69.50 kB (gzip: 12.32 kB)
                      dist/assets/*.js       439.56 kB (gzip: 141.70 kB)
npm run preview   -> GET / returns HTTP 200 (widget renders on home,
                      visible via dist/ HTML inspection)
`

dist/ was removed after the build/preview check, per this project's
established convention (build artifact, already .gitignored).

#### Remaining gaps / not done in this step

- No real Gemini/AI backend (per Security plan; a separate explicitly-scoped
  project is needed before wiring any live LLM).
- No automated accessibility/Lighthouse audit run yet (Phase 4 item).
- Translation coverage now includes all SOURCE i18n keys (Phase 4 will do a
  completeness audit).
- Phase 4 hardening: SEO, Lighthouse, dependency audit, sitemap.xml,
  accessibility review — all routes now exist so hardening can proceed.

#### Next steps

1. Phase 4 hardening pass (SEO audit beyond what's now route-aware,
   Lighthouse, dependency audit, sitemap.xml, accessibility review) —
   all Phase 3 routes are now complete; hardening can proceed.
2. Confirm Open Decisions 5–8 before Phase 5 (git init, Cloudflare Pages
   project connection, preview/production deploy, rollback drill, domain
   cutover) — none of that has changed in this phase.
---

### Phase 4 hardening completion log — 2026-08-21

#### Scope completed

8 of 9 Phase 4 hardening tasks. Lighthouse pass deferred (requires manual
browser run — no headless Chrome in this environment).

#### SEO metadata (SeoHead component)

- Created src/components/seo/SeoHead.tsx — central component wrapping
  useDocumentMeta with a cleaner 	itleKey/descKey API via useI18n().
- Refactored all 6 routes (HomePage, ArticlesPage, ArticleDetailPage,
  LearningPage, ProjectsPage, ConsultationPage) to use <SeoHead> instead
  of manual useDocumentMeta boilerplate.
- Added og:image (https://hardcode.id/og-image.png placeholder),
  	witter:image, 	witter:site (@hardcodeid) to pplyPageMeta().
- Added JSON-LD Organization structured data on homepage
  (pplyOrganizationJsonLd() in seo.ts).

#### Sitemap generation

- scripts/generate-sitemap.mjs — build-time Node.js script that imports
  article data and generates public/sitemap.xml with <lastmod>,
  <changefreq>, <priority> for all 11 URLs (home + 4 routes + 6 articles).
- Wired as prebuild npm script — runs automatically before ite build.

#### Accessibility fixes

- Chat widget: focus moves to first focusable element on open, Tab focus
  trapped inside panel while open, focus restored to trigger button on close.
- Booking calendar: arrow-key roving-tabindex navigation
  (ole="grid", one day at 	abIndex=0 at a time).
- Skip-to-main-content link added to AppShell (visually hidden until
  focused).
- All existing accessibility features verified: FAQ accordion ria-expanded/
  ria-controls, theme/i18n toggle ria-labels, chat ria-live="polite"
  messages, ole="dialog" panel.

#### Security audit

- .env.example and ite-env.d.ts only expose VITE_SITE_URL and
  VITE_CONTACT_EMAIL — both non-secret, public values.
- No hardcoded secrets, API keys, tokens, or passwords anywhere in source.
- No etch(), XMLHttpRequest, or xios calls — app is 100% client-side.
- Single dangerouslySetInnerHTML usage (article body HTML) — build-time
  safe, documented with security comment.
- package.json confirmed clean: no express, dotenv, @google/genai.
  Only eact, eact-dom, eact-router-dom.

#### Validation gates — all passing

`	ext
npm run lint      -> 0 errors, 3 warnings (pre-existing
                      react-refresh/only-export-components; exit code 0)
npm run typecheck -> clean (tsc --noEmit, strict mode)
npm run test      -> 9 files, 90 tests passed
npm run build     -> prebuild sitemap + vite build succeeded:
                      dist/index.html          1.55 kB (gzip: 0.68 kB)
                      dist/assets/*.css       69.75 kB (gzip: 12.39 kB)
                      dist/assets/*.js       441.70 kB (gzip: 142.63 kB)
npm run preview   -> all routes return 200:
                      /, /artikel, /belajar, /proyek, /konsultasi,
                      /artikel/menghafal-sintaks, /sitemap.xml, /robots.txt
`

#### Files added/changed

`	ext
src/components/seo/SeoHead.tsx           (new)
src/ib/seo.ts                           (added og:image, twitter:image,
                                          twitter:site, JSON-LD)
src/hooks/useDocumentMeta.ts             (added keywords/publishedTime deps)
scripts/generate-sitemap.mjs             (new, prebuild hook)
public/sitemap.xml                       (regenerated with lastmod/changefreq/priority)
package.json                             (added prebuild script)
src/features/home/HomePage.tsx           (refactored to SeoHead)
src/features/articles/ArticlesPage.tsx    (refactored to SeoHead)
src/features/articles/ArticleDetailPage.tsx (refactored to SeoHead)
src/features/learning/LearningPage.tsx    (refactored to SeoHead)
src/features/projects/ProjectsPage.tsx    (refactored to SeoHead)
src/features/consultation/ConsultationPage.tsx (refactored to SeoHead)
src/features/chatbot/ChatWidget.tsx       (focus trap + restore)
src/features/consultation/BookingCalendar.tsx (arrow-key roving-tabindex)
src/components/layout/AppShell.tsx        (skip-to-main-content link)
`

#### Deferred

- Lighthouse pass (requires manual browser run with Chrome DevTools or

px lighthouse-cli). All other Phase 4 items complete.
## Final chatbot parity completion log (2026-08-27)

Scope completed in the target output repository `D:\AISTUDIO\OUTPUT\HardCode.id` only. The source repository `D:\AISTUDIO\SOURCE\react-hardcode-id` remained read-only and was not edited.

### Chat widget parity

- Added Tanya unread state in `src/features/chatbot/ChatContext.tsx`.
- Bot replies received while the widget is closed now set `hasUnread`.
- Opening the widget via `openWidget` or `toggleWidget` clears unread state.
- `src/features/chatbot/ChatWidget.tsx` renders a launcher red dot when unread messages exist.
- Added accessible unread copy via `tanya_unread` translations in ID and EN.
- Added desktop bottom-right resize handle with custom width/height persistence.
- Chat size persistence uses localStorage keys:
  - `hardcode_tanya_size_mode`
  - `hardcode_tanya_custom_w`
  - `hardcode_tanya_custom_h`
- Resize clamps dimensions and preserves the mobile full-screen panel behavior.

### Tanya message rendering parity

- Added `parseTanyaMessage` in `src/features/chatbot/chatResponses.ts`.
- `src/features/chatbot/ChatConversation.tsx` now renders parsed Tanya markdown nodes without `dangerouslySetInnerHTML`.
- Parser coverage includes emoji shortcodes/emoticons, dividers, blockquotes, fenced code, inline code, links, unordered/ordered lists, bold, and italic.
- Regression tests were updated in `src/features/chatbot/chatResponses.test.ts`.

### Quote estimator print parity

- Added `generatePrintableQuoteHtml` in `src/features/chatbot/quoteConfig.ts`.
- `src/features/chatbot/QuoteEstimator.tsx` now prints through a hidden iframe with a fallback print window.
- Added translated printing/fallback toast copy in `src/data/translations.ts`.
- Removed obsolete inline print-area CSS and added toast styling in `src/features/chatbot/QuoteEstimator.module.css`.

### Cleanup

- Removed stray generated `src/README.md` placeholder artifact.
- Fixed whitespace and encoding regressions introduced during agent edits.
- `public/sitemap.xml` was regenerated by the build prebuild step.

### Navbar parity

- SOURCE's `<nav>` (index.html around line 6028) only ever rendered 5 links —
  `layanan`, `cara-kerja`, `faq`, `testimoni`, `tulisan` — plus the language
  and theme toggles. It never linked `belajar`, `proyek`, or `konsultasi`
  from the header; those routes are reached only via in-page CTAs/cards.
- `src/components/layout/Header.tsx` previously also rendered `Link`s to
  `/belajar`, `/proyek`, `/konsultasi`, which SOURCE does not do. Removed
  those three links so the header nav matches SOURCE exactly (5 items:
  layanan/cara-kerja/faq/testimoni/tulisan, via the existing
  `ANCHOR_NAV_LINKS` array plus the `/artikel` link), followed by language
  and theme toggles.
- No translation keys were removed — `nav_belajar`/`nav_proyek`/
  `nav_konsultasi` stay defined in `src/data/translations.ts` since other UI
  (footer/cards) may still reference them; only the header's rendering of
  them changed.

### Back-to-top parity

- SOURCE (`index.html`) renders a floating `#back-to-top` button
  (`.back-to-top-btn`, around line 7438) fixed at `bottom: 5.75rem; right:
  1.5rem`, `aria-label`/`title` bound to the `top_aria` i18n key, that
  becomes `.visible` once `window.scrollY > 260` (`checkScrollPosition`,
  around line 8644) and calls `window.scrollTo({ top: 0, behavior: "smooth"
  })` on click (`scrollToTop`, around line 8657).
- Added `src/components/ui/BackToTop.tsx` (+ `BackToTop.module.css`) as a
  global component: tracks `window.scrollY` via a passive scroll listener,
  shows/hides past the same 260px threshold, and smooth-scrolls to top on
  click. Rendered once from `src/components/layout/AppShell.tsx` (inside the
  shared `container`, after `Footer`), so it's present on every route
  without each page needing to mount it individually.
- Styling ports SOURCE's fixed position, size, border/background, hover/
  active transforms, and opacity/visibility/transform transition curve
  (`cubic-bezier(0.16, 1, 0.3, 1)`), using this repo's CSS custom properties
  (`--paper-raised`, `--ink`, `--ink-dim`, `--line`) instead of SOURCE's
  literal color values, so it themes correctly in light/dark mode. Fixed at
  `bottom: 92px; right: 24px` (SOURCE's `5.75rem`/`1.5rem`) with `z-index:
  9990` — deliberately below the chat trigger/panel's `9999`/`9998` (see
  `src/features/chatbot/ChatWidget.module.css`) so the two floating
  UI elements never fight for top stacking if they ever visually overlap.
- Added `top_aria` to both locales in `src/data/translations.ts` ("Kembali
  ke atas" / "Back to top"), matching SOURCE's `src/i18n.js` `top_aria` key
  verbatim.
- No temporary/scratch files existed in the tree for this step (checked via
  `git status --porcelain=v1 --untracked-files=all` before starting); none
  needed removal.

### Validation (this step, 2026-08-27)

```text
git diff --check   -> clean (autocrlf LF/CRLF notices only, no real issues)
npm run lint       -> 0 errors, 3 warnings (pre-existing
                      react-refresh/only-export-components on
                      ChatContext.tsx, I18nContext.tsx, ThemeContext.tsx)
npm run typecheck  -> clean (tsc --noEmit)
npm run test       -> 9 files, 91 tests passed
npm run build      -> prebuild sitemap (11 URLs) + vite build succeeded:
                      dist/index.html                   1.59 kB (gzip 0.69 kB)
                      dist/assets/index-*.css           70.39 kB (gzip 12.60 kB)
                      dist/assets/index-*.js            448.97 kB (gzip 145.52 kB)
```

`dist/` was removed after the build check since it is a build artifact
(already `.gitignore`d), not something to keep on disk between steps.

This closes out the navbar and back-to-top parity gaps left open at the end
of the "Final chatbot parity completion log" above; no other open items were
in scope for this step.
