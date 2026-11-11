# Common real-world failure patterns

Section numbers in the Fix column refer to script-blocking.md.

**Last verified: 2026-11-11.** Confidence markers: **[V]** verified that day against the primary source or a live test; **[3P]** third-party or vendor write-ups only; **[M]** from prior knowledge, confirm on the target site; **[?]** uncertain or sources conflict. Technical reference, not legal advice. Prices and plan limits change often: re-check before quoting them.

Section numbers are shared across the technical references: 1.x is consent-signals.md, 2.x consent-tools.md, 3.x script-blocking.md, 4.x and 5 testing-tools.md, 6 failure-patterns.md.

## 6. Common real-world failure patterns

| # | Pattern | How it shows up | Fix |
|---|---|---|---|
| 1 | **CMP installed, GTM fires tags regardless** | Banner present; pre-consent capture shows GA4/Meta/LinkedIn hits. GTM tags have "No additional consent required" and "All Pages" triggers | Consent checks per tag; enable consent overview; CMP GTM template on Consent Initialization |
| 2 | **Banner is cosmetic** (notice-only, or hidden via CSS) | Plugin in "banner only" mode (Cookie Notice unconnected, old CookieYes/GDPR Cookie Consent without script blocking); or `#cookie-banner{display:none}` in custom CSS / theme customiser, so users never get a choice | Enable blocking; remove CSS override; verify with scenario 1 |
| 3 | **Consent default set after the tag loads** | `gcd` contains `m`/`n`, or first hit has `l`; dataLayer shows `gtm.js` before `consent default`. Causes: CMP loaded async/deferred, default placed in a GTM Custom HTML tag on All Pages, optimisation plugin reordering | Inline default at top of `<head>`; exclude from defer/delay; Consent Initialization trigger |
| 4 | **Consent mode v1 only** | `gcd` shows `l` for positions 3–4; EEA remarketing audiences stopped growing since March 2024 | Add `ad_user_data` / `ad_personalization`; update CMP/template |
| 5 | **Hardcoded pixel in theme header** | `fbq('init')` / gtag snippet in `header.php`, `functions.php` (`wp_head` hook), theme options, WPCode, Elementor custom code, Shopify `theme.liquid`. CMP auto-blocker does not recognise the inline variant | Remove and re-add through the CMP/GTM, or wrap as `text/plain` with category |
| 6 | **Duplicate tracking** | Same GA4 ID via Site Kit + MonsterInsights + GTM; one copy is consent-gated, the others are not | Single owner per tag |
| 7 | **Plugins that inject GA or pixels on their own** | MonsterInsights, Site Kit without consent mode, WooCommerce integrations, Jetpack Stats, page builders' integrations, hosting dashboards | Enable each plugin's consent integration (WP Consent API) or block via CMP service rule |
| 8 | **YouTube/Maps/social embeds** | Pre-consent requests to `youtube.com`, `doubleclick.net`, `maps.googleapis.com`, `platform.twitter.com`; `nocookie` domain treated as sufficient | Placeholders (3.4) |
| 9 | **Google Fonts / reCAPTCHA / Gravatar site-wide** | `fonts.gstatic.com`, `www.google.com/recaptcha`, `gravatar.com` on every page | Self-host; scope reCAPTCHA to form pages or replace |
| 10 | **Server-side tagging bypass** | Clean browser capture, but Purchase events arrive in Meta/GA4 for rejecting users (CAPI plugin, sGTM, Shopify/Woo server events, Klaviyo/HubSpot sync) | Propagate consent to the server; test with vendor debuggers |
| 11 | **Pre-enabled "legitimate interest" toggles / pre-ticked categories** | Second layer has LI toggles on by default for advertising purposes, or analytics pre-checked; "Save" then stores consent | Default off; remove LI for purposes 2–6 where consent is required; no pre-ticked boxes (Planet49) |
| 12 | **No reject on first layer / dark patterns** | Only "Accept" and "Settings"; reject is a low-contrast link; closing "X" counts as accept; scrolling counts as consent | Equal-weight Reject on first layer |
| 13 | **Reject does not persist or does not block** | After reject, cookies remain from an earlier accept; banner re-appears on every page; choice stored only in sessionStorage | Clear cookies on reject; persist denial |
| 14 | **Withdrawal does nothing** | No re-open control; or toggling off leaves `_ga`/`_fbp` in place and loaded scripts keep sending | Auto-clear cookie list per category + reload; vendor revoke calls |
| 15 | **Cache serves wrong state** | EU visitors get the US (opt-out/no banner) variant or vice versa; banner missing on cached pages; results differ between first and second load | Client-side geo; vary cache; purge after changes |
| 16 | **Delay-JS false pass** | Scanner reports clean; real users with a mouse get every tracker before the banner appears | Exclude CMP from delay; test with input simulation |
| 17 | **CMP loads late** | Async CMP script from a third-party CDN; tags race it and win on fast connections; `wait_for_update` too short or missing | Inline defaults; load CMP early; self-host where possible |
| 18 | **WooCommerce order attribution without WP Consent API** | `sbjs_*` cookies on first page view | Install WP Consent API-compatible CMP or disable the feature |
| 19 | **GPC ignored** | US-CA run with `Sec-GPC: 1` shows identical tracking and no acknowledgement; CMP plan lacks GPC (CookieYes below Pro, Complianz free, CookieAdmin free) | Enable/upgrade; send LDU and restricted-processing flags |
| 20 | **Geo rules too narrow** | Banner only for EU-27: UK, CH, EEA (IS/LI/NO), Brazil, Québec visitors get nothing | Fix region list; default to opt-in when country unknown |
| 21 | **Plan limit exceeded** | SaaS CMP stops blocking or shows nothing after quota (Cookie Notice 1,000 visits, CookieYes 5,000 PV) | Upgrade or switch to a self-hosted CMP |
| 22 | **Cookie policy out of date** | Declared list from an old scan; new plugins added since; scanner could not reach logged-in/checkout pages | Re-scan including checkout; schedule scans |
| 23 | **Multiple CMPs / leftovers** | Two banners, or an old CMP's cookies and scripts still present; consent states disagree | Remove leftovers; one source of truth |
| 24 | **Consent wall on legal pages** | Modal banner blocks reading the privacy policy/imprint without choosing | Exclude legal pages from the modal overlay |
| 25 | **Admin-only testing** | CMP hidden for logged-in admins, so the site owner never sees the broken banner | Test logged out / incognito / different role |
| 26 | **Subdomain and checkout gaps** | Consent given on `www` not recognised on `shop.` or a hosted checkout, which then tracks by default | Cookie domain `.example.com`; cross-domain consent; verify on every host |
| 27 | **Tracking in emails/links treated as out of scope** | `_hsenc`, `mc_eid`, `fbclid`, `gclid` processed on landing before consent (e.g. HubSpot identifies the contact immediately) | Gate identification scripts as well |

## 7. Items not verified today

- Microsoft's own UET consent mode help page (JS-rendered): code and the 5 May 2025 date come from concordant CMP vendor docs.
- TikTok `holdConsent`/`grantConsent`/`revokeConsent` and any TikTok limited-data-use flag: third-party docs only.
- Hotjar/Contentsquare consent API names: sources conflict.
- TCF v2.4 dates: concordant vendor sources (iubenda, CookieYes, Cookie-Script, Usercentrics/Cookiebot product pages); IAB Europe's own announcement and Google's v2.4 position not retrieved.
- Exact number and list of US states mandating GPC: sources give 10–13.
- Google's publisher-facing certified CMP list (distinct page from the partner-program tiers) was not readable; tiers above are from the partner program site.
- Pricing not retrievable: Borlabs tiers (only "from €49"), Osano self-service, OneTrust, Didomi, Usercentrics Advanced, CookieAdmin Pro, WPConsent Pro, hu-manity Professional, iubenda free-plan limits.
- Section 2.3 cookie names/selectors/APIs and the WordPress/WooCommerce cookie tables are from prior knowledge; confirm per installed version.
- Shopify legacy checkout script retirement dates; `pscdl`/`dma_cps` parameter semantics; hCaptcha cookie behaviour; Disconnect and EasyList licence details.
