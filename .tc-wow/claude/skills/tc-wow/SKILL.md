---
name: tc-wow
description: Initialize or update git submodules in the target repository. Automatically detects submodule status and runs the appropriate npm script (submodule:init or submodule:update). Use when user wants to setup project, init submodules, update submodules, sync tc-wow, or run initial setup.
---

# TC WoW Sync Skill

Initialize or update git submodules in the target repository.

## Step 1: Determine Target Directory

- If path provided in arguments, use that path
- Otherwise, use the current working directory

## Step 2: Check Submodule Status

Check if submodules are already initialized:

```bash
git submodule status
```

Interpret the output:
- Lines starting with `-` → submodule is **not initialized** → proceed to Step 3a
- Lines starting with ` ` (space) or `+` → submodule is **initialized** → proceed to Step 3b
- Empty output → no submodules defined in this repository → inform user

## Step 3a: Initialize Submodules

If submodules are not initialized, run:

```bash
source ~/.zshrc 2>/dev/null || source ~/.bashrc 2>/dev/null; npm run submodule:init
```

Inform the user: "Initializing submodules..."

## Step 3b: Update Submodules

If submodules are already initialized, run:

```bash
source ~/.zshrc 2>/dev/null || source ~/.bashrc 2>/dev/null; npm run submodule:update
```

Inform the user: "Updating submodules..."

## Step 4: Symlink Agents

After submodules are initialized or updated, symlink agents from `.tc-wow/claude/agents/` into `.claude/agents/` so Claude Code can use them.

```bash
mkdir -p .claude/agents
cd .claude/agents
for f in ../../.tc-wow/claude/agents/*.md; do
  [ -f "$f" ] && ln -sf "$f" "$(basename "$f")"
done
cd ../..
```

Report what was linked:

```bash
ls -la .claude/agents/
```

Inform the user: "Agents symlinked from .tc-wow — [N] agents available."

If `.tc-wow/claude/agents/` doesn't exist or is empty, skip this step silently.

## If It Fails

If the command fails or scripts don't exist, inform the user:

```
Unable to run submodule scripts. Please check:
- package.json contains submodule:init and submodule:update scripts
- You are in a git repository with submodules defined in .gitmodules
- If "npm: command not found", the shell profile needs to be sourced
```

## Usage

```
/tc-wow                    # Run in current directory
/tc-wow /path/to/repo      # Run in specified directory
```
