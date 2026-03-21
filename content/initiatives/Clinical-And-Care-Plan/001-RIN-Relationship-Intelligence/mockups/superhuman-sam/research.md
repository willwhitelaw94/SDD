# Research: Superhuman Sam — Speed-First Design for Relationship Intelligence

## Superhuman's Design Philosophy

### Core Principle: "The Fastest Email Experience Ever Made"

Superhuman was built from the ground up around a single metric: **time to complete an action**. Every design decision optimises for speed — not features, not aesthetics (though it achieves both as byproducts of speed-obsessed thinking).

Key tenets:
- **100ms response time** — every interaction should feel instant. The interface should never make you wait.
- **Keyboard-first** — mouse is a fallback, not the primary input. Every action has a shortcut.
- **Zero inbox as flow state** — the interface drives you through work, not into menus. Completion is the default path.
- **Reduce decision fatigue** — the system should surface what matters and suppress what doesn't.

### Design Language

Superhuman uses a distinct visual vocabulary:

| Element | Superhuman Pattern |
|---------|-------------------|
| Layout | Split pane — list on left, content on right |
| Navigation | J/K to move, Enter to act, Esc to go back |
| Typography | Large, high-contrast headings for scanability |
| Colour | Dark mode with strategic bright accents for urgency |
| Chrome | Minimal — no toolbars, no sidebars. Content fills the screen |
| Animations | Subtle, fast transitions (150–300ms). Nothing decorative |
| Command palette | Cmd+K for everything — search, actions, navigation |
| Feedback | Instant visual confirmation — counts animate, badges pulse |
| Progress | Explicit progress tracking ("3 of 12 done") creates momentum |

### Auto-Advance: The Hidden Killer Feature

Superhuman's auto-advance pattern moves to the next item after completing the current one. This eliminates "dead time" — the pause between finishing one task and starting the next. In Superhuman's research, this alone reduced email processing time by 30%.

Applied to care coordination: after logging a touchpoint, the next client on the caseload automatically loads. The coordinator stays in flow.

## Keyboard-First Design in Care Workflows

### The Speed Argument

Care coordinators at Trilogy Care manage 50–80+ clients. A typical call-prep workflow involves:

1. Open client profile (~3s with mouse navigation)
2. Scan for issues — bills, complaints, incidents (~8s reading multiple tabs)
3. Check last contact date (~2s)
4. Think of something personal to say (~5s or give up)
5. Dial the number (~2s)

**Total: ~20 seconds** of prep per call, much of it wasted on navigation.

With a Superhuman-style approach:
1. J/K to land on client (~0.5s)
2. Full briefing visible instantly in right pane (~0s, already loaded)
3. Conversation prompts pre-generated (~0s)
4. Press Enter to call (~0.5s)

**Total: ~1 second.** At 15 calls/day, this saves **~5 minutes/day** of pure navigation overhead — plus the cognitive savings of not having to manually assemble context across tabs.

### Learnability Curve

Superhuman's approach to keyboard shortcuts follows a "see then do" model:

1. **Hint bar** at the bottom shows available shortcuts contextually
2. **Hover reveals** show the shortcut for any button
3. **Command palette** (Cmd+K) is the universal escape hatch — type what you want
4. Power users naturally memorise shortcuts through repeated exposure

This is important for aged care coordinators who may not be keyboard-power-users. The hints teach without blocking, and the mouse always works as a fallback.

### Focus Mode vs Always-On Context

Superhuman offers two engagement modes:
- **List view** (split pane) — scanning and triaging
- **Focus view** (full screen) — deep engagement with a single item

For relationship intelligence, this maps to:
- **Split pane** — daily caseload review, quick triage, identify who needs calling
- **Focus mode** — pre-call preparation, immersive briefing before dialling

## Glassmorphism and Visual Hierarchy

Superhuman uses subtle visual layering to create depth without visual noise:

- **Background gradients** — very subtle radial gradients create warmth
- **Glass panels** — semi-transparent cards with backdrop blur separate content layers
- **Strategic colour** — bright accents (teal, amber, red) only where action or attention is needed
- **Muted chrome** — borders, dividers, and secondary text stay very low contrast

This creates a calm, professional feel that reduces cognitive load while still drawing attention to what matters.

## Micro-Interactions and Delight

Superhuman invests heavily in "feel" — the small interactions that make software feel alive:

- **Counts animate** when values change (not just snap to new number)
- **Badges pulse** for items requiring action
- **Progress rings draw** rather than appearing static
- **Transitions slide** rather than cut — 200-300ms, ease-out curve
- **Completion states** give satisfying visual feedback

In the care context, these aren't decorative — they direct attention. A pulsing badge on "2 bills on hold" catches the eye faster than a static number. An animated progress ring ("4 of 5 context fields filled") creates a natural desire to complete the set.

## Relevant References

- Rahul Vohra, "How Superhuman Built an Engine to Find Product-Market Fit" (First Round Review)
- Superhuman design system documentation (internal, referenced through public talks)
- Nielsen Norman Group, "Keyboard Shortcuts: Usability and Learnability" (2021)
- "Designing for Speed" — Superhuman engineering blog series
- Zeigarnik Effect — incomplete tasks are remembered better than completed ones (drives progress indicators)
