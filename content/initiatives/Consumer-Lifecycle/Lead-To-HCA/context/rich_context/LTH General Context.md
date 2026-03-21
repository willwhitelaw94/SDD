# LTH General Context

**Created**: 2026-02-09
**Updated**: 2026-02-10
**Purpose**: High-level architecture and flow context for Lead-to-HCA re-spec

---

## System Architecture: Lead Management to Conversion

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PRE-CONVERSION: Lead Management (Zoho CRM)                                  │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────────┐         two-way sync          ┌──────────────────────┐
   │   ZOHO CRM   │  ◄─────────────────────────►  │   PORTAL             │
   │  (Lead Mgmt) │       (at intervals or        │   (Lead destination) │
   │              │        real-time)             │                      │
   └──────────────┘                               └──────────────────────┘
         │                                                   │
         │  Sales does all lead work here                    │  Data lands here
         │  - Capture client details                         │  (future: LES epic)
         │  - Preferred mgmt option                          │
         │  - Risk survey (Vibe)                             │
         │  - etc.                                           │
         │                                                   │
         └──────────────────────┬────────────────────────────┘
                                │
                          AT CONVERSION
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  CONVERSION: Portal Takes Over (Replaces Zoho Convert + PUSH Form)           │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────────────────────────────────────────────────────────────────────┐
   │  PORTAL: 5-Step Conversion Form                                          │
   │                                                                          │
   │  • Replaces BOTH Zoho's convert button AND the PUSH form                 │
   │  • Everything that was in PUSH form now lives here                       │
   │  • All material data already synced from Zoho lead                       │
   │  • Sales clicks "Convert" in Portal (or via link from Zoho)              │
   │  • Assessment Tool (IAT + screening) stays external, outcome gates flow  │
   │                                                                          │
   │  Steps:                                                                  │
   │    1. Conversion Essentials (identifiers, classifications, dates, rep)   │
   │    2. Client Details (client details, funding & financial)               │
   │    3. Risk Assessment Outcome (from external Assessment Tool)            │
   │    4. Coordinator Confirmation (management option + coordinator)         │
   │    5. Agreement (send agreement or complete as not signable)             │
   └──────────────────────────────────────────────────────────────────────────┘
                                │
                                │  Continuous sync after each step
                                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SYNC-BACK: Portal → Zoho API (continuous)                                   │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌──────────────────────────────────────────────────────────────────────────┐
   │  Portal calls Zoho API after each step:                                  │
   │                                                                          │
   │  After Step 1: Convert Lead → Consumer, create Care Plan                 │
   │  After Step 2: Update Consumer with client details                       │
   │  After Step 3: Update Care Plan with risk outcome                        │
   │  After Step 4: Update Consumer with coordinator data                     │
   │  After Step 5: Agreement status, create Deal + Package, portal invite    │
   │                                                                          │
   │  See: Conversion Sync-Back Flow.md for detailed field mapping            │
   └──────────────────────────────────────────────────────────────────────────┘

         PORTAL                                              ZOHO CRM
   ┌──────────────────┐                              ┌──────────────────┐
   │  Package         │  ───── API sync ──────────►  │  Consumer Module │
   │  (source of      │                              │  Care Plan Module│
   │   truth)         │                              │  Deal            │
   └──────────────────┘                              └──────────────────┘
```

---

## What Moves to Portal vs What Stays External

| Current Location | New Location | Notes |
|------------------|--------------|-------|
| Zoho Convert button | **Portal** | Part of 5-step form |
| Zoho PUSH form (all fields) | **Portal** | Absorbed into conversion form |
| Zoho Lead Module | Zoho (unchanged) | Pre-conversion lead work stays |
| IAT extraction + screening | **Assessment Tool (external)** | Separate app. MVP: Sales manually enters outcome + re-uploads IAT in Portal (double-handling) |
| Meeting booking | **Client HCA / TBD (post-LTH)** | Gated by signed agreement — not part of LTH |
| Zoho Consumer Module | Zoho (receives data) | Portal syncs data back after conversion |
| Zoho Care Plan Module | Zoho (receives data) | Portal syncs data back after conversion |

---

## Key Principles

1. **Zoho remains lead management system** (for now)
   - All lead work happens in Zoho CRM
   - Sales captures client details, preferred management option, does risk survey, etc.

2. **Portal is sync destination pre-conversion**
   - Two-way sync (at intervals or real-time) keeps Portal lead data current
   - Future: LES (Lead Essentials) epic will formalize this as Portal's lead module

3. **Conversion happens entirely in Portal**
   - Replaces both Zoho's convert button AND the PUSH form
   - Everything from the PUSH form is now captured in Portal's 5-step conversion
   - One external dependency:
     - **Assessment Tool** — IAT extraction + screening questions → produces Risk Score Outcome (MVP: Sales manually enters outcome + re-uploads IAT in Portal)

4. **Portal becomes source of truth at conversion**
   - Pre-conversion: Zoho is source of truth for lead data
   - At conversion: Portal takes over as source of truth
   - Portal calls Zoho API to sync back: converts lead, populates Consumer + Care Plan modules

5. **Zoho becomes downstream post-conversion**
   - Consumer and Care Plan modules receive data FROM Portal
   - Deal record created for legacy reporting
   - This is the reverse of the current flow (where Zoho pushes to Portal)

6. **LTH boundary = agreement sent**
   - LTH ends when the agreement is sent (signable) or the package is created as not signable
   - Signature capture (verbal, digital, manual PDF) is handled by **Client HCA**
   - Meeting booking is gated by signed agreement — handled by Client HCA / TBD, not LTH
   - Not-signable resolution (clinical review, coordinator assignment) is handled by respective owners

---

## Related Documents

- [Conversion Sync-Back Flow](Conversion%20Sync-Back%20Flow.md)
- [Risk Score First Management Option Flow](Risk%20Score%20First%20Management%20Option%20Flow.md)
- [Classification Data Model](Classification%20Data%20Model.md)
- [Multiple Funding Streams Summary](../Multiple%20Funding%20Streams/Multiple_Funding_Streams_Summary.md)
