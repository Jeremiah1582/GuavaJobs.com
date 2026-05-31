created_date: 2026-05-30 12:00:00, updated_at: 2026-05-30 19:30:00

# GuavaJobs — Product Vision & Roadmap

> Execution plan: [`masterBuildPlan.md`](./masterBuildPlan.md) · Architecture: [`architecture.md`](./architecture.md)

## North star

**GuavaJobs** is the **hub where people track job applications and career progression**: one place for every role you pursue, hiring stage, notes, and outcomes—not scattered across tabs, docs, and spreadsheets. **Grounded** AI cover letters (only facts from the user’s profile) support applications; **manual** cover letter writing and editing are always free.

**Long-term vision (post-V4):** Help people structure their careers (when to move on, long-term path)—**not** in scope until the core job-search loop proves value and revenue.

**V1 commercial goal:** Grow active users first (generous freemium, **no payment details** to sign up). Path to **€1,000 in the first month** primarily via **bootcamp partnerships** and optional paid upgrades—not by paywalling the tracker. **Budget until revenue:** €0—free tiers (Vercel, Supabase, etc.) and lean scope.

---

## Technical architecture (deployment)

Two **separate Next.js apps** in one monorepo; all product backend logic is **API-first** for future client integrations (bootcamps, HR/ATS software).

| App | Folder | Domain | Responsibility |
|-----|--------|--------|----------------|
| **Marketing** | `landingpage/` | **guavajobs.com** | Landing, pricing, legal, SEO — no product database |
| **Product** | `app/` | **app.guavajobs.com** | Job board, auth, tracker, cover letters, **`/api/v1/*`** |
| **Shared core** | `packages/core/` | — | Business logic, DB, validators — imported by App only |

**Integration path:** External clients call `https://app.guavajobs.com/api/v1/...` (partner API keys in a later phase). App UI uses the same `@guavajobs/core` services—not duplicate logic.

See [`architecture.md`](./architecture.md) for full structure and planned API routes.

---

## V1 filter (read before adding features)

Before building anything, ask: **“Is this required to get our first paying customer?”**

- If **no** → add to [Feature parking lot](#feature-parking-lot) below, not the current version.
- **No LinkedIn scrapers** in V1 (legal, GDPR, and ToS risk). Users **create a profile manually**, paste text, or **upload a CV** (file); smart parsing can deepen in V2.
- **Adzuna in V1** = public job **board** to browse and read listings. **Recruiter-posted jobs + apply on-site + auto-tracking** = later (marketplace needs traffic you won’t have on day one).
- **No payment details** required to sign up or use the free hub (tracker, job board, manual letters). Card only when upgrading to Starter/Pro.
- **Aesthetics matter:** V1 must feel modern, calm, and trustworthy—clean layout, readable typography, clear empty states. Polish is part of V1, not “later.”

---

## Who we serve (go-to-market wedge)

**Primary ICP (V1 marketing & product tone):**

- **UK & Germany bootcamp graduates** entering tech  
- **Career changers** moving into technical roles  

**Language & tone:** English first, **Professional** cover-letter tone by default.

**Distribution (V1):**

- Reddit communities (active tech job seekers; target ~50 conversations with ideal users)  
- **Bootcamp partnerships:** e.g. **50 free cover letter generations** per partnership deal (define per cohort vs per user when negotiating)  
- LinkedIn, TikTok, and other social posts (job-search tips + product hooks)

**Later segments (not V1 messaging):** Jobcenter / Arbeitsagentur users in DE, general recruiters on the platform, non-tech verticals.

**Users over time:** Job seekers (V1–V4) → Recruiters listing jobs natively (V3+).

---

## Why?

Unemployment and application fatigue are rising. Job search is too time-consuming and fragmented. GuavaJobs is the **dedicated hub for career advancement**: browse jobs, track every application and stage, keep notes, and draft cover letters (manually or with AI)—all in one workspace.

---

## Product roadmap (V1 → V4)

### V1 — Career hub MVP (grow users, then monetize)

**Goal:** Become the default **application tracker** for the ICP; convert sign-ups when someone wants to **apply** or **track** a job. Revenue from bootcamp deals + optional paid tiers—not from blocking the tracker.

| Area | In scope |
|------|----------|
| **Landing page** | **`landingpage/`** on **guavajobs.com** — hub positioning, ICP copy, pricing overview, legal links. CTAs point to **app.guavajobs.com**. |
| **Public job board** | **`app/`** on **app.guavajobs.com/jobs** — search and job detail powered by **Adzuna** (no account required). Also exposed via **`GET /api/v1/jobs`**. |
| **Sign-up gate** | Browsing jobs is public on App. **Sign up or sign in required** to track, generate AI letters, save profile, or open dashboard. **Track / Apply** → auth → draft application. |
| **User profile** | Create/edit profile after sign-in: experience, skills, education, summary. Short **quiz** on what matters in the next job (used later for matching; collected in V1). Optional: upload CV file or paste existing CV/LinkedIn **text** (user-provided, no scraping). |
| **Cover letters** | **Manual:** write and edit cover letters in-app—**always free**, unlimited, all tiers. **AI:** reads **job description + user profile**; generates letter in selected tone (**Professional** default). **Strict rule:** AI may **only** use information from the profile—no invented employers, dates, or skills. UI should make grounding obvious (e.g. which profile facts were used). Freemium: **5 AI letters per month** (resets monthly; no credit card). |
| **Application tracker** | **Unlimited on free tier**—core of the product. Each tracked job gets a row; link to cover letter(s). User confirms **applied or not** and sets **hiring stage**. Per-row **notes** (interview prep, lessons learned). **V1 tracker:** simplified status set (enough to be useful; full colour system in V2). |
| **Design** | Modern, clean UI (Next.js + Tailwind) on **both** apps; mobile-friendly; strong empty states. |
| **Auth & accounts** | **App only** — sign up / sign in with **no payment details**; GDPR-aware delete account. |
| **Backend / API** | All features implemented in **`packages/core`** services + **`/api/v1/*`** routes on App (for UI parity and future B2B integrations). |
| **Payments** | Optional Starter/Pro on **App**; Stripe when ready. Never required for tracker or manual letters. |

**Explicitly out of V1:** CV generation, job matching scores, recruiter dashboard, native apply on GuavaJobs, push notifications, company-branded letter themes, AI career coach, V4 assistant, LinkedIn auto-import, Arbeitsagentur-specific flows, German UI.

**Realistic build note:** Aim for a solid V1 in **days, not hours**—auth, Adzuna edge cases, payments, and quality checks take time even with AI-assisted coding.

---

### V2 — Documents & rich tracking

**Goal:** Increase ARPU and retention; become the system of record for applications.

| Area | In scope |
|------|----------|
| **CV generation** | Same grounding rules as cover letters: job description + profile only, no hallucination; edit and export. |
| **Profile enrichment** | Upload CV or profile URL; **AI extracts** structured profile fields (user reviews before save). |
| **Application tracker (full)** | Full colour/status model, e.g.: Gray = draft / not confirmed applied; Yellow = waiting for response; Red = rejected (no interview); Light blue shades = 1st / 2nd / 3rd interview scheduled; Green = offer made. **Red text** on blue/green row = fell through at that stage. **Blue text** on green row = offer accepted. Notes on every row (carried from V1). |
| **Branded cover letters (V1.5 → V2)** | Subtle **company logo** and brand colours on generated cover letters. |
| **Pricing alignment** | Starter tier includes **CV generation** quotas (see Pricing). |

**Out of V2:** Category matching engine, recruiter marketplace, career gap coach, pattern-finding assistant.

---

### V3 — Match, notify, coach, recruit

**Goal:** Smarter discovery and B2B2C value; start two-sided marketplace.

| Area | In scope |
|------|----------|
| **Job matching** | Jobs and users tagged with **industry / career path categories**; surface jobs that fit user quiz + profile. User **experience per category** estimated from time in field; score **0–100** for fit display. |
| **Notifications** | Alert users when a strong job match appears (email and/or in-app). |
| **Career coaching** | User sets **ideal target role**; AI compares to current profile—gaps, skills to add, suggested next steps (grounded in profile data). Included in **Pro** tier. |
| **CV branding (V2.5 → V3)** | CVs with subtle **company theme** colours where appropriate. |
| **Recruiter job listings (start)** | Recruiters can post jobs on GuavaJobs (initially alongside Adzuna). Long-term goal: **most listings are native**, not aggregated. |
| **Recruiter ↔ candidate** | Use category tags so recruiters can discover relevant job seekers (privacy and consent first). |

**Out of V3:** Fully automated pipeline from onsite apply; deep AI “why am I failing” assistant (V4).

---

### V4 — Intelligence & on-platform apply

**Goal:** Moat via history + automation for native jobs.

| Area | In scope |
|------|----------|
| **AI job-search assistant** | Chat over **application history**; identify patterns (e.g. many rejections after screening); suggest new approaches when no offers after many attempts. Grounded in stored applications, notes, and outcomes. |
| **Apply on GuavaJobs** | For **natively listed** jobs, candidates apply on-platform. |
| **Automated tracking** | Progress stages update from on-platform apply workflow (where technically feasible)—reduces manual status updates. |
| **Mobile** | Dedicated mobile experience or PWA polish if not already primary in V1. |

---

## Pricing

**Principle:** The **hub is free**—no payment details to sign up. Monetize **AI volume** and premium features, not tracking or manual writing.

Aligned to what **exists** in each version—don’t sell V3 features on a V1 landing page.

| Tier | Price | What’s included |
|------|-------|-----------------|
| **Freemium** | €0 (no card) | **Unlimited** application tracker + notes; **unlimited** manual cover letter write/edit; public job board; profile + quiz. **5 AI cover letter generations per month** (calendar month reset). |
| **Starter** | €9.99/mo | Everything in Freemium + **30 AI cover letters per month**; **30 AI CV generations per month** (**from V2** when CV ships). |
| **Pro** | €29.99/mo | Everything in Starter + **100 AI cover letters per month** + **100 AI CV generations per month**; **AI career consultations** (**from V3**). |
| **Bootcamp / partner** | Custom | e.g. **50 AI cover letter generations** per partnership (per cohort or per student—set in contract); stacks on top of or overrides freemium caps per agreement. |

**Freemium messaging (V1):** *“Free to track every application. Five AI cover letters every month—no credit card.”*

---

## Compliance & market (EU/UK 2026)

- **GDPR:** Lawful basis for profile/job data; export/delete; EU-friendly hosting where possible.  
- **EU AI Act:** Candidate-side writing assistance is unlikely “high-risk”; still be transparent that output is **AI-assisted** and user-edited.  
- **Adzuna:** Respect API terms, attribution, and rate limits.  
- **No scraping** LinkedIn or job sites for profile data.

---

## Feature parking lot

*Ideas and “wouldn’t it be cool” items **not** scheduled in V1–V4. When planning V5+, review here and promote items into a version.*

| Idea | Notes / trigger to promote |
|------|----------------------------|
| German UI + formal DE cover-letter templates | When pursuing Arbeitsagentur / Jobcenter wedge |
| Jobcenter / Arbeitsagentur-specific onboarding | Separate GTM from bootcamp wedge |
| LinkedIn OAuth / official profile import | Only if compliant API path exists—never scrape |
| TikTok-specific content calendar / UGC playbook | Marketing ops, not product version |
| “When is it time to leave my job?” career monitor | Post–V4 career product |
| Salary negotiation coach | V5+ or Pro add-on |
| Interview question generator per job | Could sit V2 or V5 |
| Chrome extension: save job from any tab | Distribution + tracker stickiness |
| Referral program (free letters for invites) | After core loop works |
| White-label for bootcamps (their branding) | B2B once one partnership works |
| Analytics dashboard for bootcamps (student progress) | B2B V5+ |
| Resume ATS score checker | Crowded space—only if differentiated |
| Multi-tone letters (casual, creative, executive) | After Professional tone validated |
| Team/family account | Low priority |
| Partner REST API + API keys for client HR software | V2+ when first bootcamp/enterprise integration signed |
| *(Add your ideas below)* | |

### Scratchpad (jot new ideas here)

- 
- 
- 

---

## Version summary (at a glance)

| Version | Theme | Core deliverables |
|---------|--------|-------------------|
| **V1** | Career hub | **guavajobs.com** marketing + **app.guavajobs.com** jobs/tracker/letters/API |
| **V2** | Documents | CV generation, full tracker colours, CV upload/AI parse, branded cover letters |
| **V3** | Match & coach | Categories, matching score, notifications, career coaching, recruiter posts, themed CVs |
| **V4** | Platform & AI | Native apply, auto-tracking, history-based AI assistant |

---

## Document changelog

| Date | Change |
|------|--------|
| 2026-05-30 | Restructured into V1–V4, ICP/GTM, V1 filter, pricing alignment, feature parking lot |
| 2026-05-30 | Hub-first freemium: 5 AI letters/month, unlimited tracker + manual letters, no card; public job board + landing page; sign-up at apply |
| 2026-05-30 | Linked to masterBuildPlan.md |
| 2026-05-30 | Dual-app architecture (landingpage/ + app/ + packages/core), API-first backend |
| 2026-05-30 | Renamed app folders to lowercase: landingpage/, app/ |
