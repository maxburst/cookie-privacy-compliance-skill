# Implementation guide

How to get from audit findings to a site that behaves correctly. The detailed mechanics live in `consent-signals.md` (per-vendor signalling), `script-blocking.md` (gating techniques and platform specifics) and `consent-tools.md` (tool comparison and cheat sheet). This file is the order of work and the decisions.

## Contents

1. Before touching anything
2. Decide the target behaviour
3. Repair or choose the consent tool
4. Order of work
5. Banner and preference design
6. US layer: opt-out links and Global Privacy Control
7. Policies and records
8. Platform notes
9. Hand-over

## 1. Before touching anything

- **Get agreement on a written plan**: what changes, in what order, what measurement is lost or kept in each region, what it costs (plan upgrades, a paid tool), and what the owner must do themselves (legal text sign-off, ad-platform settings, vendor contracts). Removing or gating tags changes reporting and ad performance, so the owner decides.
- **Find the safest place to work.** Staging if it exists and resembles production (same plugins, same tag manager container, same cache layers). Otherwise production in a quiet period with a backup of the database and the files you will touch, and an export of the tag manager container and the consent tool's settings.
- **One change at a time, with a way back.** After each change run the relevant scanner scenario. Keep a short change log: it becomes part of the hand-over.
- **Never leave a lying banner.** If a step breaks blocking, roll back before walking away. If a tag cannot be gated yet, remove the tag or change the banner's promise.
- **Credentials and accounts**: use what the user gives access to; ask them to do the steps that need their own login to third-party dashboards if you cannot.

## 2. Decide the target behaviour

From the scoped regimes (`jurisdictions.md`), fix one of these designs with the user:

| Design | Behaviour | Good for |
|---|---|---|
| **A. One strict behaviour** | Opt-in for everyone, plus GPC handling and US links. | Small sites, free tool tiers, anyone who values simplicity over measurement. |
| **B. Geo rules by regime** | Opt-in for EEA/UK/CH and other strict countries; US configuration for US visitors; opt-in when the country is unknown; optional relaxed allow-list. | Sites with real traffic in both opt-in and opt-out markets. Needs a tool and plan with geo rules, and testing from each region. |
| **C. Consent-free measurement plus gated marketing** | Replace or reconfigure analytics so it qualifies for an exemption or needs no device storage (see the law file for the countries concerned), gate everything else. | Owners who care most about not losing analytics. More work, country-specific, and needs honest configuration. |

For US visitors choose explicitly between **opt-out only** (tags fire, footer link and GPC stop them: satisfies the privacy statutes, leaves wiretap exposure) and **consent-gated** (ad, replay and chat tags wait for Accept, GPC counts as Reject: the defensible design when those tags exist). `law-us.md` section 5.

For Google tags choose **basic** Consent Mode (no Google tag loads before consent; the conservative reading for Europe) or **advanced** (tags load and send cookieless pings while denied; better modelling, still a pre-consent request). Default to basic for opt-in audiences unless the owner, informed of the trade-off, chooses advanced.

Write the chosen design down. It is the specification the verification phase tests against.

## 3. Repair or choose the consent tool

**If a tool is already installed**, start from the diagnosis in `audit-playbook.md` section 4. Repair it when it can meet the design on a plan the owner accepts. Typical repairs: switch from notice-only to blocking mode; enable its tag manager template and set per-tag consent; move the default-consent snippet to the top of the head and exclude it and the tool from script optimisers; add the missed services (hard-coded snippets, embeds, plugin trackers) to its blocking rules; fix the region list; turn on GPC, Consent Mode v2 and consent logging; remove the leftover second tool. Check plan limits against real traffic: a quota that runs out mid-month puts the site straight back out of compliance.

**If choosing a tool**, decide from requirements, not habit:

1. **Google ad inventory shown to EEA/UK/Swiss visitors** (AdSense, Ad Manager, AdMob)? Then a Google-certified tool with IAB TCF is mandatory. Otherwise do not enable TCF: it adds a long vendor list for no benefit.
2. **Geo rules needed** (design B)? Many free tiers show one behaviour worldwide.
3. **US obligations in scope?** Needs GPC handling, an opt-out flow and ideally GPP if the site sells programmatic ads.
4. **Proof of consent needed** (any GDPR audience)? Needs a consent log; often a paid feature.
5. **Platform**: WordPress plugin, Shopify (native Customer Privacy API or an app that drives it), custom or JS framework (a library such as vanilla-cookieconsent or c15t, or a hosted tool), several platforms under one brand (a hosted tool keeps them consistent).
6. **Where the consent tool itself runs**: self-hosted tools avoid a third-party request for the banner and have no traffic quota; hosted tools keep cookie databases and legal templates current and usually log consent for you.
7. **Budget and who maintains it.** A tool the owner will not keep paying for, or cannot operate, will fail quietly.

`consent-tools.md` has the comparison tables (free-tier limits, pricing, certification, GPC, geo, auto-blocking, logging) and the selection heuristics. Prices and tiers change: confirm on the vendor's page before recommending a paid plan.

## 4. Order of work

Each step makes the next one possible. Verify after each.

1. **Remove what is not used.** Dead pixels, duplicate analytics (the same ID loaded by two plugins), abandoned A/B tools, an old consent tool. Confirm with the owner; fewer tags is less to gate.
2. **One owner of consent.** Exactly one consent tool, and exactly one integration setting Google's consent state.
3. **Defaults before everything.** The consent default (denied for opt-in regions) is set inline at the very top of the head, before the tag manager or any Google tag, and is excluded from defer, delay and combine. Add `wait_for_update` if the tool loads asynchronously. `consent-signals.md` section 1.1 has the canonical snippet and region syntax.
4. **Gate every tag at its source.**
   - Tag manager: load consent state through the tool's template on the consent-initialisation trigger; give every non-Google tag an explicit consent requirement; add the consent-update event as a trigger so tags fire when consent arrives mid-page.
   - Plugin-injected trackers: turn on each plugin's consent integration, or block its script through the tool's service rules, or move the tag into the tag manager and disable the plugin's output.
   - Hard-coded snippets: remove and re-add through the tool or tag manager, or convert to blocked markup (`type="text/plain"` with the tool's category attribute, using `data-src` for external scripts).
   - Bundled SDKs: initialise them from the consent callback in code.
   - Server-side events: pass the consent state to the server and suppress or flag events without it. Test with a refused purchase.
5. **Gate embeds and third-party resources.** Click-to-load placeholders for video, maps, social and scheduling embeds; self-host fonts and libraries; scope captcha to the pages with forms or replace it with a privacy-friendly one. `script-blocking.md` sections 3.4 and 3.5.
6. **Wire vendor signals.** Consent Mode v2 with all four ad and analytics types; Microsoft UET and Clarity; Meta consent and Limited Data Use; TikTok, LinkedIn, Pinterest and the rest as present. `consent-signals.md`.
7. **Make refusal and withdrawal real.** Reject stores a refusal; a persistent control reopens the choices from every page; withdrawing updates vendor signals, deletes the first-party tracker cookies for that category and reloads so loaded scripts stop. (The UK also expects data collected under the withdrawn consent to be deleted: tell the owner.)
8. **Geo rules**, if design B: region list per regime, opt-in when unknown, and decided in the browser or varied in the cache so cached pages do not serve the wrong region's behaviour.
9. **US layer**: section 6 below.
10. **Design pass** on the banner and preference centre: section 5.
11. **Policies and records**: section 7.
12. **Purge every cache** (page cache, CDN, optimiser bundles) and run the full verification in `testing-tools.md`.

## 5. Banner and preference design

For opt-in audiences the first layer has: a short statement of what is used and why, naming the purposes; **Accept** and **Reject** as two buttons of the same size, weight and contrast; a link to granular settings; a link to the policy; mention that the choice can be changed later and where. Italy additionally expects a close "X" that means reject.

- Categories default to off, except strictly necessary which is fixed on. No "legitimate interest" toggles for anything that needs consent.
- Closing, scrolling or navigating is never acceptance.
- The banner must not block the privacy policy, cookie policy or imprint pages.
- Wording is plain and in the audience's language. No guilt labels on the reject button.
- Category names match what is actually blocked; analytics is not filed under "necessary" or "functional".
- The preference centre lists services per category with provider, purpose and lifetime, or links to the cookie policy that does.
- Accessible: reachable by keyboard early in the tab order, visible focus, labelled dialog, sufficient contrast, targets at least 24 by 24 px, works at 320 px width. `testing-tools.md` matrix row 17.
- Light: fixed or overlay positioning so it does not shift the layout; not the largest element on the page; the consent tool's script as small as it can be.

The consolidated list of banner dark patterns and which authority objects to each is in `law-europe.md` section 6.1. For US visitors the same symmetry rules apply to any banner or preference centre that is shown.

## 6. US layer: opt-out links and Global Privacy Control

When US state laws apply (`law-us.md` sections 1, 2 and 5):

- **Footer link on every page**: "Your Privacy Choices" with the opt-out icon (satisfies California and reads acceptably elsewhere), opening a control that stops sale, sharing and targeted advertising without requiring an account or identity check. Add "Limit the Use of My Sensitive Personal Information" only if sensitive data is used beyond the permitted purposes.
- **The control must act on the tags**: update Google consent types (`ad_storage`, `ad_user_data`, `ad_personalization` denied or restricted data processing), set Meta Limited Data Use, stop or flag other ad pixels, and reach server-side sharing and audience uploads too. A form that only records a request is the Tractor Supply failure.
- **GPC**: read `navigator.globalPrivacyControl` (and `Sec-GPC` on the server if behaviour is decided there, with `Vary: Sec-GPC`) on first load and apply the same opt-out with no clicks. Apply it to the account when the visitor is logged in. Show a visible confirmation such as "Opt-out preference signal honored" (required in California since 1 January 2026). Do not let a previous Accept override the signal without asking. Publish `/.well-known/gpc.json`.
- **Simplest safe scope**: honour GPC for every US visitor, since the list of mandatory states grows each year. In opt-in regions treat GPC as at least a refusal of marketing.
- **Symmetry**: opting out takes no more steps than opting in; no pre-ticked choices; do not ask again for 12 months after an opt-out.
- **Sensitive pages**: no third-party advertising, social or replay tags on pages that reveal health conditions, children's data or financial applications unless there is specific opt-in consent and the sector rules are met (`law-us.md` section 4).

## 7. Policies and records

After the site behaves correctly, make the documents describe it. Draft from what the final scan shows; the owner (and their lawyer, where they have one) approves the text.

- **Cookie policy or declaration**: every cookie and similar technology the scan finds, by category, with provider, purpose and lifetime; how to change the choice. Prefer the consent tool's generated declaration if it is kept in sync, and check it against the scan.
- **Privacy policy**: recipients updated to the real vendor list; purposes and legal bases; transfers and their mechanism; retention; rights and how to use them; the US sections the applicable state laws require, including the GPC statement and opt-out methods; the date.
- **Records of consent**: turn on the tool's consent log and confirm an entry is written; note retention.
- **Internal note for the owner**: which design was implemented, which tags exist and under which category, how to add a new tag correctly (through the tool or tag manager with a consent requirement, never pasted into the theme), and when to re-scan.

Keep drafted legal text clearly marked as a draft for the owner's approval. Do not publish policy changes on a live site without their say-so.

## 8. Platform notes

- **WordPress and WooCommerce**: `script-blocking.md` section 3.6 (core and WooCommerce cookies and their classification, plugin trackers, cache and delay-JS interactions) and `consent-signals.md` section 1.10 (WP Consent API, Site Kit consent mode, WooCommerce order attribution). Recurring traps: an optimiser delaying or combining the consent tool; Site Kit and the consent tool both setting Consent Mode; order-attribution cookies set for everyone; a page cache serving the server-side consent or geo decision to everybody; the banner hidden for logged-in admins. Put custom code in a small regular plugin or the child theme, not in must-use plugins or a parent theme that updates will overwrite.
- **Shopify**: `consent-signals.md` section 1.9 and `script-blocking.md` section 3.7. Use the Customer Privacy API as the source of truth so Shopify's own analytics and app pixels follow it; scripts hard-coded in the theme and app-injected scripts are not governed by it and need gating in code.
- **Next.js, React and other SPAs**: `script-blocking.md` sections 3.8 and 3.9. Third-party helper components load tags unconditionally; consent defaults belong in the earliest script; SDKs imported from npm need gating in code; route changes must neither reset consent nor skip embeds mounted later; reload after withdrawal.
- **Static sites and site builders** (Webflow, Squarespace, Wix): use the platform's native consent feature where it really blocks, verify it with the scanner rather than trusting the setting, and gate custom code embeds by hand.

## 9. Hand-over

Deliver: the verification report (`report-template.md`), the change log, the internal note from section 7, anything still open with its owner (legal sign-off, vendor contracts, regions not tested), and a re-scan recommendation: after any new plugin, tag or marketing tool, after consent-tool or theme updates, and on a schedule (quarterly is reasonable) because tags and laws both drift.
