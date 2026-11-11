# cookie-privacy-compliance

A skill for Claude Code and Codex that audits, fixes and verifies cookie, tracking and privacy compliance on any website (WordPress, WooCommerce, Shopify, Next.js, static), for any target market: EU/EEA, UK, Switzerland, US state laws, Canada, Brazil, Asia-Pacific and the rest of the world.

It covers the whole job: scoping which laws apply, scanning the live site in a real browser, diagnosing a consent tool that is installed but not gating anything, implementing the fix, and proving it works.

## Install

The repository is public, so no GitHub login is needed, only `git`. Paste this into Claude Code or Codex:

```text
Install the cookie-privacy-compliance skill for me:
1. If ~/.agents/repos/cookie-privacy-compliance-skill does not exist, run:
   git clone https://github.com/maxburst/cookie-privacy-compliance-skill.git ~/.agents/repos/cookie-privacy-compliance-skill
2. Run: ~/.agents/repos/cookie-privacy-compliance-skill/install.sh --update
3. Show me the script's output and tell me whether the skill and the scanner were both installed.
```

Start a new session afterwards. The skill is then available in both agents on that machine.

To update later, paste:

```text
Update the cookie-privacy-compliance skill: run ~/.agents/repos/cookie-privacy-compliance-skill/install.sh --update and show me the output.
```

### What the installer does

- Links `skills/cookie-privacy-compliance` into `~/.agents/skills`, `~/.claude/skills` and `~/.codex/skills` (whichever exist). It links, so a `git pull` updates every agent at once. It never overwrites a real folder of the same name.
- Sets up the site scanner: `npm install` in the skill's `scripts` folder and a Chromium download through Playwright (about 150 MB, first run only). Needs Node 18 or later. `--no-scanner` skips this; the skill still works but cannot scan sites until it is set up.
- `--uninstall` removes the links and leaves the clone.

### Manual install

```bash
git clone https://github.com/maxburst/cookie-privacy-compliance-skill.git ~/.agents/repos/cookie-privacy-compliance-skill
~/.agents/repos/cookie-privacy-compliance-skill/install.sh
```

### As a Claude Code plugin

The repository is also a plugin marketplace, for people who prefer Claude Code's plugin manager. Inside Claude Code:

```text
/plugin marketplace add maxburst/cookie-privacy-compliance-skill
/plugin install cookie-privacy-compliance@cookie-privacy-compliance
```

This route is Claude Code only and does not set up the scanner; run the two setup commands from the skill's instructions the first time it scans. Use one route or the other, not both, or the skill is listed twice.

## Using it

Ask in plain words. Examples:

- "Audit https://example.com for cookie and privacy compliance. Visitors are mostly US with some Germany and UK. Audit only."
- "This site has CookieYes but GA4 and the Meta pixel still fire before consent. Find out why and fix it. I have wp-admin and SSH."
- "Does this site honour Global Privacy Control? What do we need for California?"
- "Write an implementation and test plan for a WooCommerce store selling to the UK and Germany."

The scanner can also be run by hand:

```bash
cd ~/.agents/repos/cookie-privacy-compliance-skill/skills/cookie-privacy-compliance/scripts
node scan.mjs https://example.com                      # quick look
node scan.mjs https://example.com --coverage types     # every page type in the sitemap
node scan.mjs https://example.com --coverage all       # every sitemap URL (slow)
node scan.mjs --help
```

## Things to know before relying on it

- **Scans describe the country they ran from.** Consent tools change behaviour by visitor location. To see what EU or UK visitors get, run the scanner through a proxy or VPN exit there (`--proxy`).
- **The law references are a starting point.** They were researched on 2026-11-11, carry sources and confidence tags, and parts are marked unverified. Privacy law changes monthly. The skill re-checks points that are uncertain or in flux, and its reports say they are not legal advice.
- **Audits are read-only.** The skill changes a site only in the implementation phase, after agreeing a plan.

## Repository layout

```
skills/cookie-privacy-compliance/
  SKILL.md            workflow: scope, audit, implement, verify
  references/         jurisdictions, three law files, audit playbook, implementation guide,
                      consent signals, consent tools, script blocking, testing, report templates
  scripts/            scan.mjs (browser scanner), classify.mjs (vendor and cookie tables)
  evals/              test tasks used while developing the skill
install.sh            installer for Claude Code and Codex
.claude-plugin/       plugin and marketplace manifests for Claude Code
```

## Contributing

Edit files under `skills/cookie-privacy-compliance/` in your clone; because the skill is linked, your agents use the edited version immediately. Useful contributions: vendors or cookies the scanner left unclassified (`scripts/classify.mjs`), law updates with a source and date, and failure patterns met in real audits. Open a pull request.
