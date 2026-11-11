# Installing the cookie-privacy-compliance skill

These are instructions for a coding agent (Claude Code or Codex) whose user asked it to install this skill. Follow the steps in order on the user's machine. They also update an existing install.

## Steps

1. If `~/.agents/repos/cookie-privacy-compliance-skill` does not exist, clone the repository there:

   ```bash
   git clone https://github.com/maxburst/cookie-privacy-compliance-skill.git ~/.agents/repos/cookie-privacy-compliance-skill
   ```

2. Run the installer. It pulls the latest version, links the skill into the skill folders of Claude Code and Codex, and sets up the site scanner (Node packages and a Chromium build, about 150 MB on first run):

   ```bash
   ~/.agents/repos/cookie-privacy-compliance-skill/install.sh --update
   ```

3. Show the user the installer's output and say plainly whether the skill was linked and whether the scanner was set up.

## What to tell the user afterwards

- Start a new session; the skill is then available as `cookie-privacy-compliance`.
- It is used automatically for requests about cookie banners, consent tools, GDPR/CCPA compliance or trackers firing before consent, and can be called directly with `/cookie-privacy-compliance`.
- An example to try: "Audit https://example.com for cookie and privacy compliance. Visitors are mostly US with some Germany and UK. Audit only."

## If something goes wrong

- **No Node, or Node older than 18:** the skill is installed and the scanner is skipped. Tell the user to install Node 18 or later and run the installer again.
- **"exists and is not a link":** a real folder with the skill's name is already in a skills directory. Do not delete it; tell the user where it is and let them decide.
- **Clone or pull fails:** report the error. Do not fetch the files another way.

The installer changes nothing outside `~/.agents`, `~/.claude/skills`, `~/.codex/skills` and the clone itself. To remove the skill: `~/.agents/repos/cookie-privacy-compliance-skill/install.sh --uninstall`.
