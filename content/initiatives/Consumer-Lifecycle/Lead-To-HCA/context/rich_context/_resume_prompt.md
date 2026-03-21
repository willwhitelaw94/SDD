# Resume Prompt: LTH Epic Context

Use this prompt in a new chat to quickly load context for the Lead-to-HCA epic.

---

## Prompt

I need to work on the Lead-to-HCA (LTH) epic. Please read the following documents in order:

**Primary Specs:**

1. `.tc-docs/content/initiatives/Consumer-Lifecycle/Lead-To-HCA/spec.md` — The authoritative spec with 6 user stories
2. `.tc-docs/content/initiatives/Consumer-Lifecycle/Lead-To-HCA/business-spec.md` — KPIs, SLAs, process decisions
3. `.tc-docs/content/initiatives/Consumer-Lifecycle/Lead-To-HCA/design-spec.md` — Wireframes and component inventory

**Rich Context Documents (for deeper understanding):**

4. `rich_context/LTH General Context.md` — Architecture overview, Portal taking over conversion
5. `rich_context/Consolidated Conversion Form Fields.md` — Complete 4-step form field specification
6. `rich_context/Conversion Sync-Back Flow.md` — When/what Portal syncs to Zoho after each step
7. `rich_context/Risk Score First Management Option Flow.md` — Risk outcome decision tree and management option
8. `rich_context/Agreement Signature Flow.md` — Agreement send flow (signable vs not-signable paths)
9. `rich_context/Classification Data Model.md` — SA Mirror vs TC Actions, multi-funding streams

**Key decisions (as of Feb 10, 2026 — Fast Lane Retrospective):**

- Portal replaces BOTH Zoho's convert button AND the PUSH form
- 4-step conversion wizard: Essentials → Risk Assessment → Client Details → Agreement
- Assessment Tool (IAT + screening) is EXTERNAL for MVP — returns Risk Score Outcome to Portal
- **LTH ends at agreement sent** — all signature capture handled by Client HCA
- Meeting booking gated by signed agreement — handled by Client HCA, not LTH
- Continuous sync: Portal calls Zoho API after EACH step (not batch at end)
- ~98% "Suitable for Everything" → agreement sent, portal invitation, package created
- ~2% "Needs Clinical Attention" → not-signable package created, no portal invitation
- Not-signable holds: clinical review (24-48hr SLA) and/or coordinator assignment (24hr SLA)
- 14-day cooling off period displayed at Step 4 as a sales tool
- Preferred Management Option (lead data) vs Management Option Confirmed (agreement data)
- Opt-out consent model for classifications (default: consent to all)

**Epic dependencies:**
- **Lead Essential (LES)** → enriches the lead record (builds on US1)
- **Lead Desired (LDS)** → further enrichment (builds on LES)
- **Client HCA** → picks up after LTH (signature capture, SLA reminders, meeting booking)

**6 User Stories:**
1. US1: Lead Record in Portal (synced from Zoho, pre-fills wizard)
2. US2: Wizard Step 1 — Conversion Essentials (creates Consumer + Care Plan in Zoho)
3. US3: Wizard Step 2 — Risk Assessment (external tool, gates flow)
4. US4: Wizard Step 3 — Client Details (enriches Consumer record)
5. US5: Wizard Step 4 — Agreement (send or create not-signable package)
6. US6: Post-Conversion Package Visibility (packages index, Zoho sync confirmation)
