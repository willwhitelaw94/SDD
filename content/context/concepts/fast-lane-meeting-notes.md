# Project Fast Lane - Meeting Notes

This document contains consolidated notes from all Fast Lane project meetings, extracted from Fireflies transcripts.

---

## Meeting 1: Project Fast Track - Halfway Check In

**Date:** September 15, 2025
**Duration:** 60 minutes
**Organizer:** kathryno@trilogycare.com.au
**Attendees:** Kathryn O, Patrick H, Glen K, Erin H, Mike W, Romy B, Jackie P, Scott R, Zoe J, Katja P, Marleze S, Room 203, Emma A, Bernie Ng, Stephen D, Steven B, Will W

### Summary

The meeting addressed significant updates in eligibility criteria and process redesign, emphasizing the transition from temporal IAT-based criteria to package-type differentiation for fast lane onboarding.

### Key Decisions

#### Eligibility Criteria Redefined
- Fast Lane eligibility changed from 12-month IAT cutoff to **package-type differentiation**
- **New packages** qualify for 24-hour fast lane regardless of IAT age
- **Transfer packages** follow 2-week standard onboarding aligned with exit dates
- Rationale: Previous 12-month IAT cutoff created excessive process variations

#### Assessment Tool Implementation
- Transition from self-reported questionnaires to **IAT-powered AI assessment tool**
- AI extraction of structured data from aged care assessments
- Testing required on clients with IAT older than 12 months
- Three-tier assessment outcomes: A (standard), B (coordinator recommended), C (unsuitable)

#### Operational Workflow
- HCA verbal consent moved from sales to assessment meeting
- ASA lodgement timing set for CP sent status
- Partner referral forms require uplift for mandatory fast lane information

#### Technical Progress
- Vibe assessment tool ready for testing
- CRM module development ~50% complete
- Direct debit integration requires communication strategy
- 60% interim funding now available

### Action Items

| Owner | Action | Timestamp |
|-------|--------|-----------|
| Meeting Lead | Map final proposed onboarding flow | 32:03 |
| Meeting Lead | Create communication uplift strategy | 43:40 |
| Romy | Test assessment tool on existing clients with old IAT | 13:28 |
| Romy | Complete Vibe tool testing within 2-3 days | 36:34 |
| Mike | Upload Vibe tool to Trilogy apps | 33:32 |
| Mike | Complete CRM-Portal API integration | 59:15 |
| Zoe | Finish CRM module fields by end of day | 40:46 |
| Zoe | Create new onboarding forms module | 42:25 |
| Bernie | Establish working group for partner referral process | 22:47 |
| Bernie & Growth | Develop coordinator communication strategy | 18:15 |
| Scott | Coordinate content review for communication materials | 43:40 |
| Steve/Clinical | Create contribution payment options guide | 52:36 |

---

## Meeting 2: Referral Forms for Fast Lane

**Date:** September 17, 2025
**Duration:** 29 minutes
**Organizer:** jacquelinep@trilogycare.com.au
**Attendees:** Jackie P, Zoe J, Bernie Ng, Romy B, Room 203

### Summary

The meeting outlined the Fast Lane Implementation Strategy, set to launch on October 6th, focusing on new client packages to tackle the Silver Tsunami challenge.

### Key Decisions

#### Launch Strategy
- Fast Lane going live **October 6th**
- Focus on new packages only to address Silver Tsunami
- Onboarding screening tool mandatory for all eligible clients
- 24-hour turnaround only achievable if coordinators respond promptly

#### Referral Form Changes
- Two mandatory questions added to Priority 1 referral form:
  1. Number of previous providers
  2. Reasons for switching from self-managed providers
- Questions feed directly into risk assessment workflow

#### Coordinator Integration
- Coordinators can participate for new clients only
- Transfers continue through standard BAU process
- Outbound APM calls required for meeting coordination
- Pilot approach recommended with 1-2 coordinators first

#### Support at Home Transition
- **4,000 hours** of client conversations required
- Utilization analysis completed for all clients
- November 1st implementation date for new fee structure
- Client budgets show final agreed service prices without explicit coordinator fee breakdown

### Action Items

| Owner | Action | Timestamp |
|-------|--------|-----------|
| Bernie | Add two mandatory questions to Priority 1 form | 04:43 |
| Bernie | Activate Wayne/Jay for coordinator pipeline | 11:25 |
| Bernie | Hold off utilization reports until Romy alignment | 26:22 |
| Romy | Send Bernie the two required questions | 06:06 |
| Romy | Share finalized client conversation plan | 25:08 |
| Romy | Brief Care management team on SaH transition | 27:41 |
| Romy | Invite Bernie to care team briefing | 27:41 |

---

## Meeting 3: Fast Lane - Questionnaire Discussion

**Date:** September 29, 2025
**Duration:** 17 minutes
**Organizer:** sianh@trilogycare.com.au
**Attendees:** Maryanne H, Kathryn O, Romy B, Zoe J, Scott R, Sian H, Alana F, Emma A

### Summary

The team discussed streamlining the onboarding questionnaire to better align with client needs and the care planning process.

### Key Decisions

#### Questionnaire Redesign
- Reduce free-text questions to avoid client confusion
- Focus on **personal preferences**, not clinical risks
- Use dropdowns for easier completion and consistent data
- Position after HCA agreement for proper consent alignment
- Submit button on last page, agreement at front

#### Care Plan Integration
- Questionnaire data maps to supplier needs by service type
- All suppliers receive updated care plan with client preferences
- Staff prompted to discuss preferences if questionnaire incomplete

#### Client Consent
- Consent handled via Home Care Agreement or service agreement
- Care plans physically available in client homes
- No direct portal access for support workers planned yet

### Action Items

| Owner | Action | Timestamp |
|-------|--------|-----------|
| Maryanne H | Schedule meeting with Scott, Alana, Zoe for questionnaire review | 11:02 |
| Scott R | Review workflow links for questionnaire placement | 08:18 |
| Romy B | Update questionnaire form based on feedback | 10:37 |
| Zoe J | Participate in refinement meeting | 11:18 |
| Zoe J | Confirm agreement page placement | 15:21 |

---

## Meeting 4: Catch up - Fast Lane Onboarding Process

**Date:** October 3, 2025
**Duration:** 29 minutes
**Organizer:** jacquelinep@trilogycare.com.au
**Attendees:** Jackie P, Room 202, Bernie Ng, Jay P, Caitlin B, Fran D

### Summary

The meeting addressed the new onboarding process aimed at improving client experience and reducing delays. The process is now live with ongoing refinement planned.

### Key Process Details

#### Onboarding Flow
1. Lead created with TCID generated
2. Sales completes risk assessment tool
3. Approved clients proceed with profile completion
4. Meeting booked via Calendly
5. Commencement date = meeting date
6. Auto-send HCA, direct debit signup, care preference survey
7. Assessment meeting (verbal consent if digital signing not possible)
8. 14-day buffer for care plan delivery

#### Risk Assessment Integration
- Risk assessment happens before Calendly booking
- ~2% of clients flagged as potentially unsuitable
- Clinical teams have 24 hours to review flagged cases
- Clear recommendations: proceed, coordinate, or refer out

#### Booking Process
- Calendly used for assessment time booking
- Admin for rescheduling remains with clinical team
- 14-day buffer maintained for care plan delivery

#### Automation Goals
- Automate care plan creation (MVP)
- Mandatory pop-ups for clinical notes on status changes
- Webhook connectivity for real-time sync

### Action Items

| Owner | Action | Timestamp |
|-------|--------|-----------|
| Caitlin B | Share Trilogy Care apps link | 06:09 |
| Caitlin B | Develop mandatory note pop-ups for status changes | 25:06 |
| Room 202 | Send reworded HCA email template | 11:19 |
| Fran & team | Advise on commencement date amendments | 24:32 |
| Marianne | Set up clinical review user groups | 17:00 |
| Jackie P | Oversee process rollout across teams | 00:00 |
| Sales team | Increase phone engagement with P1 clients | 26:22 |
| BD | Ensure P1 clients follow Fast Lane consistently | 26:22 |

---

## Key Themes Across All Meetings

### Process Simplification
- Elimination of 12-month IAT cutoff complexity
- Clear separation of new packages (24hr) vs transfers (2 weeks)
- Reduced questionnaire burden on clients

### Technology Enablement
- IAT-powered AI assessment tool
- CRM module dedicated to onboarding
- Portal integration for HCA and care plans
- Automation of routine tasks

### Risk Management
- Three-tier assessment model
- 24-hour clinical review turnaround
- Clear escalation pathways
- Documentation and audit trail

### Stakeholder Alignment
- Cross-team coordination (Grow, Care, Clinical, Ops)
- Partner/coordinator integration strategy
- Client communication improvements
- Training and rollout planning
