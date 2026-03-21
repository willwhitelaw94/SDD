# Schema Migration Notes - On Hold Bills Reasons

**Date**: 2026-01-08
**Last Updated**: 2026-01-13
**Epic**: TP-3787 OHB - On Hold Bills Flow
**Source**: Compliance_Bill_Processing_Exceptions_Sheet_Full_local.csv
**Output**: master-list-schema-updated.csv

---

## Summary

Successfully migrated 36 on-hold reasons from old schema to new schema with 23 columns.

**Completion**: ~70% automated, ~30% flagged for manual review

### Pending Schema Addition (2026-01-13)

A new column `Requires_Resolution_Outreach` (Boolean) needs to be added to the master list. This identifies which reasons require client/coordinator action during the resolution phase (triggering Resolution Outreach comms and the 1-day Resolution Window).

**Classification needed for all 36 reasons**:
- TRUE: Client or coordinator must take action (approvals, confirmations, voluntary contributions)
- FALSE: Pure internal work or supplier-facing issue only

See DESIGN-DECISIONS.md section "Parallel Processing with Resolution Window" for full details.

---

## What Was Automated

### 1. Direct Mappings
- ✅ Reason names (using as IDs, removed arbitrary codes)
- ✅ Description (from "Application" column)
- ✅ Key_Principles (direct copy)
- ✅ Day 0/3/7/10 communications (direct copy)

### 2. Inferred Values

#### Department_Owner
- Inferred from "Reason Type" column
- **Compliance**: E-prefixed reasons (16 reasons)
- **Care**: Non-prefixed care-related reasons (14 reasons)
- **Accounts**: Finance/banking related reasons (6 reasons)

#### Touches_Invoice (requires invoice changes = must resubmit)
**TRUE (24 reasons)**:
- ABN/GST error, Calculation error, Client name, Itemisation
- Exceeds master price list, Quarter end date, Funding period
- Supplier price increase, Supplier terminated
- Itemisation required for contribution categories, Travel or transport not itemised
- No proof of payment, No source invoice, Finance QA failure
- Exceeds budgeted rate, Exceeds budgeted quantity
- Commencement date, Termination date

**FALSE (12 reasons)** - contextual holds:
- Supplier in progress, Supplier not found, Supplier not registered for service type
- Supplier performance improvement
- Insufficient balance, Service type not in budget, Coordinator approval required
- Client approval required, Unplanned services reached maximum cap
- Unverified funding stream, Unapproved services, ATHM
- Missing client bank details, Missing supplier bank details, Other

#### Auto_Reject_Eligible (99% AI accuracy + instant)
**TRUE (9 reasons)**:
- ABN/GST error (missing ABN detectable)
- Calculation error (math validation)
- Client name (missing/invalid name)
- Itemisation (missing line items)
- Supplier terminated (date comparison)
- Itemisation required for contribution categories
- Commencement date (date before start)
- Termination date (date after end)
- Finance QA failure (system-detected)

**FALSE (27 reasons)** - require human judgment

#### Cadence_Days
- **0 days**: Auto-reject reasons (9 reasons)
- **10 days**: Standard timeout (26 reasons)
- **NULL**: ATHM, Supplier performance improvement (no fixed timeline)

#### Has_Timeout
- **TRUE**: All except ATHM and Supplier performance improvement (34 reasons)
- **FALSE**: ATHM, Supplier performance improvement (2 reasons)

### 3. Extracted & Standardized

#### Possible_Outcomes
Parsed from "Acceptable Outcomes" and "Remedy" columns, standardized format:
- "Corrected invoice submitted, ABN/GST status updated"
- "Budget updated, Voluntary contribution made, Package review initiated"
- "Approval granted, Invoice rejected"

#### Success_Outcome vs Failure_Outcome
**Success** = outcome that allows payment to proceed
**Failure** = "Rejected after Day X" or "Rejected immediately"

Examples:
- ABN/GST error: Success = "Corrected invoice submitted" | Failure = "Rejected after Day 10"
- Insufficient balance: Success = "Funding confirmed or VC added" | Failure = "Rejected after Day 10"
- Supplier terminated: Success = "Invoice corrected for pre-termination dates" | Failure = "Rejected immediately"

#### Bill_Processor_Action & Department_Action
Split from "Responsibilities" column:
- **Bill_Processor_Action**: What bill processor does when flagging this reason
- **Department_Action**: What department needs to do (if applicable)

#### Supplier_Action_Required
Extracted from Day 0 comms - what supplier must do to resolve

---

## What Needs Manual Review

### 🔍 HIGH PRIORITY - Requires Domain Expert Input

#### 1. Requires_Revalidation
**Current approach**: Set TRUE for all reasons that "Touches_Invoice"
**Assumption**: Any reason requiring resubmission should trigger context re-checks

**⚠️ Review needed**: Are there invoice-defect reasons that DON'T need revalidation?

#### 2. Revalidation_Checks
**Current values**:
- `funding_balance, funding_period` - most common
- `funding_period` - date-related reasons
- `N/A` - contextual holds

**⚠️ Review needed**:
- Are these the right checks for each reason?
- Are there other time-sensitive qualifiers to re-check?
- Should we add `authorization_status`, `service_eligibility`, etc.?

#### 3. Can_Coexist_With
**Current approach**: Made educated guesses based on logical compatibility

**Key decisions made**:
- "Supplier terminated" = coexists with NONE (should dominate communication)
- Auto-reject reasons = coexist with "All except Supplier terminated"
- Contextual holds = generally coexist with "All"

**⚠️ Review needed**:
- Should certain funding reasons (Insufficient balance + Service type not in budget) be grouped differently?
- Are there other "dominant" reasons like Supplier terminated?
- Should ATHM coexist with standard reasons or be exclusive?

### 🔍 MEDIUM PRIORITY - Validation Needed

#### 4. Auto_Reject_Eligible Flags
**Flagged as TRUE (9 reasons)** based on assumption AI can detect with 99% accuracy.

**⚠️ Review with AI/Tech team**:
- ABN/GST error - can AI reliably detect invalid ABN? ✓ Likely yes
- Calculation error - can AI detect math errors accurately? ✓ Likely yes
- Client name - can AI detect missing/invalid names? ✓ Likely yes
- Itemisation - can AI detect missing line items? ✓ Likely yes
- Supplier terminated - requires date comparison + supplier status check - needs system integration
- Date validations (Commencement/Termination) - requires system data access

#### 5. Examples Column
**Current**: Basic examples provided for each reason

**⚠️ Review needed**: Add more real-world examples from actual bills?

#### 6. Notes Column
**Current**: Added context about special cases, edge cases, workflow differences

**⚠️ Review needed**: Are there additional edge cases or special handling notes to document?

---

## Key Design Decisions

### 1. Removed Arbitrary Codes
- Old schema had E007, E008, etc. for Compliance reasons
- These were remnants from source documents, not meaningful
- **Decision**: Use reason names as identifiers instead

### 2. Standardized Outcome Format
- Old schema had inconsistent "Acceptable Outcomes" and "Remedy" columns
- **Decision**:
  - `Possible_Outcomes` = comma-separated list of all possible resolution states
  - `Success_Outcome` = specific outcome that enables payment
  - `Failure_Outcome` = rejection state

### 3. Simplified Communications
- Old schema had very verbose communication text
- **Decision**: Kept essential text, removed redundancy
- Placeholder format: "Supplier: [message]. Client: [message]."

### 4. Contextual Holds vs Invoice Defects
- **Touches_Invoice = FALSE**: Reason can be resolved while bill stays on hold (no resubmission)
- **Touches_Invoice = TRUE**: Reason requires invoice changes (must reject and resubmit)

This distinction drives:
- Communication strategy (on-hold notice vs rejection notice)
- Workflow routing
- Re-validation requirements

---

## Statistics

### By Department
- **Compliance**: 16 reasons (44%)
- **Care**: 14 reasons (39%)
- **Accounts**: 6 reasons (17%)

### By Type
- **Touches Invoice (must resubmit)**: 24 reasons (67%)
- **Contextual Hold (resolve in place)**: 12 reasons (33%)

### By Auto-Reject Eligibility
- **Auto-Reject Eligible**: 9 reasons (25%)
- **Requires Human Review**: 27 reasons (75%)

### By Cadence
- **Instant (0 days)**: 9 reasons (25%)
- **10-day timeout**: 26 reasons (72%)
- **No fixed timeline**: 2 reasons (3%) - ATHM, Supplier performance improvement

---

## Next Steps for Stakeholder Review

### For Romy (Care Team)
**Review Care reasons (14 total)** for:
1. ✅ Accuracy of `Department_Action` descriptions
2. ⚠️ `Possible_Outcomes` completeness
3. ⚠️ `Can_Coexist_With` relationships with other care reasons
4. ⚠️ Communication text appropriateness

### For Zoe (Compliance Team)
**Review Compliance reasons (16 total)** for:
1. ✅ Accuracy of compliance process descriptions
2. ⚠️ `Auto_Reject_Eligible` flags (which can truly be AI-automated?)
3. ⚠️ `Revalidation_Checks` requirements
4. ⚠️ `Can_Coexist_With` relationships

### For Mellette (Accounts Team)
**Review Accounts reasons (6 total)** for:
1. ✅ Accuracy of accounts workflows
2. ⚠️ Missing accounts reasons not yet captured?
3. ⚠️ Special handling for reimbursement vs direct billing

### For David (Master List Compilation)
**Cross-cutting review**:
1. ⚠️ De-duplication opportunities across departments
2. ⚠️ Missing reasons not yet captured
3. ⚠️ Naming consistency
4. ⚠️ Can_Coexist_With matrix validation

---

## Files Created

1. **master-list-schema-updated.csv** - Complete 36-reason list with new schema (23 columns)
2. **SCHEMA-MIGRATION-NOTES.md** - This document

## Original Files (Preserved)
1. **compliance-reasons-schema.csv** - Original source data
2. **workflow-diagram.jpg** - Original workflow diagram

---

## Legend

✅ = Completed / High confidence
⚠️ = Needs manual review
🔍 = Requires domain expert input
