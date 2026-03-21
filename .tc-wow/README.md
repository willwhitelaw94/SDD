# TC WoW (Ways of Working)

A shared specification-driven development toolkit for Trilogy Care projects. This repository provides Claude Code skills, document templates, and organizational knowledge that can be used across multiple projects (tc-portal, tc-applications, etc.).

## Overview

TC WoW extends [GitHub's Spec-Kit](https://github.com/github/spec-kit) methodology with Trilogy Care-specific workflows, integrations, and domain knowledge. It separates **shared tooling** (skills, templates) from **project-specific content** (initiatives, local configurations).

---

## Installation

### Option 1: Git Submodule (Recommended)

```bash
# In your target project (e.g., tc-portal)
git submodule add git@github.com:Trilogy-Care/tc-wow.git .tc-wow
bash .tc-wow/install.sh
```

### Option 2: Clone and Symlink

```bash
# Clone to a shared location
git clone git@github.com:Trilogy-Care/tc-wow.git ~/tc-wow

# In your target project
bash ~/tc-wow/install.sh /path/to/your/project
```

### What the installer does

- Creates `.specify/`, `.claude/` directories
- Links individual files from tc-wow to your project
- Backs up any existing files with the same name to `.backup/`
- Copies `constitution.md` template if not present

---

## Quick Start

```bash
# Learn business context first
/trilogy.learn

# Start a new feature
/trilogy.idea "feature description"
/speckit.specify
/speckit.plan
/speckit.tasks
/trilogy.jira-sync push all
/speckit.implement

# Ship a release
/trilogy.ship
```

---

## Directory Structure

```
tc-wow/
|-- README.md                     # This file
|-- install.sh                    # Installation script for target projects
|
|-- claude/                       # Claude Code configuration
|   |-- skills/                   # Skills (preferred over slash commands)
|   |   |-- speckit-*/            # Core spec-driven development skills
|   |   +-- trilogy-*/            # Trilogy-specific business skills
|   +-- mcp/                      # MCP server configuration guides
|       |-- atlassian.md
|       |-- laravel-boost.md
|       |-- playwright.md
|       +-- herd.md
|
+-- specify/                      # Spec-Kit core components
    |-- memory/                   # Shared memory (constitution templates)
    |-- templates/                # Document templates
    |   |-- spec.md               # Specification template
    |   |-- plan-template.md      # Implementation plan template
    |   |-- tasks-template.md     # Task breakdown template
    |   |-- idea.md               # Idea brief template
    |   |-- design-spec.md        # UI/UX design spec template
    |   +-- checklist-template.md
    +-- scripts/                  # Helper scripts
        +-- bash/
```

> **Note:** We use Skills instead of slash commands. Skills can be auto-invoked by Claude and support richer metadata. See `.tc-docs/content/ways-of-working/3.claude-code-advanced/01-extending-claude.md` for details.

---

## Target Project Structure

After installation, your project (e.g., tc-portal) will have:

```
your-project/
|-- .tc-wow/                      # [Submodule] TC WoW toolkit
|   |-- claude/                   # Skills, MCP configs
|   +-- specify/                  # Templates, scripts, memory
|-- .tc-docs/                     # [Submodule] Shared documentation
|   +-- content/                  # Documentation content
|       |-- initiatives/          # Epic/feature tracking
|       |   +-- TP-xxxx-*/        # Individual epics
|-- .claude/                      # Symlinks → .tc-wow/claude/*
|   +-- skills/
|-- .specify/                     # Symlinks → .tc-wow/specify/*
|   |-- memory/
|   |-- templates/
|   +-- scripts/
|-- CLAUDE.md                     # Project-specific Claude instructions
+-- ...
```

**Submodule summary:**
| Directory | Type | Purpose |
|-----------|------|---------|
| `.tc-wow/` | Submodule | Shared toolkit (skills, templates, scripts) |
| `.tc-docs/` | Submodule | Shared documentation across projects |
| `.tc-docs/content/` | Directory | Documentation content including initiatives |
	
---

## Architecture Philosophy

This workspace follows a **skills-first architecture**:
- **Skills over commands**: Skills can be auto-invoked by Claude and support richer metadata
- **Template-driven**: All artifacts use standardized templates from `.specify/templates/`
- **Modular structure**: Clear separation between skills, templates, and data
- **Easy to extend**: Add new skills by creating folders in `claude/skills/`

---

## Skill Namespaces

Skills are organized into two namespaces:

### /trilogy.* - Stakeholder & Business Skills

These skills focus on **business artifacts, Linear sync, and stakeholder communication**:

| Skill | Description |
|-------|-------------|
| /trilogy.learn | Load TC business context before starting work |
| /trilogy.idea | Create idea brief for a new feature (epic folder) |
| /trilogy.ask | Search knowledge bases for answers |
| /trilogy.clarify-business | Clarify business outcomes, success metrics, stakeholder alignment |
| /trilogy.clarify-design | Clarify UI/UX design decisions for a feature |
| /trilogy.clarify-db | Clarify database design decisions (schema, relationships, performance) |
| /trilogy.flow-diagram | Generate visual user flow diagrams from spec.md |
| /trilogy.mockup | Create ASCII UI mockups (5-10 variations) |
| /trilogy.stories | Extract user stories from spec.md to stories.json |
| /trilogy.linear-sync | Sync stories and tasks to Linear |
| /trilogy.teams-summary | Capture epic progress and decisions from Teams chat history |
| /trilogy.track | Track epic progress from Linear |
| /trilogy.raci | Generate RACI matrix for stakeholders |
| /trilogy.train | Analyze workflow efficiency |
| /trilogy.ship | Ship release with changelog |
| /trilogy.figma-capture | Capture a live Portal page and push to Figma (new file, existing file, or clipboard) |
| /trilogy.idea-spawn | Generate interactive ideas board from epic docs — 40-60 domain ideas, voting, MoSCoW Kanban, value matrix, session export prompt |
| /trilogy.setup-mcp | Configure MCP servers |

### /speckit.* - Developer & Implementation Skills

These skills focus on **technical specifications and implementation**:

| Skill | Description |
|---------|-------------|
| /speckit.specify | Create spec.md with requirements and user scenarios |
| /speckit.clarify | Ask clarifying questions about underspecified areas |
| /speckit.clarify-development | Clarify technical strategy and implementation approach in plan.md |
| /speckit.plan | Create plan.md (technical implementation plan) |
| /speckit.erd | Generate Entity-Relationship Diagrams from db-spec.md |
| /speckit.tasks | Generate tasks.md with actionable implementation steps |
| /speckit.implement | Execute tasks and build the feature |
| /speckit.peer-review | Peer review code for quality, complexity, and Laravel conventions |
| /speckit.qa | Run parallel QA checks (code quality, tests, security, docs) |
| /speckit.checklist | Generate implementation checklist |
| /speckit.analyze | Cross-artifact consistency check |
| /speckit.constitution | Create/update project constitution |
| /speckit.plan-test | Generate test plan |
| /speckit.taskstoissues | Convert tasks to GitHub issues |

---

## Stage Agents

Agents are autonomous orchestrators that chain multiple skills through a pipeline stage. Skills are atoms, agents are molecules. Each agent lives in `.tc-wow/claude/agents/` and is symlinked to `.claude/agents/` on install.

### Pipeline Agents (Sequential)

| Agent | Stage | Gate | Description |
|-------|-------|------|-------------|
| planning-agent | Idea + Spec | Gate 0, 1 | Chains idea → specify → clarify → spec handover |
| design-agent | Design | Gate 2 | Chains design brief → research → mockups → design handover |
| dev-agent | Development | Gate 3, 4 | Plans architecture, spawns agent team (backend + frontend + testing) |
| qa-agent | QA | Gate 5 | Chains QA plan → browser testing → fix/retest → codify → QA handover |
| release-agent | Release | Gate 6 | Release notes → documentation → release gate |

### Teammate Agents (Spawned by dev-agent)

| Agent | Role | Scope |
|-------|------|-------|
| backend-agent | Laravel PHP | `domain/`, `app/`, `database/`, `tests/` |
| frontend-agent | Vue 3 / Inertia | `resources/js/` |
| testing-agent | Pest / Chrome DevTools | `tests/`, browser verification |

### Utility Agents

| Agent | Description |
|-------|-------------|
| research-agent | Gathers context from Fireflies, Linear, web, codebase — available to any stage |

---

## Full Workflow

Each section ends with a gate handover skill that validates completeness and transitions the epic in Linear.

```
── Idea ──────────────────────────────────────────────────────────
/trilogy.learn                → load business context
/trilogy.idea                 → idea-brief.md (problem, solution, RACI)
/trilogy.idea-handover        → Gate 0 (Idea Gate: Create epic → Backlog)

── Specification ─────────────────────────────────────────────────
/speckit.specify              → spec.md (what to build)
/trilogy.clarify spec         → refine spec requirements
/trilogy.clarify business     → align on business objectives
/trilogy.clarify-db           → db-spec.md (database design decisions)
/trilogy.spec-handover        → Gate 1 (Business Gate: Backlog → Design)

── Design ────────────────────────────────────────────────────────
/trilogy.design               → design.md (design brief: users, principles, constraints)
/trilogy.design-research      → enrich design.md (competitive, audits — optional)
/trilogy.clarify-design       → design-spec.md (clarify UI/UX decisions)
/trilogy.mockup               → mockups/ (UI exploration — HTML or Vue)
/trilogy.design-handover      → Gate 2 (Design Gate: Design → Dev)

── Architecture ──────────────────────────────────────────────────
/speckit.clarify-development  → plan.md (clarify technical strategy)
/speckit.plan                 → enhance plan.md (technical plan)
/speckit.erd                  → db-schema.erd (optional)
                              → Gate 3 (Architecture: stays in Dev)

── Implementation ────────────────────────────────────────────────
/speckit.tasks                → tasks.md (implementation steps)
/trilogy.linear-sync push all → sync stories/tasks to Linear
/speckit.implement            → build the feature
/trilogy.figma-capture        → push built pages to Figma (optional)
/trilogy.pixel-perfect        → compare Figma design vs build (optional)
/speckit.peer-review          → review code quality (optional)
/trilogy.dev-handover         → Gate 4 (Code Quality: Dev → QA)

── QA ────────────────────────────────────────────────────────────
/speckit.qa                   → run parallel QA checks
/trilogy.qa-handover          → Gate 5 (QA: QA → Review)

── Release ───────────────────────────────────────────────────────
/trilogy.release              → Gate 6 (Release: Review → Completed)
```

### Step-by-Step

**Idea**
1. **/trilogy.learn** - Load business context (Overview, Strategy, Features)
2. **/trilogy.idea** - Create idea-brief.md in epic folder
3. **/trilogy.idea-handover** - Gate 0: validate idea brief, create Linear epic → Backlog

**Specification**
4. **/speckit.specify** - Create spec.md with user scenarios, requirements
5. **/speckit.clarify** (optional) - Resolve ambiguities in spec
6. **/trilogy.clarify-business** (recommended) - Clarify business outcomes → business-spec.md
7. **/trilogy.clarify-db** (recommended) - Clarify database design → db-spec.md
8. **/trilogy.spec-handover** - Gate 1: validate spec, transition Linear → Design

**Design**
9. **/trilogy.design** - Create design.md: users, principles, constraints, edge cases
10. **/trilogy.design-research** (optional) - Competitive research, implementation audits, success metrics
11. **/trilogy.clarify-design** (optional) - Clarify UI/UX decisions → design-spec.md
12. **/trilogy.mockup** - UI exploration (HTML mockups or Vue stubs)
12. **/trilogy.design-handover** - Gate 2: validate design, transition Linear → Dev

**Architecture**
13. **/speckit.clarify-development** (recommended) - Clarify technical strategy → plan.md
14. **/speckit.plan** - Enhance plan.md with detailed technical approach
15. **/speckit.erd** (optional) - Generate Entity-Relationship Diagrams → db-schema.erd

**Implementation**
16. **/speckit.tasks** - Generate tasks.md with implementation steps
17. **/trilogy.linear-sync push all** - Push stories and tasks to Linear
18. **/speckit.implement** - Execute tasks, build the feature
19. **/trilogy.figma-capture** (optional) - Push built pages to Figma for design review
20. **/trilogy.pixel-perfect** (optional) - Compare Figma design vs build, iterate fixes
21. **/speckit.peer-review** (optional) - Review and simplify code for quality
22. **/trilogy.dev-handover** - Gate 4: validate code quality, tests pass, create PR

**QA**
23. **/speckit.qa** (recommended) - Run comprehensive QA checks in parallel
24. **/trilogy.qa-handover** - Gate 5: validate QA, transition Linear → Review

**Release**
25. **/trilogy.release** - Gate 6: validate release readiness, transition Linear → Completed

---

## Epic Folder Structure

All SpecKit artifacts save to the initiatives epic folder:

```
.tc-docs/content/initiatives/[initiative-name]/TP-yyyy-ccc-epic/
|-- idea.md               # From /trilogy.idea
|-- spec.md               # From /speckit.specify
|-- business-spec.md      # From /trilogy.clarify-business
|-- db-spec.md            # From /trilogy.clarify-db
|-- db-schema.erd         # From /speckit.erd (ASCII + Mermaid ERD)
|-- design-spec.md        # From /trilogy.clarify-design
|-- plan.md               # From /speckit.plan
|-- tasks.md              # From /speckit.tasks
|-- teams-chat-summary.md # From /trilogy.teams-summary
|-- stories.json          # From /trilogy.stories
|-- meta.yaml             # Linear sync metadata + chat_id
+-- mockups/              # From /trilogy.mockup
    |-- form-variations.txt
    +-- summary.md
```

---

## What Goes Where

| Content Type | Location | Shared? |
|--------------|----------|---------|
| Skills | tc-wow/claude/skills/ | Yes |
| Document templates | tc-wow/specify/templates/ | Yes |
| MCP setup guides | tc-wow/claude/mcp/ | Yes |
| Epic/feature specs | project/.tc-docs/content/initiatives/ | No |
| Project-specific docs | project/.tc-docs/content/ | No |
| Local settings | project/.claude/settings.local.json | No |
| Project constitution | project/.specify/memory/constitution.md | No |

---

## Linear Integration

### Push to Linear

```bash
# Push stories from spec.md
/trilogy.linear-sync push stories

# Push tasks from tasks.md
/trilogy.linear-sync push tasks

# Push both
/trilogy.linear-sync push all
```

### Pull from Linear

```bash
# Pull single epic
/trilogy.linear-sync pull --epic TP-1904

# Pull all epics in initiative
/trilogy.linear-sync pull --initiative TP-1859
```
### Track Progress
```bash
/trilogy.track TP-1904
```

---

## Teams Integration

### Capture Chat Discussions

Extract key decisions, discussions, and progress from Teams chat directly into the epic documentation:

```bash
# Summarize Teams chat by ID
/trilogy.teams-summary "your-teams-chat-id"

# Or use chat ID stored in epic meta.yaml
/trilogy.teams-summary
```

This creates `teams-chat-summary.md` with:
- **Key decisions** from chat discussions
- **Technical discussions** and architecture choices
- **Requirements clarifications** and scope decisions
- **Risk identification** from team feedback
- **Progress updates** and blockers
- **Links** to Linear, design docs, specs mentioned in chat

### Update Epic Metadata

Chat ID is stored in `meta.yaml` for future reference:

```yaml
teams:
  chat_id: "19:long-chat-id@thread.skype"
  chat_url: "https://teams.microsoft.com/l/channel/..."
  last_summarized: "2025-12-16"
  participants:
    - name: Jane Doe
      role: "Product Manager"
    - name: John Smith
      role: "Lead Developer"
```

### Workflow
1. **Create epic** → `/trilogy.idea`
2. **Discuss in Teams** with team (kickoff, clarifications, decisions)
3. **Capture context** → `/trilogy.teams-summary "chat-id"`
4. **Create spec** → `/speckit.specify` (now informed by chat discussions)
5. **Continue building** with full context from chat history

---

## Tips

### Loading Context

Always load context before starting work:

```bash
/trilogy.learn                    # Overview only
/trilogy.learn strategy           # Overview + Strategy
/trilogy.learn strategy features  # Overview + Strategy + Features
```

### Quick Development

For simple tasks without full workflow:

```bash
/trilogy.learn
/speckit.implement "add dark mode toggle"
```

### Bug Fixes

```bash
/trilogy.learn
# Investigate and fix directly with speckit.implement
/speckit.implement "fix authentication bug in LoginController"
```

### Prototyping

For experimental work that might not become features:

```bash
# Create in sandbox first
.tc-docs/content/initiatives/ADHOC/my-experiment/

# Once validated, move to initiatives/
```

---

## Updating

### For Submodule Users

```bash
cd .tc-wow
git pull origin main
cd ..
git add .tc-wow
git commit -m "Update tc-wow"
```

### For Clone Users

```bash
cd ~/tc-wow
git pull origin main
```

### Removing and Re-adding the Submodule

If you need to completely remove the submodule and re-add it (e.g., to fix corruption or switch branches), run these commands from the project root:

```bash
# 1) Deinit the submodule (removes entry from .gitmodules and git config)
git submodule deinit -f -- .tc-wow

# 2) Remove from git index (keeps working directory files until next step)
git rm -f .tc-wow

# 3) Delete the submodule's cached directory in .git (critical - prevents "already exists" errors)
rm -rf .git/modules/.tc-wow

# 4) Remove the working directory
rm -rf .tc-wow

# 5) Remove symlinks and directories created by install.sh
rm -f .specify/scripts/bash/* .specify/templates/*
rm -f .claude/skills/* .claude/mcp/*

# 6) Re-add the submodule fresh
git submodule add git@github.com:Trilogy-Care/tc-wow.git .tc-wow

# 7) Re-run the installer
bash .tc-wow/install.sh

# 8) (Optional) Check for legacy .trilogy folder
# If upgrading from an older version, you may have a .trilogy/ folder that should be manually reviewed and removed
ls -la .trilogy 2>/dev/null && echo "⚠️  Legacy .trilogy/ folder found - please review and remove if no longer needed"
```

Or use this one-liner script:

```bash
git submodule deinit -f -- .tc-wow && git rm -f .tc-wow && rm -rf .git/modules/.tc-wow .tc-wow && rm -f .specify/scripts/bash/* .specify/templates/* .claude/skills/* .claude/mcp/* && git submodule add git@github.com:Trilogy-Care/tc-wow.git .tc-wow && bash .tc-wow/install.sh
```

---

## Contributing

1. Make changes in the tc-wow repository
2. Test in one project (e.g., tc-portal)
3. Create a PR with clear description
4. After merge, update submodules in all dependent projects

---

## Philosophy

This workspace follows a **skills-first architecture**:

- **Separation of concerns**: Shared tooling vs project-specific content
- **Single source of truth**: Skills and templates maintained in one place
- **Skills over commands**: Skills can be auto-invoked by Claude and support richer metadata
- **Template-driven**: All artifacts use standardized templates from `specify/templates/`
- **Easy updates**: Pull changes to get latest improvements across all projects
- **Project autonomy**: Each project controls its own initiatives and local config
- **Easy to extend**: Add new skills by creating folders in `claude/skills/`

---

## Version History

### v4.0 - Shared Repository (December 2025)

- Extracted from tc-portal into standalone tc-wow repository
- Separated shared content (commands, templates) from project-specific content (initiatives, brain)
- Added installation scripts for submodule/symlink setup

### v3.0 - DogFord Flattening (December 2025)

- Flattened architecture for simplicity
- Folder names changed to lowercase (brain, initiatives, sandbox)
- Added sandbox folder for experimental work
- Added idea-brief-template for consistent briefs

### v2.0 - SpecKit Integration (November 2025)

- Renamed all commands to `trilogy.*` and `speckit.*` namespaces
- All SpecKit artifacts save to initiatives epic folders
- Merged frontend/backend agents into `fullstack-developer`
- Unified Linear sync for stories AND tasks
- Added ASCII mockup generation

### v5.0 - Skills-First Architecture (January 2026)

- Migrated from slash commands to skills
- Removed `claude/commands/` directory entirely
- Skills support auto-invocation and richer metadata
- See `.tc-docs/content/ways-of-working/3.claude-code-advanced/01-extending-claude.md`

---

**Questions?** Ask Claude: "How do I [task]?" or check the skill files in `claude/skills/`
