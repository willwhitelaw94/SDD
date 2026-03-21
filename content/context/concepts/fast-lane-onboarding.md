---
title: Fast Lane Onboarding
description: Streamlined client onboarding process enabling 24-hour turnaround for new packages
icon: i-heroicons-bolt
navigation:
  order: 10
---

# Project Fast Lane

Project Fast Lane is a streamlined client onboarding initiative designed to reduce delays and improve the client experience by enabling **24-hour turnaround for new packages** while maintaining appropriate risk screening and clinical oversight.

## Overview

### Problem Statement

The previous onboarding process had significant friction:
- Clients took **2-14 days** to return questionnaires
- **~10% client drop-off** due to questionnaire burden
- Fixed 14-day onboarding window created uncertainty
- Complex process variations based on IAT age (12-month cutoff)
- Transfer and new package clients followed similar paths despite different needs

### Solution

Fast Lane replaces the lengthy questionnaire-based process with a streamlined risk and suitability review at point of sale:

| Package Type | Process | Turnaround |
|--------------|---------|------------|
| **New Packages** | Fast Lane | 24 hours |
| **Transfer Packages** | Standard BAU | 2 weeks (aligned with exit dates) |

## Key Components

### 1. Eligibility Criteria

**Fast Lane eligible:**
- New packages only (not transfers)
- All IAT ages accepted (no 12-month cutoff)
- Must pass risk screening

**Standard process:**
- Transfer packages (must align with exit dates from previous providers)
- Clients flagged as unsuitable for self-managed care

### 2. Risk Assessment & Screening

The new approach replaces self-reported questionnaires with an **IAT-powered AI assessment tool**:

#### Assessment Tool Features
- Downloads and analyzes ACAT/IAT support plans
- Extracts structured data using AI
- Includes complementary risk questions
- Assesses client technology capability
- Identifies changes since assessment

#### Three-Tier Assessment Outcomes

| Outcome | Description | Action |
|---------|-------------|--------|
| **A** | Standard self-managed | Proceed with onboarding |
| **B** | Coordinator model recommended | Client can override with clinical review |
| **C** | Model unsuitable | Refer to fully managed providers |

#### Clinical Review Process
- ~2% of clients flagged for clinical review
- **24-hour turnaround** for clinical team review
- Clear recommendations: proceed, coordinate, or refer out

### 3. Onboarding Workflow

```
Lead Created (TCID generated)
    ↓
Sales completes Risk Assessment Tool
    ↓
[Pass] → Book meeting via Calendly
    ↓
Commencement date = Meeting date
    ↓
Auto-send: HCA, Direct Debit signup, Care Preference Survey
    ↓
Assessment Meeting (verbal consent if needed)
    ↓
ASA Lodgement (at CP sent status)
    ↓
Care Plan delivered (within 14 days)
```

### 4. Key Process Changes

#### Commencement Date
- **Before:** Fixed 14-day onboarding window
- **After:** Commencement date = client's booked meeting date

#### HCA Consent
- **Before:** Sales team obtained verbal consent
- **After:** Assessment coordinators handle during meeting

#### Risk Screening
- **Before:** Self-reported questionnaires (2-14 day delay)
- **After:** AI-powered IAT analysis at point of sale

#### ASA Lodgement
- Timing: At "CP sent" status
- Benefit: Window to withdraw clients if issues discovered
- Note: ASA can be backdated but not forward-dated

### 5. Questionnaire Redesign

The onboarding questionnaire was streamlined for person-centered care:

**Changes:**
- Reduced free-text questions to avoid client confusion
- Positioned after HCA signing for proper consent
- Focuses on personal preferences, not clinical risks
- Feeds into care plans for service providers
- Optional completion with staff follow-up for gaps

### 6. Partner/Coordinator Integration

**New clients via coordinators:**
- Eligible for Fast Lane
- Coordinators can perform risk assessment data entry
- 24-hour turnaround contingent on coordinator responsiveness

**Transfer clients:**
- Continue through standard BAU process
- E3 partner referral forms updated for mandatory Fast Lane info

**Referral Form Updates:**
- Two mandatory questions added:
  1. Number of previous providers
  2. Reasons for switching from self-managed providers

## Technical Implementation

### Systems Integration

| System | Role |
|--------|------|
| **Vibe Assessment Tool** | Risk assessment and IAT analysis |
| **Trilogy AI** | Data extraction from support plans |
| **CRM (Zoho)** | Lead management, onboarding module |
| **Calendly** | Meeting booking (replaced by Simply Book) |
| **Portal** | Care plan delivery, HCA signing |
| **My Aged Care** | ASA lodgement, funding validation |
| **MyOB** | Invoice creation on "signed" status |

### CRM Module
- New dedicated onboarding forms module
- Separate from care plan module to avoid workflow conflicts
- JSON block format in Portal for flexible key-value storage
- Existing package creation APIs leveraged

### Automation Goals
- Automated care plan creation (MVP)
- Mandatory pop-ups for clinical notes on status changes
- Webhook connectivity with care portals
- Real-time client record synchronization

## Financial & Payment Integration

### Direct Debit Implementation
- Bank account: **$0.25-0.50** per transaction
- Credit card: **2%** processing fee
- Current usage: **70-80%** clients use direct debit
- Integration trigger: Client progression to "signed" status

### Interim Funding
- **60% package funding** available immediately
- Allows earlier service commencement while awaiting full approval
- Auto-scales to 100% upon full approval
- Requires Services Australia validation

## Metrics & Success Criteria

### Target Outcomes
- 24-hour turnaround for new packages
- Reduced client drop-off (from ~10%)
- Elimination of questionnaire chase time
- Faster onboarding completion
- Maintained/improved client safety standards

### Monitoring
- Approval rates and suitability flags
- Screening threshold accuracy
- Clinical review turnaround times
- Client satisfaction and drop-off rates

## Key Stakeholders

| Role | Person | Responsibility |
|------|--------|----------------|
| Process Owner | Jackie P | Rollout and alignment across teams |
| Testing/Data | Romy B | Tool validation, care team briefing |
| CRM Implementation | Zoe J | Onboarding module development |
| Growth/Referrals | Bernie | Referral forms, coordinator pipeline |
| Technical/API | Mike W | Integration and deployment |
| Clinical Alignment | Marianne | Clinical review user groups |
| Content/Comms | Scott R | Communication materials |

## Timeline

| Date | Milestone |
|------|-----------|
| Sep 15, 2025 | Project Fast Track halfway check-in |
| Sep 17, 2025 | Referral forms finalization |
| Sep 29, 2025 | Questionnaire streamlining |
| Oct 3, 2025 | Process validation complete |
| **Oct 6, 2025** | **Fast Lane launch (Priority 1)** |
| **Nov 6, 2025** | **Full go-live** |

## Related Initiatives

- [Client-HCA](../Client-HCA/) - Home Care Agreement portal integration
- [Lead-Essential](../Lead-Essential/) - Lead management essentials
- [Lead-To-HCA](../Lead-To-HCA/) - Lead to agreement workflow

## Source Meetings

| Date | Meeting | Key Topics |
|------|---------|------------|
| Sep 15, 2025 | Project Fast Track - Halfway Check In | Eligibility redesign, IAT AI tool, Nov 6 go-live |
| Sep 17, 2025 | Referral Forms for Fast Lane | Form modifications, Support at Home transition |
| Sep 29, 2025 | Fast Lane - Questionnaire Discussion | Person-centered questionnaire redesign |
| Oct 3, 2025 | Catch up - Fast Lane Onboarding Process | Process now live, automation enhancements |
