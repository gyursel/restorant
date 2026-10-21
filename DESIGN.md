---
version: alpha
colors:
  ink: '#080a0b'
  surface: '#121415'
  primary: '#c92b25'
  paper: '#f5f0e8'
  muted: '#b3aba2'
typography:
  body:
    fontFamily: 'Onest Variable, sans-serif'
  editorial:
    fontFamily: 'Playfair Display, Georgia, serif'
  monument:
    fontFamily: 'Montserrat Variable, sans-serif'
rounded:
  control: '3px'
spacing:
  section: '96px'
components:
  primaryButton:
    backgroundColor: '{colors.primary}'
    textColor: '#ffffff'
---
# LILY DRIVE

## Overview
Public routes preserve the approved cinematic night food scene from commit 852d856. The large metallic wordmark is the signature. Admin routes are a quiet working surface in the same charcoal/crimson identity, with legible Bulgarian controls. Do not introduce a new restaurant layout or a copper admin theme.

## Colors
`src/cms/design.ts` is the runtime schema and maps saved appearance to --apx-* variables. `src/cms/lily-content.ts` upgrades only unmarked legacy defaults to LILY once. Marked owner edits are used verbatim. `src/lily-cinematic.css` consumes those variables; `app/admin/lily-admin.css` owns admin surfaces and emphasis. No generator owns these tokens.

## Typography
Onest for control text; Playfair Display for editorial headings; Montserrat for the monument. All have Cyrillic coverage. Preserve local font assets and readable fallbacks.

## Layout
Keep existing desktop sidebar, responsive single-column forms, desktop/tablet/phone preview sizes and natural document scrolling. Inspector and preview may scroll internally. Public hero composition and mobile product grid remain as approved.

## Elevation & Depth
Subtle edges and shadows separate food cards and panels. The hero photography supplies visual depth. No extra glow or ornamental dashboard graphics.

## Shapes
Rectangular public cards and compact admin controls. Runtime radius comes from appearance. Preserve existing administrative panel geometry.

## Components
Reuse Field, ImageField, Toggle, AppearancePanel and ButtonsPanel. EditorDialogs owns modal focus and dismissal. See UX-CONTRACT.md for behavior. Reduced motion uses the static hero poster.

## Do's and Don'ts
Show the same effective text, media and colors in admin and storefront. Do not replace deliberate edits at render time. Preserve menu IDs, prices, cart and payment behavior, authentication, production data and revision history. Assets and deployment are portable in GitHub.
