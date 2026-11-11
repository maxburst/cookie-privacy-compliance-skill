# Jurisdictions: from audience to consent regime

Use this during scoping to turn "where are the visitors" into a short list of regimes and rules. It is a router: the detail, sources and confidence tags are in the three law files. Verified 2026-11-11; laws listed under "in flux" at the end of each law file move often.

## When a law applies

A privacy law generally reaches a site that **targets or serves people in that place**, wherever the operator is based. Evidence of targeting: language, currency, shipping or service area, local domain, local ads, local testimonials, a meaningful share of traffic. Incidental visitors from a country the site does nothing to court are usually out of scope, but a consent tool that geo-targets still has to do something sensible for them.

US state laws also have size thresholds (revenue, number of residents whose data is processed). See `law-us.md` section 1 before telling a small site it is exempt: unique visitors with an ad cookie count, Texas and Nebraska have no volume threshold, and wiretap litigation has no threshold at all.

## The five regimes

Every jurisdiction fits one of these closely enough to drive configuration. A consent tool with geo rules is set up per regime, not per country.

| Regime | What it requires | Where |
|---|---|---|
| **1. Strict opt-in** | No non-essential cookie, storage or tracker request before an affirmative choice. Reject on the first layer, as easy and as prominent as accept. Granular categories, nothing pre-ticked. Withdrawal as easy as consent, from every page. Choice remembered about 6 months, not re-asked. Proof of consent kept. | EU/EEA (all 30), UK (for ads, social, replay), Quebec, Brazil (ads), Turkey, China, India (fully from May 2027), Vietnam, Thailand, Nigeria, Colombia, Peru, Uruguay, Egypt, Russia, Serbia, Ukraine, UAE, Kenya, Indonesia, Argentina, Chile (once in force) |
| **2. Opt-in for ads and sensitive data, analytics on notice or opt-out** | Advertising, remarketing and profiling tags held until consent. Analytics may run with clear notice and an easy objection. Everything held on sensitive pages. | UK (analytics and appearance exceptions since 5 Feb 2026, conditions apply), Switzerland, South Korea, Singapore, Saudi Arabia, Philippines, Israel, South Africa |
| **3. Notice and opt-out** | Tags may load. Clear notice, and a working control to stop sale, sharing and targeted advertising, honoured at once. | US states with comprehensive laws (plus mandatory Global Privacy Control in 12 of them and California's extra rules), Canada outside Quebec, Mexico, Malaysia, Taiwan, Australia |
| **4. Notice only** | Accurate, specific disclosure. No choice UI required by law. | New Zealand, Hong Kong, Japan (with its per-tag disclosure list), US sites below every threshold |
| **Overlay: sensitive data and minors** | Opt-in (or outright prohibition) regardless of the regime above. | Everywhere. Health, children and teens, finance, precise location, protected characteristics. |

Placement of some countries is debatable (Brazil analytics, Quebec's scope, Thailand, Korea); the law files say where and why. When unsure, use the stricter regime.

## Things that are easy to get wrong

- **UK is no longer the same as the EU.** Since 5 February 2026 analytics and appearance storage can run without consent if strict conditions are met (first-party purpose, provider acts only as processor, clear information, simple free objection). Default GA4 linked to ads does not meet them. Ads still need opt-in. `law-europe.md` section 4.
- **EU countries differ on analytics.** France, Spain, Italy and the Netherlands have narrow exemptions for privacy-friendly audience measurement; Germany, Austria, Belgium, Denmark and Ireland do not. Standard Google Analytics qualifies nowhere in the EU. `law-europe.md` section 3.
- **Switzerland is opt-out by default**, opt-in only for high-risk profiling and sensitive data, but most Swiss sites also serve EU visitors.
- **The US needs no cookie banner by statute for ordinary tracking**, yet prior consent is the only reliable defence to wiretap claims over pixels, session replay and chat, which is where small US sites actually get hurt. A US banner must therefore really gate the tags or not exist. `law-us.md` sections 3 and 5.
- **Global Privacy Control is separate from the banner.** In the 12 mandatory states it must be honoured automatically on first load, applied to the logged-in account, and (California, since 1 January 2026) visibly confirmed.
- **"Cookieless" and "server-side" do not escape consent.** In Europe the rule covers any storage on or reading from the device, and moving a pixel to the server changes the transport, not the legal basis.
- **Proposed reforms are not law.** The EU Digital Omnibus is still a proposal; nothing in it changes current obligations.
- **Language.** Notices must be understandable to the audience: French in Quebec, Portuguese in Brazil, the local language across the EU, and so on.

## Common audience profiles

**US only.** Regime 3 or 4 by state thresholds, plus the overlay. Decide with the user whether to gate ad, replay and chat tags behind consent for wiretap defence (recommended whenever those tags exist, strongly for California traffic and for anything health-adjacent). Always: accurate privacy policy, GPC honoured, opt-out link where state law applies. Read `law-us.md` sections 0, 1.2, 3.7, 5 and 6.

**EU/EEA and UK.** Regime 1 everywhere as the base. Optionally use the national analytics exemptions and the UK exceptions if the user wants consent-free measurement and is willing to switch to a qualifying tool and configuration. Read `law-europe.md` sections 0, 3.1, 4 and 6.1, plus the country sections for the main markets.

**US and Europe.** Geo rules: regime 1 for EEA, UK and Switzerland; a US configuration for US visitors; regime 1 for anyone the tool cannot locate. Test from both sides.

**Worldwide or unknown.** Regime 1 as the default for every country, relaxed to regime 3 or 4 only for a short allow-list where the law is settled and banner enforcement is low: Australia, New Zealand, Japan, Hong Kong, Canada outside Quebec, Mexico, Malaysia, Taiwan. US visitors get the US configuration. Apply the sensitive-page and minors overlay globally. Read `law-rest-of-world.md` sections 0, A, B and C.

**One global behaviour, no geo rules.** Simplest to build and test, and what a free consent-tool tier usually offers: regime 1 for everyone, plus GPC handling and the US links. Costs measurement in opt-out markets. Reasonable for small sites; say what it costs.

## What to write down at the end of scoping

A few lines the user can confirm, for example:

> Audience: Germany, Austria, UK and US (about 40% US, some California). Regimes: strict opt-in for DE/AT (no analytics exemption, reject on first layer, Google Fonts and embeds matter); UK opt-in for ads with the option of consent-free analytics if we reconfigure; US opt-out with GPC, plus consent-gating of the Meta pixel and Hotjar for wiretap defence. Sensitive overlay: none found. Not in scope: the mobile app.

Every later finding refers back to these regimes.
