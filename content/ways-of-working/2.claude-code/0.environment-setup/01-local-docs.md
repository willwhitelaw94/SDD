---
title: Local Docs & Tools
description: Set up TC Docs and TC WoW locally for documentation and development workflows
---

Get the TC documentation site and shared development toolkit running locally.

---

## What You're Installing

| Submodule   | Purpose                                            | Location    |
| ----------- | -------------------------------------------------- | ----------- |
| **tc-docs** | Documentation site (Nuxt-based)                    | `.tc-docs/` |
| **tc-wow**  | Ways of Working toolkit (skills, templates, gates) | `.tc-wow/`  |

Both are git submodules that live inside your `tc-portal` repository.

---

## Quick Start

From the `tc-portal` root directory:

```bash
# Initialize submodules and checkout to recorded commit
npm run submodule:update
```

This checks out both submodules to the commit SHA recorded in tc-portal (safe, no pointer drift).

::callout{type="info"}
**After initial setup, submodules stay in sync automatically.** Lefthook's post-merge hook detects pointer changes on `git pull` and runs `git submodule update --init` for you. CI syncs pointers to latest `main` every 6 hours.
::

---

## Running Docs Locally

### Development Mode (Hot Reload)

```bash
npm run docs:dev
```

Opens `http://localhost:3000` in your browser with hot reload enabled. Changes to documentation files appear instantly.

### Preview Production Build

```bash
npm run docs:build    # Build the static site
npm run docs:preview  # Serve the built site
```

---

## TC WoW Installation

The `install.sh` script creates symlinks from `.tc-wow/` into your project:

```text
.tc-wow/
├── claude/
│   ├── skills/          → .claude/skills/
│   └── mcp/             → .claude/mcp/
├── specify/
│   ├── scripts/bash/    → .specify/scripts/bash/
│   └── templates/       → .specify/templates/
├── gates/               (referenced by skills, not symlinked)
└── constitution.md      → .specify/memory/constitution.md (copied once)
```

This means:

- Skills like `/trilogy-clarify` and `/speckit-plan` are automatically available
- Templates for specs, plans, and designs are shared across the team
- Updates to tc-wow automatically appear in your project (via symlinks)

---

## Keeping Submodules Updated

### For Developers (Automatic)

You don't need to do anything. Two mechanisms keep submodules fresh:

1. **CI sync** — A cron workflow syncs pointers to latest `main` every 6 hours and commits to `dev`
2. **Post-merge hook** — After `git pull`, Lefthook detects pointer changes and auto-runs `git submodule update --init`

**Need it sooner?** If you just pushed a new skill to tc-wow and can't wait 6 hours, go to **tc-portal → Actions → "Sync submodule pointers"** → **Run workflow**. Once it finishes, `git pull` and you'll have it immediately.

### For Docs Editors / BAs

If you need the absolute latest docs (e.g. to edit content you just pushed), use the sync commands:

```bash
npm run submodule:sync        # Sync both submodules to latest main
npm run submodule:sync:docs   # Sync tc-docs only
npm run submodule:sync:wow    # Sync tc-wow only
```

::callout{type="warning"}
These commands show an interactive warning because they change the submodule pointer. **Do not commit the pointer change** — CI handles that automatically.
::

See [Submodule Sync Guide](/ways-of-working/claude-code/environment-setup/02-submodule-sync) for the full workflow.

---

## Troubleshooting

### "Submodule not initialized"

```bash
git submodule update --init --recursive
```

### "Permission denied" on install.sh

```bash
chmod +x .tc-wow/install.sh
bash .tc-wow/install.sh
```

### Docs Won't Start

```bash
cd .tc-docs
rm -rf node_modules .nuxt
npm install
npm run dev
```

### Skills Not Showing Up

Re-run the install script:

```bash
bash .tc-wow/install.sh
```

Check that symlinks exist:

```bash
ls -la .claude/skills/
```

---

## Available NPM Scripts

| Command                      | Description                                  | Audience   |
| ---------------------------- | -------------------------------------------- | ---------- |
| `npm run submodule:update`   | Checkout submodules to recorded SHA (safe)   | Everyone   |
| `npm run submodule:sync`     | Sync all submodules to latest `main`         | BAs        |
| `npm run submodule:sync:wow` | Sync tc-wow only + run install.sh            | BAs        |
| `npm run submodule:sync:docs`| Sync tc-docs only + npm install              | BAs        |
| `npm run docs:dev`           | Run docs locally with hot reload             | Everyone   |
| `npm run docs:build`         | Build static docs site                       | Everyone   |
| `npm run docs:preview`       | Preview built docs                           | Everyone   |

---

## Next Steps

- [Submodule Sync Guide](/ways-of-working/claude-code/environment-setup/02-submodule-sync) — How submodules are synced, from developer and docs editor perspectives
- [Ready to Go](/ways-of-working/claude-code/environment-setup/00-ready-to-go) — Get your IDE ready
