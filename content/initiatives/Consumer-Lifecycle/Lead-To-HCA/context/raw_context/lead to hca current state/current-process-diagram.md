# Lead to HCA - Current State Process

**Source**: Meeting with Jackie Palmer (Head of Sales), February 3, 2026

## Current Process Flow

```mermaid
flowchart TD
    A[Lead Generation] --> B[Lead in Zoho CRM]
    B --> C[Sales Rep Converts<br/>Lead → Consumer in Zoho]
    C --> D[Generate TCID &<br/>Funding Classification]
    D --> E[Sales Onboarding<br/>Push Form<br/><i>Live with Client</i>]

    E --> F[Capture Screening Data<br/>• IAT PDF Upload<br/>• Risk Scoring AI<br/>• Client Preferences<br/>• Consent Details]

    F --> G{Screening<br/>Outcome?}

    G -->|Approved All Pathways| H[Create Care Plan<br/>Record in CRM]
    G -->|Approved Coordinated Only| H
    G -->|Rejected ~2%| Z[End - Not Onboarded]

    H --> I[Webhook: CRM → Portal]
    I --> J[Portal Creates<br/>Package Record]

    J --> K[Email: Sample HCA<br/>Sent to Client]

    K --> L[Care Plan Meeting<br/>Scheduled]
    L --> M[SMS Reminders &<br/>Confirmation Call]
    M --> N[Care Plan Meeting<br/>• Budget Finalized<br/>• Risk Evaluation]

    N --> O{Verbal<br/>Agreement?}

    O -->|Yes| P[Agreement Accepted]
    O -->|No| Q[Send Digital<br/>Signature Request]
    Q --> R[Sales Follow-up<br/>on Completion]
    R --> P

    N --> S[Care Plan Delivered<br/>Target: 24hrs]

    S --> T{Management<br/>Type?}
    T -->|Self-Managed| U[Immediate Delivery]
    T -->|Coordinated| V[Assign to Coordinator<br/><i>Current: 130 backlog</i>]
    V --> W[Coordinator Delivers<br/>Within 24hrs target]

    P --> X[Active Client]
    U --> X
    W --> X

    style G fill:#fff4e6
    style O fill:#fff4e6
    style Z fill:#ffe6e6
    style X fill:#e6ffe6
```

## Key Observations

### Current State Characteristics
- **Zoho CRM-centric**: All lead conversion, consumer creation, and push form data lives in Zoho
- **Webhook Integration**: CRM triggers Portal package creation via webhook after care plan record created
- **Manual Follow-up**: Agreement signing requires manual sales follow-up post-meeting
- **Split Delivery**: Self-managed vs coordinated clients have different workflows

### Pain Points Identified
1. **Churn**: Was 14%, improved to <6% with faster meeting-to-care plan turnaround
2. **Coordinator Backlog**: 130 clients waiting for allocation in coordinated pathway
3. **Agreement Timing**: Currently sent as sample, then verbal/digital post-meeting
4. **Multiple Funding Streams**: Only primary stream captured at point of sale; secondary streams buried in notes

### Planned Improvements (from meeting)
- Move digital signature request to **immediately after screening approval** (before care plan meeting)
- Target 60% agreement uptake before meeting
- Automate care plan delivery post-assessment without manual coordinator handoff
- Support multi-select funding streams at point of sale with explicit consent capture

---

**Meeting Attendees**: David Henry, Jackie Palmer, Mike Wise, Room 403
**Document Created**: February 5, 2026
