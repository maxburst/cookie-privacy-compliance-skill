#!/usr/bin/env bash
# Installs (or updates) the cookie-privacy-compliance skill for Claude Code and Codex.
#
# Run it from a clone of this repository:
#   ./install.sh                 link the skill and set up the scanner
#   ./install.sh --update        git pull first, then the same
#   ./install.sh --no-scanner    skip the scanner's Node dependencies and browser download
#   ./install.sh --uninstall     remove the links (the clone stays)
#
# The skill is linked, not copied, so `git pull` in the clone updates every agent at once.
set -euo pipefail

SKILL=cookie-privacy-compliance
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$REPO_DIR/skills/$SKILL"
UPDATE=0; SCANNER=1; UNINSTALL=0
for arg in "$@"; do
  case "$arg" in
    --update) UPDATE=1 ;;
    --no-scanner) SCANNER=0 ;;
    --uninstall) UNINSTALL=1 ;;
    -h|--help) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown option: $arg" >&2; exit 2 ;;
  esac
done

[ -f "$SRC/SKILL.md" ] || { echo "Cannot find $SRC/SKILL.md. Run this from a clone of the repository." >&2; exit 1; }

# Skill folders each agent reads. ~/.agents/skills is the shared convention; Claude Code and
# Codex each have their own as well. Only agents that are present on this machine get a link.
TARGETS=()
[ -d "$HOME/.agents" ] && TARGETS+=("$HOME/.agents/skills")
[ -d "$HOME/.claude" ] && TARGETS+=("$HOME/.claude/skills")
[ -d "$HOME/.codex" ]  && TARGETS+=("$HOME/.codex/skills")
if [ ${#TARGETS[@]} -eq 0 ]; then
  echo "Neither ~/.claude nor ~/.codex exists. Install Claude Code or Codex first, then re-run." >&2; exit 1
fi

if [ "$UNINSTALL" -eq 1 ]; then
  for dir in "${TARGETS[@]}"; do
    link="$dir/$SKILL"
    if [ -L "$link" ]; then rm "$link"; echo "removed $link"; fi
  done
  echo "Uninstalled. The clone at $REPO_DIR was left in place."
  exit 0
fi

if [ "$UPDATE" -eq 1 ]; then
  echo "Updating $REPO_DIR"
  git -C "$REPO_DIR" pull --ff-only
fi

for dir in "${TARGETS[@]}"; do
  mkdir -p "$dir"
  link="$dir/$SKILL"
  if [ -L "$link" ]; then
    # Leave a link alone when it already resolves to this skill (it may go through another link).
    if [ "$(cd "$link" 2>/dev/null && pwd -P)" = "$(cd "$SRC" && pwd -P)" ]; then echo "ok       $link"; continue; fi
    rm "$link"
  elif [ -e "$link" ]; then
    echo "skipped  $link exists and is not a link. Move it away and re-run to install here." >&2
    continue
  fi
  ln -s "$SRC" "$link"
  echo "linked   $link"
done

if [ "$SCANNER" -eq 1 ]; then
  if ! command -v node >/dev/null 2>&1; then
    echo "Node.js is not installed, so the site scanner was not set up. Install Node 18 or later and re-run." >&2
  else
    major="$(node -p 'process.versions.node.split(".")[0]')"
    if [ "$major" -lt 18 ]; then
      echo "Node $major is too old for the scanner (needs 18 or later). The skill is installed; the scanner is not." >&2
    else
      echo "Setting up the scanner (Node packages and a Chromium build; the first run downloads about 150 MB)"
      npm install --prefix "$SRC/scripts" --no-audit --no-fund --silent
      (cd "$SRC/scripts" && npx playwright install chromium >/dev/null)
      echo "scanner ready"
    fi
  fi
fi

version="$(git -C "$REPO_DIR" describe --tags --always 2>/dev/null || echo unknown)"
echo
echo "Installed $SKILL ($version). Start a new Claude Code or Codex session to pick it up."
echo "Try: \"audit https://example.com for cookie and privacy compliance, EU and US visitors\""
