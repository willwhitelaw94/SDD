---
name: trilogy-learn
description: Interactive context loading for TC Portal. Ask what you want to learn from (Features, Code, Teams, Linear, Fireflies, etc.) then load context and start exploratory work.
---

# Trilogy Learn Skill

Smart context loading for TC Portal. This skill helps you understand the portal by asking what you want to learn from, then loading relevant context and starting exploratory work.

## Knowledge Hierarchy

Learn uses a layered approach to load context:

```
1. Domains (Primary)     → /features/domains/         → 31 portal features
2. Important Concepts    → /features/concepts/        → Regulatory frameworks, care pathways
3. Integrations          → /features/integrations/    → External systems (MYOB, Zoho, etc.)
4. Context (Strategy)    → /context/                  → Business strategy, industry, competitors
5. Industry/Regulatory   → /context/6.Industry/       → Support at Home manual, aged care
6. Codebase (Ask First)  → Explore agent              → Implementation details
```

Start with **Domains** for operational knowledge, then layer in concepts and strategy as needed.

**Important:** For industry-related questions (funding, regulations, government requirements), reference the **Support at Home Program Manual** at `/context/government-resources/support-at-home-program-manual-v4.2.txt`.

**Codebase exploration** should only happen after asking the user if they want to dig into implementation details.

---

## How It Works

### Step 1: Choose Your Learning Source

When you run `/learn`, you'll be asked which source you want to learn from:

**🔥 [Recommended] Domains** — Core portal features (31 domains)
- Budget, Bills, Claims, Collections, Complaints, Care Plan, Tasks, Notes, etc.
- **Best for**: Understanding operational flows and portal functionality

**Important Concepts** — Regulatory frameworks and care pathways
- Self-Management, Service Cessation, AT-HM, Restorative Care, End-of-Life
- Compliance, GST & Tax, Data Quality
- **Best for**: Understanding business rules and Support at Home requirements

**Integrations** — External systems
- MYOB, Zoho, Klaviyo, Aircall, Twilio, etc.
- **Best for**: Understanding how the portal connects to external systems

**Context (Strategy)** — Business context and industry knowledge
- Strategy, Industry, Competitors, BRP sessions, Glossary
- **Best for**: Understanding the business landscape and strategic direction

**Code** — Explore the codebase directly (ask user first)
- Launches Explore agent to search and understand code
- **Always ask user before diving into code** - they may just need docs
- **Best for**: Understanding implementation patterns and architecture

**Industry/Regulatory** — Support at Home manual and aged care context
- Official government program manual (v4.2)
- Aged care industry overview, personas
- **Best for**: Funding rules, regulatory requirements, government policies

**Linear/Epics** — Load from existing issues
- Paste Linear issue URL or epic ID
- **Best for**: Implementation context and requirements

**Teams Messages** — Load from chat history
- Paste Teams message link or ID
- **Best for**: Understanding decisions and team context

**Fireflies** — Load meeting transcripts
- Paste Fireflies transcript link
- **Best for**: Meeting decisions and business rationale

**Paste Content** — Copy-paste context directly
- Paste code, specifications, requirements, etc.
- **Best for**: Analyzing custom content

### Step 2: Load Context

Based on your choice, the skill will:

**🔥 If Domains Selected (Recommended):**
- Read files from: `.tc-docs/content/features/domains/`
- Get operational domain knowledge for all 31 portal features
- **Result**: You'll understand how every major feature works

**If Important Concepts Selected:**
- Read files from: `.tc-docs/content/features/concepts/`
- Get regulatory frameworks, care pathways (Ch 11-15), compliance rules
- **Result**: You'll understand Support at Home business rules

**If Integrations Selected:**
- Read files from: `.tc-docs/content/features/integrations/`
- Get external system integration details
- **Result**: You'll understand how external systems connect

**If Context/Strategy Selected:**
- Read files from: `.tc-docs/content/context/`
- Get business strategy, industry knowledge, competitor analysis
- **Result**: You'll understand the business landscape

**If Industry/Regulatory Selected:**
- Read the Support at Home Program Manual (v4.2) from: `.tc-docs/content/context/government-resources/support-at-home-program-manual-v4.2.txt`
- Load aged care context from: `.tc-docs/content/context/6.Industry/`
- **Result**: Understanding of government requirements and funding rules
- **Next step**: Suggest running `/research` to gather business context from Teams, Fireflies, and Linear

**If Code Selected (Ask User First):**
- **First ask**: "Do you want me to explore the codebase for implementation details?"
- If yes, launch Explore agent to search codebase
- Ask for specific area or feature to investigate
- **Result**: Deep understanding of implementation patterns

**If Linear/Epics Selected:**
- Fetch and load epic specifications
- Extract requirements and implementation details
- **Result**: Understand what needs to be built

**If Teams Messages:**
- Fetch and load chat history
- Extract key decisions and context
- **Result**: Understand team decisions and rationale

**If Fireflies Selected:**
- Fetch meeting transcript
- Extract decisions and business context
- **Result**: Meeting decisions and strategic thinking

**If Paste Content:**
- Wait for your input
- Process and analyze the content
- **Result**: Custom content analysis

### Step 3: Learn & Work

After loading context:
1. Summarize what was learned
2. Ask what you want to work on
3. Begin exploratory work or proceed with your task

## Available Context Paths

Full documentation structure:

```
.tc-docs/content/
├── features/
│   ├── domains/                    ← 31 portal features
│   │   ├── bill-processing.md
│   │   ├── budget.md
│   │   ├── claims.md
│   │   ├── collections.md
│   │   ├── complaints.md
│   │   ├── care-plan.md
│   │   ├── coordinator-portal.md
│   │   ├── task-management.md
│   │   ├── ... (31 total)
│   │   └── index.md
│   ├── concepts/                   ← Regulatory & care pathways
│   │   ├── self-management.md         (Ch 11)
│   │   ├── service-cessation.md       (Ch 12)
│   │   ├── assistive-technology-home-modifications.md (Ch 13)
│   │   ├── restorative-care-pathway.md (Ch 14)
│   │   ├── end-of-life-pathway.md     (Ch 15)
│   │   ├── compliance.md
│   │   ├── gst-tax.md
│   │   ├── data-quality.md
│   │   └── index.md
│   └── integrations/               ← External systems
│       ├── myob-acumatica.md
│       ├── zoho-crm.md
│       ├── klaviyo.md
│       ├── aircall.md
│       └── index.md
├── context/                        ← Strategy & industry
│   ├── 5.Strategy/
│   ├── 6.Industry/                 ← Aged care, Support at Home 101
│   │   ├── support-at-home-101.md
│   │   ├── support-at-home-context.md
│   │   ├── aged-care-manual.md
│   │   └── personas.md
│   ├── 7.Competitors/
│   ├── 8.BRP/
│   ├── glossary/
│   │   └── 01-support-at-home.md   ← SaH glossary
│   └── government-resources/
│       └── support-at-home-program-manual-v4.2.txt  ← Official manual
├── ways-of-working/                ← Team practices & tools
│   ├── tools/
│   ├── 4.team-practices/
│   └── ...
└── initiatives/                    ← Active epics
```

## Usage Examples

- `/learn` → Choose your learning source interactively
- `/learn domains` → Load all 31 domain features
- `/learn concepts` → Load regulatory frameworks and care pathways
- `/learn integrations` → Load external system details
- `/learn context` → Load business strategy and industry
- `/learn industry` → Load Support at Home manual and aged care context
- `/learn code supplier` → Explore supplier code (asks permission first)
- `/learn teams` → Load from Teams messages
- `/learn linear TP-3652` → Load specific epic
- `/learn fireflies` → Load meeting transcript
- `/learn paste` → Wait for you to paste content

## After Learning

Once context is loaded:

1. **Summarized what you learned** about the portal/feature/code
2. **Asked what you want to work on** (or proceeded with your original task)
3. **Ready for exploratory work** — Ask me questions, search code, understand features

## Following Up with /research

After loading documentation context, you may want deeper business context. The `/research` skill gathers insights from live sources:

**When to suggest /research:**
- After reading **Industry/Regulatory** content — to understand how TC Portal interprets the rules
- After reading **Domains** — to find recent decisions or changes discussed in meetings
- When documentation seems incomplete — to find tribal knowledge in Teams/Fireflies

**Example flow:**
```
/learn industry                    → Load Support at Home manual
[Read regulatory requirements]
/research self-management fees     → Gather business context from Fireflies, Teams, Linear
[Get stakeholder decisions, implementation discussions]
```

> **Tip:** `/research` can optionally spawn parallel sub-agents for comprehensive research, but this uses significantly more tokens. For quick lookups, sequential search is more efficient.

---

## Pro Tips

- **Domains first** — Start with Domains for operational/feature knowledge
- **Layer concepts** — Add Important Concepts for regulatory understanding
- **Industry for rules** — Use Industry/Regulatory for government requirements and funding rules
- **Follow up with /research** — Get business context from Teams, Fireflies, Linear
- **Context for strategy** — Use Context when you need business/industry background
- **Combine sources** — Learn from domains + code + teams messages for full picture
- **JIRA for specs** — Use JIRA/Epics when implementing features
- **Teams for decisions** — Load Teams messages to understand why decisions were made
- **Code last** — Only explore code after asking user; they may just need documentation
- **Support at Home manual** — Reference for any funding, eligibility, or regulatory questions
