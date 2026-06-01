created_date: 2026-05-30 19:00:00, updated_at: 2026-06-01 20:00:00

# GuavaJobs — Architecture

## Overview

GuavaJobs runs as a **monorepo** with **two independently deployed Next.js applications** and a **shared core package** for all backend logic. This split keeps marketing fast and SEO-focused while the product app owns auth, data, jobs, tracker, AI, and the **public REST API** for future B2B integrations.

```mermaid
flowchart TB
  subgraph public [Public web]
    LP[landingpage\n guavajobs.com]
  end

  subgraph product [Product]
    APP[app package\n app.guavajobs.com]
    UI[App UI routes]
    API["/api/v1/*"]
  end

  subgraph shared [Shared]
    CORE[packages/core\n services · db · types]
  end

  subgraph external [Future clients]
    BC[Bootcamp systems]
    HR[Client HR / ATS software]
  end

  LP -->|CTA links| APP
  UI --> CORE
  API --> CORE
  BC --> API
  HR --> API
  CORE --> DB[(Supabase / Postgres)]
```

---

## Repository layout

```
GuavaJobs.com–Ai-job-assist/
├── landingpage/          → guavajobs.com (port 3000 local)
├── app/                  → app.guavajobs.com (port 3001 local)
├── packages/
│   └── core/             → @guavajobs/core (no HTTP — import only)
├── projectVision.md
├── masterBuildPlan.md
└── architecture.md
```

### landingpage (`guavajobs.com`)

- **Marketing only:** hero, features, pricing, legal, blog/SEO later.
- **No product database access.** No Supabase service role, no Prisma client.
- All product CTAs use `NEXT_PUBLIC_APP_URL` → `https://app.guavajobs.com`.
- Example links: `/jobs`, `/sign-up`, `/pricing` on the **app** domain.

### app (`app.guavajobs.com`)

- **Product UI:** job board, auth, profile, tracker, cover letters, dashboard, billing.
- **Canonical REST API** at `/api/v1/*` for the same domain.
- Route Handlers are **thin HTTP adapters** — they validate input, authenticate, call `@guavajobs/core` services, return JSON.
- **Product UI must use the service layer** (`@guavajobs/core`), not duplicate business logic in page components. External clients use HTTP; internal UI calls services directly (same code path as API).

### packages/core (`@guavajobs/core`)

Shared backend — imported by **`app/` only** (not `landingpage/`):

| Folder | Responsibility |
|--------|----------------|
| `services/` | Business logic: applications, profile, cover letters, jobs, usage, billing |
| `db/` | Prisma client or Supabase data access |
| `validators/` | Zod schemas shared by API + server actions |
| `types/` | DTOs, enums (application status, tiers, etc.) |
| `auth/` | Session helpers, future API key validation for partners |

---

## Application aggregate model

The **application** is the aggregate root for everything about one job pursuit. The UI and API expose a single **bundle** per application; persistence uses a normalized schema with **immutable snapshots** where history and AI grounding matter.

### Conceptual structure

```mermaid
erDiagram
  User ||--o{ Application : owns
  User ||--o| Profile : live
  Application ||--o{ ApplicationNote : has
  Application ||--o{ CoverLetter : has
  Application ||--o| ApplicationJobSnapshot : captures
  Application ||--o| ApplicationProfileSnapshot : captures
  Application ||--o| ApplicationCvArtifact : optional
```

| Piece | Storage pattern | Purpose |
|-------|-----------------|--------|
| **Pipeline & tracker fields** | Columns on `Application` | Status, rejection, interview, denormalized title/company for fast list views. |
| **Job listing** | `jobListingSnapshot` (JSON) + `jobDescriptionText` (text) on application or 1:1 child | What the user applied to **at track time**; Adzuna listings change or disappear. |
| **Live profile** | `Profile` (1:1 user) | Editable “who I am now”. |
| **Profile for AI** | `ApplicationProfileSnapshot` (1:1 or versioned) | Immutable facts the model may cite; created at **track** (recommended) or first AI generate. |
| **Cover letters** | `CoverLetter` — **one row per application** (`@@unique([applicationId])`); `source` MANUAL \| AI; `citationsJson` for grounding; AI regenerate **updates** the same row (adapt mode). |
| **Notes** | `ApplicationNote` timeline | Interview prep, follow-ups—prefer over legacy `Application.notes` text column. |
| **CV (V2)** | `ApplicationCvArtifact` | File reference + optional extracted text for that application only. |
| **Job category** | Enum or string on `Application` | Simple V2 taxonomy; V3 matching uses richer categories. |

### Design principles

1. **Snapshots over live FKs** — Do not rely on `jobExternalId` + live Adzuna fetch or live `Profile` alone for AI or audit; store what was true when the user pursued the role.
2. **No god table** — Do not put letter bodies, full profile JSON, and all notes into `Application` columns; keep children and snapshot tables.
3. **Optional job cache** — A shared `JobListing` table keyed by external id may dedupe fetches later; each `Application` still keeps its **own** snapshot so cache updates do not rewrite history.
4. **Service boundary** — `applicationsService.getBundleForUser(userId, applicationId)` returns `ApplicationBundle` (application + snapshots + manual letter + notes + flags); list endpoints stay slim.

### Phased implementation (see master plan **FA**)

| Phase | Deliverable | When |
|-------|-------------|------|
| **FA.1** | Structured job snapshot + canonical JD text at track | Before / with F9 |
| **FA.2** | `ApplicationProfileSnapshot` at track (or explicit refresh) | Required for F9 grounding |
| **FA.3** | `ApplicationBundle` DTO + `GET /api/v1/applications/:id` returns bundle | F9 / detail UI |
| **FA.4** | `jobCategory` / `employmentType` on application | V2 |
| **FA.5** | Deprecate legacy `Application.notes`; notes API only | Cleanup |
| **FA.6** | Unified application detail UI (one screen) | V2 |
| **FA.7** | `ApplicationCvArtifact` per application | V2 CV generation |

### Current schema (V1 baseline)

Today: `Application` holds pipeline + partial job fields + `jobDescriptionSnapshot`; `CoverLetter` and `ApplicationNote` are children; `Profile` is live-only. FA migrations evolve toward the model above without blocking F8 manual letters.

---

## API-first rules (V1 onward)

1. **Every backend feature** gets a service in `packages/core` **before** (or alongside) UI.
2. **Every user-facing backend feature** exposes a **versioned** REST route: `/api/v1/<resource>`.
3. **Route handlers** do only: parse request → auth → validate → call service → map response / errors.
4. **No business logic** in React components or Route Handler files beyond orchestration.
5. **Breaking changes** require a new API version (`/api/v2`); never break `/api/v1` for integrated clients.

### Planned V1 API surface (app.guavajobs.com)

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/v1/health` | Liveness check |
| GET/POST | `/api/v1/jobs` | Search/list jobs (Adzuna proxy) |
| GET | `/api/v1/jobs/:id` | Job detail |
| GET/PATCH | `/api/v1/profile` | User profile |
| GET/POST/PATCH/DELETE | `/api/v1/applications` | Application tracker (list / CRUD) |
| GET | `/api/v1/applications/:id` | Application detail; **evolves to `ApplicationBundle`** (FA.3) |
| GET/POST/PATCH | `/api/v1/applications/:id/cover-letters` | Manual + AI letters |
| POST | `/api/v1/cover-letters/generate` | AI generation (quota enforced) |
| GET | `/api/v1/usage` | AI quota remaining |
| POST | `/api/v1/webhooks/stripe` | Billing webhooks |

**Future (B2B integrations):** Partner auth via `Authorization: Bearer <api_key>` on scoped routes (e.g. read applications for bootcamp cohort, trigger letter generation). Stub `Partner` + `ApiKey` models in planning; implement when first client signs.

### API JSON contract (`@guavajobs/core`)

Implemented in [`packages/core/src/api/`](packages/core/src/api/). App Route Handlers import `toErrorResponse`, `toSuccessResponse`, `ApiErrorCode`, and `API_ERROR_STATUS`.

**Success (2xx):**

```json
{ "data": { } }
```

**Error (4xx/5xx):**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": {}
  }
}
```

| `ApiErrorCode` | HTTP status | When |
|----------------|-------------|------|
| `VALIDATION_ERROR` | 400 | Zod / input validation failed |
| `UNAUTHORIZED` | 401 | Missing or invalid session |
| `FORBIDDEN` | 403 | Authenticated but not allowed |
| `QUOTA_EXCEEDED` | 403 | AI letter limit reached (freemium) |
| `NOT_FOUND` | 404 | Resource missing |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

**F1.5:** `GET /api/v1/health` returns `{ "data": { "status": "ok", "version": "v1" } }` via `toSuccessResponse` in `app/src/app/api/v1/health/route.ts`.

---

## app package internal structure (target)

```
app/                              # monorepo package (deploy root on Vercel)
├── src/
│   ├── app/                      # Next.js App Router (framework convention)
│   │   ├── (auth)/                 # sign-in, sign-up, reset
│   │   ├── (dashboard)/            # tracker, profile, settings
│   │   ├── jobs/                   # Public job board UI
│   │   └── api/
│   │       └── v1/
│   │           ├── health/
│   │           ├── jobs/
│   │           ├── profile/
│   │           ├── applications/
│   │           ├── cover-letters/
│   │           ├── usage/
│   │           └── webhooks/
│   ├── components/
│   └── lib/
│       └── api/                    # HTTP helpers: error format, auth wrapper
├── package.json
└── README.md
```

---

## Authentication model

| Consumer | Auth mechanism |
|----------|----------------|
| **Browser (App UI)** | Supabase session cookies; server components read session |
| **App UI → own API** | Session cookie on same origin, or direct service calls (preferred for RSC) |
| **External client (future)** | API keys or OAuth client credentials; rate limits per partner |

---

## Environment variables

### landingpage

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://app.guavajobs.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://guavajobs.com` |

### app (product package)

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | `https://app.guavajobs.com` |
| `NEXT_PUBLIC_LANDING_URL` | `https://guavajobs.com` |
| `DATABASE_URL` | Supabase Postgres |
| `SUPABASE_*` | Auth + storage |
| `ADZUNA_*` | Job feed |
| `OPENAI_API_KEY` / etc. | AI provider |
| `STRIPE_*` | Billing |

---

## Deployment

| Vercel project | Root directory | Domain |
|----------------|----------------|--------|
| guavajobs-marketing | `landingpage` | guavajobs.com |
| guavajobs-app | `app` | app.guavajobs.com |

CORS: Public API routes allow configured partner origins when B2B launches; default same-origin for V1.

---

## Cross-app user journey

1. User lands on **guavajobs.com** (`landingpage/`).
2. Clicks **Browse jobs** → `app.guavajobs.com/jobs` (public, no auth).
3. Clicks **Track this job** → sign-up on **app** → draft **application** created via `applicationsService` with **job snapshot** (FA.1).
3. User opens job on **app** `/jobs` or `/jobs/[id]` → **Generate cover letter with AI** (above job description) → merge animation → `POST /api/v1/cover-letters/generate` or server action → redirect `/applications/:id?generated=1`.
4. User edits profile, refines letter on application hub (grounding panel + CV stub); manual save always free.
5. Bootcamp HR tool (later) → `GET /api/v1/applications/:id` bundle or scoped partner routes with API key.

---

## Document changelog

| Date | Change |
|------|--------|
| 2026-05-30 | Initial architecture: dual Next.js apps, packages/core, API-first V1 surface |
| 2026-05-30 | Renamed packages to lowercase: `landingpage/`, `app/` |
| 2026-05-31 | Documented API JSON contract (`@guavajobs/core/api`) |
| 2026-06-01 | Application aggregate: snapshots, bundle DTO, FA phases; ER diagram and API evolution |
