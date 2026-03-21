---
title: Onboarding
description: Your complete onboarding guide for TC Portal development
icon: i-heroicons-rocket-launch
---

The purpose of this documentation is to get you up to speed as quickly as possible.

We believe **Context is King**. We want all our product and engineering team members thinking in terms of context—understanding the *why* behind what we build, not just the *how*.

---

## Our Development Workflow

Every feature follows this journey. You'll use these skills daily.

:workflow-map

---

## Squad-Specific Guides

| Squad | Guide |
|-------|-------|
| **Planning (BA/PO)** | [Plan Squad Onboarding](/overview/onboarding/01-plan-squad) |
| **Design** | [Design Squad Onboarding](/overview/onboarding/02-design-squad) |
| **Development** | [Dev Squad Onboarding](/overview/onboarding/03-dev-squad) |
| **Customer Success** | [Success Squad Onboarding](/overview/onboarding/04-success-squad) |

---

## How This Documentation Works

Most of this documentation is **written by AI agents** and **reviewed by humans**. This approach lets us maintain comprehensive, up-to-date docs without the manual overhead.

### Site Structure

| Section             | What's Inside                                      |
| ------------------- | -------------------------------------------------- |
| **Overview**        | Getting started, company info, principles          |
| **Features**        | Product docs, tools, integrations                  |
| **Ways of Working** | AI tooling, Claude Code, spec-driven development   |
| **Context**         | Knowledge base (strategy, industry, glossary, BRP) |
| **Initiatives**     | Active epics and project documentation             |
| **Developer Docs**  | Technical architecture for developers              |

### Adding Documentation

Use the `/trilogy.docs` command in Claude Code to create or organize documentation. This command knows where content should go, handles naming conventions, and checks for duplicates.

```bash
# Ask where something should go
/trilogy.docs "Where should I document our new API integration?"

# Create new documentation
/trilogy.docs "Add a glossary entry for 'Service Booking'"
```

To build and preview the docs site locally, use `/trilogy.docs-build`.

---

## Day 1: Context & Big Picture

### Morning: Orientation

**Time: 1-2 hours**

Start by understanding *why* and *how* we're building:

1. **Read**: [Working with AI](/ways-of-working/) — How AI shapes our development
2. **Read**: [Product Mission](/overview/foundations/01-product-mission/) — What Trilogy Care is trying to accomplish
3. **Skim**: [Strategic Goals](/overview/foundations/02-strategic-goals/) — Where we're headed

### Mid-morning: Project Structure

**Time: 1 hour**

Get oriented to the codebase:

1. **Clone the repo** and get it running locally (see [Installation](/ways-of-working/environment-setup/01-initial-setup))
2. **Understand the structure**:
   - `app/` — Laravel backend (models, controllers, services)
   - `resources/js/` — Vue 3 frontend (components, pages)
   - `database/` — Migrations and seeders
   - `tests/` — Pest test suite

### Afternoon: Domain Knowledge

**Time: 2-3 hours**

Aged care is a specific domain. Learn the basics:

1. **Read**: The Glossary — Start with these sections:
   - Government Programs & Funding (SAH, HCP, CHSP, IPA)
   - Service Groups (SERG categories)
   - Care Package Types
   - Budget & Funding Streams
2. **Deep dive**: Support at Home Context — The SAH program explained

### Late Afternoon: Meet the Team

**Time: 1-2 hours**

1. **Read**: [Departments](/overview/how-trilogy-works/06-departments) — Who does what
2. **Find**: Your manager and peers; join relevant Teams channels
3. Complete any remaining HR paperwork and compliance requirements

---

## Days 2-3: Technical Foundation

### Code Setup

**Time: 1-2 hours**

1. **Local dev environment**:
   ```bash
   git clone https://github.com/Trilogy-Care/tc-portal.git
   cd tc-portal
   composer install
   npm install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate:fresh --seed
   php artisan test   # Verify setup
   ```
2. **Access the app**:
   - Laravel Herd serves at `tc-portal.test`
   - Frontend at `https://tc-portal.test`
3. **Understand the stack**:

| Layer           | Technology                    |
| --------------- | ----------------------------- |
| **Backend**     | Laravel 12, PHP 8.3           |
| **Frontend**    | Vue 3, Inertia.js, TypeScript |
| **Styling**     | Tailwind CSS v3               |
| **Database**    | MySQL (Aurora in prod)        |
| **Cache/Queue** | Redis, Laravel Horizon        |
| **Search**      | Meilisearch                   |
| **Testing**     | Pest, Playwright              |

### First Code Review

**Time: 2-3 hours**

Pick a small feature and read the implementation:

1. **Choose**: A feature from the Features section — something simple like "Statements" or "Notes"
2. **Find**: The code:
   - **Controller**: `app/Http/Controllers/[Feature]Controller.php`
   - **Model**: `app/Models/[Feature].php`
   - **Frontend**: `resources/js/Pages/[Feature]/`
   - **Tests**: `tests/Feature/[Feature]Test.php`
3. **Trace**: A user action from Vue component → Inertia → Controller → DB query

### Development Workflow

**Time: 1 hour**

Understand how we work:

1. **Read**: [Working with AI](/ways-of-working/) overview
2. **Note**: We use `/trilogy.learn` before starting tasks with Claude Code

---

## Days 4-5: Deeper Dives

### Pick a Path

**Choose based on your role:**

#### If You're a Frontend Developer

1. **Vue & Inertia mastery**:
   - Read: [Inertia.js v2 docs](https://inertiajs.com)
   - Study: A complex component in `resources/js/Pages/`
   - Try: Building a simple form with validation
2. **Styling**:
   - Tailwind CSS patterns in the codebase
   - Dark mode support (existing components use `dark:` prefix)
   - Component reuse patterns
3. **First task**: Fix a UI bug or implement a small enhancement

#### If You're a Backend Developer

1. **Laravel fundamentals**:
   - Models & relationships (use `load()` to prevent N+1 queries)
   - Eloquent scopes and query builders
   - Form Requests for validation
   - API Resources for data transformation
2. **Domain logic**:
   - Budget Management — Core feature
   - Bill Processing — Complex workflow
   - Claims Management — External integrations
3. **First task**: Implement a small feature or fix
   - Start with database migrations
   - Move to models and relationships
   - Build controller action
   - Write tests using Pest

#### If You're a Product Manager

1. **Understanding the product**:
   - Read the Glossary thoroughly
   - Study: [Product Competitors](/context/strategic/market-intelligence/product-competitors/)
   - Deep dive: Care Plan feature
2. **Strategic context**:
   - [Strategic Goals](/overview/foundations/02-strategic-goals/)
   - Market Intelligence
   - Personas

#### If You're a Designer/Researcher

::callout{icon="i-lucide-palette"}
**See the full guide:** [Design Squad Onboarding](/overview/onboarding/02-design-squad) - Complete setup for designers including Figma, ceremonies, and domain owners.
::

1. **Design system**:
   - UI/UX Guidelines
   - Dark mode patterns
   - Component patterns in Vue
2. **User context**:
   - Personas
   - User research
3. **First task**:
   - Audit a feature for design consistency
   - Create mockups for a small enhancement
   - Pair with developers using Claude Code

### Join the Workflow

1. **First standup**: Share what you learned
2. **First code review**: Review a peer's PR; ask questions
3. **First contribution**: Submit a small PR (bug fix or doc improvement)

---

## Key Resources

### For Everyone

| Resource                                                     | Purpose                    |
| ------------------------------------------------------------ | -------------------------- |
| Glossary                                                     | Understand the domain      |
| [Foundations](/overview/foundations/)                        | Why we build the way we do |
| [Working with AI](/ways-of-working/)                         | How we execute             |

### For Developers

| Resource                                                            | Purpose                           |
| ------------------------------------------------------------------- | --------------------------------- |
| [Installation](/ways-of-working/environment-setup/01-initial-setup) | Setup guide                       |
| Feature Documentation                                               | Technical details on each feature |
| [Pest Testing](https://pestphp.com)                                 | Our testing framework             |

---

## Common Questions

**Q: I'm stuck—who should I ask?**
A: Ask in your team's Teams channel or reach out to your manager.

**Q: What does this acronym mean?**
A: See the Glossary.

**Q: How do I find the code for feature X?**
A: Read the feature doc; it usually has file locations.

**Q: How do I run the tests?**

```bash
php artisan test                          # All tests
php artisan test tests/Feature/[Name].php # Specific file
php artisan test --filter=testName        # Specific test
```

**Q: How do I use Claude to speed up development?**
A: Run `/trilogy.learn` first, then use Claude Code for your task.

---

## Checklist: Your First Week

- **Day 1 Morning**: Read foundations & mission
- **Day 1 Afternoon**: Learn domain basics (glossary, SAH)
- **Day 2**: Code setup, first code review
- **Day 3**: Understand development workflow
- **Day 4**: Deep dive by role (frontend/backend/product/design)
- **Day 5**: First contribution (code, docs, or review)
- **End of Week**: 1-on-1 with manager; ask what's next
- **Join**: Relevant Teams channels
- **Access**: JIRA; ask for board access if needed
- **Attend**: Next team standup

---

## Important Policies

Make sure to familiarise yourself with:

- Code of conduct
- Privacy and confidentiality requirements
- Health and safety procedures
- Leave and attendance policies

---

## Next Steps

After your first week:

1. **Pick a story** from the current sprint
2. **Read** the feature spec and implementation details
3. **Run** `/trilogy.learn` to get started with Claude Code
4. **Pair** with a senior engineer on your first PR
5. **Submit** your first code review feedback on a peer's PR

---

## Welcome!

You're joining a team focused on meaningful impact: helping coordinators serve older Australians better. You'll work with AI, modern tech, and real-world complexity.

Your onboarding doesn't end here. Keep learning. Ask questions. Improve what you find. And when you're up to speed, help the next person.

Welcome to Trilogy Care. Let's build something great.
