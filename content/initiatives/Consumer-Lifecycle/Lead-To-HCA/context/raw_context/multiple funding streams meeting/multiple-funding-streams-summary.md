# Multiple Funding Streams - Key Requirements for LTH

**Source**: Meeting with Rebecca Eadie, Romy Blacklaw, Celeste, January 30, 2026

## Problem Statement

**Current State**:
- Only **ONE funding stream** captured at point of sale (highest value prioritized)
- Additional funding streams buried in **care plan notes** → untracked, unbilled
- No structured capture in onboarding forms or CRM
- Exit/termination only captures original funding stream
- Missed activations = unpaid invoices

**Impact**:
- Compliance risk (activating streams without client consent)
- Billing delays and lost revenue
- Manual tracking burden on care partners
- Incomplete client funding picture

---

## Core Requirements for LTH

### 1. Multi-Funding Stream Capture at Point of Sale

**Current**: Single funding stream select
**Required**: Multi-select funding streams at onboarding

- Capture **all applicable funding streams** during sales push form
- Each stream requires **explicit client consent**
- Primary funding stream remains singular for Portal integration
- Additional streams stored as secondary/unverified until confirmed

### 2. Consent & Agreement Management

**Legal Requirement**: Signed amendment per new funding stream before Proda entry

- **Amendments must be signed** for each additional funding stream
- Cannot activate funding in Proda without signed consent
- Consent capture at onboarding is dynamic:
  - Selecting funding stream = initial consent
  - Activation requires signed amendment
- Special case: ATHM-only onboarding uses existing agreement template (confirmed by Erin)

### 3. Architecture Change: Consumer-to-Many Care Plans

**Current**: One-to-one (Consumer ↔ Care Plan)
**Proposed**: One-to-many (Consumer ↔ Multiple Care Plans)

**Benefits**:
- Terminate **individual funding streams** without affecting entire client account
- Each care plan represents a distinct funding stream
- Scalable for future growth
- Aligns with long-term system architecture

**Migration**: Major effort required

### 4. Funding Stream Lifecycle Tracking

**New CRM Module Required**:
- Track funding applications, approval stages, exits
- Record application date, approval date, activation date, termination date
- Link to My Aged Care API for status notifications
- Care partner dashboard visibility (not email-based)

**Fields per Funding Stream**:
- Funding Type (HCP, Restorative Care, ATHM, End of Life)
- Application Date
- Approval Date
- Activation Date (Proda entry)
- Termination Date/Flag (granular, not whole package)
- Status (Applied, Approved, Active, Terminated)

### 5. Proda Entry Management

**Current Issues**:
- Entries recorded late or only for single stream
- Backdating required but risky (time limits: ATHM = 12mo)
- No automated tracking of entry completion

**Requirements**:
- Proda entry linked to signed amendment
- Entry timestamp captured
- Alert if time-limited funding approaching expiry
- Validation: Cannot enter Proda without signed amendment

### 6. Special Funding Stream Cases

#### Restorative Care Coordination Fees
- Must be **fully coordinated internally** (separate from ongoing package fees)
- Requires distinct budget and fee management
- Toggle or separate budget items for coordination type

#### Assistive Tech Home Modifications (ATHM)
- **Time-limited**: 12-month activation window
- Once-in-a-lifetime funding
- Requires client consent confirmation before activation

#### Mixed Management Options
- Example: External coordinator for HCP + Internal for Restorative Care
- UI must support **multiple coordination types simultaneously**

### 7. Termination Granularity

**Current**: Terminating one stream terminates entire client
**Required**: Per-stream termination flags

- Termination field per funding stream (not package-level)
- Clear signals to operations: which stream to terminate in Proda
- Prevent accidental whole-package termination

---

## Integration Points with LTH Epic

### Conversion Wizard Updates

**Package Details Step**:
- ~~Single funding stream dropdown~~ → **Multi-select funding streams**
- Display all applicable streams with checkboxes
- Capture explicit consent per stream
- Primary stream designation

**Agreement Setup Step**:
- Generate **amendments** for additional funding streams
- Track amendment signing status per stream
- Block Proda entry until amendment signed
- Timeline logging per funding stream action

**New Step: Funding Stream Management** (Optional)
- Review all funding streams
- Confirm consent captured
- Review time-limited streams (ATHM, etc.)
- Set primary vs secondary designation

### Data Model Changes

**Care Plan Architecture**:
```
Consumer (1) ─┬─ Care Plan 1 (HCP Level 2)
              ├─ Care Plan 2 (Restorative Care)
              └─ Care Plan 3 (ATHM)
```

**Funding Stream Fields** (per care plan):
- Funding Type
- Application Date
- Approval Date
- Commencement Date
- Cessation Date
- Management Option (Self/Coordinated/Brokered)
- Consent Captured (Boolean)
- Amendment Signed (Boolean)
- Proda Entry Date
- Status (Applied/Approved/Active/Terminated)

### CRM Integration

**Sales Push Form Updates**:
- Multi-select funding stream field
- Consent capture per stream
- Primary stream designation

**Webhook Enhancements**:
- Create **multiple care plan records** (one per funding stream)
- Trigger **multiple package records** in Portal
- Link packages to single consumer

**Consumer Module**:
- Display all funding streams
- Track agreement/amendment status per stream
- Finance workflow per stream

---

## Out of Scope (Separate Epic/Future Work)

- **Funding Stream Notifications**: Dashboard/API notifications from My Aged Care
- **Care Partner Work Management**: Task assignment for funding activations
- **Billing Automation**: Multi-stream invoicing
- **Post-Conversion Funding Stream Additions**: Adding streams to existing clients (not at point of sale)

---

## Open Questions

1. **Amendment Workflow**: Does each funding stream require a separate amendment document, or can one amendment cover multiple streams?
2. **Portal Package Creation**: Does Portal create one package with multiple streams, or multiple packages (one per stream)?
3. **Primary Stream Logic**: How is primary stream determined if client has equal-value streams?
4. **Care Plan Meeting**: Do all funding streams get discussed in one meeting, or separate meetings per stream?
5. **Legal Coverage**: Does one HCA cover all funding streams, or separate agreements per stream?

---

## Action Items from Meeting

**For LTH Epic**:
- Update sales push form to support multi-select funding streams (Romy → Jack/Will)
- Create unverified funding streams in Portal to match CRM data (Romy → Matt/Tim)
- Define amendment signature requirements per funding stream (Celeste → Erin)
- Design CRM module for funding stream lifecycle tracking (Rebecca → CRM team)
- Build API integration for My Aged Care funding status notifications (Matt/Tim)

---

**Meeting Attendees**: Rebecca Eadie, Romy Blacklaw, Celeste D, Matthewa, Timb, Jack
**Document Created**: February 5, 2026
**Absorbed into**: LTH Epic (TP-2012)
