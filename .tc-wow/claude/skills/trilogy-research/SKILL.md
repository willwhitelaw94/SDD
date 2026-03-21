---
name: trilogy-research
description: Exploratory research agent that gathers context from multiple sources (Teams, Fireflies, Linear, Web, codebase) and produces a structured research document. Use when starting new epics, building context for ideas, enriching domain docs, or consolidating knowledge across systems.
metadata:
  version: 2.0.0
  type: agent
---

# Trilogy Research Agent

An **agent-based** exploratory research skill that plans research strategy, optionally spawns parallel sub-agents to gather context from multiple sources, and synthesizes findings into actionable documentation.

## Agent Available

For a full autonomous research workflow with parallel source gathering, consider running the **research-agent** instead: it plans strategy, spawns parallel sub-agents across Fireflies/Linear/Web/codebase, and synthesizes findings automatically.

## Overview

This research agent:

- **Plans research strategy** - Asks where to focus research before starting
- **Optionally spawns parallel sub-agents** - For comprehensive research across multiple sources
- **Searches external web sources** - Industry websites, competitor analysis, regulations
- **Synthesizes across sources** - Connects dots between chat decisions, tickets, meetings, and docs
- **Updates domain documentation** - Enriches `.tc-docs/content/features/domains/` with findings

> ⚠️ **Token Usage Warning:** Parallel sub-agents significantly increase token usage. Each agent maintains its own context. For quick research, use sequential search. For comprehensive research where speed matters more than cost, use parallel agents.

## When to Use

Activate this agent when:

- **After `/learn`** - When industry context suggests more research is needed
- **Starting a new epic** - Gather all existing context before writing specs
- **Formulating a new idea** - Research what already exists, related work, stakeholder input
- **Enriching domain docs** - Add business context from meetings and discussions
- **Onboarding to a feature area** - Build comprehensive understanding quickly
- **Consolidating tribal knowledge** - Capture scattered decisions into one document

## Research Sources

| Source | Tool | Best For |
|--------|------|----------|
| **Fireflies** | `mcp__fireflies__*` | Meeting decisions, stakeholder quotes, business rationale |
| **Teams Chats** | `/trilogy-teams-chat` | Decisions, action items, technical discussions |
| **Linear** | `mcp__linear__*` | Requirements, acceptance criteria, issue context |
| **Web Search** | `WebSearch` | Industry research, competitor analysis, regulations |
| **Aged Care Sites** | `WebFetch` | My Aged Care, Support at Home manual, industry news |
| **Codebase** | `Explore` agent | Implementation patterns, technical constraints |
| **TC Docs** | `Read` | Existing domain documentation, context |

## Research Workflow

### Phase 1: Plan Research Strategy

Before starting research, **ask the user** where to focus:

```markdown
## Research Planning

I'll research **[TOPIC]** across our knowledge sources.

**Available Sources:**
1. 🔥 **Fireflies** — Meeting transcripts and decisions
2. 💬 **Teams Chats** — Chat discussions and decisions
3. 📋 **Linear** — Tickets, requirements, linked work
4. 🌐 **Web Search** — Industry research, competitors, regulations
5. 🏥 **Aged Care Sites** — My Aged Care, Support at Home, industry
6. 💻 **Codebase** — Implementation patterns and constraints
7. 📚 **TC Docs** — Existing documentation

**Which sources should I search?** (Select multiple or "all")

⚠️ **Note:** Using 3+ sources with parallel agents will use significantly more tokens.
For quick research, I can search sequentially instead.
```

### Phase 2: Execute Research

Based on user selection, choose approach:

#### Sequential (Token-Efficient)
Search sources one by one, building context as you go. Best for:
- Quick lookups
- When one source may answer the question
- Budget-conscious research

#### Parallel Sub-Agents (Comprehensive)
Spawn multiple agents simultaneously. Best for:
- Comprehensive epic research
- Time-sensitive exploration
- Cross-referencing multiple sources

```
# Parallel agent pattern
Task(subagent_type="Explore", run_in_background=true, prompt="Research [TOPIC] in Fireflies...")
Task(subagent_type="Explore", run_in_background=true, prompt="Research [TOPIC] in Linear...")
Task(subagent_type="Explore", run_in_background=true, prompt="Research [TOPIC] via web search...")
# Wait for all to complete, then consolidate
```

### Phase 2.5: Offer Web Research

After completing the selected research sources, **always ask the user** if they'd like to supplement findings with broader web research — especially if web sources weren't included in the initial selection, or if gaps were identified:

```markdown
## Additional Web Research?

I've gathered findings from [sources searched]. Before I synthesise:

**Would you like me to search the web for additional research articles or resources?**

This could include:
- 📰 Industry articles and publications related to [TOPIC]
- 📊 Case studies or best practices from other providers
- 🏛️ Government or regulatory updates
- 🔬 Academic or research papers
- 🏢 Competitor approaches and market analysis

> This uses WebSearch and WebFetch to find relevant online content beyond our internal sources.
```

If the user says yes:
1. Use `WebSearch` to find relevant articles, publications, and resources
2. Use `WebFetch` to read promising results and extract key insights
3. Add findings to the research document under a **"Web Research — Additional Articles"** section
4. Include source URLs for all references

If the user declines, proceed directly to synthesis.

### Phase 3: Synthesize & Output

After gathering findings:

1. **Consolidate** - Merge findings from all sources
2. **Deduplicate** - Same information from multiple sources
3. **Cross-reference** - Link tickets to chat decisions to meeting notes
4. **Identify gaps** - What questions remain unanswered?
5. **Update domain docs** - Enrich relevant domain documentation

## Sub-Agent Prompts

### Fireflies Research Agent

```
You are researching "[TOPIC]" in Fireflies meeting transcripts.

Use these MCP tools:
- mcp__fireflies__fireflies_search - for keyword search across transcripts
- mcp__fireflies__fireflies_get_transcripts - for listing recent transcripts
- mcp__fireflies__fireflies_get_transcript - for full transcript content
- mcp__fireflies__fireflies_get_summary - for meeting summaries

Search Strategy:
1. Search for topic keywords and related terms
2. Get summaries first (faster), then full transcripts if needed
3. Look for: decisions made, requirements clarified, stakeholder preferences
4. Extract quotes from key stakeholders
5. Note meeting dates and attendees

Return: Key findings with meeting references, stakeholder quotes, decisions made.
```

### Teams Chat Research Agent

```
You are researching "[TOPIC]" in Teams chat history.

Use the /trilogy-teams-chat skill or m365 CLI to:
1. Fetch messages from provided chat URLs
2. Search for decisions, action items, technical discussions
3. Extract stakeholder input and preferences

Analysis Focus:
- Decisions made (look for "decided", "agreed", "let's go with")
- Action items and owners
- Technical trade-offs discussed
- Open questions raised
- Stakeholder quotes

Return: Structured summary of chat findings with dates and participants.
```

### Linear Research Agent

```
You are researching "[TOPIC]" in Linear (our issue tracker).

Use these MCP tools:
- mcp__linear__list_issues - search for related issues
- mcp__linear__get_issue - fetch full issue details
- mcp__linear__list_projects - find related projects
- mcp__linear__list_comments - get discussion context

Search Strategy:
1. Search for topic keywords in issue titles and descriptions
2. Fetch full details for relevant issues
3. Follow links to parent projects and related issues
4. Extract: title, description, status, assignee, comments

Return: Relevant issues with requirements, acceptance criteria, linked work.
```

### Web Research Agent

```
You are researching "[TOPIC]" via web search for industry context.

Use these tools:
- WebSearch - for general industry research
- WebFetch - for specific pages (My Aged Care, competitor sites, etc.)

Research Areas:
1. Industry trends and news
2. Regulatory updates (Support at Home, ACQSC)
3. Competitor analysis (how others solve similar problems)
4. Best practices from aged care sector

Key Sites to Consider:
- My Aged Care (myagedcare.gov.au)
- ACQSC (agedcarequality.gov.au)
- Department of Health
- Aged care industry news

Return: Industry insights, competitor approaches, regulatory context.
```

### Codebase Research Agent

```
You are researching "[TOPIC]" in the TC Portal codebase.

Use Explore agent capabilities to:
1. Search for related file names and patterns
2. Grep for topic keywords in code and comments
3. Identify relevant controllers, models, services, components
4. Check for existing implementations or similar features

Focus Areas:
- app/Http/Controllers/ - for existing endpoints
- app/Models/ - for data structures
- app/Services/ or app/Actions/ - for business logic
- resources/js/Pages/ - for UI components
- database/migrations/ - for schema

Return: Relevant file paths, what they do, technical constraints discovered.
```

## Output Options

### Option A: Research Document

Create `research.md` in epic folder or `.tc-docs/content/initiatives/ADHOC/`:

```markdown
---
title: "[TOPIC] Research Document"
created: YYYY-MM-DD
topic: "[TOPIC]"
sources_searched:
  fireflies: [list of meeting IDs]
  teams: [list of chat IDs]
  linear: [list of issue IDs]
  web: [list of URLs]
  codebase: [list of paths]
---

# [TOPIC] Research Document

## Executive Summary
[2-3 paragraph synthesis of key findings]

## Source Findings

### From Fireflies Meetings
| Meeting | Date | Key Points |
|---------|------|------------|
| ... | ... | ... |

**Decisions from Meetings:**
- [Decision with attendees and date]

**Stakeholder Quotes:**
> "[Quote]" - Name, Meeting Date

### From Teams Discussions
**Key Decisions Made:**
| Decision | Date | Participants |
|----------|------|--------------|
| ... | ... | ... |

### From Linear/Jira
| Issue | Summary | Status | Relevance |
|-------|---------|--------|-----------|
| ... | ... | ... | High/Medium/Low |

### From Web Research
**Industry Context:**
- [Finding from industry research]

**Competitor Approaches:**
- [How competitors handle this]

### From Codebase
**Existing Implementations:**
- `path/to/file.php` - [What it does]

## Synthesis

### Consolidated Requirements
1. **[Requirement 1]** - Source: Fireflies meeting, Linear issue
2. **[Requirement 2]** - Source: Teams chat, web research

### Open Questions
1. [ ] [Question] - Ask: [who]
2. [ ] [Question] - Research: [where]

## Recommended Next Steps
- Run `/trilogy.idea` for new features
- Run `/speckit.specify` for specifications
- Run `/trilogy-docs-feature` to update domain docs
```

### Option B: Update Domain Documentation

If researching an existing domain, offer to update the domain doc:

```markdown
I found relevant context for the **[Domain]** domain. Should I:

1. **Update the domain doc** at `.tc-docs/content/features/domains/[domain].md`
   - Add business context section
   - Include stakeholder quotes
   - Update "How It Works" with decisions

2. **Create separate research doc** for reference

3. **Both** - Update domain and keep research doc
```

## Usage Examples

**Quick research (sequential):**
```
/research budget utilisation --sources fireflies,linear
```

**Comprehensive research (parallel agents):**
```
/research consumer mobile authentication --parallel
```

**Industry research:**
```
/research Support at Home fee changes --sources web,fireflies
```

**Domain enrichment:**
```
/research collections --update-domain
```

## Integration with Learn Skill

When `/learn` reads the Support at Home manual for industry questions, it may suggest:

> "For more business context and how TC Portal interprets these requirements,
> consider running `/research [topic]` to gather insights from Teams, Fireflies,
> and Linear."

## Token Usage Guidelines

| Approach | Token Usage | Speed | Best For |
|----------|-------------|-------|----------|
| Sequential (1-2 sources) | Low | Slow | Quick lookups |
| Sequential (3+ sources) | Medium | Slow | Thorough but budget-conscious |
| Parallel (3+ agents) | High | Fast | Comprehensive epic research |

**Rule of thumb:** Each parallel agent adds ~20-50% token overhead due to separate context. Use parallel agents when:
- Speed is more important than cost
- You need cross-referenced findings
- Researching for major epics or initiatives

## Error Handling

| Error | Action |
|-------|--------|
| MCP tool unavailable | Skip that source, note in output |
| Rate limited | Capture partial data, note limitation |
| No results from source | Note "no findings" in that section |
| Sub-agent timeout | Use partial results, note limitation |
