# LILY professional admin tools

Additive workspace under “Работни инструменти”. Existing editor, payments, orders, authentication and server persistence are unchanged.

Features: combined local name/description/slug search, category and status filters, name/price sorting, 20-row pagination, compact density, explicit page/all-results selection, five confirmed bulk actions (available/unavailable/popular/regular/category), filtered CSV export, offline JSON draft copy, advisory content checks, SEO preview/counts, detailed published-versus-draft comparisons and change export, localized shortcut/help guide.

Bulk updates use the existing update/history pipeline; no automatic save or publish. Prices are never bulk-modified. Exports exclude orders and credentials; CSV cells neutralize formula prefixes. JSON export does not imply file import support.

Validation: 29 CMS tests, TypeScript, production build, file checks, whitespace check, premium strict static audit (zero findings). New tests cover immutable selected-only mutations, preservation of prices/custom data, invalid categories, undo/redo, combined filtering/sorting, CSV injection defense, advisory checks and identity-based comparison.

Browser limitation: local Chromium is not installed in the execution environment. An attempted isolated browser run could start the production build with test-only environment values, but browser launch failed before interactions. No fixture routes or authentication changes are shipped. Authenticated production save/publish and mobile visual QA remain unverified.
