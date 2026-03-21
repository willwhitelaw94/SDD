---
title: HCA Requirements Gap Analysis
description: Comparison of business requirements against spec coverage
created: 2026-01-27
---

## HCA Business Requirements Review

Analysis comparing business requirements for Home Care Agreements against what's documented in the spec.

### Requirements Comparison

| Requirement | Spec Coverage | Status |
|-------------|---------------|--------|
| **Commencement date** (user input) | FR-074: "allow recipients to confirm/adjust package commencement date during HCA signing" and Flow 2 Step 3 | **Covered** |
| **Commencement ≤ cessation date** | Implied via LTH Wizard (dates captured in Step 2) but no explicit validation rule | **Gap - needs explicit validation** |
| **Signed date** | FR-018: "capture signer identity, timestamp, and IP address with signature" | **Covered** |
| **Termination date** (user input) | FR-063: "capture termination reason, effective date, final statement requirements, and notes" | **Covered** |
| **Only one HCA active per package** | Mentioned in Edge Cases ("only one can be 'Signed' at a time") but no explicit FR | **Partially covered - needs FR** |
| **Care coordination change triggers new HCA** | FR-079: "create HCA Variation when management option is changed post-signing" | **Covered via Variation** |
| **Fee change triggers new HCA** | Coordinator price template selection exists (FR-072, FR-082) but no explicit rule | **Gap** |
| **New agreement effective upon signing** | State model shows transition to "Signed" upon signature, Package activates (FR-119) | **Covered** |
| **Old HCA termination date = new HCA effective date** | No automatic termination of old HCA when new one is signed | **Gap** |

### Summary of Gaps

1. **Explicit validation**: Commencement date ≤ cessation date validation not explicitly stated as a requirement
2. **One active HCA constraint**: Only mentioned in edge cases, should be a formal functional requirement
3. **Fee change trigger**: No explicit rule linking fee changes to new HCA/Variation creation
4. **Auto-termination workflow**: When a new HCA becomes effective, the previous HCA's termination date should automatically be set to the new HCA's effective date - this workflow isn't documented

### Recommended Additions to Spec

#### New Functional Requirements

```
FR-120: System MUST validate that HCA commencement date is less than or equal to the package cessation date from the referral/package record

FR-121: System MUST enforce that only one HCA can be in "Signed" state per package at any time

FR-122: System MUST automatically set the termination date of the current active HCA to the effective date of a newly signed HCA (day before)

FR-123: System MUST trigger creation of an HCA Variation when care coordination fees change
```

### Business Rules

1. **Commencement Date**: Must be input by user during signing flow, validated against cessation date
2. **Signed Date**: System-captured timestamp when signature is completed
3. **Termination Date**: User input when terminating, OR auto-assigned when superseded by new HCA
4. **Single Active HCA**: Only one HCA per package can be active (Signed state) at any time
5. **Triggers for New HCA/Variation**:
   - Care coordinator change
   - Fee/rate change
   - Management option change
6. **Effective Date Logic**: New agreement becomes effective upon signing; old agreement terminates day before
