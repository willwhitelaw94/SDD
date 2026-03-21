# Design

## Paradigm Shift

Traditional software development often jumps straight to building. Design is an afterthought, or worse, just "making it pretty."

**The old way:**
```
Idea → Build → Hope it works
```

**The new way:**
```
Idea → Discover → Design → Build → Validate
```

The shift: **Do the thinking before the building.** Design isn't decoration - it's decision-making.

---

## Product Discovery

Product Discovery is about **reducing risk by doing research before building**. So we have confidence that we're solving meaningful problems in the best way.

We reduce risk by making sure we're:
- **Solving a meaningful problem** (desirable)
- **It works and makes sense for our business** (viable)
- **We can technically do it** (feasible)

The intersection of all three = **Value**.

```
        Desirability
            ○
           /|\
          / | \
         /  |  \
        / Value \
       ○---------○
   Viability   Feasibility
```

---

## Design Process Overview

| Phase | Purpose | Output | Skill |
|-------|---------|--------|-------|
| **1. Design Kickoff** | Strategic thinking before UI | `design.md` | `/trilogy-design` |
| **2. Mockups** | UI patterns and wireframes | `design/mockups/` | `/trilogy-mockup` |
| **3. Design Handover** | Gate 2 - Ready for dev | Approval | `/trilogy-design-handover` |

---

## Phase 1: Design Kickoff

The Design Kickoff happens **before** any UI work. It's about understanding the problem deeply and making strategic decisions.

### What Gets Answered

| Section | Question | DVF |
|---------|----------|-----|
| **User Research** | Who uses this? How often? What context? | Desirability |
| **Competitive Research** | How do other apps solve this? | Feasibility |
| **Design Principles** | What's our north star? | Desirability |
| **Emotional Design** | How should users feel? | Desirability |
| **Build Size** | Toyota Camry or Ferrari? | Feasibility |
| **Accessibility** | WCAG requirements? | Feasibility |
| **Edge Cases** | What could go wrong? | Feasibility |
| **Analytics** | How do we measure success? | Viability |
| **Phased Rollout** | MVP vs full vision? | Viability |
| **Risks & Assumptions** | What are we betting on? | All three |

### Build Size Assessment

| Size | Description | Example |
|------|-------------|---------|
| **S (Toyota Camry)** | Use existing components, 1-2 screens | Simple form, table view |
| **M (BMW 3 Series)** | Some new components, 3-5 screens | Multi-step wizard |
| **L (Ferrari)** | Significant new patterns, 6+ screens | Real-time collaboration |

### Running Design Kickoff

```bash
/trilogy-design
```

This produces `design.md` with all strategic decisions documented.

---

## Phase 2: Mockups

After the kickoff, we create actual UI specifications.

### Design Challenge (Optional)

Before creating mockups, you can run a **design challenge** - parallel agents research how market-leading apps handle similar features:

```
Want to run a design challenge?

I'll send 4 design students to research:
| Student | App | Focus |
|---------|-----|-------|
| 1 | DocuSign | E-signature flow |
| 2 | HelloSign | Simple signing UX |
| 3 | PandaDoc | Document + signing |
| 4 | Adobe Sign | Enterprise, audit trail |

[ ] Yes, run design challenge
[ ] Skip, go to mockups
```

### Keyframe Extraction

If you have a Loom walkthrough or Figma recording in `rich-content/`, the mockup skill can extract UI specs from keyframes.

### Mockup Output

Mockups go in the `design/` folder:

```
initiative/
├── design.md              # Design Kickoff (strategic)
├── design/                # Design artifacts
│   ├── mockups/          # ASCII wireframes, variations
│   ├── competitors/      # Screenshots from research
│   └── patterns.md       # Patterns we're adopting
```

### Running Mockups

```bash
/trilogy-mockup
```

---

## Phase 3: Design Handover (Gate 2)

Before technical planning begins, validate design completeness.

### Gate 2 Checklist

**Design Completeness**
- [ ] UI mockups for all key screens
- [ ] User flows documented
- [ ] Component decisions made
- [ ] Responsive approach defined
- [ ] Accessibility considered

**Design-Spec Alignment**
- [ ] All spec features have visual representation
- [ ] Edge cases visualized
- [ ] Data display defined
- [ ] Interactions specified

**Technical Feasibility**
- [ ] Uses existing patterns where possible
- [ ] Implementable with current tech
- [ ] Performance considered

### Running Handover

```bash
/trilogy-design-handover
```

---

## Design Artifacts

| Artifact | Location | Purpose |
|----------|----------|---------|
| `design.md` | Initiative root | Design Kickoff Brief |
| `design/mockups/` | Initiative folder | ASCII wireframes |
| `design/competitors/` | Initiative folder | Competitive research |
| `design/patterns.md` | Initiative folder | Patterns to adopt |
| `rich-content/keyframes/` | Initiative folder | Loom/Figma extraction |

---

## Quick Reference

```
/speckit-specify    → spec.md (what to build)
        ↓
/trilogy-design     → design.md (design kickoff)
        ↓
/trilogy-mockup     → design/mockups/ (UI specs)
        ↓
/trilogy-design-handover → Gate 2 (Design → Dev transition)
        ↓
[DEV PHASE BEGINS]
        ↓
/speckit-plan       → plan.md (technical plan)
```

**Gate 2 Actions:**
- Validates design completeness
- Transitions Linear status from Design to Dev
- Posts handover summary as Linear comment
- Hands off to Development team
