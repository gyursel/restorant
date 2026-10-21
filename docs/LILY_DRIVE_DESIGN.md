# LILY DRIVE public visual system

The existing Next.js application and its CMS snapshot remain authoritative. This is a presentation layer, not a replacement application.

## Direction and evidence
Reviewed the live reference in the browser and sampled both attached recordings (`output(1).mp4`, `SVID_20261019_204646_1.mp4`). The reference uses an urban night hero, giant metallic lettering, serif headlines, charcoal rectangular cards, crimson actions and two-column mobile menus. The new hero follows that composition with original imagery; it is not a pixel-identical copy.

## Isolation
`src/lily-cinematic.css` is imported by the public React application. Every selector is scoped to `.site-experience.lily-experience`. The native admin never mounts that container. Legacy mobile styles remain intact; explicit scoped rules resolve their old `!important` declarations. No shared root styles or root layout changed.

`public-copy.js` translates APEX to LILY only at public text access time. It never mutates the CMS object, product descriptions, names, prices, IDs or routes. URL-like copy is excluded. Existing `data-cms-key` markers are retained by `PublicText.jsx`. The public metadata/loading copy also uses LILY. `lily-appearance.js` remaps the former default charcoal/amber palette, retaining deliberately customized CMS colors. Existing CMS image, logo, video, PNG-button and appearance mechanisms remain connected.

## Tokens and composition
- Ink #080a0b, panels #121415, paper #f3efe8, crimson #c92b25; subtle amber highlights.
- Existing local Playfair Display for editorial headings; Montserrat for the monumental LILY; Onest for UI copy.
- Hero: metallic LILY plus spaced DRIVE, photographic scene beneath, serif headline left, retained functional CTAs.
- Rectangular product images/cards, quiet edge highlights, layered shadows and 44px add controls.
- 320/390px: centered wordmark, separated menu/cart buttons, image above editorial copy, full-width CTAs, two-column cards and fixed thumb dock.
- Route illumination uses opacity/translate only; existing section reveals are retained. No delayed navigation or full-screen loading curtain is introduced.

## New media and provenance
`public/images/lily-hero.webp`: original built-in OpenAI image generation, 1672×941, approximately 245 KiB. Not extracted from the screen recordings. Existing product photography is retained at its original resolution and mappings; no artificial upscale or unverified licensing claims.

Generation prompt: photorealistic premium drive-thru restaurant hero; rainy urban night, restrained teal and red bokeh, realistic sesame brioche beef cheeseburger with cheddar/lettuce/tomato/sauce in the right half, dark negative space left, commercial studio lighting, deep shadows, natural textures, no text/logos/watermarks. The generated source was converted to WebP; this is a generated photographic illustration, not a real restaurant photograph.

`public/videos/lily-atmosphere.mp4`: 1280×720, 24fps, 16 seconds, H.264 yuv420p, no audio, faststart, approximately 1.4 MiB. Mobile variant: 768×432, approximately 433 KiB. Original photographic scene with a tiny sinusoidal camera movement; not live-action slow-motion footage or independently moving smoke. Loop uses periodic movement rather than a reversing hard cut.

Reproduction filter: `zoompan=z='1.02+0.008*sin(2*PI*on/384)':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=384:s=1280x720:fps=24`, libx264 CRF23; mobile CRF26. First/last-frame motion displacement is deliberately tiny. Muted/inline loop, user pause, tab/intersection suspension, data-saver and reduced-motion fallback remain supported.

The existing CMS explicitly sets `video_enabled:false`. That decision is respected. The new local video replaces only the old missing default source when video is enabled; this session did not enable it in CMS or modify stored content.
