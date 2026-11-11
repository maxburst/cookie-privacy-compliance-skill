# Consent signals: how each vendor is told about the visitor's choice

Google Consent Mode v2, TCF, GPP, Global Privacy Control, Microsoft, Meta and other pixels, Shopify, WordPress Consent API. Read the section for each vendor actually present on the site.

**Last verified: 2026-11-11.** Confidence markers: **[V]** verified that day against the primary source or a live test; **[3P]** third-party or vendor write-ups only; **[M]** from prior knowledge, confirm on the target site; **[?]** uncertain or sources conflict. Technical reference, not legal advice. Prices and plan limits change often: re-check before quoting them.

Section numbers are shared across the technical references: 1.x is consent-signals.md, 2.x consent-tools.md, 3.x script-blocking.md, 4.x and 5 testing-tools.md, 6 failure-patterns.md.

## 1. Consent signalling standards

### 1.1 Google Consent Mode v2

Primary docs: <https://developers.google.com/tag-platform/security/guides/consent>, <https://support.google.com/google-ads/answer/10000067>, debugging: <https://developers.google.com/tag-platform/security/guides/consent-debugging>.

**Consent types** (values `'granted'` | `'denied'`):

| Type | Controls | v2? |
|---|---|---|
| `ad_storage` | Advertising cookies/identifiers | v1 |
| `analytics_storage` | Analytics cookies (e.g. `_ga`) | v1 |
| `ad_user_data` | Sending user data to Google for advertising | **v2, required for EEA ads measurement** |
| `ad_personalization` | Personalised advertising / remarketing | **v2, required for EEA remarketing** |
| `functionality_storage`, `personalization_storage`, `security_storage` | Non-Google-specific storage types; honoured by GTM consent checks | optional [M] |

**Canonical order [V]** — the default must run before any `config`/`event` and before the Google tag / GTM snippet. Google: "If your consent code is called out of order, consent defaults won't work."

```html
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

// Region-specific default first, then global fallback. Most specific region wins (US-CA beats US).
gtag('consent', 'default', {
  ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  analytics_storage: 'denied',
  region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU',
           'MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'],
  wait_for_update: 500           // ms to wait for an async CMP before tags send
});
gtag('consent', 'default', {     // everyone else (opt-out regimes)
  ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted',
  analytics_storage: 'granted'
});
gtag('set', 'ads_data_redaction', true);  // redact click IDs + cookieless domain when ad_storage denied
gtag('set', 'url_passthrough', true);     // carry gclid/dclid/gclsrc/_gl/wbraid on same-domain links
</script>
<!-- Google tag / GTM snippet goes AFTER this block -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>
```

```js
// On banner interaction, on the page where it happens, before navigation:
gtag('consent', 'update', {
  ad_storage: 'granted', ad_user_data: 'granted',
  ad_personalization: 'denied', analytics_storage: 'granted'
});
```

Key behaviours [V]:

- `region` takes ISO 3166-2 codes; a default without `region` applies to everyone not matched.
- `wait_for_update` only delays; it does not block. If the CMP update arrives later than the window, hits go out with the default.
- `ads_data_redaction` has no effect when `ad_storage` is granted.
- `url_passthrough` appends `gclid`, `dclid`, `gclsrc`, `_gl`, `wbraid` to same-domain links; make sure redirects preserve them.
- The site must persist the choice and re-issue `update` on every page load (the CMP normally does this).
- **Inside GTM do not call `gtag('consent','update')` from Custom HTML**: gtag commands are queued behind pending messages. Use a consent-enabled template (`setDefaultConsentState` / `updateConsentState`) fired on the **Consent Initialization – All Pages** trigger.

**Basic vs advanced** ([Google Ads help](https://support.google.com/google-ads/answer/10000067)) [V]:

| | Basic | Advanced |
|---|---|---|
| Google tags before choice | Blocked entirely | Load with defaults (denied) |
| Data sent when denied | Nothing, not even consent state | Cookieless pings (timestamp, UA, referrer, consent state, random per-page number, whether a click ID was present) |
| Modelling | General model | Advertiser-specific model |
| How you get it | You block the tag yourself (CMP/GTM trigger); there is no "basic" switch | Tag loads unconditionally, consent mode governs behaviour |

Legal note for the audit: advanced mode still makes network requests to Google before consent. Several EU DPAs treat that as needing a legal basis; for strict-opt-in clients default to **basic** unless counsel says otherwise. In either mode, `gcs=G100` pings in a pre-consent capture mean advanced mode is active.

**Verifying in outgoing hits.** Inspect requests to `google-analytics.com/g/collect`, `googleads.g.doubleclick.net`, `pagead2.googlesyndication.com/ccm/collect`, `google.com/pagead/...`:

`gcs` = `G1xy` — x = `ad_storage`, y = `analytics_storage` (1 granted, 0 denied) [V via [Simo Ahava](https://www.simoahava.com/analytics/consent-mode-v2-google-tags/)]:

| gcs | Meaning |
|---|---|
| `G100` | both denied (only seen in advanced mode) |
| `G110` | ads granted, analytics denied |
| `G101` | analytics granted, ads denied |
| `G111` | both granted |

`gcd` — four letters separated by digits, in order **ad_storage, analytics_storage, ad_user_data, ad_personalization**. Ignore the digits (prefix `11`/`13`, separators `1`/`3`, trailing `5`, `5l1` etc. vary by tag version). Live capture today: `gcd=13q3q3q3q5l1` alongside `gcs=G100`.

| Letter | Default | After update |
|---|---|---|
| `l` | not set | not set (consent mode absent for this signal) |
| `p` | denied | — |
| `q` | denied | denied |
| `r` | denied | **granted** |
| `t` | granted | — |
| `u` | granted | denied |
| `v` | granted | granted |
| `m` | not set | denied |
| `n` | not set | granted |

Google does not document `gcd`; the table is community reverse-engineering and "may change without notice". Use it for automation, and Tag Assistant as the authority.

Audit reading of `gcd`:
- `l` in positions 3–4 → site is still on consent mode v1 (no `ad_user_data` / `ad_personalization`).
- `m` / `n` → an update fired with **no default** → defaults set too late or not at all.
- `t` / `v` for an EEA visitor before interaction → granted by default (failure in opt-in regimes).
- Other parameters seen on hits: `npa=1` (non-personalised ads), `dma=1` / `dma_cps=...` (DMA region + consented services), `pscdl` (privacy sandbox cookie deprecation label) [M][?].

**Tag Assistant** (<https://tagassistant.google.com>) [V]: connect to the site → Summary → earliest **Consent** event → check the four parameters under API Call / the "On-page Default" column; then interact with the banner and check "On-page Update"; in GTM containers the Tags tab shows which tags fired or were blocked by consent. For region testing Google's doc points to Chrome location settings [?: Google's regional defaults are IP-resolved, so a proxy is the reliable test].

**GTM mechanics [M]:** each tag has *built-in consent checks* (Google tags) and *additional consent checks* (you add e.g. `ad_storage` to a Meta pixel Custom HTML tag). Enable **Admin → Container Settings → Enable consent overview** to see unconfigured tags. Non-Google tags with "No additional consent required" fire regardless of the CMP: this is the single most common real-world failure (section 6).

### 1.2 Google EU user consent policy and certified CMPs

- Policy: <https://www.google.com/about/company/user-consent-policy/>. Applies to EEA, UK and Switzerland end users.
- **AdSense / Ad Manager / AdMob** [V, <https://support.google.com/adsense/answer/13554116>]: a **Google-certified CMP integrated with IAB TCF** is required to serve personalised ads; EEA + UK since 16 Jan 2024, Switzerland since 31 Jul 2024. Without one, traffic is eligible only for non-personalised / limited ads. Search ads products (AFS/AFD): no ads unless certified CMP or the `ivt` parameter.
- Google Ads / GA4 (advertiser side): no certified-CMP mandate, but consent mode v2 signals are required to keep EEA audiences/remarketing and conversion measurement.
- Google's TCF handling [V, <https://support.google.com/adsense/answer/9804260>]: v2.3 strings mandatory for strings generated on/after 1 Mar 2026; older v2.2 strings created before that still accepted; invalid/unparseable TC string → no ad served; missing Purpose 1 consent → limited ads. Error code 1.4 = disclosedVendors segment missing/malformed/omits Google (vendor ID 755) (<https://support.google.com/admanager/answer/9999955>).
- **CMP Partner Program tiers** (<https://cmppartnerprogram.withgoogle.com/>, read today) [V]:
  - Gold: Axeptio, Clickio, consentmanager, CookieYes, Didomi, iubenda, Secure Privacy, TrustArc, UniConsent, Usercentrics, Cookiebot (Usercentrics), Sirdata ABconsent, Acceptrics, Concord, Consentik, CookieFirst, CookieHub, Cookie Information, CookiePal, CookieScript, CookieTractor, DataGrail, Enzuzo, Lawwwing, OneTrust, Seers, Termly, Truendo.
  - Silver: Adopt, CHEQ, Commanders Act, **Complianz**, Consentmo, Consent Studio, Cookifi, Crownpeak, GetTerms, Gravito, Ketch, Legal Web, Mandatly, My Agile Privacy, **Osano**, Pandectes, Pubtech, WebToffee, WPLP.
  - Bronze: Clym, Sourcepoint, WebTrue.
  - Not on the list: Borlabs, Real Cookie Banner, WPConsent, CookieAdmin, Cookie Notice/hu-manity, Klaro, vanilla-cookieconsent, c15t. The partner program and the publisher "certified CMP" list (<https://support.google.com/admanager/answer/13554020>) are related but not identical; for an AdSense site always confirm against the publisher list [?].

### 1.3 IAB Europe TCF

- **v2.3** released 19 Jun 2025; mandatory from 28 Feb / 1 Mar 2026. Makes the `disclosedVendors` segment mandatory. Strings created before the cut-off stay valid until renewed [V, <https://iabeurope.eu/all-you-need-to-know-about-the-transition-to-tcf-v2-3/>].
- **v2.4** (Policies v5.0.b + Technical Specifications v2.4): specs and updated GVL published 23 Jul 2026; **web CMP deadline 23 Oct 2026 (passed)**; mobile app and CTV deadline **23 Feb 2027**. Changes: standard explanatory text + illustrations for Features (from the GVL), Special Feature 2 renamed "Identify devices based on information actively requested", legitimate-interest workaround for special-purpose-only vendors removed, banner must disclose multi-device consent if consent is saved to user accounts. Mostly a UI-text change; no new string segment [3P, consistent across [iubenda](https://www.iubenda.com/en/blog/transitioning-to-iabs-tcf-2-4-what-you-need-to-know/), [CookieYes](https://www.cookieyes.com/blog/iab-tcf-explained/), [Cookie-Script](https://cookie-script.com/news/iab-tcf-v2-4-changes); IAB Europe's own v2.4 page not retrieved today]. Google's help pages still only reference v2.3 as of today [?].
- Only needed when the site sells programmatic ad inventory (AdSense/GAM/header bidding). Brochure and e-commerce sites without ads do not need TCF; enabling it adds a long vendor list and hurts UX.

```js
// Read TCF state (v2.x API)
__tcfapi('addEventListener', 2, (tcData, ok) => {
  if (!ok) return;
  // eventStatus: 'tcloaded' (returning visitor) | 'cmpuishown' | 'useractioncomplete'
  console.log(tcData.eventStatus, tcData.gdprApplies, tcData.tcString,
              tcData.purpose.consents, tcData.vendor.consents[755]);
});
```

Decode strings with `@iabtechlabtcf/core` (npm) or <https://iabtcf.com/#/decode> [M]. The usual cookie is `euconsent-v2`; Google's Additional Consent string is `addtl_consent` [M].

### 1.4 IAB GPP (Global Privacy Platform)

Section registry read today from the spec repo [V, <https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Sections/Section%20Information.md>]:

| ID | Prefix | Section | ID | Prefix | Section |
|---|---|---|---|---|---|
| 2 | `tcfeuv2` | EU TCF v2 | 15 | `usor` | Oregon |
| 5 | `tcfcav1` | Canada TCF | 16 | `ustx` | Texas |
| 6 | `uspv1` | US Privacy string (deprecated) | 17 | `usde` | Delaware |
| 7 | `usnat` | MSPA US National | 18 | `usia` | Iowa |
| 8 | `usca` | California | 19 | `usne` | Nebraska |
| 9 | `usva` | Virginia | 20 | `usnh` | New Hampshire |
| 10 | `usco` | Colorado | 21 | `usnj` | New Jersey |
| 11 | `usut` | Utah | 22 | `ustn` | Tennessee |
| 12 | `usct` | Connecticut | 23 | `usmn` | Minnesota |
| 13 | `usfl` | Florida | 24 | `usmd` | Maryland |
| 14 | `usmt` | Montana | 25–27 | `usin`, `usky`, `usri` | Indiana, Kentucky, Rhode Island |

(1 = TCF v1 deprecated, 3 = header, 4 = signal integrity.)

```js
__gpp('ping', (data) => console.log(data.gppVersion, data.cmpStatus, data.signalStatus,
                                    data.supportedAPIs, data.applicableSections, data.gppString));
__gpp('addEventListener', (evt) => console.log(evt.eventName, evt.pingData.gppString));
// usnat / state sections carry: SaleOptOut, SharingOptOut, TargetedAdvertisingOptOut,
// SensitiveDataProcessing[], KnownChildSensitiveDataConsents[], Gpc (boolean), MspaCoveredTransaction ...
```

A GPP string starts with `DB` (header) and joins sections with `~` [M]. `__uspapi` / `usprivacy` cookie (`1YNN` format) is deprecated but still read by some ad tech [M]. GPP matters for publishers with US programmatic demand; for a typical SMB site, GPC handling plus Limited Data Use flags is the practical requirement.

### 1.5 Global Privacy Control (GPC)

Spec: <https://www.w3.org/TR/gpc/> — **W3C Working Draft dated 24 Sep 2026**, Privacy Working Group, Recommendation track [V].

- Request header: `Sec-GPC: 1` (only valid value; absence = no preference).
- JS: `navigator.globalPrivacyControl` → `true` / `false` (also on `WorkerNavigator`).
- Site support statement: `/.well-known/gpc.json`, served as `application/json`:

```json
{ "gpc": true, "lastUpdate": "2026-11-11" }
```

- Browser support [M]: Firefox (built-in toggle), Brave and DuckDuckGo (on by default), extensions for Chrome/Edge. Chrome and Safari have no native toggle. California's AB 566 requires browsers to ship an opt-out preference signal by 1 Jan 2027 [3P].
- Legal trigger [3P, counts differ by source: 10–13 states]: California (CCPA regs §7025) plus roughly a dozen other US states require honouring universal opt-out signals; California requires showing that the signal was processed (e.g. "Opt-out preference signal honoured") [?: see the legal reference for the authoritative list].
- Implementation rule: treat GPC as an opt-out of **sale / sharing / targeted advertising** for the browser (and the account if logged in). It is not a blanket "reject all cookies" under US law; in opt-in regimes the banner still governs, but GPC should at least pre-set marketing to denied.

```js
// Client
if (navigator.globalPrivacyControl === true) { denyMarketing(); showGpcNotice(); }
```
```php
// Server (PHP / WordPress)
$gpc = isset($_SERVER['HTTP_SEC_GPC']) && $_SERVER['HTTP_SEC_GPC'] === '1';
// If output varies on this, add `Vary: Sec-GPC` or do it client-side so page caches stay valid.
```

### 1.6 Microsoft: UET consent mode and Clarity

**UET (Microsoft Advertising)** — official page: <https://help.ads.microsoft.com/apex/index/3/en/60119> (JS-rendered; body not retrievable today, details below are [3P] and consistent across [Usercentrics](https://usercentrics.com/docs/web/features/consent-modes-and-consent-signals/microsoft-uet/), [Didomi](https://docs.didomi.io/consent-management-platform-cmp/frameworks-regulations/microsoft-consent-mode), [Cookiebot](https://support.cookiebot.com/hc/en-us/articles/12452886794908)).

```js
window.uetq = window.uetq || [];
window.uetq.push('consent', 'default', { ad_storage: 'denied' });   // before the UET tag, every page
// ... UET tag ...
window.uetq.push('consent', 'update',  { ad_storage: 'granted' });  // after the user's choice
```

- Only signal is `ad_storage`. Required for EEA/UK/CH traffic since **5 May 2025**; without it Microsoft stops conversion tracking / remarketing-list updates for those users.
- Outside those regions an unset default is treated as granted.
- Verify: requests to `bat.bing.com/action/0?...` carry `asc=D` (denied) or `asc=G` (granted) [3P]. Cookies: `_uetsid`, `_uetvid`, `MUID` (third-party) [M].

**Clarity** [V, <https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v2>, <https://learn.microsoft.com/en-us/clarity/setup-and-installation/consent-mode>]:

- Since **31 Oct 2025** Clarity enforces consent signals for EEA/UK/CH visits; consent mode is on by default for those users. Without a granted signal, Clarity runs in no-consent mode: unique ID per page view, no cookies, no cross-page session stitching.

```js
window.clarity('consentv2', { ad_Storage: 'granted', analytics_Storage: 'granted' }); // note the capital S
window.clarity('consent', false);   // erase Clarity cookies and stop until new consent
// The v1 call clarity('consent', true) still works but is slated for deprecation.

// Verify from the console:
clarity('metadata', (d, upgrade, consent) => console.log('consentStatus:', consent), false, true, true);
// → { analytics_storage: "DENIED", ad_storage: "DENIED" }
```

- Cookies when granted: `_clck`, `_clsk` (first-party), `CLID`, `MUID`, `ANONCHK` etc. on `clarity.ms` / `bing.com` [M]. In no-consent mode `/collect` calls still happen: in a strict opt-in audit that is still a pre-consent third-party request, so block the script until consent.
- Project setting: Clarity → Settings → Setup → cookies **off** to require a signal everywhere.

### 1.7 Meta Pixel

Consent API [V, <https://developers.facebook.com/docs/meta-pixel/implementation/gdpr>]:

```js
fbq('consent', 'revoke');          // BEFORE init, on every page, until consent exists
fbq('init', 'PIXEL_ID');
fbq('track', 'PageView');          // queued, not sent
// later, on consent:
fbq('consent', 'grant');           // releases queued events
```

`revoke` still downloads `fbevents.js` from `connect.facebook.net` (an IP disclosure to Meta). For strict opt-in, do not load the script at all until consent.

Limited Data Use [V, <https://developers.facebook.com/docs/marketing-apis/data-processing-options>]:

```js
fbq('dataProcessingOptions', ['LDU'], 0, 0);      // let Meta geolocate (recommended default for US opt-out/GPC)
fbq('dataProcessingOptions', ['LDU'], 1, 1000);   // explicit: country 1 = US, state 1000 = California
fbq('dataProcessingOptions', []);                 // explicitly not LDU
// must be called before fbq('init', ...)
```

State codes: CA 1000, CO 1001, CT 1002, FL 1003, OR 1004, TX 1005, MT 1006, DE 1007, NE 1008, NH 1009, NJ 1010, MN 1011, MD 1012, RI 1013. Conversions API equivalent, per event: `data_processing_options: ["LDU"]`, `data_processing_options_country: 1`, `data_processing_options_state: 1000`.

### 1.8 Other vendors

| Vendor | Consent mechanism | Notes |
|---|---|---|
| **TikTok Pixel** | `ttq.holdConsent()` before `ttq.load()`, then `ttq.grantConsent()` / `ttq.revokeConsent()`; the three methods must be in the `ttq.methods` array of the base code [3P: [TermsFeed](https://www.termsfeed.com/docs/cookie-consent/integrations/tools/tiktok-pixel/), [c15t](https://c15t.com/docs/integrations/tiktok-pixel); TikTok's own doc is behind a JS portal] | Cookies `_ttp` (1P and 3P), `ttcsid*`, `ttclid`, 13 months [V, <https://ads.tiktok.com/help/article/using-cookies-with-tiktok-pixel>]. `holdConsent()` must run on every page load. A US "limited data use" flag exists for Events API [?]. |
| **LinkedIn Insight Tag** | No documented client consent API. Block the tag until marketing consent; guard `window.lintrk` calls [3P] | Cookies `li_fat_id`, `li_sugr`, `bcookie`, `lidc`, `UserMatchHistory`, `AnalyticsSyncHistory`. `li_gc` is LinkedIn's own guest-consent record, not your site's consent. |
| **Pinterest Tag** | `pintrk('setconsent', true|false)` [3P]; Limited Data Processing: `opt_out_type: 'LDP'` plus `st` / `country` in event data [V, <https://developers.pinterest.com/docs/api-features/limited-data-processing/>] | Cookies `_pin_unauth`, `_pinterest_ct_ua`, `_derived_epik` [M]. |
| **HubSpot** | Own banner (v2 editor; v1 auto-migrating since 11 May 2026) with categories `analytics`, `advertisement`, `functionality` [V, <https://developers.hubspot.com/docs/api-reference/cookie-banner/cookie-banner-api>] | `_hsp.push(['addPrivacyConsentListener', cb])`, `_hsp.push(['revokeCookieConsent'])`, `_hsp.push(['showBanner'])`, `_hsp.push(['setHubSpotConsent', {...}])`, `_hsq.push(['doNotTrack'])`. With an external CMP, call `doNotTrack` by default and `setHubSpotConsent` on consent, or gate the tracking script (`js.hs-scripts.com`). HubSpot forms, chat and meetings embeds also set `hubspotutk`. A separate Google consent mode page exists in HubSpot's docs [?]. |
| **Hotjar / Contentsquare** | No reliable documented consent API found today; sources conflict (`hj('consent','grant')` vs `optIn/optOut`) [?] | Gate the script. Cookies `_hjSessionUser_{id}` (365 d), `_hjSession_{id}` (30 min) plus localStorage/sessionStorage keys [M]. Session replay also raises wiretap-law exposure in the US. |
| **Matomo** | See below [V, <https://developer.matomo.org/guides/tracking-consent>] | Self-hosted option keeps data first-party. |
| **Plausible** | No cookies, no localStorage writes; daily-rotating `hash(daily_salt + domain + IP + UA)` [V, <https://plausible.io/data-policy>] | Script `plausible.io/js/script.js` is still a third-party request unless proxied or self-hosted. |
| **Fathom** | Cookieless, EU isolation (EU traffic handled on EU infrastructure) [3P vendor claims] | Same third-party-request caveat (`cdn.usefathom.com`) unless a custom domain is used. |

"Cookieless" does not automatically mean "no consent": ePrivacy Art. 5(3) covers any storage/access on the device, and regulator positions on analytics exemptions differ per country (CNIL exempts some configurations). Flag for legal review rather than asserting exemption.

**Matomo:**

```js
_paq.push(['requireConsent']);           // no requests, no cookies until consent
// or: _paq.push(['requireCookieConsent']);  // requests sent, but cookieless until consent
// or: _paq.push(['disableCookies']);        // permanently cookieless  [M]
_paq.push(['trackPageView']);

_paq.push(['rememberConsentGiven']);     // stores mtm_consent cookie; optional arg = hours
_paq.push(['forgetConsentGiven']);       // withdraw
_paq.push(['setConsentGiven']);          // if your CMP remembers: must be called on every page
// cookie-only variants: rememberCookieConsentGiven / forgetCookieConsentGiven / setCookieConsentGiven
```

### 1.9 Shopify Customer Privacy API

[V, <https://shopify.dev/docs/api/customer-privacy>]

```js
window.Shopify.loadFeatures([{ name: 'consent-tracking-api', version: '0.2' }], (error) => {
  if (error) return;
  const cp = window.Shopify.customerPrivacy;
  cp.shouldShowBanner();             // region requires banner AND no decision yet
  cp.currentVisitorConsent();        // { marketing:'yes'|'no'|'', analytics:..., preferences:..., sale_of_data:... }
  cp.analyticsProcessingAllowed();   // factors in merchant region settings; also marketingAllowed(),
                                     // preferencesProcessingAllowed(), saleOfDataAllowed()
  cp.getRegion(); cp.saleOfDataRegion(); cp.consentId();
  cp.setTrackingConsent({ analytics: true, marketing: false, preferences: true },
                        () => console.log('saved'));
});
document.addEventListener('visitorConsentCollected', (e) => console.log(e.detail));
```

- GPC is honoured automatically in regions configured for data-sale opt-out (`sale_of_data` forced false; cannot be overridden via `setTrackingConsent`).
- Headless storefronts: pass `headlessStorefront: true`, `checkoutRootDomain`, `storefrontRootDomain`, `storefrontAccessToken`.
- Never read Shopify's consent cookie (`_tracking_consent` [M]) directly; use the API.
- Open the native banner's preferences: `privacyBanner.showPreferences()`.

### 1.10 WordPress: WP Consent API, Site Kit, WooCommerce

**WP Consent API** [V, <https://wordpress.org/plugins/wp-consent-api/>]: v2.1.0, updated Nov 2026, 300,000+ installs, tested to WP 7.1.4. Still a plugin, **not in core** (2024 core-adoption proposal has not produced a merge; v2.1.0 mentions an "upcoming WordPress core `wp_set_cookie()` function").

Categories: `functional`, `preferences`, `statistics`, `statistics-anonymous`, `marketing`. Service-level API added in 2.0.0.

```php
// Declare that your plugin respects the API (removes the Site Health warning)
add_filter( 'wp_consent_api_registered_' . plugin_basename( __FILE__ ), '__return_true' );

if ( function_exists( 'wp_has_consent' ) && wp_has_consent( 'marketing' ) ) { /* server-side pixel, CAPI ... */ }
if ( wp_has_service_consent( 'google-analytics' ) ) { /* ... */ }
wp_set_consent( 'marketing', 'allow' );                 // CMP side
wp_set_service_consent( 'facebook-pixel', false );
wp_add_cookie_info( '_ga', 'Google Analytics', 'statistics', '2 years', 'Visitor ID' );
```

```js
if ( wp_has_consent( 'statistics' ) ) { startAnalytics(); }
document.addEventListener( 'wp_listen_for_consent_change', (e) => {
  for ( const cat in e.detail ) if ( e.detail[cat] === 'allow' ) activate( cat );
});
window.wp_consent_type;   // 'optin' | 'optout', set by the CMP; event: wp_consent_type_defined
```

Cookies: `wp_consent_{category}` = `allow` / `deny` (prefix filterable) [M]. **PHP `wp_has_consent()` reads cookies, so it is wrong on full-page-cached responses**; use the JS API for anything rendered into cached HTML.

CMPs registered as supporting it (plugin page today): Complianz, CookieYes, Cookiebot, iubenda, CookieFirst, CookieHub, consentmanager, Clickio, Sirdata, TrustArc, Conzent, GetTerms, Lawwwing, Consent Studio, Pressidium Cookie Consent, GDPR Cookie Compliance (Moove), WebToffee GDPR Cookie Consent, Beautiful Cookie Consent Banner, WeePie, CookieTractor and others. WPConsent also states support [V, its plugin page]. Consumers: **Google Site Kit, WooCommerce, Burst Statistics, WP Statistics, Pixel Manager for WooCommerce, AddToAny**. Real Cookie Banner and Borlabs are not on the list [?: both ship their own integrations].

**Google Site Kit consent mode** [V, <https://sitekit.withgoogle.com/documentation/using-site-kit/consent-mode/>]: Settings → Admin Settings → enable consent mode. Requires the WP Consent API plugin plus a compatible CMP (named: Complianz, Cookiebot, CookieYes). Outputs a default-denied snippet (search page source for "Google tag (gtag.js) Consent Mode snippet added by Site Kit") for EEA + UK + CH, then updates from WP Consent API `statistics` and `marketing` categories (statistics → `analytics_storage`; marketing → `ad_storage`, `ad_user_data`, `ad_personalization` [M]). **Do not also enable the CMP's own consent mode integration**: double defaults conflict.

**WooCommerce order attribution** [V, <https://woocommerce.com/document/order-attribution-tracking/>]: Sourcebuster cookies `sbjs_migrations`, `sbjs_current_add`, `sbjs_first_add`, `sbjs_current`, `sbjs_first`, `sbjs_udata`, `sbjs_session` (30 min; the others are session). On by default since WooCommerce 8.5 [M]. It integrates with WP Consent API and waits for the **marketing** category [M]; **without WP Consent API plus a CMP that sets it, the cookies are set for everyone**. Disable: WooCommerce → Settings → Advanced → Features → Order Attribution, or `wp option update woocommerce_feature_order_attribution_enabled no`.
