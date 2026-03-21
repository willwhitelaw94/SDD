# Pyramid Petra — Design Rationale

## Why Pyramid/Tier Patterns Work for Complaint Triage

### The Core Insight

Complaint management in aged care is fundamentally a triage problem. Coordinators need to answer one question fast: **"What needs my attention right now?"** A pyramid visualization answers this spatially — urgent items sit at the apex where the eye naturally starts, and the narrowing shape means there are fewer of them, reinforcing that these are the critical few.

### Urgency Naturally Maps to Elevation

Humans have deep cognitive associations between vertical position and importance:
- "Top priority" / "rise to the top" / "escalate"
- "Bottom of the list" / "baseline" / "foundational"

By placing Urgent records at the pyramid's apex and Standard records at the base, we leverage these existing mental models. A coordinator doesn't need to read labels — the position alone communicates severity.

### The Shape Tells the Story

A healthy complaint caseload should look like a proper pyramid: very few urgent items, a moderate number of medium items, and a broad base of standard items. When coordinators see this shape daily, they develop an intuitive sense of "normal." If the pyramid starts to invert (more urgent than standard), the visual distortion immediately signals a systemic problem — before anyone reads a single number.

### Visual Workload Distribution

Traditional list/table UIs treat all records equally — a row is a row. The pyramid breaks this symmetry deliberately:
- **Urgent tier** gets the most visual prominence (red, top position) despite having the fewest records
- **Standard tier** gets the most physical space (width) because it contains the most records
- This asymmetry matches how coordinators should allocate attention

### Color Gradient as Severity Language

The red → amber → teal gradient maps to established triage conventions in healthcare:
- **Red** = immediate attention, danger, urgency (familiar from clinical triage)
- **Amber** = caution, monitoring required, time-sensitive
- **Teal** = stable, routine, under control (TC brand color reinforces "we've got this")

Using TC's own teal (#007F7E) as the "standard/healthy" color means the brand itself becomes associated with resolution and control.

### Practical Coordinator Benefits

1. **Morning check-in takes seconds** — glance at the pyramid shape, check urgent count, done
2. **Filtering by tier** — click a tier to see only those records, reducing cognitive load
3. **Detail views maintain context** — the tier color banner persists, so coordinators always know "how important is what I'm looking at?"
4. **Stage progression as ascent** — resolving a complaint feels like climbing toward closure, with visual steps that show progress

### Why Not Just a Table?

Tables are the default for record management, and for good reason — they're scannable and sortable. But tables flatten priority. A coordinator scanning 42 records in a table must mentally filter for urgency. The pyramid pre-filters this visually, then provides the table below for detailed scanning. It's additive, not replacement.

### Risks and Mitigations

| Risk | Mitigation |
|------|-----------|
| Pyramid feels gimmicky | Keep it functional — every visual element encodes real data |
| Unfamiliar pattern | Pair with conventional table below — pyramid filters, table displays |
| Accessibility | Use icon + color (not color alone) for severity, ensure keyboard navigation |
| Small screen | Pyramid collapses to horizontal tier bars on mobile |
