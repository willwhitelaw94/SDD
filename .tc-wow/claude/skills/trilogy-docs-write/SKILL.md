---
name: trilogy-docs-write
description: Write and organize TC Portal documentation. Know where to save documents, understand the organizational hierarchy, and follow content conventions. Use when adding new docs, organizing knowledge, or improving existing documentation.
---

# Trilogy Docs Write Skill

Write and organize documentation in the TC Portal docs site.

## Documentation Structure (Current)

```
.tc-docs/content/
│
├── overview/                        # OVERVIEW TAB - Company & onboarding
│   ├── 1.getting-started/           # New hire essentials
│   │   ├── how-docs-work.md         # How to navigate docs
│   │   └── onboarding/              # Onboarding checklist
│   ├── 2.how-trilogy-works/         # Company info
│   │   ├── our-story                # Company history
│   │   ├── why-trilogy-care         # Mission
│   │   ├── keystones-of-care        # Company values
│   │   ├── our-brand                # Brand guidelines
│   │   ├── our-team                 # Team info
│   │   ├── departments              # Org structure
│   │   └── our-partners             # Partner organisations
│   ├── 3.foundations/               # Strategic foundations
│   │   ├── product-mission          # Product direction
│   │   ├── strategic-goals          # Company goals
│   │   ├── ways-of-working          # High-level WoW overview
│   │   └── development-principles   # Dev principles
│   └── 4.team-practices/            # Engineering practices
│       ├── pull-request-manifesto   # PR guidelines
│       ├── sprint-estimation        # Estimation
│       ├── stand-ups                # Daily standups
│       ├── pairing-and-tdd          # Pair programming
│       ├── squads                   # Squad structure
│       ├── definition-of-done       # DoD
│       ├── user-stories             # Story writing
│       ├── meeting-types            # Meeting cadences
│       └── product-triad            # Product, Design, Eng
│
├── ways-of-working/                 # WORKING WITH AI TAB - AI practices
│   ├── 1.environment-setup/         # Dev environment setup
│   ├── 2.claude-code/               # Claude Code basics
│   ├── 3.claude-code-advanced/      # Advanced Claude techniques
│   │   └── mcp/                     # MCP server documentation
│   └── spec-driven-development/     # SpecKit commands
│
├── features/                        # FEATURES TAB - Product features
│   ├── domains/                     # Feature domain docs
│   │   ├── bill-processing          # Bill processing
│   │   ├── budget                   # Budget management
│   │   ├── care-plan                # Care planning
│   │   ├── claims                   # Claims processing
│   │   ├── contributions            # Client contributions
│   │   ├── coordinator-portal       # Coordinator features
│   │   ├── documents                # Document management
│   │   ├── lead-management          # Lead/sales
│   │   ├── supplier                 # Supplier management
│   │   ├── task-management          # Tasks/work management
│   │   └── utilisation              # Budget utilisation
│   ├── tools/                       # Software tools we use
│   │   ├── databricks, posthog, redis, algolia, etc.
│   └── integrations/                # External integrations
│       ├── myob, twilio, zoho, services-australia, etc.
│
├── context/                         # CONTEXT TAB - Business knowledge
│   ├── glossary/                    # Domain terminology
│   │   ├── support-at-home          # SAH terms
│   │   ├── internal-development     # Dev terms
│   │   ├── trilogy-terminology      # Company terms
│   │   └── product-technical        # Technical terms
│   ├── 4.Meetings/                  # Meeting notes
│   ├── 5.Strategy/                  # Strategic context
│   │   ├── cpo-product              # CPO priorities
│   │   ├── cio-technology           # CIO priorities
│   │   ├── cfo-finance              # CFO priorities
│   │   └── ai-initiatives           # AI strategy
│   ├── 6.Industry/                  # Industry knowledge
│   │   ├── aged-care-manual         # Aged care rules
│   │   ├── support-at-home-101      # SAH overview
│   │   ├── personas                 # User personas
│   │   └── services-australia-api   # Government API
│   ├── 7.Competitors/               # Competitive intel
│   └── 8.BRP/                       # Big Room Planning
│       ├── BRP-2025-05-May
│       ├── BRP-2025-08-August
│       └── BRP-2026-01-January
│
├── initiatives/                     # INITIATIVES TAB - Active epics
│   ├── [Initiative-Name]/           # Initiative folder
│   │   └── [Epic-Name]/             # Epic folder
│   │       ├── IDEA-BRIEF.md        # Epic idea brief
│   │       ├── spec.md              # Technical spec
│   │       ├── meta.yaml            # Status metadata
│   │       └── context/             # Supporting context
│   │
│   ├── Work-Management/             # Work management epics
│   ├── Clinical-And-Care-Plan/      # Clinical epics
│   ├── Supplier-Management/         # Supplier epics
│   ├── Consumer-Mobile/             # Mobile app epics
│   ├── Consumer-Onboarding/         # Onboarding epics
│   ├── Budgets-And-Services/        # Budget epics
│   ├── Coordinator-Management/      # Coordinator epics
│   └── ADHOC/                       # Ad-hoc/misc epics
│
└── developer-docs/                  # DEVELOPER DOCS TAB - Technical
    ├── architecture/                # System architecture
    ├── apis/                        # API documentation
    ├── database/                    # DB schemas, migrations
    ├── services/                    # Service documentation
    ├── components/                  # Frontend components
    ├── infrastructure/              # Infra, deployment
    ├── security/                    # Security docs
    ├── testing/                     # Testing guides
    └── decisions/                   # ADRs (Architecture Decision Records)
```

## Where to Put New Content

### Non-Initiative Content (Regular Docs)

| Content Type | Location | Example |
|--------------|----------|---------|
| **Onboarding & Getting Started** | `overview/1.getting-started/` | New hire checklist |
| **Company info, culture, values** | `overview/2.how-trilogy-works/` | Team update, culture doc |
| **Strategic direction** | `overview/3.foundations/` | New product strategy |
| **Engineering practices** | `overview/4.team-practices/` | New process doc |
| **AI/Claude techniques** | `ways-of-working/2.claude-code/` or `3.claude-code-advanced/` | New Claude tip |
| **Environment setup** | `ways-of-working/1.environment-setup/` | New tool setup |
| **SpecKit skills** | `ways-of-working/spec-driven-development/` | New skill documentation |
| **Product feature docs** | `features/domains/` | Feature documentation |
| **Tool documentation** | `features/tools/` | Databricks, PostHog, etc. |
| **Integration docs** | `features/integrations/` | MYOB, Twilio, Zoho |
| **Domain terminology** | `context/glossary/` | New business term |
| **Meeting notes** | `context/4.Meetings/` | Meeting summary |
| **Leadership priorities** | `context/5.Strategy/` | CxO priorities |
| **Industry knowledge** | `context/6.Industry/` | Aged care info, SAH rules |
| **Competitor info** | `context/7.Competitors/` | Competitive analysis |
| **Quarterly planning** | `context/8.BRP/` | Big Room Planning notes |
| **System architecture** | `developer-docs/architecture/` | Architecture doc |
| **API documentation** | `developer-docs/apis/` | API endpoint docs |
| **Database schemas** | `developer-docs/database/` | DB documentation |
| **Testing guides** | `developer-docs/testing/` | Test strategy |
| **Architecture decisions** | `developer-docs/decisions/` | ADRs |

### Initiative Content (Epics & Features)

| Content Type | Location | Notes |
|--------------|----------|-------|
| **New initiative** | `initiatives/[Initiative-Name]/` | Create folder with index.md |
| **New epic** | `initiatives/[Initiative]/[Epic-Name]/` | Create folder with IDEA-BRIEF.md |
| **Epic idea brief** | `initiatives/.../IDEA-BRIEF.md` | Required for each epic |
| **Technical spec** | `initiatives/.../spec.md` | Technical specification |
| **Epic status** | `initiatives/.../meta.yaml` | Status: in progress, planning, etc. |
| **Supporting context** | `initiatives/.../context/` | Raw context, research |

## File Naming Conventions

- **Folders**: Use kebab-case with number prefix for ordering: `1.getting-started/`
- **Files**: Use kebab-case: `my-document.md`
- **Numbered ordering**: `01-first.md`, `02-second.md`
- **Index files**: `index.md` for section landing pages
- **Special files**:
  - `IDEA-BRIEF.md` - Epic idea briefs (uppercase)
  - `meta.yaml` - Status metadata for initiatives
  - `spec.md` - Technical specifications

## Frontmatter Template

```yaml
---
title: "Document Title"
description: "Brief description for search and preview"
---
```

### For Initiatives (meta.yaml)

```yaml
title: "Epic Name"
description: "Brief description"
status: "in progress"  # planning, in progress, peer review, done, backlog
jira_key: "TP-1234"    # Optional
```

## Content Guidelines

### DO:
- ✓ Use absolute paths for internal links: `[Budget](/features/domains/budget)`
- ✓ Include frontmatter with title and description
- ✓ Use numbered prefixes for ordering within folders
- ✓ Check for existing docs before creating new ones
- ✓ Keep documents focused and concise

### DON'T:
- ✗ Use relative paths: `./budget` or `../features`
- ✗ Create deeply nested structures (max 3 levels)
- ✗ Duplicate content across sections
- ✗ Create empty index files without content

## Quick Decision Guide

**"Where does this go?"**

1. **Is it about a specific feature we're building?** → `initiatives/`
2. **Is it about how we work as a team?** → `overview/4.team-practices/`
3. **Is it about using Claude/AI?** → `ways-of-working/`
4. **Is it about a product feature already shipped?** → `features/domains/`
5. **Is it business/domain knowledge?** → `context/`
6. **Is it technical architecture/code?** → `developer-docs/`
7. **Is it company info/culture?** → `overview/2.how-trilogy-works/`

## Execution Flow

1. **Identify content type** - What kind of document is this?
2. **Find correct location** - Use the structure guide above
3. **Check for existing** - Is there already a similar doc?
4. **Create/update file** - Follow naming and frontmatter conventions
5. **Verify navigation** - Check that new content appears in sidebar

## Example Usage

```bash
# Ask where to put something
/trilogy.docs-maintain "Where should I document our new sprint estimation process?"

# Create new documentation
/trilogy.docs-maintain "Add a new glossary entry for 'Service Booking'"

# Reorganize existing docs
/trilogy.docs-maintain "Move the old API docs to developer-docs"
```
