---
title: Developer Setup
description: How to configure Claude Code hooks to sync your usage to the TC Claude dashboard
order: 2
---

# Developer Setup

Track your team's Claude Code usage automatically. Once configured, every session syncs to the dashboard at [tc-claude.vercel.app](https://tc-claude.vercel.app).

## Prerequisites

- **Claude Code** installed and working
- **python3** — check: `python3 --version` (install: `brew install python3` on macOS, `sudo apt install python3` on Linux)
- **curl** — check: `curl --version`
- **Team secret** — get this from your team admin

## Option A: Automated Setup (Recommended)

Clone this repo and run the setup command inside Claude Code:

```bash
git clone <repo-url> TC-Claude && cd TC-Claude
```

Then in Claude Code:

```
/setup-sync YourName the-team-secret
```

Claude handles everything — env vars, script installation, hooks, and verification. Done!

## Option B: Manual Setup

### 1. Clone the repo

```bash
git clone <repo-url> TC-Claude && cd TC-Claude
```

### 2. Add environment variables

Add these to your shell config (`~/.zshrc` on macOS, `~/.bashrc` on Linux):

```bash
export CV_USAGE_SECRET="<team-secret>"
export CV_USAGE_DEV_NAME="<YourName>"
export CV_USAGE_API_URL="https://tc-claude.vercel.app"
```

Then reload:

```bash
source ~/.zshrc   # or ~/.bashrc on Linux
```

### 3. Install the sync script

```bash
cp scripts/sync-session.sh ~/.claude/sync-session.sh
chmod +x ~/.claude/sync-session.sh
```

### 4. Configure Claude Code hooks

Edit `~/.claude/settings.json` and merge the following into the `"hooks"` key. Don't overwrite any existing hooks — add alongside them.

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash $HOME/.claude/sync-session.sh"
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash $HOME/.claude/sync-session.sh"
          }
        ]
      }
    ],
    "SessionEnd": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash $HOME/.claude/sync-session.sh"
          }
        ]
      }
    ]
  }
}
```

**Why three hooks?**
- `Stop` fires after every agent turn — captures usage incrementally
- `SubagentStop` fires when a sub-agent finishes — captures delegated work
- `SessionEnd` fires when the session closes — ensures a final sync
- All are idempotent — the same session data upserts (not duplicates) on every call

### 5. Verify it works

```bash
# Find a recent transcript
TRANSCRIPT=$(ls -t ~/.claude/projects/*/*.jsonl 2>/dev/null | head -1)

# Send a test payload
echo '{"session_id":"setup-test-'$(date +%s)'","transcript_path":"'"$TRANSCRIPT"'","cwd":"'"$(pwd)"'"}' \
  | bash ~/.claude/sync-session.sh

# Wait for background process, then check the log
sleep 3 && tail -5 ~/.claude/sync-session.log
```

Look for `RESPONSE: 200`. If not:

| Response | Fix |
|----------|-----|
| `401` / `403` | Wrong `CV_USAGE_SECRET` — check with your admin |
| `404` | Wrong `CV_USAGE_API_URL` — must be `https://tc-claude.vercel.app` (no trailing slash) |
| Connection error | Check network / VPN |
| `SKIP: missing env vars` | Env vars not exported — run `source ~/.zshrc` and retry |

## Day-to-Day

Zero effort. The hooks fire automatically during and after every Claude Code session across **all projects**, syncing usage in the background. Usage is tracked per-project (derived from your working directory).

Check the log anytime:

```bash
tail -20 ~/.claude/sync-session.log
```

## Linux / WSL Notes

- The sync script's env-var fallback reads `~/.zshrc`. If you use **bash on Linux**, ensure the `CV_USAGE_*` vars are in `~/.bashrc` or `~/.profile`.
- **WSL**: hooks fire inside WSL, not Windows. VS Code Remote + WSL works fine.

## Admin Setup (one-time)

1. Push to GitHub and import as a Vercel project
2. Add **Neon Postgres** via Vercel Marketplace (auto-provisions `DATABASE_URL`)
3. Set `TEAM_SECRET` env var on Vercel (production + preview)
4. Run DB migrations: `pnpm db:push`
5. Share the dashboard URL and team secret with devs

## Local Development

```bash
cp .env.example .env.local  # Add your DATABASE_URL
pnpm install
pnpm db:push               # Push schema to local/dev DB
pnpm dev                    # http://localhost:3000
```
