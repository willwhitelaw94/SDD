---
name: trilogy-design-sync
description: >-
  Push HTML or Vue mockups into Figma via the Figma MCP. Translates mockup
  content into Figma-native frames and components. Falls back to a structured
  design brief if the MCP tool is unavailable.
  Triggers on: design sync, push to figma, sync figma, figma push, mockup to figma,
  send to figma.
metadata:
  version: 1.0.0
  type: agent
---

# Design Sync

Push HTML or Vue mockups from `/trilogy-mockup` into Figma using the `mcp__figma__generate_figma_design` MCP tool. Bridges the gap between Claude-generated mockups and the designer's Figma workspace.

## Purpose

This skill:
1. **Reads** existing mockup files (HTML or Vue)
2. **Translates** mockup content into a Figma-friendly design description
3. **Pushes** the design into Figma via MCP
4. **Optionally sets up** Code Connect mappings between Vue components and Figma components
5. **Falls back** to a structured design brief if the MCP tool is unavailable

## When to Use

```bash
/design-sync                              # Auto-detect mockups, push to Figma
/design-sync <figma-url>                  # Push into specific Figma file/frame
/design-sync --brief-only                 # Skip MCP, generate design brief markdown only
```

Run this skill **after** mockups exist (from `/trilogy-mockup` — any mode).

## Prerequisites

| Artifact | Required | Location |
|----------|----------|----------|
| Mockups | Yes | `mockups/` in initiative folder OR `resources/js/Pages/Mockups/` |
| Figma MCP | Recommended | `mcp__figma__*` tools — falls back to brief if unavailable |
| design-system-rules.md | Yes | `.tc-wow/claude/skills/trilogy-mockup/references/design-system-rules.md` |
| component-map.md | Yes | `.tc-wow/claude/skills/trilogy-mockup/references/component-map.md` |

## Output

- **Primary**: Figma frames created in the target file via MCP
- **Fallback**: `figma-design-brief.md` in the mockups directory
- **Optional**: Code Connect mappings linking Vue components to Figma components

---

## Execution Flow

### Step 0: Verify Figma MCP

Unless `--brief-only` is set:

```
1. Use ToolSearch to check for mcp__figma__generate_figma_design
2. If available, proceed with MCP push
3. If unavailable, inform user and switch to brief-only mode:
   "Figma MCP not available. Generating a design brief instead.
    To enable MCP push, run: claude mcp add figma --transport http https://mcp.figma.com/mcp"
```

Also verify auth with `mcp__figma__whoami` — confirm connected to the right Figma account.

### Step 1: Locate Mockup Files

Search for mockups in this priority order:

1. **Vue mockups** (highest fidelity): `resources/js/Pages/Mockups/` — real Vue components
2. **Challenge unified**: `.tc-docs/content/initiatives/.../mockups/challenge/unified/` — winning design
3. **Quick mode HTML**: `.tc-docs/content/initiatives/.../mockups/*.html` — HTML mockups
4. **Challenge student**: `.tc-docs/content/initiatives/.../mockups/challenge/student-*/` — individual designs

If multiple sources exist, ask the user which to sync:
```
I found mockups in multiple locations:
1. Vue mockups (4 screens) in resources/js/Pages/Mockups/LeadProfile/
2. Challenge unified (1 screen) in mockups/challenge/unified/

Which should I push to Figma?
```

### Step 2: Load Design References

Read both reference files from the mockup skill directory:

```
Read: .tc-wow/claude/skills/trilogy-mockup/references/design-system-rules.md
Read: .tc-wow/claude/skills/trilogy-mockup/references/component-map.md
```

Build a **reverse mapping** (Code → Figma):

| Code Pattern | Figma Equivalent |
|---|---|
| `CommonButton variant="primary"` | Button / Primary component |
| `CommonCard` | Card frame with auto-layout |
| `CommonBadge variant="success"` | Badge / Success component |
| `bg-teal-700` / `#007F7E` | Teal/700 colour style |
| `text-sm` | Body/Small text style |
| `space-y-4` | 16px vertical auto-layout gap |
| `rounded-lg` | 8px corner radius |
| `rounded-input` | Input field corner radius (project token) |

### Step 3: Analyze Each Mockup Screen

For each mockup file, extract a structured description:

```yaml
screen:
  name: "Profile Overview"
  source: "resources/js/Pages/Mockups/LeadProfile/ProfileOverview.vue"
  layout:
    type: "single-column"  # or two-column, sidebar, grid
    shell: "AppLayout with CommonContent + CommonHeader"
  sections:
    - type: "header"
      component: "CommonHeader"
      props: { title: "Lead Profile", subtitle: "Margaret Thompson" }
    - type: "card"
      component: "CommonCard"
      content:
        - type: "definition-list"
          component: "CommonDefinitionList"
          items:
            - { label: "Full Name", value: "Margaret Thompson" }
            - { label: "Status", value: "Active", display: "CommonBadge variant=success" }
    - type: "tabs"
      component: "CommonTabs"
      tabs: ["Overview", "Timeline", "Notes"]
  tokens:
    colors: ["teal-700", "gray-900", "gray-500"]
    spacing: ["p-6", "space-y-4", "gap-4"]
    typography: ["text-xl font-semibold", "text-sm text-gray-500"]
  states:
    - "Default (populated)"
    - "Empty state (no timeline entries)"
```

### Step 4: Push to Figma (MCP Mode)

For each screen description from Step 3:

```
1. Call mcp__figma__generate_figma_design with:
   - The structured design description
   - Reference to design system tokens
   - Target Figma file (from --figma-url or the design system file key)

2. Record the created frame's node ID and URL

3. If the mockup used Vue components with Storybook stories:
   - Call mcp__figma__add_code_connect_map to link each Vue component
     to its Figma counterpart
```

**Important**: Since this MCP tool is newly adopted, handle errors gracefully:
- Log the exact error message
- Fall back to brief-only mode
- Report what worked and what failed

### Step 4b: Generate Design Brief (Brief-Only Mode)

If `--brief-only` or if MCP push failed, generate `figma-design-brief.md`:

```markdown
# Figma Design Brief: [Feature Name]

*Generated by `/design-sync` on YYYY-MM-DD*
*Source: [mockup file paths]*

## Design System Reference

**Figma File**: [Trilogy Care Design System](https://www.figma.com/design/ojTCI9yefnl9ORYEVrv2WJ)
**Storybook**: https://design.trilogycare.dev

---

## Screen 1: Profile Overview

### Layout
- Single column, full width content area
- AppLayout shell (sidebar + header)

### Component Inventory

| # | Component | Figma Equivalent | Props/Config |
|---|-----------|-----------------|--------------|
| 1 | CommonHeader | Header frame | title="Lead Profile", subtitle="Margaret Thompson" |
| 2 | CommonCard | Card with auto-layout | padding: 24px, gap: 16px |
| 3 | CommonBadge | Badge / Success | label="Active", variant="success" |
| 4 | CommonTabs | Tab bar | tabs: Overview, Timeline, Notes |

### Token Mapping

| Tailwind Class | Figma Token | Value |
|---|---|---|
| bg-teal-700 | Teal/700 | #007F7E |
| text-gray-900 | Gray/900 | #111827 |
| space-y-4 | Spacing/4 | 16px |
| rounded-lg | Radius/lg | 8px |

### Content

| Element | Text |
|---------|------|
| Page title | "Lead Profile" |
| Subtitle | "Margaret Thompson" |
| Badge | "Active" |

### States to Design
- [ ] Default (populated data)
- [ ] Empty state (no entries)
- [ ] Loading skeleton
- [ ] Error state

---

## Screen 2: [Next Screen]
...

---

## Notes for Designer

- This brief was generated from [HTML/Vue] mockups
- Components reference the TC Portal design system in Figma
- Token values match the project's tailwind.config.js
- States listed should each be a separate Figma frame
```

Save to: `mockups/figma-design-brief.md` (alongside the mockup files)

### Step 5: Set Up Code Connect (Optional)

If Vue mockups were used and Figma push succeeded:

```
For each Vue component used in the mockups:
1. Call mcp__figma__add_code_connect_map to create a mapping:
   - Figma component node ID (from the pushed design)
   - Code file path (e.g., resources/js/Components/Common/CommonButton.vue)

2. Call mcp__figma__send_code_connect_mappings to push all mappings at once
```

This is optional and best-effort — Code Connect requires specific Figma plan tiers.

### Step 6: Report Completion

```
## Design Sync Complete

**Feature**: [Name]
**Screens Synced**: N
**Mode**: MCP Push / Design Brief

### Figma Frames Created (MCP mode)
| Screen | Figma URL |
|--------|-----------|
| Profile Overview | [Link](figma-url) |
| Timeline | [Link](figma-url) |

### OR: Design Brief Generated (Brief mode)
**File**: mockups/figma-design-brief.md
**Components Documented**: N
**Tokens Mapped**: N

### Code Connect Mappings
- CommonButton → Button/Primary (linked)
- CommonCard → Card (linked)
- ...

### Next Steps
- Designer reviews and refines the Figma frames
- Designer records a Loom walkthrough of their changes
- Run /design-gap-assessment to cross-check after refinement
```

---

## Behavior Rules

- **Always read design-system-rules.md** before generating descriptions — use correct token names
- **Always read component-map.md** before translating — use correct Figma component names
- **Prefer Vue mockups over HTML** when both exist — higher fidelity, real components
- **Handle MCP failures gracefully** — always fall back to design brief, never fail silently
- **Document every screen** — don't skip screens even if they seem simple
- **Include all states** — list empty, loading, error, and success states for the designer
- **Preserve content** — include real labels, placeholder text, and sample data from mockups
- **One Figma frame per screen** — don't combine multiple screens into one frame

## Integration with Other Skills

| Before | After |
|--------|-------|
| `/trilogy-mockup` → mockups | Designer refines in Figma |
| `/trilogy-mockup --vue` → Vue pages | `/design-gap-assessment` |

## Workflow Position

```
/trilogy-mockup         → mockups (ASCII/HTML/Vue)
        ↓
/design-sync            → push to Figma (or generate brief)
        ↓
Designer improves in Figma + records Loom
        ↓
/design-gap-assessment  → gap analysis
        ↓
/trilogy-design-handover → Gate 2
```
