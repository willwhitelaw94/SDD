---
name: trilogy-docs-build
description: Run documentation locally. Default is dev mode (hot-reload). Also supports build+preview. Use when user wants to preview docs, open docs site, or start documentation server.
---

# Trilogy Docs Skill

Run documentation from the target repository's `package.json`.

## Step 1: Determine Target Directory

- If path provided in arguments, use that path
- Otherwise, use the current working directory

## Step 2: Ask the User Which Mode

Ask the user which mode to run. Default is **dev** (recommended for most use cases).

| Mode | Command | Description |
|------|---------|-------------|
| **Dev** (default) | `npm run docs:dev` | Hot-reload dev server — changes reflect instantly |
| **Build + Preview** | `npm run docs:build` then `npm run docs:preview` | Production build then static preview |

## Step 3a: Dev Mode (Default)

Run the dev server in the background:

```bash
source ~/.zshrc 2>/dev/null || source ~/.bashrc 2>/dev/null; cd [target_directory] && npm run docs:dev
```

This starts a hot-reload server (typically at http://localhost:3000).

## Step 3b: Build + Preview Mode

First build, then preview:

```bash
source ~/.zshrc 2>/dev/null || source ~/.bashrc 2>/dev/null; cd [target_directory] && npm run docs:build
```

Wait for the build to complete successfully, then start the preview server:

```bash
source ~/.zshrc 2>/dev/null || source ~/.bashrc 2>/dev/null; cd [target_directory] && npm run docs:preview
```

## If It Fails

If the command fails or scripts don't exist, inform the user:

```
Unable to run docs. Please check:
- tc-docs is added as a submodule and initialized (run: git submodule update --init --recursive)
- If "npm: command not found", the shell profile needs to be sourced or use full npm path
```

If npm commands fail, try using the full path to npm (common locations):
- `/usr/local/bin/npm`
- `~/.volta/bin/npm`
- `~/.nvm/versions/node/*/bin/npm`

## Usage

```
/trilogy-docs-build                    # Run in dev mode (default)
/trilogy-docs-build /path/to/repo      # Run in dev mode at specified directory
```
