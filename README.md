# Portfolio Frontend

A Nuxt 4 portfolio frontend with hybrid rendering — SSR for public content routes (indexable HTML, working Open Graph cards), SPA for the dashboard.

## Tech Stack

- **Nuxt 4** (hybrid rendering: SSR public + SPA dashboard)
- **Nuxt UI v4** (Reka UI + Tailwind CSS)
- **Pinia** (state management)
- **Umo Editor / Viewer** (Tiptap 3 based WYSIWYG, Markdown-first)
- **Unovis** (dashboard charts)
- **Zod** (form validation via `UForm`)

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000
```

## Architecture

| Route pattern | Rendering | Purpose |
|---|---|---|
| `/` `/about` `/projects/**` `/blog/**` | SSR + SWR (1h) | Public content, SEO, OG cards |
| `/dashboard/**` `/login` | SPA (`ssr: false`) | Auth-gated, not indexed |

The frontend talks to a Go (Fiber) backend API at `apiBase` (default `/api/v1`, same-origin via reverse proxy in production).

## Environment

See `.env.example` for configuration. Key variables:

| Var | Default | Purpose |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `/api/v1` | Backend API base URL |
| `NUXT_PUBLIC_SITE_URL` | `https://portfolio.example.com` | Canonical URL for OG tags |
| `NUXT_PUBLIC_SITE_NAME` | `Portfolio` | Site name in `<title>` |

## Build

```bash
npm run build         # outputs .output/server/index.mjs (Nitro Node server)
node .output/server/index.mjs   # start production server
```

> Do **not** use `nuxt generate` — it disables hybrid rendering. The dashboard requires `nuxt build`.
