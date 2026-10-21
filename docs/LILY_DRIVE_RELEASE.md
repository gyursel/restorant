# LILY DRIVE main release — 2026-10-21

Authorization: owner requested preview `apex-drive-bulgaria-mekhwljvy-gyursels-projects.vercel.app` become the main version, with its admin matching. Source is 852d8563bee9adcb1555ecf65885c716f683516e. Earlier main is 21b267c2f03f4f829e848928a43e8cf65b76118f; previous production is dpl_HoRFzRNdxRSAKGq8BPmoy5P7mJax. This authorization supersedes old handoff no-production instructions.

## Changes
The existing cinematic design is retained. Admin/login now use LILY identity, hero asset and crimson controls. Legacy content is upgraded in memory by one immutable/idempotent adapter used on server reads, browser hydration and admin reads; save persists designVersion. Prices, product IDs, availability, custom media/video, button settings, revision history and authorization remain. Marked owner changes are never silently translated. Hero assets, monumental wordmark and appearance tokens are editable; media picker includes section/background and LILY assets. Native confirmation popups in the editor were replaced with the shared modal. Save/publish/restore retain existing version checks.

## Verification and limits
`npm run build`, `npm run typecheck`, `npm run test:cms` (22 checks), `npm run check:files`, `git diff --check` passed. Admin-scope premium static audit passed with zero findings. DESIGN lint returned no errors. No configured formatter or browser E2E suite exists. An isolated disposable fixture copy was prepared outside this repository; the available browser could not reach the network-isolated local dev server, so fixture interaction tests were not completed. No QA fixture routes, auth bypass or sample storage is included in release. Real production admin redirects correctly to login; authenticated save/publish remains unverified without owner login. Do not claim database or payment E2E coverage.

## Rollback
Vercel can promote prior production `dpl_HoRFzRNdxRSAKGq8BPmoy5P7mJax`. Revert this release merge on main for source continuity. No schema migrations or destructive data changes are part of this release. Adapter reads do not write storage; normal owner save/publish persists normalized content. Existing CMS history still supports restoration as a draft.

## Continued work
Read DESIGN.md and UX-CONTRACT.md; use the same adapter for content surfaces. Keep admin auth and isolated-preview write guards. Verify an actual owner edit after login. Source and assets remain portable in this GitHub repository.
