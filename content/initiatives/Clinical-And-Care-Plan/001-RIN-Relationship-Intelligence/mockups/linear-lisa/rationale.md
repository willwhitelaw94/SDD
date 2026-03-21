---
title: "Rationale: Linear Lisa - Relationship Intelligence"
---

# Design Rationale: Linear Lisa

**Student:** Linear Lisa
**Philosophy:** "Less, but better"
**Feature:** Relationship Intelligence Panel

---

## Shared Design Decisions

Both variations share core decisions rooted in Linear's design language:

### Monochrome + Semantic Colour Only

The palette is almost entirely grayscale (#1A1A1A through #F2F2F2). Colour appears in exactly four contexts: teal for the primary CTA and active state, amber/orange for warnings (bills on hold, incidents, approaching compliance), the progress ring, and category accent bars on personal context entries. This restraint ensures every coloured element carries meaning. A coordinator scanning the panel can instantly identify "what needs attention" because only attention-worthy items have colour.

### Keyboard Shortcuts as First-Class Citizens

Aged care coordinators are time-pressured and often on the phone while navigating the system. Keyboard shortcuts reduce the cognitive load of "find button, position mouse, click" to a single keypress. Showing shortcuts inline (next to every action) creates a passive learning loop — staff discover shortcuts naturally rather than needing training. The persistent bottom bar provides a safety net for users who haven't memorised the shortcuts yet.

### Conversation Prompts Above Everything

Both variations place "Before you call" prompts above personal context and operational data. This is the most controversial information hierarchy decision: most CRM systems put personal data first. The rationale is situational — the coordinator is typically looking at this panel *immediately before dialling*. The prompts are pre-digested action items ("ask about the Swans game"), while personal context requires the coordinator to mentally convert data into conversation topics. Prompts eliminate that step.

### No Shadows, No Gradients, No Decorative Elements

Following Linear's principle that every pixel must earn its place. Cards use 1px borders (#E8E8E8) for delineation. Hover states use subtle border darkening (#CCC), not shadow elevation. The result is a UI that feels calm and professional — appropriate for a healthcare context where visual noise creates anxiety.

---

## Variation A: Sidebar Panel

### Layout

The Relationship Intelligence tab uses a split layout: main content area (left) + operational sidebar (right, 280px fixed width). The main area holds conversation prompts, personal context cards, and recent activity. The sidebar holds the touchpoint compliance status, operational badges, and quick actions.

### Why This Layout

**Persistent operational visibility.** The sidebar is structurally always present — the coordinator never needs to scroll past personal context to check whether there are bills on hold. This mirrors the Intercom pattern where customer attributes sit alongside the conversation. In an aged care context, this means: while reading "loves gardening," the coordinator can simultaneously see "2 bills on hold" in their peripheral vision.

**Natural reading flow.** The main content area reads top-to-bottom: prompts (actionable) then personal context (reference) then recent activity (history). This mirrors how a coordinator prepares for a call: first, what should I say? Then, what do I know about this person? Finally, what happened recently?

**Minimal disruption to existing layout.** This variation adds Relationship Intelligence as a new tab but reuses the existing sidebar pattern (PackageSidebar.vue). The right sidebar is already a familiar structure in TC Portal — coordinators won't need to learn a new layout paradigm.

### Trade-offs

**Narrower main content area.** With the sidebar consuming 280px, the main area has less horizontal space for personal context cards. The 2-column card grid works but would feel cramped on smaller screens. On a 1280px display (minus 200px left nav), the main area is approximately 800px — comfortable but not generous.

**Sidebar content prioritisation.** The sidebar can only show so much before scrolling. The touchpoint status and "Log Touchpoint" CTA take priority, followed by the four operational badges. Quick actions are at the bottom and may require scrolling on shorter viewports. This is acceptable because quick actions are keyboard-accessible regardless.

**Less room for interaction history.** Variation A shows only the 2 most recent timeline entries in the main content area. For deeper history, the coordinator would navigate to the Timeline tab. This is deliberate — the Relationship tab is for "now and next," not "everything that ever happened."

### Best Scenario

Variation A works best when:
- Relationship Intelligence is one of many tabs the coordinator switches between frequently
- The coordinator needs to see operational status while reading personal context (side-by-side)
- The existing sidebar pattern is already understood and trusted by users
- Screen real estate is generous (1440px+ display)

---

## Variation B: Full Tab

### Layout

A two-column layout that fills the entire content area: left column (flexible width) for personal context, prompts, and the touchpoint status banner; right column (400px fixed) for the operational snapshot grid and full touchpoint history timeline.

### Why This Layout

**Dedicated space for relationship context.** By using the full tab width (no competing sidebar), each column has generous horizontal space. Personal context entries can display as a grouped list with category headers and colour-coded accent bars — a format that scales better than cards when a client has 10+ entries.

**Full interaction timeline.** The right column includes a complete touchpoint history with month groupings, type-coded dots, and expandable entries. This eliminates the need to switch to a separate Timeline tab for relationship-related activity. The coordinator sees "what I know about this person" on the left and "what we've done with this person" on the right — a complete picture.

**Touchpoint status as a banner.** Instead of a sidebar section, the touchpoint compliance status is a full-width banner at the top of the left column. This gives it more visual weight and makes room for additional data: the "12 days remaining" compliance countdown alongside the progress ring. The "Log Touchpoint" CTA moves to the package header (always visible regardless of scroll position).

### Trade-offs

**No persistent operational visibility while on other tabs.** Unlike Variation A where the sidebar is structurally persistent, Variation B's operational data is only visible on the Relationship tab. If the coordinator switches to the Bills tab, they lose the relationship context. This is the fundamental trade-off: depth on Relationship tab vs. breadth across all tabs.

**More scrolling for long personal context.** If a client has many personal context entries across multiple categories, the left column could become long. The grouped list format (with category headers) helps scan-ability but doesn't solve the scroll problem. Mitigation: collapse categories that haven't been updated recently.

**Heavier page weight.** The full timeline loads all touchpoint data for the past several months. For clients with extensive interaction history, this could slow initial page load. Mitigation: paginate history (show last 3 months, "Load more" for earlier), or use Inertia deferred props with a skeleton state.

### Best Scenario

Variation B works best when:
- Relationship Intelligence is the primary pre-call preparation view (coordinators land here first)
- Clients have rich personal context that benefits from a categorised list format
- Interaction history is a key part of call preparation (not just "last touchpoint" but the full conversation arc)
- The coordinator's workflow is: open Relationship tab, prepare, then call — rather than bouncing between tabs

---

## Recommendation

**Variation A for MVP, Variation B as the aspirational target.**

Variation A integrates more naturally into the existing TC Portal layout with minimal disruption. The sidebar pattern is proven, the information hierarchy is clear, and it doesn't require the coordinator to fundamentally change their tab-browsing workflow. It's also easier to build — it extends the existing PackageSidebar pattern rather than introducing a new two-column layout.

Variation B becomes more valuable as personal context grows richer and touchpoint history deepens. After 3-6 months of use, when clients have 10+ personal context entries and a year of touchpoint history, the full tab layout will handle that density better than the sidebar. Consider evolving from A to B based on adoption metrics.
