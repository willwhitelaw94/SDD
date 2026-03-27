---
title: TC Claude Dashboard
description: Track your team's Claude Code usage automatically with the Trilogy Usage Dashboard
order: 1
---

# TC Claude Dashboard

Track your team's Claude Code usage automatically. Once configured, every session syncs to the dashboard.

**Live Dashboard**: [tc-claude.vercel.app](https://tc-claude.vercel.app)

## What It Tracks

- **Token usage** — input, output, cache read, cache write per session
- **Cost estimation** — based on current Anthropic pricing per model
- **Lines of code** — GitHub integration for LOC per developer
- **Leaderboard** — scored by token usage (80%) and lines of code (20%)
- **Working hours** — filter usage to business hours only

## Architecture

- **Next.js 16** App Router with server components
- **Neon Postgres** via Vercel Marketplace (Drizzle ORM)
- **Claude Code hooks** — `Stop`, `SubagentStop`, `SessionEnd` fire the sync script
- **GitHub API** — fetches LOC stats per developer

## How It Works

1. Claude Code hooks fire at the end of every turn/session
2. A sync script reads the session transcript (JSONL) and extracts token counts
3. The script POSTs the data to the dashboard API (`/api/sync`)
4. The dashboard aggregates and displays team-wide stats
