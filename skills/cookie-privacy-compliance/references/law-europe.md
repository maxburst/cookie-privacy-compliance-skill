# Europe: cookie / tracking / privacy compliance reference (EU/EEA, UK, Switzerland)

**Last verified: 2026-11-11.** Practitioner reference for auditing websites and implementing fixes. Not legal advice.

**Confidence tags used throughout**

- `[P]` checked this session against a primary source (regulator, legislation, court, EDPB).
- `[S]` checked this session, but only against secondary sources (law firms, trade press, vendor blogs).
- `[M]` from prior knowledge, not re-verified this session. Stable, long-standing points are mostly `[M]`.
- `[?]` uncertain, conflicting, or could not be verified. Do not rely on it without checking.

---

## Contents

- 0. Quick operating rules (apply everywhere unless a section says otherwise)
- 1. EU baseline: ePrivacy Art. 5(3) + GDPR consent
- 2. EU reform status
- 3. Country-specific rules (EU/EEA)
- 4. United Kingdom
- 5. Switzerland
- 6. Cross-cutting issues
- 7. Policy content and consent records
- 8. Notable enforcement 2023 to 2026 (what actually gets punished)
- 9. Things in flux (re-check before relying)
- 10. Items not verified this session

---

## 0. Quick operating rules (apply everywhere unless a section says otherwise)

1. **Two separate legal tests.** (a) *Device access*: storing or reading anything on the user's device (ePrivacy Art. 5(3) / national law / PECR reg. 6) needs consent unless exempt. It applies whether or not the data is personal. (b) *Subsequent processing* of personal data needs a GDPR Art. 6 basis, transparency, and a transfer mechanism if data leaves the EEA/UK/CH.
2. **Nothing non-exempt fires before opt-in.** That includes tags loaded via a tag manager, pixels, SDKs, fingerprinting scripts, embedded third-party content that sets or reads identifiers, and server-side forwarding of identifiers collected client-side.
3. **Reject must be as easy as accept**: same layer, same click count, comparable prominence. This is hard law in FR, ES, IT (X or equivalent), NL, BE, AT, DK, UK practice, and the majority EDPB position. Build it everywhere.
4. **No pre-ticked boxes, no "legitimate interest" toggles for device access, no consent by scrolling/continuing, no consent in T&Cs.**
5. **Withdrawal as easy as giving**: persistent, visible "Cookie settings" link or icon on every page; withdrawal must actually stop tags and (UK: also) trigger deletion of data gathered under that consent.
6. **Do not re-prompt after refusal for about 6 months** (FR, IT, IE, UK guidance; Council's Omnibus text would make 4 months statutory, Commission's 6).
7. **Keep proof**: timestamped, versioned consent logs able to show what the user saw and chose.
8. **Analytics is not "strictly necessary"** by default. It is consent-free only where a national exemption applies and its conditions are met (FR, ES, IT, NL, UK since 5 Feb 2026; CH opt-out). Standard Google Analytics 4 does not fit the EU exemptions.
9. **Self-host fonts and static assets**; gate YouTube/Maps/social embeds behind click-to-load.
10. **Current law is unchanged by the Digital Omnibus.** It is still a proposal (Section 2).

---

## 1. EU baseline: ePrivacy Art. 5(3) + GDPR consent

### 1.1 The rule

- **Directive 2002/58/EC Art. 5(3)** (as amended by 2009/136/EC): storing information, or gaining access to information already stored, in the terminal equipment of a subscriber or user requires prior consent after clear and comprehensive information, **unless** (a) the sole purpose is carrying out the transmission of a communication, or (b) it is strictly necessary to provide an information society service explicitly requested by the user. `[M]` Text: https://eur-lex.europa.eu/eli/dir/2002/58/oj
- It is a **directive**, so each state transposes it (FR Art. 82 LIL; DE § 25 TDDDG; IT Art. 122 Codice privacy; ES Art. 22.2 LSSI; NL Art. 11.7a Tw; AT § 165(3) TKG 2021; IE reg. 5 SI 336/2011; etc.). The competent authority is not always the DPA, and the one-stop-shop does **not** apply to Art. 5(3) itself, which is why CNIL fines Google/Shein/Meta directly.
- **Consent standard = GDPR** (Art. 4(11), Art. 7; ePrivacy Art. 2(f) cross-reference): freely given, specific, informed, unambiguous, by clear affirmative act; demonstrable (Art. 7(1)); withdrawable as easily as given (Art. 7(3)). EDPB "Consent under GDPR: guidelines at a glance" (May 2026) restates the four cumulative elements and that silence, pre-ticked boxes and inactivity are not consent. `[P]` https://www.edpb.europa.eu/system/files/2026-04/edpb-summary-consent_en.pdf
- **EDPB Guidelines 05/2020 on consent**: scrolling or swiping is not consent; cookie walls (access conditional on consent, no alternative) do not yield freely given consent. `[M]` https://www.edpb.europa.eu/our-work-tools/our-documents/guidelines/guidelines-052020-consent-under-regulation-2016679_en

### 1.2 Key CJEU case law `[M]`

| Case | Holding relevant to audits |
|---|---|
| **Planet49**, C-673/17 (1 Oct 2019) | Pre-ticked checkbox is not consent. Art. 5(3) applies whether or not the data is personal. Information must include cookie **duration** and whether **third parties** have access. |
| **Fashion ID**, C-40/17 (29 Jul 2019) | Site embedding a third-party social plugin is joint controller for collection and transmission; site operator must obtain consent and inform. |
| **Orange Romania**, C-61/19 (11 Nov 2020) | Controller bears burden of proving valid, active consent. |
| **Meta v Bundeskartellamt**, C-252/21 (4 Jul 2023) | Personalised ads cannot rest on contract or (generally) legitimate interest; users refusing must be offered an equivalent alternative "if necessary for an appropriate fee" (the hook for consent-or-pay). |
| **IAB Europe**, C-604/22 (7 Mar 2024) | TCF consent string (TC String) is personal data; IAB Europe can be joint controller for it. |
| **Schrems v Meta**, C-446/21 (4 Oct 2024) | Data minimisation limits aggregation/retention of data for ad targeting even with consent. |
| **KNLTB**, C-621/22 (4 Oct 2024) | A purely commercial interest can be a legitimate interest (subject to necessity and balancing). Does not displace Art. 5(3) consent. |
| **EDPS v SRB**, C-413/23 P (4 Sep 2025) | Pseudonymised data is not always personal data for a recipient who cannot re-identify; relative approach. Relevant to "anonymous analytics" claims, but Art. 5(3) still bites regardless. |

### 1.3 What is exempt ("strictly necessary") vs not

Sources: WP29 Opinion 04/2012 on cookie consent exemption `[M]`; ICO 2026 guidance `[P]`; CNIL guidelines `[M]`.

| Usually exempt (no consent; still disclose) | Not exempt (consent) |
|---|---|
| Session / basket / checkout state | Advertising, retargeting, conversion pixels, ad frequency capping (see Omnibus/UK reform for possible future change) |
| Authentication for the session | Cross-site or cross-device tracking, fingerprinting for ads |
| Security, fraud prevention, bot protection limited to that purpose | Social media plugins/trackers for non-logged-in users |
| Load balancing (transmission exemption) | Analytics, unless a national exemption applies and is met |
| The consent-choice cookie itself | A/B testing tied to marketing, session replay (CNIL Oct 2026: consent), heatmaps |
| User-chosen UI preferences (language, theme) for the session; persistent ones are exempt in most guidance if only for that purpose | Personalised content/recommendations (CNIL Fnac decision, Oct 2026) |
| Media player state for content the user asked to play | Embedded video/maps that set identifiers on page load |

"Strictly necessary" is judged from the **user's** perspective, not the operator's business model; ad revenue never qualifies (ICO). `[P]` A technology exempt for one purpose loses the exemption if reused for another.

### 1.4 EDPB Guidelines 2/2023 on the technical scope of Art. 5(3)

Version 2.0 adopted 7 Oct 2024 (final). `[P]` https://www.edpb.europa.eu/system/files/2024-10/edpb_guidelines_202302_technical_scope_art_53_eprivacydirective_v2_en_0.pdf

Four criteria: "information" (any, not only personal data), "terminal equipment", "electronic communications network", and "gaining access" or "storage". "Gaining access" occurs whenever the accessing entity **instructs** the device to send information (e.g. by distributing JavaScript or a tracked URL), even if another party issued the instruction.

| Use case (paras) | EDPB position |
|---|---|
| **Tracking pixels and tracked URLs** (47-51), incl. email open pixels and affiliate/click IDs | In scope. Delivery to the device is "storage" (at least via caching); the appended identifier being sent back is "gaining access". |
| **Local processing** (52-53), e.g. on-device computation exposed via browser API | In scope once the locally produced result is sent to a server or made available to a third party. |
| **IP-only tracking** (54-56) | In scope where the IP originates from the terminal equipment (static IPv4 from the router, IPv6). Out only if the entity can ensure it does not (e.g. CGNAT). Applicability does not automatically mean consent: check exemptions. |
| **IoT reporting** (57-60) | In scope, whether streamed or cached then sent, directly or via a relay device. |
| **Unique identifiers** (61-63), e.g. hashed email collected from a login/newsletter form by client-side code | In scope: the code instructs the browser to send it. |

Practical consequences:

- **"Cookieless" does not mean consent-free.** Fingerprinting, ETag/HSTS abuse, localStorage, link decoration, hashed-email ID solutions, and pixel-based measurement are all in scope.
- **Server-side tagging**: if the data forwarded server-side was obtained by reading the device (cookies, client IDs, JS-collected signals), the client-side collection step is in scope. Pure server logs of information the browser sends as part of the ordinary HTTP request are the debated edge; the EDPB reading is expansive. `[M]` Treat server-side GTM / Conversions API as needing the same consent state as the client-side equivalent.
- The Guidelines deliberately do not analyse the exemptions.

### 1.5 EDPB Cookie Banner Taskforce report (adopted 17 Jan 2023)

https://www.edpb.europa.eu/our-work-tools/our-documents/other/report-work-undertaken-cookie-banner-taskforce_en `[M]` Minimum common denominator among DPAs on noyb's banner complaints; not binding but widely followed.

| Practice | Taskforce view |
|---|---|
| No reject option on first layer | "Vast majority" of authorities: infringement. A few disagreed because Art. 5(3) does not literally require it. |
| Pre-ticked boxes on second layer | Invalid consent. |
| Reject presented as an inline link / link outside the banner | Not valid if it is not clear that it is a way to refuse. |
| Deceptive button colours/contrast | No general standard; case by case. Unlawful where the alternative is effectively unreadable or the design clearly steers. |
| "Legitimate interest" claimed on a hidden second layer for the same purposes | No legal basis for Art. 5(3) operations; subsequent processing relying on LI after an invalid device access is also non-compliant. |
| Mislabelled "essential" cookies | Infringement; controllers must be able to justify classification. |
| No withdrawal mechanism | Need an easily accessible, permanent option (floating icon or footer link acceptable); no single mandated design. |

Also relevant: **EDPB Guidelines 03/2022 on deceptive design patterns** (final Feb 2023) `[M]`; **DSA Art. 25** dark-pattern ban for online platforms (residual to GDPR/UCPD), **DSA Art. 26(3)/28(2)** bans on ad profiling using special categories and on profiled ads to minors. `[M]`

### 1.6 Consent-or-pay ("pay or okay")

- **EDPB Opinion 08/2024** (17 Apr 2024): for **large online platforms**, a binary choice between consenting to behavioural advertising and paying a fee will "in most cases" not yield valid consent. Platforms should offer a third, free alternative without behavioural advertising (e.g. contextual). Considers power imbalance, detriment, fee level, granularity. `[S]` https://www.edpb.europa.eu/news/news/2024/edpb-consent-or-pay-models-should-offer-real-choice_en
- **Broader EDPB guidelines on consent-or-pay** (all controllers): still only "planned" in the EDPB Work Programme 2026-2027 (adopted 11 Feb 2026); not marked as already adopted for consultation. `[P]` https://www.edpb.europa.eu/system/files/2026-02/edpb_work-programme_2026-2027_en.pdf Whether a consultation draft appeared later in 2026: `[?]` not found.
- **DMA track**: Commission found Meta's pay-or-consent model in breach of DMA Art. 5(2) and fined it EUR 200M (23 Apr 2025); Meta appealed. Meta rolled out a revised "less personalised ads" choice in Jan 2026; Commission is monitoring; no formal compliance decision found. `[S]`
- **National positions** (smaller publishers):
  - FR: allowed case by case if a fair alternative exists and price is reasonable (CNIL criteria, May 2022). `[M]`
  - DE: DSK resolution 22 Mar 2023 on "Pur-Abo" models: permissible if the paid option is an equivalent, tracking-free alternative at a market-standard price and consent stays granular. `[M]`
  - AT: DSB (2023) and BVwG (Aug 2025) held derStandard's banner unlawful for lack of **granular** consent; the model itself was not banned. Further appeal status `[?]`. `[S]` https://noyb.eu/en/court-decides-pay-or-okay-derstandardat-illegal
  - ES: AEPD guide allows denying access if an alternative, "not necessarily free", is offered. `[S]`
  - DK: allowed under four criteria (reasonable alternative, reasonable price, limited to what is necessary, equivalent service); statistics may not be bundled into the "free" option as necessary (Datatilsynet, Feb 2023 and Mar 2024). `[S]`
  - IT: Garante opened a public consultation on pay-or-ok (Gazzetta Ufficiale 12 May 2025); outcome `[?]` not found.
  - NL: AP treats cookie walls as not permitted; pay-or-okay unsettled. `[S]/[?]`
  - UK: see Section 4.5. CH: see Section 5.
- **Audit rule**: if a site uses consent-or-pay, check (1) granular choice inside the "consent" branch, (2) paid tier truly free of tracking, (3) price plausibility, (4) no essential/public-service content behind it, (5) documented assessment.

---

## 2. EU reform status

### 2.1 ePrivacy Regulation: dead

Commission announced withdrawal in its 2025 Work Programme (11 Feb 2025, "no foreseeable agreement"). Formal withdrawal reportedly approved 16 Jul 2025 and published in the OJ on 6 Oct 2025 (C/2025/5423). `[S]` (OJ reference from a single secondary source.) The 2002 Directive and national transpositions remain the law.

### 2.2 Digital Omnibus (COM(2025) 837, procedure 2025/0360(COD)): proposal only

**Status on 2026-11-11: not adopted. Nothing in it is law.**

| Stage | Date / status |
|---|---|
| Commission proposal | 19 Nov 2025 `[S]` |
| EP referral (joint ITRE-LIBE) | Jan 2026; rapporteurs reported as Aura Salla (ITRE) and Marina Kaljurand (LIBE) `[S]` |
| EP draft report / amendments | Draft report 22 Jun 2026; amendments tabled 27 Jul 2026 (reported 1,000 to 1,840) `[S]` |
| EP committee vote | Not held; expected early 2027 `[S]` |
| Council negotiating mandate | Agreed in Coreper 21 Oct 2026 (doc. ST 14756/26) under the Irish Presidency `[S]` https://data.consilium.europa.eu/doc/document/ST-14756-2026-INIT/en/pdf |
| Trilogues | Cannot start until EP adopts its position |
| Earliest realistic adoption | 2027; practical effect on websites 2028+ `[S]` |

Council press release (returned HTTP 403 to automated fetch, so not read directly): https://www.consilium.europa.eu/en/press/press-releases/2026/10/21/digital-rulebook-council-agrees-position-to-simplify-data-protection-privacy-and-cyber-reporting-rules/

**What the Commission proposed** `[S]` (Osborne Clarke analysis: https://osborneclarke.com/insights/digital-omnibus-reshapes-eu-cookie-rules-leaves-banner-fatigue-largely-intact)

- Move device-access rules for **personal data** into a new **GDPR Art. 88a** (GDPR fines and DPAs apply); ePrivacy Art. 5(3) would remain only for non-personal data.
- Closed list of consent-free purposes: (a) transmission; (b) service explicitly requested; (c) **aggregated audience measurement by the controller for its own online service, own use**; (d) maintaining/restoring security.
- **Single-click refusal** "or equivalent means"; no re-asking while consent is valid; **no re-asking for 6 months after refusal** for the same purpose.
- **Art. 88b**: sites must accept automated, machine-readable consent/refusal signals; non-SME browser vendors must provide the means; **media service providers exempt**. Phased application reported as 24 months (controllers) and 48 months (browsers) `[?]` (timelines not confirmed in the source read).

**What the Council mandate does** `[S]` (https://ppc.land/eu-council-agrees-4-month-cookie-re-ask-wait-for-digital-omnibus-talks/, https://www.nicfab.eu/en/posts/digital-omnibus-council/, https://legal247.no/en/insights/digital-omnibus-gdpr/)

- **Deletes Arts. 88a and 88b.** Cookie rules stay in ePrivacy Art. 5(3), rewritten in full. **Browser-signal obligation dropped** (removed in a June 2026 compromise; not restored).
- **Six consent-free purposes**: (1) transmission; (2) service explicitly requested incl. its functionality; (3) **first-party audience measurement** producing anonymous aggregated information (provider or its processor; no other use, no sharing, no combining with third-party data); (4) **media audience measurement** under EMFA Art. 24 (pseudonymised, single purpose); (5) technical security; (6) **contextual ad measurement** (single page/visit/query, no profiling, no cross-site data; recital names capping and ad-measurement cookies).
- **Single-click refusal** retained; re-ask wait cut to **4 months** (earlier re-ask allowed if purpose changes or the refusal record is lost for reasons outside the provider's control).
- **Enforcement** moves to the GDPR supervisory authority in every state (new Art. 15a(5)).
- Because it stays a directive: national transposition, reported 24 months. One source reports a conflicting "applies six months after publication" clause to be resolved in trilogue. `[?]`
- Other GDPR items in the mandate (context): relative definition of personal data kept close to current law plus pseudonymisation clarification; breach notification 96h with higher threshold; relief for abusive DSARs. `[S]`

**Open/unknown** `[?]`: whether the EP will reinstate browser signals; final exemption list; whether the instrument ends up as GDPR article or directive amendment; dates. One search result mentioned a "provisional agreement of 7 May 2026": that appears to concern a different file (likely the separate AI omnibus) and conflicts with every other source for this file. Treat as not applicable.

**Skill guidance**: do not weaken any current control in anticipation. Design choices that are safe under both today's law and every Omnibus variant: one-click reject on first layer, 6-month no-re-prompt, first-party aggregated analytics with no sharing, honouring GPC as a refusal signal (optional today in the EU).

---

## 3. Country-specific rules (EU/EEA)

### 3.1 Comparison table

Legend: "1st-layer reject" = must a refuse option sit on the same layer as accept. "Analytics exemption" = can audience measurement run without consent. Re-prompt = regulator-recommended period for retaining the choice / not re-asking.

| Country (law; regulator) | 1st-layer reject required? | Analytics exemption? | Cookie walls / consent-or-pay | Consent validity / re-prompt | Notable enforcement |
|---|---|---|---|---|---|
| **France** (Art. 82 LIL; CNIL) | **Yes** ("refuser aussi simple qu'accepter"; "Tout refuser" or "Continuer sans accepter") `[P]/[M]` | **Yes**, strict conditions (3.2) `[P]` | Case by case; fair alternative and reasonable price `[M]` | Keep choice (accept **or** refuse) **6 months** as good practice; exempt analytics cookie 13 months, data 25 months `[P]/[S]` | Google EUR 325M and Shein EUR 150M (Sep 2025); Fnac Darty EUR 7M (Oct 2026); many more (Section 8) |
| **Germany** (§ 25 TDDDG; state DPAs; BfDI for EinwV) | DSK: required where the user must interact with the banner to proceed and an "accept all" is shown; courts (VG Hannover 2025) say yes `[S]` | **No** statutory exemption; DSK reads § 25(2) narrowly `[S]/[M]` | Pur-Abo allowed under DSK conditions `[M]` | No fixed period `[M]` | Fines rare; court orders and competitor/consumer-association litigation; § 28 TDDDG fine cap EUR 300k for § 25 `[M]` |
| **Italy** (Art. 122 Codice; Garante) | Effectively yes: an **"X" close button** (top right) that keeps defaults = reject; plus link to granular choices `[S]` | **Yes**: analytics treated as technical if first-party, or third-party with IP masking, aggregated, no combination `[M]` | Unlawful unless equivalent access without consent is offered; pay-or-ok under consultation `[S]/[?]` | No re-prompt for **at least 6 months** after a choice (unless material change or choice not retrievable) `[S]` | Email tracking-pixel guidelines (17 Apr 2026, deadline 29 Oct 2026) now in inspection plan `[S]` |
| **Spain** (Art. 22.2 LSSI; AEPD) | **Yes**: accept and reject at same level, same layer, same visibility (guide Jul 2023; mandatory from 11 Jan 2024) `[S]` | **Yes**, per AEPD audience-measurement guide (Jan 2024): own site only, exclusively on behalf of publisher, contract safeguards `[S]` | Access may be denied if an alternative, not necessarily free, is offered `[S]` | Good practice: renew at most every **24 months** `[S]` | Many small LSSI fines (typically EUR 3k to 30k; LSSI caps EUR 30k minor / EUR 150k serious) `[M]` |
| **Netherlands** (Art. 11.7a Tw; AP, with ACM also competent for Tw) | **Yes** in AP practice: reject must be directly visible `[S]` | **Yes**, statutory: analytics with "no or little impact on privacy" `[M]` | Cookie walls not permitted (AP) `[S]` | No fixed period `[?]` | Kruidvat/AS Watson EUR 600k (Jul 2024); Coolblue EUR 40k (Dec 2024); warnings to ~50 orgs (Apr 2025), ~100 by Oct 2026; formal investigations opened Oct 2026 `[S]` |
| **Belgium** (Art. 10/2 Data Protection Act 2018; APD/GBA) | **Yes** per APD checklist and decisions `[S]` | **No** (consent required; decision 22/2024 sanctioned analytics labelled essential) `[S]` | Not allowed as a rule `[M]` | APD recommends short validity; commonly cited 6 months `[?]` | Roularta and Rossel EUR 50k each (2022) `[M]`; Mediahuis 113/2024 **annulled** by Market Court 19 Mar 2025 on procedural/abuse-of-rights grounds `[S]`; EDPB Binding Decision 1/2026 forces APD to hear noyb's VRT banner complaint on the merits `[S]` |
| **Austria** (§ 165(3) TKG 2021; DSB) | **Yes** (DSB FAQ and decisions; equal visual weight) `[S]` | **No** `[S]` | Pay-or-okay possible but consent must be granular (BVwG Aug 2025) `[S]` | No fixed period `[?]` | ORF banner order upheld by BVwG (reported 6 May 2026) `[S]`; origin of the 2022 Google Analytics decision |
| **Denmark** (Cookie Order; Digitaliseringsstyrelsen + Datatilsynet) | **Yes** in practice (joint guidance; equal ease) `[S]` | **No**; statistics need consent `[S]` | **Allowed** under four criteria; 29 DKK/month accepted in one case `[S]` | Renew periodically; 12 months commonly cited `[?]` | Decisions/injunctions rather than fines; JFM, GulogGratis cookie-wall cases `[S]` |
| **Ireland** (reg. 5 SI 336/2011; DPC) | Expected: no nudging, reject of equal prominence `[M]` | **No**, but first-party analytics "unlikely to be a priority for enforcement" `[S]` | Not addressed in detail; EDPB line `[?]` | Consent choice stored **max 6 months** (DPC 2020 guidance) `[S]` | 2020 sweep and enforcement notices; big-tech GDPR fines (LinkedIn EUR 310M) concern ad consent/legal basis |
| **Sweden** (LEK 2022:482 ch. 9 § 28; PTS for cookies, IMY for GDPR) | Yes in IMY banner decisions `[S]/[?]` | No `[M]` | EDPB line `[?]` | No fixed period | IMY: Meta Pixel cases (Apoteket SEK 37M, Apohem SEK 8M, Avanza SEK 15M, 2024) under Art. 32; GA transfer fines 2023 (Tele2 SEK 12M) `[S]/[M]` |
| **Norway** (EEA; new Ekom Act in force 1 Jan 2025; Nkom + Datatilsynet) | Yes, GDPR-grade consent now required; browser-settings consent abolished `[S]` | No general exemption `[?]` | EDPB line `[?]` | No fixed period | Grindr NOK 65M (ad-data sharing) `[M]` |
| **Finland** (Act on Electronic Communications Services § 205; Traficom) | Yes per Traficom guidance; browser settings not consent (court rulings 2021) `[M]` | No `[M]` | Not allowed as a rule `[M]` | No fixed period | Mostly orders `[M]` |
| **Greece, Luxembourg, Czechia, Portugal, Poland** | Reject at same level expected (HDPA 2020; CNPD 2021) `[M]` | Varies; verify locally `[?]` | Generally restrictive `[?]` | Varies | Low fine volume `[?]` |

Where a cell is `[?]`, default to the strictest neighbouring rule: first-layer reject, consent for analytics, no cookie wall, 6-month choice retention.

### 3.2 France (CNIL): the most detailed and most enforced regime

Sources: Guidelines (délibération 2020-091) and Recommendation (2020-092) of 17 Sep 2020; enforcement since 1 Apr 2021. https://www.cnil.fr/fr/cookies-et-autres-traceurs `[M]`

- **Refuse as easy as accept**: a "Tout refuser" button next to "Tout accepter", or a clearly visible "Continuer sans accepter". A "Paramétrer" link alone is not a reject. `[M]`
- **First layer must state**: each purpose (short title + one-line description), that consent can be withdrawn at any time, and give access to the **list of controllers/partners** (with number). `[M]`
- **Choice retention**: store refusal as well as acceptance; **6 months** is CNIL's recommended good practice for both, assessed case by case. `[S]` https://www.cnil.fr/fr/cnil-direct/question/cookies-si-jai-refuse-ses-cookies-un-site-web-peut-il-me-redemander-de-les
- **Withdrawal**: permanent link/icon ("Gérer mes cookies"); after withdrawal no further reads/writes. Orange was fined partly for continuing to read cookies after withdrawal. `[M]`
- **Proof of consent**: each party relying on consent must be able to prove it; a contractual clause pushing the duty to the publisher is not enough (restated in the Oct 2026 session-replay recommendation). `[P]`
- **Audience-measurement exemption** (CNIL page dated 4 Jul 2025) `[P]` https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience
  - Purpose limited to measuring audience of the site/app **for the publisher's exclusive account** (performance, navigation problems, content analysis).
  - Produces **anonymous statistical data only**.
  - No cross-referencing with other processing; no transmission of non-anonymous data to third parties; **no cross-site/app tracking**.
  - Recommended: inform users; tracker lifetime about **13 months**, not auto-extended on new visits; data kept at most **25 months**; periodic review.
  - A processor may serve several publishers only with **separate** collection, processing and storage per publisher and independent trackers.
  - **Tools**: the current page names no tools and points to a **self-assessment grid** for vendors. Secondary sources say the former public list of pre-evaluated tools (which included Matomo, Piano Analytics/AT Internet, Piwik PRO and others) was discontinued on 1 Jan 2026 and the burden is now on each publisher. `[?]` (discontinuation date not confirmed on cnil.fr). Matomo publishes its own self-assessment and CNIL configuration guide (Apr 2026): https://matomo.org/faq/how-do-i-configure-matomo-without-tracking-consent-for-french-visitors-cnil-exemption/ `[S]`
  - **Google Analytics (standard GA4) does not qualify**: Google reuses data for its own purposes and enables cross-site linkage. It was never on the list. `[M]`
  - Outside the exemption even on exempt tools: heatmaps, **session replay**, e-commerce/ads attribution, user-ID stitching, cross-domain tracking.
- **Session replay recommendation** (adopted 8 Oct 2026): session-replay tools always require prior consent under Art. 82; each purpose must be presented; prefer less intrusive tools; not to be used for ad retargeting. `[P]` https://cnil.fr/sites/default/files/2026-11/rejeu_session_recommandation.pdf
- **Email tracking pixels recommendation** (délibération 2026-042 of 12 Mar 2026, published 14 Apr 2026): open-tracking pixels need specific consent, ideally collected with the email address; exemptions for aggregated measurement and some transactional mail; transition for existing addresses ended 14 Jul 2026; FAQ 22 Jul 2026. `[S]` https://www.cnil.fr/fr/recommandation-pixel-suivi-courriels
- **Mobile apps**: CNIL recommendation (Sep 2024); SDK trackers follow the same Art. 82 rules; first app-tracker sanction against Fnac Darty (Oct 2026). `[P]/[M]`

### 3.3 Germany

- **§ 25 TDDDG** (TTDSG renamed 14 May 2024): consent for storing/accessing information on terminal equipment; exemptions for transmission and "unbedingt erforderlich" services expressly requested. GDPR consent standard. `[M]` https://www.gesetze-im-internet.de/ttdsg/__25.html
- **DSK Orientierungshilfe Digitale Dienste v1.2 (Nov 2024)**: exemptions read narrowly; economic interest alone is not necessity; reach measurement is not per se necessary; a first-layer reject is needed when users must interact with the banner to continue and accept-all is offered; no nudging; granular purposes. `[S]` https://www.bfdi.bund.de/SharedDocs/Downloads/DE/DSK/Orientierungshilfen/OH_Digitale-Dienste.pdf
- **VG Hannover, 19 Mar 2025, 10 A 5385/22** (Neue Osnabrücker Zeitung v LfD Niedersachsen): "Alles ablehnen" must be offered on the first layer with equal visibility when "Alle akzeptieren" is; misleading labels and repeated prompting invalidate consent; **Google Tag Manager itself requires consent** (reported in secondary sources; verify against the judgment). `[S]` https://www.lfd.niedersachsen.de/download/217974
- **BGH "Cookie-Einwilligung II"** (28 May 2020, Planet49 follow-up): opt-in required. `[M]`
- **Einwilligungsverwaltungsverordnung (EinwV)**, in force **1 Apr 2025**, under § 26 TDDDG: framework for recognised consent-management services (PIMS). **Voluntary** for website operators; no duty to honour signals. BfDI recognised the first service ("Consenter", Law & Innovation Technology GmbH) on **17 Oct 2025**; reportedly a Chrome extension. No second service found. `[S]` https://www.bfdi.bund.de/DE/Fachthemen/Inhalte/Telefon-Internet/Einwilligungsverwaltung/Einwilligungsverwaltung.html
- **Private enforcement matters more than fines**: Abmahnungen by competitors and consumer associations (UWG/UKlaG), and GDPR Art. 82 damages claims. See Google Fonts (6.2).
- Pur-Abo: DSK resolution of 22 Mar 2023 (1.6).

### 3.4 Italy (Garante guidelines of 10 Jun 2021, doc. web 9677876; effective Jan 2022)

https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876

- Banner must contain an **"X" at top right**; clicking it closes the banner **keeping default settings** (technical cookies only). Plus: accept-all button, link to granular selection area, link to full policy. `[S]`
- **Scrolling is not consent** on its own; it can only form part of a more complex, unambiguous, documented pattern. `[M]`
- **Re-prompting**: not before **6 months**, unless processing conditions change materially (e.g. new third parties) or the site cannot know the earlier choice (cookie deleted). `[S]`
- **Analytics** equated to technical cookies where: used only for aggregated statistics on a single site/app; for third-party tools, **IP at least partially masked**; no combination with other data; no onward sharing. `[M]`
- **Cookie walls**: unlawful unless the user can reach equivalent content/service without consenting; assessed case by case. `[M]`
- **Email tracking pixels**: guidelines adopted 17 Apr 2026 (provv. 284, doc. web 10241943; GU 29 Apr 2026); consent generally required (may be bundled with marketing consent if neutral and informed), separate withdrawal of tracking; adaptation deadline 29 Oct 2026; included in the Aug to Dec 2026 inspection plan. `[S]` https://www.garanteprivacy.it/temi/tracking-pixel

### 3.5 Spain (AEPD "Guía sobre el uso de cookies", Jul 2023; minor update May 2024)

https://www.aepd.es/prensa-y-comunicacion/notas-de-prensa/aepd-actualiza-guia-cookies-para-adaptarla-a-nuevas-directrices-cepd

- Accept and reject **on the same layer, same level, same visual weight**; mandatory since 11 Jan 2024. `[S]`
- Colour/contrast must not make reject obviously less visible; no pre-ticked boxes; "continue browsing" is not consent. `[S]/[M]`
- **Audience measurement guide** (Jan 2024): exempt where strictly limited to measuring the publisher's own site, processed exclusively on its behalf, aggregated statistics, with contractual limits on the provider; AEPD notes some analytics services will not qualify. `[S]`
- **Cookie walls**: access can be refused if the user is informed and offered an alternative that is "not necessarily free". `[S]`
- **Validity**: good practice not to exceed **24 months**; renew on policy/purpose/third-party changes. `[S]`
- Layered information; second layer must list cookies with purpose, owner (first/third party) and duration. `[M]`

### 3.6 Netherlands

- Art. 11.7a Telecommunicatiewet: consent rule with statutory exemption for analytics having no or little privacy impact. Using analytics data shared with a vendor for its own purposes (default GA) falls outside. `[M]`
- AP guidance (2024): reject button directly visible on first layer, no hidden choices, no pre-ticked, no unclear text; cookie walls not permitted. `[S]` https://www.autoriteitpersoonsgegevens.nl/ga-slim-om-met-cookies
- Enforcement programme: AP received dedicated budget; warned about 50 organisations (Apr 2025); about 100 by Oct 2026; on 16 Oct 2026 announced investigations into two organisations that kept a banner without a directly visible reject button. Focus also on **pre-consent script loading**. `[S]` (AP page returned 403 to automated fetch.) https://www.autoriteitpersoonsgegevens.nl/actueel/ap-onderzoekt-websites-vanwege-misleidende-cookiebanner

### 3.7 Belgium

- APD/GBA cookie checklist (2023) and decisions: no accept-only first layer, no misleading colours, no LI for analytics/marketing cookies, withdrawal as easy as consent. `[S]`
- **Caution**: flagship Mediahuis decision 113/2024 (6 Sep 2024) was **annulled by the Market Court on 19 Mar 2025** (2024/AR/1690), on grounds tied to the noyb complaint (abuse/mandate), not on banner design. The substantive standard remains APD's position but the precedent is weakened. `[S]`
- **EDPB Binding Decision 1/2026** (adopted 28 May 2026, published 14 Jul 2026): APD may not dismiss noyb's VRT cookie-banner complaint as abusive; must rule on merits. Signals that mass NGO banner complaints will be heard EU-wide. `[S]` https://www.dataprotectionauthority.be/citizen/european-data-protection-authorities-ask-the-belgian-dpa-to-investigate-a-complaint-lodged-by-ngo-noyb
- **IAB TCF**: Market Court 14 May 2025 upheld that the TC String is personal data and IAB Europe is joint controller for it (narrowly), with the EUR 250k fine; Jan 2026 ruling annulled APD's validation of the IAB action plan for re-assessment. TCF v2.2/v2.3 remain in market use; using TCF does not itself make a banner compliant. `[S]`

### 3.8 Austria, Denmark, Ireland, Nordics (short notes)

- **Austria**: DSB FAQ requires a first-layer refusal option and equal button weight; no analytics exemption. `[S]`
- **Denmark**: two regulators on the same banner. Statistics cookies need consent. Cookie walls lawful if the four criteria are met. `[S]`
- **Ireland**: DPC guidance (Apr 2020): no implied consent, no pre-ticked, analytics need consent, consent record max 6 months, withdrawal UI required. No newer DPC cookie guidance found. `[S]`
- **Norway**: since 1 Jan 2025 consent must meet the GDPR standard; Datatilsynet guidance (Apr 2025). `[S]`

---

## 4. United Kingdom

### 4.1 Framework

- **PECR 2003 reg. 6** (storage/access) + **UK GDPR** + **DPA 2018**, as amended by the **Data (Use and Access) Act 2025** (Royal Assent 19 Jun 2025). Regulator: ICO.
- DUAA s. 112 + Sch. 12 substituted reg. 6 and inserted **PECR Schedule A1** (exceptions). **In force 5 Feb 2026** (SI 2026/82, Commencement No. 6). `[P]` https://www.legislation.gov.uk/ukpga/2025/18/schedule/12
- DUAA s. 115 + Sch. 13 replaced the PECR enforcement regime (reg. 31, Sch. 1) with DPA 2018 Parts 5 to 7 powers. **In force 5 Feb 2026** for breaches on or after that date (SI 2026/82 reg. 2(y), regs. 8-11). `[P]` https://www.legislation.gov.uk/ukpga/2025/18/section/115
- "Website" in Sch. A1 includes mobile apps and other platforms. `[P]`
- EU adequacy for the UK renewed 19 Dec 2025 until **27 Dec 2031**. `[S]`

### 4.2 Consent exceptions in force since 5 Feb 2026 (PECR Sch. A1) `[P]`

| Para | Exception | Conditions |
|---|---|---|
| 3 | Transmission of a communication | Sole purpose. Includes load-balancing session cookies (ICO). |
| 4 | Strictly necessary for a requested information society service | Statute now lists examples: protecting information, device security, **preventing/detecting fraud or technical faults**, **automatic authentication**, **recording selections or information entered**. |
| 5 | **Statistical purposes** (analytics), **opt-out** | Sole purpose is collecting statistics on how the service/website is used, with a view to improving it; information not shared except to help make those improvements; **clear and comprehensive information** given; **simple, free means to object** offered and user has not objected. |
| 6 | **Appearance / functionality** of a website, **opt-out** | Sole purpose is adapting appearance or function to user preferences or otherwise enhancing them; same information + objection conditions. |
| 7 | Emergency assistance | Locating the device after an emergency communication. |

The Secretary of State can add/vary exceptions by regulations (reg. 6A). `[S]`

**ICO interpretation** (final guidance, 29 Apr 2026) `[P]` https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/

- Statistical exception is about **how the service is used, not who uses it**: aggregate only; no decisions or inferences about individuals or groups; no individual-level retention beyond what aggregation needs; **never for online advertising**.
- **Third-party analytics allowed** only if the provider is a **processor**, acts solely to help improve your service, and does **not link** the data with other data it holds. You must name the provider and explain what it does. If the tool also feeds ad campaigns or the vendor uses data for its own purposes: consent.
- Likely in: page-visit counts, scroll depth, device/browser info, referrers, **A/B testing**, coarse (city/region) location, load speed, bounce rate.
- Out: **session logs/recordings of individual visitors**, ad-view tracking, linking visitor IDs to conversions for ad partners, profiling, cross-service monitoring.
- ICO names no products. Whether **GA4** qualifies depends on configuration (Google signals/ads linking off, Google as processor only, no data sharing for Google's purposes). `[?]` Treat default GA4 as **not** exempt; a documented, locked-down configuration is arguable.
- Appearance exception: responsive layout, remembered language, OS theme, **self-hosted fonts**; external font libraries possible only with disclosure of what they collect (e.g. IP) and an objection route. Not content personalisation.
- **"Simple means of objecting"**: no mandated format. ICO example: toggles for statistics/appearance inside the existing consent mechanism, **on by default**, switchable off at any time. Must not rely solely on browser settings. After objection, stop.
- Strictly necessary also covers: persistent consent-preference cookie (with prominent information), embeds that set nothing until play is pressed, social plugins only for logged-in members. **No advertising purpose is ever strictly necessary.**

### 4.3 Consent mechanics (ICO, final guidance) `[P]`

https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/

- "As easy to refuse consent as it is to accept": reject-all with equal prominence; accept-only banners are bad practice.
- Non-exempt technologies only after valid consent; silence/inactivity is not consent.
- No fixed consent duration; **6 months** is "a suitable timeframe to request fresh consent" as a general guide; do not re-prompt as a matter of course; must re-ask if purposes change.
- Withdrawal "with the same ease"; on withdrawal you **must** stop, tell relevant third parties, **treat it as an erasure request and delete data gathered under that consent**, and ensure technologies already set can be removed.
- No consent via T&Cs; no "legitimate interests" toggles for storage/access; granular per purpose.
- "You must be able to demonstrate that someone has provided consent"; review the CMP's default preference-cookie expiry and document the choice.
- Ad measurement needs no separate consent from the advertising consent; contextual advertising is the more compliant route. `[P]`

### 4.4 Fines and enforcement

- **Max PECR penalty** rose from GBP 500,000 to the UK GDPR scale: **GBP 17.5M or 4% of worldwide turnover** (higher tier), GBP 8.7M or 2% (standard tier), for breaches on or after 5 Feb 2026. `[S]` (commencement `[P]`; figures follow from applying DPA 2018 Part 6; confirm which tier covers reg. 6 before quoting, widely reported as higher tier). Note: ICO's "What happens if we don't comply" page still said it would be updated once the new regime is in force when fetched. `[P]`
- No reported ICO monetary penalty for cookies under the new powers as of this check. `[S]`
- **Top-1,000 websites programme** (ICO, 4 Dec 2025) `[P]` https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2025/12/ico-action-secures-increased-cookie-compliance/
  - Three tests: (1) non-essential **advertising** cookies set before choice; (2) rejecting as easy as accepting; (3) non-essential advertising cookies set despite refusal.
  - 979/1,000 passed at latest test (415 unprompted, 564 after intervention); 21 failing; 17 preliminary enforcement notices issued. CMP vendors changed defaults. Periodic retesting continues.
- **Advertising reform track**: ICO advised government (letter 21 Apr 2026, published May 2026) to use reg. 6A to exempt **lower-risk advertising** (contextual targeting, city-level geo, first-party frequency capping, aggregated measurement). **No legal change yet**; ad-related storage/access still needs consent. `[S]` https://ico.org.uk/media2/e3qanbyx/20260505-summary-of-call-for-views.pdf

### 4.5 Consent or pay (ICO guidance, 23 Jan 2025) `[S]`

Permissible in principle. Four factors, documented in a DPIA: **power imbalance**, **appropriate fee**, **equivalence** (broadly the same core service on both branches), **privacy by design** (clear, non-nudging presentation). "Take it or leave it" cookie walls generally fail. Consumer-facing explainer published 20 Oct 2025.

### 4.6 UK audit deltas vs EU

- Analytics and UI-preference storage can run **opt-out** if Sch. A1 paras 5/6 conditions are met: add clear notice + default-on toggles + honour objection. Ads, social, session replay, cross-site: opt-in as before.
- UK withdrawal = stop + delete + notify third parties.
- UK GDPR still applies to the personal data: lawful basis (legitimate interests is plausible for exempt analytics), transparency, transfers (UK-US data bridge / UK Extension to the DPF; under government review after *Slaughter*, Section 6.3 `[S]`).

---

## 5. Switzerland

### 5.1 Framework

- **revFADP** (nDSG), in force 1 Sep 2023: processing by private controllers is lawful by default if principles (transparency, proportionality, purpose limitation) are respected; a justification (consent, overriding private interest, law) is needed only where personality rights are breached. No general consent requirement. Criminal fines up to CHF 250,000 on responsible **individuals** for intentional breaches of information/duty provisions. `[M]`
- **Telecommunications Act Art. 45c(b)**: processing data on third-party devices is allowed only if users are **informed** about the processing and its purpose and told that they **may refuse** it. An information + opt-out rule, not opt-in. `[P]`
- **FDPIC guidelines on cookies and similar technologies**: v1.0 of 22 Jan 2025; **v1.1 of 6 Oct 2025** (published 7 Oct 2025) adding clarifications on personalised advertising via third-party cookies, location data, and cookie paywalls. `[P]` https://www.edoeb.admin.ch/en/cookie-guidelines-updated-version (PDF linked there)

### 5.2 FDPIC position `[P]`

- Art. 45c TCA is **not** lex specialis displacing the FADP; both apply.
- **Technically necessary cookies**: no justification needed; user can only decline the whole offer.
- **Non-essential cookies**: breach proportionality unless justified. Justification can be an **overriding private interest**; then no consent needed, but the **Art. 45c right to reject (opt-out) is always mandatory** and must be displayed with adequate visibility.
- **Statistics/analytics**: privileged under Art. 31(2)(e) FADP if data is **anonymised as soon as the purpose permits** (on websites: usually immediately), results published only in non-identifying form, and sensitive data not disclosed identifiably. Then opt-out suffices.
- **Express consent (opt-in) required** where processing involves **sensitive personal data** or **high-risk profiling** (Art. 6(7) FADP), or cookies are used in a way users would not expect. Assume high-risk profiling where large-scale, cross-site third-party ad tracking links data so that essential aspects of personality can be assessed. v1.1: handing visitors' data to third parties for payment through third-party cookies across many sites can require consent; location-based profiling is often high-risk.
- **Federal bodies** must get express consent for profiling cookies in any case.
- **Risk matrix (Appendix A)**: risk 0 to 1 = necessary cookies (accept or leave); 1 to 2.5 = functional / standard profiling: **mandatory opt-out**; above 2.5 = **compulsory opt-in**.
- **Banner design**: where opt-in is sought, active click/tick required; deselecting must not be harder than selecting; fonts, images and colours must not cause confusion or errors; mandatory vs optional fields distinguishable.
- **Cookie paywalls**: consent is voluntary if forgoing the service is reasonable, or else an equivalent alternative exists. For consent-or-pay, the fee must be (1) proportionate and (2) not undermine the fundamental right to data protection. Dependence on the service (dominant retailer, job site, social network) makes forgoing less reasonable.
- **Third parties**: operator embedding third-party tools shares responsibility for the resulting processing. `[S]`

### 5.3 Practical

- Swiss-only site: informational banner/notice + working opt-out is the legal floor; opt-in for cross-site ad tracking and anything touching sensitive data is the FDPIC expectation.
- Most Swiss sites also target EU/EEA users (GDPR Art. 3(2)) and should apply the EU opt-in standard to those visitors, or to everyone.
- Transfers: Swiss-US Data Privacy Framework recognised effective 15 Sep 2024 `[M]`; EU-CH adequacy continues `[M]`.
- Privacy notice must meet Art. 19 FADP (identity, purposes, recipients, **list of destination countries** for transfers and the safeguard). `[M]`

---

## 6. Cross-cutting issues

### 6.1 Banner dark patterns: consolidated checklist

| Check | Authority |
|---|---|
| Reject on first layer, same click count as accept | CNIL, AEPD, Garante (X), AP, APD, DSB, DK, ICO; EDPB taskforce majority; VG Hannover |
| Equal prominence (size, colour, contrast, position); reject not a text link | Taskforce; CNIL Google/Facebook 2021 decisions; ICO; AEPD; DSB (ORF) |
| No pre-ticked boxes/toggles on any layer | Planet49; GDPR recital 32 |
| No consent by scroll, navigation, closing, or inactivity | EDPB 05/2020; Garante; ICO |
| No "legitimate interest" toggles for device access or ad purposes; no LI layer hidden behind "settings" | Taskforce; ICO; APD |
| Granular purposes; accept-all allowed only alongside granular + reject-all | EDPB 05/2020; CNIL; BVwG (derStandard) |
| Accurate classification (analytics/marketing not labelled "essential"/"functional") | Taskforce; APD 22/2024 |
| No tags, cookies, pixels or third-party requests carrying identifiers before choice | All; AP focus; ICO test 1 |
| Refusal respected: nothing set after reject; previously set cookies no longer read | ICO test 3; CNIL Orange, Shein |
| Persistent withdrawal control on every page; one or two clicks | GDPR Art. 7(3); Taskforce; ICO; CNIL |
| No repeated prompting after refusal (about 6 months) | CNIL, Garante, DPC, ICO; VG Hannover |
| First layer names purposes, controller, number/list of partners, right to withdraw | CNIL; Planet49 (duration, third parties) |
| No content-blocking wall without lawful alternative | EDPB 05/2020; national rules (3.1) |
| Language of the site's audience; plain wording; no guilt-tripping labels | EDPB 03/2022; VG Hannover |
| Mobile/app parity (SDKs gated by the same consent) | CNIL app recommendation; PECR Sch. A1 para 1 |

### 6.2 Google Fonts and embedded third-party content

- **LG München I, 20 Jan 2022, 3 O 17493/20**: dynamically loading Google Fonts sends the visitor's IP to Google without legal basis; no legitimate interest because self-hosting is possible; EUR 100 damages plus injunction. `[S]`
- A wave of mass demand letters followed. **LG München I, 30 Mar 2023, 4 O 13063/22**: claims generated by crawling for Google Fonts violations are an abuse of rights; no damages or injunction. `[S]` The underlying illegality finding stands; the mass-claim business model does not. Later BGH/CJEU authority specific to fonts: none found `[?]`.
- UK: ICO puts self-hosted fonts within the appearance exception; external font libraries need disclosure plus objection route. `[P]`
- **Rule for the skill**: self-host fonts, icon sets, JS libraries. For YouTube (use youtube-nocookie + click-to-load), Vimeo, Google Maps, reCAPTCHA, social embeds, podcast players: load only after consent or after an explicit click on a placeholder that explains the transfer (two-click solution). Fashion ID makes the site operator jointly responsible for the collection.
- Also check: Google Tag Manager loading before consent (VG Hannover `[S]`), Gravatar, emoji CDNs, embedded tweets, Typekit, Font Awesome kits, hCaptcha/reCAPTCHA v3 (fingerprinting; consent or strong necessity argument limited to the protected form).

### 6.3 International transfers: EU-US Data Privacy Framework

- Adequacy decision (EU) 2023/1795 of 10 Jul 2023 remains **in force**. `[S]`
- **Latombe v Commission**: General Court dismissed the annulment action on **3 Sep 2025** (T-553/23). Appeal lodged **31 Oct 2025**, **C-703/25 P**, pending; no hearing date or AG opinion found; commentators expect a ruling 2027 to 2028. `[S]` https://eur-lex.europa.eu/legal-content/EN/TXT/PDF/?uri=OJ:C_202506610
- **New 2026 risk**: US Supreme Court, *Trump v. Slaughter* (29 Jun 2026) held FTC commissioner removal protections unconstitutional, overruling *Humphrey's Executor*; FTC independence is a pillar of the adequacy decision. noyb asked the Commission (30 Jun 2026) to withdraw the DPF and threatened an annulment action; EDPB letter of 31 Jul 2026 asked the Commission to assess the impact; Commission says it is analysing. PCLOB has lacked a quorum since Jan 2025. Danish DPA urged revisiting TIAs. `[S]` https://www.faegredrinker.com/en/insights/publications/2026/9/trump-v-slaughter-implications-of-the-us-supreme-court-ruling-for-eu-us-data-transfers-and-the-data-privacy-framework
- **Practical**: DPF still valid for certified US recipients (check https://www.dataprivacyframework.gov/list). Keep **SCCs + TIA as fallback** in DPAs with US vendors; prefer EU-hosted or proxying options for analytics and fonts; name the transfer mechanism in the privacy policy.

### 6.4 Google Analytics legality

- 2022 to 2023 decisions held GA (Universal Analytics era) unlawful **on transfer grounds** (Schrems II, no adequacy): Austrian DSB (Dec 2021/Jan 2022), CNIL (Feb 2022), Garante (Jun 2022), Danish Datatilsynet (Sep 2022), Swedish IMY (Jul 2023; Tele2 SEK 12M, CDON SEK 300k). `[M]`
- Since the DPF (Jul 2023) and Google LLC's certification, the **transfer objection is parked, not reversed**; no DPA has withdrawn its decision. It would revive if the DPF falls. `[S]`
- Independent of transfers, GA4 **needs prior consent** under Art. 5(3) in every EU/EEA state; it does not meet the FR/ES/IT/NL analytics exemptions in standard configuration. UK: see 4.2. CH: opt-out may suffice if not combined with ad features.
- Consent Mode v2: "advanced" mode sends cookieless pings before consent; under EDPB Guidelines 2/2023 these still involve access to terminal information. Use **basic** mode (no Google tags until consent) for a conservative posture. `[M]/[?]` (no regulator decision specifically on Consent Mode found).
- Lower-risk alternatives: self-hosted Matomo in exemption configuration, Piwik PRO, Plausible/Fathom-style cookieless aggregate tools (still check Art. 5(3): hashing IP+UA daily is arguably device-information access; exempt in FR/NL-type regimes if conditions are met, otherwise consent `[?]`).

---

## 7. Policy content and consent records

### 7.1 Privacy notice: GDPR / UK GDPR Art. 13 minimum content `[M]`

1. Controller identity and contact details; EU/UK representative if applicable (Art. 27).
2. DPO contact, if any.
3. **Purposes** and **legal basis** for each (map each purpose to one Art. 6 basis; state the legitimate interest where relied on).
4. **Recipients** or categories of recipients (name the analytics/ads/CDN/embedding vendors; CNIL expects a partner list reachable from the banner).
5. **Third-country transfers** and the safeguard (adequacy/DPF, SCCs) with how to obtain a copy.
6. **Retention periods** or criteria.
7. Rights: access, rectification, erasure, restriction, portability, objection; **right to withdraw consent at any time**; right to complain to a supervisory authority (name it).
8. Whether provision of data is statutory/contractual and consequences of not providing.
9. Automated decision-making/profiling under Art. 22, with meaningful information on logic.
10. For data not obtained from the subject (Art. 14): source and categories.

Switzerland adds: list of destination **countries** (Art. 19 FADP). UK (DUAA): complaints procedure duty on controllers commenced 19 Jun 2026 `[S]`; add a "how to complain to us" route.

### 7.2 Cookie / tracker policy content

- Per tracker or per category: **name, provider (first/third party), purpose, duration/expiry, type** (cookie, localStorage, pixel, SDK, fingerprint), and whether third parties get access (Planet49).
- Which trackers are exempt and why; which are consent-based; which run on opt-out (UK Sch. A1 paras 5/6; CH).
- How to change or withdraw the choice (link that reopens the CMP), and how long the choice is stored.
- Transfers and vendor privacy links; TCF vendor list if used.
- Keep it **generated from an actual scan** and dated; mismatches between the declared list and observed network behaviour are a routine finding in CNIL, AEPD and APD decisions.

### 7.3 Records / proof of consent

Legal basis: GDPR Art. 7(1) and Art. 5(2); Orange Romania; ICO "must be able to demonstrate"; CNIL: every party relying on consent must hold proof. `[P]/[M]`

Store per consent event:

- pseudonymous consent ID (also kept in the consent cookie), timestamp (UTC);
- choice per purpose/vendor (accept, reject, objected, partial), and method (banner button, settings, GPC signal, API);
- **banner/config version and policy version**, language, the text and vendor list shown (or a hash + archived copy);
- site/domain, and consent scope (domain, cross-domain, logged-in account);
- subsequent changes/withdrawals with timestamps.

Rules:

- Do not store more than needed (no full IP; truncated or none). The log is itself personal data: define retention (commonly consent lifetime plus limitation period; document it).
- A CMP vendor is a processor: DPA in place, EU hosting or transfer mechanism.
- Proof must cover **mechanism** too: retain dated screenshots/video of the banner flow, tag-manager configuration exports, and periodic scan reports showing no pre-consent firing (CNIL lists audits of the consent mechanism as an expected contractual item `[P]`).
- TCF TC String alone is weak proof: it records the signal, not what the user saw.

---

## 8. Notable enforcement 2023 to 2026 (what actually gets punished)

| Date | Authority | Target | Amount | Why |
|---|---|---|---|---|
| Dec 2022 | CNIL | Microsoft (Bing) | EUR 60M | Ad cookies without consent; no equally easy refusal `[M]` |
| Dec 2022 | CNIL | TikTok | EUR 5M | Refusal harder than acceptance; poor information `[M]` |
| Dec 2022 | CNIL | Apple | EUR 8M | Ad identifiers on by default on iPhone `[M]` |
| Jan 2023 | DPC (IE) | Meta (FB/IG) | EUR 390M | No valid legal basis (contract) for behavioural ads `[M]` |
| Jun 2023 | CNIL | Criteo | EUR 40M | Could not demonstrate consent obtained via partners; transparency, rights `[M]` |
| Jul 2023 | IMY (SE) | Tele2, CDON | SEK 12M, 300k | Google Analytics transfers `[M]` |
| Dec 2023 | CNIL | Yahoo EMEA | EUR 10M | ~20 ad cookies despite refusal; withdrawal penalised (mail access) `[M]` |
| Jun/Aug 2024 | IMY (SE) | Avanza; Apoteket; Apohem | SEK 15M; 37M; 8M | Meta Pixel leaked sensitive data (Art. 32) `[S]/[M]` |
| Jul 2024 | AP (NL) | AS Watson (Kruidvat) | EUR 600k | Tracking cookies without consent, pre-ticked, sensitive context; contested `[S]` |
| Sep 2024 | APD (BE) | Mediahuis | Orders | Banner design; **annulled Mar 2025** `[S]` |
| Oct 2024 | DPC (IE) | LinkedIn | EUR 310M | Invalid consent/LI for behavioural ads; under appeal `[S]` |
| Nov 2024 | CNIL | Orange | EUR 50M | Ads disguised as emails without consent; cookies still read after withdrawal `[M]` |
| Dec 2024 | AP (NL) | Coolblue | EUR 40k | Cookies without valid consent (2020 facts) `[S]` |
| Apr 2025 | Commission (DMA) | Meta | EUR 200M | Pay-or-consent without equivalent less-data option `[S]` |
| Mar 2025 | VG Hannover (DE) | NOZ | Order upheld | No first-layer reject; GTM without consent `[S]` |
| Sep 2025 | CNIL | Google | EUR 325M | Ads between Gmail emails without consent; cookies at account creation steering to personalised ads `[S]` |
| Sep 2025 | CNIL | Shein (Infinite Styles Services) | EUR 150M | Cookies before consent, incomplete banners, ineffective refuse/withdraw; appeal announced `[S]` |
| Nov 2025 | CNIL | Condé Nast (vanityfair.fr) | EUR 750k | Cookies without consent / after refusal (repeat after formal notice) `[S]` |
| Nov 2025 | CNIL | American Express Carte France | EUR 1.5M | Cookie rule breaches `[S]` |
| Dec 2025 | ICO (UK) | Top-1,000 sites | 17 PENs, no fines | Ad cookies before choice / after reject; unequal reject `[P]` |
| Aug 2025 | BVwG (AT) | derStandard | Order | Pay-or-okay without granular consent `[S]` |
| May 2026 | BVwG (AT) | ORF | Order upheld | Unequal buttons; no valid consent (noyb case page) `[S]` |
| Jul 2026 | EDPB | Belgian APD / VRT | Binding Decision 1/2026 | NGO banner complaints must be decided on merits `[S]` |
| Oct 2026 | AP (NL) | 2 unnamed orgs | Investigation | No directly visible reject after warning `[S]` |
| 22 Oct 2026 | CNIL | Fnac Darty Participations et Services; Fnac Direct | EUR 6M + 1M, injunction with EUR 10k/day | **Mobile app** tracker sending browsing history to a third-party recommendation API without consent, despite refusal; personalisation is not strictly necessary; noyb complaint; SAN-2026-015 `[P]` https://www.cnil.fr/fr/sanction-cookies-app-fnac |

Unverified leads (do not cite without checking) `[?]`: Garante EUR 12.5M against Poste Italiane (Apr 2026, app tracking; single vendor-blog source); CNIL "23 simplified-procedure cookie sanctions in 2026"; CNIL Yves Rocher EUR 800k (Mar 2026).

**Patterns**: (1) trackers firing before choice or after refusal; (2) reject harder than accept; (3) personalisation/recommendation trackers treated as "necessary"; (4) pixels leaking sensitive data (pharmacy, finance, health); (5) inability to prove consent collected by partners; (6) withdrawal that does nothing; (7) mobile SDKs now in scope of the same enforcement; (8) NGO (noyb) complaints drive a large share of cases.

---

## 9. Things in flux (re-check before relying)

1. **Digital Omnibus**: EP committee vote (expected early 2027), trilogues, fate of browser signals, final exemption list (first-party analytics, contextual ad measurement), 4 vs 6 months, directive vs GDPR article, transposition dates.
2. **EU-US DPF**: Commission's assessment after *Trump v. Slaughter*; possible noyb annulment action; CJEU appeal C-703/25 P; PCLOB quorum. UK and Swiss equivalents under review.
3. **UK**: possible reg. 6A regulations creating a low-risk advertising exception; ICO's updated online-advertising guidance and post-DUAA enforcement guidance; first PECR penalty at the new scale.
4. **EDPB consent-or-pay guidelines** for all controllers (planned; status after Feb 2026 unknown). Commission's assessment of Meta's Jan 2026 model.
5. **France**: status of CNIL's exempt audience-measurement tool list (reportedly ended 1 Jan 2026); session-replay recommendation (8 Oct 2026) and email-pixel recommendation (Apr 2026) now enforceable expectations.
6. **Italy**: pay-or-ok consultation outcome; pixel guidelines enforcement after 29 Oct 2026.
7. **Belgium**: APD merits decision in VRT; re-assessment of the IAB TCF action plan; standing of banner precedents after the Mediahuis annulment.
8. **Netherlands**: first fines from the AP banner programme.
9. **Germany**: uptake of EinwV-recognised services (one so far); any appeal in VG Hannover.
10. **Austria**: higher-court review of pay-or-okay.

## 10. Items not verified this session

- Exact OJ reference for the ePrivacy Regulation withdrawal (single secondary source).
- Council press release and mandate text (403 / not opened); details rely on three consistent secondary summaries.
- Which PECR penalty tier applies to reg. 6 (reported as the higher GBP 17.5M / 4% tier).
- AP (NL) news item of 16 Oct 2026 (403); numbers from secondary summaries.
- Consent validity periods for BE, DK, NL, AT, SE; Nordic and smaller-state specifics.
- AEPD guide wording (PDF not opened); Garante 2021 guideline details beyond the 6-month rule are from memory.
- VG Hannover's GTM holding (secondary reports only).
- Whether any regulator has ruled on Google Consent Mode "advanced" pings or on cookieless aggregate analytics tools.
- Table rows tagged `[M]` in Section 8 (pre-2025 fines) were not re-checked.
