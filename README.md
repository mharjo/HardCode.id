# HardCode.id

Production-ready React + Vite + TypeScript scaffold for [hardcode.id](https://hardcode.id/).

This is a clean scaffold only. UI migration from the legacy source happens in later phases — see [migration-step.md](./migration-step.md) for the full plan and decision log.

## Stack

- React 19 + React Router 7
- Vite 7 + TypeScript (strict)
- ESLint 9 (flat config) + typescript-eslint
- Vitest for unit/smoke tests

## Requirements

- Node.js 20+ (developed/validated on Node 24)
- npm 10+

## Local development

```bash
npm install
npm run dev       # http://localhost:3000
```

## Scripts

| Script                | Purpose                          |
| ---------------------- | --------------------------------- |
| `npm run dev`         | Start the Vite dev server         |
| `npm run build`       | Type-check-free production build  |
| `npm run preview`     | Preview the production build      |
| `npm run lint`        | ESLint over the project           |
| `npm run typecheck`   | `tsc --noEmit`                    |
| `npm run test`        | Run Vitest once                   |

## Environment variables

Copy `.env.example` to `.env` and adjust as needed:

```bash
cp .env.example .env
```

Only `VITE_*` variables are exposed to client code — never put secrets (API keys, tokens) in them. Any feature that needs a real secret (e.g. an AI/API integration) must go through a server-side Cloudflare Pages Function/Worker, not client code.

## Deploying to Cloudflare Pages

1. Push this repository to GitHub/GitLab and connect it to a Cloudflare Pages project (or use `wrangler pages deploy dist` for a manual deploy after building).
2. Build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
3. Set environment variables in the Cloudflare Pages project settings (Production and Preview) using the same keys as `.env.example`, e.g.:
   ```
   VITE_SITE_URL=https://hardcode.id
   VITE_CONTACT_EMAIL=hello@hardcode.id
   ```
4. Set the Node version Cloudflare uses to build (e.g. `NODE_VERSION=24` or add a `.nvmrc`) if the default build image doesn't match.
5. Any server-side logic (contact forms, AI calls) should be implemented as Cloudflare Pages Functions under a `functions/` directory, with secrets stored via `wrangler secret` / the Pages dashboard — never in client-bundled `VITE_*` variables.

## Project structure

```text
index.html
src/
  app/          # App root and routing
  data/         # Static/typed content
  styles/       # Global styles
  vite-env.d.ts # Vite/env type augmentation
public/         # Static assets served as-is
```

Further feature directories (`components/`, `features/`, `lib/`, `hooks/`, `types/`) will be added incrementally as content is migrated — see `migration-step.md`.
