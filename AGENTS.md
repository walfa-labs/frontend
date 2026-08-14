# AGENTS.md

> **Guidance & Operational Manual for AI Coding Agents and Engineers**  
> Repository: `walfa-labs-frontend` | Framework: **Nuxt 4.5+ (Vue 3.5+, TypeScript 5.9+)**

---

## 1. Project Overview & Core Mission

`walfa-labs-frontend` is the frontend application for the **Walfa Labs** personal portfolio and content management system. It employs a **hybrid rendering architecture**:

- **Public Content Routes (`/`, `/about`, `/projects/**`, `/blog/**`)**: Server-Side Rendered (SSR) with **1-hour SWR caching** (`swr: 3600`) for near-instant TTFB, rich SEO metadata, Open Graph cards, and JSON-LD structured data.
- **Admin Management & Auth (`/dashboard/**`, `/login`)**: Client-only Single Page Application (`ssr: false`) with `robots: noindex, nofollow` headers and global route protection.

The frontend connects to a companion **Go (Fiber)** REST API backend (`../backend`). Wire format models are codified in `app/types/api.ts` (camelCase DTOs).

---

## 2. Technical Stack & Dependencies

| Tool / Library | Version / Scope | Role in Repository |
|---|---|---|
| **Nuxt** | `^4.5.2` | Core meta-framework (using the Nuxt 4 `app/` directory convention) |
| **Vue** | `^3.5.41` | Composition API, `<script setup lang="ts">`, Vue SFCs |
| **Nuxt UI** | `^4.10.0` | UI component library (Reka UI primitives + Tailwind CSS v4) |
| **Tailwind CSS** | `v4` | Loaded via `@import "tailwindcss"` and `@import "@nuxt/ui"` in `app/assets/css/main.css` |
| **Pinia** | `^4.0.2` (`@pinia/nuxt`) | Client-side reactive stores (`auth.ts`, `ui.ts`) |
| **Zod** | `^4.4.3` | Schema definition and form validation integrated with `UForm` |
| **@unovis/vue** | `^1.6.7` | Time-series and categorical charts for dashboard view metrics |
| **@nuxt/icon** | `^1.x` (`@iconify-json/lucide`) | Vector icon rendering via `<UIcon name="lucide:*" />` |
| **Vitest** | `^4.1.10` (`@nuxt/test-utils`) | Fast unit, store, composable, and contract testing (happy-dom) |
| **Playwright** | `^1.62.1` | Cross-browser end-to-end user journey tests in `e2e/` |
| **Taskfile** | `v3` | Automation runner wrapping npm and container workflows |

---

## 3. Directory Layout & Architecture Map

The project strictly follows the **Nuxt 4 directory structure** where all application code lives under `app/`:

```
walfa-labs-frontend/
├── app/
│   ├── app.vue                   # Root component: SSR profile hydration & UApp wrapper
│   ├── app.config.ts             # Theme tokens (primary: emerald, neutral: stone)
│   ├── assets/
│   │   └── css/main.css          # Design tokens (CSS custom properties) & typography
│   ├── components/
│   │   ├── content/              # Public cards: PostCard, ExperienceCard, MarkdownView
│   │   ├── dashboard/            # Admin widgets: StatCard, ResourceTable, ViewsChart
│   │   ├── editor/               # UmoEditor.client.vue: Hand-written markdown editor
│   │   └── landing/              # Landing sections: Hero, FeaturedProjects, RecentPosts, Timeline
│   ├── composables/              # Typed data hooks: useApi, useAuth, usePosts, useProjects, etc.
│   ├── layouts/                  # default.vue (public shell) & dashboard.vue (admin sidebar shell)
│   ├── middleware/               # auth.global.ts: Global client-side navigation guard
│   ├── pages/                    # File-based routes (public pages & dashboard CRUD)
│   │   ├── index.vue             # Landing page
│   │   ├── about.vue             # About page & education/career timeline
│   │   ├── login.vue             # Admin login form
│   │   ├── blog/                 # Blog index & [slug].vue post details
│   │   ├── projects/             # Projects index & [slug].vue project details
│   │   └── dashboard/            # Dashboard overview & CRUD subtrees (posts, projects, experiences, profile)
│   ├── stores/                   # Pinia stores: auth.ts, ui.ts
│   ├── types/
│   │   └── api.ts                # TypeScript interfaces mirroring Go backend DTOs
│   └── utils/
│       └── markdown.ts           # renderMarkdown() utility with XSS sanitization
├── e2e/                          # Playwright end-to-end test specs
├── tests/                        # Vitest unit & integration test suites
├── Dockerfile                    # Multi-stage production container (node:26-alpine)
├── Dockerfile.dev                # Hot-reloading development container
├── docker-compose.yml            # Dev docker compose setup
├── docker-compose.prod.yml       # Production docker compose stack
├── nuxt.config.ts                # Nuxt config, routeRules, icon bundles, head tags
├── package.json                  # Scripts and package manifests
├── playwright.config.ts          # Playwright test config
├── Taskfile.yml                  # Task runner commands
├── tsconfig.json                 # TypeScript compiler configuration
└── vitest.config.ts              # Vitest test runner configuration
```

---

## 4. Build, Development & Verification Commands

All standard development commands run via `npm` or `task`:

```bash
# Dependencies
npm install                       # Clean install + runs `nuxt prepare` via postinstall
task setup                        # Wrapper for `npm ci`

# Development
npm run dev                       # Start dev server at http://localhost:3000
task dev                          # Task alias for `npm run dev`

# Production Build & Preview
npm run build                     # Compile production bundle → .output/server/index.mjs
npm run preview                   # Preview compiled production server locally
task build                        # Task wrapper for `npm run build`
task preview                      # Task wrapper for `npm run preview`

# Quality & Type Checking
npm run typecheck                 # Run vue-tsc type checking across all SFCs & TS files
task typecheck                    # Task wrapper for `npm run typecheck`

# Unit & Integration Tests
npm test                          # Run Vitest test suite (`tests/**/*.test.ts`)
npm run test:coverage             # Run Vitest with v8 code coverage reporting
task test                         # Task wrapper for `npm test`
task test:coverage                # Task wrapper for `npm run test:coverage`

# End-to-End Tests
npm run test:e2e                  # Run Playwright E2E tests (`e2e/**/*.spec.ts`)
npm run test:e2e:ui               # Launch interactive Playwright test runner UI
task test:e2e                     # Task wrapper for `npm run test:e2e`

# Comprehensive Quality Gate
task ci                           # Runs typecheck + test:coverage + test:e2e + build + audit
```

### Critical Rules on Commands

- ⛔ **Do NOT use `npm run generate`**: Nuxt static generation breaks the client-side SPA routing required by `/dashboard/**` and dynamic backend proxy rules.
- 💡 **Verification standard**: When modifying code, always verify with `npm run typecheck && npm test`.

---

## 5. Development Conventions & Patterns

### 5.1 API Access Layer (`useApi.ts` & Composables)

- **Always route API calls through `useApi()`** (`app/composables/useApi.ts`).
- `useApi()` creates a `$fetch.create` instance with:
  - Base URL resolved from `useRuntimeConfig().public.apiBase`.
  - Automatic `Authorization: Bearer <token>` header injection when user is logged in.
  - Automatic 401 interception: clears auth state and navigates to `/login`.
  - **Important**: `credentials: 'include'` MUST remain client-only (`import.meta.client`). Setting it on the server breaks SSR fetch in Nitro.
- **Resource Composables**: Wrap `useApi()` in dedicated composables:
  - `usePosts.ts`: `list()`, `getBySlug()`, `adminList()`, `adminGet()`, `adminCreate()`, `adminUpdate()`, `adminDelete()`.
  - `useProjects.ts`: `list()`, `getBySlug()`, `adminList()`, `adminGet()`, `adminCreate()`, `adminUpdate()`, `adminDelete()`.
  - `useExperiences.ts`: `list()`, `adminList()`, `adminGet()`, `adminCreate()`, `adminUpdate()`, `adminDelete()`.
  - `useProfile.ts`: `get()`, `adminUpdate()`, `ensureProfile()`, `useProfileState()`.
  - `useStats.ts`: `getSummary()`, `getPostViews()`, `getTopPosts()`.
  - `useAssets.ts`: `adminUpload()`.

### 5.2 Server-Side Profile Hydration

- The global profile is prefetched during SSR in `app.vue` via `ensureProfile()`.
- State is shared across components using `useProfileState()` (backed by `useState('site-profile')`).
- **Null Safety**: Components must handle a `null` profile gracefully with fallback defaults.

### 5.3 Authentication & Route Security

- Auth token is maintained in `localStorage` under key `auth_token` and managed by the Pinia `useAuthStore()` (`app/stores/auth.ts`).
- `app/middleware/auth.global.ts` executes on every client route change:
  - Initializes token from `localStorage` if not yet loaded.
  - Blocks unauthenticated access to `/dashboard/**` → redirects to `/login`.
  - Redirects authenticated users visiting `/login` → to `/dashboard`.
- Because `/dashboard/**` is client-only (`ssr: false`), SSR never handles auth tokens.

### 5.4 Admin CRUD & Form Patterns

- **Form Structure**: Use `UForm` bound to a Zod schema defined in `<script setup lang="ts">`.
- **Form Controls**: Use Nuxt UI components: `UFormField`, `UInput`, `UTextarea`, `USelect`, `UButton`.
- **Slug Generation**:
  - Automatically derive the slug from the title/name until the user manually modifies the slug field.
  - Track manual edits using a boolean flag (e.g., `isSlugManual = ref(false)`).
- **Layout Specification**: All dashboard pages must declare:
  ```ts
  definePageMeta({
    layout: 'dashboard',
  })
  ```

### 5.5 Markdown Processing & Authoring

- **Single Markdown Engine**: All markdown rendering must go through `renderMarkdown()` in `app/utils/markdown.ts`.
- **Security & Sanitization**:
  - `renderMarkdown()` escapes raw HTML characters (`<`, `>`, `&`, `"`, `'`) before parsing.
  - Validates link URLs to allow only safe protocols (`http:`, `https:`, `mailto:`, or root-relative `/`).
  - Do NOT use raw `v-html` on unsanitized user/API input.
- **Client Markdown Editor**:
  - `app/components/editor/UmoEditor.client.vue` is a custom-built, toolbar-driven markdown textarea with instant preview mode.
  - Must remain client-only (has `.client.vue` suffix).

### 5.6 Design System & Styling Tokens

- **Tailwind v4 Integration**: Styles and theme tokens are defined via CSS custom properties in `app/assets/css/main.css`.
- **Design Tokens**:
  - Accent palette: `--accent: #19594A`, `--accent-hover: #134238`, `--accent-light: #3B7A57`, `--accent-subtle: rgba(25, 89, 74, 0.06)`, `--accent-glow: rgba(25, 89, 74, 0.12)`.
  - Neutral surfaces: `--bg-main: #FAFAF8`, `--bg-tint: #F4F5F1`, `--surface-panel: #FFFFFF`, `--surface-subtle: #F5F5F4`.
  - Typography: `--font-display: 'Fraunces'`, `--font-body: 'Inter'`, `--font-mono: 'JetBrains Mono'`.
- **Utility Classes**:
  - Prefer existing classes: `.editorial-heading`, `.editorial-label`, `.card-flat`, `.card-elevated`, `.card-accent`, `.btn-primary`, `.btn-secondary`, `.tag-default`, `.prose`, `.fade-in`, `.expand-grid`.
  - Avoid ad-hoc inline color overrides; use token-based Tailwind arbitrary values like `bg-[var(--surface-panel)]` or `text-[var(--text-secondary)]`.
- **Reduced Motion**: All animations must respect `@media (prefers-reduced-motion: reduce)`. Avoid introducing external animation libraries when pure CSS transitions suffice.

### 5.7 Icons & UI Components

- **Icons**: Use `<UIcon name="lucide:<icon-name>" />`.
- **Icon Bundling**: Explicitly list newly introduced dynamic icon names in `nuxt.config.ts` under `icon.clientBundle.icons` to ensure they are pre-bundled for client rendering.
- **Component Auto-Imports**:
  - `Landing*` for `app/components/landing/` (e.g. `LandingHero`, `LandingFeaturedProjects`)
  - `Content*` for `app/components/content/` (e.g. `ContentPostCard`, `ContentMarkdownView`)
  - `Dashboard*` for `app/components/dashboard/` (e.g. `DashboardStatCard`, `DashboardResourceTable`)
  - `Editor*` for `app/components/editor/` (e.g. `EditorUmoEditor`)

---

## 6. Environment Configuration Reference

All application configuration is exposed via Nuxt public runtime config:

| Environment Variable | Default Value | Usage |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `/api/v1` | Base URL for backend API calls |
| `NUXT_PUBLIC_SITE_URL` | `https://portfolio.example.com` | Canonical root for Open Graph & sitemaps |
| `NUXT_PUBLIC_SITE_NAME` | `Portfolio` | Branding title suffix in document metadata |

- **Security Note**: `.env` is git-ignored. Never expose private credentials or API secrets in frontend code; all configuration is public runtime config.

---

## 7. Quality Gates & Security Rules for Agents

When creating or modifying code in this repository, you must adhere to the following rules:

1. **Verify Type Safety**: Run `npm run typecheck` (`vue-tsc`) after making changes to ensure zero compiler errors.
2. **Run the Test Suite**: Run `npm test` (`vitest run`) and confirm all unit/integration tests pass. Update or add corresponding tests under `tests/` when modifying logic.
3. **Preserve API Contract Alignment**: Never change `app/types/api.ts` without ensuring parity with the Go backend DTOs in `../backend/internal/adapter/handler/dto.go`.
4. **Preserve Hybrid Route Rules**: Never remove `ssr: false` from `/dashboard/**` or `/login`. Never modify dev proxy rules in `nuxt.config.ts` without testing SSR fetch compatibility.
5. **Enforce Markdown Sanitization**: Never inject unescaped HTML. All user-authored content must be rendered via `renderMarkdown()`.
