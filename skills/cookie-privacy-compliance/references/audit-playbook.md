# Audit playbook

An audit answers three questions for each target regime: what does the site do to a visitor's browser, why does it do it, and what on the paper side is missing or untrue. Do them in that order. Change nothing on the site during an audit.

## Contents

1. Scan the live site
2. Read the scan
3. Look behind the browser
4. Diagnose the existing consent tool
5. The paper side
6. Turn observations into findings

## 1. Scan the live site

### Setup (once per machine)

```bash
npm install --prefix <skill-dir>/scripts
npx --prefix <skill-dir>/scripts playwright install chromium
```

Needs Node 18 or later. If the install is not possible, fall back to any browser automation you have and reproduce the same scenarios by hand (section "Without the scanner" below).

### Running it

```bash
node <skill-dir>/scripts/scan.mjs <url> [options]
```

| Option | Use |
|---|---|
| `--scenarios baseline,reject,accept,gpc,withdraw` | Default is the first four. Add `withdraw` for opt-in regimes. Each scenario is a fresh browser profile. |
| `--pages 4` | Pages visited per scenario including the start URL (default 3). The scanner picks a varied sample of internal links from the start page: one each of contact, shop or product, article, about or pricing where it finds them. It does not crawl the whole site or read the sitemap. `summary.md` has a per-page table for the baseline scenario. |
| `--coverage types` | Read the sitemap, group its URLs into page types, and visit some of each type in every scenario. The right default for a real audit. `--per-type 2` takes two of each; `--max-pages` caps the total (default 40). |
| `--coverage all` | Visit every sitemap URL (up to `--max-pages`, default 300) in the baseline scenario; the click scenarios still use the per-type sample. Add `--all-scenarios` to run every page through every scenario. |
| `--sitemap <url>` | Use a specific sitemap. Otherwise it is found through robots.txt and the usual locations (including sitemap indexes and gzipped files); if there is none, the scanner crawls internal links instead. |
| `--extra-url <url>` | Force a page into every scenario. Use it for the pages that matter: a product page, cart, checkout, a page with a form, a page with a video or map, the thank-you page if reachable. Repeatable. |
| `--proxy http://user:pass@host:port` | Scan from another country. This is the only reliable way to see another region's behaviour. |
| `--locale de-DE --timezone Europe/Berlin` | Match the region being simulated. Some tools use these as hints, and the banner language follows the locale. |
| `--mobile` | Phone viewport and user agent. Run once for the main regime. |
| `--wait 8000` | Settle time after each load or click. Raise it for slow or tag-heavy sites. |
| `--idle 14000` | Extra no-input wait on the first load of the baseline scenario (this is the default; with `--wait` it gives about 20 seconds). Delay-JavaScript optimisers release everything on an idle timer as well as on first input, commonly after 10 to 15 seconds. Raise it if the site's timer is longer; `0` skips it. |
| `--cookie-db open-cookie-database.csv` | Wider cookie classification. Download from `https://raw.githubusercontent.com/jkwakman/Open-Cookie-Database/master/open-cookie-database.csv` (Apache-2.0). |
| `--headful` | Watch the run. Use when results look too clean: some sites suppress tags for headless browsers. |

Output folder: `summary.md` (start here), `results.json` (every request, cookie and storage key by scenario and phase), `screenshots/` (first load and after each click).

### Vantage points

The scanner prints the country it ran from. A consent tool with geo rules shows a different banner, or none, per country, and Google's regional consent defaults follow the IP too. So:

- Run one scan per target regime: an EU country for opt-in (pick the main market; add France or Germany if they matter, since they are the strictest in practice), the UK if it is a market, a US IP, and California specifically if GPC and "Do Not Sell" behaviour matters.
- If you have no proxy for a region, ask the user for one (a VPN on their machine and running the scanner there works), or use the consent tool's own region override if it has one (OneTrust `?otgeo=de`), and say in the report that the region was simulated or not observed.
- Do not infer one region's behaviour from another's. "No banner from a US IP" says nothing about Europe.

### What each scenario shows

Every scenario runs the phases `load` (no interaction at all; the baseline scenario also sits idle here), `scroll` (real mouse movement and wheel scrolling, which wakes scripts held back by "delay JavaScript" optimisers and catches banners that treat scrolling as consent), then for click scenarios `post-reject` or `post-accept`, then `browse` (further pages).

| Scenario | Question it answers |
|---|---|
| `baseline` | What happens to a visitor who never touches the banner, and who then keeps browsing? |
| `reject` | Is there a reject, on which layer, and is it respected on this page and the next ones? |
| `accept` | Does accepting actually turn the tags on (a banner that changes nothing is cosmetic)? What is stored, for how long? |
| `gpc` | Does a Global Privacy Control signal change anything, with no clicks? Is it acknowledged? |
| `withdraw` | After accepting and then withdrawing, do tracker cookies go away and requests stop? |

### Without the scanner

Reproduce the same scenarios with whatever browser control is available: a fresh profile per scenario; record all cookies (including third-party and HttpOnly), localStorage and sessionStorage per frame, and every request host; move the mouse and scroll before the pre-consent snapshot; click reject or accept; reload and visit two more pages; snapshot again. For GPC send the `Sec-GPC: 1` header and define `navigator.globalPrivacyControl = true` before page scripts run. `testing-tools.md` section 4 has a minimal script and other scanners (EDPS Website Evidence Collector, Blacklight) that make a good second opinion.

### Sites that hold scripts until first input

Performance plugins with a "delay JavaScript" feature (WP Rocket, Perfmatters, LiteSpeed, Flying Scripts, NitroPack, Cloudflare Rocket Loader) keep every script inert until the first mouse move, scroll, key press or an idle timeout. If the consent tool is delayed with the rest, the banner and the trackers are released by the same event and the visitor never has a choice before tracking starts. The scanner sends real mouse and wheel input and reports `banner-appears-only-after-input`, `tracker-requests-with-no-input-at-all` and the number of held scripts. When you see held scripts:

- Trust the `scroll` phase, not `load`, as the picture of what a real visitor gets.
- Compare `load` with and without the idle wait to learn whether there is an idle timer and roughly how long it is.
- Look at the first-load screenshot: no banner on a page that later shows one is itself the finding.
- The fix is to exclude the consent tool and the consent-default snippet from the delay, never to rely on the delay as a consent mechanism.

### Opt-out sites (US style, no reject button)

Where the model is "tracking on by default, opt out through a footer link", the reject scenario follows "Your Privacy Choices" or "Do Not Sell or Share" into the preference centre and rejects there. The questions are different from an opt-in audit:

- **Did the opt-out register?** `consent-state-after-reject` shows the consent tool's own state and the GPP / US Privacy strings the page exposes.
- **Did it reach the whole ad stack?** Compare vendors before and after in the `post-reject` and `browse` phases. Pixels wired to the consent tool usually stop. Identity and audience vendors loaded by a header-bidding wrapper (LiveRamp, LiveIntent, ID5, Lotame, Permutive and similar) often do not, because they are only handed a string. `cookies-newly-set-after-reject` is the sharpest evidence.
- **Were old identifiers cleared?** `pre-reject-tracker-cookies-not-cleared`.
- **Are contradictory signals sent?** `us-privacy-strings-sent-after-reject`: a `1YN…`-style value with `N` in the third position after an opt-out tells partners the visitor has not opted out.
- **GPC**: `gpc-vendors-still-contacted` lists who is still contacted with the signal on and who stopped. One vendor stopping may be that vendor reading the signal itself; the site honours GPC only when its sale, sharing and targeted-advertising vendors all stop or switch to a restricted mode, and (California) the page says so.
- **Does the opt-out act get reported?** Check the requests fired by the click on the opt-out control itself; pixels with automatic click capture send it to the ad platform.

A browser scan shows who was contacted and with what flag. It cannot show whether a recipient then behaved as a service provider; that is a contract question to raise in the report.

The scanner reports the US state it ran from where it can. State rules differ, so scan from the states that matter or use the consent tool's region override, and confirm which geo rule actually loaded (for OneTrust: `OneTrust.GetDomainData().GeoRuleName`; the override is `?otgeo=us,ca` with a comma).

## 2. Read the scan

The "Facts" table in `summary.md` is the digest. How to read it:

| Fact | Meaning | Regimes where it is a problem |
|---|---|---|
| `pre-consent-nonessential-cookies` > 0 | Analytics, advertising, replay or unidentified cookies exist before any choice. | 1 always. 2 for advertising and replay. 3 only on sensitive pages (but see wiretap risk). |
| `pre-consent-tracker-requests` > 0 | The browser contacted tracker hosts before any choice. Setting no cookie does not cure this in Europe. | Same as above. |
| `pre-consent-tag-manager` | A tag manager loaded before consent. Acceptable only if every tag in it is consent-gated; some German authority treats the tag manager itself as needing consent. | 1 (note it; critical only if tags leak). |
| `pre-consent-functional-third-parties` | Embeds, chat, captcha, maps loaded without being asked for. | 1, when the visitor did not request them. |
| `third-party-infrastructure` | Fonts and libraries from third-party CDNs: IP disclosure. | 1 (medium in Germany and Austria for Google Fonts, low elsewhere). |
| `google-consent-signals-*` | `gcs` and `gcd` values on Google hits. `G100` before consent means advanced Consent Mode (cookieless pings still sent). Letters `m` or `n` in `gcd` mean no default was set before the tag; `l` in the last two positions means Consent Mode v1 only; `t` or `v` before interaction in an opt-in region means granted by default. No parameters at all on Google hits means Consent Mode is absent. | Decode with `consent-signals.md` section 1.1. |
| `reject-available` false, or `reject-on-first-layer` false | No refusal, or refusal needs more clicks than acceptance. | 1. |
| `after-reject-*` > 0 | The refusal is not respected. The most serious class of finding everywhere, because the banner now misrepresents what happens. | All. |
| `banner-dismissed-after-reject` false, `reject-remembered-on-next-page` false | The choice may not be stored, or the banner nags. Confirm in the screenshots: the detector can mistake a floating "cookie settings" tab for a banner. | 1. |
| `after-accept-tracker-requests` = 0 | Either the site has no optional trackers (check baseline) or the banner is decorative and everything already fired. | Diagnostic. |
| `cookies-longer-than-13-months` | Lifetimes above common regulator guidance. | 1 (low). |
| `consent-record-cookie` | Where the choice is stored and for how long. Around 6 to 12 months is expected; session-only means re-asking every visit. | 1. |
| `gpc-*` | Vendors still contacted and cookies with the signal on, against baseline, and whether the page acknowledges it. No difference means GPC is ignored; a partial difference needs the reading in "Opt-out sites" above. | 3 in the mandatory states; good practice everywhere. |
| `banner-appears-only-after-input`, `tracker-requests-with-no-input-at-all` | See "Sites that hold scripts until first input". | 1 and 2; wiretap exposure in 3. |
| `cookies-newly-set-after-reject`, `pre-reject-tracker-cookies-not-cleared`, `us-privacy-strings-sent-after-reject`, `consent-state-after-reject` | See "Opt-out sites". | All. |
| `after-withdraw-*` > 0 | Withdrawal does not stop tags or leaves tracker cookies behind. | 1. |

Then read the detail sections:

- **Banner (first layer)**: text and a table of controls with size, colours and font. Compare accept against reject for prominence, and read the text for what it promises, the purposes named and whether it mentions withdrawal. Open the screenshot: the table cannot show layout, contrast against the background, or a banner that covers the page.
- **Requests and cookies per phase**: the vendor list is the site's real tracker inventory. Compare it with what the cookie policy declares and with what the owner believes is installed.
- **`unclassified` entries**: resolve them. Search the cookie name, look at which script set it (`results.json` has the full request list), or ask the owner. An unknown cookie is treated as non-essential until identified.
- **Cookies classed `necessary` or `functional`**: sanity-check the classification against what the site actually is. A cart cookie on a brochure site, or a "functional" chat widget nobody asked for, is not exempt.
- **Iframes and forms**: embeds to gate, and forms that collect personal data (check for a privacy notice link, pre-ticked marketing boxes, and third-party form handlers).
- **Links**: missing privacy policy, cookie policy, persistent cookie-settings control, "Do Not Sell or Share"/"Your Privacy Choices", imprint. The detector reads link text on the start page; confirm by looking at the footer.
- **Cache headers**: note any full-page cache or CDN. It matters for diagnosis and for verification.

**Choosing coverage.** Three levels:

- *Quick look* (`--coverage sample`, the default): start page and a few links. Enough to answer "is the banner real" in a few minutes.
- *Audit* (`--coverage types`): one or two pages of every type in the sitemap, in every scenario. Use this for any report that goes to a client. Read the "Page coverage" table in `summary.md` and check the types against the site's real templates: types come from the sitemap's own grouping or from URL shape, so a site with one flat sitemap may need `--per-type 2` or a few `--extra-url` additions.
- *Full site* (`--coverage all`): every URL without a choice made, to find the one landing page with a forgotten pixel or the old posts with embeds. Slow: allow roughly 10 to 20 seconds per page, so a 300-page site takes about an hour or more per scenario; lower `--wait` and use `--idle 0` to speed it up, and raise `--max-pages` deliberately for larger sites. Worth it before sign-off on a fix, or when the per-type run shows pages of the same type behaving differently.

The "Per page" table lists what each visited page loaded without a choice, with its type. Pages the sitemap does not list (cart, checkout, thank-you, account, search results, unindexed landing pages) are never covered automatically.

**Page coverage.** Templates behave differently: articles embed video, product pages load review and recommendation widgets, contact pages load a captcha or map, checkout loads payment scripts, the thank-you page is where conversion pixels fire. A front-page-only audit misses most of that. Before scanning, list the site's page types (from the navigation and the sitemap) and pass one URL of each with `--extra-url`; the automatic picks are a fallback, not the sample. Cart, checkout and thank-you pages need a session with something in the basket, and logged-in areas need a login: cover them with a short scripted run using the same browser library when you have authorisation, or list them as not covered.

Limits to keep in mind: one vantage point per run; a logged-out visitor only; a sample of pages; nothing server-side; third-party cookies may be partitioned or blocked by the browser so their absence is weak evidence; headless detection can make a site look cleaner than it is.

## 3. Look behind the browser

With whatever access exists, find out **where each tag comes from** and **who controls consent**. A tracker has to be fixed where it is injected.

**Tag sources to check**

- The consent tool's own script and service list.
- Tag manager container: every tag, its trigger and its consent settings. Ask for a container export or read access. In Google Tag Manager turn on the consent overview; tags with "No additional consent required" on an "All Pages" trigger are the usual leak.
- Plugins and apps that inject tracking by themselves (analytics plugins, pixel plugins, e-commerce integrations, email-marketing connectors, chat, reviews, social feeds).
- Hard-coded snippets: theme header and footer, theme options "custom scripts", snippet plugins, page-builder custom-code areas, individual page content.
- The edge: CDN-injected analytics, tag gateways, hosting dashboards. Compare origin HTML with what the browser receives.
- Server-side: conversion APIs, server-side tag manager, webhooks to CRMs and email tools. A clean browser scan with purchase events still arriving in an ad platform means a server-side path ignores consent.
- npm-bundled SDKs in app code (analytics, error tracking, chat) that no script-tag blocker can see.

WordPress, with shell or WP-CLI access:

```bash
wp plugin list --status=active --fields=name,version
wp db search 'googletagmanager.com|gtag\(|fbevents.js|fbq\(|clarity.ms|hotjar|snap.licdn|analytics.tiktok' --regex --all-tables --table_column_once
grep -rIlE 'gtag\(|fbq\(|GTM-[A-Z0-9]+|G-[A-Z0-9]{8,}|clarity\(|hj\(' wp-content/themes wp-content/mu-plugins
wp option get woocommerce_feature_order_attribution_enabled 2>/dev/null
```

`script-blocking.md` section 3.6 lists the plugins that commonly inject trackers and the cookies WordPress and WooCommerce set themselves; 3.7 and 3.8 cover Shopify and Next.js.

**Layers that reorder or hide things**

- Full-page cache and CDN: consent-dependent or geo-dependent markup rendered on the server gets cached for everyone.
- Script optimisers (delay, defer, combine, minify): can run tags before the consent default, merge a blocked script into an allowed bundle, or stop the consent tool recognising its own blocked scripts. Note which are active and what they exclude.

## 4. Diagnose the existing consent tool

Most sites already have a consent tool that is installed and not doing its job. Find the precise reason, because that decides between a ten-minute repair and a replacement. Work down this list and stop at the first that explains the scan; then keep going, since there is often more than one.

1. **Is it running at all for this visitor?** Not shown from this country (geo rules too narrow or region unknown), hidden for logged-in admins so the owner never sees it break, hidden by custom CSS, blocked by a script optimiser, or the plan quota is exhausted and the service has silently stopped (free tiers of several hosted tools do this).
2. **Is it in notice-only mode?** Banner plugins in "information" mode, an "OK" button with no reject, or implied-consent settings. Nothing is blocked by design.
3. **Is blocking enabled but missing the tags?** Automatic blocking only recognises scripts it knows, in the form it expects. Inline snippets in the theme, tags inside a tag manager, plugin-injected trackers, iframes, images, fonts and anything bundled or rewritten by an optimiser slip past. Compare the scan's vendor list with the tool's list of services.
4. **Is the tag manager outside its control?** The banner sets a cookie, and the container's tags fire on "All Pages" regardless. Check for a consent-initialisation tag or template from the tool, and per-tag consent settings.
5. **Is the order wrong?** Consent default set after the tags load, the tool loaded async or deferred behind the tags, `wait_for_update` missing. The `gcd` letters and the dataLayer order in the scan show this directly.
6. **Are there two owners of consent?** Two banners, a leftover from a previous tool, or two integrations both setting Consent Mode (for example a site-kit plugin and the consent tool). States disagree and the later one wins.
7. **Does the choice stick?** Reject not stored, cookie scoped to the wrong domain or path, cached pages serving a stale state, subdomains or the checkout not sharing consent.
8. **Does reject leave old cookies in place, or withdrawal do nothing?** No clean-up list per category, no reload, vendor revoke calls not made.
9. **Is the plan missing what the regimes need?** Geo rules, GPC, consent logs, Consent Mode and TCF are paid features in several tools. `consent-tools.md` has the tiers.
10. **Is the design itself the problem?** No first-layer reject, unequal buttons, pre-ticked categories, "legitimate interest" toggles on by default, a wall over the legal pages.

Record for the report: the tool, its version and plan, how it is integrated, and which of the above apply. `failure-patterns.md` maps each pattern to its usual fix; `consent-tools.md` section 2.3 gives each tool's cookie name, markup and JS API so you can read its state in the browser.

**Repair or replace?** Repair when the tool can do what the target regimes need on its current or an affordable plan and the failure is configuration or integration (the common case). Replace when it is notice-only by nature, abandoned, cannot gate the tags the site uses, lacks a required capability (geo rules, GPC, a Google-certified tool with TCF for a site running Google ad inventory in Europe, consent logs) or costs more than a sound alternative. Present both options with effort and cost when it is close.

## 5. The paper side

Read the policies the way a regulator would: against what the scan found.

- **Privacy policy** exists, is linked from every page, is in the audience's language, is dated, names the operator and a contact, and covers what the applicable laws require. Content checklists: `law-europe.md` section 7 (GDPR Art. 13, cookie policy, consent records), `law-us.md` section 6 (state-by-state content, required links and exact wording), `law-rest-of-world.md` per country.
- **It is true.** Every vendor in the scan appears as a recipient; nothing is promised ("we never share your data", "no tracking") that the scan contradicts. Untrue statements are their own liability, separately from the tracking.
- **Cookie policy or declaration** lists what the scan finds, per cookie or per category: name, provider, purpose, lifetime. Auto-generated lists go stale; diff the list against `results.json`.
- **Banner text** names the purposes, links the policy, says the choice can be changed and how, and matches what the controls do.
- **Required links** for the regimes in scope: persistent cookie settings (opt-in regimes); "Your Privacy Choices" or "Do Not Sell or Share My Personal Information" and a notice at collection (California and state laws); a consumer health data policy (Washington, Nevada) where relevant; imprint (Germany, Austria).
- **Forms**: privacy information at the point of collection, no pre-ticked marketing consent, marketing consent separate from terms, the right wording for phone/SMS consent in the US.
- **Rights requests**: a working route to access, delete, correct and opt out, with the methods each law requires.
- **Records**: can the operator show who consented to what, when, against which banner version? Check the tool's log or export. Many plans do not keep one.
- **Out of the scan's reach, worth a question**: processor agreements with each vendor, international transfer mechanism, data protection assessments where state law requires them, email tracking pixels, the mobile app.

## 6. Turn observations into findings

One finding per distinct problem, each stated against a target regime:

- **Observation**, with evidence: scenario, phase, cookie names or request hosts, consent parameters, screenshot file, where the tag is injected.
- **Rule**: what it conflicts with and for which audience, in one sentence, with a pointer (for example "CNIL: refusing must be as easy as accepting", "CCPA regulations: opt-out preference signals must be honoured").
- **Severity**:
  - *Critical*: the site does the opposite of what it tells visitors (reject or opt-out not honoured, GPC ignored in a mandatory state), or advertising/replay tags run without consent for an opt-in audience or on sensitive pages.
  - *High*: non-essential tracking before consent for an opt-in audience without the above aggravation; no usable reject; missing mandatory opt-out link; consent defaults broken; missing or materially false privacy policy.
  - *Medium*: embeds and third-party resources before consent; withdrawal clumsy; choice not persisted; policy incomplete or stale; no consent records.
  - *Low*: lifetime, wording, design polish, missing optional files.
  - Raise one level where a sensitive category is involved or the regime is heavily enforced or litigated for that issue; lower one where the affected audience is marginal for this site.
- **Fix**: concrete and located ("in GTM, add ad_storage as additional consent on tags X and Y", "remove the hard-coded pixel in header.php line N and re-add it through the consent tool").
- **Effort** and any dependency or cost.

Group the report so the owner sees the few things that matter first. `report-template.md` has the structure.
