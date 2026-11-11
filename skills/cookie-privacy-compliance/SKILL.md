---
name: cookie-privacy-compliance
description: Audit, fix and verify cookie, tracking and privacy compliance on any website (WordPress, WooCommerce, Shopify, Next.js, static, anything), for any target market - EU/EEA GDPR and ePrivacy, UK PECR, Switzerland, US state laws (CCPA/CPRA, GPC, wiretap/CIPA risk), Canada/Quebec, Brazil LGPD, Asia-Pacific and the rest of the world. Use this whenever the user mentions cookie banners, cookie consent, consent management tools (Complianz, CookieYes, Cookiebot, OneTrust, Usercentrics, iubenda, Termly and so on), GDPR/CCPA/LGPD or "privacy compliance" for a site, Google Consent Mode, Global Privacy Control, "Do Not Sell" links, trackers or pixels firing before consent, a banner that does not actually block scripts, privacy or cookie policy gaps, a legal or agency complaint about tracking, or asks whether a site is compliant, even if they only ask for one piece such as "add a cookie banner", "check what cookies this site sets" or "is GA4 legal here". Covers the whole job end to end - scoping jurisdictions, scanning the live site, diagnosing a half-configured consent tool, implementing the fix, and proving it works.
---

# Cookie, tracking and privacy compliance

This skill takes a website from "we think we have a cookie banner" to "here is evidence that the site behaves lawfully for the visitors it serves". The work has four phases: **scope**, **audit**, **implement**, **verify**. A request may need only some of them (an audit-only engagement stops after the report), but they always run in this order, because each one depends on the one before.

Three ideas drive everything here.

**Behaviour is what counts, and it has to be measured.** Regulators and plaintiffs test what the browser actually does: which cookies exist and which third parties are contacted before a choice, after a refusal, after a withdrawal. A banner proves nothing. Most real findings are a banner that is present and looks fine while the tags fire anyway. So never conclude from the presence of a consent tool, a plugin setting or a line of code; conclude from a scan.

**The rules depend on who the visitors are.** Europe is opt-in (nothing non-essential before consent). The US is opt-out with opt-in pockets and a large litigation risk. Much of the rest of the world sits between. The same site can be fine for one audience and unlawful for another, so scope comes first and every finding is stated against a named regime.

**A banner that lies is worse than no banner.** A "Reject" button that does not stop the tags turns a compliance gap into a deception claim (this is the fact pattern in nearly every California enforcement action). Never ship or leave in place a decorative banner. If something cannot be gated yet, say so and remove the promise.

You are not the user's lawyer. Give clear, practical findings with the rule behind each one, flag the places where the law is unsettled or the facts need a legal judgement, and say that in the report. Do not hide behind disclaimers either: the user wants to know what to fix.

## Reference files

Read what the engagement needs, not everything.

| File | Read it when |
|---|---|
| `references/jurisdictions.md` | Always, during scoping. Maps the site's audience to consent regimes and tells you which law file to open. |
| `references/law-europe.md` | Any EU/EEA, UK or Swiss visitors. Per-country differences, banner design rules, analytics exemptions, enforcement. |
| `references/law-us.md` | Any US visitors. State-law thresholds, GPC, California specifics, wiretap litigation, health/kids/finance. |
| `references/law-rest-of-world.md` | Canada, Latin America, Asia-Pacific, Middle East, Africa. |
| `references/audit-playbook.md` | Running the audit: scanner usage, reading results, inspecting code and config, diagnosing an existing consent tool. |
| `references/failure-patterns.md` | Interpreting scan results. 27 patterns that explain most findings. |
| `references/implementation.md` | Planning and making the fix: choosing or repairing a consent tool, rollout order, policies, GPC. |
| `references/consent-signals.md` | Wiring a specific vendor: Google Consent Mode v2, Meta, Microsoft, TikTok, TCF/GPP, Shopify, WP Consent API. |
| `references/consent-tools.md` | Choosing between consent tools, or finding a tool's cookie name, markup and JS API. |
| `references/script-blocking.md` | Gating a tag, embed, font or server-side event; WordPress, Shopify, Next.js and SPA specifics. |
| `references/testing-tools.md` | Verification: the full test matrix, accessibility and performance checks, geo simulation. |
| `references/report-template.md` | Writing the audit report or the verification report. |

The law files were verified on 2026-11-11 and mark every claim with a confidence tag. Privacy law moves monthly. When a recommendation hinges on a detail that is tagged uncertain, listed under "things in flux", or more than a few months old, check it against a current primary source before relying on it, and tell the user which points you re-checked.

## Phase 1: Scope

Establish these before scanning. Find what you can yourself (the site, its footer, its policies, the codebase), then ask the user only for what you cannot find. Keep it to one round of questions.

1. **Which sites and hosts.** Main domain, subdomains, a separate checkout or app domain, staging.
2. **Where the visitors are.** Ask for the real audience, and check it against evidence: languages, currencies, shipping countries, analytics geography if you have access. "US only" from an English-language store that ships worldwide is not US only. A site is caught by a law when it targets or serves people there, wherever the business is.
3. **What the site does with data.** Ads and remarketing, analytics, email marketing, accounts, e-commerce, embedded media, chat, session replay. And whether any of it touches a sensitive area: health, children or teens, finance, precise location, anything revealing a protected characteristic. Sensitive areas change the answer in every jurisdiction.
4. **Size, for US law.** Rough annual revenue and visitor volume by state decide which state laws apply. Unique visitors with an ad cookie count as "consumers", so thresholds are reached sooner than owners expect.
5. **What access you have.** Read-only public site, admin login, code repository, hosting or SSH, tag manager, the consent tool's dashboard, ad platform accounts. This sets how deep the audit can go and whether you can implement.
6. **What the user wants out of it.** Audit report only, or fix and verify as well. Any measurement they cannot afford to lose. Budget for paid tools.

**When there is no site to scan yet** (the user asks for a plan, a quote or advice and gives no URL, or describes the site from memory): do not skip the measurement, move it. Treat what you were told as a hypothesis, write the plan against it, and make "scan from each target region to confirm the starting point" the plan's first step, with the scanner commands filled in. Say which parts of the plan depend on facts you have not observed.

Then open `references/jurisdictions.md` and write down the **target regimes**: for each audience, the regime that applies and the two or three rules that will drive findings. State this back to the user in a few lines before the audit. If the audience is unknown or worldwide, the default is strict opt-in for everyone, relaxed only for a short list of countries where the law is settled.

## Phase 2: Audit

Follow `references/audit-playbook.md`. In outline:

1. **Scan the live site** with the bundled scanner. It loads the site in a clean browser under separate scenarios (no interaction, reject, accept, Global Privacy Control, optionally withdraw) and records cookies, web storage, third-party requests and Google consent signals in each phase.

   ```bash
   # one-time setup
   npm install --prefix <skill-dir>/scripts && npx --prefix <skill-dir>/scripts playwright install chromium

   node <skill-dir>/scripts/scan.mjs https://example.com --out ./scan-quick                    # quick look: start page + a few links
   node <skill-dir>/scripts/scan.mjs https://example.com --coverage types --out ./scan-us       # audit: every page type in the sitemap
   node <skill-dir>/scripts/scan.mjs https://example.com --coverage all --out ./scan-full       # every sitemap URL (slow)
   node <skill-dir>/scripts/scan.mjs https://example.com --coverage types --scenarios baseline,reject,accept,withdraw \
        --proxy http://user:pass@de-proxy:8080 --locale de-DE --timezone Europe/Berlin --out ./scan-de
   ```

   Use `--coverage types` for anything that becomes a report: page templates differ (articles embed video, product pages load widgets, contact pages load a captcha), and a front-page scan misses most of it. Add cart, checkout and thank-you pages by hand; they are not in sitemaps.

   Read the "Facts" table at the top of `summary.md` first, then the screenshots, then the per-scenario detail you need (on ad-heavy sites the detail is long; search it instead of reading it through). The scanner reports where it ran from. **Consent tools change behaviour by visitor country, so a scan only describes that country.** Scan from each target regime (through a proxy or VPN exit) or state plainly in the report which regimes were not observed. Never present a US-IP scan as evidence about EU visitors.

2. **Look behind the browser** as far as your access allows: where each tag is injected (theme, plugin, tag manager, hard-coded, edge), how the consent tool is configured, server-side tracking that a browser scan cannot see, caching and script-optimisation layers that reorder things.

   Two site types need more than the default run, and the playbook covers both: sites whose optimiser holds every script until the first mouse movement or an idle timer (a quick scan of these looks clean when it is not), and US-style opt-out sites with no reject button, where the question is whether the opt-out and GPC reach the whole ad stack. When the scanner cannot answer a question the engagement turns on, write a short probe with the same browser library and keep it with the evidence.

3. **Diagnose the consent tool that is already there.** Usually one is installed and half set up. Work out exactly why it fails (the playbook has a decision sequence) because the fix is far more often a repair than a replacement.

4. **Check the paper side**: privacy policy, cookie policy, required links and wording, forms and their consent language, rights-request route, consent records.

5. **Write findings against the target regimes.** Each finding: what was observed (with evidence from the scan), which rule it breaks for which audience, how serious, and the fix. Use `references/report-template.md`. The report has two layers: a plain-language summary a site owner can act on, then the technical detail for whoever implements.

Stop here if the engagement is audit-only. Do not change anything on a site during an audit.

## Phase 3: Implement

Follow `references/implementation.md`. The essentials:

- **Agree the plan first.** Show the user what will change, what measurement they will lose or keep, any paid plan it needs, and get a yes. Removing or gating a tracker changes someone's reporting and ad performance; that is their call, not yours.
- **Work somewhere safe.** Staging if it exists. On production: back up first, change one thing at a time, know how to roll back, and never leave a site in a state where the banner promises something the tags do not do.
- **Fix in dependency order**: remove what is unused, establish one consent tool as the single owner of consent, set consent defaults before any tag loads, gate every tag and embed through it, wire vendor signals (Consent Mode and the rest), handle GPC and US opt-out links, make withdrawal work, then update policies to match what the site now does.
- **Purge every cache layer** after changes (page cache, CDN, minify/combine bundles), or you will test yesterday's site.

## Phase 4: Verify

Nothing is fixed until a fresh scan shows it. Re-run the scanner with the same scenarios and vantage points as the audit and compare against the audit run. `references/testing-tools.md` has the full matrix; the minimum for sign-off is:

- **Opt-in audiences**: zero non-essential cookies and zero tracker requests before a choice and after reject, including after real mouse and scroll input; reject on the first layer with equal prominence; accept actually loads the tags; withdrawing stops them and removes first-party tracker cookies; the choice persists across pages and is not re-asked.
- **Opt-out audiences**: the opt-out link and GPC each stop sale/share/targeted-advertising tags without further clicks; California visitors see confirmation that the signal was honoured; nothing fires before consent on pages touching sensitive data.
- **Everywhere**: consent signals on outgoing Google hits match the state the visitor chose; results are the same on cached and uncached loads, on mobile, and on the page types that matter (product, checkout, thank-you, forms); the cookie policy lists what the scan finds.

Report what passed, what failed, and what could not be tested (for example a region you had no vantage point in, or server-side events you had no access to). An untested check is reported as untested, never as passed.

## Working notes

- **Evidence over assertion.** Quote the cookie name, the request host, the consent parameter, the screenshot. A finding without evidence is an opinion.
- **Unknown cookies and hosts are findings to resolve**, not to wave through. Identify them (who sets them, what for) or list them as unresolved.
- **Severity follows real exposure**: who the audience is, what data is involved, how visible the failure is, how actively that rule is enforced or litigated. An ad pixel firing before consent for French visitors, or on a US health page, is critical. A missing imprint link is not.
- **Keep the user's measurement where the law allows.** Compliance does not mean deleting analytics. Prefer the option that satisfies the rule and keeps the most useful data: consent-gated tags, Consent Mode, cookieless or exempt-configuration analytics, region-specific behaviour. Explain the trade-off and let the user choose.
- **Say what you did not check.** Mobile apps, email tracking pixels, offline data sharing, vendor contracts and international-transfer paperwork are part of privacy compliance and mostly outside a website scan. Name the ones that look relevant so they are not assumed done.
