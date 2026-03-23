---
title: "Getting Started with SDD"
description: "A practical guide for engineers joining an SDD team — tooling, workflow, and your first feature."
category: "Culture"
author: "SDD Team"
date: "2026-03-20"
---

## Your First Week

When you join a team using Story-Driven Development, the first thing you should do is **watch existing artifacts**. Pick a recently completed feature and review its seven recordings in order. This gives you a concrete example of what good SDD output looks like before you produce your own.

## Setting Up Your Workflow

### Tooling

SDD is tool-agnostic, but most teams use the following stack:

- **Linear** for story tracking and gate management
- **Loom** for recording artifacts at each step
- **Markdown** for written specs and plans
- **Figma** for design mockups
- **GitHub** for implementation and code review

### Directory Structure

SDD projects organize artifacts by initiative and epic:

```
content/
  initiatives/
    my-initiative/
      meta.yaml
      my-epic/
        meta.yaml
        idea-brief.md
        spec.md
        design.md
        plan.md
        tasks.md
```

Each epic folder contains the written artifacts for that feature. The `meta.yaml` file tracks gate status, ownership, and metadata.

## Writing Your First Idea Brief

An idea brief answers three questions:

1. **What problem are we solving?** Describe the pain point in concrete terms.
2. **Who has this problem?** Identify the specific user or persona.
3. **What does success look like?** Define a measurable outcome.

Keep it short — 200 words maximum. The brief is not a spec; it is a filter. Its purpose is to determine whether the idea is worth investing in.

## Common Mistakes

### Over-speccing the Brief

The idea brief is step one. Do not write acceptance criteria or technical details here. That comes in steps two and four.

### Skipping the Design Step

Engineers often want to jump from spec to code. Resist this. The design step catches UX issues that are expensive to fix in code and cheap to fix in a mockup.

### Recording Without Context

When you record a Loom artifact, always start by stating:

- Which step you are on
- Which epic this belongs to
- What you are about to show

This makes recordings useful months later when the context has faded from memory.

## The Feedback Loop

After each gate, expect one of three outcomes:

1. **Pass** — move to the next step
2. **Revise** — address specific feedback, then re-record
3. **Reject** — the approach needs fundamental rethinking

Revisions are normal and healthy. A gate that never rejects anything is not doing its job. The goal is not perfection at every step — it is early detection of problems that would be costly to fix later.

## Next Steps

Once you have completed your first feature through all seven steps, review the experience with your team. Identify which steps felt valuable and which felt like friction. SDD is a framework, not a religion — adapt it to your team's needs while keeping the core principle intact: every step produces a reviewable artifact.
