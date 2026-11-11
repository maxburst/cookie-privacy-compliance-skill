# United States: cookie / tracking / privacy compliance reference

**Last verified: 2026-11-11.** Scope: US federal + state law as it bears on websites (cookies, pixels, SDK-style tags, session replay, chat widgets, forms, privacy notices). Practitioner reference, not legal advice.

**How to read the confidence tags**

- No tag = checked against a source during the 2026-11-11 research pass (source linked nearby).
- `[M]` = from prior knowledge, not re-checked in this pass. Usually stable statutory detail, but confirm before relying on it for a client.
- `[UNCERTAIN]` = sources conflict or the point could not be confirmed. Do not present as settled.

Most 2026 facts come from law-firm alerts and regulator press pages rather than statute text. Where the statute itself was not read, that is stated.

---

## Contents

- 0. The ten things that matter most
- 1. State comprehensive consumer privacy laws
- 2. California in depth
- 3. Litigation risk from trackers
- 4. Sector and topic laws
- 5. What a US-only site actually has to do, by tier
- 6. Privacy policy content and required links
- 7. Federal privacy bill status
- 8. Things in flux (re-check before relying)
- 9. Could not verify in this pass

---

## 0. The ten things that matter most

1. **The US is opt-out, not opt-in, for ordinary ad/analytics cookies.** No state comprehensive privacy law requires a GDPR-style cookie banner for general tracking. What is required: a working opt-out for sale / "sharing" / targeted advertising, honoring Global Privacy Control (GPC) in 12 states today, and an accurate privacy notice.
2. **Opt-in is required in specific pockets:** sensitive data (most non-California states), consumer health data (Washington, Nevada, Connecticut), known children and (increasingly) teens, HIPAA-covered data, video-viewing data sent with identity (VPPA), and California sale/share of under-16 data.
3. **Litigation, not regulators, drives most small-site risk.** Wiretap-style suits and demand letters (California CIPA, federal Wiretap Act, Pennsylvania, Florida) target pixels, session replay and chat. Prior consent is a complete defense, which is why many US sites now block third-party tags until consent, at least for California visitors.
4. **California SB 690 was signed 2026-09-30.** From 2027-01-01 private plaintiffs can no longer sue under CIPA's pen-register section (§638.51) for website/app tracking; it reaches pending claims in actions filed on or after 2025-01-01. **§631 (wiretap) and §632/§632.7 suits are untouched** and plaintiffs are already re-pleading into them.
5. **A cookie banner that does not do what it says is worse than no banner.** Every recent California action (Healthline, Honda, Todd Snyder, Tractor Supply, PlayOn, Disney) and a growing line of court rulings turn on a gap between the UI and what the tags actually do.
6. **GPC must be honored independently of the banner**, applied to the logged-in account where the user is known (Disney, $2.75M), and since 2026-01-01 California sites must *display* that the opt-out was honored.
7. **24 states now have comprehensive laws** (20 in force; Oklahoma, Louisiana, Alabama effective 2027; Vermont 2028). Thresholds are dropping: Connecticut is now 35,000 consumers *or any sensitive data or any sale*; Delaware drops to 10,000 on 2027-01-01.
8. **Health-adjacent sites are the highest-risk category**: FTC (GoodRx, BetterHelp, Cerebral, and the 2026 Hims & Hers suit), Washington MHMDA private right of action, HIPAA, and the most successful wiretap suits all converge there.
9. **Amended COPPA rule is fully enforceable since 2026-04-22**, including separate parental consent for third-party advertising disclosures.
10. **No federal comprehensive law.** The House GOP SECURE Data Act (H.R. 8413, April 2026) would preempt state laws; it had a subcommittee hearing in June 2026 and no markup that could be found.

---

## 1. State comprehensive consumer privacy laws

### 1.1 Master table

Sources for effective dates and the opt-out-signal column: [Mayer Brown state tracker (current as of 2026-09-03)](https://www.mayerbrown.com/en/insights/resource-centers/cybersecurity-and-data-privacy-resource-center/state-privacy-law-tracker). New 2026 laws: [Benesch, 2026-10-12](https://www.beneschlaw.com/insight/the-privacy-patchwork-grows-alabama-louisiana-oklahoma-and-vermont-join-the-compliance-landscape/pdf/) (read in full), [Morgan Lewis, July 2026](https://www.morganlewis.com/pubs/2026/07/new-us-state-consumer-privacy-laws-what-businesses-should-know), [Privacy World, Aug 2026](https://www.privacyworld.blog/2026/08/adding-to-the-count-the-latest-in-state-consumer-privacy-laws/). Count of 24 confirmed by [MultiState, 2026-10-28](https://www.multistate.us/insider/2026/10/28/twenty-four-states-now-have-comprehensive-consumer-privacy-laws).

**Thresholds, cure-period dates and sensitive-data rules for the pre-2026 laws are `[M]` unless a note says otherwise.** They were cross-checked only against the tracker's effective-date and opt-out-signal columns.

Abbreviations: "100k / 25k+50%" = processes personal data of 100,000 consumers, or 25,000 consumers and derives more than 50% of gross revenue from selling personal data. UOOM = universal opt-out mechanism (GPC). PRA = private right of action. All laws below are attorney-general enforced with no PRA unless stated.

| State | Law | Effective | Applicability thresholds | UOOM / GPC required? | Sensitive data | Cure period | Notable quirks |
|---|---|---|---|---|---|---|---|
| California | CCPA as amended by CPRA | 2020-01-01; CPRA 2023-01-01 | For-profit doing business in CA and any of: gross revenue over $26.625M (CPI-adjusted 2025 `[M]`); buys/sells/shares PI of 100k+ consumers or households; 50%+ revenue from selling/sharing | Yes, in practice since 2021 (AG), in regulations since 2023 | Opt-out model ("Limit the Use of My Sensitive PI"); opt-in only for sale/share of under-16 data | None guaranteed (discretionary) | Only law covering employee and B2B data; dedicated agency (CPPA, now branded CalPrivacy); limited PRA for data breaches only; see §2 |
| Virginia | VCDPA | 2023-01-01 | 100k / 25k+50% | No | Opt-in | 30 days, permanent | Ban on selling precise geolocation from 2026-07-01 ([Privacy World](https://www.privacyworld.blog/2026/08/adding-to-the-count-the-latest-in-state-consumer-privacy-laws/)); separate 2025 reproductive-health consent law enforced through the Consumer Protection Act, which has a PRA `[M]` |
| Colorado | CPA | 2023-07-01 | 100k / 25k + any revenue or discount from sale | Yes, since 2024-07-01 `[M]` | Opt-in | Ended 2025-01-01 `[M]` | Has rulemaking; AG keeps a list of recognized UOOMs (GPC is the one listed `[M]`); nonprofits covered; minors' duty-of-care amendments 2025-10-01 `[M]`; precise geolocation added as sensitive, 2025 |
| Connecticut | CTDPA | 2023-07-01; major amendments 2026-07-01 | **From 2026-07-01:** 35,000 consumers, **or** any processing of sensitive data, **or** offering personal data for sale ([WilmerHale](https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20260731-connecticut-amends-its-data-privacy-act-to-increase-data-protections)) | Yes, since 2025-01-01 `[M]` | Opt-in; consumer-health-data provisions apply regardless of thresholds `[M]` | Mandatory cure ended 2024-12-31 `[M]`; now discretionary | No sale or targeted ads for under-18s; privacy notice must say whether data is used to train large language models; right to a list of third-party recipients; ban on selling precise geolocation from 2026-10-01; data broker registration by 2027-01-01 |
| Utah | UCPA | 2023-12-31 | Revenue of $25M+ **and** (100k / 25k+50%) | No | Notice + opt-out only | 30 days, permanent | Most business-friendly; correction right added 2026-07-01 |
| Texas | TDPSA | 2024-07-01 | **No revenue or volume threshold.** Applies to anyone doing business in TX who is not an SBA-defined small business | Yes, since 2025-01-01 | Opt-in; even exempt small businesses need consent to sell sensitive data `[M]` | 30 days, permanent | Mandatory notice wording if selling sensitive or biometric data (§6); active AG (sued Allstate/Arity under TDPSA, 2025) |
| Florida | FDBR | 2024-07-01 | $1B+ global revenue plus ad-revenue / smart-speaker / app-store prongs `[M]` | No | Opt-in; the ban on selling sensitive data without consent reaches beyond "controllers" `[M]` | 45 days, discretionary `[M]` | Not really comprehensive; almost no ordinary site is a "controller" |
| Oregon | OCPA | 2024-07-01 | 100k / 25k+25% | Yes, since 2026-01-01 | Opt-in | Ended 2026-01-01 `[M]` | Nonprofits covered (since 2025-07-01 `[M]`); right to a list of *specific* third parties; ban on selling precise geolocation and under-16 data, consent for under-16 targeted ads (2026-01-01); all car makers covered regardless of volume |
| Montana | MCDPA | 2024-10-01 | Since 2025-10-01: 25,000 consumers / 15,000+25% | Yes, since 2025-01-01 `[M]` | Opt-in | Removed `[M]` | Opt-out method must be clear and conspicuous *outside* the privacy notice; under-18 duty of care; most nonprofits now in scope |
| Iowa | ICDPA | 2025-01-01 | 100k / 25k+50% | No | Notice + opt-out only | 90 days, permanent | 90-day response window; narrow rights |
| Nebraska | NDPA | 2025-01-01 | Texas model: no threshold; SBA small-business exemption | Yes, since 2025-01-01 | Opt-in; small businesses need consent to sell sensitive data `[M]` | 30 days, permanent | |
| Delaware | DPDPA | 2025-01-01 | 35,000 / 10,000+20%. **From 2027-01-01: 10,000 / 5,000+20%** ([HB 380, signed 2026-09-02](https://www.troutmanprivacy.com/2026/09/delaware-significantly-amends-its-consumer-data-privacy-law-what-businesses-need-to-know/)) | Yes, since 2026-01-01 | Opt-in | Ended 2025-12-31 `[M]` | Nonprofits covered; from 2027 also binds third-party recipients, requires written contracts for third-party sharing, and a named list of recipients |
| New Hampshire | SB 255 | 2025-01-01 | 35,000 / 10,000+25% | Yes, since 2025-01-01 | Opt-in | Mandatory cure ended 2025-12-31 `[M]` | Ban on selling under-13 data from 2027-01-01 |
| New Jersey | NJDPA | 2025-01-15 | 100k / 25k + any revenue or discount from sale | Yes, since 2025-07-15 `[M]` | Opt-in; financial data counts as sensitive `[M]` | 30 days, ended 2026-07-15 `[M]` | June 2026 amendment bans sale of sensitive data and adds a data broker/collector registry; **implementing regulations lapsed unadopted on 2026-06-02** ([Freshfields](https://www.freshfields.com/en/our-thinking/blogs/a-fresh-take/new-jerseys-new-data-privacy-rules-what-organizations-need-to-know-102ncxe)) |
| Tennessee | TIPA | 2025-07-01 | Revenue over $25M **and** (175,000 / 25k+50%) | No | Opt-in | 60 days, permanent | Affirmative defense for following a NIST-style privacy framework `[M]` |
| Minnesota | MCDPA | 2025-07-31 | 100k / 25k+25%; SBA small businesses exempt but cannot sell sensitive data without consent | Yes, from effective date | Opt-in | 30 days, ended 2026-01-31 `[M]` | Right to question profiling outcomes; right to a list of specific third parties; documented data inventory; notice must describe retention `[M]` |
| Maryland | MODPA | 2025-10-01 | 35,000 / 10,000+20% | Yes, from effective date | **Stricter than opt-in:** collect/process only if strictly necessary for the requested product; **sale of sensitive data banned outright** | 60 days until 2027-04-01 `[M]` | Strictest general law. Data minimisation: collection limited to what is "reasonably necessary and proportionate" to the product the consumer asked for. No targeted ads or sale where the controller knew *or should have known* the consumer is under 18. From 2026-07-01 sensitive data includes inferences |
| Indiana | ICDPA | 2026-01-01 | 100k / 25k+50% | No | Opt-in | 30 days, permanent | Virginia clone |
| Kentucky | KCDPA | 2026-01-01 | 100k / 25k+50% | No | Opt-in | 30 days, permanent | Virginia clone |
| Rhode Island | RIDTPPA | 2026-01-01 | 35,000 / 10,000+20% | No | Opt-in | **None** | Any commercial website operator must name the third parties it sells or may sell personal data to, regardless of thresholds `[M]` |
| Oklahoma | SB 546, signed 2026-03-20 | **2027-01-01** | 100k / 25k+50% | No | Opt-in | 30 days, no sunset | "Sale" limited to monetary consideration; nonprofit exemption |
| Louisiana | LDPA, SB 386 / Act 502, signed 2026-05-29 | **2027-01-01** | CCPA-style: revenue over $25M, **or** buys/receives/sells/shares data of 75,000+ consumers, households or devices, **or** 50%+ revenue from sale. Does not reach entities that merely "target" Louisiana | `[UNCERTAIN]` see note A | Opt-in | 30 days, only until 2027-07-31 | Mandatory "NOTICE: We may sell your sensitive personal data" wording; no teen opt-in rights |
| Alabama | APDPA, HB 351, signed April 2026 | **2027-05-01** | More than 25,000 consumers, **or** more than 25% of revenue from sale. Under-500-employee businesses exempt if they do not sell data | `[UNCERTAIN]` see note A | Opt-in | 45 days, no sunset | Very narrow "sale" (excludes disclosures for analytics and marketing services to the controller); no assessments, no appeal right; consent for ages 13-15 targeted ads/sale |
| Vermont | VDPOSA, S.71 / Act 145 | **2028-01-01** | Preceding year: 35,000 consumers, **or** sensitive data of 3,000, **or** offered data of 3,000 for sale. Health-data provisions apply to anyone doing business in VT | Yes | Opt-in to process and to sell; health-data sale needs consent | 60 days, until 2029-06-30 | LLM-training disclosure; "reasonably necessary and proportionate" minimisation; geofence ban near health facilities; few nonprofit exemptions; linked to Vermont's Age-Appropriate Design Code (2027-01-01) |

**Note A (Louisiana and Alabama opt-out signals).** Sources disagree. Louisiana: the statute lets a consumer designate an authorized agent "including by" a browser or device global setting; [FPF](https://fpf.org/?p=249908) says the law never mentions opt-out preference signals, Mayer Brown and Bass Berry treat it as a GPC mandate, [McDonald Hopkins](https://www.mcdonaldhopkins.com/insights/news/the-new-louisiana-data-privacy-act) notes the split. Alabama: Benesch says no signal requirement; Privacy World says one exists; Mayer Brown says "referenced in law". Statute text was not read. Safe engineering default: honor GPC for every US visitor.

**Note B (the "small business below thresholds" trap).** Thresholds count *consumers whose data is processed*, and a unique visitor with an ad cookie or IP address counts. A site with 35,000 Connecticut visitors a year, or 10,000 Delaware visitors from 2027, is in scope. Texas and Nebraska have no count at all. Connecticut now also covers anyone processing sensitive data or offering data for sale, whatever the volume.

### 1.2 GPC / universal opt-out: where and since when

Mandatory today (12): California, Colorado (2024-07-01), Connecticut (2025-01-01), Texas (2025-01-01), Montana (2025-01-01), Nebraska (2025-01-01), New Hampshire (2025-01-01), New Jersey (2025-07-15), Minnesota (2025-07-31), Maryland (2025-10-01), Delaware (2026-01-01), Oregon (2026-01-01). Coming: Vermont (2028-01-01); Louisiana and Alabama uncertain (note A). Not required: Virginia, Utah, Iowa, Tennessee, Indiana, Kentucky, Rhode Island, Oklahoma, Florida.

- GPC is a browser signal: HTTP header `Sec-GPC: 1` and JS `navigator.globalPrivacyControl === true` ([spec](https://privacycg.github.io/gpc-spec/)).
- In September 2025 the California, Colorado and Connecticut regulators ran a joint sweep and sent letters to sites not honoring GPC ([state enforcement recap](https://www.mondaq.com/unitedstates/privacy-protection/1736548/privacy-law-recap-2025state-enforcement)).
- Under the Alabama and Vermont laws a GPC signal overrides a conflicting site-specific setting or loyalty-program choice, though the controller may ask the consumer to confirm ([Privacy World](https://www.privacyworld.blog/2026/08/adding-to-the-count-the-latest-in-state-consumer-privacy-laws/)).

### 1.3 Common framework (non-California states)

- **Opt-out rights:** targeted advertising, sale of personal data, profiling with legal or similarly significant effects.
- **"Sale"** in most states includes exchange for "other valuable consideration", which regulators read to cover ad-tech data flows. Monetary-only: Virginia, Utah, Iowa, Indiana, Kentucky, Tennessee `[M]`, Oklahoma. Alabama's is narrower still.
- **"Targeted advertising"** means ads based on activity across *non-affiliated* sites over time. First-party and contextual ads are outside it.
- **Sensitive data** (opt-in in most states): race/ethnicity, religion, health condition or diagnosis, sex life/orientation, citizenship/immigration status, genetic and biometric data, precise geolocation (commonly within 1,750 ft), known child's data. Newer laws add transgender/non-binary status, neural data, financial account data, government IDs.
- **Data protection assessments** are required for targeted advertising and for sale in nearly every state (not Utah, Iowa, Alabama). A site running ad pixels in scope needs one on file.
- **Processor contracts** are required with every vendor.
- **Opt-out responses:** 45 days in most states; California 15 business days.
- **Teens:** consent for targeted ads/sale to known minors under 16 (California, Minnesota, New Hampshire, Oregon), under 17 (New Jersey), under 18 (Colorado, Connecticut, Delaware, Montana); outright ban in Maryland and Connecticut ([Keller & Heckman](https://www.khlaw.com/insights/kids-and-teens-privacy-2025-look-back-and-2026-predictions-part-ii-state-privacy-patchwork)).

### 1.4 Non-California enforcement to know

- Connecticut: first CTDPA settlement, TicketNetwork, $85,000 (July 2025). Privacy notice "largely unreadable", rights mechanisms "misconfigured or inoperable".
- Texas: AG suit against Allstate/Arity under TDPSA over driving and location data collected via SDKs (2025; outcome not found).
- California AG + district attorneys v. General Motors: $12.75M (2026-05-08), the largest CCPA penalty so far, for selling driver data to LexisNexis/Verisk; first settlement resting on data minimisation and purpose limitation ([Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/california-ag-announces-record-12-75m-settlement-with-gm-over-ccpa-data-minimization-and-purpose-limitation-violations)).

---

## 2. California in depth

Agency naming: the California Privacy Protection Agency now brands itself **CalPrivacy**; site moved to [privacy.ca.gov](https://privacy.ca.gov) (cppa.ca.gov still resolves). The Attorney General enforces in parallel.

### 2.1 "Sale", "share", cross-context behavioural advertising

- **Sale** (Civ. Code §1798.140(ad)): disclosing personal information to a third party for monetary *or other valuable consideration*. Since Sephora (2022) the AG's position is that letting an analytics/ad vendor collect data via tags in exchange for services is a sale.
- **Share** (§1798.140(ah)): disclosing personal information to a third party for **cross-context behavioural advertising**, whether or not for consideration. Cross-context behavioural advertising = targeting based on activity across businesses, sites or apps other than the one the consumer is intentionally interacting with.
- A vendor can only be a "service provider" (not a third party) with a compliant contract, and **a service provider cannot do cross-context behavioural advertising** for the business (regs §7050 `[M]`). So Meta Pixel, Google Ads remarketing, TikTok, LinkedIn Insight, and audience-building tags are sale/share. Pure first-party analytics under restricted processing terms can stay inside the service-provider relationship.
- Practical test: if a tag lets a third party use the data for its own purposes or to target the user elsewhere, treat it as sale/share and gate it behind the opt-out.

### 2.2 Required links and the opt-out icon

Regulations at [cppa.ca.gov/regulations](https://cppa.ca.gov/regulations/); section numbers `[M]`.

| Requirement | Wording | Where |
|---|---|---|
| Opt-out of sale/sharing (§7013, §7026) | "Do Not Sell or Share My Personal Information" | Footer of every page; must lead straight to the opt-out mechanism |
| Limit sensitive PI (§7014, §7027) | "Limit the Use of My Sensitive Personal Information" | Only if sensitive PI is used beyond permitted purposes |
| Alternative single link (§7015) | "Your Privacy Choices" or "Your California Privacy Choices" **plus the blue opt-out toggle icon**, sized like other footer links | Replaces both links above |
| Notice at collection (§7012) | Link to the specific section of the privacy policy, at or before collection; for sites, a conspicuous link on the homepage and all pages where PI is collected | Footer / forms |
| Financial incentive notice (§7016) | "Notice of Financial Incentive" | Loyalty programs, discount-for-email popups |

- Links may be omitted only if the business processes opt-out preference signals in a **frictionless manner** (§7025(f)-(g)) and says so in the privacy policy. Conditions are narrow; most sites keep the link.
- **A cookie banner is not by itself a valid opt-out method** (§7026(a)(4) `[M]`): cookies concern how data is collected, not sale/sharing. The opt-out must also cover server-side and offline sale/share (email-list uploads, customer-match).
- Opt-out requests need **no identity verification** and no account. Process within 15 business days. Wait 12 months before asking an opted-out consumer to opt back in.
- **Symmetry of choice (§7004):** the path to say no cannot be longer than the path to say yes. "Accept All" beside "Preferences" fails; "Accept All" beside "Decline All" passes. See also [Enforcement Advisory 2024-02 on dark patterns](https://cppa.ca.gov/pdf/enfadvisory202402.pdf) `[M]`.

### 2.3 GPC obligations and the opt-out confirmation display

- A business that sells/shares must treat a GPC signal as a valid opt-out for that browser/device **and any consumer profile associated with it, including pseudonymous profiles**; if the consumer is known (logged in), the opt-out must apply to the account across devices (§7025).
- **New from 2026-01-01:** §7025(c)(6) changed from "may" to "must": the site has to show whether it processed the signal, for example the text "Opt-Out Request Honored" or a toggle shown as already switched. Consumers must also be able to confirm the status of any opt-out request ([Nelson Mullins](https://www.nelsonmullins.com/insights/alerts/fcc-download/all/show-me-that-you-ve-opted-me-out-new-ccpa-rules-require-businesses-to-prove-compliance), [Loeb](https://www.loeb.com/fr/insights/passle/2025/11/nai-optout-tool-sunset-and-cppa-gpc-receipt-confirmation)). Exact regulation text not read in this pass; the example wording is illustrative, not mandatory.
- Do not show a consent pop-up asking a GPC user to opt back in on every visit; that is a dark pattern under §7004.

### 2.4 Notice at collection and privacy policy

- Notice at collection must list: categories of PI collected (including sensitive), purposes, whether each category is sold or shared, retention period or criteria per category, and links to the opt-out and privacy policy. Third parties that control collection on the site (ad-tech) are also responsible for notice.
- Privacy policy (§7011): updated at least every 12 months, with a last-updated date; see §6 below for content.

### 2.5 CPPA regulations finalised in 2025

Approved by the Office of Administrative Law 2025-09-23; **effective 2026-01-01** ([Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/newly-approved-ccpa-regulations-have-staggered-deadlines-for-compliance), [MoFo](https://www.mofo.com/pdf/resources/insights/251007-ccpa-regulations-on-cybersecurity-risk-assessments)).

| Piece | Who | Dates |
|---|---|---|
| Revisions to existing rules (opt-out confirmation, symmetry, request handling) | All CCPA businesses | 2026-01-01 |
| **Risk assessments** | Any business that **sells or shares** PI, processes sensitive PI, uses automated decision-making for significant decisions, and certain other processing `[M]` | Required for new activities from 2026-01-01; activities begun before 2026 must be assessed by **2027-12-31**; attestation and summary to the agency by **2028-04-01** |
| **Automated decision-making technology (ADMT)** | Businesses using ADMT for "significant decisions" (finance, housing, education, employment, healthcare) | **2027-01-01** (pre-use notice, opt-out, access) |
| **Cybersecurity audits** | Businesses deriving 50%+ revenue from selling/sharing, or over the revenue threshold and processing 250k consumers' PI or 50k consumers' sensitive PI `[M]` | First certification: **2028-04-01** (revenue over $100M), **2029-04-01** ($50M-$100M), **2030-04-01** (under $50M) |

Website consequence: running ad pixels is "sharing", so an in-scope business needs a documented risk assessment covering that sharing.

### 2.6 Browser opt-out signal law (AB 566, "Opt Me Out Act")

- Signed 2025-10-08; **operative 2027-01-01**. Browsers must ship a built-in setting that sends an opt-out preference signal ([CPPA announcement](https://cppa.ca.gov/announcements/2025/20251008_2.html), [Hunton](https://www.hunton.com/privacy-and-information-security-law/california-enacts-first-in-nation-law-requiring-web-browser-opt-out-preference-signal)).
- It binds browser makers, not site owners, but expect the share of visitors sending a signal to jump in 2027.
- The CalPrivacy board voted in 2026 to start rulemaking on opt-out preference signals, including how they apply to pseudonymous profiles ([IAPP](https://iapp.org/news/a/calprivacy-board-advances-rulemaking-to-update-opt-out-preference-signals-requirements)). `[UNCERTAIN]` whether formal proposed text is out: one source describes draft text dated 2026-10-08 in November board materials, another says none had been published.

### 2.7 Delete Act and DROP

- Data brokers register annually with CalPrivacy. The Delete Request and Opt-out Platform (DROP) opened to consumers in January 2026; **since 2026-08-01 brokers must pull and process DROP requests at least every 45 days**, with fines of $200 per request per day ([privacy.ca.gov](https://privacy.ca.gov/drop-for-data-brokers/)). First independent audit due 2028-01-01.
- AB 883 (signed 2026-09-27) shortens the cycle to 30 days ([Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/californias-2026-legislative-session-wraps-a-wave-of-privacy-and-ai-bills-reaches-the-governor-with-key-child-safety-and-ai-measures-signed-into-law)); effective date not confirmed.
- Relevance to ordinary sites: low, unless the business sells data about people it has no direct relationship with. CalPrivacy has fined firms that sold "custom audiences" without registering.

### 2.8 2026 California legislation affecting websites

([Kelley Drye](https://www.kelleydrye.com/viewpoints/blogs/ad-law-access/californias-2026-legislative-session-wraps-a-wave-of-privacy-and-ai-bills-reaches-the-governor-with-key-child-safety-and-ai-measures-signed-into-law), [Holland & Knight, 2026-10-23](https://www.hklaw.com/en/insights/publications/2026/10/the-privacy-bills-that-are-becoming-law-in-california), [WilmerHale](https://www.wilmerhale.com/en/insights/blogs/wilmerhale-privacy-and-cybersecurity-law/20261002-california-finalizes-next-wave-of-state-ai-and-privacy-regulation))

- **SB 690** (signed 2026-09-30, effective 2027-01-01): see §3.2.
- **SB 923** (effective 2027-01-01): CCPA deletion right extends to all PI held "from or about" the consumer; **online-only businesses must offer a webform or portal for rights requests, not just an email address.**
- **AB 2246** (signed 2026-09-10, effective 2027-01-01): **repeals the Age-Appropriate Design Code Act and replaces it.** See §4.5.
- **AB 2561**: operating systems and apps may not silently revert a user's privacy-setting choices.
- **AB 1542 vetoed**: would have banned sale/sharing of sensitive PI outright. The opt-out framework stands.
- **SB 354** (2028-07-01): CCPA-like regime for insurers.

### 2.9 Enforcement actions and what was actually wrong

| Date | Regulator / target | Amount | What was found |
|---|---|---|---|
| 2022-08 | AG / **Sephora** | $1.2M | Tags gave ad/analytics vendors data in exchange for services = undisclosed "sale"; no "Do Not Sell" link; **ignored GPC** `[M]` ([AG](https://oag.ca.gov/news/press-releases/attorney-general-bonta-announces-settlement-sephora-part-ongoing-enforcement)) |
| 2024-02 | AG / **DoorDash** | $375k | Shared customer data with a marketing co-operative in exchange for ad reach = sale, with no notice or opt-out; also a CalOPPA violation `[M]` |
| 2025-03 | CPPA / **Honda** | $632,500 | Demanded excess personal data to process opt-out and limit requests; hard for authorized agents; **cookie tool let users accept all in one click but needed two steps to refuse**; could not produce contracts with ad-tech vendors `[M]` ([CPPA](https://cppa.ca.gov/announcements/2025/20250312.html)) |
| 2025-05 | CPPA / **Todd Snyder** | $345,178 | **Privacy portal / cookie banner misconfigured for 40 days so opt-outs were never processed**; required ID verification for opt-outs; agency said a business cannot blame its consent vendor ([CPPA](https://cppa.ca.gov/announcements/2025/20250506.html)) |
| 2025-07 | AG / **Healthline** | $1.55M | Trackers kept sending data to advertisers **after** users opted out; shared article titles implying a diagnosis (purpose limitation); ad-tech contracts lacked CCPA terms; **a consent banner that did not disable tracking cookies when users declined** was charged as deceptive `[M]` |
| 2025-09 | CPPA / **Tractor Supply** | $1.35M | "Do Not Sell" webform did nothing to third-party trackers on the site; **GPC not honored until July 2024**; deficient privacy policy and job-applicant notice; no vendor contracts ([privacy.ca.gov](https://privacy.ca.gov/2025/09/nations-largest-rural-lifestyle-retailer-to-pay-1-35m-over-ccpa-violations/), [order](https://cppa.ca.gov/pdf/20250930_tractor_supply_bd_sfo.pdf)) |
| 2025-10 | AG / **Sling TV** | $530k | Opt-out link led to cookie preferences that did not stop sale/sharing; logged-in users forced through a webform; no opt-out inside the TV app `[M]` |
| 2025-11 | AG / **Jam City** | $1.4M | No in-app opt-out in most games; sold/shared data of 13-15-year-olds without opt-in `[M]` |
| 2026-02 | AG / **Disney** | $2.75M | GPC and toggle opt-outs applied **only to the single device or service**, not the logged-in account; opt-out did not stop all sale/sharing ([AG](https://www.oag.ca.gov/news/press-releases/california-wont-let-it-go-attorney-general-bonta-announces-275-million)) |
| 2026-03 | CalPrivacy / **PlayOn Sports** (GoFan) | $1.1M | **Banner offered only "Agree", with no decline or dismiss**, and on mobile covered the area needed to redeem purchased tickets; did not honor opt-out preference signals; notice failures ([Holland & Knight](https://www.hklaw.com/en/insights/publications/2026/03/calprivacy-fines-playon-sports-1-1m-for-ccpa-opt-out-and-notice), [McDermott](https://www.mcdermottlaw.com/insights/calprivacy-targets-cookies-in-ccpa-enforcement-against-ticketing-service/)) |
| 2026-03 | CalPrivacy / **Ford** | $375,703 | Required an email-verification step before processing opt-outs ([privacy.ca.gov](https://privacy.ca.gov/2026/03/ford-to-change-practices-pay-fine-for-adding-unnecessary-friction-to-opt-out-process/)) |
| 2026-05 | AG + DAs / **General Motors** | $12.75M | Sold driver data to brokers; data minimisation and purpose limitation |
| 2026-08 | CalPrivacy / **LocateSmarter** | $116,490 | Data broker: late registration; demanded last four SSN digits to opt out ([privacy.ca.gov](https://privacy.ca.gov/2026/08/calprivacy-brings-first-action-against-a-data-broker-under-both-the-ccpa-and-delete-act/)) |
| 2026-10 | AG / **Lyft** | $1.8M | No in-app opt-out; multi-step path via the privacy policy; logged-in users made to re-enter credentials and extra data ([AG](https://oag.ca.gov/node/632063)) |

**Audit checklist derived from these cases**

1. After clicking the opt-out link or "Reject", do third-party ad requests actually stop? Test in the network panel, not the CMP dashboard.
2. With `Sec-GPC: 1`, do those same requests stop on first page load, before any interaction?
3. Is the refuse path as short as the accept path?
4. Does the banner have a real decline or close control, and does it block essential functions on mobile?
5. Does a webform opt-out also reach the cookies/pixels (or does the page tell the user how to do that)?
6. Does opt-out follow the logged-in user across devices?
7. Is any verification, login or extra data demanded for opt-out? It must not be.
8. Is there a contract with CCPA terms for every tag vendor?
9. Is "Opt-Out Request Honored" (or equivalent) displayed?
10. Does the privacy policy match the tags on the page?

---

## 3. Litigation risk from trackers

For a small site this is usually the larger exposure. A typical event is a demand letter with a draft complaint and screenshots of network requests, priced below the cost of a defense ([Spencer Fane, July 2026](https://www.spencerfane.com/insight/cipa-website-tracking-lawsuits-where-the-law-stands-where-its-going-and-what-your-business-should-do-now/)). One vendor estimate puts 2026 US web-tracking class settlements above $1.4B (vendor figure, treat cautiously).

### 3.1 California CIPA: the claims

| Section | Theory | Typical target | Status |
|---|---|---|---|
| Penal Code **§631(a)** wiretap | A third-party vendor "reads or attempts to read" the contents of a communication in transit; the site "aids" it | Chat widgets, session replay, Meta/TikTok pixels capturing search terms, form inputs, URLs with query content | **Alive.** Private right of action unchanged |
| **§632 / §632.7** recording confidential or cellular communications | Recording chat or call content without all-party consent | Chat, call tracking, AI note-takers | Alive. A magistrate judge in E.D. Cal. (2026-08-03) reasoned §632 reaches internet communications while §631 does not; minority view ([Troutman](https://www.troutmanprivacy.com/2026/09/privacy-litigation-report-takeaways-from-august-2026-decisions/)) |
| **§638.51** pen register / trap-and-trace | A tracker that captures IP address and device identifiers is a "pen register" used without a court order | Any third-party script, including analytics and ad-tech "identity" tags | **Private suits ending** (SB 690). See §3.2 |
| §637.2 | Remedy: **$5,000 per violation** or treble actual damages | | |

Key doctrine:

- **Party exception.** A party to the communication cannot wiretap itself, so the site owner is liable only for aiding a third party. The fight is whether the vendor is a third party. Courts split between the "extension" view (vendor is just the site's tool, as in *Graham v. Noom*) and the "capability" view (vendor is a third party if it *can* use the data for its own purposes, as in *Javier v. Assurance IQ* on remand, *Ambriz v. Google*) `[M]`. Vendors that reuse data for ads or model training lose under the capability view.
- **"Contents" and "in transit".** Mere browsing metadata is not contents: *Wiley v. Universal Music* (N.D. Cal. 2026-09-14) dismissed wiretap and pen-register claims on that basis ([Mayer Brown](https://www.mayerbrown.com/en/insights/publications/2026/10/california-district-court-draws-critical-line-between-browsing-data-and-contents-of-communications-under-cipa)). Session-replay data that is readable only after storage was held not intercepted in transit in *Torres v. Prudential* (N.D. Cal. 2025-04-17, summary judgment) ([Inside Class Actions roundup](https://www.insideclassactions.com/2026/01/27/2025-website-wiretapping-roundup/)). Search terms, form entries, chat text and health-related URLs are regularly held to be contents.
- **Standing.** *Popa v. Microsoft* (9th Cir. 2025-08-26, published): session replay of ordinary shopping behaviour is no concrete injury, like "a store clerk's observing shoppers". Used since to dismiss metadata-only claims (*Khamooshi v. Politico*) and to deny class certification (C.D. Cal., 2026). It does **not** help in state court, where Article III does not apply, and plaintiffs file there on purpose.
- **Ninth Circuit unpublished 2025 decisions** point both ways: *Mikulsky v. Bloomingdale's* revived a §631 session-replay claim; *Thomas v. Papa John's* applied the party exception; *Gutierrez v. Converse* affirmed for the defendant with a concurrence by Judge Bybee arguing §631 does not reach the internet at all `[M]`.
- **Consent must be prior and real.** N.D. Ill. (2026-08-07): a banner that only links to a privacy policy does not establish consent to third-party sharing. S.D. Cal. (2026-08-12): where a user clicked reject and trackers fired anyway, the reject itself made the communications "confidential" under §632. N.D. Cal. (2026-08-13): a privacy policy that did not mention sending health intake data to ad platforms gave no consent ([Troutman](https://www.troutmanprivacy.com/2026/09/privacy-litigation-report-takeaways-from-august-2026-decisions/)). Conversely *Lakes v. Ubisoft* (N.D. Cal. 2025-04-02): a working cookie banner plus account creation defeated VPPA, Wiretap Act and CIPA claims.
- Third Circuit, *Cole v. Quest Diagnostics* (2025-11-25): the pixel provider was a direct recipient, not an interceptor, under CIPA; ordinary browsing was not "medical information".

### 3.2 SB 690 (CIPA reform)

- **History.** The 2025 version would have exempted any "commercial business purpose" from §§631, 632, 632.7 and 638.51. It passed the Senate 35-0 in 2025 and stalled in the Assembly. A July 2026 amendment **dropped that exemption** and narrowed the bill to pen-register claims ([Parker Poe](https://www.parkerpoe.com/news/2026/07/amended-california-bill-would-narrow-litigants-website-tracking), [Kilpatrick](https://ktslaw.com/insights/alert/2026/10/%7B14052F7C-024C-46A8-A242-BD3A7C148108%7D?pdf=1)).
- **Enacted.** Passed unanimously in late August 2026; **signed 2026-09-30**; **effective 2027-01-01** ([Inside Privacy](https://www.insideprivacy.com/state-privacy/california-governor-signs-sb-690-eliminating-private-website-based-cipa-pen-register-claims-and-calling-for-broader-cipa-reform/), [Morgan Lewis](https://www.morganlewis.com/pubs/2026/10/california-eliminates-private-right-of-action-under-cipas-pen-register-and-trap-and-trace-provision)).
- **Effect.** Only the Attorney General may sue under §638.51 for conduct on a website, online application or mobile app. Applies to **any pending claim in an action commenced on or after 2025-01-01**. Implemented through the civil-remedy section (§637.2) per Jones Day; statute text not read.
- **Not changed:** §631, §632, §632.7, the federal Wiretap Act, CCPA, common-law privacy, and AG pen-register enforcement.
- The governor's signing message asked the Legislature to revisit other CIPA provisions "susceptible to abuse" in 2027.
- **Appellate picture.** *Variety Media v. Superior Court* (Cal. Ct. App., 2d Dist., B350578): tentative ruling 2026-08-21 that §638.51 is technology-neutral and can reach the internet, but an IP address identifies the *source*, not the destination, so the complaint failed with leave to amend ([NatLawReview](https://natlawreview.com/article/sb-690-passes-and-ca-court-appeal-issues-important-tenantive-ruling-are-cipa-pen)). `[UNCERTAIN]` whether a final opinion issued. *Reuters v. Superior Court* (6th Dist.) raises the same question.
- **What plaintiffs are doing now** ([ZwillGen](https://www.zwillgen.com/litigation/newsom-signs-sb-690-privacy-plaintiffs-shift-new-theories/)): amending §638.51 claims into §631; adding federal Wiretap Act and CDAFA (Penal Code §502) counts; **fraud and deception claims that a cookie banner or settings tool does not honor a rejection or drops cookies before consent, which "have largely survived motions to dismiss"**; and mass arbitration demands.

### 3.3 Federal Wiretap Act (ECPA)

- One-party consent, so the site's own consent normally defeats the claim, **unless** the interception was "for the purpose of committing any criminal or tortious act" (18 U.S.C. §2511(2)(d)). Plaintiffs argue that sending health or financial data to ad platforms in breach of HIPAA or privacy torts triggers that exception. Courts are split on whether a commercial motive defeats it; a First Circuit appeal on the point was argued 2026-04-06 and is pending ([Barnes & Thornburg, 2026-04-14](https://btlaw.com/en/insights/alerts/2026/cipa-ecpa-website-tracking-privacy-litigation-in-2026)).
- Practical meaning: ECPA exposure is concentrated on health, finance and other sensitive pages.

### 3.4 Other state wiretap and tracking statutes

Filing counts are from a March 2026 survey covering 2022-03 to 2026-03 ([DarrowEverett](https://www.jdsupra.com/legalnews/tracking-pixel-litigation-expands-a-2895998/)).

| State | Statute | Position |
|---|---|---|
| California | CIPA | About 3,100 cases. See above |
| Florida | FSCA, Fla. Stat. §934.03 | About 590 cases. Early session-replay suits were mostly dismissed `[M]`; healthcare pixel claims survive (*W.W. v. Orlando Health*, M.D. Fla. 2025-03-06) |
| Pennsylvania | WESCA, 18 Pa.C.S. §5703 | All-party consent; statutory damages. *Popa v. Harriet Carter Gifts* (3d Cir. 2022): no blanket direct-party exception, and interception happens where the browser is `[M]`. A federal court recently let Meta Pixel claims against a hospital proceed, holding the pixel is an intercepting device; another dismissed claims against Penn Highlands (March 2026) for failure to plead actual interception. Described as "where California was two years ago" |
| Massachusetts | G.L. c. 272 §99 | *Vita v. New England Baptist Hospital*, 494 Mass. 824 (2024): the wiretap act does **not** clearly reach ordinary web browsing; the court invited the legislature to act. Plaintiffs moved to federal Wiretap Act and consumer-protection theories. No amending statute found |
| Washington | Wash. Privacy Act, RCW 9.73 | A 2026 ruling held the wiretap prohibition does not reach typical browser-side pixel claims ([Baker Donelson](https://www.bakerdonelson.com/washington-narrows-pixel-tracking-claims-but-privacy-risks-remain)); case name not captured. MHMDA risk remains (§4.2) |
| Arizona | TUCSRA, A.R.S. §44-1376 (email "spy pixel" suits) | Arizona Court of Appeals (Nov 2025) affirmed dismissal: a marketing email sender is not a regulated entity and open-tracking data is not a "communication service record"; D. Ariz. agrees ([Womble](https://www.womblebonddickinson.com/us/insights/alerts/arizona-court-appeals-affirms-dismissal-arizona-spy-pixel-class-action)). Low risk |
| Illinois | Eavesdropping Act; BIPA; GIPA | About 95 wiretap cases, "gaining traction". BIPA in §4.8 |
| New Hampshire, Maryland, Nevada, New York | State wiretap acts | Scattered filings; an $800k New Hampshire hospital-tracking settlement is reported |

### 3.5 VPPA (Video Privacy Protection Act, 18 U.S.C. §2710)

- Bars a "video tape service provider" from knowingly disclosing a "consumer's" personally identifiable video-viewing information without consent given in a **form distinct and separate** from other terms. $2,500 statutory damages per person. Classic fact pattern: Meta Pixel on a page with embedded video sends the video title or URL together with the Facebook ID.
- **Split 1: who is a "consumer".** Second Circuit (*Salazar v. NBA*, 2024) and Seventh Circuit (*Gardner v. MeTV*, 2025): any subscriber to any of the provider's goods or services, including a free newsletter. Sixth Circuit (*Salazar v. Paramount*, 2025) and D.C. Circuit (*Pileggi*, 2025): only subscribers to audiovisual goods or services. **The Supreme Court granted certiorari in *Salazar v. Paramount Global*, No. 25-459, on 2026-01-26 and heard argument on 2026-10-14; no decision yet** ([docket](https://www.supremecourt.gov/search.aspx?filename=/docket/docketfiles/html/public/25-459.html), [EPIC](https://epic.org/scotus-to-resolve-circuit-split-on-vppa-consumer-definition-in-salazar-v-paramount-global/)). Expect a ruling by June 2027.
- **Split 2: what is "personally identifiable information".** Second (*Solomon v. Flipps Media*, 136 F.4th 41, 2025; cert. denied 2025-12-08), Third and Ninth Circuits: only what an *ordinary person* could use to identify the viewer; a Facebook ID inside pixel code is not that. The Second Circuit has kept affirming dismissals (*Hughes v. NFL*; *Golden v. NBCUniversal*, 2026-04-23). First Circuit (*Yershov*, 2016): broader "reasonably and foreseeably likely to reveal" test. District courts in the Ninth Circuit still apply the ordinary-person test unevenly. The Supreme Court case will not resolve this split.
- Practical: New York federal courts are now hostile to pixel VPPA suits; elsewhere the risk remains. Never send video titles or content IDs to ad platforms with a user identifier without separate consent.

### 3.6 Other theories commonly attached

- California: CDAFA (Penal Code §502), constitutional and common-law intrusion, UCL, CMIA (medical information), CCPA data-breach PRA stretched to pixel "disclosures" (one 2025 federal court allowed it to proceed).
- Banner misrepresentation claims in any state under unfair/deceptive practices statutes.
- "TrustedForm"/"Jornaya" lead-verification scripts that record form keystrokes are themselves a recurring §631 target (*Javier v. Assurance IQ*) `[M]`.

### 3.7 Practical mitigations

1. **Consent before firing.** Block third-party advertising pixels, session replay, and chat/transcript vendors until affirmative consent, at minimum for California visitors; many firms geo-target California, Pennsylvania, Florida, Massachusetts or apply it US-wide. A banner displayed after tags have already fired is disclosure, not consent.
2. **Say it in the banner itself.** State that third parties (advertising, analytics, session replay) will receive browsing and interaction data. A bare link to the privacy policy has been held insufficient.
3. **Make reject real.** Verify in the network panel that nothing fires after reject and that GPC is treated as reject. Re-test after every tag-manager change. Keep dated evidence (configuration exports, consent logs, screenshots).
4. **Exclude sensitive surfaces.** No session replay or ad pixels on health, finance, login, checkout, account, search-results or intake-form pages. Mask all inputs in replay tools. Strip search terms and content IDs from URLs sent to vendors.
5. **Chat widgets.** Show a notice before the first message that the conversation is recorded and shared with the named vendor; require a click to start. Prefer vendors contractually barred from using transcripts for their own purposes.
6. **Vendor contracts.** Vendor acts only on the site's instructions, no independent use (ads, product improvement, model training), deletion on termination. This supports both the CCPA service-provider position and the CIPA "extension" argument.
7. **Arbitration clause and class waiver** in terms that users actually assent to (a clickwrap at account creation or checkout; browsewrap footers rarely bind). Caveat: it converts class risk into mass-arbitration fee risk; add batching and informal-dispute-resolution steps.
8. **Video.** Remove the Meta Pixel from pages with video, or stop sending titles/URLs; or collect standalone VPPA consent.
9. **Demand-letter protocol.** Preserve tag configurations and logs before changing anything; assess on the merits (standing, contents, consent, SB 690 for pen-register-only claims filed since 2025) before paying.

---

## 4. Sector and topic laws

### 4.1 HIPAA and the OCR tracking-technology bulletin

- [OCR bulletin](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/hipaa-online-tracking/index.html) (Dec 2022, revised March 2024): tracking technologies on a covered entity's site that disclose protected health information to a vendor need a business associate agreement or a HIPAA authorization. A cookie banner is not a HIPAA authorization.
- ***American Hospital Association v. Becerra*** (N.D. Tex. 2024-06-20) vacated the bulletin's "proscribed combination": the claim that an IP address plus a visit to a public, unauthenticated page about a health condition is individually identifiable health information. HHS dropped its appeal ([Quarles](https://quarles.com/newsroom/publications/hhs-ocr-withdraws-tracking-technologies-appeal-in-aha-v-becerra)).
- **Still standing:** authenticated pages (patient portals), appointment scheduling, intake forms, and anything tying identity to care. `[UNCERTAIN]` whether OCR has reissued the bulletin; none found.
- Meta and Google do not sign BAAs for their ad/analytics products `[M]`, so those tags cannot lawfully receive PHI.
- Winning the HIPAA argument does not end the exposure: hospital pixel class actions proceed under the Wiretap Act crime-tort exception and state law (for example a class action against UCHealth filed 2026-08-05).

### 4.2 FTC health enforcement and the Health Breach Notification Rule

- Non-HIPAA health sites and apps (telehealth, period trackers, mental health, pharmacy discount) are policed under FTC Act §5 and the [Health Breach Notification Rule](https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule). The amended rule (effective 2024-07-29 `[M]`) treats **unauthorized disclosure to ad platforms as a "breach"** requiring notice to consumers and the FTC.
- Cases `[M]`: **GoodRx** (2023, $1.5M, first HBNR case; pixels sent medication data to Meta/Google contrary to promises), **BetterHelp** (2023, $7.8M; intake-questionnaire emails uploaded for ad targeting), **Premom** (2023), **Cerebral** (2024, about $7M; ban on using health data for ads), **Monument** (2024).
- **2026-07-29: FTC with California and Utah sued Hims & Hers** (N.D. Cal.), alleging health data shared with Meta, Snap and others via pixels, APIs and customer-list uploads despite privacy promises, plus billing and cancellation counts. Allegations only; Hims denies them ([McDermott](https://www.mcdermottlaw.com/insights/ftc-two-states-take-aim-at-hims-hers-subscription-and-health-data-practices/), [Baker Donelson](https://www.bakerdonelson.com/ftc-targets-hims-hers-over-health-data-sharing-the-tracking-tools-are-now-part-of-the-case)).
- Common thread: the violation is the gap between the privacy promise and the tag behaviour, and "we only share hashed emails" is not a defense.

### 4.3 Washington My Health My Data Act and Nevada

- **Washington MHMDA** (RCW 19.373; fully effective 2024-03-31, small businesses 2024-06-30) `[M]`. **No size threshold**; covers anyone doing business in or targeting Washington, and data of people whose data is merely *processed* there.
  - "Consumer health data" is very broad: anything that identifies past, present or future physical or mental health status, including inferences from non-health data (purchases, location near a clinic, searches).
  - **Separate opt-in consent** to collect and to share beyond what is necessary for the requested service; a signed **authorization** to sell.
  - A **"Consumer Health Data Privacy Policy"** with its own link on the homepage, distinct from the general privacy policy ([AG guidance](https://www.atg.wa.gov/protecting-washingtonians-personal-health-data-and-privacy)).
  - Geofence ban within 2,000 ft of health facilities.
  - **Private right of action** through the Consumer Protection Act (requires injury to business or property).
  - First suit: *Maxwell v. Amazon* (W.D. Wash., No. 2:25-cv-261), over ad SDKs collecting location data. No merits ruling found. No AG action found.
- **Nevada SB 370** (effective 2024-03-31) `[M]`: near copy, including a separate consumer health data privacy policy; **no private right of action**; geofence 1,750 ft.
- **Connecticut** folded consumer-health-data rules into the CTDPA; **Vermont** will from 2028. **New York's Health Information Privacy Act was vetoed 2025-12-19**; a revised bill (S.9269/A.10357) was introduced in 2026 ([MoFo](https://www.mofo.com/resources/insights/260316-nyhipa-returns-in-2026-revised-bill)).
- Trigger examples for an ordinary site: a supplement or fitness store running Meta Pixel with product-view events; a pharmacy locator; a symptom quiz.

### 4.4 COPPA (children under 13)

- Amended rule published 2025-04-22, effective 2025-06-23, **compliance deadline 2026-04-22 (now passed)** ([Federal Register](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule), [Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/coppa-rule-amendment-compliance-deadline-approaches)).
- Key changes: **separate verifiable parental consent before disclosing a child's data to third parties for targeted advertising** or other non-integral purposes; written data-retention policy and no indefinite retention; written information security program; expanded "personal information" (biometrics, government IDs); notices must identify third-party recipients; new consent methods (text-plus, knowledge-based, face match).
- Applies to sites **directed to children** (judged by content, visuals, audience evidence) or with **actual knowledge** of under-13 users. Persistent identifiers alone are personal information, so behavioural ads and most ad pixels on a child-directed site need parental consent; the "support for internal operations" exception covers contextual ads and basic analytics only.
- Enforcement is a stated FTC priority. Disney paid $10M (2025) for mislabeling child-directed YouTube videos so that targeted ads ran `[M]`.
- Pending federally: COPPA 2.0 passed the Senate in 2026; the KIDS Act (H.R. 7757) passed the House 2026-06-29; neither enacted ([Mayer Brown, Aug 2026](https://www.mayerbrown.com/en/insights/publications/2026/08/childrens-privacy-mid-year-update-key-legislative-developments-and-emerging-trends-for-businesses)).

### 4.5 State kids and teens laws

- **Age-appropriate design codes:** California (original 2022 act partly revived by the Ninth Circuit on 2026-03-12, then **repealed and replaced by AB 2246, effective 2027-01-01**: applies to services "likely to be accessed by children" under 18; estimate age or give everyone child-level protection, high-privacy defaults, no default profiling of children, no dark patterns; drops impact assessments; penalties reported up to $50,000 per affected minor for knowing violations) ([Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/california-enacts-new-law-governing-online-services-accessed-by-children)); Maryland (in force, under challenge `[M]`); Nebraska (2026-01-01); South Carolina (2026-02-05); Vermont (2027-01-01).
- **New York Child Data Protection Act** (effective 2025-06-20) `[M]`: for known under-18 users or child-directed services, processing must be strictly necessary or have informed consent; must honor device-level age and privacy signals.
- **Teen advertising rules inside comprehensive laws:** see §1.3. Maryland uses a "knew or should have known" standard, the hardest to satisfy with a general-audience site.
- **Social media, addictive feeds, app-store age verification** (California SB 976 and AB 1709, Texas, Utah, Louisiana, Alabama, Virginia SB 854, Ohio, Tennessee, and others): mostly about platforms and app stores; many are partly enjoined and the map changes monthly. Rarely relevant to an ordinary content or commerce site, but California's Digital Age Assurance Act (AB 1043, 2027) will make operating systems send age-bracket signals that apps must request.

### 4.6 GLBA (financial)

- Financial institutions (lenders, brokers, insurers, tax preparers, many fintechs) owe privacy notices and opt-outs for sharing nonpublic personal information with non-affiliated third parties, and must meet the Safeguards Rule `[M]`.
- **State-law exemption is narrowing.** Most states exempt GLBA entities entirely; California, Oregon and Minnesota exempt only GLBA *data* `[M]`; Connecticut narrowed its entity exemption on 2026-07-01 and Delaware does so on 2027-01-01. Website browsing data of non-customers is generally not GLBA data, so pixels on a bank's marketing pages fall under state law where the exemption is data-level.
- Pixels or session replay on loan applications and account pages are prime CIPA/ECPA targets (crime-tort theory via GLBA).

### 4.7 CAN-SPAM and TCPA as they touch website forms

- **CAN-SPAM** `[M]`: opt-out regime; no consent needed to email. Requires accurate headers and subject, a physical postal address, a working unsubscribe honored within 10 business days. An email-capture form needs no checkbox under federal law, though a pre-checked marketing box is poor practice and a discount-for-email popup is a CCPA "financial incentive".
- **TCPA** `[M]`: marketing texts and autodialed or prerecorded marketing calls need **prior express written consent**. On a form: clear disclosure next to the phone field naming the sender, stating that messages may be automated, that consent is not a condition of purchase, plus an unchecked checkbox or clear submit-button language; keep proof of the consent. $500 to $1,500 per message. The FCC's "one-to-one consent" rule for lead generators was vacated by the Eleventh Circuit in January 2025. `[UNCERTAIN]` current effective date of the FCC "revoke by any reasonable means across all message types" rule, which has been postponed more than once.
- State mini-TCPAs (Florida, Oklahoma, Washington, Maryland and others) add quiet hours and their own private rights of action `[M]`.

### 4.8 FTC Act §5, dark patterns, pixel sharing

- §5 (unfair or deceptive practices) is the federal backstop for every site: a privacy policy statement that is untrue ("we do not share your data", "we honor your choices") is deceptive. No fines for a first violation without a rule or order, but orders run 20 years and now routinely ban advertising uses of the data.
- Beyond health: location-data cases (Kochava, X-Mode, InMarket, Gravy), the GM/OnStar order finalized January 2026, and subscription-cancellation dark patterns under ROSCA (the amended Negative Option "click-to-cancel" rule was vacated by the Eighth Circuit in July 2025 `[M]`).
- Every state has a parallel "little FTC Act", and many have a private right of action. That is the hook for cookie-banner misrepresentation suits outside California.

### 4.9 Biometrics (brief)

- **Illinois BIPA**: written release before collecting face, voice or fingerprint identifiers; private right of action, $1,000 / $5,000; a 2024 amendment limits recovery to one per person per collection method `[M]`. Web triggers: virtual try-on, face-based age verification, voice authentication, selfie ID checks.
- Texas and Washington have AG-enforced biometric statutes; comprehensive laws treat biometric data as sensitive (opt-in). Colorado added employer and consumer biometric rules in 2025 `[M]`.

---

## 5. What a US-only site actually has to do, by tier

### 5.1 Is a cookie banner legally required?

| Situation | Banner / prior consent required by statute? |
|---|---|
| General-audience site, ordinary analytics and ad pixels, adult users | **No.** Opt-out model everywhere. Needs: privacy policy, opt-out link where state law applies, GPC handling |
| Processing sensitive data (state definitions) in opt-in states | Yes, opt-in consent for that processing |
| Consumer health data, Washington / Nevada / Connecticut | Yes, separate opt-in for collection and for sharing |
| Child-directed site or known under-13 users | Yes, verifiable parental consent (COPPA); a cookie banner does not satisfy it |
| Known teens, targeted ads or sale | Opt-in in about ten states; prohibited in Maryland and Connecticut |
| California sale/share of known under-16 data | Opt-in |
| HIPAA-covered pages | Authorization or BAA; a banner is not enough |
| Video pages sending viewing data with identity | VPPA standalone consent |
| Any site, to defend wiretap claims | Not statutory, but prior consent is the only reliable defense |

So a banner is legally *required* only in the sensitive, health and minors pockets. Most US sites that add one do so for **wiretap-litigation defense** (CIPA §631, ECPA, Pennsylvania, Florida), because consent obtained before any third-party tag fires defeats the claim. SB 690 removes the single most common California claim from 2027 but leaves §631 in place, so this reasoning still holds, especially for chat, session replay and content-bearing pixels.

**The cardinal rule:** an opt-out notice that is honest is safe; a consent banner that is not wired to the tags is a liability under the CCPA (Healthline, PlayOn), under UDAP and fraud theories, and under CIPA §632. Never ship a decorative banner.

### 5.2 Tier (a): small site below all state thresholds

Check first: Texas and Nebraska have no thresholds (only an SBA small-business carve-out), Connecticut covers any sensitive-data processing or sale, and Washington/Nevada health laws have no thresholds.

Must do:

1. **Privacy policy**, conspicuously linked, accurate about every tag on the site (CalOPPA, Delaware, Nevada: §6).
2. **Do Not Track disclosure** (CalOPPA).
3. Do what the policy says (FTC Act §5 and state UDAP).
4. CAN-SPAM basics; TCPA consent language if collecting phone numbers for texts.
5. No sale of sensitive data without consent (Texas, Nebraska, Minnesota small-business rules).

Should do (risk-based):

6. Inventory every third-party script. Remove what is unused.
7. Keep session replay, chat transcripts and ad pixels off sensitive pages; mask inputs.
8. Either gate third-party advertising/replay/chat tags behind consent for California (or all US) visitors, or accept and document the residual wiretap risk. A site with only privacy-friendly first-party analytics and no ad pixels can reasonably run with a notice and no banner.
9. Honor GPC anyway. It is cheap, it is the direction of travel, and it pre-empts the threshold question.
10. Clickwrap terms with arbitration where there is a natural assent point.

### 5.3 Tier (b): meets one or more state thresholds

Everything in (a), plus:

1. **Opt-out mechanism** for sale / sharing / targeted advertising, reachable from a footer link on every page ("Your Privacy Choices" plus the icon satisfies California and reads acceptably everywhere). It must actually stop the tags and any server-side sharing.
2. **GPC** honored as an opt-out on first load, for all US visitors (simplest) or at least the 12 mandatory states; applied to the account when the user is logged in; **confirmation displayed** (California).
3. **Symmetric choices** in any banner or preference centre; no pre-ticked boxes; no nagging after opt-out.
4. **Opt-in** before processing sensitive data (outside California) and for known teens where required; Maryland's strict-necessity rule and sale ban for sensitive data.
5. **Privacy notice** content per §6, with state-specific rights, appeal process (all states except California, Utah, Iowa, Alabama `[M]`), retention, third-party categories (or named third parties where Oregon, Minnesota, Rhode Island, Connecticut, Delaware require on request).
6. **Rights-request intake**: webform or portal plus one other method; California online-only businesses need a webform from 2027 (SB 923); no verification for opt-outs; 45-day response (15 business days for California opt-outs).
7. **Contracts** with every tag vendor (service provider / processor terms).
8. **Assessments**: data protection assessment for targeted advertising and sale (most states); California risk assessment for selling/sharing.
9. **Data minimisation** review (Maryland; California §1798.100(c); GM settlement).
10. Layer the wiretap mitigations from §3.7 on top. A common design: US visitors see a banner with equal "Accept" and "Reject" buttons, third-party ad/replay tags blocked until Accept, GPC treated as Reject, plus the footer link. Opt-out-only designs (tags fire by default, footer link and GPC stop them) satisfy the privacy statutes but leave the wiretap exposure open.

### 5.4 Tier (c): health-, kids- or finance-adjacent

Everything above that applies, plus:

- **Health (non-HIPAA):** default to **no third-party advertising or social pixels at all** on pages that reveal a condition, treatment, medication or intake answers. If used, opt-in consent specific to health data, a Washington/Nevada "Consumer Health Data Privacy Policy" link on the homepage, no customer-list uploads to ad platforms without authorization, HBNR breach analysis for any past pixel sharing. Check that privacy promises ("never shared", "HIPAA compliant") are literally true.
- **HIPAA covered entities and business associates:** only vendors under a BAA on authenticated or care-related pages; treat scheduling and symptom tools as PHI surfaces; public informational pages are lower risk after *AHA v. Becerra* but still draw wiretap suits.
- **Kids:** decide whether the site is child-directed, mixed-audience, or general with actual knowledge. If child-directed: no behavioural advertising or third-party pixels without verifiable parental consent, contextual ads only, written retention and security programs, neutral age screen for mixed audiences. For teens: no targeted ads or sale for known under-18s in the strict states; high-privacy defaults (design codes; California AB 2246 from 2027).
- **Finance:** GLBA privacy notice and Safeguards Rule; no pixels or replay on application and account pages; remember that state privacy laws increasingly apply to non-GLBA data such as marketing-site visitors.
- **Video publishers:** VPPA controls from §3.5.

---

## 6. Privacy policy content and required links

### 6.1 Statutory content lists

**CalOPPA** (Cal. Bus. & Prof. Code §§22575-22579) `[M]`: applies to any commercial site or online service collecting personally identifiable information from California residents, with no size threshold. The policy must:

- identify categories of PII collected and categories of third parties it is shared with;
- describe any process for reviewing and correcting PII;
- describe how users are notified of material changes;
- state the effective date;
- **disclose how the site responds to Do Not Track signals** or similar mechanisms, and whether third parties may collect PII across sites over time;
- be **conspicuously posted**: a homepage link containing the word "privacy", in type that stands out from surrounding text.
- 30 days to fix after notice of non-compliance; enforced via the Unfair Competition Law.

**Delaware DOPPA** (6 Del. C. §1205C) `[M]`: near copy of CalOPPA for Delaware residents, including the Do Not Track disclosure.

**Nevada** (NRS 603A.340, 603A.345) `[M]`: operators must post a notice (categories collected, third-party categories, review/change process, change notification, third-party tracking disclosure, effective date) and provide a **"designated request address"** (email, toll-free number or web form) for requests not to sell covered information; respond within 60 days. Narrow definition of sale (monetary, for onward licensing or resale).

**CCPA privacy policy** (regs §7011) `[M]`: in addition to the above,

- categories of PI collected in the preceding 12 months, sources, business or commercial purposes;
- categories **sold or shared** and to which categories of third parties; categories disclosed for a business purpose;
- a statement on sale/sharing of PI of consumers under 16;
- use of sensitive PI beyond permitted purposes;
- retention period or criteria for each category;
- description of the rights (know, delete, correct, opt out of sale/sharing, limit sensitive PI, non-discrimination) and how to exercise them, including authorized agents;
- **how opt-out preference signals are processed** (and whether "frictionless");
- contact method; date last updated (at least every 12 months);
- metrics reporting for businesses handling PI of 10 million+ consumers;
- "Shine the Light" (Civ. Code §1798.83) disclosure or opt-out where data is shared for third parties' direct marketing.

**Other comprehensive-law states** (common core): categories of personal data processed; purposes; categories shared with third parties and categories of those third parties; whether data is sold or used for targeted advertising and how to opt out; how to exercise rights **and how to appeal a refusal**; a contact method. State add-ons:

| State | Extra notice content |
|---|---|
| Texas (and Louisiana from 2027) | If selling sensitive data: **"NOTICE: We may sell your sensitive personal data."** If selling biometric data: **"NOTICE: We may sell your biometric personal data."** Posted in the same place and manner as the privacy notice |
| Connecticut (2026-07-01), Vermont (2028) | Whether personal data is collected, used or sold to **train large language models**; date last updated |
| Minnesota | Retention description; date last updated; the notice must be reachable via a link using the word "privacy" `[M]` |
| Montana | Opt-out method clear and conspicuous **outside** the privacy notice |
| Rhode Island | Identify **all third parties** to whom data is or may be sold, applies to any commercial site |
| Oregon, Minnesota, Connecticut, Delaware (2027), Vermont | Consumer right to a list of specific third parties (operational, not a notice term) |
| New Jersey | Notify consumers of material changes and give a chance to withdraw consent `[M]` |
| Washington, Nevada | Separate **Consumer Health Data Privacy Policy** |
| Colorado | Purposes must be tied to each data category; loyalty-program disclosures `[M]` |

### 6.2 Required links and wording

| Link text | Required by | Notes |
|---|---|---|
| "Privacy Policy" (must contain "privacy") | CalOPPA, Delaware, Minnesota | Homepage and footer, conspicuous |
| "Do Not Sell or Share My Personal Information" | CCPA | Exact wording, or use the alternative below |
| "Limit the Use of My Sensitive Personal Information" | CCPA | Only if applicable |
| "Your Privacy Choices" / "Your California Privacy Choices" + opt-out icon | CCPA alternative link | The icon is mandatory with this wording. Widely used as the single US-wide link |
| "Notice at Collection" (or a link to that policy section) | CCPA | On pages and forms where PI is collected |
| "Notice of Financial Incentive" | CCPA | Loyalty and discount-for-data programs |
| "Consumer Health Data Privacy Policy" | Washington MHMDA, Nevada SB 370 | Separate, distinct homepage link; do not bury it inside the general policy |
| "NOTICE: We may sell your sensitive personal data." | Texas, Louisiana (2027); Florida has a similar notice `[M]` | Verbatim |
| Clear and conspicuous opt-out link (no prescribed words) | Colorado, Connecticut, Montana, Oregon, Delaware, New Jersey, Maryland, Minnesota and others | "Your Privacy Choices" is commonly accepted; Colorado requires the link or method be available at or before processing `[M]` |
| "Opt-Out Request Honored" (or toggle state) | CCPA regs since 2026-01-01 | A displayed status, not a link |
| "Your California Privacy Rights" | Shine the Light `[M]` | Only if sharing for third-party direct marketing |

Drafting cautions drawn from enforcement: never write "we do not sell your data" on a site with ad pixels; describe sharing with ad platforms in plain terms; list session replay and chat vendors by category; make sure the policy's description of what "Reject" and GPC do is literally true.

---

## 7. Federal privacy bill status

There is still no federal comprehensive privacy law. The bipartisan American Privacy Rights Act (APRA) of 2024 died without a markup when the 118th Congress ended. In the 119th Congress, House Energy and Commerce Republicans' privacy working group produced the **SECURE Data Act, H.R. 8413**, introduced by Rep. John Joyce on 2026-04-22 alongside a GLBA-modernisation companion (the GUARD Financial Data Act). It follows the Virginia/Kentucky state model: access, deletion, correction and opt-out rights, opt-in for sensitive data, FTC and state AG enforcement, **no private right of action**, and **broad preemption** of state privacy laws (commentators read it as reaching the CCPA, Illinois BIPA and Washington's MHMDA). It was drafted without committee Democrats, who oppose the preemption; EFF and EPIC call it weaker than most state laws; industry groups urged a markup. The Commerce, Manufacturing and Trade Subcommittee held a legislative hearing on 2026-06-03. No markup or floor action could be found as of 2026-11-11, and the bill's prospects in the post-election lame-duck session are unknown. Sources: [IAPP analysis](https://iapp.org/news/a/secure-data-act-analysis-of-the-new-federal-privacy-bill), [Hunton](https://www.hunton.com/privacy-and-cybersecurity-law-blog/house-republicans-introduce-comprehensive-federal-privacy-bill-secure-data-act), [Tech Policy Press hearing summary](https://techpolicy.press/house-subcommittee-on-commerce-manufacturing-and-trade-hosts-hearing-on-secure-data-act), [Brookings](https://www.brookings.edu/articles/springtime-in-washington-means-its-time-for-another-round-of-federal-privacy-legislation/). Plan on the state patchwork continuing through at least 2027.

---

## 8. Things in flux (re-check before relying)

| Item | State on 2026-11-11 | Next event |
|---|---|---|
| *Salazar v. Paramount* (VPPA "consumer") | Argued 2026-10-14 | Decision by June 2027 |
| SB 690 | Signed; effective 2027-01-01 | Constitutional challenges to its reach over pending cases are possible; governor asked for broader CIPA reform in 2027 |
| *Variety Media* / *Reuters* (Cal. Ct. App.) | Tentative ruling only | Final opinion; largely academic for private suits after SB 690, still relevant to AG enforcement and to how courts read "contents" |
| First Circuit ECPA crime-tort appeal | Argued 2026-04-06 | Opinion |
| CalPrivacy opt-out-signal rulemaking (AB 566) | Board authorized; proposed text status unclear | Formal comment period; browser duty 2027-01-01 |
| Louisiana and Alabama GPC obligations | Sources conflict | Read enacted text; AG guidance (Louisiana AG must publish guidance) |
| Oklahoma, Louisiana | Effective 2027-01-01 | |
| Delaware lower thresholds; California SB 923 and AB 2246 | Effective 2027-01-01 | AB 2246 may be challenged like its predecessor |
| Alabama | Effective 2027-05-01 | |
| New Jersey regulations | Proposal lapsed 2026-06-02 | Re-proposal |
| California ADMT rules | Compliance 2027-01-01 | |
| California risk-assessment backlog | Due 2027-12-31; attestations 2028-04-01 | |
| FTC v. Hims & Hers | Filed 2026-07-29 | Motion practice |
| New York health privacy bill | Revised bill pending | 2027 session |
| SECURE Data Act | Hearing held, no markup found | Lame-duck session / 120th Congress |
| State kids' and social-media laws | Many partly enjoined | Ongoing NetChoice litigation |
| TCPA revocation rule | Effective date repeatedly postponed | Check FCC |

## 9. Could not verify in this pass

- Statute and regulation text was not read directly for: SB 690, the four 2026 state laws, CCPA regs §7025/§7026, SB 923, AB 883, AB 2246. Descriptions rely on law-firm alerts, which agreed with each other except where flagged.
- Pre-2026 state thresholds, cure-period sunset dates and section numbers marked `[M]`.
- Details of the Honda, Healthline, Sephora, DoorDash, Sling TV and Jam City findings are from memory of the orders and press releases, not re-read.
- The three unpublished 2025 Ninth Circuit CIPA dispositions (*Mikulsky*, *Thomas*, *Gutierrez*) and the "extension vs capability" case names.
- The Washington 2026 wiretap ruling's case name and court; the *Popa v. Harriet Carter* outcome on remand.
- Whether any state AG has brought an MHMDA action; whether OCR reissued its tracking bulletin.
- Exact filing date of *Maxwell v. Amazon* (sources say February 2025; one alert says February 2026).
- Vermont's effective date appears as 2028-01-01 in three sources and 2027-01-01 in one; 2028 used.
- One summary of the four new state laws gave different thresholds from the two sources used here; the figures above follow Benesch (read in full) and Morgan Lewis, which agree.
