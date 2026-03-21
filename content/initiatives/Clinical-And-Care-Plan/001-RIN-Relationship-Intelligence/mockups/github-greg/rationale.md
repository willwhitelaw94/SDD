---
title: "Design Rationale: GitHub Patterns for Relationship Intelligence"
description: "Why the issue-style and repository-overview patterns work for client relationship intelligence, and the trade-offs with density vs scannability"
---

# Design Rationale: GitHub Patterns for Relationship Intelligence

## Why GitHub Patterns Work for This Panel

### The Core Analogy

A GitHub repository is a structured knowledge base with metadata, status indicators, chronological history, and quick actions. A client's relationship context is exactly the same thing. The coordinator approaching a call is in the same cognitive state as a developer opening a PR: "Give me the context I need to make good decisions, fast."

GitHub's design language is optimised for people who process hundreds of items daily and need to shift between overview and detail fluidly. Care coordinators managing 50+ client interactions per day face the same information challenge.

---

## Variation A: Issue-Style Layout

### What It Is

The relationship intelligence panel is structured like a GitHub Issue page:
- **Header** with client status badge, ID, and "last updated" timestamp
- **Warning banner** (like a CI failure banner) when the touchpoint gap approaches threshold
- **Conversation prompts** as pinned items at the top
- **Personal context** as a collapsible section with category labels (like GitHub issue labels)
- **Interaction timeline** as chronological comments with actor attribution
- **Sidebar** with operational status badges, care plan details, labels, milestones, and quick actions

### Why This Pattern Works

**1. The sidebar carries all operational data without cluttering the narrative.**
GitHub's issue sidebar packs assignees, labels, milestone, and linked PRs into a narrow column. Similarly, the RIN sidebar carries bills on hold, complaints, incidents, care plan status, coordinator assignment, and key dates. The coordinator can glance right for operational status without losing their place in the personal context.

**2. The timeline creates an instant audit trail.**
GitHub's issue comment timeline is append-only and attributed. The RIN interaction timeline shows who contacted Margaret, when, what happened, and what type of interaction it was. This provides the "story so far" before the coordinator picks up the phone.

**3. Collapsible sections manage information density.**
Personal context (4 items for Margaret) is visible on load via a `<details open>` element. For clients with extensive context (10+ items), this can be collapsed to a single line showing the count. The coordinator decides how deep to go.

**4. The warning banner is impossible to miss.**
The yellow banner at the top ("Last touchpoint was 18 days ago") works like a failing CI check on a PR -- it is the first thing you see and it demands action. The "Log Touchpoint" button is embedded directly in the banner for zero-navigation conversion.

### Trade-offs

| Advantage | Trade-off |
|---|---|
| Deep narrative context from the timeline | Requires scrolling for long interaction histories |
| Sidebar keeps operational data always visible | Sidebar competes for horizontal space on narrow screens |
| Collapsible sections reduce overload | Collapsed sections might be missed by new users |
| Warning banner is highly visible | Only one banner can be prominent; multiple warnings would stack |

---

## Variation B: Repository Overview

### What It Is

The relationship intelligence panel is structured like a GitHub Repository landing page:
- **README-style summary card** with the client's narrative context, status badges (like shields.io badges), and conversation prompts
- **File tree** showing context categories as folders/files with inline descriptions and item counts
- **Contribution heatmap** showing touchpoint frequency over the last 13 weeks
- **Compact interaction log** (like a commit history) showing recent touchpoints in dense rows
- **Sidebar** with About section, operational stats, care plan, coordinator, milestones, and labels

### Why This Pattern Works

**1. The README card delivers the full picture in one scroll-free view.**
A GitHub repo's README is the single source of truth. The README-style card provides Margaret's name, ID, package level, personal description, all status badges, and conversation prompts in one contained area. A coordinator can absorb the full context without scrolling.

**2. The heatmap instantly reveals engagement patterns.**
The touchpoint frequency heatmap is the most distinctive feature. At a glance, the coordinator sees:
- Overall engagement cadence (dense = frequent contact, sparse = infrequent)
- The 18-day gap as empty cells at the right edge of the graph
- A ring indicator on today's cell showing "no touchpoint yet"
- Summary stats (23 touchpoints in 13 weeks, 1.8/week average)

This is information that no list or badge can convey as quickly. Pattern recognition is pre-attentive -- the coordinator's brain processes the heatmap shape before they consciously read any numbers.

**3. The file tree makes operational data browsable.**
Instead of listing operational items inline, the file tree metaphor groups them into categories. Folders (personal-interests, family, communication-preferences) expand into detail. Files (recent-incidents.log, complaints.log, bills-on-hold.log) show inline status in the description column. This is more scannable than a flat list when the coordinator is looking for a specific category.

**4. The compact interaction log maximises density.**
Unlike Variation A's full comment blocks, the repo overview uses a commit-log-style list where each interaction is a single dense row: avatar, author, summary (truncated), type badge, and relative timestamp. This fits 4-6 interactions in the space that Variation A uses for one.

### Trade-offs

| Advantage | Trade-off |
|---|---|
| README card is a complete snapshot | Less room for extended narrative or notes |
| Heatmap reveals patterns instantly | Requires 13 weeks of data to be meaningful; new clients show sparse maps |
| File tree is familiar and browsable | The metaphor requires some conceptual translation (folders = categories) |
| Compact interaction log is very dense | Truncated summaries may miss important details; needs click-to-expand |
| No scrolling needed for primary use case | Sidebar gets long on smaller viewports |

---

## Density vs Scannability: The Central Trade-off

### GitHub Greg's Philosophy: "Ship It, Then Iterate"

Both variations optimise for information density over visual comfort. This is a deliberate choice aligned with Greg's pragmatic approach. The trade-off:

**High density = faster for experienced users, harder for new users.**

A coordinator who uses the RIN panel 50 times per day will benefit enormously from density. They know where everything is; they scan, absorb, and act. A new coordinator on day one may find the dark theme and compact layout overwhelming.

### Mitigation Strategies

1. **Progressive disclosure**: Both variations use collapsible sections and compact-but-expandable rows. The default view shows everything a regular coordinator needs; expanding reveals deeper detail.

2. **Colour-coded status badges**: Even in a dense layout, the green/yellow/red badges are processed pre-attentively. A coordinator's eye is drawn to the yellow "2 on hold" or red "1 incident" badge instantly.

3. **Monospaced IDs and dates**: The visual rhythm of monospace text creates natural scan columns within dense content. `TC-4821`, `18d ago`, `15 Mar 2026` all pop out from surrounding prose.

4. **Strategic whitespace**: While both variations are dense by consumer app standards, they still use GitHub's approach of tight-but-not-cramped spacing. Every section has clear borders, consistent padding, and a single visual hierarchy.

---

## Variation Comparison

| Dimension | Variation A (Issue-Style) | Variation B (Repository Overview) |
|---|---|---|
| **Primary metaphor** | GitHub Issue page | GitHub Repository landing page |
| **Strongest feature** | Interaction timeline with full context | Touchpoint heatmap with pattern recognition |
| **Personal context** | Collapsible section with labels | README card + file tree |
| **Operational data** | Sidebar badges | Sidebar stats + file tree |
| **Information density** | High (timeline uses vertical space) | Very high (compact rows, heatmap) |
| **Best for** | Reviewing recent interaction details | Assessing overall engagement patterns |
| **Scroll requirement** | Moderate (timeline extends) | Low (everything above the fold) |
| **New user accessibility** | Moderate (familiar comment pattern) | Lower (multiple metaphors to learn) |

---

## Recommendation

**Variation B (Repository Overview) is the stronger fit for the "know this person before I pick up the phone" north star.** The heatmap, README card, and compact interaction log deliver a complete snapshot with minimal scrolling. The coordinator sees everything they need in one view.

**Variation A (Issue-Style) excels when the coordinator needs to review a specific recent interaction in depth.** The timeline with full comment blocks provides the narrative context that the compact log in Variation B truncates.

A hybrid approach could combine Variation B's overview as the default view, with the ability to click into any interaction to see Variation A's detailed timeline view.

---

## References

- [GitHub Primer Design System](https://primer.style/)
- [GitHub Repository Overview page patterns](https://docs.github.com/en/repositories)
- [GitHub Issue page patterns](https://docs.github.com/en/issues)
- [Contribution Graph documentation](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile)