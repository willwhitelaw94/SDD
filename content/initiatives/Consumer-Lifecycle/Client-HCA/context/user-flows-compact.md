---
title: "User Flows – Client HCA (Compact)"
---

## Flow 1: First-Login Journey

```mermaid
flowchart LR
    A[Login] --> B{HCA Sent?}
    B -->|Yes| C[Agreements] --> D{Leave?}
    B -->|No/Draft| E[Dashboard]
    D -->|Bypass| E
    D -->|Stay| F[Sign → Flow 2]
```

## Flow 2: HCA Signing

```mermaid
flowchart LR
    A[View HCA] --> B[Mgmt Option] --> C{Managed?}
    C -->|Yes| D[Select Coord] --> E[Date]
    C -->|No| E
    E --> F[Sign] --> G{OK?}
    G -->|Yes| H[Signed ✓]
    G -->|No| F
```

## Flow 3: Staff Consent Capture

```mermaid
flowchart LR
    A[Staff] --> B{Method?}
    B -->|Digital| C[Portal Sign]
    B -->|PDF| D[Upload]
    B -->|Verbal| E[Transcript+CallID]
    C & D & E --> F[Signed ✓]
```

## Flow 4: Draft → Sent

```mermaid
flowchart LR
    A[Draft HCA] --> B{Meeting done?}
    B -->|No| A
    B -->|Yes| C[Set flag] --> D[Sent] --> E[Magic link]
```

## Flow 5: SLA Reminders

```mermaid
flowchart LR
    A[Sent] --> B[T+24h] --> C[T+48h] --> D[T+7d] --> E[T+14d]
    B & C & D & E -.->|User signs| F[Signed ✓]
```

## Flow 6: Termination

```mermaid
flowchart LR
    A[Signed HCA] --> B[Terminate] --> C[Reason+Date]
    C --> D[Terminated]
    D -.->|Reactivate| E[Draft]
```

## Flow 7: LTH Conversion

```mermaid
flowchart LR
    A[Lead] --> B[Wizard] --> C{Send HCA?}
    C -->|Yes| D[Sent] --> E[Magic link]
    C -->|No| F[Draft] --> G[Portal invite only]
```

## State Model

```mermaid
stateDiagram-v2
    direction LR
    [*] --> Draft
    Draft --> Sent
    Sent --> Signed
    Signed --> Terminated
    Terminated --> Draft
```

## Quick Reference

| Flow | User Stories | Trigger | Result |
|------|--------------|---------|--------|
| 1 | US01 | First login | → Signing or Dashboard |
| 2 | US02, US16 | Sign HCA | → Signed |
| 3 | US06, US07 | Staff consent | → Signed |
| 4 | US05 | Post-meeting | → Sent |
| 5 | US09 | Time elapsed | → Reminders |
| 6 | US10, US15 | Terminate | → Terminated |
| 7 | US05 (LTH) | LTH convert | → Draft or Sent |

## Story Coverage

| Story | Flow | Description |
|-------|------|-------------|
| US01 | 1 | First-Login HCA Signing Flow |
| US02 | 2 | Digital In-Portal Signature |
| US03 | - | View Agreements List (UI only) |
| US04 | - | View Agreement Details (UI only) |
| US05 | 4, 7 | Draft→Sent Transition |
| US06 | 3 | Upload Signed PDF |
| US07 | 3 | Verbal Consent Capture |
| US09 | 5 | SLA Reminders |
| US10 | 6 | Terminate/Reactivate |
| US15 | 6 | Terminate with Compliance |
| US16 | 2 | Management Option Selection |
