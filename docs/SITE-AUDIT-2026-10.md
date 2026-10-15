# APEX DRIVE BULGARIA — technical audit and optimization
Date: 2026-10-14 | Branch: `optimize/site-audit-2026-10`

## Scope and evidence
Source audited from GitHub `main` commit `3dec6cd4b0f8d8011c012cd3db17cd6e4f6c0b86`, covering Next.js frontend, CMS, Stripe Checkout, order management, media, UI components, and public routes. GitHub Actions runs `npm run build` and `npm run check:files` for this branch.

**Limitations:** Vercel Runtime Logs API returned 403 Forbidden for the connected account. Vercel Preview deployments for this branch are rate-limited (`Deployment rate limited — retry in 24 hours`). Therefore browser-based smoke tests, Lighthouse/PageSpeed values, Core Web Vitals (LCP, INP, CLS), live mobile simulations, production runtime errors, and API latency measurements **are not verified**. These are outstanding, not “passed”.

## Issues found and code changes
| Area | Finding | Remediation |
|---|---|---|
| Load sequence | Client-only startup first fetched `/api/content`, then loaded the main JS application | Server-side published CMS snapshot passed to client, removing the extra API fetch on normal page visits; editor draft continues using authenticated API |
| Bundle size | Cart, order-success and product pages imported eagerly with homepage | Lazy loaded route chunks with a Suspense fallback |
| SEO | No product-specific title/description, canonical or sharing images | CMS-driven Next metadata for homepage, menu, products, Open Graph and Twitter |
| Crawling | No `robots.txt` or `sitemap.xml` routes | Added both. Preview disallows indexing; production sitemap contains available published products only |
| Security headers | No application-level explicit clickjacking/referrer/nosniff/permissions headers | Added SAMEORIGIN (preserves same-origin admin editor iframe), nosniff, referrer and permissions policies |
| Status reconciliation | Reconciliation `RETURNING` omitted fulfillment status | Included `fulfillment_status` so customer status remains consistent |
| Checkout logs | Raw Stripe error message logged, potentially leaking sensitive integration detail | Logs only the error class |
| Customer experience | Public UI displayed `PAYMENT_DATABASE_URL` and Preview diagnostics when a live checkout failed | Generic user-facing outage message; server errors remain actionable in the appropriate logs |
| Product image | Detail used raw image source, inconsistent with media resolver | Use `mediaSrc` and async image decoding |
| Client-side metadata | BrowserRouter navigation reset or retained homepage tab title on product navigation | Keep title and description synchronized on route changes |

## Existing safeguards confirmed from source
- Live payments are gated by `ONLINE_ORDERING_ENABLED=true`, a configured isolated `PAYMENT_DATABASE_URL` and live key `sk_live_...`; this branch **does not enable** live payments.
- Checkout prices and quantities are checked on the server against published CMS products; signed Stripe webhook uses ID, amount and session match.
- Admin mutations require signed session and same-origin checks. Order status transitions require already-paid orders and write an audit event.
- CMS imagery already uses local WebP variants with explicit widths/heights and lazy loading for product cards.
- Cinematic background already respects reduced motion, data saver, intersection, and visibility.
- No production database schema or user data were modified.

## Work that still needs live validation
1. Restore Vercel access and wait for deployment rate limit. Build the Preview, test desktop, 390px mobile and 320px narrow view in Chrome and Safari.
2. Measure Lighthouse mobile/desktop, LCP/INP/CLS and slow-network load, especially actual CMS-uploaded MP4 size, poster timing and hero video bytes.
3. Run real login / logout, drafts, publishing, media upload, price editing, and order status workflow against permitted test data in Preview. Do not use customers' real data.
4. Review Terms of Sale, Privacy/GDPR, support contact, address, operating hours, refund/cancellation terms and allergen details before the restaurant launches. CMS seed includes placeholder details; verify **published live CMS** values rather than assuming seed is current.
5. Further architectural SEO improvement: public site content is still rendered in the browser. Dynamic metadata/sitemap help discovery, but complete HTML SSR for hero/menu/products remains a larger refactor.
6. Monitor Vercel Runtime Logs and Stripe webhooks after deployment; unavailable under current Vercel scope (403).

## Safe release procedure
- Do not merge before green GitHub Actions build and confirmed Vercel Preview smoke test; current rate limit prevents Preview validation.
- Publish only these source changes when Vercel allows deploy; no secret changes, no payment mode changes, no Neon writes.
- Keep Stripe Sandbox and unfinished live-onboarding as they are.
