---
title: "Using the Built-in Claude Code Experience"
description: "Work with the Claude Code extension panel, review diffs, use @-mentions, and keyboard shortcuts in Cursor"
---

# Using the Built-in Claude Code Experience

The Claude Code extension gives you a graphical panel inside Cursor where you can have conversations with Claude, review proposed code changes as diffs, and approve or reject edits — all integrated directly into your editor.

## Opening the Claude Code Panel

There are several ways to open Claude Code:

| Method | How |
|--------|-----|
| **Spark icon** (✱) | Click the Spark icon in the editor toolbar (top-right corner). Requires a file to be open |
| **Status bar** | Click **✱ Claude Code** in the bottom-right corner. Works even with no file open |
| **Command palette** | `Ctrl+Shift+P` → type "Claude Code" → select "Open in New Tab" or other options |
| **Keyboard shortcut** | `Ctrl+Esc` toggles focus between the editor and the Claude panel |

## The Basic Workflow

### 1. Send a Prompt

Type a natural language request in the prompt box. Claude can see your project structure, open files, and selected text automatically.

```
Add form validation to the patient intake form — name should be required
and phone number should match Australian format
```

### 2. Review Changes

When Claude wants to edit a file, it shows a **side-by-side diff** comparing the original with the proposed changes. You can:

- **Accept** the edit
- **Reject** the edit
- **Tell Claude what to change** — describe what's wrong and Claude will revise

### 3. Approve Commands

When Claude needs to run a terminal command (tests, builds, git), it shows the command and asks for permission before executing.

## Permission Modes

Click the mode indicator at the bottom of the prompt box to switch between modes:

| Mode | Behaviour |
|------|-----------|
| **Default** | Claude asks permission before each file edit and command |
| **Plan** | Claude describes what it will do and waits for your approval before making any changes |
| **Auto-accept edits** | Claude makes file edits without asking, but still asks before running commands |
| **Bypass permissions** | Claude makes all changes without asking. Use with caution |

**Shortcut:** Press `Shift+Tab` twice to cycle into Plan mode. On Windows, if Tab cycling skips it, use `Alt+M` instead.

Start with **Default** or **Plan** mode while you're learning. You can switch mid-conversation. Plan mode is especially useful for multi-file changes or when working in an unfamiliar codebase — Claude will ask clarifying questions and present a detailed plan before touching any code.

## @-Mentions: Giving Claude Context

Use `@` in the prompt box to reference specific files, folders, or code locations. Claude reads the referenced content and uses it as context.

```
Explain the logic in @src/composables/useAuth.ts

What's the difference between @PatientForm.vue and @PatientFormLegacy.vue?

Refactor @src/components/ to use the new design tokens
```

### Referencing Selected Code

When you select text in the editor, Claude automatically sees your highlighted code. The prompt box footer shows how many lines are selected.

Press `Alt+K` (Windows/Linux) or `Option+K` (Mac) to insert an @-mention with the exact file path and line numbers (e.g., `@auth.ts#5-10`).

### Attaching Files

Hold `Shift` while dragging files into the prompt box to add them as attachments.

### Referencing Terminal Output

Use `@terminal:name` (where `name` is the terminal's title) to share terminal output with Claude — useful for sharing error messages without copy-pasting.

## Keyboard Shortcuts

| Action | Windows/Linux | Mac | Notes |
|--------|---------------|-----|-------|
| Toggle focus (editor ↔ Claude) | `Ctrl+Esc` | `Cmd+Esc` | Main shortcut to jump between coding and Claude |
| Open in new tab | `Ctrl+Shift+Esc` | `Cmd+Shift+Esc` | Opens a separate conversation tab |
| New conversation | `Ctrl+N` | `Cmd+N` | Only when Claude panel is focused |
| Insert @-mention for selection | `Alt+K` | `Option+K` | Only when editor is focused |
| Multi-line input | `Shift+Enter` | `Shift+Enter` | Add a new line without sending |

## The Command Menu

Type `/` in the prompt box to open the command menu. Key built-in options:

- **`/model`** — Switch the AI model for this conversation
- **`/compact`** — Manually compact the conversation to free up context
- **`/clear`** — Reset the conversation (CLAUDE.md context is preserved)
- **`/usage`** — Check your token usage
- **General Config** — Open extension settings
- **Customize** — Access MCP servers, hooks, memory, permissions, and plugins

### Custom Slash Commands

You can create project-specific commands by adding markdown files to `.claude/commands/` in your repository. Each file becomes a slash command named after the file.

For example, creating `.claude/commands/review.md` with instructions for how to review code gives everyone on the team a `/review` command. Common custom commands include `/pr`, `/test`, `/migrate`, and `/deploy`.

## Working with Multiple Conversations

Use **"Claude Code: Open in New Tab"** from the command palette to start additional conversations. Each maintains its own history and context — useful for working on different tasks in parallel.

A small coloured dot on the Spark icon indicates status:
- **Blue** — A permission request is waiting
- **Orange** — Claude finished while the tab was hidden

## Resuming Past Conversations

Click the dropdown at the top of the Claude Code panel to access your conversation history. You can search by keyword or browse by time period (Today, Yesterday, Last 7 days). Click any conversation to resume it with full message history.

## Rewinding with Checkpoints

Hover over any message in the conversation to reveal the rewind button. You get three options:

- **Fork conversation from here** — Start a new branch from this message, keeping code changes intact
- **Rewind code to here** — Revert file changes back to this point, keeping the conversation
- **Fork and rewind** — Start a new branch and revert file changes

This is invaluable when Claude goes down the wrong path — you can rewind without losing the conversation context.

## Positioning the Panel

You can drag the Claude panel to reposition it anywhere in Cursor:

- **Left sidebar** — Alongside Explorer, Search, etc. Use command palette → "Claude Code: Open in sidebar"
- **Right sidebar** (default) — Keeps Claude visible while you code
- **Editor area** — Opens as a tab alongside your files. Use command palette → "Claude Code: Open in New Tab"

To make your position persist, set `claudeCode.preferredLocation` to `sidebar` in settings. If the panel disappears after a restart, re-open it via the command palette or bind a keyboard shortcut to `claude-vscode.sidebar.open` (see [setup guide](/guides/cursor/02-claude-code-setup#step-5-position-the-claude-code-panel) for details).

## Common Workflows

### Bug Fixing

```
I'm seeing "Cannot read property 'name' of undefined" in the console when
I click the save button on the patient form. Can you investigate and fix it?
```

### Adding Features

```
Add a confirmation dialog when the user tries to delete a care plan.
Show the care plan name and ask "Are you sure?" with Cancel and Delete buttons.
Use the existing Dialog component from @app/components/ui/Dialog.vue
```

### Code Review

```
Review the changes in my current git diff and suggest improvements.
Focus on potential bugs and adherence to our coding conventions.
```

### Understanding Code

```
Explain how the authentication middleware works in this project.
Trace the flow from request to authenticated user.
```

### Creating Commits and PRs

```
Commit my changes with a descriptive message

Create a PR for this feature branch
```

## Tips for Getting the Best Results

- **Be specific and direct** — Talk to Claude like you'd brief a senior engineer. _"Add a loading spinner to the submit button in PatientForm.vue that shows during the API call"_ is much better than _"add a spinner somewhere"_
- **Commit before asking for changes** — Always commit your current work before asking Claude to make edits. This gives you a clean rollback point if something goes wrong
- **Always read the diffs** — Don't blindly accept every change. Claude can introduce subtle regressions, especially in complex logic. Review each diff carefully
- **Use Plan mode for big changes** — For multi-file refactors or architectural decisions, switch to Plan mode first so Claude explains its approach before making changes
- **Push back when needed** — If Claude suggests an approach you don't like, say so. Be direct: _"No, don't use a class component. Use a composable instead."_
- **Invest in CLAUDE.md** — A well-crafted `CLAUDE.md` file pays dividends across every session. The more context Claude has about your project's conventions, the better its output

## Extension vs CLI

The Claude Code extension and the CLI share conversation history and settings. Most day-to-day work is best done in the extension panel, but some advanced features are CLI-only:

| Feature | Extension | CLI (Terminal) |
|---------|-----------|----------------|
| Chat and code edits | Yes | Yes |
| Diff review | Visual side-by-side | Text-based |
| @-mentions | Yes | Yes |
| Checkpoints / rewind | Yes | Yes |
| MCP server configuration | No (configure via CLI) | Yes |
| All slash commands | Subset | Full set |
| `!` bash shortcut | No | Yes |

To use the CLI, open the integrated terminal (`` Ctrl+` ``) and run `claude`. You can resume an extension conversation in the CLI with `claude --resume`.

## Further Reading

For deeper coverage of Claude Code capabilities, see the [Claude Code documentation](/ways-of-working/claude-code):

- [What is Claude Code](/ways-of-working/claude-code/01-what-is-claude-code) — Overview and core concepts
- [Models](/ways-of-working/claude-code/03-models) — Model selection and capabilities
- [Permission Modes](/ways-of-working/claude-code/04-permission-modes) — Controlling what Claude can do
- [Context Management](/ways-of-working/claude-code/07-context-management) — Getting the best results
- [CLAUDE.md Configuration](/ways-of-working/claude-code/08-claude-md) — Project-specific rules and conventions
- [Git with Claude](/ways-of-working/claude-code/09-git-with-claude) — Version control workflows
