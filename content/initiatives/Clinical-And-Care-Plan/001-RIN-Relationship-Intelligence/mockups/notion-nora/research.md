---
title: "Notion Nora - Design Research"
description: "Research notes on Notion's design language and how it applies to relationship intelligence display"
---

# Design Research: Notion's Block Architecture

## Core Design Philosophy

Notion's design system is built on a single unifying principle: **everything is a block**. Every paragraph, heading, image, embed, database, and toggle is a discrete, manipulable unit. This creates a system where:

- Content is infinitely composable (blocks nest, reorder, transform)
- The interface feels more like a document than an application
- Users understand the system through one mental model, not many

## Key Visual Patterns

### Typography
- **Serif headings** mixed with sans-serif body text is Notion's most recognisable typographic choice
- Creates warmth and editorial quality while keeping body text scannable
- Heading hierarchy is clear but not aggressive (no heavy weight contrast)

### Colour Language
- Warm grays dominate (`#FAFAFA`, `#F2F2F2`, `#DBDBDB`) rather than cold blues
- Colour-coded "property" chips communicate category at a glance
- Background tinting (light pastels) groups related information without heavy borders
- High contrast is reserved for interactive elements and status indicators

### Interaction Model
- **Hover-to-reveal**: Drag handles, action buttons, and edit hints appear only on hover
- **Inline editing**: Click any property chip to edit it in-place (no modal required)
- **Toggle/accordion**: Sections expand and collapse with a single click
- **Drag-and-drop**: The six-dot grip handle appears on hover, signalling reorderability

### Block Types Relevant to Relationship Intelligence
1. **Callout block** - Highlighted box with icon + text (maps to conversation prompts)
2. **Property rows** - Key-value pairs with inline-editable chips (maps to personal context)
3. **Database cards** - Structured cards in board/table/timeline view (maps to operational data)
4. **Toggle block** - Collapsible sections for progressive disclosure

## Database Views

Notion databases can be displayed in multiple views from the same data:

| View    | Best For                                    | RI Application                    |
|---------|---------------------------------------------|-----------------------------------|
| Board   | Categorised cards grouped by a property     | Context grouped by type           |
| Table   | Dense, scannable rows with sortable columns | All-in-one operational overview   |
| Timeline| Chronological ordering with date ranges     | Touchpoint history + upcoming     |
| List    | Compact vertical listing                    | Quick-reference property list     |
| Gallery | Visual card grid                            | Not ideal for this use case       |

## How This Applies to Relationship Intelligence

### Strengths
- **Modular composition**: Coordinators could rearrange blocks to suit their workflow (e.g., move "conversation prompts" to the top before a call)
- **Progressive disclosure**: Toggle sections prevent information overload while keeping everything one click away
- **Familiar mental model**: Many users already know Notion; the patterns feel intuitive
- **Inline editing**: Adding context notes or updating personal details feels lightweight, not like a form submission

### Risks
- **Over-flexibility**: Too many blocks can feel cluttered without good defaults
- **Passive discovery**: Hover-to-reveal means some actions are invisible until explored
- **Block overhead**: Each piece of information as a distinct block may create visual noise for simple data (e.g., a single phone number)

## Competitive References

- **Notion CRM templates** - Community-built CRM databases that use board views for deal stages; similar pattern could work for touchpoint status
- **Notion team wikis** - Toggle-based knowledge bases that balance depth with scanability
- **Attio** - A CRM that borrowed heavily from Notion's block model for relationship management; validates the pattern in a professional context