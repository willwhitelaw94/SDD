---
title: "GitHub Design Language Research for Relationship Intelligence"
description: "Research into GitHub's design philosophy, information density approach, and how it applies to CRM-style relationship intelligence panels in aged care"
---

# GitHub Design Language Research for Relationship Intelligence

## Executive Summary

GitHub's design language is built for developers who need to process large volumes of structured information quickly. Their approach -- dense data, strategic colour, monospaced accents for identifiers, and collapsible sections -- translates directly to the Relationship Intelligence panel where coordinators need to absorb a client's full context in seconds before picking up the phone.

---

## Core Design Principles

### 1. Information Density Over Whitespace

GitHub optimises for data per pixel. Unlike consumer apps that use generous padding and large type, GitHub packs information tightly because its users are processing hundreds of items daily.

**How GitHub does it:**
- Compact list rows with minimal padding (8-12px vertical)
- Side-by-side layouts that eliminate scrolling (main + sidebar)
- Inline metadata (author, timestamp, labels) on a single line
- No hero images or decorative elements in workflow views

**Application to RIN:**
A coordinator glancing at a client profile before a call needs the same density. They are not browsing -- they are preparing. The panel should show personal context, operational status, last touchpoint, and conversation prompts without scrolling.

### 2. Monospaced Accents for Machine Identifiers

GitHub uses monospace fonts (`SFMono-Regular`, `Menlo`, `Consolas`) for anything that is a system-generated identifier: commit SHAs, branch names, version numbers, timestamps.

**Why it works:**
- Creates instant visual distinction between human-readable text and system IDs
- Monospace characters have equal width, making aligned columns scannable
- Conveys precision -- "this is an exact value, not a fuzzy description"

**Application to RIN:**
Use monospace for `TC-4821` (client ID), dates like `15 Mar 2026`, and days-since counters like `18d ago`. This creates a "data dashboard" feel within a narrative context panel.

### 3. Status Badges and Labels Everywhere

GitHub's Primer design system uses colour-coded badges as the primary state communication mechanism. Every issue, PR, deployment, and check run has a badge.

**Badge anatomy:**
- Colour background (usually translucent) + matching text colour + border
- Icon reinforcement (open circle, checkmark, merge icon) for colour-blind accessibility
- Consistent vocabulary: green = good/active, red = problem, yellow = warning, purple = merged/complete

**Application to RIN:**
- `Active` (green) -- care plan status
- `2 on hold` (yellow) -- bills requiring attention
- `1 incident` (red) -- recent safety events
- `None` (green) -- complaints clear

### 4. Collapsible Sections with Disclosure Triangles

GitHub uses HTML `<details>` elements extensively to manage information density. File trees, review comments, and CI check details all collapse.

**Why it works:**
- Reduces cognitive overload on first load
- Power users expand what they need; casual viewers see the summary
- Collapsed state still shows the section heading, so users know the information exists

**Application to RIN:**
Personal context (interests, family, preferences) can be collapsible. On first load, coordinators see the section exists with item count. Expanding reveals the full list with category labels.

### 5. Tab-Based Navigation (Repository Tabs Pattern)

Every GitHub repository has the same tab structure: Code, Issues, Pull Requests, Actions, Projects, Wiki, Settings. This consistent tab bar provides orientation and quick switching.

**Key characteristics:**
- Underline indicator on active tab
- Count badges on tabs with actionable items (Issues: 12, PRs: 3)
- Tabs are always visible, not hidden in hamburger menus
- Content below tabs changes; header and sidebar remain stable

**Application to RIN:**
The package profile uses tabs: Overview, Relationship, Billing, Care Plan, Activity. The "Relationship" tab hosts the intelligence panel, keeping it integrated within the existing package context rather than being a separate page.

---

## Visual Language Details

### Colour Palette

GitHub uses a dark theme (`#0d1117` background) with a deliberately muted palette. Colour is reserved for status and interactive elements.

| Element | GitHub Colour | RIN Application |
|---|---|---|
| Background | `#0d1117` | Panel background |
| Surface | `#161b22` | Card backgrounds |
| Border | `#21262d` | Section separators |
| Muted text | `#8b949e` | Secondary labels |
| Primary text | `#e6edf3` | Client name, key data |
| Green (active) | `#238636` / `#3fb950` | Active status, no complaints |
| Red (danger) | `#da3633` / `#f85149` | Incidents, urgent items |
| Yellow (warning) | `#d29922` | Days-since threshold, bills on hold |
| Blue (info) | `#1f6feb` / `#58a6ff` | Links, phone touchpoints |
| Purple (AI) | `#d2a8ff` | AI-generated prompts, preferences |

### Contribution Graph Heatmap

The most recognisable GitHub UI element is the contribution graph -- a 52-week heatmap showing daily activity.

**How it works:**
- 5 intensity levels (empty, light, medium, dark, brightest)
- Weeks as columns, days as rows (Sun-Sat)
- Month labels along the top axis
- Summary statistics below the graph

**Application to RIN:**
A touchpoint frequency heatmap over the last 13 weeks shows:
- Engagement cadence at a glance (weekly? sporadic? declining?)
- Gaps in contact (empty columns = weeks without touchpoints)
- The 18-day gap since last contact is immediately visible as empty cells at the right edge
- Summary stats: total touchpoints, days since last, weekly average

---

## Interaction Patterns

### File Tree as Category Browser

GitHub's file tree uses folder and file icons with inline descriptions (last commit message) and timestamps. This pattern converts naturally to a "context category browser" where folders represent categories (interests, family, preferences) and files represent operational logs (incidents, complaints, bills).

### Issue Comment Timeline

GitHub issue comments form a chronological, append-only timeline with:
- Actor avatars and names
- Relative timestamps ("18d ago") with exact dates on hover
- Event type differentiation (comment, status change, label change)
- Quote blocks for referenced content

This maps to the interaction timeline showing touchpoints, incidents, and system events in chronological order.

### PR Review Actions

The three-state PR review (Comment / Approve / Request Changes) pattern is not used in the RIN panel directly, but the Log Touchpoint action follows the same principle: a deliberate, explicit action that creates an auditable record.

---

## References

- [GitHub Primer Design System](https://primer.style/)
- [Primer Colour System](https://primer.style/foundations/color/overview)
- [GitHub Contribution Graph](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile)
- [Primer Components -- State Label](https://primer.style/components/state-label/)
- [Primer Components -- ActionList](https://primer.style/components/action-list)
- [GitHub UI Patterns Study -- Smashing Magazine](https://www.smashingmagazine.com/)