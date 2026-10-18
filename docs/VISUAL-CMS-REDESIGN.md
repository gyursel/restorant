# Premium visual CMS redesign

## Audit

The repository is a Next.js 16 App Router host for an existing React Router storefront. Neon stores versioned JSON documents (`cms_state` / `cms_revisions`) and media records; Vercel Blob stores uploads. Authentication uses signed, HttpOnly cookies, scrypt password verification, same-origin write checks and a database login guard. The existing panel already supports products, prices, sections, promotions, media upload, draft/publish and revision restore. This change extends those features without replacing the data model or running production migrations.

Observed gaps: no PNG action-button system; overlapping desktop/mobile/typography overrides bypassed CMS theme values; media had no searchable categorization/alt editor; preview CMS writes were not explicitly isolated. Kiosk, tracking and several legal/info pages remain placeholders in the existing project. Product prices/promotions are marked as examples. These are retained rather than presented as completed commerce capabilities.

## Implemented

- Dark editorial storefront: one cinematic hero image/video, Playfair headings with Cyrillic, copper accents, rectangular food photography, responsive cards and mobile navigation.
- Appearance editor: background, surfaces, text, accent, body/heading font, radius, spacing, shadows, motion, card/button styles. Storefront uses one theme layer; legacy color controls route to Appearance.
- Eight configurable action slots: hero primary/secondary, header assistant/cart, product quick-add, product detail add, assistant section CTA, checkout submission.
- Standard/PNG modes. Original route, event handler, form submission, disabled state and accessible label remain in the component. PNG controls: upload/replace/remove/reset, optional hover/active/disabled assets, desktop/tablet/mobile dimensions, aspect ratio, alignment, fit, opacity, scale, brightness, glow, shadow, transition duration, press animation. Missing images fall back to the original accessible label.
- PNG reference allowlist and server verification against `cms_media.mime`, MIME/signature/dimension upload validation. Configuration cannot define arbitrary JavaScript or change payment handlers.
- Live button sample and existing same-origin iframe preview; Save Draft / Preview / Publish / revision restore continue to persist complete configurations in the existing JSON snapshot.
- Section title/description/background/image/alignment controls and uploaded logo support.
- Media search, category, alt metadata and reversible removal from the library. Used draft assets cannot be removed; physical files are retained to preserve published content and history.
- Default read-only CMS previews. `CMS_ISOLATED_PREVIEW=true` enables CMS writes only after an operator supplies a separate preview database and Blob configuration. Never set this against production resources. Ordinary previews continue reading published production content.

## Owner workflow

1. Open `/admin` and sign in with the existing account.
2. Open **PNG бутони**, choose the action and upload a PNG (max 4 MB; max 8192 px per side).
3. Set the responsive sizes and effects. Use **Преглед в сайта** to see the draft.
4. **Запази чернова** persists without changing the public document. **Публикувай** updates the published snapshot.
5. **Върни стандартния бутон** restores the native visual. Save and publish when ready.

Use **Външен вид** for the theme, **Визуален редактор** for sections, and **Медийна библиотека** for metadata. The same PNG slot for product quick-add intentionally applies across all product cards; each card retains its own product-specific action.

## Verification and release boundaries

- `npm run test:cms`: schema compatibility, responsive config, reset, invalid PNG sources, dimensions, effects, handler injection, unknown slots, theme injection, metadata persistence and existing validation rules.
- `npm run check:files`: existing repository checks.
- `npm run build`: production compilation and TypeScript checks.
- Full authenticated upload → database → draft → publish → public click requires an isolated Neon/Blob preview environment. It must not be tested against production.
- No production data, payment settings or production branch are changed by this work. No migrations are required for these JSON extensions.
- Vercel connector project inspection returned 403 for the project's team; deployment status must be confirmed through the Git integration or corrected connector access.

## Known limits

Media removal is deliberately reversible rather than physical Blob deletion. Arbitrary drag-and-drop page building, custom JavaScript actions and arbitrary remote PNG URLs are not supported. Background images remain decorative. Payments were preserved, not activated or transacted. Lighthouse scores are targets, not measured results.
