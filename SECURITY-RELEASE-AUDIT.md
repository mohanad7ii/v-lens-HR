# V-Lens HR — Release security audit (Step 129)

Date: 2026-10-11

## Source review completed
Reviewed the current GitHub versions of `dashboard.html`, `candidates.html`, `jobs.html`, `offers.html`, `reports.html`, `team.html`, and `settings.html`.

- All seven pages call `VLensAPI.requireAuth()`.
- None of the seven directly calls a `requireRole` helper; this is **not** proof that role enforcement is missing, since `vlens-role-ui.js`, API behavior, and database RLS must be reviewed separately.
- `offers.html` includes authenticated REST updates for offer state. Confirm authorization and company isolation server-side; client-side hiding is not a security boundary.
- Demo/localStorage flows exist in multiple pages. Verify no authenticated workflow silently falls back to demo data after an API error.

## Release blockers / required verification
1. Verify Supabase RLS for candidates, applications, interviews, evaluations, offers, jobs, team membership, and company profiles using two distinct company accounts.
2. Verify recruiter/manager/viewer permissions on every mutating API path, including offer approval and stage changes.
3. Verify expired sessions and permission-denied errors never show success or silently save to demo data.
4. Run end-to-end authenticated hiring flow (job → candidate → interview → evaluation → offer), including concurrent users.
5. Test each page's unauthenticated redirect and authorization restrictions in a real browser.

**Status:** static frontend review only; no browser or cross-account authorization tests performed. Do not treat this document as security certification.
