# Spec-Driven Development

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

## The SDD Process

| Phase | Purpose | Output | Gate |
|-------|---------|--------|------|
| **1. Ideation** | Capture the problem | `idea-brief.md` | - |
| **2. Specification** | Define what to build | `spec.md` | Gate 1 |
| **3. Design** | How it looks & feels | `design.md` + mockups | Gate 2 |
| **4. Planning** | How to build it | `plan.md` + `tasks.md` | Gate 3 |
| **5. Implementation** | Build it | Code | Gate 4 |
| **6. Validation** | Did it work? | Metrics | - |

---

## Documents

- [Environment Setup](./env-setup.md)
- [Team Practices](./team-practices.md)
- [Design](./design.md)
- [Specification](./specification.md)
- [Gates](./gates.md)
