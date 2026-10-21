# LILY DRIVE — ULTIMATE CINEMATIC REDESIGN
## MASTER EXECUTION PROMPT FOR ASTRA WORK

### YOUR ROLE

Act as an award-winning Creative Director, Principal UI/UX Designer, Senior Next.js Engineer, Cinematic Motion Designer, Luxury Brand Designer, Digital Art Director, and Web Performance Specialist.

You are responsible for delivering an extraordinary, production-quality transformation of my EXISTING restaurant website.

This is not a basic redesign. This is a complete artistic transformation of the public-facing visual experience, with an uncompromising level of craftsmanship, precision, beauty, sophistication and technical excellence.

**Your mission: Create a visually spectacular LILY DRIVE website that closely reproduces the supplied APEX DRIVE reference and, wherever appropriate, improves upon its visual quality.**

Approach every detail as if you were designing a flagship digital experience for a globally recognized premium restaurant brand.

Do not produce a generic template. Do not settle for an approximation. Do not stop at the first acceptable result.

---

## 1. PROJECT INFORMATION

**Existing production website:**
https://apex-drive-bulgaria.vercel.app/

**Existing GitHub repository:**
https://github.com/gyursel/restorant.git

**Primary visual reference:**
https://new-look-site-1.preview.emergentagent.com/#menu

**New brand identity:**
LILY DRIVE

**Important:** Two screen-recording videos are supplied as visual references:

- Desktop website walkthrough — `output.mp4`
- Mobile website walkthrough — `SVID_20261019_204646_1(1).mp4`

Study both recordings carefully, including navigation, scroll behavior, section transitions, button interactions, animations and responsive layouts.

Use the actual reference website when accessible. If interactive inspection is restricted, rely on the recordings and other supplied visual evidence. Never invent observations that you have not verified.

The existing repository is the ONLY codebase to redesign.

DO NOT create a replacement application or rebuild the business infrastructure from scratch.

---

## 2. ABSOLUTE SCOPE RESTRICTIONS — NON-NEGOTIABLE

THIS IS A PUBLIC-FRONTEND VISUAL REDESIGN ONLY.

Preserve the complete existing business infrastructure and application functionality.

STRICTLY FORBIDDEN:

- No backend modifications.
- No server changes.
- No database schema changes or migrations.
- No API endpoint changes.
- No CMS modifications.
- No administrator panel redesign.
- No admin route changes.
- No authentication modifications.
- No changes to payment or ordering business logic.
- No infrastructure or hosting configuration changes.
- No environment variable modifications.
- No production deployment changes.
- No changes to Vercel project settings.
- No changes to third-party integration behavior.
- No changes to existing business data.

Preserve the existing menu data, prices, product IDs, categories, ordering workflows, integrations, administration features and functional behavior.

The administrator panel must remain visually and functionally EXACTLY as it is today.

Existing API contracts must remain unchanged.

If the project shares components or styles between its public website and administration, isolate the public-facing visual styling without affecting the admin interface.

Do not modify the main branch.

Create a separate development branch, such as:

`redesign/lily-drive-cinematic`

Do not merge, publish or modify the production deployment without explicit final approval.

If a proposed design effect requires altering protected infrastructure, do not make that change. Implement an equivalent visual effect within the allowed frontend scope instead.

---

## 3. VISUAL REFERENCE — EXTREME ACCURACY

The APEX DRIVE reference is the primary design benchmark.

Reconstruct its visual language with exceptional fidelity:

- Section composition and sequence.
- Hero layout and photographic framing.
- Navigation and header proportions.
- Typography, letter spacing and hierarchy.
- Spacing, alignment and visual rhythm.
- Product cards and category presentation.
- Buttons and micro-controls.
- Shadows, overlays and lighting.
- Colors and contrast.
- Scroll-driven appearance effects.
- Desktop and mobile responsiveness.

Analyze the supplied videos frame by frame where useful.

Understand not only how individual sections look, but also how they visually connect.

Preserve the reference's cinematic black, charcoal, silver, red and restrained warm-light aesthetic.

The target is near pixel-perfect visual fidelity to the reference, with thoughtful refinement where it clearly improves the result.

Do not blindly copy imperfections or sacrifice accessibility and usability for visual similarity.

---

## 4. BRAND IDENTITY — LILY DRIVE

The website must be branded primarily as:

**LILY DRIVE**

Replace the visible APEX DRIVE restaurant identity on the public website with LILY DRIVE.

Preserve the reference's striking metallic oversized hero typography, adapting it to the new brand name.

Design an impressive premium LILY DRIVE wordmark with:

- Sophisticated metallic depth.
- Beautiful gradients.
- Controlled specular highlights.
- Precise letter spacing.
- Premium typography.
- Excellent readability.
- Strong desktop and mobile presentation.

The word **APEX** may remain as a small, discreet, non-confusing decorative reference such as "APEX EDITION" if aesthetically appropriate and authorized by the owner.

APEX must not replace or compete with the main LILY DRIVE brand.

Do not introduce unsupported ownership, partnership or affiliation claims.

---

## 5. ULTRA-HIGH-QUALITY FOOD PHOTOGRAPHY

**THIS IS ONE OF THE MOST IMPORTANT REQUIREMENTS OF THE ENTIRE PROJECT.**

The website must feature breathtaking, premium, high-contrast food photography.

No ordinary low-quality stock imagery.

No blurry, poorly cropped, pixelated, washed-out or visually inconsistent images.

Food must look exceptionally realistic, fresh, delicious and irresistible.

Visual characteristics:

- Ultra-detailed textures.
- Rich, realistic colors.
- Beautifully illuminated ingredients.
- Sharp appetizing highlights.
- Deep controlled shadows.
- Premium commercial food-photography quality.
- Cinematic lens and lighting aesthetics.
- Natural-looking buns, cheese, meat, sauces and vegetables.
- Rich tonal separation.
- Beautiful dark backgrounds.
- Professional studio-level composition.
- Consistent visual direction across the website.

Pay special attention to realistic specular reflections on sauces and ingredients, controlled highlights on burger buns, and dimensional separation between food and background.

Images should evoke top-tier global fast-food advertising campaigns.

Prefer professionally licensed high-resolution assets or carefully produced original imagery. Do not assume that every image on the reference website is legally reusable.

Avoid artificial-looking food, distorted ingredients, excessive saturation, halos or aggressive sharpening.

### IMAGE PROCESSING AND DELIVERY

Provide appropriately sized responsive assets.

Use efficient modern formats such as AVIF or WebP when suitable.

Use the existing image optimization pipeline wherever possible.

Preserve high perceived sharpness without excessive file size.

Use properly composed source assets rather than stretching low-resolution images.

Ensure that imagery remains impressive on high-density desktop displays and modern smartphones.

Product thumbnails, cards, detail-page imagery and the hero must all feel part of one unified premium photographic art direction.

---

## 6. SLOW-MOTION CINEMATIC VIDEO BACKGROUND

Create an exceptionally beautiful, atmospheric, slow-motion video background.

**This is a signature design feature.**

The video should feel luxurious, immersive, fluid and almost hypnotic.

Visual direction:

- Premium dark cinematic atmosphere.
- Extremely subtle environmental movement.
- Slow-moving smoke, light, depth or atmospheric texture.
- Beautifully controlled red, amber and neutral highlights.
- Elegant cinematic depth.
- No chaotic particles.
- No rapid camera movement.
- No distracting effects.
- No abrupt transitions.
- No obvious short-loop repetition.

The video must move VERY SLOWLY.

Aim for a calm, film-like appearance with smooth, continuous motion.

It should feel like an expensive cinematic background, not an animated wallpaper.

The video should visually complement the main food photography and large metallic typography without competing with them.

### VIDEO IMPLEMENTATION

- Use a seamless, high-quality loop.
- Mute autoplay where allowed.
- Use `playsInline` for mobile support.
- Provide an attractive static poster frame.
- Avoid visible black flashes at loop boundaries.
- Protect text legibility with carefully designed overlays.
- Minimize decoding and rendering overhead.
- Avoid loading enormous unoptimized video files.
- Consider lighter mobile assets.
- Support `prefers-reduced-motion`.
- Provide graceful fallbacks when autoplay is blocked.

The background must never compromise smooth scrolling, loading speed or usability.

If the existing project has no suitable video, create or source an appropriate rights-cleared asset. Do not add a paid media-generation dependency without permission.

---

## 7. CINEMATIC SECTION TRANSITIONS

The transition system must feel like a professionally directed film.

When moving between major sections or switching public-facing views:

1. The current scene begins to soften.
2. The scene subtly darkens.
3. A controlled crossfade and elegant spatial transition occurs.
4. The incoming content appears.
5. The composition gradually brightens again.

The result should feel like a gentle cinematic fade-out/fade-in, combined with sophisticated scene continuity.

**Absolutely no abrupt section switching or harsh flashing.**

Suggested motion behavior:

- Soft opacity transitions.
- Carefully tuned easing curves.
- Smooth translate and scale.
- Subtle image depth changes.
- Elegant reveal masks where beneficial.
- Delicate background light transitions.
- Controlled layered parallax.
- Precisely choreographed staggered reveals.

Use premium, deliberate timings rather than fast, generic animations.

Longer, luxurious transitions are welcome where appropriate, but never make navigation sluggish or delay essential interactions.

The cinematic darkening must be subtle, beautiful and controlled — not a full black loading screen.

Do not trigger intrusive repeated fades during ordinary small scrolling movements.

Keep transitions consistent across the full experience.

---

## 8. PERFECT SHADOWS, GLOW AND LIGHTING

Design a coherent, professional lighting system.

Every visual effect must have a purpose.

Use:

- Layered soft shadows.
- Ambient contact shadows.
- Subtle directional lighting.
- Restrained red and amber glows.
- Metallic reflections.
- Depth through contrast.
- Fine edge highlights.
- Controlled glass reflections.
- Sophisticated hover illumination.

For product cards, combine subtle elevation with realistic shadow depth.

For important buttons, create a beautiful glow that gently intensifies on hover.

For typography, favor precision and legibility over excessive neon.

No cheap-looking bloom.

No childish animations.

No harsh glowing rectangles.

No uncontrolled bright borders.

No distracting visual noise.

All lighting should resemble an expensive digital product crafted by an elite design studio.

---

## 9. PREMIUM BUTTONS AND MICROINTERACTIONS

Recreate every important button style from the reference.

Pay attention to tiny visual details.

Requirements:

- Accurate size and proportions.
- Precise corner radius.
- Elegant shadows.
- Consistent typography.
- Sophisticated icon placement.
- Beautiful hover illumination.
- Subtle press feedback.
- Fluid state changes.
- Professional focus indication.
- Proper touch targets on mobile.

Buttons should feel physically responsive, with refined dimensional depth and smooth micro-animations.

Preserve all existing button actions and their business logic.

Never replace working controls with decorative, nonfunctional elements.

Maintain loading, disabled, active, error and success states.

---

## 10. HOMEPAGE AND PUBLIC SECTION DESIGN

Transform the existing public-facing pages into one cohesive, luxurious experience.

Match the reference's major visual sections and layouts as closely as practical while preserving all existing working features.

### HERO

Build an extraordinary full-width cinematic hero.

Emphasize:

- Oversized metallic LILY DRIVE lettering.
- Outstanding food photography.
- Powerful black/red contrast.
- Cinematic video atmosphere.
- Elegant supporting headline.
- Sophisticated primary ordering CTA.
- Seamless integration of typography and imagery.

The hero must immediately communicate quality, sophistication, confidence and appetite.

### NAVIGATION

Recreate the reference's premium dark navigation.

Use compact, carefully aligned elements and beautifully restrained hover behavior.

Maintain working navigation destinations and responsive behavior.

### MENU AND PRODUCT GRIDS

Create premium product cards with excellent photography, readable labels, clear prices and beautifully integrated existing ordering controls.

Pay particular attention to consistency across card heights, image crops, spacing, alignment and interactive feedback.

### PRODUCT DETAIL VIEWS

Use striking large food images with refined product information hierarchy.

Preserve ingredients, options, extras, prices, quantity controls and all existing behavior.

### DRIVE-THRU AND ORDER FLOW

Visually enhance the existing public ordering interfaces while preserving their logic and connected functionality.

### OTHER PUBLIC SECTIONS

Apply the same premium art direction to every existing public page and section, including locations, contact, informational content and footer.

Do not add nonfunctional placeholders or remove existing features.

---

## 11. MOBILE EXPERIENCE — FIRST-CLASS QUALITY

The mobile version is just as important as desktop.

Use the supplied mobile recording as a primary visual reference.

Recreate:

- Mobile hero composition.
- Mobile LILY DRIVE typography.
- Navigation behavior.
- Product card layouts.
- Spacing and visual hierarchy.
- Sticky controls where present.
- Menu category interactions.
- Compact buttons.
- Product detail presentation.
- Ordering layout and cart presentation.

Everything should feel intentionally designed for mobile rather than simply compressed from desktop.

Avoid horizontal overflow.

Avoid oversized imagery that obscures the content.

Maintain excellent touch usability.

Keep animations fluid on actual mobile devices.

The finished desktop and mobile experiences must look like two carefully crafted versions of the same luxury brand.

---

## 12. PERFORMANCE IS PART OF THE DESIGN

Beautiful design that stutters is unacceptable.

Target exceptionally smooth scrolling and responsive interactions, ideally near 60 FPS on capable devices.

Use GPU-friendly transform and opacity animations whenever practical.

Avoid unnecessary layout recalculations and heavy scroll handlers.

Optimize image decoding, video playback and rendering layers.

Use animation libraries only where they materially improve the result, while avoiding unnecessary dependencies.

Do not indiscriminately apply expensive blur filters, backdrop filters or large animated shadows.

Prevent layout shifts.

Preserve existing SEO, metadata, structured data and routing unless a public-facing brand display adjustment is required and does not change system behavior.

Ensure accessibility, semantic HTML, adequate contrast and reduced-motion support.

Optimize both visual fidelity and delivery performance.

---

## 13. IMPLEMENTATION STRATEGY

Work within the existing repository:

https://github.com/gyursel/restorant.git

First, study the existing application architecture.

Identify:

- Public-facing frontend pages.
- Reusable public UI components.
- Global and route-specific styles.
- Image and video assets.
- Existing navigation and ordering UI.
- Admin boundaries.
- Protected server and database code.

Determine the safest implementation strategy.

Modify only the public-facing presentation code and required visual media assets.

Keep server, database, authentication, API, CMS and administrator functionality untouched.

Preserve the existing technology stack and application architecture.

Do not introduce proprietary runtime dependencies on Astra, Emergent or other AI development environments.

The finished project must remain fully owned, buildable and deployable independently.

---

## 14. AUTONOMOUS EXECUTION — MINIMIZE INTERRUPTIONS

I do not want the task to become a long sequence of small approvals, repeated confirmations and unnecessary interruptions.

You are authorized to carry out the entire approved visual redesign autonomously in a separate development branch.

Plan internally, then execute.

Use professional judgment for artistic decisions.

Do not interrupt me to ask about every animation, shadow, font, image or spacing adjustment.

Perform implementation, visual comparison, debugging, optimization and necessary tests without repeatedly asking for permission.

Iterate internally until the work meets the visual and technical acceptance criteria.

Only ask for confirmation if a decision would:

- Affect protected functionality or infrastructure.
- Incur a new paid external cost.
- Require an unavailable license or critical credential.
- Modify production or the main branch.
- Involve another irreversible action.

Otherwise, complete the work.

Do not skip testing in the name of speed.

Avoid superficial shortcuts.

I prefer one carefully finished and properly validated result instead of many unfinished drafts.

---

## 15. FINAL VISUAL QUALITY CONTROL

Do not consider the task complete until you have reviewed the full public website.

Perform a structured comparison against the reference website and supplied videos.

Check:

- Hero fidelity.
- Typography.
- Desktop layout.
- Mobile layout.
- Image quality.
- Contrast.
- Shadows.
- Lighting and glow.
- Button behavior.
- Video smoothness.
- Section transitions.
- Scroll performance.
- Menu cards.
- Product detail layouts.
- Public order flow.
- Mobile navigation.
- Visual consistency.
- Existing functionality.

Fix visible defects before presenting the result.

Run the existing build, lint and test commands where available, and verify critical public ordering interactions without modifying production data.

Confirm through the final Git diff that protected backend, database and administration files remain unchanged.

Test appropriate desktop and mobile viewport sizes.

Provide a working isolated preview if supported by the existing deployment workflow and achievable without modifying production.

If a preview cannot be created safely, explain the limitation and provide the safest available local preview procedure.

Do not claim pixel-perfect fidelity or complete test coverage unless it has actually been verified.

---

## 16. FINAL DELIVERABLES

At the end, provide:

1. A completed visual redesign in the existing GitHub repository's separate development branch.
2. A working preview URL, if safely available.
3. A concise explanation of the visual transformation.
4. A summary of the improved photographic assets.
5. An explanation of the cinematic video background and transition system.
6. Confirmation of desktop and mobile validation.
7. Results of build, functional and performance checks.
8. A list of modified files.
9. Explicit confirmation that backend, database, administrator functionality and production remain untouched.
10. Any remaining limitations that require my approval.

Do not merge into main or deploy to production automatically.

---

## 17. FINAL CREATIVE DIRECTOR'S MANDATE

This project must exceed ordinary web design standards.

I care deeply about every single pixel, every shadow, every image, every interaction and every transition.

I want extraordinarily beautiful high-resolution food photography.

I want deep, professional contrast.

I want exquisite lighting.

I want smooth, slow, luxurious motion.

I want visually seamless transitions.

I want an extremely slow, cinematic background video.

I want premium buttons with remarkable microinteractions.

I want every section to feel carefully art-directed, cohesive and refined.

**Treat this as your most important luxury restaurant website design assignment.**

Use the APEX DRIVE reference as the foundation, preserve everything functional in my existing application, and transform the visual experience into something even more refined where possible.

I am not asking for a quick prototype.

I am asking for a finished, elegant, visually powerful, professionally engineered digital experience.

**THE FINAL BRAND IS LILY DRIVE.**

**THE DESIGN STANDARD IS WORLD-CLASS.**

**THE GOAL IS EXTRAORDINARY VISUAL QUALITY WITHOUT CHANGING EXISTING BUSINESS FUNCTIONALITY.**

Begin the analysis and execute the complete redesign autonomously within the approved scope.

## 18. Mandatory continuation protocol

One repository: https://github.com/gyursel/restorant.git
One development branch: `redesign/lily-drive-cinematic`. Sessions work sequentially.
GitHub, not account memory, is the source of truth. Never create competing redesigns.

Maintain this master plan, `LILY_DRIVE_HANDOFF.md`, and `LILY_DRIVE_PROGRESS.md` after every meaningful milestone. Save code, run relevant checks, commit, push, and verify the remote SHA. Never claim a push succeeded without remote confirmation.

Before stopping, preserve valid work, document incomplete changes/errors, record the latest verified checkpoint and exact next task, and report unsaved work. If interrupted, recover the latest successfully pushed checkpoint. Do not start another large task when capacity is low.

Every new session: fetch this branch; read all three documents; inspect commits and source; verify completed work; continue the next incomplete task. Do not restart or redesign verified sections without a specific reason. Preserve design, architecture, motion and photography decisions.

Handoff must identify branch and commit, completed work, changed files, incomplete tasks, next priorities, known errors, reference differences, tests/commands, resume instructions and protected areas.

Permanent requirements: LILY DRIVE branding; APEX DRIVE reference; exceptional high-resolution photography; cinematic slow video; controlled lighting; gentle fade-to-dark/light; excellent desktop/mobile presentation.

Protected: backend, servers, database, API, CMS, admin, authentication, ordering/payment logic, integrations, environment/hosting configuration, production and main. Later sessions cannot override these restrictions.

Final session owns remaining implementation and full acceptance verification. An account/session ending is not project completion. No production deployment or merge into main.

## Baseline and implementation boundaries

Baseline commit: `21b267c2f03f4f829e848928a43e8cf65b76118f`. No prior LILY branch existed on initial inspection.
Protected paths: `server/**`, `database/**`, `app/api/**`, `app/admin/**`, `src/cms/**`, `src/content/**`, `src/context/CartContext.jsx`, `src/lib/api.js`, `src/hooks/useMenu.js`, deployment/environment files and workflows. Shared root styles/layout must not change admin rendering. Keep product IDs, menu data, prices and actions unchanged. Public presentation changes must be scoped under the public site container.

Reference evidence: original attachment preserved verbatim in sections 1–17 above. Recordings named `output.mp4` and `SVID_20261019_204646_1(1).mp4` are referenced but not yet inspected in this session. Do not claim visual fidelity until inspected.

## Observed reference evidence (sampled video frames, 2026-10-19)
Desktop: full-width dark urban night hero; large metallic APEX lettering in upper central field; large burger to the right of compact serif headline; deep bottom fade; compact dark navigation; red rectangular primary action; four-column menu grid; dark compact image cards with red square add controls. Product detail shows large image left and product information right.
Mobile: centered serif brand between menu/cart controls; compact food hero above left-aligned serif text; stacked full-width actions; two-column product grid; horizontally arranged category controls; fixed bottom navigation with red active item; location map and hours cards. One sampled mobile frame shows overlapping navigation/content during transition: do not reproduce that defect.
These are sampled static observations only, not verified timing, smoothness, complete interaction behavior or exact colors. Screen recordings are reference evidence, not rights-cleared production media.

## Session 2 verified continuation — 2026-10-19
Recovered remote intake checkpoint `087dfd009197e87cdd98fd74fbc4cdaa84a876a9`; earlier no-remote statements in the intake history are now superseded by that observed branch. Public visual implementation completed for review in the same branch. Live reference and both supplied recordings inspected. See `LILY_DRIVE_DESIGN.md`, latest handoff and progress for actual implementation, provenance, test evidence and access limitations. No production or protected-system changes authorized or performed. Keep video-disabled CMS state intact.

## Verified remote delivery
Implementation pushed and independently fetched at `8fe675623ac3c3a01bdef1e57f4bfa0d60a7ad00`, parent `087dfd009197e87cdd98fd74fbc4cdaa84a876a9`. Remote root tree `2f7fe9067d16f75fc9154d1edc8c838f656e875a` exactly matched the locally reviewed index, including binary blob hashes. Remote main remained `21b267c2f03f4f829e848928a43e8cf65b76118f`. Protected-path audit and `git diff --cached --check` passed; 28 allowed files changed.

GitHub reported the automatic Vercel status for implementation commit as `failure`, with details at https://vercel.com/gyursels-projects/apex-drive-bulgaria/8Kn8oaohHaAfJnEPxXqrisNNCb6G . Deployment inspection also returned HTTP403, so the actual failure cause could not be read. Do not assume this is a code build error or an authentication build failure: neither is verified. No working hosted preview URL is available. No production deployment or configuration changes were made.

This documentation-only follow-up records the verified implementation checkpoint. Its own final SHA is available from the branch; no code changes follow the tested implementation.
