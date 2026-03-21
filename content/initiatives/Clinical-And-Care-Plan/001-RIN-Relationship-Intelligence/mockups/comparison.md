# Design Challenge Comparison: Relationship Intelligence

## Layout Approach

| Pattern | Linear Lisa | Notion Nora | GitHub Greg | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| **Variation A** | Sidebar Panel | Block Dashboard | Issue-Style Layout | Split-Pane Briefing |
| **Variation B** | Full Tab | Database-Style View | Repository Overview | Focus Mode |

### Sidebar vs Tab vs Split-Pane vs Full-Screen

**Linear A (Sidebar)** keeps Relationship Intelligence visible alongside existing tabs — no context-switching. But sidebar width limits how much can be shown.

**Notion A (Block Dashboard)** gives the most flexible layout — blocks can be rearranged, expanded, collapsed. Feels modern and customisable but may feel unfamiliar to care staff.

**GitHub A (Issue-Style)** treats the client like a "living document" with a timeline of interactions. Dense but familiar to anyone who's used a ticketing system.

**Superhuman A (Split-Pane)** is the most radical — a caseload list + client detail side by side. Great for working through a queue of calls, but requires a new navigation paradigm.

---

## Personal Context Display

| Pattern | Linear Lisa | Notion Nora | GitHub Greg | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| **Format** | Definition list (key: value) | Emoji property blocks | Tag labels/badges | Large cards with icons |
| **Editability** | Click to edit inline | Inline property chips | Edit button per section | Quick-add via command palette |
| **Visual weight** | Minimal, text-focused | Warm, visual, emoji-rich | Dense, badge-heavy | Bold, large typography |

### Key Differences

**Linear** keeps personal context as clean text pairs — scannable but not visually distinctive. Good for power users who read fast.

**Notion** uses emoji icons per category (🌱 Gardening, 🏉 Sports) making categories instantly recognisable. Most approachable for non-technical users.

**GitHub** treats personal context as tags/labels — compact but requires hovering for detail. Best information density.

**Superhuman** uses large typography and generous spacing — easiest to read at a glance but takes the most screen real estate.

---

## Operational Summary

| Pattern | Linear Lisa | Notion Nora | GitHub Greg | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| **Format** | Coloured count badges | Metric blocks with icons | Status labels + counts | Animated counters |
| **Colour coding** | Subtle teal/amber/red | Warm background fills | GitHub-style label colours | Bold gradients |
| **Click-through** | Badge links to detail | Block expands inline | Label links to filtered list | Slide transition to detail |

### All students agree on:
- Bills on hold in **amber**
- Active complaints in **red**
- "No complaints" as a **positive green** indicator
- Touchpoint warning at **25+ days**

---

## Conversation Prompts

| Pattern | Linear Lisa | Notion Nora | GitHub Greg | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| **Placement** | Bottom of sidebar, subtle callout | Highlighted block at top | Pinned comment in timeline | Prominent card with keyboard shortcut |
| **Visual treatment** | Muted background, teal accent | Yellow callout block (like Notion callout) | Info banner, collapsible | Gradient card, pulsing dot |
| **Dismissibility** | Click X to dismiss | Toggle block collapse | Collapse section | Keyboard shortcut to cycle |

### Key Insight
**Superhuman Sam** and **Notion Nora** give prompts the most visual prominence — which aligns with the "relationship first" design principle. **Linear Lisa** keeps them subtle, which might cause them to be missed. **GitHub Greg** buries them slightly in the timeline pattern.

---

## Touchpoint Logging

| Pattern | Linear Lisa | Notion Nora | GitHub Greg | Superhuman Sam |
|---------|-------------|-------------|-------------|----------------|
| **Trigger** | Button in sidebar | Block action menu | "New comment" button | Keyboard shortcut (L) |
| **Form style** | Minimal modal | Inline block editor | Comment-style input | Command palette quick-entry |
| **Speed** | ~10 seconds | ~15 seconds (more fields visible) | ~10 seconds | ~5 seconds (keyboard-driven) |

### Key Insight
**Superhuman Sam** is fastest by design — the keyboard-driven approach means a coordinator can log a touchpoint without taking their hand off the keyboard. **Linear Lisa** is a close second with a minimal modal. **Notion Nora** is slowest because the block-based approach shows more fields upfront.

---

## Cherry-Pick Recommendations

Based on the analysis, here are the strongest patterns from each student:

1. **Linear Lisa B — Two-column tab layout**: Clean separation of personal (left) and operational (right). Most balanced approach for a dedicated tab.

2. **Notion Nora A — Emoji category blocks**: The most approachable personal context display. Emoji icons make categories instantly recognisable.

3. **GitHub Greg A — Timeline interaction history**: The issue-comment-style timeline is the strongest pattern for showing interaction history chronologically.

4. **Superhuman Sam A — Split-pane with caseload**: Best for coordinators working through a queue of calls. The caseload list + detail is a proven pattern.

5. **Superhuman Sam B — Focus mode / call prep**: Unique concept — a dedicated "about to call" view with prominent prompts. Could be a powerful differentiator.

6. **Linear Lisa A — Sidebar panel**: The most practical "always there" approach that doesn't disrupt existing workflow.

7. **Notion Nora — Inline property editing**: Click-to-edit property chips are the fastest way to add/update personal context without opening a form.

8. **GitHub Greg B — Touchpoint heatmap**: The contribution-graph-inspired heatmap for touchpoint frequency is a clever way to visualise compliance at a glance.

9. **Superhuman Sam — Keyboard shortcuts**: L to log, C to add context, P to cycle prompts. Speed for power users.

10. **All students — Colour-coded operational badges**: Universal consensus on amber/red/green for operational status. This is the right approach.
