---
title: "Setting Up Claude Code"
description: "Install the Claude Code extension in Cursor and authenticate"
---

# Setting Up Claude Code

Claude Code provides a native graphical panel inside Cursor where you can chat with Claude, review diffs, accept or reject edits, and run commands — all without leaving the editor. This is the recommended way to use Claude Code at Trilogy Care.

## Prerequisites

Before setting up Claude Code, ensure you have:

- **Node.js 18+** installed ([download here](https://nodejs.org/))
- **Cursor** installed ([previous page](/guides/cursor/01-installation))
- **An Anthropic account** — either a Claude Max subscription or an API key

### Subscription Plans

| Plan | Cost (USD) | Cost (AUD approx.) | Claude Code | Rate Limit |
|------|-----------|---------------------|-------------|------------|
| **Pro** | $20/month | ~$28/month | Yes | ~45 messages per 5-hour window |
| **Max 5x** | $100/month | ~$141/month | Yes | ~225 messages per 5-hour window |
| **Max 20x** | $200/month | ~$283/month | Yes | ~900 messages per 5-hour window |
| **API key** | Pay per token | Pay per token | Yes | Based on tier/spend |

*AUD estimates based on ~1.41 AUD/USD rate as of Feb 2026.*

When you hit a rate limit on a subscription plan, requests pause until the 5-hour window resets — there are no overage fees. Alternatively, an **API key** gives usage-based pricing with no fixed monthly cost.

Check with your team lead for which approach your team uses.

## Step 1: Install Claude Code CLI

The CLI is the foundation — the Cursor extension uses it under the hood. Open Cursor's integrated terminal (`` Ctrl+` ``) and install using one of these methods:

**npm (all platforms):**

```bash
npm install -g @anthropic-ai/claude-code
```

**Homebrew (macOS):**

```bash
brew install --cask claude-code
```

**Shell script (macOS/Linux):**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Verify the installation:

```bash
claude --version
```

You can also run the built-in doctor command to check your setup:

```bash
claude
/doctor
```

## Step 2: Install the Claude Code Extension

There are several approaches. Try them in order — use whichever works for your version of Cursor.

### Option A: Extension Marketplace (Try This First)

1. Open the Extensions panel in Cursor (`Ctrl+Shift+X`)
2. Search for **"Claude Code"** (publisher: Anthropic)
3. Click **Install**
4. Restart Cursor completely (not just reload window)

If the extension appears and works, skip to [Step 3](#step-3-authenticate).

### Option B: Command Line VSIX Install

Cursor doesn't always detect as a compatible IDE, so the extension may not appear in the marketplace. The workaround is to install the VSIX file that ships with the CLI.

**On Windows (Git Bash):**

```bash
cursor --install-extension "$USERPROFILE/.claude/local/node_modules/@anthropic-ai/claude-code/vendor/claude-code.vsix"
```

**On macOS/Linux:**

```bash
cursor --install-extension ~/.claude/local/node_modules/@anthropic-ai/claude-code/vendor/claude-code.vsix
```

**For a specific Cursor profile:**

```bash
cursor --install-extension ~/.claude/local/node_modules/@anthropic-ai/claude-code/vendor/claude-code.vsix --profile "your-profile-name"
```

After installing, **completely quit and restart Cursor**.

### Option C: Drag and Drop

1. Open Cursor's Extensions panel (`Ctrl+Shift+X`)
2. Open a file explorer and navigate to the VSIX file:
   - **Windows:** `%USERPROFILE%\.claude\local\node_modules\@anthropic-ai\claude-code\vendor\claude-code.vsix`
   - **macOS/Linux:** `~/.claude/local/node_modules/@anthropic-ai/claude-code/vendor/claude-code.vsix`
3. Drag the `.vsix` file directly into the Extensions panel
4. Restart Cursor completely

### Option D: Command Palette Install

1. Open the command palette (`Ctrl+Shift+P`)
2. Search for **"Extensions: Install from VSIX..."**
3. Navigate to the VSIX file path listed above and select it
4. Restart Cursor completely

### Windows + WSL Note

If you're running Claude Code inside WSL but Cursor is on Windows, copy the VSIX file from WSL to a Windows-accessible path first, then install it from there.

## Step 3: Authenticate

When you first open the Claude Code panel, you'll be prompted to sign in.

1. Click the **Spark icon** (✱) in the editor toolbar (top-right corner when you have a file open), or click **✱ Claude Code** in the status bar (bottom-right)
2. Follow the authentication flow — this will open a browser to sign in with your Anthropic account

### Using an API Key Instead

If you're using a direct API key rather than account-based auth:

```bash
# Set your API key (add to your shell profile for persistence)
export ANTHROPIC_API_KEY=your-key-here
```

Then in Cursor settings (`Ctrl+,`), search for **"Claude Code"** under Extensions and check **Disable Login Prompt** so it uses the environment variable instead.

## Step 4: Verify It Works

You should now see Claude Code available in Cursor:

1. **Spark icon** (✱) in the editor toolbar when a file is open
2. **✱ Claude Code** in the status bar at the bottom-right
3. **Command palette** (`Ctrl+Shift+P`) — type "Claude Code" to see all available commands

You can also verify the IDE connection from the terminal:

```bash
claude
/ide
```

Cursor should appear as a connected IDE.

Open the panel and send a test prompt:

```
What project am I working in?
```

Claude should analyse your workspace and respond. If this works, you're all set.

## Step 5: Position the Claude Code Panel

By default the Claude Code panel opens on the right. For a better layout, move it into the sidebar so it's always accessible.

### Set the Activity Bar to Vertical

1. Open Settings (`Ctrl+,`)
2. Search for **"activity bar orientation"**
3. Find **Workbench > Appearance > Activity Bar: Orientation**
4. Change from "horizontal" to **"vertical"**

This gives you a traditional vertical icon bar on the left, making room for Claude Code as a sidebar icon.

### Open Claude Code in the Sidebar

1. Open the command palette (`Ctrl+Shift+P`)
2. Type **"Claude Code: Open in sidebar"**
3. The Claude Code panel will appear in the sidebar with a Spark icon

You can also drag the Claude Code icon from wherever it appears into your preferred position — the left sidebar, right sidebar, or even the chat panel area.

### Make It Persist

The panel position can sometimes reset after a Cursor restart. To make it stick:

- Set `claudeCode.preferredLocation` to `sidebar` in your settings
- Optionally, create a keyboard shortcut for quick reopening: bind `Ctrl+Shift+I` (or your preferred shortcut) to the command `claude-vscode.sidebar.open`

## Recommended Extension Settings

Open Cursor settings (`Ctrl+,`) and search for **"Claude Code"** to configure:

| Setting | Recommended | Description |
|---------|-------------|-------------|
| `initialPermissionMode` | `default` | Claude asks before each edit (safest for learning) |
| `preferredLocation` | `sidebar` | Claude opens in the sidebar by default |
| `autosave` | `true` | Auto-save files before Claude reads/writes them |
| `useTerminal` | `false` | Keep the graphical panel (don't switch to terminal mode) |
| `respectGitIgnore` | `true` | Exclude .gitignore patterns from file searches |

## Onboarding Checklist

When you first open the Claude Code panel, a **Learn Claude Code** checklist appears. Work through each item by clicking **Show me** — it's a quick guided tour of the key features. You can dismiss it with the X and re-enable it later by unchecking **Hide Onboarding** in the Claude Code extension settings.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Extension not visible after install | Fully quit and restart Cursor (not just reload window) |
| "No Available IDEs Detected" | Ensure CLI is installed locally, run `/doctor` in Claude Code terminal |
| Global installation issues | Run `/migrate-installer` in Claude Code to convert to local setup |
| Extension breaks after Cursor update | Re-install the VSIX using one of the methods above |
| Spark icon doesn't appear | Open a file first — the icon requires an active editor tab |
| Panel disappears after restart | Set `claudeCode.preferredLocation` to `sidebar`, or bind a shortcut to `claude-vscode.sidebar.open` |
| npm permission errors on macOS/Linux | Run `mkdir ~/.npm-global && npm config set prefix '~/.npm-global'` then add `export PATH=~/.npm-global/bin:$PATH` to your shell profile. Avoid using `sudo npm install` |

---

**Next:** [Using the Built-in Claude Code Experience](/guides/cursor/03-using-claude-code)
