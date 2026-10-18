# Admin editing experience

The authenticated editor now has session Undo/Redo (60 steps, typing grouped within 800 ms), command search across sections/products/site text, save shortcut, product duplication, searchable image selection, collapsible inspector groups, and a wide preview layout. Clicking a configurable storefront button selects its exact PNG configuration.

- Cmd/Ctrl+K opens search. Tab and Enter select a result; Escape closes.
- Cmd/Ctrl+S saves a draft. It never publishes.
- Undo/Redo toolbar controls affect document edits. Cmd/Ctrl+Z outside input fields uses document history; text fields keep native text undo.
- Publish opens a review of changed areas compared with the published document, including already-saved unpublished edits. Explicit publish retains optimistic server version checking.
- New product copies start unavailable and receive unique IDs/slugs.
- Undo history is memory-only and resets on reload or restoring a server revision. Published revisions remain in History.

The authenticated draft response now also returns the published content for accurate change review. Authentication, same-origin checks, upload checks, preview write isolation, checkout and order operations remain intact. No schema migration or new dependency.

Validation: 18 CMS checks (including grouped history, undo/redo, branching, bounded history and publication comparison), TypeScript, file checks and Next production build pass. Full authenticated upload/save/publish browser testing still requires an isolated CMS database and authorized admin session; it has not been claimed as complete.
