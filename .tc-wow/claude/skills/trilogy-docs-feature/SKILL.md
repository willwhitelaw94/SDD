---
name: trilogy-docs-feature
description: >-
  Documents and enriches TC Portal feature domains by exploring the codebase, extracting technical patterns,
  and synthesizing knowledge. Use when creating new feature docs, enriching existing domains with codebase
  insights, or updating documentation from epic context or conversations. Intelligently decides where
  information belongs (domain doc vs initiative docs).
metadata:
  version: 1.0.0
  type: agent
---

# Trilogy Docs Feature Skill

An **agent-based** skill that explores the codebase to document features with colour and depth, and intelligently maintains feature documentation across domain docs and initiative contexts.

## Overview

This skill:

- **Explores the codebase** to understand how a feature actually works (models, controllers, pages, routes, services)
- **Enriches documentation** with technical patterns, architecture insights, and real code references
- **Updates intelligently** - knows whether to update domain docs or initiative/epic docs based on content type
- **Synthesizes knowledge** from conversations, epics, and exploration into the right documentation location

## When to Use

Activate this skill when:

- **Documenting a new feature domain** - research codebase and create comprehensive domain doc
- **Enriching existing domain docs** - add technical depth, code references, architectural insights
- **Updating from epic work** - incorporate learnings from initiative work back into domain docs
- **Consolidating conversation insights** - capture decisions, patterns, or discoveries into documentation
- **Auditing documentation** - verify docs match actual implementation

## Inputs

| Input | Description | Example |
|-------|-------------|---------|
| `domain` | Feature domain to document | "task-management", "bill-processing", "notes" |
| `mode` | Operation mode | `create`, `enrich`, `update`, `audit` |
| `source` | Context source for updates | epic path, conversation summary, or "codebase" |
| `focus` | Specific aspect to document | "technical", "capabilities", "architecture", "all" |

## Documentation Locations

### Where Information Goes

| Content Type | Location | Example |
|--------------|----------|---------|
| **Domain overview, concepts, capabilities** | `.tc-docs/content/features/domains/{domain}.md` | Core feature documentation |
| **Technical architecture deep-dive** | `.tc-docs/content/developer-docs/architecture/{domain}/` | Detailed technical docs |
| **Epic-specific implementation details** | `.tc-docs/content/initiatives/{initiative}/{epic}/` | Scoped to that epic |
| **API documentation** | `.tc-docs/content/developer-docs/apis/{domain}/` | Endpoint documentation |
| **Component library entries** | `.tc-docs/content/developer-docs/components/{domain}/` | Reusable UI components |

### Decision Logic

```
IS THIS INFORMATION...

├─ Broadly applicable to understanding the domain?
│  └─ YES → Domain doc: features/domains/{domain}.md
│
├─ Specific to a current epic/initiative?
│  └─ YES → Initiative: initiatives/{initiative}/{epic}/
│
├─ Deep technical architecture that developers need?
│  └─ YES → Developer docs: developer-docs/architecture/{domain}/
│
├─ API endpoint documentation?
│  └─ YES → Developer docs: developer-docs/apis/{domain}/
│
└─ Reusable component documentation?
   └─ YES → Developer docs: developer-docs/components/{domain}/
```

## Domain Documentation Template

Every domain doc follows this structure:

```markdown
---
title: "{Domain Name}"
description: "{One-line description for search/SEO}"
---

> {Tagline - brief compelling description}

---

## Overview

{2-3 paragraphs explaining what this domain does, why it exists, and its role in the portal}

---

## Problem Statement (if applicable)

{What user pain points does this solve? What was broken before?}

---

## Solution Overview (if applicable)

{High-level description of the solution approach}

---

## Key Concepts

| Concept | Description |
|---------|-------------|
| **{Term 1}** | {Definition} |
| **{Term 2}** | {Definition} |

---

## Key Capabilities

| Capability | Description |
|------------|-------------|
| **{Capability 1}** | {What users can do} |
| **{Capability 2}** | {What users can do} |

---

## User Personas

| Persona | Usage |
|---------|-------|
| **{Persona 1}** | {How they use this feature} |
| **{Persona 2}** | {How they use this feature} |

---

## Technical Components

```
app/Domain/{Domain}/ (or app/Models/, app/Http/, etc.)
├── Models/
│   ├── {Model}.php
│   └── ...
├── Actions/
│   └── ...
├── Events/
│   └── ...

resources/js/Pages/{Domain}/
├── Index.vue
├── components/
│   └── ...
└── composables/
    └── ...
```

### Models

| Model | Purpose | Key Relationships |
|-------|---------|-------------------|
| `{Model}` | {What it represents} | belongsTo X, hasMany Y |

### Controllers

| Controller | Routes | Purpose |
|------------|--------|---------|
| `{Controller}` | `/path/...` | {What it handles} |

### Key Services/Actions

| Service/Action | Purpose |
|----------------|---------|
| `{Action}` | {What it does} |

---

## Data Flow

{Describe how data flows through the system for key operations}

---

## AI Opportunities

- {Opportunity 1}
- {Opportunity 2}

---

## Related Features

- [{Related Domain 1}](/features/domains/{related-1})
- [{Related Domain 2}](/features/domains/{related-2})

---

## Epic Documentation (if applicable)

For detailed specifications and implementation plans, see:
`content/initiatives/{Initiative}/{Epic}/`

---

## Status

**Maturity**: {Production | In Development (Phase X) | Planned}
**Initiative**: {Initiative name and code if applicable}
**Epic**: {Epic code if applicable}
**Squad**: {Squad name}
**Owner**: {Owner name if applicable}
```

## Execution Flow

### Mode: Create

1. **Identify codebase components**
   - Search for models: `app/Models/{Domain}*.php`, `app/Domain/{Domain}/`
   - Search for controllers: `app/Http/Controllers/*{Domain}*`
   - Search for pages: `resources/js/Pages/{Domain}/`
   - Search for routes: `routes/web/*.php` for domain routes
   - Search for Nova resources: `app/Nova/{Domain}*.php`
   - Search for actions: `app/Actions/{Domain}*`

2. **Analyze code patterns**
   - Read model relationships and casts
   - Identify key business logic in actions/services
   - Map Vue pages and components
   - Document API routes and controllers

3. **Create domain doc**
   - Generate from template
   - Fill with discovered information
   - Add code references with file:line format

4. **Identify gaps**
   - Note undocumented areas
   - Flag inconsistencies between code and existing docs

### Mode: Enrich

1. **Read existing domain doc**
2. **Explore codebase for missing details**
3. **Update sections** with:
   - Actual model relationships (from reading Model files)
   - Real controller routes (from reading route files)
   - Component structure (from reading Vue files)
   - Technical patterns discovered

### Mode: Update (from epic/conversation)

1. **Identify source context**
   - If epic path: read epic docs for learnings
   - If conversation: extract key decisions and patterns

2. **Classify information**
   - Domain-level → update domain doc
   - Epic-specific → keep in epic docs, add reference in domain doc
   - Technical deep-dive → create/update developer-docs

3. **Apply updates**
   - Update relevant sections
   - Maintain doc structure
   - Add cross-references

### Mode: Audit

1. **Read domain doc**
2. **Verify against codebase**
   - Check if documented components exist
   - Check if code components are documented
   - Verify technical accuracy
3. **Report discrepancies**
4. **Optionally fix**

## Sub-Agent Prompts

### Codebase Exploration Agent

```
You are exploring the codebase to document the "{DOMAIN}" feature.

Search for and read:
1. Models: Glob for `app/Models/{Domain}*.php` and `app/Domain/{Domain}/**/*.php`
2. Controllers: Grep for class names containing "{Domain}"
3. Pages: Glob for `resources/js/Pages/{Domain}/**/*.vue`
4. Routes: Grep in routes/ for "{domain}" paths
5. Nova: Glob for `app/Nova/{Domain}*.php`
6. Actions: Glob for `app/Actions/*{Domain}*`

For each file found:
- Read the file
- Extract: class name, purpose, relationships, key methods
- Note file path and line numbers for key elements

Return a structured summary of the domain's technical landscape.
```

### Documentation Classifier Agent

```
Given this information:
{CONTENT}

Classify where it should be documented:

1. **Domain doc** (features/domains/{domain}.md) if:
   - It's about core concepts, capabilities, user personas
   - It explains what the feature does at a high level
   - It's stable knowledge unlikely to change with individual epics

2. **Initiative/Epic docs** if:
   - It's specific to current implementation work
   - It contains sprint-level details
   - It may change as the epic evolves

3. **Developer docs** if:
   - It's deep technical architecture
   - It's API documentation
   - It's component library documentation

Return: location, section to update, and reason.
```

## Usage Examples

**Create new domain documentation:**
```
/trilogy-docs-feature task-management create
```

**Enrich existing domain with codebase insights:**
```
/trilogy-docs-feature notes enrich --focus technical
```

**Update domain doc from epic learnings:**
```
/trilogy-docs-feature care-plan update --source .tc-docs/content/initiatives/Clinical-And-Care-Plan/Risk-Management/
```

**Update from conversation insights:**
```
/trilogy-docs-feature supplier update --source "conversation"
```
(Will ask you to summarize the key learnings to document)

**Audit documentation accuracy:**
```
/trilogy-docs-feature bill-processing audit
```

## Output

The skill will:
1. **Create/update** the appropriate documentation files
2. **Report** what was changed and why
3. **Suggest** additional documentation opportunities discovered
4. **Flag** any inconsistencies or gaps found

## Integration with Other Skills

- **After `/trilogy-research`** - Document findings into domain docs
- **After epic completion** - Run update mode to capture learnings
- **With `/trilogy-docs-write`** - Follows same conventions and locations
- **Before `/speckit-specify`** - Ensure domain docs are current for context
