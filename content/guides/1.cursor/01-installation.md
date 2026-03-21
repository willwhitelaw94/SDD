---
title: "Installation & Setup"
description: "Download, install, and configure Cursor for first use"
---

# Installation & Setup

Cursor is a fork of VS Code with AI features built in. If you've used VS Code before, you'll feel right at home — your extensions, themes, and keybindings all carry over.

## Download Cursor

1. Go to [cursor.com](https://www.cursor.com/)
2. Download the installer for your operating system (Windows, macOS, or Linux)
3. Run the installer and follow the prompts

## First Launch

When you first open Cursor, you'll be guided through initial setup:

1. **Sign in or create an account** — You'll need a Cursor account. You can sign up with email or GitHub
2. **Import VS Code settings** — Cursor will offer to import your existing VS Code extensions, themes, keybindings, and settings. Accept this to keep your familiar environment
3. **Choose your AI model** — Cursor supports multiple AI models. For Trilogy Care work, we use **Claude** as our primary model

## Recommended Settings

After installation, configure these settings for the best experience.

### Set Claude as the Default Model

1. Open Settings (`Ctrl+,` on Windows, `Cmd+,` on macOS)
2. Search for **"model"** in the settings search bar
3. Set the default chat and agent model to **Claude Sonnet** (or your preferred Claude model)

### Install Key Extensions

If you didn't import from VS Code during setup, install extensions manually. Cursor supports the full VS Code extension marketplace. Key extensions for TC work:

- **Vue - Official** — Vue/Nuxt development support
- **ESLint** — Linting
- **Tailwind CSS IntelliSense** — Tailwind class autocomplete
- **GitLens** — Enhanced Git integration

### Configure the Terminal Shell

Cursor's integrated terminal is important for running CLI tools. Ensure it uses your preferred shell:

1. Open the command palette (`Ctrl+Shift+P`)
2. Search for **"Terminal: Select Default Profile"**
3. Choose your shell (Git Bash is recommended on Windows)

## Verify Prerequisites

Open the integrated terminal (`` Ctrl+` ``) and verify that your development tools are available:

```bash
# Node.js 18+ is required for Claude Code
node --version

# Git should be configured
git --version
```

If Node.js is not installed, see [Environment Setup](/ways-of-working/claude-code/environment-setup) for instructions.

---

**Next:** [Setting Up Claude Code](/guides/cursor/02-claude-code-setup)
