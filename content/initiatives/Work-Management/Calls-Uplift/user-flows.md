---
title: "User Flow Diagrams: Calls Uplift"
created: 2026-02-05
format: mermaid
---

# User Flow Diagrams: Calls Uplift

## Flow Overview

| Flow | Phase | Stories Covered | Primary Actor |
|------|-------|-----------------|---------------|
| [Call Review Flow](#flow-1-call-review-inbox-phase-1) | Phase 1 | US02, US03 | Care Coordinator |
| [Flash Alert Flow](#flow-2-flash-alert-immediate-review) | Phase 1 | US03 | Care Coordinator |
| [Call Bridge Flow](#flow-3-call-bridge-context-phase-2) | Phase 2 | US01, US04 | Care Coordinator |
| [Recording Access Flow](#flow-4-recording-access) | Phase 2 | US05 | Coordinator / Team Lead |

---

## Flow 1: Call Review Inbox (Phase 1)

**Primary Path**: Coordinator reviews calls from inbox after transcription arrives

```mermaid
flowchart TD
    subgraph TRIGGER["📞 Trigger"]
        A[Call Ends] --> B[Transcription Ready]
        B --> C[Graph Webhook]
        C --> D[Call in Inbox]
    end

    subgraph INBOX["📥 Calls Inbox"]
        D --> E{Badge Shows Count}
        E --> F[Open Inbox]
        F --> G[View Call List]
        G --> H[Select Call]
    end

    subgraph REVIEW["📋 Call Review"]
        H --> I[View AI Summary]
        I --> J[View Transcription]
        J --> K{Package Linked?}

        K -->|Yes| L[Review Package]
        K -->|No| M{Link or Skip?}

        M -->|Link| N[Search Package]
        N --> O[Select Package]
        O --> L

        M -->|Non-Package| P[Mark Non-Package]
        P --> Q[Complete Review]

        L --> R{Add Case Note?}
        R -->|Yes| S[Use AI Summary]
        R -->|No| Q
        S --> T[Edit Note]
        T --> Q
    end

    subgraph RESULT["✅ Result"]
        Q --> U[Activity Logged]
        U --> V[Call Marked Reviewed]
        V --> W[Next Call or Done]
    end

    style TRIGGER fill:#e3f2fd
    style INBOX fill:#fff3e0
    style REVIEW fill:#f3e5f5
    style RESULT fill:#e8f5e9
```

**Decision Points:**

| Point | Options | Default |
|-------|---------|---------|
| Package Linked? | Yes → Review | Depends on auto-match |
| Link or Skip? | Link / Non-Package | Link (prompted) |
| Add Case Note? | Yes / No | Optional |

---

## Flow 2: Flash Alert (Immediate Review)

**Alternate Path**: Coordinator reviews immediately via flash notification

```mermaid
flowchart LR
    A[Transcription Ready] --> B[Flash Alert]
    B --> C{Respond?}

    C -->|Click| D[Open Review Modal]
    C -->|Dismiss| E[Goes to Inbox]
    C -->|Ignore| E

    D --> F[Review Call]
    F --> G[Complete Review]
    G --> H((Done))

    E --> I[Review Later]
    I --> H

    style B fill:#ffeb3b
    style D fill:#f3e5f5
    style H fill:#4caf50,color:#fff
```

---

## Flow 3: Call Bridge Context (Phase 2)

**During-Call Path**: Coordinator sees context while on active call

```mermaid
flowchart TD
    subgraph DETECT["📱 Call Detection"]
        A[Call Starts] --> B[Aircall Event]
        B --> C[Graph Match]
        C --> D{Match Found?}
    end

    subgraph SINGLE["✅ Single Match"]
        D -->|One| E[Show Context Panel]
        E --> F[Recipient Name]
        F --> G[Package Details]
        G --> H[Recent Notes]
        H --> I[Open Tasks]
    end

    subgraph MULTI["⚠️ Multiple Matches"]
        D -->|Multiple| J[Show Package List]
        J --> K[Select Package]
        K --> E
    end

    subgraph NONE["❌ No Match"]
        D -->|None| L[Show Search]
        L --> M{Link Now?}
        M -->|Yes| N[Search Package]
        N --> O[Link]
        O --> E
        M -->|Later| P[Minimal Panel]
    end

    subgraph ACTIVE["📝 During Call"]
        I --> Q[Add Notes]
        P --> Q
        Q --> R[Auto-Save 30s]
        R --> S[Call Ends]
    end

    subgraph END["🏁 Call End"]
        S --> T[Save Notes]
        T --> U[Create Activity]
        U --> V[To Inbox for Review]
    end

    style DETECT fill:#e3f2fd
    style SINGLE fill:#e8f5e9
    style MULTI fill:#fff3e0
    style NONE fill:#ffebee
    style ACTIVE fill:#f3e5f5
    style END fill:#e8f5e9
```

**Decision Points:**

| Point | Options | Behavior |
|-------|---------|----------|
| Match Found? | One / Multiple / None | Always show list for multiple |
| Link Now? | Yes / Later | Can defer to inbox review |

---

## Flow 4: Recording Access

**Playback Path**: User accesses call recording

```mermaid
flowchart LR
    A[View Call] --> B{Has Recording?}

    B -->|Yes| C{Has Permission?}
    B -->|No| D[No Recording Available]

    C -->|Yes| E[Play Recording]
    C -->|No| F[Access Restricted]

    E --> G{Action?}
    G -->|Play| H[Audio Player]
    G -->|Download| I[Download File]

    H --> J((Done))
    I --> J
    D --> J
    F --> J

    style E fill:#e8f5e9
    style F fill:#ffebee
    style J fill:#4caf50,color:#fff
```

---

## Flow 5: Batch Review

**Efficiency Path**: Review multiple calls at once

```mermaid
flowchart TD
    A[Open Inbox] --> B[Select Multiple Calls]
    B --> C{All Same Package?}

    C -->|Yes| D[Batch Complete]
    D --> E[Activities Created]

    C -->|No| F[Review One-by-One]
    F --> G[Link Each]
    G --> H[Complete Each]
    H --> E

    E --> I((Done))

    style D fill:#e8f5e9
    style I fill:#4caf50,color:#fff
```

---

## Story Coverage

| Story | Description | Flow(s) | Phase |
|-------|-------------|---------|-------|
| **US01** | View Package Context During Call | [Call Bridge Flow](#flow-3-call-bridge-context-phase-2) | P2 |
| **US02** | Manually Link Unmatched Calls | [Call Review Flow](#flow-1-call-review-inbox-phase-1), [Call Bridge Flow](#flow-3-call-bridge-context-phase-2) | P1 |
| **US03** | Complete Call Reviews from Inbox | [Call Review Flow](#flow-1-call-review-inbox-phase-1), [Flash Alert Flow](#flow-2-flash-alert-immediate-review), [Batch Review](#flow-5-batch-review) | P1 |
| **US04** | Add Call Notes | [Call Bridge Flow](#flow-3-call-bridge-context-phase-2) | P2 |
| **US05** | Access Call Recordings | [Recording Access Flow](#flow-4-recording-access) | P3 |

---

## Inline Flow Snippets (Per Story)

### US02: Manually Link Unmatched Calls

```mermaid
flowchart LR
    A[No Match] --> B[Search Package]
    B --> C[Select Result]
    C --> D[Call Linked]
    D --> E[Context Shows]
```

### US03: Complete Call Reviews from Inbox

```mermaid
flowchart LR
    A[Inbox] --> B[Select Call]
    B --> C[Review Summary]
    C --> D{Linked?}
    D -->|Yes| E[Complete]
    D -->|No| F[Link First]
    F --> E
    E --> G[Activity Logged]
```

### US05: Access Call Recordings

```mermaid
flowchart LR
    A[Call Details] --> B{Permission?}
    B -->|Yes| C[Play/Download]
    B -->|No| D[Restricted]
```

---

## State Transitions

```mermaid
stateDiagram-v2
    [*] --> CallEnded: Call ends
    CallEnded --> AwaitingTranscription: Queued
    AwaitingTranscription --> PendingReview: Transcription ready
    PendingReview --> InReview: Coordinator opens
    InReview --> Reviewed: Complete review
    InReview --> PendingReview: Close without completing
    Reviewed --> [*]

    PendingReview --> NonPackage: Mark non-package
    NonPackage --> [*]
```

---

## Error Paths

| Error | Flow Point | Handling |
|-------|------------|----------|
| Transcription fails | After call ends | Retry 3x, then manual entry option |
| Package search returns nothing | Link step | Suggest "Non-package" or create new contact |
| Activity creation fails | Complete review | Queue for retry, show warning |
| Recording unavailable | Playback | Show "Recording not available" message |
| Network offline | Any | Cache locally, sync when online |

---

## Path Summary

| Path Type | Count | Description |
|-----------|-------|-------------|
| Happy paths | 5 | Auto-match → Review → Activity logged |
| Alternate paths | 3 | Manual link, batch review, flash alert |
| Error paths | 5 | See error table above |
| Decision points | 8 | Match status, link choice, note addition |

---

## Quick Reference

**Phase 1 MVP Flow:**
```
Call Ends → Transcription → Inbox → Review → Link (if needed) → Complete → Activity
```

**Phase 2 Full Flow:**
```
Call Starts → Context Panel → Notes → Call Ends → Inbox → Review → Activity
```
