# Report templates

Two readers: the site owner, who needs to know how exposed they are and what to do first, and the implementer, who needs evidence and exact fixes. Write the first part so it stands alone; someone who reads only "Summary" and "What to do first" should come away with the right picture.

Write in the user's language. Plain words for the owner layer: say "the Facebook pixel loads before the visitor chooses" before "ad_storage default granted". Keep legal references to one line each. Put real evidence in the technical layer and nothing vague anywhere.

Save the report as Markdown next to the scan output unless the user asked for another format.

## Audit report

```markdown
# Cookie and privacy compliance audit: <site>

Date: <date> · Prepared for: <owner> · Scope: <hosts audited>

## Summary

<Three to six sentences. Overall position in plain language, the most serious problems,
and whether the visible banner can be trusted. One sentence on what is working.>

**Overall risk:** <Critical / High / Medium / Low> for <audience>, <rating> for <audience>.

| Audience | Rule set applied | Position |
|---|---|---|
| <e.g. Germany, Austria> | Strict opt-in | <one line> |
| <e.g. United States incl. California> | Opt-out + GPC, wiretap exposure | <one line> |

## What to do first

1. <Highest-value fix, in plain words, with who can do it and rough effort.>
2. ...
3. ...

## Scope and method

- Audience and regimes: <the scoping statement agreed with the user>
- Scans: <date, vantage country for each run, scenarios, pages, desktop/mobile>
- Access used: <public site only / admin / tag manager / code / server>
- Not covered: <regions not observed, logged-in areas, server-side events, mobile app, contracts ...>

## Findings

| # | Finding | Affects | Severity | Effort |
|---|---|---|---|---|
| 1 | <short title> | <audience> | Critical | <S/M/L> |
| 2 | ... | | | |

### 1. <Finding title>

- **What we saw:** <observation with evidence: scenario and phase, cookie names, request hosts,
  consent parameters, screenshot file, where the tag is injected>
- **Why it matters:** <the rule, for which audience, one line, with source>
- **Fix:** <specific and located>
- **Effort / dependencies:** <...>

### 2. ...

## The consent tool

<Tool, version, plan, how it is integrated. Diagnosis: which failure modes apply.
Recommendation: repair (what exactly) or replace (with what, why, cost).>

## Tracker inventory

| Vendor | Purpose | Loaded from | Before choice | After reject | After accept | Declared in policy |
|---|---|---|---|---|---|---|
| <Google Analytics 4> | Analytics | <GTM tag "GA4 config"> | yes | yes | yes | yes |

Unidentified cookies or hosts: <list, or "none">

## Policies, links and forms

<Privacy policy, cookie policy, banner text, required links per regime, forms, rights requests,
consent records: what exists, what is missing, what is untrue against the scan.>

## Open questions and limits

<Points that need the owner's input or a legal judgement; anything unsettled in the law that
affects a recommendation; what was simulated or not observed.>

---
This audit reports observed site behaviour against published rules and regulator guidance as of
<date>. It is technical compliance work, not legal advice; points marked for legal judgement
should go to a qualified lawyer in the relevant jurisdiction.
```

Notes on filling it in:

- Lead with the findings that misrepresent what the site does (reject or opt-out not honoured). Owners understand "the button does not work" at once.
- Give each audience its own position. A site can be Low for the US and Critical for France.
- "What to do first" is three to five items, ordered by risk removed per unit of effort.
- State the vantage point of every scan. If a regime was not observed, say so in the summary table rather than in a footnote.
- Keep the tracker inventory complete, including things that are fine. It is the part the owner will reuse.

## Verification report (after implementation)

```markdown
# Verification: <site>

Date: <date> · Design implemented: <A / B / C and the US and Consent Mode choices>

## Result

<Two or three sentences: does the site now behave as designed for each audience, and what remains.>

| Check | <Region 1> | <Region 2> | Evidence |
|---|---|---|---|
| Nothing non-essential before a choice (incl. after mouse and scroll) | pass | n/a | scan-de/summary.md |
| Reject on first layer, equal prominence | pass | pass | screenshot |
| Reject respected on this and later pages | pass | pass | |
| Accept loads the tags; consent signals correct | pass | pass | gcs=G111, gcd=…r… |
| Withdrawal stops tags and clears tracker cookies | pass | pass | |
| Choice stored, not re-asked | pass | pass | cookie <name>, <n> days |
| GPC honoured with no clicks; confirmation shown | n/a | pass | |
| Opt-out link present and effective | n/a | pass | |
| Same result cached and uncached | pass | pass | |
| Mobile viewport | pass | pass | |
| Key page types (product, checkout, thank-you, forms) | pass | not tested | |
| Banner accessibility basics | pass | pass | |
| Cookie policy matches the scan | pass | pass | |

## Before and after

| | Audit | Now |
|---|---|---|
| Non-essential cookies before choice (<region>) | <n> | 0 |
| Tracker vendors contacted before choice | <list> | none |
| After reject | <list> | none |

## Changes made

<Change log: what, where, when. Backups taken and where they are.>

## Still open

<Failed or untested checks with reason and owner. Items for the site owner: legal text approval,
vendor contracts, ad-platform settings, regions to test.>

## Keeping it this way

<How to add a tag correctly. When to re-scan. Plan limits to watch.>
```

Use "pass", "fail" or "not tested" only. A check you could not run is "not tested" with the reason.
