created_date: 2026-06-02
updated_at: 2026-06-02

# F9 regression smoke (manual)

Run after FA aggregate changes to confirm AI cover letters still work.

## Prerequisites

- Signed-in user with `User.displayName` set (generation blocks without it).
- Profile with summary/skills for grounding.

## Path A — Job board generate

1. Open `/jobs`, search until listings appear.
2. On a job card, click **Generate with AI** (or equivalent).
3. Expect redirect to `/applications/[id]?generated=1`.
4. On the hub:
   - **Cover letter** section shows generated text; signature uses display name (not `[Your Name]`).
   - **Letter grounding** panel lists citations from `citationsJson`.
   - **Job snapshot** shows listing metadata + description text.
   - **Profile used for AI** shows snapshot stats (summary/experience/skills).

## Path B — Hub regenerate

1. From application hub, regenerate the letter (editor action).
2. Letter updates in place (single `CoverLetter` row per application).
3. Grounding panel still renders citations.

## Path C — Job resolution (listing fallback)

1. Generate from a job visible in search results (even if Adzuna detail 404s).
2. Expect success — `jobsService.resolveListing` + client `jobSnapshot` must not surface “Job not found”.

## Path D — Profile snapshot refresh (FA.2)

1. On hub, **Refresh from profile** → confirm dialog → success toast.
2. `snapshotAt` updates; regenerate letter reflects current profile summary/skills.

## Path E — Bundle API

`GET /api/v1/applications/:id` returns bundle with:

- `application`, `jobListingSnapshot`, `jobDescriptionText`, `profileSnapshot`, `letter`, `flags`
- New FA.4 fields on `application`: `jobCategory`, `jobCategoryOther`, `employmentType`

## Not in scope (F10)

- `usage.ts` / quota enforcement remains stub; `aiLettersRemaining` may be `null`.
