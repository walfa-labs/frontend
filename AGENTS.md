# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project overview

`walfa-labs-frontend` is a **Nuxt 4 portfolio frontend** with hybrid rendering:

- Public content routes (`/`, `/about`, `/projects/**`, `/blog/**`) are **SSR with 1-hour SWR caching** for SEO and Open Graph cards.
- The admin **dashboard (`/dashboard/**`) and `/login` are client-only SPA** (`ssr: false`) and marked `noindex`.

The frontend talks to a **Go (Fiber) backend API** living in the sibling repo (`../backend`). The wire format is documented in `app/types/api.ts`, which mirrors the backend DTOs (camelCase) and was audited against `../backend/internal/adapter/handler/dto.go` (see the comment at the top of that file). Keep it in sync when the backend changes.

## Tech stack

- **Nuxt 4** (new `app/` directory structure, `ssr: true` + `routeRules` hybrid rendering), Vue 3.5, TypeScript
- **Nuxt UI v4** (Reka UI + Tailwind CSS v4 via `@import "tailwindcss"` in `app/assets/css/main.css`)
- **Pinia** (`@pinia/nuxt`) for state: `app/stores/auth.ts` (JWT token), `app/stores/ui.ts` (sidebar)
- **Zod** for form validation through `UForm`
- **Vitest 4** + **@nuxt/test-utils** (happy-dom) for unit tests in `tests/`
- **@unovis/vue** for the dashboard views chart; **gsap** is declared as a dependency but currently unused (page animations are pure CSS, see `main.css`)
- **@nuxt/icon** with the `lucide` collection (`@iconify-json/lucide`)
- Fonts (Fraunces, Inter, JetBrains Mono) are loaded from Google Fonts in `nuxt.config.ts` `app.head`

## Build and run commands

```bash
npm install            # also runs `nuxt prepare` via postinstall
npm run dev            # dev server at http://localhost:3000
npm run build          # production build → .output/server/index.mjs (Nitro Node server)
npm run preview        # preview the production build locally
npm run typecheck      # nuxt typecheck (vue-tsc) — run this to verify changes
npm test               # unit tests (Vitest) — tests/**/*.test.ts
node .output/server/index.mjs   # start the production server (HOST/PORT env, defaults 0.0.0.0:3000)
```

Every npm script above also has a wrapper in `Taskfile.yml` (requires [Task](https://taskfile.dev)): `task setup` (`npm ci`), `task run`, `task build`, `task test`, `task typecheck`, `task preview`, and `task clean` (wipes `.output`/`.nuxt`/caches, then regenerates `.nuxt` via `nuxt prepare`). The tasks just call the npm scripts — `package.json` stays the single source of truth.

- **Do NOT use `npm run generate`** — static generation disables the hybrid rendering the dashboard relies on (per README).
- Unit tests use **Vitest** (`tests/**/*.test.ts`, happy-dom environment by default; a file can opt into the full Nuxt environment with a `// @vitest-environment nuxt` docblock). There is **no linter/formatter configured**. Verification = `npm run typecheck` + `npm test` + `npm run build`. Do not add lint tooling unless explicitly asked.
- In dev, `/api/**` is proxied → `http://localhost:8080/api/**` via a **`routeRules` proxy rule** in `nuxt.config.ts` (not `nitro.devProxy` — that only intercepts requests over the HTTP listener, so SSR-internal `$fetch` calls bypass it). The dev/prod `routeRules` branch is switched on `process.env.NODE_ENV` because `import.meta.dev` is falsy when `nuxt.config.ts` itself is loaded. Run the Go backend on port 8080.

## Environment configuration

Copy `.env.example` to `.env`. All config is public runtime config:

| Variable | Default | Purpose |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `/api/v1` | Backend API base URL (same-origin via reverse proxy in production) |
| `NUXT_PUBLIC_SITE_URL` | `https://portfolio.example.com` | Canonical URL for OG tags |
| `NUXT_PUBLIC_SITE_NAME` | `Portfolio` | Site name in `<title>` |

## Code organization

```
app/
├── app.vue            # Root: calls ensureProfile() during SSR, wraps NuxtLayout in UApp
├── app.config.ts      # Nuxt UI theme (primary: emerald, neutral: stone)
├── assets/css/main.css  # Design tokens (CSS custom properties) + global utility classes
├── components/
│   ├── content/       # Public content display (PostCard, ExperienceCard, MarkdownView)
│   ├── dashboard/     # Admin widgets (StatCard, ResourceTable, ViewsChart)
│   ├── editor/        # UmoEditor.client.vue — hand-written markdown editor (client-only)
│   └── landing/       # Landing sections (Hero, FeaturedProjects, RecentPosts, ProjectCard, ExperienceTimeline)
├── composables/       # API access per resource: useApi, useAuth, usePosts, useProjects,
│                      # useExperiences, useProfile, useAssets, useStats
├── layouts/           # default.vue (public), dashboard.vue (admin shell, noindex)
├── middleware/        # auth.global.ts — global route guard
├── pages/             # Public pages + dashboard CRUD (list/new/[id]/edit per resource)
├── stores/            # Pinia: auth, ui
├── types/api.ts       # Shared API types mirroring backend DTOs
└── utils/markdown.ts  # renderMarkdown() — shared markdown→HTML renderer
```

Unit tests live in `tests/` (`tests/**/*.test.ts`, run with `npm test` / `task test`). `Taskfile.yml` (task runner wrappers) and `vitest.config.ts` sit at the repo root.

## Conventions and patterns

### API access

- **Always go through `useApi()`** (`app/composables/useApi.ts`). It is a `$fetch.create` instance that sets `baseURL` from runtime config, attaches the `Authorization: Bearer <token>` header when logged in, and logs out + redirects to `/login` on 401. `credentials: 'include'` is set **only on the client** (it breaks SSR fetch).
- Resource composables (`usePosts`, `useProjects`, ...) wrap `useApi()` and expose typed methods. Public endpoints are `/blog/...`, `/projects/...`, `/profile`; admin endpoints are `/admin/...`. Follow the existing naming (`adminList`, `adminCreate`, `adminUpdate`, ...).
- In pages, fetch data with `useAsyncData` (see `app/pages/blog/[slug].vue` and `app/pages/dashboard/index.vue` for the pattern, including `default:` fallbacks for SSR resilience).
- The site-wide profile is fetched once during SSR via `ensureProfile()` in `app.vue` and shared through `useState` (`useProfileState()`); components must handle a `null` profile gracefully.

### Auth

- JWT access token stored in **`localStorage`** (`auth_token`) via the Pinia auth store; sent as a Bearer header.
- `app/middleware/auth.global.ts` runs on every navigation: initializes the token from localStorage (client-only), redirects unauthenticated users away from `/dashboard/**`, and authenticated users away from `/login`.
- Because the dashboard is SPA-only, auth state is entirely client-side; SSR never sees the token.

### Pages and routing

- Dashboard pages opt into the dashboard layout with `definePageMeta({ layout: 'dashboard' })`.
- Admin CRUD follows a consistent shape per resource: `pages/dashboard/<resource>.vue` (or `<resource>/index.vue`) list view, `<resource>/new.vue` create form, `<resource>/[id]/edit.vue` edit form.
- Forms use **`UForm` + a zod schema** defined in the page's `<script setup>`, with `UFormField`/`UInput`/`UTextarea`/`USelect`. Slug fields auto-generate from the title until manually edited.
- Public pages set SEO via `useSeoMeta` + canonical link + JSON-LD (`application/ld+json`); keep this when adding public routes. The dashboard layout sets `robots: noindex, nofollow`.

### Markdown content

- All long-form content is stored as **markdown** in `*Markdown` fields (see `app/types/api.ts`).
- `renderMarkdown()` in `app/utils/markdown.ts` is the single renderer used by both the editor preview and the public `ContentMarkdownView` component — keep them using this one function. It HTML-escapes first and sanitizes link URL schemes (only `http(s)`, `mailto`, root-relative allowed).
- `EditorUmoEditor` (`app/components/editor/UmoEditor.client.vue`) is a **custom-built markdown textarea with a toolbar**, not a third-party editor, despite the name (the README's mention of "Umo Editor / Tiptap" is outdated). It is client-only (`.client.vue` suffix).

### Styling

- Design tokens are **CSS custom properties** in `app/assets/css/main.css` (`--accent`, `--bg-main`, `--surface-panel`, `--text-primary`, `--border-subtle`, ...), with a `.dark` override block driven by `@nuxtjs/color-mode` (system preference, light fallback).
- Prefer these tokens in Tailwind arbitrary values (`bg-[var(--surface-panel)]`, `text-[var(--text-secondary)]`) over hard-coded colors.
- Reusable utility classes live in `main.css`: `.editorial-heading`, `.editorial-label`, `.card-flat`/`.card-elevated`/`.card-accent`, `.btn-primary`/`.btn-secondary`, `.tag-default`, `.prose`, `.fade-in`. Reuse them instead of inventing new one-off styles.
- Animations are CSS-only and respect `prefers-reduced-motion`; do not reach for gsap without a reason.

### Icons and components

- Icons use `UIcon` with `lucide:*` names. The client bundle scans source files, and common icons are also explicitly listed in `nuxt.config.ts` `icon.clientBundle.icons` — **add new icon names there** if you introduce ones that scanning might miss (e.g. dynamically constructed names).
- Components are auto-imported with directory prefixes: `DashboardStatCard`, `EditorUmoEditor`, `ContentMarkdownView`, `LandingHero`, etc. Match this when adding components.
- Note: `ViewsChart.vue` uses Unovis `Vis*` components (`VisXYContainer`, `VisLine`, `VisAxis`) without an explicit import or plugin registration — verify rendering before refactoring that component.

## Security considerations

- The auth token in `localStorage` is accessible to any JS running on the origin — never render unsanitized HTML. Markdown HTML output must go through `renderMarkdown()` (it escapes HTML and sanitizes URL schemes); do not `v-html` raw user/API content by other means.
- `.env` files are git-ignored; only `.env.example` is committed. Never commit secrets — this app needs none client-side (all env vars are public).
- `credentials: 'include'` must stay client-only in `useApi()`; setting it on the server breaks SSR requests.
- Dashboard routes rely on the global auth middleware — do not bypass `navigateTo('/login')` handling on 401 in `useApi()`.
