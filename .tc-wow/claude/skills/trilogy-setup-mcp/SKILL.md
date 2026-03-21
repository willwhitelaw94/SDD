---
name: trilogy-setup-mcp
description: Configure MCP servers and Claude plugins for the project. Use when setting up integrations (Linear, Fireflies, Figma, Herd, Chrome DevTools, PostHog). Triggers on: setup MCP, configure MCP, setup plugins, integration setup.
---

# Trilogy Setup Integrations Skill

Configure MCP servers and Claude plugins for TC Portal. Some integrations are available as both — prefer **plugins** where available (simpler setup, managed by Anthropic).

## Plugins vs MCP Servers

| Approach | Setup | Auth | Best For |
|----------|-------|------|----------|
| **Claude Plugins** | One-click install via Claude settings | Managed OAuth | Cloud services with official plugin support |
| **MCP Servers** | `claude mcp add` command | Manual OAuth/local | Local tools, custom servers, no plugin available |

**Rule of thumb**: If a plugin exists, use it. MCP is for local tools (Boost, Herd, Chrome DevTools) and services without plugins.

## Quick Setup

### Plugins (Cloud Services)

Install via Claude settings or `claude plugin add`:

| Service | Type | Purpose |
|---------|------|---------|
| **Linear** | Plugin | Issues, projects, cycles, teams |
| **Figma** | Plugin | Design screenshots, metadata, code connect |
| **Fireflies** | Plugin | Meeting transcripts + summaries |
| **PostHog** | Plugin | Analytics, feature flags, error tracking |

### MCP Servers (Local Tools)

Run from the `tc-portal` directory:

```bash
# Laravel Boost — database, artisan, tinker, doc search (REQUIRED)
claude mcp add laravel-boost -- php artisan boost:mcp

# Laravel Herd — PHP versions, services, sites (REQUIRED)
claude mcp add herd -- php /Applications/Herd.app/Contents/Resources/herd-mcp.phar

# Chrome DevTools — live browser control, DOM, JS debugging (OPTIONAL)
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

## Execution Flow

### 1. Check Current Configuration

```bash
claude mcp list
```

Also check installed plugins via Claude settings.

### 2. Ask User What They Need

Present the categories above and ask which integrations to install.

### 3. Install

- **Plugins**: Guide user to install via Claude settings UI
- **MCP Servers**: Run the appropriate `claude mcp add` commands

### 4. Post-Install Steps

1. **Restart Claude Code** — type `/mcp` to verify MCP servers are connected
2. **Authenticate** — cloud services will open OAuth in the browser on first use
3. **Verify** — test each integration with a simple operation:
   - Boost: `application-info`
   - Herd: `get_all_php_versions`
   - Linear: `list_teams`
   - Fireflies: `fireflies_get_transcripts`
   - Figma: `whoami`
   - Chrome DevTools: `list_pages`
   - PostHog: search for recent events

## Server Details

### Laravel Boost
- **Transport:** stdio
- **Auth:** None (local)
- **Requires:** PHP, Laravel project with `laravel/mcp` installed

### Laravel Herd
- **Transport:** stdio
- **Auth:** None (local)
- **Requires:** Laravel Herd installed on macOS

### Linear
- **Transport:** stdio (via mcp-remote)
- **Auth:** OAuth 2.0 via browser
- **Provides:** Issues, projects, cycles, teams, labels, comments

### Fireflies
- **Transport:** stdio (via mcp-remote)
- **Auth:** OAuth 2.0 via browser (Google/Microsoft)
- **Provides:** Meeting transcripts, summaries, speaker analysis, search

### Figma
- **Transport:** HTTP
- **Auth:** OAuth 2.0 via browser
- **Provides:** Design screenshots, component metadata, code connect mappings

### Chrome DevTools
- **Transport:** stdio
- **Auth:** None (local)
- **Provides:** Live browser control, DOM inspection, JS execution, network monitoring

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Connection refused | Restart Claude Code, check `/mcp` status |
| OAuth loop | Clear browser cookies for the service domain |
| Linear auth fails | Try `npx -y mcp-remote@latest` (force latest) |
| Boost not starting | Run `php artisan boost:mcp` directly to see errors |
| Herd not found | Verify Herd is installed: `ls /Applications/Herd.app` |
| Figma no tools | Ensure you have a Figma account with file access |
