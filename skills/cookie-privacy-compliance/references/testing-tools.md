# Test matrix and extra tooling

The bundled scanner covers checks 1 to 5, 7, 10 and 11 of the matrix automatically. This file has the full matrix, manual snippets for the rest, geo simulation and third-party scanners for a second opinion.

**Last verified: 2026-11-11.** Confidence markers: **[V]** verified that day against the primary source or a live test; **[3P]** third-party or vendor write-ups only; **[M]** from prior knowledge, confirm on the target site; **[?]** uncertain or sources conflict. Technical reference, not legal advice. Prices and plan limits change often: re-check before quoting them.

Section numbers are shared across the technical references: 1.x is consent-signals.md, 2.x consent-tools.md, 3.x script-blocking.md, 4.x and 5 testing-tools.md, 6 failure-patterns.md.

## Contents

- 4. Audit tooling for a terminal agent
- 5. Verification / test matrix

---
## 4. Audit tooling for a terminal agent

### 4.1 Playwright capture script

Core lines tested today with Playwright 1.65 + Chrome (`Sec-GPC` header observed server-side, `navigator.globalPrivacyControl === true`, live `gcs`/`gcd` capture).

```bash
npm i playwright && npx playwright install chromium
```

```js
// audit.cjs — usage: node audit.cjs https://example.com [--gpc] [--click "text=Reject all"]
const { chromium } = require('playwright');
const url = process.argv[2];
const gpc = process.argv.includes('--gpc');
const ci = process.argv.indexOf('--click');
const clickSel = ci > -1 ? process.argv[ci + 1] : null;
const site = h => h.split('.').slice(-2).join('.');      // naive eTLD+1; use `tldts` for co.uk etc.

(async () => {
  const browser = await chromium.launch();                // { proxy: { server: 'http://de-proxy:8080' } } for geo
  const ctx = await browser.newContext({
    locale: 'en-GB', timezoneId: 'Europe/London',
    extraHTTPHeaders: gpc ? { 'Sec-GPC': '1' } : {},
  });
  if (gpc) await ctx.addInitScript(() =>
    Object.defineProperty(Navigator.prototype, 'globalPrivacyControl', { get: () => true, configurable: true }));
  const page = await ctx.newPage();
  const first = site(new URL(url).hostname);
  const reqs = [];
  page.on('request', r => {
    const u = new URL(r.url());
    if (!/^https?:$/.test(u.protocol)) return;
    reqs.push({ host: u.hostname, third: site(u.hostname) !== first, type: r.resourceType(),
      gcs: u.searchParams.get('gcs'), gcd: u.searchParams.get('gcd'), path: u.pathname.slice(0, 60) });
  });
  const snapshot = async label => {
    const cdp = await ctx.newCDPSession(page);
    const { cookies } = await cdp.send('Storage.getCookies');   // all cookies incl. third-party and HttpOnly
    const storage = await page.evaluate(async () => ({
      local: Object.keys(localStorage), session: Object.keys(sessionStorage),
      idb: indexedDB.databases ? (await indexedDB.databases()).map(d => d.name) : [],
    }));
    return { label,
      cookies: cookies.map(c => `${c.name} @${c.domain} exp=${c.expires > 0
        ? Math.round((c.expires - Date.now() / 1e3) / 86400) + 'd' : 'session'}`),
      storage,
      thirdPartyHosts: [...new Set(reqs.filter(r => r.third).map(r => r.host))].sort(),
      googleConsentHits: [...new Set(reqs.filter(r => r.gcs || r.gcd)
        .map(r => `${r.host}${r.path} gcs=${r.gcs} gcd=${r.gcd}`))] };
  };
  await page.goto(url, { waitUntil: 'load' });
  await page.mouse.move(200, 200); await page.mouse.wheel(0, 600);   // wake delay-JS plugins (section 3.6)
  await page.waitForTimeout(6000);                                    // let late tags fire; no banner click yet
  const out = [await snapshot('pre-consent')];
  if (clickSel) {
    reqs.length = 0;
    await page.locator(clickSel).first().click();
    await page.waitForTimeout(4000);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(5000);
    out.push(await snapshot('after ' + clickSel));
  }
  console.log(JSON.stringify(out, null, 2));
  await browser.close();
})();
```

Run a fresh context per scenario: (1) no interaction, (2) reject, (3) accept, (4) accept then withdraw, (5) `--gpc` with no interaction. Diff the snapshots.

Notes:

- `page.context().cookies()` returns cookies for all URLs in the context; the CDP `Storage.getCookies` call is the belt-and-braces version. Third-party cookies in Chromium may be partitioned or blocked depending on version/flags; run WebKit/Firefox as a cross-check.
- Storage inside cross-origin iframes: iterate `page.frames()` and evaluate in each.
- `page.on('request')` misses service-worker fetches; use `context.on('request')` and `context.serviceWorkers()`, or record a HAR: `browser.newContext({ recordHar: { path: 'pre.har' } })`.
- WebSocket and `sendBeacon` are captured as requests; beacons on unload need `page.close({ runBeforeUnload: true })`.
- Headless detection: some CMPs/tag managers suppress themselves for bots. If results look too clean, retry headed (`headless: false`) with a normal UA or `channel: 'chrome'`.
- Firefox alternative for native GPC: `firefox.launch({ firefoxUserPrefs: { 'privacy.globalprivacycontrol.enabled': true, 'privacy.globalprivacycontrol.functionality.enabled': true } })` [M].
- Puppeteer equivalents: `page.setExtraHTTPHeaders({'Sec-GPC':'1'})`, `page.evaluateOnNewDocument(...)`, `client.send('Network.getAllCookies')`.

Auto-clicking banners: try role/text selectors first, then known CMP IDs.

```js
const REJECT = ['#CybotCookiebotDialogBodyButtonDecline', '#onetrust-reject-all-handler', '.cky-btn-reject',
  '.cmplz-deny', '#didomi-notice-disagree-button', '.iubenda-cs-reject-btn', '[data-cc="reject"]',
  'button:has-text("Reject all")', 'button:has-text("Decline")', 'button:has-text("Only necessary")',
  'button:has-text("Alle ablehnen")', 'button:has-text("Tout refuser")'];
const ACCEPT = ['#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', '#onetrust-accept-btn-handler',
  '.cky-btn-accept', '.cmplz-accept', '#didomi-notice-agree-button', '.iubenda-cs-accept-btn',
  '[data-cc="accept"]', 'button:has-text("Accept all")', 'button:has-text("Allow all")'];
```
Selectors are [M]; banners inside shadow DOM or iframes (Usercentrics `#usercentrics-root`, Sourcepoint iframes) need `page.frameLocator` / piercing selectors. The CMP JS APIs in section 2.3 are more robust than clicking.

### 4.2 Geo simulation

| Method | Works for | Notes |
|---|---|---|
| HTTP/SOCKS proxy or VPN exit in the target region | Everything (CMP geo, Google regional defaults, Shopify regions) | Only fully reliable method. `chromium.launch({ proxy: { server, username, password } })`. Test at least DE/FR (opt-in), GB, US-CA (opt-out + GPC), US non-privacy state. |
| Playwright `geolocation` + `locale` + `timezoneId` | Almost nothing | Affects the Geolocation API and Intl only. CMPs geolocate by IP. A few CMPs use timezone as a hint. |
| CMP test overrides | That CMP's banner only | OneTrust `?otgeo=de`, or `?otgeo=us,ca` for a US state (comma, not hyphen: `us-ca` is silently ignored and the default template loads, which looks like a result and is not), `?otreset=true`. Confirm which rule loaded with `OneTrust.GetDomainData().GeoRuleName`. Complianz premium region override via query/filter [?]. Others: check vendor docs. |
| Spoofing `CF-IPCountry` / `X-Forwarded-For` | Origin behind a proxy you control, or local/staging | Edge networks overwrite these on production. Useful on staging to test server-side geo logic. |
| Cloud runners in other regions | Everything | GitHub Actions has no EU-pinned runners by default; use a small VM or a scanning service. |

Always record the egress IP's resolved country in the report (`curl -s https://ipinfo.io/country` through the same proxy) so results are reproducible. **A scan from a US IP that finds no banner proves nothing about EU behaviour, and vice versa.**

### 4.3 Open-source scanners

| Tool | Install / run | Licence | Notes |
|---|---|---|---|
| **EDPS Website Evidence Collector** v4.6.0 (26 Oct 2026) [V, <https://code.europa.eu/EDPS/website-evidence-collector>] | `echo @EDPS:registry=https://code.europa.eu/api/v4/projects/812/packages/npm/ >> ~/.npmrc && npm install --global @EDPS/website-evidence-collector`; `website-evidence-collector https://example.com --max 10 --depth 2`; `--no-output --json` for stdout; `--cookie-db ./file.json`; `--testssl`; `serve` for the web UI; `-- --ignore-certificate-errors` passes browser flags | EUPL-1.2 | **Requires Node ≥ 24.22.1.** Outputs HTML/JSON/YAML report, HAR, screenshots: cookies, localStorage, beacons (EasyPrivacy-matched), third-party hosts. Docker image: `code.europa.eu:4567/edps/website-evidence-collector/website-evidence-collector:latest`. Batch wrapper: <https://github.com/ovh/website-evidence-collector-batch>. Regulator-grade evidence format. |
| **Blacklight collector** 3.11.0 [V, <https://github.com/the-markup/blacklight-collector>] | `npm i @themarkup/blacklight-collector` | GPL-3.0 (copyleft: run it as a tool, do not embed in proprietary code) | Detects third-party trackers and cookies, canvas / font fingerprinting, session recorders, key logging, Meta pixel events, GA events. Options: `outDir`, `numPages` (3), `blTests`, `headless`, `captureHar`, `defaultTimeout`. |
| **webbkoll** (dataskydd.net) | Web: <https://webbkoll.5july.net> [M]; source moved to <https://codeberg.org/dataskydd.net/webbkoll> (GitHub repo archived Nov 2022) [V] | MIT | Elixir frontend + Node/Puppeteer backend. Checks HTTPS, CSP/HSTS/referrer policy, cookies, third-party requests. Quick second opinion. |
| **Consent-O-Matic** v1.1.5 [V, <https://github.com/cavi-au/Consent-O-Matic>] | Rules: `https://raw.githubusercontent.com/cavi-au/Consent-O-Matic/master/Rules.json` | MIT | 200+ CMP rule sets: `detectors` (`presentMatcher`, `showingMatcher`) and `methods` (`HIDE_CMP`, `OPEN_OPTIONS`, `DO_CONSENT`, `SAVE_CONSENT`). Categories: D storage/access, A preferences, B analytics, E content, F ads, X other. Use the JSON as a selector database for auto-reject, or load the extension in a persistent Chromium context. |
| **DuckDuckGo Tracker Radar Collector** | <https://github.com/duckduckgo/tracker-radar-collector> | Apache-2.0 [M] | Crawler with collectors for requests, cookies, API calls (fingerprinting), CMP detection. |
| Lighthouse / `web-vitals` | `npx lighthouse URL --only-categories=performance,accessibility --output=json` | Apache-2.0 | CLS/LCP/TBT with and without banner. |
| axe-core | `npm i @axe-core/playwright` | MPL-2.0 | Banner accessibility checks (section 5). |

```js
// Blacklight
const { collect } = require('@themarkup/blacklight-collector');
(async () => {
  const result = await collect('https://example.com', { outDir: './bl-out', numPages: 3, headless: true });
  console.log(Object.keys(result.reports));   // cookies, third_party_trackers, fb_pixel_events, session_recorders ...
})();
```

### 4.4 Classification databases and tracker lists

| Dataset | URL | Licence | Use |
|---|---|---|---|
| **Open Cookie Database** [V] | <https://github.com/jkwakman/Open-Cookie-Database> — raw CSV: `https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv` | **Apache-2.0** | 2,288 rows today. Columns: `ID, Platform, Category, Cookie / Data Key name, Domain, Description, Retention period, Data Controller, User Privacy & GDPR Rights Portals, Wildcard match`. Categories: Functional, Analytics, Marketing, Security, Personalization. `Wildcard match = 1` means prefix match (`_ga_`, `_gat_`). Actively maintained (last push 6 Nov 2026). |
| DuckDuckGo Tracker Radar [V] | <https://github.com/duckduckgo/tracker-radar> (`domains/`, `entities/`) | **CC BY-NC-SA 4.0** (non-commercial; commercial licence on request) | Per-domain owner, prevalence, fingerprinting score, cookie use, categories. Licence matters if the skill is used commercially. |
| DuckDuckGo tracker blocklists [V] | <https://github.com/duckduckgo/tracker-blocklists> (`web/tds.json`) | CC BY-NC-SA 4.0 | Ready-to-match blocklist. |
| EasyPrivacy / EasyList | <https://easylist.to/easylist/easyprivacy.txt> | GPL-3.0 / CC BY-SA 3.0 dual [M] | Adblock syntax; match with `@ghostery/adblocker` (`FiltersEngine.parse`) or `adblock-rs`. |
| Disconnect tracking protection | <https://github.com/disconnectme/disconnect-tracking-protection> (`services.json`, `entities.json`) | GPL-3.0 with additional terms [M][?] | Categorised (Advertising, Analytics, Social, Fingerprinting...). Used by Firefox ETP. |
| Ghostery TrackerDB | <https://github.com/ghostery/trackerdb> | CC BY-NC-SA 4.0 [M] | Domain → organisation → category. |
| Exodus Privacy | <https://reports.exodus-privacy.eu.org> | — | Mobile SDK trackers (apps, not web). |

```js
// Classify captured cookies with Open Cookie Database (csv-parse)
const { parse } = require('csv-parse/sync'); const fs = require('fs');
const db = parse(fs.readFileSync('open-cookie-database.csv'), { columns: true });
const classify = (name) => db.find(r => r['Wildcard match'] === '1'
  ? name.startsWith(r['Cookie / Data Key name']) : name === r['Cookie / Data Key name']);
// classify('_ga_ABC123') → { Platform: 'Google Analytics', Category: 'Analytics', ... }
```

Unknown cookies: treat as non-essential until identified (name pattern, setter script via `Network.responseReceivedExtraInfo` / initiator, value shape).

---

## 5. Verification / test matrix

Regimes: **opt-in** (EEA, UK, CH and similar: nothing non-essential before consent) and **opt-out** (US state laws: tracking allowed until opt-out, but GPC and "Do Not Sell/Share" must work; sensitive data may still need opt-in).

| # | Check | Opt-in expectation | Opt-out expectation | How |
|---|---|---|---|---|
| 1 | Pre-consent cookies/storage | Only strictly necessary (CMP cookie, session, CSRF, load balancer, cart). No `_ga`, `_fbp`, `_gcl_au`, `_clck`, `_hj*`, `sbjs_*`, `hubspotutk`, `_ttp` | Trackers may be present; banner/notice and opt-out link present | Script 4.1 fresh context, EU proxy; classify with Open Cookie Database |
| 2 | Pre-consent requests | No requests to tracker hosts. Advanced consent mode pings (`gcs=G100`) reported as a finding for the client to decide; fonts/CDN/embeds reported as IP leaks | n/a (but report) | `thirdPartyHosts` vs EasyPrivacy / Tracker Radar |
| 3 | Interaction-gated loaders | Same as 1–2 after mouse move, scroll, 10 s idle | — | Simulate input before snapshot (delay-JS plugins) |
| 4 | Reject parity | "Reject" on first layer, same visual weight and click count as "Accept". After reject + reload + 2 more pages: same as pre-consent state | Opt-out link ("Do Not Sell or Share" / "Your Privacy Choices") in footer on every page | Screenshot; compare button styles (size, contrast); count clicks |
| 5 | Accept works | Tags fire, cookies set, `gcs=G111`, `gcd` letters `r`/`v`; pixels send PageView once (no duplicates) | Same | Snapshot after accept; check duplicates in request log |
| 6 | Granular choice | Analytics-only → `G101`, no marketing cookies/hosts; marketing-only → `G110` | — | Use the CMP API to set categories |
| 7 | Withdrawal | Persistent, easy re-open control (footer link/floating icon) on every page. After withdrawing: consent `update` denied (`gcd` letter `q`/`u`), vendor revoke called, **first-party tracker cookies deleted**, no further tracker requests after reload | After opt-out: marketing tags stop or switch to restricted mode (Meta LDU, Google `ad_personalization` denied / restricted data processing) | Accept → withdraw → reload → snapshot. Third-party-domain cookies cannot be deleted by the site; note them |
| 8 | Consent record | CMP cookie holds categories, timestamp, policy/version ID; server-side log entry exists (ID, timestamp, choices, banner version, no raw IP needed). Lifetime ≤ 6–13 months per local guidance (CNIL: 6 months; many DPAs accept 12) | Opt-out stored ≥ 12 months before re-asking (CCPA) | Inspect cookie expiry; check CMP log/export |
| 9 | Re-prompt | Banner returns after expiry, after policy/vendor change (version bump), and not before. Declined users are not re-nagged on every page view | Same | Set clock forward (`page.clock` / edit cookie expiry); bump policy version on staging |
| 10 | GPC | Marketing denied without interaction; ideally reflected in the preference UI | **Sale/share/targeted ads opted out automatically**; visible confirmation ("Opt-out preference signal honoured"); persists for logged-in account; `/.well-known/gpc.json` served | `--gpc` run from a US-CA IP; check `usnat`/`usca` GPP `Gpc` and opt-out bits, Meta LDU flag, `gcd` |
| 11 | Consent mode signals | Default before first Google request (first hit already has `gcd` with `p`/`q`, never `l`/`m`/`n`); all four v2 types present; `update` on the same page as the click; region mapping correct | Defaults granted outside opt-in regions; denied where required (or after GPC/opt-out) | Parse `gcs`/`gcd`; Tag Assistant; `dataLayer` order (`consent default` index < `gtm.js` index) |
| 12 | Non-Google signals | UET `asc=D` then `G`; Clarity `consentStatus` DENIED then GRANTED; `fbq` not loaded or `consent revoke`; TikTok hold | LDU / LDP flags when opted out | Request params; console API calls |
| 13 | Cached pages | Results identical on cache HIT and MISS, on CDN edge and origin; banner not cached in a consented state; geo variant correct | Same | Repeat runs; check `x-cache` / `cf-cache-status` / `x-litespeed-cache` headers; purge and retest; `?nocache` vs normal |
| 14 | Logged-in vs logged-out | Same consent behaviour for logged-in customers (many CMPs skip admins/editors: test as subscriber/customer). Consent synced to account if advertised | Opt-out tied to account | Login flow in Playwright `storageState` |
| 15 | Templates coverage | Home, post, product, cart, checkout, thank-you, search, 404, landing-page builder pages, AMP, embedded forms | Same | Crawl list; thank-you page is where conversion pixels live |
| 16 | Mobile viewport | Banner fits 360×640, both buttons visible without scrolling, not covering the whole page with no reject, respects safe areas, no horizontal scroll | Same | `devices['iPhone 13']`, `devices['Pixel 7']`; screenshot |
| 17 | Accessibility (WCAG 2.2 AA; EAA applies since 28 Jun 2025) | Banner reachable early in tab order; all controls keyboard-operable (2.1.1); visible focus (2.4.7); logical order (2.4.3); if modal: `role="dialog"`, `aria-modal="true"`, labelled, focus trapped and returned on close, `Esc` behaviour does not imply consent; if non-modal: no trap and must not obscure focused content (2.4.11); contrast 4.5:1 text, 3:1 UI (1.4.3, 1.4.11); targets ≥ 24×24 px (2.5.8); toggles expose state (4.1.2); reflow at 320 px / 400% zoom (1.4.10); works with `prefers-reduced-motion`; correct `lang` | Same | `@axe-core/playwright` scoped to the banner; scripted Tab walk asserting `document.activeElement`; manual screen-reader spot check |
| 18 | Performance | Banner adds CLS < 0.01 (fixed/overlay positioning, reserved space); INP of Accept/Reject click < 200 ms (defer tag loading with `requestIdleCallback` / yield); banner is not the LCP element; CMP JS size and blocking time recorded | Same | Lighthouse with and without banner cookie; `web-vitals` attribution build; throttled mobile profile |
| 19 | No-JS | With JavaScript disabled: no tracking pixels (`<noscript><img>` GTM/Meta fallbacks removed or acceptable), site usable | Same | `browser.newContext({ javaScriptEnabled: false })`; grep HTML for `<noscript>` pixels |
| 20 | Subdomains / cross-domain | Consent cookie scoped to `.example.com` when subdomains share a banner; separate domains need the CMP's cross-domain feature (or re-prompt); no consent leakage to unrelated properties; `_gl` linker only decorated when consented | Same | Visit `shop.`, `blog.`, checkout domain after consenting on `www` |
| 21 | Policy/UI consistency | Cookie policy lists what the scan found (names, purposes, durations, vendors); categories in UI match actual blocking; no pre-ticked non-essential toggles; "legitimate interest" toggles off by default or absent | Privacy policy has opt-out methods and GPC statement | Diff scan output vs declared cookie list |
| 22 | Server-side | sGTM/CAPI events suppressed or flagged without consent; webhook/CRM syncs respect opt-out | LDU/opt-out flags forwarded | Code/config review; test purchase with consent denied, check vendor event debuggers (Meta Events Manager test events, GA4 DebugView) |
| 23 | Regression guard | CI job runs scenarios 1, 4, 5, 10 on staging and fails on new unclassified cookies/hosts | Same | Store baseline JSON; diff |

Assertion snippets:

```js
// Order of consent default vs GTM load
const order = await page.evaluate(() => window.dataLayer.map((e, i) =>
  e[0] === 'consent' ? `${i}:consent-${e[1]}` : e.event === 'gtm.js' ? `${i}:gtm.js` : null).filter(Boolean));
// expect the first 'consent-default' index to be lower than 'gtm.js'

// gcd decoder
const decodeGcd = g => { const L = (g.match(/[a-z]/g) || []).slice(0, 4);
  const M = { l:'unset', p:'denied(default)', q:'denied→denied', r:'denied→granted', t:'granted(default)',
              u:'granted→denied', v:'granted→granted', m:'nodefault→denied', n:'nodefault→granted' };
  return Object.fromEntries(['ad_storage','analytics_storage','ad_user_data','ad_personalization']
    .map((k, i) => [k, M[L[i]] || L[i]])); };

// Banner accessibility
const AxeBuilder = require('@axe-core/playwright').default;
const res = await new AxeBuilder({ page }).include('#banner-root').withTags(['wcag2a','wcag2aa','wcag22aa']).analyze();

// CLS caused by the banner
const cls = await page.evaluate(() => new Promise(r => { let v = 0;
  new PerformanceObserver(l => l.getEntries().forEach(e => { if (!e.hadRecentInput) v += e.value; }))
    .observe({ type: 'layout-shift', buffered: true });
  setTimeout(() => r(v), 5000); }));
```
