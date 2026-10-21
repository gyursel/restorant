# LILY admin behavior

The user approved the existing LILY preview as the main site on 2026-10-21. This supersedes the earlier handoff restriction against production deployment. Preserve all existing restaurant/payment/security rules.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | Native select in existing panels | Existing panel workflows | native OS popup | Browser keyboard/open state |
| Date | Native time inputs | Restaurant hours settings | native OS popup | Existing seven-day validation |
| Form | Field/ImageField and server validation | server/validation.ts | draft editing | CMS schema tests and browser |
| Scrollbar | lily-admin.css | DESIGN.md | internal inspector/preview geometry | Static audit and browser |
| Toast | Admin notice/error state | panel.tsx | status/alert | Save/publish fixture workflow |
| CRUD | Admin api and edit-history | server/cms.ts | save draft/publish/restore | Version conflict validation and fixture workflow |

Business sources: `server/auth.ts` defines administrator access; `server/cms.ts` defines version checks and atomic publication/revision persistence; `server/validation.ts` defines content constraints; `docs/ORDERS-GO-LIVE.md` owns the unchanged orders process; `docs/STRIPE-CHECKOUT.md` owns payment activation. No new billing, permissions or legal policy is introduced.

Save keeps the current panel and marks the draft saved. PublishReview compares the current draft to published content; publication requires the existing explicit publish action. Failed saves retain inputs. Version conflicts report a reload requirement; never overwrite another editor. Restore loads history as a draft. Product removal remains reversible with Undo before publication. Unsaved exit and history replacement use ConfirmAction; page unload uses beforeunload. Dialog uses native showModal for focus trapping, Escape and restoration. Alerts use status/alert live regions.

The bounded catalog (schema maximum 300 products) keeps local search; sections max 30 and history max 50. Existing product selection and list behavior remain. Native select and time popups are accepted as platform-owned; the product owns labels and values. Locale is bg-BG; history is Europe/Sofia. Admin auth remains required; preview writes stay disabled unless an isolated preview database is explicitly configured.

The LILY document adapter is immutable and idempotent. Reads do not write storage. Saving persists the designVersion marker, preventing later owner edits from being translated. Both public and admin reads use this adapter. Legacy snapshots remain in revision history. No source runtime depends on the development session.

## Professional tools (additive)
`ProfessionalPanel` is a separate workspace; existing editor tabs, save/publish/auth/orders stay unchanged. It reuses `ConfirmAction`, parent notifications and `update`/edit-history. Bulk actions only change availability, popular flag or category of explicitly selected IDs, in one reversible draft edit. Confirmation states exact count and cross-page scope. Filters clear selection with an announcement; paging and sorting preserve it. The table uses local pages of 20 within the schema's bounded 300 products. Search/filter state is intentionally session-local because the parent editor uses transient tabs, and unsaved catalog queries should not enter shared URLs or persistent storage. Table scrolling belongs only to its wrapper; forms retain natural page height.

Quality checks are non-blocking editorial hints, not proof of valid publication or working external assets. Detailed comparisons use published content as the baseline, including saved drafts. Exports contain content only, no orders/auth; CSV neutralizes spreadsheet formulas. JSON is an offline copy, not an import/restore workflow. Existing server validation and conflict handling remain authoritative. Native selects, shared dialogs, Bulgarian labels and EUR formatting follow the canonical map above.
