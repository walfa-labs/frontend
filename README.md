# Portfolio Frontend

A Nuxt 4 portfolio frontend with hybrid rendering — SSR for public content routes (indexable HTML, working Open Graph cards), SPA for the dashboard.

## Tech Stack

- **Nuxt 4** (hybrid rendering: SSR public + SPA dashboard)
- **Nuxt UI v4** (Reka UI + Tailwind CSS v4)
- **Pinia** (state management)
- **Zod** (form validation via `UForm`)
- **Unovis** (dashboard metrics & views charts)
- **Vitest & @nuxt/test-utils** (unit & integration testing)
- **Playwright** (cross-browser E2E testing)
- **Docker** (multi-stage hardened production containerization)

## Quick Start

### Local Run

```bash
npm install
npm run dev          # http://localhost:3000
```

Or with [Task](https://taskfile.dev):

```bash
task setup           # npm ci
task run             # dev server at http://localhost:3000
```

### Docker Run

```bash
# Start development container with hot reloading
task docker:dev

# Build and run production container
task docker:build
task docker:run

# Or run full production compose stack
task docker:prod
```

## Architecture

| Route pattern | Rendering | Purpose |
|---|---|---|
| `/` `/about` `/projects/**` `/blog/**` | SSR + SWR (1h) | Public content, SEO, OG cards |
| `/dashboard/**` `/login` | SPA (`ssr: false`) | Auth-gated, not indexed |

The frontend talks to a Go (Fiber) backend API at `apiBase` (default `/api/v1`, same-origin via reverse proxy in production).

## Environment Configuration

See `.env.example` for configuration. Key variables:

| Variable | Default | Purpose |
|---|---|---|
| `NUXT_PUBLIC_API_BASE` | `/api/v1` | Backend API base URL |
| `NUXT_PUBLIC_SITE_URL` | `https://portfolio.example.com` | Canonical URL for OG tags |
| `NUXT_PUBLIC_SITE_NAME` | `Portfolio` | Site name in `<title>` |

## Testing

```bash
# Run Vitest unit & integration tests
npm run test:unit
# Or with coverage
npm run test:coverage

# Run Playwright end-to-end tests
npm run test:e2e

# Interactive Playwright UI runner
npm run test:e2e:ui
```

## CI/CD & DevSecOps Workflows

The repository includes enterprise-grade GitHub Actions workflows:

1. **`ci.yml`**: Linting, TypeScript checking (`vue-tsc`), unit & integration tests with code coverage upload, and production bundle build.
2. **`e2e.yml`**: Automated Playwright E2E testing with browser caching and HTML test report artifact uploads.
3. **`security.yml`**:
   - **SCA**: `npm audit` + Aqua Security Trivy filesystem vulnerability scan.
   - **SAST**: Semgrep static application security testing (OWASP Top 10, JavaScript/TypeScript security audit).
   - **Secrets Scan**: Gitleaks detection across git history and pull requests.
   - **Workflow Linter**: Zizmor GitHub Actions workflow security analyzer.
   - **DAST**: OWASP ZAP (Zed Attack Proxy) baseline dynamic scan against the running container.
4. **`codeql.yml`**: GitHub CodeQL Advanced static analysis for JavaScript / TypeScript.
5. **`release.yml`**: Automated container build, multi-arch buildx (`linux/amd64`, `linux/arm64`), GHCR publishing, and CycloneDX SBOM generation.
6. **`dependabot.yml`**: Weekly automated dependency updates for `npm`, `github-actions`, and `docker`.

## Taskfile Reference

All developer and CI workflows can be executed via [Task](https://taskfile.dev):

| Task | Command | Description |
|---|---|---|
| `task setup` | `npm ci` | Clean-install dependencies |
| `task run` / `task dev` | `npm run dev` | Dev server at http://localhost:3000 |
| `task build` | `npm run build` | Production build → `.output/server/index.mjs` |
| `task preview` | `npm run preview` | Preview production build |
| `task clean` | — | Deep clean all artifacts and regenerate Nuxt types |
| `task typecheck` | `npm run typecheck` | Type-check with vue-tsc |
| `task test` | `npm test` | Run Vitest unit & integration tests |
| `task test:coverage` | `npm run test:coverage`| Run Vitest with v8 coverage |
| `task test:e2e` | `npm run test:e2e` | Run Playwright E2E tests |
| `task test:e2e:ui` | `npm run test:e2e:ui`| Open Playwright interactive UI |
| `task test:all` | — | Run all unit, integration, and E2E tests |
| `task docker:build` | — | Build production Docker image |
| `task docker:run` | — | Run production container on port 3000 |
| `task docker:dev` | — | Run development environment via docker-compose |
| `task docker:prod` | — | Run production stack via docker-compose.prod.yml |
| `task docker:stop` | — | Stop compose containers |
| `task security:audit` | — | Run npm audit vulnerability check |
| `task security:secrets`| — | Run Gitleaks secret detection |
| `task security:sast` | — | Run Semgrep SAST scanner |
| `task security:sca` | — | Run Trivy SCA scan |
| `task security:dast` | — | Run OWASP ZAP baseline scan |
| `task security:zizmor` | — | Run zizmor workflow linter |
| `task security:all` | — | Run all local security scans |
| `task ci` | — | Run the entire CI verification suite locally |

## Production Deployment

```bash
npm run build
node .output/server/index.mjs   # starts Nitro production server
```

Or via Docker:

```bash
docker build -t walfa-labs-frontend:latest .
docker run -d -p 3000:3000 --name walfa-labs-frontend walfa-labs-frontend:latest
```
