# Consent tools compared, with integration cheat sheet and known gotchas

**Last verified: 2026-11-11.** Confidence markers: **[V]** verified that day against the primary source or a live test; **[3P]** third-party or vendor write-ups only; **[M]** from prior knowledge, confirm on the target site; **[?]** uncertain or sources conflict. Technical reference, not legal advice. Prices and plan limits change often: re-check before quoting them.

Section numbers are shared across the technical references: 1.x is consent-signals.md, 2.x consent-tools.md, 3.x script-blocking.md, 4.x and 5 testing-tools.md, 6 failure-patterns.md.

## 2. Consent management platforms

Sources: WordPress.org plugin pages and vendor pricing pages read 2026-11-11 unless marked. "G-cert" = on Google's CMP partner list (section 1.2). "Auto-block" = blocks unknown third-party scripts without manual tagging.

### 2.1 WordPress plugins

| Plugin (version, installs) | Hosting model | Free tier | Paid (ballpark) | G-cert | TCF | GPC | Geo rules | Auto-block | Consent log | GCM v2 |
|---|---|---|---|---|---|---|---|---|---|---|
| **Complianz** (7.5.7, 1M+) | Self-hosted, GPL | No pageview limits; banner, scan, script/iframe blocking, proof of consent | $59/yr 1 site, $179 5 sites, $399 25 sites | Silver | Premium (CMP ID 332) | Premium (DNT + GPC) | Premium | Yes (known services + Script Center) | Proof of consent free; per-user records premium | Yes; dedicated setup listed under premium [?] |
| **CookieYes** (3.5.8, 1M+) | Plugin + optional SaaS app | 5,000 pageviews/mo, 100 pages/scan | $10 / $25 / $55 per month per domain (100k / 300k / unlimited PV) | Gold | Pro+ (v2.4) | Pro+ | Pro+ | Yes | Yes (all plans) | Yes, basic + advanced |
| **Cookiebot / Usercentrics** | SaaS (`consent.cookiebot.com/uc.js`) | 1 domain, ≤50 subpages, 1 language | €7 (≤50 subpages), €15 (≤350), €30 (≤3,500), €50 (≤7,000), €90 (more) per domain/month | Gold | Premium (v2.4) | Yes | Premium | Yes (`data-blockingmode="auto"`) | Yes, 12 months | Yes; also UET and Amazon signals |
| **Real Cookie Banner** (5.4.3, 100k+) | Self-hosted | Unlimited services/blockers, consent documentation; few templates | €59/yr 1 site, €89 3, €129 5, €229 10, €299 25 | No | PRO | Not stated (honours DNT) [?] | PRO | Template/rule based content blocker; scanner suggests services | Yes (in WP DB) | PRO |
| **Borlabs Cookie 3** | Self-hosted, no free version | None | From €49/yr | No | Yes ("certified and compatible with TCF v2.4") | Not stated [?] | EU / non-EU restriction | Scanner + script/style and content blockers (package library) | Yes | Yes, basic + advanced |
| **iubenda** | SaaS + plugin | Free plan exists; limits not published on pricing page [?] | €4.99 / €19.99 / €79.99 per site/month (25k / 50k / 150k PV, overage €0.05 per 1k) | Gold | All paid plans | [M] yes | Advanced+ | Yes (plugin parses output; autoblocking in SaaS) [M] | Yes | Yes (incl. free) |
| **Termly** | SaaS + plugin | 10,000 banner views/mo, quarterly scans, 1 policy | $10–14 Starter (50k views), $15–20 Pro+ (unlimited) per site/month | Gold | Pro+ (2.3 listed) | Not stated [?] | Pro+ | Yes (all plans) | Pro+ | Basic on Free/Starter, advanced on Pro+ |
| **CookieAdmin** (1.2.6, 400k+, Softaculous) | Self-hosted | Banner, basic scan, categories | Pro price not published on plugin page [?] | No | No | Pro | Pro | Content blocking is Pro | Pro | **Pro only** (Google + Clarity) |
| **WPConsent** (1.2.0, 200k+, WPBeginner/Awesome Motive) | Self-hosted | GCM v2, Clarity consent mode, auto script blocking, scanner, GPC, WP Consent API | Flat annual licence, price not on plugin page [?] | No | Pro (v2.3 listed) | Free | Pro | Yes | Pro | Yes (free) |
| **Cookie Notice / Compliance** (3.1.18, 800k+, hu-manity) | Banner-only local, or SaaS-connected | Connected free: **1,000 visits/month, then auto-blocking pauses** | Professional plan, price not on plugin page [?] | No | Not stated | Yes (connected) | Yes (admin portal) | Yes (connected only) | Yes (connected) | Yes; Meta/Microsoft modes paid |

Selection heuristics:

- AdSense / GAM publisher with EEA traffic → must be Google-certified with TCF: CookieYes Pro, Cookiebot Premium, iubenda, Termly Pro+, Complianz Premium (silver tier; confirm on the publisher list).
- Privacy-conscious client, no ads, wants data on own server → Complianz, Real Cookie Banner, Borlabs, WPConsent (all store consent locally; no third-party request for the banner itself).
- Tiny budget, GA4 + a pixel → Complianz free or WPConsent free (both do GCM v2 and blocking without pageview caps).
- Multi-platform client (WP + Shopify + app) → SaaS CMP (Usercentrics, CookieYes, iubenda, Didomi, OneTrust).

### 2.2 Platform-agnostic

| CMP | Model / licence | Free tier | Paid | G-cert | TCF / GPP / GPC | Geo | Auto-block | Consent log | GCM v2 |
|---|---|---|---|---|---|---|---|---|---|
| **vanilla-cookieconsent** (orestbida) v3.3.0, 3 Nov 2026 | OSS, MIT, self-hosted | Fully free | — | No | None built in (read `navigator.globalPrivacyControl` yourself) | None (implement server-side or via edge header) | No: manual `type="text/plain" data-category` | No (hook `onConsent` to your own endpoint) | Manual, via callbacks; docs have a recipe |
| **Klaro** 0.7.21 (KIProtect) | OSS, BSD-3; last repo push Mar 2025 (slow maintenance) | Free | Hosted paid plan | No | No | No | No: manual `type="text/plain" data-type data-name data-src` | Hosted only | Via GTM tutorial |
| **c15t** 3.2.2, Nov 2026 | OSS, Apache-2.0; needs a backend (self-host or Inth cloud) | OSS free; Inth sign-up free | Inth plans (not checked) [?] | No | GCM v2, **TCF 2.4, GPP, GPC** per README | Yes (policy per region, resolved server-side) | Script loader with 40+ vendor integrations (declarative, not heuristic) | Yes with backend; `local()` mode keeps none | Yes (`@c15t/integrations`) |
| **Cookie-Script** | SaaS; self-hosted code option | 10,000 PV/mo, 10 pages scanned | €9 / €19 / €29 per domain/month | Gold | TCF on Plus; GPP/GPC not on pricing page [?] | Lite+ | Standard+ | Plus | Yes |
| **Axeptio** | SaaS | 200 visitors/mo | $7.50, $29, $69, $129 per month, Enterprise custom | Gold | TCF from Small | Not stated [?] | Service-based [M] | Yes (all plans) | Yes |
| **Osano** | SaaS | 30-day trial; self-service plans exist (pricing not retrievable today) [?] | Mid-market, sales-led [M] | Silver | TCF, GPP, GPC [M] | Yes [M] | Yes (classifies and blocks) [M] | Yes [M] | Yes [M] |
| **OneTrust** | SaaS, enterprise | None meaningful | Sales quote [M] | Gold | TCF, GPP, GPC [M] | Yes, granular geolocation rule groups | Yes (auto-blocking `otBlock`), plus manual `class="optanon-category-C0002"` [M] | Yes | Yes |
| **Didomi** | SaaS, enterprise | None | Sales quote [M] | Gold | TCF, GPP, GPC [M] | Yes | Vendor-based; `type="didomi/javascript" data-vendor=` [M] | Yes | Yes |
| **Usercentrics** (non-Cookiebot product) | SaaS | Via Cookiebot free | Sales / session-based | Gold | TCF 2.4, GPP [M] | Yes | Yes (Smart Data Protector) [M] | Yes | Yes |

Consent-O-Matic is a browser extension for users, not a CMP (see section 4 for its rule list).

### 2.3 Integration cheat sheet (for audits and tests)

All [M] unless marked; confirm on the installed version.

| CMP | Consent cookie / storage | Manual block markup | JS API / events |
|---|---|---|---|
| Complianz | `cmplz_statistics`, `cmplz_marketing`, `cmplz_preferences`, `cmplz_functional`, `cmplz_banner-status`, `cmplz_policy_id`, `cmplz_consented_services` | `<script type="text/plain" data-category="statistics" data-service="...">` | `cmplz_has_consent('marketing')`, `cmplz_accept_all()`, `cmplz_deny_all()`; events `cmplz_status_change`, `cmplz_enable_category` |
| CookieYes | `cookieyes-consent` (`consent:yes,analytics:no,...`) | `data-cookieyes="cookieyes-analytics"` | `getCkyConsent()`, `performBannerAction('accept_all')`, `revisitCkyConsent()`; event `cookieyes_consent_update` |
| Cookiebot | `CookieConsent` | `type="text/plain" data-cookieconsent="statistics"`; opt out of auto-blocking with `data-cookieconsent="ignore"` | `Cookiebot.consent.marketing`, `Cookiebot.renew()`, `Cookiebot.withdraw()`; events `CookiebotOnAccept`, `CookiebotOnDecline`, `CookiebotOnConsentReady` |
| OneTrust | `OptanonConsent`, `OptanonAlertBoxClosed` | `type="text/plain" class="optanon-category-C0004"` | `OnetrustActiveGroups`, `OptanonWrapper()`, `OneTrust.ToggleInfoDisplay()`; test params `?otgeo=gb`, `?otgeo=us,ca` (comma for country,state), `?otreset=true` |
| Usercentrics | localStorage `uc_settings`, `uc_user_interaction` | `type="text/plain" data-usercentrics="Google Analytics"` | `UC_UI.acceptAllConsents()`, `UC_UI.denyAllConsents()`, `UC_UI.showSecondLayer()`; event `UC_UI_INITIALIZED` |
| iubenda | `_iub_cs-{id}`, `_iub_cs-{id}-granular` | `type="text/plain" class="_iub_cs_activate" data-iub-purposes="4"` | `_iub.cs.api.openPreferences()`, `_iub.cs.api.isConsentGiven()` |
| Didomi | `didomi_token`, `euconsent-v2` | `type="didomi/javascript" data-vendor="c:xyz"` | `Didomi.getUserStatus()`, `Didomi.preferences.show()` |
| Real Cookie Banner | `real_cookie_banner-*` | Content blocker rules (server-side rewrite) | `window.consentApi.consent('service-unique-name').then(...)` |
| Borlabs 3 | `borlabs-cookie` | Shortcode / package based | `BorlabsCookie.Consents.hasConsent('service-id')` [?] |
| vanilla-cookieconsent v3 | `cc_cookie` | `type="text/plain" data-category="analytics" data-service="..."` (prefix `!` to run when disabled) [V] | `CookieConsent.acceptedCategory('analytics')`, `acceptedService()`, callbacks `onFirstConsent`, `onConsent`, `onChange` [V], `showPreferences()` |
| Klaro | `klaro` cookie or localStorage | `type="text/plain" data-type="application/javascript" data-name="ga" data-src="..."` [V] | `klaro.show()`, `klaro.getManager().consents` |
| Shopify native | via Customer Privacy API | Web pixels sandbox | section 1.9 |

### 2.4 Known gotchas

- **Page cache serving the wrong banner state.** Any CMP that decides server-side (geo banner type, "has consent" class, PHP `wp_has_consent`) breaks under full-page caching: the first visitor's variant is cached for everyone. Fixes: resolve geo client-side/AJAX (Complianz premium does this), vary cache on a country header (`CF-IPCountry`, `X-Geo-Country`), or exclude the consent endpoint from cache. Complianz 7.5.6 fixed a cached-banner bug and 7.5.7 added a 500 ms `wait_for_update` (filter `cmplz_gtag_wait_for_update`) [V, changelog]. Real Cookie Banner auto-flushes common page caches after settings changes [V].
- **SaaS free-tier cliffs.** Cookie Notice connected-free pauses auto-blocking after 1,000 visits/month [V]; CookieYes free stops at 5,000 pageviews; Termly free at 10,000 banner views; Cookiebot free at 50 subpages. A site that grows silently becomes non-compliant. Check the plan against real traffic during the audit.
- **Auto-blocking misses.** Heuristic blockers only know scripts in their database. Misses: inline scripts injected by themes, scripts added via `document.write` or other loaders, CSS `@import`/`url()` to Google Fonts, `<link rel=preconnect|dns-prefetch|preload>`, `<img>` tracking pixels, `<noscript>` pixels, service workers, anything concatenated by an optimisation plugin (section 3.6).
- **Auto-blocking must load first.** Cookiebot's `uc.js` (auto mode), OneTrust auto-block (`otBlock`) and similar must be the first script in `<head>`, synchronous, and excluded from defer/delay/combine. Performance plugins routinely break this.
- **Performance.** SaaS CMPs add 50–150 KB of JS plus a third-party connection; TCF vendor lists add more. Banners that insert into document flow cause CLS; large banners can become the LCP element.
- **Double consent mode.** Site Kit consent mode + CMP consent mode, or GTM CMP template + plugin snippet, produce duplicate or late defaults. Pick one owner.
- **Geo off by default / paid.** Most free tiers show one banner type worldwide. That is safe (opt-in everywhere) but costs conversions; the reverse (opt-out banner everywhere) is the dangerous misconfiguration.
- **Consent logs** are often paid (Termly Pro+, CookieAdmin Pro, WPConsent Pro, Cookie-Script Plus). No log means no proof of consent under GDPR Art. 7(1).
