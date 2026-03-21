---
name: trilogy-idea-spawn
description: >-
  Generate an interactive ideas board from an idea brief, spec, or Fireflies transcript.
  Spawns 40-60 domain-specific ideas across categories, phases, and priorities.
  Produces an HTML playground with voting (hands-in-the-air), impact/effort rating,
  MoSCoW Kanban, value matrix, and a session export prompt for Claude refinement.
  Best run after a discovery meeting with a Fireflies transcript.
  Triggers on: idea spawn, ideas board, brainstorm, spawn ideas, ideation session,
  brainstorming board, idea generation, discovery ideas.
---

# Trilogy Idea Spawn

Generate an interactive ideas board playground from an epic's documentation. Reads the idea brief, spec, design docs, and optionally a Fireflies meeting transcript to produce 40-60 **domain-specific** ideas that a team can vote on, rate, and prioritize in a live session.

## When to Use

```
/trilogy-idea          -> idea-brief.md
/trilogy-idea-handover -> Gate 0 (Backlog)
/trilogy-research      -> context gathering (optional)
  [Discovery meeting with Fireflies recording]
/trilogy-idea-spawn    -> THIS: interactive ideas board
  [Team voting session]
  Export -> feed back into /speckit-specify or /trilogy-clarify
```

Best used:
- **After a discovery/kickoff meeting** — feed the Fireflies transcript + idea brief
- **Before specification** — to surface what the team actually wants to build
- **During planning sessions** — project onto screen, team votes live

## Inputs

| Source | Required | How to Find |
|--------|----------|-------------|
| idea-brief.md | Yes | Epic folder in `.tc-docs/content/initiatives/` |
| spec.md | Optional | Same folder (enriches categories if available) |
| design.md | Optional | Same folder (enriches UX ideas) |
| plan.md | Optional | Same folder (enriches technical ideas) |
| Fireflies transcript | Optional | User provides path or `/trilogy-research` output |
| RACI | Yes | From idea-brief.md or meta.yaml |

## Execution Steps

### Step 1: Gather Context

1. **Find the epic folder** — ask user which epic, or detect from conversation context
2. **Read all available docs** in order: idea-brief.md, spec.md, design.md, plan.md, business-spec.md
3. **Read Fireflies transcript** if provided (extract key themes, pain points, ideas mentioned)
4. **Read RACI** to understand stakeholders and target users

### Step 2: Extract Categories

From the documentation, identify **6-8 natural categories** that map to the epic's domain. These should NOT be generic — they must reflect the actual problem space.

**Example for RIN (Relationship Intelligence):**
- Personal Context Capture
- Client Snapshot & Prep
- Touchpoint & Compliance
- Interaction Timeline
- Conversation Prompts
- Relationship Network
- Integration & Data
- Analytics & Insights

**Example for a Billing epic:**
- Invoice Processing
- Payment Reconciliation
- Supplier Management
- Budget Forecasting
- Approval Workflows
- Reporting & Exports

Each category gets a distinct colour from this palette:
```
#22c55e, #64BCEA, #43C0BE, #a78bfa, #f472b6, #fb923c, #38bdf8, #eab308
```

### Step 3: Generate Ideas

Generate **40-60 ideas** that are:

1. **Domain-specific** — directly reference entities, workflows, and terminology from the docs
2. **Phased** — tag each as Phase 1, Phase 2, or Future based on complexity and dependencies
3. **Varied in scope** — mix quick wins with ambitious bets
4. **Grounded in real problems** — reference actual pain points from the brief/transcript
5. **Actionable** — each idea should be implementable as a feature or enhancement

**Idea structure:**
```javascript
{
  id: 1,
  cat: 'category-id',    // Maps to a category
  phase: 'P1',           // P1, P2, or 'future'
  title: 'Short title',  // 3-8 words
  desc: 'Description'    // 1-2 sentences, specific to the domain
}
```

**Phase distribution target:**
- Phase 1: ~40% (core MVP ideas)
- Phase 2: ~35% (enhancements)
- Future: ~25% (aspirational)

**If Fireflies transcript is provided:**
- Extract ideas mentioned in discussion
- Surface pain points as idea opportunities
- Reference specific quotes or themes from the meeting

### Step 4: Generate the Playground HTML

Use the template at `.tc-wow/claude/skills/trilogy-idea-spawn/references/idea-spawn-template.html` as the base.

**Customise the template with:**
1. Epic title and subtitle in the header
2. Categories array with domain-specific names and colours
3. Ideas array with all generated ideas
4. RACI stakeholders displayed in the sidebar
5. Date of the session

**Key features of the playground:**
- **Three views**: Cards (grid), Kanban (MoSCoW drag-and-drop), Value Matrix (impact/effort)
- **Voting**: Hands-in-the-air visual (raised hand emoji that grows with votes)
- **Rating**: Impact (1-5) and Effort (1-5) per idea
- **Priority**: MoSCoW drag — Must/Should/Could/Won't
- **Search & filter**: By category, phase, text
- **Sidebar stats**: Progress, phase breakdown, MoSCoW distribution, top voted, best ratio
- **Session export**: Generates a structured Claude prompt with all voting/rating data

### Step 5: Save and Serve

1. Save the HTML file to the **epic folder**:
   ```
   .tc-docs/content/initiatives/[initiative]/[epic]/ideas-board.html
   ```

2. Also save a copy to the project root for easy serving:
   ```
   [epic-code]-ideas-board.html
   ```

3. Tell the user how to open it:
   ```
   Open the file directly in your browser, or serve it:
   npx serve . -l 3333
   Then open: http://localhost:3333/[epic-code]-ideas-board.html
   ```

### Step 6: Present Session Instructions

After generating, tell the user:

> **Ideas Board ready!**
>
> **Solo session**: Open the board, vote/rate/prioritize, then Export to get a structured prompt.
>
> **Team session**: Screen-share the board. Each person calls out votes (hands up!).
> Someone drives the prioritization. When done, Export and paste back here.
>
> **With Fireflies**: After your next meeting, run `/idea-spawn` again with the transcript
> to generate ideas grounded in what the team actually discussed.
>
> **Next step**: Paste the exported prompt back here to feed into `/speckit-specify` or `/trilogy-clarify spec`.

## Export Prompt Format

The "Export" button generates a markdown document structured as a Claude prompt:

```markdown
# Idea Spawn Session Results: [Epic Name]

## Session Context
- **Epic**: [Name]
- **Date**: [Session date]
- **Participants**: [From RACI]
- **Ideas Generated**: [N]
- **Ideas Prioritized**: [N of N]
- **Ideas Rated**: [N of N]

## Must Have ([N] ideas)
[Sorted by votes, with impact/effort ratings]

## Should Have ([N] ideas)
...

## Could Have ([N] ideas)
...

## Won't Have ([N] ideas)
...

## Unprioritized ([N] ideas)
...

## Top 10 by Impact/Effort Ratio
[Quick wins — high impact, low effort]

## Top 10 by Votes
[Team consensus — most popular ideas]

## Instruction for Claude

Use these prioritized ideas to inform the specification.
The "Must Have" ideas should map directly to User Stories in spec.md.
The "Should Have" ideas should be considered for Phase 2 or enhancement scope.
The "Could Have" and "Won't Have" ideas provide context for what was explicitly deprioritized.

Focus on the top-voted and highest-ratio ideas when creating acceptance criteria.
```

## Workflow Position

```
/trilogy-idea              -> idea-brief.md
/trilogy-idea-handover     -> Gate 0 (Backlog)
/trilogy-research          -> context gathering
  [Discovery meeting]
/trilogy-idea-spawn        -> THIS: ideas-board.html
  [Team voting session]
  Export prompt ->
/speckit-specify           -> spec.md (informed by voted ideas)
/trilogy-clarify spec      -> refine spec
```
