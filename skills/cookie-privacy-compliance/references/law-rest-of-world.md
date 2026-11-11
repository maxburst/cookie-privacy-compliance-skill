# Cookie / tracking / privacy compliance: rest of world (non-EU/EEA/UK/CH, non-US)

**Last verified: 2026-11-11.** Practitioner reference for auditing and fixing websites. Not legal advice.

**How this was built.** Web searches on 2026-11-11 against regulators, legislation, IAPP, DLA Piper and law-firm client alerts for everything that could have moved in 2025-2026. Stable background law (statute structure, older guidance) is partly from prior knowledge and is not re-verified line by line.

**Confidence tags used below**

- No tag: confirmed by at least one high-trust source on the verification date, or long-stable law.
- `[memory]`: from prior knowledge, not re-checked today. Likely right, verify before relying on it for a client deliverable.
- `[verify]`: sources conflict, are thin (vendor blogs only), or the item is moving. Check the primary source.

**Terms.** "Opt-in" = no non-essential tags fire before an affirmative act. "Opt-out" = tags may fire on load with notice and a working refusal. "Notice only" = disclose, no choice mechanism legally required. "Applies to foreign sites" = the law claims reach over an operator with no local establishment that serves local residents.

---

## Contents

- 0. Cross-cutting facts an implementer should know first
- 1. Americas (deep dive: Canada, Brazil)
- 2. Asia-Pacific
- 3. Middle East and Africa
- 4. Other jurisdictions
- A. Summary table
- B. Practical regimes for geo-rules
- C. Global strictest-common-denominator vs geo-targeted
- Things in flux (re-check dates)
- Items not verified against a primary source

---

## 0. Cross-cutting facts an implementer should know first

1. **Almost no jurisdiction outside Europe has an ePrivacy-style "device access" rule.** The cookie question is nearly always answered by the general data protection law: is the identifier personal data, and what legal basis covers it. Exceptions with tracking-specific rules or guidance: Quebec (s. 8.1), Japan (Telecommunications Business Act), Brazil (ANPD cookie guide), Turkey (KVKK cookie guidelines), Nigeria (GAID Art. 19), Serbia (electronic communications law `[verify]`), Korea (privacy-policy disclosure of "automatic collection devices"), Singapore and Hong Kong (regulator guidance chapters).
2. **Laws with no "legitimate interests" basis push you to opt-in.** China, India, UAE federal, Egypt, Vietnam, Colombia, Peru, Argentina and Russia are consent-centric. Where legitimate interest exists (Brazil, Singapore, Thailand, Philippines, South Africa, Saudi Arabia, Chile 2026, Indonesia), first-party analytics is arguable without consent; cross-site advertising rarely is.
3. **Health, children and financial data are where enforcement actually lands.** The 2026 Australian pixel determinations, Korean TikTok/Meta fines, Brazil's ECA Digital and India's child-tracking ban all hit advertising pixels, not analytics cookies as such.
4. **Cross-border transfer rules bite harder than banner rules** in China, Russia, Vietnam, Egypt, Turkey, Saudi Arabia and Indonesia. Loading a US-hosted tag is a "transfer" under most of these laws.
5. **Children's rules are converging on "no profiling/targeted ads to minors"**: India (<18), Brazil (<18), Australia (code due Dec 2026), Canada (OPC code Oct 2026), Japan (<16 from 2027-28), Korea (<14), China (<14).

---

## 1. Americas (deep dive: Canada, Brazil)

### 1.1 Canada (federal): PIPEDA, CASL

- **Law / regulator.** PIPEDA (Part 1), Office of the Privacy Commissioner (OPC). CASL (anti-spam), enforced by CRTC, with OPC and Competition Bureau roles.
- **Reach.** No express clause; courts apply a "real and substantial connection" test, so a foreign site that targets or collects from Canadians is covered `[memory]` (Lawson v. Accusearch; A.T. v. Globe24h).
- **Consent model.** Consent is required, but its form depends on sensitivity and reasonable expectations. OPC's online behavioural advertising position accepts **opt-out** consent for interest-based ads if: clear notice at or before collection, easy and persistent opt-out that takes effect immediately, non-sensitive data only, data destroyed or de-identified quickly. Tracking that users cannot stop (fingerprinting, supercookies) is off-limits, and sites should not track children `[memory]` (https://www.priv.gc.ca/en/privacy-topics/technology/online-privacy-tracking-cookies/tracking-and-ads/gl_ba_1112/). The 2018 meaningful-consent guidelines require express consent for sensitive data or uses outside reasonable expectations.
- **Analytics vs ads.** Analytics: implied consent with notice is the norm. Ads: opt-out acceptable only for non-sensitive data; anything touching health, finances, precise location, or children needs express opt-in. The Home Depot/Meta finding (2023) treated undisclosed sharing of purchase data with Meta as needing express consent `[memory]`.
- **Children.** PIPEDA has no child-specific text. OPC published a **Children's Privacy Code on 20 October 2026**; it is guidance on how PIPEDA applies, not binding, but OPC will use it to assess compliance (https://gowlingwlg.com/en/insights-resources/articles/2026/canada-childrens-privacy-code). OPC age-assurance guidance issued May 2026 (https://www.priv.gc.ca/en/opc-news/news-and-announcements/2026/nr-c_260504/).
- **Transfers.** No adequacy regime. Accountability principle: contractual safeguards with the vendor plus notice that data may be processed abroad and be accessible to foreign authorities `[memory]`.
- **Notice.** Plain-language policy; identify purposes, third parties, risk of harm, contact for the privacy officer. English/French expected for national audiences.
- **Rights.** Access, correction, withdrawal of consent, complaint to OPC.
- **Penalties / enforcement.** PIPEDA has no administrative fines (findings, compliance agreements, Federal Court damages). CASL: up to C$10M per violation for organisations; CRTC issues penalties regularly `[memory]`. CASL's install-a-program rule deems consent for cookies where the user's conduct shows it `[memory]`.
- **Reform.** Bill C-27 died on prorogation in January 2025. **Bill C-36, Protecting Privacy and Consumer Data Act (PPCDA)** was tabled 15 June 2026 and would repeal PIPEDA Part 1: AMPs up to the greater of C$10M or 3% of global revenue, fines up to C$25M or 5%, a private right of action after a regulatory finding, a higher standard for minors' data, mandatory risk assessment before transfers outside Canada, and a new Digital Safety and Data Protection Commission (tied to Bill C-34). No AI Act attached (https://www.dlapiper.com/insights/publications/2026/06/canada-tables-bill-c36-the-protecting-privacy-and-consumer-data-act). As of the last check, parl.ca showed first reading only (https://www.parl.ca/LegisInfo/en/bill/45-1/c-36). Not law; do not build to it yet.

### 1.2 Quebec: Law 25 (Act respecting the protection of personal information in the private sector)

- **Regulator.** Commission d'accès à l'information (CAI).
- **Reach.** Applies to enterprises collecting personal information of Quebec residents in the course of business; generally treated as reaching foreign operators serving Quebec `[memory]`.
- **Tracking rule (s. 8.1, in force 22 Sept 2023).** Anyone collecting personal information using technology with functions that **identify, locate or profile** a person must first inform the person of the technology and of the means to **activate** those functions. In practice: such functions are **off by default** and the user turns them on. s. 9.1 (highest privacy by default) expressly excludes browser cookies, which creates an argument that ordinary cookies escape the default-off rule; McCarthy Tétrault flags the ambiguity (https://mccarthy.ca/en/insights/blogs/techlex/quebecs-law-25-and-cookies-not-so-cookie-cutter). **Conservative and near-universal market practice: opt-in for analytics and advertising cookies for Quebec visitors.** Whether aggregate, non-profiling analytics needs opt-in is debatable.
- **Consent standard (s. 14, CAI consent guidelines 2023-1 `[memory]`).** Manifest, free, informed, specific, granular, time-limited, requested separately from other information, in clear and simple language. Express consent for sensitive data.
- **Children.** Under 14: consent from parent or tutor (s. 4.1).
- **Transfers.** A privacy impact assessment is required before communicating personal information outside Quebec, plus a written contract (s. 17). This covers US analytics/ad vendors.
- **Notice content.** Confidentiality policy in clear language published on the website (s. 8.2); name/title and contact of the person in charge of personal information published on the site (s. 3.1); purposes, means, rights, third-party categories, possibility of transfer outside Quebec (s. 8). French is required for businesses with a Quebec establishment under the Charter of the French Language `[memory]`.
- **Rights.** Access, rectification, withdrawal, de-indexing/cessation of dissemination, information about automated decisions (s. 12.1), data portability (since 22 Sept 2024).
- **Penalties.** AMPs up to C$10M or 2% of worldwide turnover; penal fines up to C$25M or 4%; statutory punitive damages. **No published CAI penalty on cookies was found**; vendor claims of 2025-2026 cookie penalties could not be confirmed against the CAI `[verify]`.

### 1.3 Alberta and British Columbia (PIPA)

- Substantially similar to PIPEDA; implied and opt-out consent permitted for reasonable purposes. Alberta requires notice when a service provider outside Canada is used `[memory]`.
- **Alberta:** legislative committee made 12 recommendations (Feb 2025), including AMPs; public consultation closed 17 Feb 2026; no bill found (https://www.alberta.ca/personal-information-protection-act-engagement).
- **BC:** no PIPA bill; 2026 activity is on the public-sector FIPPA (Bill 9). Treat both provinces as "federal Canada" for banner purposes.

### 1.4 Brazil: LGPD, ANPD cookie guide, ECA Digital

- **Law / regulator.** LGPD (Law 13.709/2018). ANPD was converted into a full regulatory agency (Agência Nacional de Proteção de Dados) by Law 15.352 of 25 Feb 2026 (ANPD technical note: https://www.gov.br/anpd/pt-br/acesso-a-informacao/participacao-social/outras-acoes/ts-05-2026-nota-tecnica-no-42-2026.pdf/@@display-file/file).
- **Reach.** Art. 3: applies where processing occurs in Brazil, where goods/services are offered to individuals in Brazil, or where data was collected in Brazil. Foreign sites serving Brazilians are covered.
- **Cookie guidance.** ANPD *Guia Orientativo: Cookies e Proteção de Dados Pessoais* (Oct 2022) remains the reference; revision is on the regulatory agenda but no new version was found (https://www.gov.br/anpd/pt-br/documentos-e-publicacoes/guia-orientativo-cookies-e-protecao-de-dados-pessoais.pdf). Not binding, but used as the assessment yardstick. Key points `[memory]`: strictly necessary cookies need no consent; non-necessary cookies off by default; first-layer banner with an equally prominent "reject non-necessary" button; granular second layer; no pre-ticked boxes; no "continued browsing = consent"; easy withdrawal; cookie policy listing categories, purposes, retention, third parties.
- **Analytics vs ads.** Guide accepts **legitimate interest for some first-party audience measurement** after a balancing test; **advertising, behavioural profiling and third-party tracking need consent**. Classification of analytics is therefore debatable; most CMP deployments treat Brazil as full opt-in.
- **Sensitive / children.** Sensitive data: specific, highlighted consent or narrow alternatives (art. 11). Children: best-interest standard (art. 14). **ECA Digital (Law 15.211/2025) in force since 17 March 2026**, regulated by Decree 12.880/2026 and enforced by ANPD: applies to digital products/services directed at or likely to be accessed by under-18s; reliable age assurance (self-declaration not accepted for restricted content); limits on profiling and on manipulative design such as infinite scroll/autoplay for minors; loot-box ban (https://connectontech.bakermckenzie.com/brazil-regulates-the-children-and-adolescents-online-safety-act-digital-eca/). Treat profiling-based ads to minors as prohibited `[verify]` exact article.
- **Transfers.** Resolution CD/ANPD 19/2024: ANPD standard contractual clauses must be used unmodified; legacy clauses had to be replaced by ~22-23 Aug 2025 (https://www.hunton.com/privacy-and-information-security-law/brazilian-data-protection-authority-regulates-international-data-transfers). EU-Brazil mutual adequacy was adopted in early 2026 `[verify]`; the US has no adequacy, so US vendors need ANPD SCCs.
- **Notice / language.** Portuguese, clear and accessible; identity and contact of the controller and DPO (encarregado), purposes, sharing, rights (art. 9, 18).
- **Rights.** Confirmation, access, correction, anonymisation/blocking/deletion, portability, information on sharing, consent revocation, review of automated decisions.
- **Penalties / enforcement.** Up to 2% of Brazilian revenue, capped at R$50M per infraction; ECA Digital adds higher caps and service suspension `[verify]`. ANPD's 2026-2027 priority map (Resolution 30/2025) plans at least 75 enforcement actions. No cookie-specific fine found; enforcement so far targets platforms, children's data, and security incidents.

### 1.5 Mexico: new LFPDPPP (2025)

- **Law / regulator.** New Ley Federal de Protección de Datos Personales en Posesión de los Particulares, published 20 March 2025, in force 21 March 2025; INAI abolished, powers moved to the **Secretaría Anticorrupción y Buen Gobierno (SABG)** (https://www.littler.com/news-analysis/asap/mexico-tiene-nueva-ley-en-materia-de-proteccion-de-datos-personales). The 2011 Regulation has not been replaced and applies provision by provision; no new reglamento found `[verify]`.
- **Reach.** Limited: mainly controllers established in Mexico or using means located in Mexico `[memory]`. Reach over a purely foreign site is debatable.
- **Consent model.** **Tacit (opt-out) consent** is the default once the privacy notice is made available; express consent for financial/patrimonial data; express written consent for sensitive data.
- **Cookies.** The Privacy Notice Guidelines (2013) require disclosure of cookies/web beacons and how to disable them, shown through a visible communication on the site `[memory]`. Notice + opt-out.
- **Notice.** Aviso de privacidad (integral, simplified, short forms) in Spanish: controller identity and address, data categories, purposes (primary vs secondary, with a way to refuse secondary purposes), transfers, ARCO mechanism.
- **Rights.** ARCO (access, rectification, cancellation, opposition), revocation, limitation of use.
- **Penalties / enforcement.** Fines in UMA units, up to roughly MXN 37M, doubled for sensitive data. A reported MXN 42.8M SABG fine against the football federation (July 2026) comes from a single secondary source `[verify]`. Enforcement capacity after INAI's dissolution is uncertain.

### 1.6 Chile

- **Now:** Law 19.628 (weak, no regulator). **Law 21.719** creates a GDPR-style regime and the Agencia de Protección de Datos Personales, with entry into force set for **1 December 2026**.
- **Postponement pending.** Bill 18.623-07 would delay entry into force to 15 October 2027 (Senate approved 28 Oct 2026; Chamber constitution committee approved in general 5 Nov 2026, then sent to finance committee) (https://www.camara.cl/cms/2026/11/05/proteccion-de-datos-comision-aprobo-postergar-entrada-en-vigencia-de-la-ley/). **Unless published before 1 Dec 2026, the original date stands.** Re-check before relying on either date.
- **Substance `[memory]`.** Extraterritorial (offering goods/services to, or monitoring, people in Chile); bases include consent, contract and legitimate interest; sensitive and children's data protected; fines up to 20,000 UTM (about US$1.5M), with turnover-based fines for repeat serious offences by large companies; warning-first treatment for small companies in year one. No cookie-specific rule; expect GDPR-like practice.

### 1.7 Argentina

- Law 25.326, regulator AAIP. Consent must be express and informed, with limited exceptions; no general legitimate-interest basis `[memory]`. EU adequacy retained. Transfers to non-adequate countries (including the US) need model clauses or consent `[memory]`.
- Reform: comprehensive bill reintroduced in the Chamber of Deputies on 16 July 2026 (expediente 3397-D-2026), with wider territorial scope; not enacted (https://allende.com/privacidad-y-ciberseguridad/se-reintroduce-en-el-congreso-el-proyecto-de-reforma-integral-del-regimen-argentino-de-proteccion-de-datos-personales-08-12-2026/).
- No cookie-specific guidance found. Low enforcement, small fines. Practical: Spanish notice + consent banner is the safe reading; many sites run notice-only.

### 1.8 Colombia

- Law 1581/2012, regulator SIC. Authorisation must be **prior, express and informed**; silence is not consent; no legitimate-interest basis `[memory]`. No cookie-specific law, but cookies that collect personal data fall under Law 1581 (https://www.asuntoslegales.com.co/consumidor/conozca-los-aspectos-legales-que-debe-tener-en-cuenta-al-usar-cookies-en-sitios-web-3375211).
- **Reach.** SIC has asserted jurisdiction over foreign platforms on the theory that cookies use "means" located in Colombia `[memory]`.
- **Transfers.** SIC's adequate-country list has included the United States `[memory]` `[verify]`, which makes US vendor transfers easier than elsewhere in the region.
- Reform bill to amend Law 1581 filed 2025-2026; status not confirmed `[verify]`. SIC is an active regulator (orders against big tech, shutdown order for World/Tools for Humanity).

### 1.9 Peru

- Law 29733 with new Regulation DS 016-2024-JUS, in force ~30 March 2025; regulator ANPD (Ministry of Justice). New regulation adds extraterritorial reach (offering to or monitoring people in Peru), breach notification, phased DPO duty, and online identifiers as personal data `[verify]` exact dates.
- Consent: prior, informed, express, unequivocal. **The authority has sanctioned cookie use without valid consent** (RD 2134-2021: profiling/ad cookies; RD 3577-2022: 3 UIT fine) (https://cdn.www.gob.pe/uploads/document/file/4113192/RD%203577-2022.pdf.pdf). Fines up to 100 UIT (about S/ 550,000); roughly 760 inspections in 2025.
- Practical: opt-in banner in Spanish, cookie policy, cross-border flow disclosure. Small fines but real, regular enforcement.

### 1.10 Uruguay

- Law 18.331, regulator URCDP; EU adequacy. Extraterritorial since 2020 for offering goods/services to, or profiling, residents `[memory]`. Consent must be free, prior, express and documented (URCDP materials). URCDP has issued cookie/profile guidance, not located today `[verify]`. Low enforcement. Treat as opt-in.

---

## 2. Asia-Pacific

### 2.1 Australia (deep dive)

- **Law / regulator.** Privacy Act 1988 and Australian Privacy Principles (APPs), OAIC. Spam Act 2003, ACMA.
- **Reach.** Applies to foreign organisations that "carry on business in Australia" (the separate requirement to collect in Australia was removed in 2022) `[memory]`. Small business exemption (turnover up to A$3M) still exists, with exceptions such as health service providers and data traders.
- **Consent model.** **No cookie consent rule.** Obligations are notice (APP 1 policy, APP 5 collection notice), collection only where reasonably necessary by fair means (APP 3), **consent for sensitive information** (APP 3.3), use/disclosure limits (APP 6), direct marketing opt-out and consent for sensitive data (APP 7), cross-border accountability (APP 8).
- **Regulator guidance.** OAIC tracking-pixel guidance (Nov 2024) (https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/organisations/tracking-pixels-and-privacy-obligations).
- **Enforcement on tracking: real as of 2026.** Determinations dated 11 June 2026 (published 24 June) found **Medmate and Monash IVF breached APPs 3.3, 5.1 and 7.1** by sending health information to Meta and others through pixels. Deploying a pixel counts as the site's own "collection" even though the vendor stores the data. An OAIC sweep of 50 health sites found 96% used tracking tech and 77% of pixel users did not mention pixels in their privacy policy (https://www.oaic.gov.au/news/media-centre/privacy-commissioner-finds-privacy-breaches-in-third-party-tracking-pixel-investigation). OAIC also ran its first privacy-policy compliance sweep (about 60 entities) in January 2026 using new infringement-notice powers; results not found `[verify]`.
- **Analytics vs ads.** Analytics: notice-only if not sensitive. Ad pixels: lawful with notice and opt-out for ordinary data; **opt-in before any pixel fires on pages revealing health or other sensitive information.**
- **2024 tranche 1 (Privacy and Other Legislation Amendment Act 2024).** Statutory tort for serious invasions of privacy (commenced 10 June 2025 `[memory]`); tiered civil penalties and infringement notices; Children's Online Privacy Code (OAIC must register by **10 December 2026**; draft released 31 March 2026; a transition period is expected) (https://www.minterellison.com/articles/oaics-childrens-online-privacy-code-what-to-expect); automated-decision disclosures in privacy policies (APP 1.7-1.9) from **10 December 2026**.
- **Tranche 2.** Exposure draft *Privacy Amendment (Personal Data Protection) Bill 2026* released 31 Aug 2026, consultation closed 18 Sept 2026; includes a "fair and reasonable" test and a broad definition of direct marketing covering targeting; government aims to introduce it before year-end; **not yet introduced when checked** (https://www.hsfkramer.com/insights/2026-09/the-draft-tranche-2-privacy-act-reforms-whats-there-whats-new-and-whats-missing). Fate of the small business exemption and any targeting opt-out not confirmed `[verify]`.
- **Children.** Social media minimum age (16) in force 10 Dec 2025 `[memory]`; children's code pending as above.
- **Transfers.** APP 8: take reasonable steps (contract) and remain accountable for the overseas recipient; disclose likely overseas countries in the policy.
- **Rights.** Access and correction; opt out of direct marketing; complaint to OAIC. No erasure right yet.
- **Penalties.** Serious interference: up to the greater of A$50M, three times the benefit, or 30% of turnover. Spam Act: consent, sender identification, working unsubscribe; ACMA issues frequent seven-figure penalties `[memory]`.

### 2.2 New Zealand

- Privacy Act 2020, Privacy Commissioner. Applies to overseas agencies carrying on business in NZ. **No consent requirement for cookies**; notice-based (IPP 3), plus new **IPP 3A** (notify people when their data is collected indirectly) from **1 May 2026** (https://www.privacy.org.nz/resources-and-learning/a-z-topics/ipp3a/). IPP 3A is relevant where you receive audience or enrichment data from third parties.
- IPP 12: reasonable belief of comparable safeguards or contract for overseas disclosure; using a vendor purely as a processor is not a "disclosure" `[memory]`. Unsolicited Electronic Messages Act 2007 for email/SMS. Fines are small (NZ$10,000 scale). Low enforcement on tracking. Notice only.

### 2.3 Japan

- **Law / regulator.** APPI, Personal Information Protection Commission (PPC). Telecommunications Business Act (TBA), Ministry of Internal Affairs and Communications (MIC).
- **Reach.** APPI applies to foreign operators handling data of people in Japan in connection with supplying goods/services there. TBA rule applies to covered services offered to users in Japan, including by foreign operators (https://www.nishimura.com/sites/default/files/newsletters/file/data_protection_230512_en.pdf).
- **Cookie rule: TBA "external transmission" rule (in force 16 June 2023).** Covered operators that cause a user's device to send user information to a third party (analytics tags, ad pixels, SDKs) must do one of: **notify or make readily accessible** (the usual route), obtain consent, or offer opt-out. Disclosure must list, per tag: what information is sent, the recipient's name, and the purpose (https://insightplus.bakermckenzie.com/bm/technology-media-telecommunications_1/japans-new-cookie-regulations-start-june-2023_1). Covered: messaging, social, search, and content/information-providing sites and apps (news, media, blogs platforms); a plain corporate or own-goods e-commerce site is generally outside scope `[memory]`. No banner required; a public "external transmission" page is the standard fix.
- **APPI.** Cookies alone are usually "personally referable information", not personal information; when a recipient will link them to an identified person, the provider must confirm the recipient has consent (Art. 31). Sensitive ("special care-required") data needs consent. Transfers to third parties abroad need consent with information about the destination regime, or an equivalent-standards arrangement; entrustment to a vendor still triggers foreign-transfer rules `[memory]`.
- **2026 amendment.** Act No. 56 of 2026 passed 10 July 2026, promulgated 17 July 2026: administrative surcharge regime; **under-16s: consent/notice via legal representative**, child's best interests; new biometric category; "contactable personal related information"; broader consent exceptions. Criminal penalty changes effective 17 Jan 2027; main reforms on a Cabinet Order date no later than 17 July 2028 (https://www.aoshearman.com/en/insights/ao-shearman-on-data/amendments-to-the-act-on-the-protection-of-personal-information-promulgated).
- **Enforcement.** Guidance and administrative advice; low on cookies. Japanese-language disclosure expected.

### 2.4 South Korea

- **Law / regulator.** PIPA, Personal Information Protection Commission (PIPC).
- **Reach.** Applies to foreign operators serving Korean users; larger ones must appoint a domestic representative `[memory]`.
- **Cookies.** The privacy policy must disclose installation and operation of automatic collection devices (cookies) and how to refuse them `[memory]`. That is notice + refusal for ordinary cookies. **Collecting behavioural data across third-party sites/apps for personalised ads requires clear opt-in consent**, and the obligation has been enforced mainly against the ad platform.
- **Guidance.** PIPC "Policy Direction for the Protection of Online Behavioral Data Used in Targeted Advertising" (31 Jan 2024): disclose behavioural-data collection, provide a refusal control, ad-info icon, guardian consent before targeting under-14s using identifiable data (https://www.mondaq.com/advertising-marketing--branding/1463398/pipc-announces-policy-direction-for-the-protection-of--online-behavioral-data-used-in-targeted-advertising). A finalised comprehensive guide was expected in 2025; publication not confirmed `[verify]`.
- **Enforcement: high.** Google and Meta fined about KRW 100 billion combined (Sept 2022) for behavioural-data collection without valid consent. **TikTok fined KRW 10.3 billion (July 2026)** for tracking over 9 million users across other sites/apps through its Pixel and Events SDK with consent bundled into service terms (https://www.koreajoongangdaily.com/business/tiktok-gets-clocked-with-103-billion-won-fine-over-user-tracking/12788082).
- **2026 amendment.** Passed 12 Feb 2026, promulgated 10 March 2026, effective 11 Sept 2026: surcharge ceiling raised from 3% to **10% of total revenue** for serious or repeat violations; CEO accountability; mandatory certification for large controllers (https://www.hunton.com/privacy-and-cybersecurity-law-blog/south-korea-amends-privacy-law-to-authorize-fines-of-up-to-10-of-total-revenue).
- **Children.** Under 14: legal guardian consent. **Transfers:** consent, or disclosure-based exceptions for outsourcing needed to perform the contract; PIPC can order suspension `[memory]`. Korean-language notice in a prescribed, itemised format; separate consents for optional marketing items.

### 2.5 China (mainland)

- **Law / regulator.** PIPL, Cybersecurity Law (amended, effective 1 Jan 2026), Data Security Law, Network Data Security Management Regulations (1 Jan 2025). Cyberspace Administration of China (CAC), plus MIIT, MPS, SAMR.
- **Reach.** PIPL Art. 3: applies to processing outside China to provide products/services to people in China or to analyse their behaviour. Foreign handlers must appoint a representative in China and file it (Art. 53) `[memory]`.
- **Consent model.** Consent is the main basis; **no legitimate-interest basis**. **Separate consent** for sensitive data, for providing data to another handler, for public disclosure, and for cross-border transfer. Personalised marketing by automated decision-making must offer a non-personalised option or an easy refusal (Art. 24). Bundled consent is not accepted. Result: opt-in, with a specific toggle for personalisation.
- **Children.** Under 14 is sensitive data; parental consent and a dedicated policy.
- **Transfers.** Thresholds under the March 2024 provisions `[memory]`: non-sensitive data of fewer than 100,000 people per year is exempt; 100,000 to 1 million (or fewer than 10,000 sensitive) needs a filed standard contract or certification; above that, a CAC security assessment. **Certification Measures effective 1 Jan 2026** complete the certification route (https://www.arnoldporter.com/en/perspectives/advisories/2026/02/china-data-privacy-and-cybersecurity-2025-year-in-review). Separate consent plus an impact assessment are needed regardless of volume.
- **Practical.** Google and Meta endpoints are blocked, so a China-facing site needs a different tag set anyway. Chinese-language policy. Compliance audits required since 1 May 2025 `[memory]`.
- **Penalties.** Up to RMB 50M or 5% of prior-year turnover; enforcement concentrates on apps and domestic platforms; foreign marketing sites are low priority but exposed.

### 2.6 India

- **Law / regulator.** Digital Personal Data Protection Act 2023; DPDP Rules 2025 notified 13-14 Nov 2025 (sources differ by one day; check the Gazette). Data Protection Board of India.
- **Phasing** (https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/):
  - Immediately (Nov 2025): Board set-up and definitions (Rules 1, 2, 17-21).
  - **~13 Nov 2026:** consent manager registration framework (Rule 4). Consent managers must be India-incorporated with net worth of at least INR 2 crore.
  - **~13 May 2027:** all substantive duties (notice, consent, security, breach notice, children, rights, significant data fiduciaries; Rules 3, 5-16, 22, 23).
  - Until then the IT Act s. 43A and 2011 SPDI Rules remain the operative baseline `[memory]`.
- **Reach.** Applies to processing outside India connected with offering goods/services to people in India.
- **Consent model.** Consent (free, specific, informed, unconditional, unambiguous, clear affirmative action) or a short list of "legitimate uses". **No legitimate-interest or contract basis**, so analytics and advertising on identifiable data need opt-in. Standalone itemised notice; option to read it in English or any of 22 scheduled languages; withdrawal as easy as giving consent.
- **Children (under 18).** Verifiable parental consent; **no tracking, behavioural monitoring or targeted advertising directed at children**; narrow exemptions for listed classes and purposes (Fourth Schedule). Penalty for children's breaches up to INR 200 crore.
- **Transfers.** Permitted except to countries the government restricts by notification; additional conditions may apply to significant data fiduciaries `[verify]`. No blacklist found as of this check.
- **Rights.** Access summary, correction, erasure, grievance redress, nomination.
- **Penalties.** Up to INR 250 crore per breach category. No enforcement yet; Board is being stood up.
- **Build guidance.** Ship an opt-in banner with age gating now; plan consent-manager interoperability for late 2026-2027.

### 2.7 Singapore

- PDPA 2012, PDPC. Applies to organisations collecting data in Singapore, including from overseas.
- **Cookies.** PDPC Advisory Guidelines on Selected Topics, online activities chapter (revised May 2024): no consent needed for cookies that collect no personal data; consent can be deemed for cookies needed for activity the user clearly requested; **behavioural advertising using personal data needs consent**; pre-ticked boxes are not valid (https://pdpc.gov.sg/-/media/files/pdpc/pdf-files/advisory-guidelines/ag-on-selected-topics/advisory-guidelines-on-the-pdpa-for-selected-topics-(revised-may-2024).pdf). Deemed consent by notification, legitimate-interests and business-improvement exceptions (2021) support first-party analytics, but not marketing messages `[memory]`.
- **Children.** PDPC children's guidelines (March 2024): under 13 needs parental consent; heightened protection for services likely accessed by children.
- **Transfers.** Contractual clauses or equivalent ensuring comparable protection. **Marketing:** Do Not Call registry, Spam Control Act. **Penalties:** up to S$1M or 10% of Singapore turnover; enforcement is mostly breach/security cases. Banner is optional; notice plus an opt-out for ad tracking is the usual minimum.

### 2.8 Hong Kong

- PDPO (Cap. 486), PCPD. No extraterritorial clause; applies to data users controlling processing in or from Hong Kong `[memory]`.
- No consent rule for cookies. PCPD's online behavioural tracking leaflet recommends notice, what is collected, third parties, and an opt-out `[memory]`. Direct marketing using personal data requires notice and consent (an indication of no objection counts) under Part 6A, with criminal penalties.
- Reform (mandatory breach notification, administrative fines) still not enacted as of 2026 (https://www.tannerdewitt.com/insight-and-news/looking-back-looking-forward-highlights-and-prospects-in-hong-kong-data-privacy-regulation-2/). Cross-border transfer section (s. 33) has never been brought into force. Notice only.

### 2.9 Taiwan

- PDPA; regulator in transition. Amendments promulgated 11 Nov 2025 create an independent Personal Data Protection Commission, breach notification and DPO-type duties, but **the effective date had not been set and the Commission was still a preparatory office as of March 2026** (https://www.dlapiperdataprotection.com/index.html?c=TW&t=law) `[verify]` current status.
- Applies to collection of Taiwanese nationals' data from abroad `[memory]`. Notice duty (Art. 8) plus a lawful basis (consent, contract, public data, etc.); marketing must offer a free opt-out at first contact. No cookie guidance. Low enforcement. Notice + opt-out.

### 2.10 Thailand

- PDPA 2019 (fully effective 1 June 2022), PDPC. Extraterritorial: offering goods/services to, or monitoring, people in Thailand.
- Bases include consent and legitimate interest. No cookie-specific rule found from the PDPC `[verify]`; market practice is a GDPR-style opt-in banner in Thai. Children: under 10 needs parental consent; older minors partly `[memory]`.
- Transfers: adequacy or safeguards under 2023 notifications (effective March 2024) `[memory]`.
- **Enforcement rising:** THB 7M fine in 2024; THB 21.5M in fines in August 2025 alone; individual fines THB 50,000 to 2M (https://www.tilleke.com/insights/more-than-a-warning-eight-serious-fines-imposed-in-thai-data-protection-cases). Cases are about security, lawful basis and DPO failures, not banners. New guidelines consulted on in March-April 2026.

### 2.11 Vietnam

- **Law.** Personal Data Protection Law 91/2025/QH15, **in force 1 Jan 2026**; Decree 356/2025 (31 Dec 2025) replaces Decree 13/2023. Regulator: Ministry of Public Security (A05) (https://fpf.org/blog/fpf-releases-updated-issue-brief-on-vietnams-law-on-protection-of-personal-data-and-the-law-on-data/).
- **Reach.** Foreign entities processing data of Vietnamese citizens are covered.
- **Consent.** Explicit, specific, per-purpose; silence or default settings are not consent; no general legitimate-interest basis. **Advertising use requires clear consent** covering content, method and frequency, with an opt-out (https://www.tilleke.com/insights/vietnams-new-personal-data-protection-law-a-closer-look/82/). Treat as opt-in for analytics and ads.
- **Transfers.** Storing Vietnam-collected data on foreign servers or foreign cloud counts as a transfer; a transfer impact assessment dossier must be filed with the Ministry. Small enterprises and start-ups get a five-year exemption from DPO/DPIA/TIA filing duties.
- **Penalties.** Up to 5% of prior-year revenue for cross-border violations; up to VND 3 billion for other violations; 10x revenue gained for data trading. Vietnamese-language notice. Enforcement record under the new law is thin.

### 2.12 Indonesia

- PDP Law 27/2022 (full compliance since Oct 2024). **Implementing regulation GR 33/2026 issued 16 July 2026, effective 16 Jan 2027.** The PDP Authority had still not been established as of mid-2026 (https://www.pwc.com/id/en/pwc-publications/services-publications/digital-publications/government-regulation-33-2026-personal-data-protection.html).
- Extraterritorial. Bases include explicit consent and legitimate interest; children and "specific" (sensitive) data protected; transfers need adequacy, safeguards or consent. Fines up to 2% of annual revenue, plus criminal provisions. Foreign electronic system operators serving Indonesia must register (PSE rules) or risk blocking `[memory]`. No cookie guidance. Opt-in is the cautious reading; enforcement is low until the authority exists.

### 2.13 Malaysia

- PDPA 2010 as amended by the 2024 Amendment Act, phased 1 Jan, 1 Apr and 1 June 2025: processor security duties, mandatory DPO, breach notification, portability, biometric data as sensitive, higher fines; transfer whitelist replaced by a conditions-based regime with the Cross-Border Transfer Guideline (29 Apr 2025) (https://www.mayerbrown.com/zh-hans/insights/publications/2025/07/from-legislative-reform-to-practical-guidance-key-amendments-to-malaysias-pdpa-and-the-launch-of-cross-border-transfer-guidelines).
- Reach is limited: commercial transactions; controllers established in Malaysia or using equipment there `[memory]`. Consent required but may be implied in many cases; **privacy notice must be in Malay and English**; direct-marketing opt-out right. No cookie guidance found. Low enforcement on tracking. Notice + opt-out in practice.

### 2.14 Philippines

- Data Privacy Act 2012, National Privacy Commission (NPC). Extraterritorial for data of Philippine citizens/residents `[memory]`.
- No cookie-specific circular. NPC Circular 2023-04 (consent) and Advisory 2023-01 (deceptive design patterns): consent must be specific, informed, freely given; manipulative banner design can invalidate consent (https://insightplus.bakermckenzie.com/bm/data-technology/philippines-national-privacy-commission-issues-guidelines-on-deceptive-design-patterns). Legitimate interest is available for non-sensitive data. Administrative fines of 0.5%-3% of gross income, capped at PHP 5M `[memory]`. Medium-low enforcement. Opt-in for ads is the cautious reading.

---

## 3. Middle East and Africa

### 3.1 United Arab Emirates

- **Federal PDPL (Decree-Law 45/2021).** Extraterritorial. Consent-centric, **no legitimate-interest basis**. **Executive regulations still not issued** as of mid-2026, and a new federal AI and data authority is expected to take over the file (https://www.morganlewis.com/pubs/2026/06/uae-establishes-federal-authority-for-artificial-intelligence-and-data). Enforcement is effectively dormant.
- **DIFC (Data Protection Law 5/2020, amended effective 15 July 2025).** GDPR-like; scope now reaches non-DIFC controllers processing data of people who live or work in the DIFC; a direct court claim route was reported but not confirmed today `[verify]` (https://www.twobirds.com/en/insights/2025/united-arab-emirates/difc-enacts-amendments-to-data-protection-law).
- **ADGM (Data Protection Regulations 2021).** GDPR-like.
- No ePrivacy-style cookie rule in any of the three. Practical: opt-in banner if the operator is in DIFC/ADGM or relies on consent; onshore, opt-in is the conservative reading. Arabic/English notice.

### 3.2 Saudi Arabia

- PDPL, in force 14 Sept 2023, enforceable since 14 Sept 2024; regulator SDAIA. Extraterritorial for residents' data.
- Bases include consent and legitimate interest (not for sensitive data). **Direct marketing needs prior consent and an opt-out.** Privacy policy mandatory. Transfer regulation (amended 2024): adequacy list still pending as of June 2026; otherwise standard clauses/BCRs plus a risk assessment.
- **Enforcement is live:** SDAIA reported 48 decisions against violators; fines up to SAR 5M, doubled for repeats (https://www.clydeco.com/en/insights/2026/03/enforcement-of-the-saudi-pdp-law). No cookie-specific decision found. Opt-in for ad tracking is prudent; Arabic notice.

### 3.3 Israel

- Privacy Protection Law 1981; **Amendment 13 in force 14 Aug 2025**: expanded definitions, DPO duty for some, administrative fines, stronger Privacy Protection Authority (PPA). PPA says 2026 enforcement will span many sectors (https://www.gornitzky.com/reducing-the-risk-of-privacy-enforcement-in-israel-client-update-for-international-privacy-day/).
- Consent may be express or implied but must be informed; s. 11 notice at collection. PPA published a position on valid consent (Feb 2026): s. 11 notice is a minimum and does not alone make consent valid (https://www.pearlcohen.com/israeli-privacy-regulator-issues-position-paper-on-valid-consent/). No cookie-specific rule; a vendor claim of 2026 PPA online-tracking guidance is unconfirmed `[verify]`. Email/SMS marketing is opt-in under the Communications Law. EU adequacy retained. Classification: notice + implied consent for analytics, opt-in advisable for ad profiling; debatable.

### 3.4 Turkey

- **Law / regulator.** KVKK (Law 6698), Personal Data Protection Board. Foreign controllers must register in VERBIS and appoint a representative `[memory]`.
- **Cookie guidance.** Board's Cookie Guidelines (June 2022) and decision 2022/229: **explicit consent for everything beyond strictly necessary cookies, including analytics and advertising**; continued browsing is not consent; reject must be as easy as accept `[memory]`. A 2026 principle decision (2026/347, 18 Feb 2026) requires the information notice and the explicit-consent text to be **separate documents**, and automated collection methods such as cookies must be named in the notice.
- **Transfers.** Regime in force since 2024: no adequacy decisions; standard contracts must be **notified to the Board within five business days of signing**; explicit consent only for occasional transfers `[memory]`.
- **Penalties.** 2026 range up to TRY 17.09M (revalued 25.49%) (https://cottgroup.com/en/legislation/item/administrative-fine-amounts-in-kvkk-for-2026). Aug 2026: TRY 250,000 fine for making marketing consent a condition of service. Enforcement is frequent and consent-focused. Turkish-language notice and consent. Email/SMS marketing is opt-in with the IYS registry.

### 3.5 South Africa

- POPIA, Information Regulator. Applies to responsible parties domiciled in SA or using means in SA (arguably includes cookies on SA devices) `[memory]`.
- No cookie rule. Bases include consent and legitimate interest with a right to object; **electronic direct marketing is opt-in (s. 69)**; children are under 18 and need a competent person's consent; special personal information restricted. Transfers (s. 72) need adequate law, binding agreement, or consent.
- 2025 amended regulations (April 2025); CPA Amendment Regulations (15 Apr 2026) add an opt-out registry cleansing duty. Regulator is escalating formal enforcement notices in 2026, mainly on direct marketing and security (https://werksmans.com/the-regulator-is-watching-new-enforcement-signals-for-popia-and-paia-compliance/). Fines up to ZAR 10M. Also audit for a PAIA manual on the site `[memory]`. Classification: notice + opt-out for analytics; opt-in for marketing; debatable.

### 3.6 Nigeria

- Nigeria Data Protection Act 2023; **GAID 2025 effective 19 Sept 2025**; regulator NDPC. Extraterritorial for data subjects in Nigeria.
- **GAID Article 19 is a cookie-specific rule**: consent for cookies and similar tracking tools, with accept and decline options and information on purpose and withdrawal. Sources split on whether strictly necessary cookies are exempt (one says yes if no sensitive data; Templars reads it as all cookies) `[verify]` (https://ndpc.gov.ng/wp-content/uploads/2025/07/NDP-ACT-GAID-2025-MARCH-20TH.pdf).
- Children under 18 need parental consent. Larger controllers register and file annual compliance audit returns. Fines: greater of NGN 10M or 2% of annual gross revenue for major controllers.
- **Enforcement.** US$32.8M penalty on Meta (Feb 2025) for behavioural advertising without consent, later converted into a confidential settlement (consent judgment 3 Nov 2025) that reportedly wrote off most of it (https://www.premiumtimesng.com/news/headlines/873350-exclusive-inside-nigerias-deal-to-write-off-32-8-million-fine-against-meta.html). Opt-in banner.

### 3.7 Kenya

- Data Protection Act 2019, ODPC. Extraterritorial; registration with ODPC required for many controllers. Commercial use of personal data requires express consent or legal authorisation, with opt-out mechanics in the 2021 regulations `[memory]`. Children: parental consent and age verification. Transfers need documented safeguards; sensitive data needs consent.
- No cookie-specific rule from ODPC confirmed `[verify]`. **Enforcement is active at small scale:** cumulatively 357 determinations, 134 enforcement notices, 20 penalty notices; 184 compensation orders announced Jan 2026 (https://www.capitalfm.co.ke/business/2026/01/odpc-issues-184-compensation-orders-to-data-protection-complainants). Penalty ceiling KES 5M or 1% of turnover. Opt-in is the safe reading.

### 3.8 Egypt

- Law 151/2020; Executive Regulations (Decree 816/2025) issued 1 Nov 2025; **one-year grace period ended about 31 Oct - 1 Nov 2026**, so the regime is now enforceable. Regulator: Personal Data Protection Center (PDPC), licensing portal launched Oct 2026; foreign controllers need an authorised local representative to file (https://www.bakermckenzie.com/en/insight/publications/2026/10/egypt-personal-data-protection-law-update).
- Explicit-consent regime; **licences/permits required for processing, cross-border transfers and electronic marketing**; children's data needs guardian consent; criminal penalties. No cookie guidance. This is the hardest MEA jurisdiction for US vendor transfers on paper; enforcement practice is untested. Opt-in.

### 3.9 Others in the region (one line each, `[memory]`)

- Qatar (Law 13/2016), Bahrain (Law 30/2018), Oman (PDPL 2022), Kuwait (CITRA rules), Jordan (PDPL 2023): consent-centric, low enforcement, no cookie guidance.
- Ghana, Rwanda, Uganda, Tanzania, Ethiopia (2024), Mauritius: GDPR-influenced laws with registration duties; cookie enforcement negligible.

---

## 4. Other jurisdictions

- **Russia.** Federal Law 152-FZ, Roskomnadzor. Law 23-FZ changed localisation from a duty into a **prohibition (from 1 July 2025) on recording, systematising or storing Russians' personal data using databases outside Russia at the point of collection**, extended to processors (https://seamless.legal/insights/Toughening_the_requirement_for_localisation_of_personal_data/). Roskomnadzor treats cookie/analytics identifiers as personal data and wrote to site owners in 2025 requiring either a cross-border transfer notification or removal of Google Analytics; commentators disagree on whether GA is banned outright or only unlawful without notification and local primary storage `[verify]`. Consent must not be embedded in other documents `[verify]` exact provision. Fines rose sharply from 30 May 2025 (up to RUB 18M for repeat localisation breaches, turnover-based fines for leaks). Advertising on Meta platforms is prohibited. Practical: for a Russia-facing site use locally hosted analytics, Russian-language consent and policy, and file notifications; many foreign operators simply geo-exclude.
- **Serbia.** 2018 law is a GDPR copy; regulator Poverenik. A new draft law was published 30 July 2026 (consultation to 10 Sept 2026) (https://iapp.org/news/a/serbia-s-draft-personal-data-protection-law-what-changes-are-on-the-table). Electronic Communications Law 2023 is aligned to the EU code; whether it carries an ePrivacy-style cookie consent article was not confirmed `[verify]`. Treat as EU-style opt-in.
- **Ukraine.** 2010 law still in force; GDPR-alignment bill 8153 passed first reading 20 Nov 2024 and was awaiting second reading in 2026. Treat as opt-in if you already run an EU banner.
- **Other EU-candidate and neighbouring states** (Montenegro, North Macedonia, Albania, Moldova, Georgia, Bosnia): GDPR-modelled; apply the EU configuration `[memory]`.
- **Kazakhstan, Belarus, Uzbekistan:** localisation requirements similar in kind to Russia `[memory]` `[verify]`.

---

## A. Summary table

Enforcement reality refers to tracking/consent matters specifically, not data breaches.

| Jurisdiction | Non-essential cookies: consent model | Applies to foreign sites? | Practical banner requirement | Enforcement |
|---|---|---|---|---|
| Canada (federal, AB, BC) | Implied/opt-out for non-sensitive; express for sensitive, children | Yes (connection test) | Notice + opt-out for ads; opt-in on sensitive pages | Med |
| Quebec | Opt-in for identify/locate/profile tech (s. 8.1; scope debated) | Yes (generally) | Opt-in banner, French, reject as easy as accept | Med (no cookie fine found) |
| Brazil | Opt-in for ads; analytics arguable under legitimate interest | Yes | Opt-in banner with reject button, Portuguese | Med |
| Mexico | Tacit consent (opt-out); express for sensitive/financial | Limited/debatable | Cookie notice + disable instructions, Spanish | Low |
| Chile | Weak now; GDPR-like from 1 Dec 2026 or Oct 2027 | Yes (new law) | Plan opt-in banner | Low (none yet) |
| Argentina | Express consent (no cookie guidance) | Limited | Notice or opt-in (debatable) | Low |
| Colombia | Prior express authorisation | Yes (SIC view) | Opt-in banner | Med |
| Peru | Prior express consent; cookie fines exist | Yes (2025 regulation) | Opt-in banner | Med (small fines) |
| Uruguay | Prior express consent | Yes | Opt-in banner | Low |
| Australia | No consent rule; consent for sensitive data | Yes (carrying on business) | Notice; opt-in before pixels on health/sensitive pages | Med, rising (2026 pixel determinations) |
| New Zealand | Notice only | Yes | None; accurate privacy statement | Low |
| Japan | Notice/publication (TBA) or consent or opt-out | Yes | External-transmission disclosure page; no banner | Low |
| South Korea | Disclosure + refusal for cookies; opt-in for third-party behavioural ad data | Yes | Policy disclosure; opt-in for personalised-ad tracking | High |
| China | Opt-in, separate consents | Yes | Opt-in with personalisation toggle; Chinese | Med (apps high) |
| India | Opt-in (fully from May 2027) | Yes | Opt-in banner + age gate; build now | Low (pre-commencement) |
| Singapore | Consent for ad profiling; deemed consent/exceptions otherwise | Yes | Notice + opt-out; optional banner | Low-Med |
| Hong Kong | Notice only (opt-in-ish for direct marketing) | No (generally) | Notice | Low |
| Taiwan | Notice + opt-out | Yes (nationals' data) | Notice | Low |
| Thailand | Consent or legitimate interest; opt-in by practice | Yes | Opt-in banner, Thai | Med, rising |
| Vietnam | Opt-in, explicit | Yes | Opt-in banner, Vietnamese | Low-Med |
| Indonesia | Explicit consent or legitimate interest | Yes | Opt-in (cautious) | Low |
| Malaysia | Consent (may be implied); notice bilingual | Limited | Notice (Malay + English) + opt-out | Low |
| Philippines | Consent or legitimate interest | Yes | Opt-in for ads (cautious) | Low-Med |
| UAE federal | Consent-centric (regs pending) | Yes | Opt-in (cautious) | Low |
| UAE DIFC / ADGM | GDPR-like | DIFC: partly | Opt-in banner | Low-Med |
| Saudi Arabia | Consent or legitimate interest; marketing opt-in | Yes | Opt-in for ads, Arabic | Med |
| Israel | Informed consent, may be implied | Unclear | Notice + opt-out; opt-in for profiling advisable | Med, rising |
| Turkey | Explicit opt-in incl. analytics (guidelines) | Yes (in practice) | Opt-in banner, Turkish, separate notice and consent texts | High |
| South Africa | Legitimate interest + objection; marketing opt-in | Arguable | Notice + opt-out | Med (marketing) |
| Nigeria | Opt-in (GAID Art. 19) | Yes | Accept/decline banner | Med |
| Kenya | Express consent for commercial use | Yes | Opt-in (cautious) | Med (small penalties) |
| Egypt | Explicit consent + licences | Yes | Opt-in | Unknown (enforceable since Nov 2026) |
| Russia | Consent + localisation | Yes | Consent banner, local analytics, RKN filings | High (blocking, fines) |
| Serbia / Ukraine / EU candidates | EU-style | Yes (Serbia) | Reuse EU banner | Low |

---

## B. Practical regimes for geo-rules

**Regime 1: strict prior opt-in (reuse the EU/UK template; block all non-essential tags until consent; equal-weight reject).**
Quebec, Brazil, Turkey, China, India, Vietnam, Thailand, Nigeria, Peru, Colombia, Uruguay, Egypt, Russia, Serbia, Ukraine and other EU-candidate states, UAE (DIFC/ADGM, and onshore by caution), Kenya, Indonesia, Argentina, Chile (once in force).
- *Debatable members:* Brazil (analytics could sit in regime 2 under legitimate interest); Quebec (the s. 9.1 cookie carve-out); Thailand, Indonesia, Kenya (legitimate interest exists, placement is by caution and practice); Argentina (express consent in law, no enforcement); India (not enforceable until May 2027); UAE onshore (no regulations).

**Regime 2: opt-in for advertising/profiling and sensitive data; analytics on notice or opt-out.**
South Korea, Singapore, Saudi Arabia, Philippines, Israel, South Africa, Canada outside Quebec (if you want margin over regime 3).
- Implementation: analytics on by default with disclosure; ad/remarketing tags held until consent; all tags held on sensitive pages (health, finance, children).
- *Debatable:* Korea could be regime 3 for a pure first-party site, but enforcement against pixel-based tracking argues for holding ad tags.

**Regime 3: notice + opt-out (tags may load; visible notice, working "do not track/sell/target" control, honoured immediately).**
Canada federal/Alberta/BC, Mexico, Malaysia, Taiwan, Australia (with a sensitive-page exception that is effectively opt-in).
- *Debatable:* Australia is legally regime 4 for ordinary data, but the 2026 determinations and pending tranche 2 make an opt-out control and pixel disclosure the sensible floor.

**Regime 4: notice only (accurate, specific disclosure; no choice UI required).**
New Zealand, Hong Kong, Japan (with the per-tag external-transmission list for covered services).

**Overlays that cut across all regimes**
- *Minors:* suppress profiling and targeted ads for known or likely under-18s in India and Brazil; under-16 in Japan (from 2027-28) and Australian social platforms; under-14 in Korea, China, Quebec; apply OPC and OAIC children's codes as they land.
- *Sensitive pages:* opt-in everywhere, including regimes 3 and 4.
- *Transfers:* China, Russia, Vietnam, Egypt, Turkey, Saudi Arabia, Indonesia and Quebec need paperwork (filings, clauses, assessments) independent of the banner.
- *Language:* French (Quebec), Portuguese (Brazil), Spanish (LatAm), Turkish, Arabic (KSA, Egypt), Thai, Vietnamese, Korean, Japanese, Chinese, Malay + English (Malaysia).

---

## C. Global strictest-common-denominator vs geo-targeted

**Global strict configuration**
- All non-essential tags blocked until an affirmative choice; accept and reject equally prominent on the first layer; granular categories; no pre-ticked boxes or scroll/continue consent; withdrawal one click from every page; consent logged with timestamp, version and choices.
- Separate toggle for personalised advertising (covers China Art. 24, Korea, India).
- Age gate or age signal that hard-disables ad profiling for minors.
- Sensitive-page rule: no third-party pixels at all on health/finance/children pages unless explicit consent.
- Privacy and cookie policy listing every tag, recipient, purpose, retention and destination country (satisfies Japan's per-tag rule, Quebec s. 8.1, Korea's cookie disclosure, Australian APP 1/5).
- Named privacy contact on the site; rights request channel covering access, correction, deletion, portability, objection, consent withdrawal.
- Translations served by locale.
- Pros: one behaviour to test and audit; survives the laws in flux (Canada C-36, Australia tranche 2, India 2027, Chile); defensible everywhere on consent.
- Cons: analytics and attribution loss in markets where the law does not require it (Australia, NZ, Japan, Hong Kong, most of Canada, Mexico), typically the majority of non-EU traffic for English-language sites; banner fatigue; still does not solve localisation, transfer filings, licences, representatives or registration, which are separate workstreams.

**Geo-targeted configuration**
- Map country (and Quebec by region) to the four regimes above; default unknown locations to regime 1.
- Pros: recovers measurement where opt-out or notice suffices; lets you tailor language and legal text.
- Cons: geo-IP errors (VPNs, travellers, border regions, Quebec vs rest of Canada); several laws attach to residents or citizens, not location (Philippines, Taiwan, Vietnam, India); more states to test; rule drift as laws change; mis-bucketing a debatable country is the main legal risk.

**Recommended middle path**
1. Regime 1 as the default for unknown/unlisted countries and for every "debatable" country.
2. Relax only to regime 3/4 for a short allow-list where the law is settled and enforcement on banners is low: Australia, New Zealand, Japan, Hong Kong, Canada excluding Quebec, Mexico, Malaysia, Taiwan.
3. Apply the sensitive-page and minors overlays globally, regardless of regime.
4. Use server-side or consent-mode signalling so tags degrade rather than fail when consent is absent.
5. Re-review the allow-list on each "things in flux" date below.

---

## Things in flux (re-check dates)

| Item | Status on 2026-11-11 | Next trigger |
|---|---|---|
| Chile Law 21.719 | In force 1 Dec 2026 unless postponement bill 18.623-07 is published first (would move to 15 Oct 2027) | Before 1 Dec 2026 |
| India DPDP Rules | Consent-manager framework commences ~13-14 Nov 2026; substantive duties ~13-14 May 2027 | Nov 2026, May 2027 |
| Australia | Children's Online Privacy Code registration due 10 Dec 2026; APP 1.7-1.9 ADM disclosures from 10 Dec 2026; tranche 2 bill expected in Parliament late 2026 | Dec 2026 |
| Canada Bill C-36 (PPCDA) | First reading 15 June 2026; no further stage confirmed | Parliamentary calendar |
| Canada OPC Children's Privacy Code | Published 20 Oct 2026 (guidance) | Enforcement use |
| Indonesia GR 33/2026 | Effective 16 Jan 2027; authority not yet established | Jan 2027 |
| Japan APPI amendment | Criminal provisions 17 Jan 2027; main reforms by 17 July 2028; subordinate rules pending | 2027-2028 |
| Korea PIPA amendment | In force 11 Sept 2026 (10% surcharge); behavioural-advertising guide status unconfirmed | Ongoing |
| Egypt PDPL | Grace period ended ~31 Oct 2026; licensing portal live | First enforcement |
| Taiwan PDPA amendments | Promulgated Nov 2025; effective date not set | Executive Yuan order |
| UAE federal PDPL | Executive regulations still unissued; new authority forming | Unknown |
| Brazil | ANPD cookie guide revision on agenda; ECA Digital guidance due by Dec 2026 | Dec 2026 |
| Argentina, Colombia, Serbia, Ukraine, Alberta | Reform bills or drafts pending | Unknown |
| Hong Kong PDPO | Breach-notification/fines reform still not introduced | Unknown |
| Russia | Position on foreign analytics contested; pressure measures against Google in 2026 | Ongoing |

## Items not verified against a primary source

- Any CAI (Quebec) penalty or formal investigation specifically on cookies; the authoritative reading of s. 8.1 vs s. 9.1.
- Exact notification date of India's DPDP Rules (13 vs 14 Nov 2025) and therefore the exact phase dates.
- Whether Nigeria's GAID Art. 19 exempts strictly necessary cookies.
- Whether Korea's PIPC issued its final personalised-advertising guide.
- Existence and content of PPA (Israel) online-tracking guidance; URCDP (Uruguay) cookie guide; any PDPC (Thailand) or ODPC (Kenya) cookie-specific guidance.
- DIFC 2025 private right of action; EU-Brazil adequacy date; Colombia's treatment of the US as adequate; Serbia's cookie article.
- Mexico: status of a new reglamento and the reported July 2026 SABG fine.
- Whether Australia's tranche 2 bill has been introduced, and results of the OAIC January 2026 sweep.
- Whether Google Analytics is prohibited outright in Russia or only without notification and local-first storage.
- All items tagged `[memory]` were not re-checked on the verification date.
