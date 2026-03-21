---
title: "IDEA BRIEF: Service Delivery Verification (SDV)"
---


**Epic**: TP-XXXX | **Initiative**: TP-2141 Work Management | **Date**: 2025-12-10 | **Status**: Draft

---

## Problem Statement

**Current State**:
- Support at Home program requires service confirmation from July 1st - no pre-invoice evidence exists
- No rostering data for self-managed services to verify supplier presence
- Poor data quality from required text notes (workers input meaningless text to satisfy requirement)
- Invoice processing is unscalable (manual review by Philippines team)
- Risk of approving bills exceeding budgeted amounts
- No proactive incident detection - reactive investigation only

**Impact**:
- Cannot verify service delivery before invoice submission
- Budget overspending risk without real-time verification
- Missed care concerns due to poor note quality
- Supplier fraud risk (billing for services not delivered)
- Unscalable manual processes

---

## Proposed Solution

**Five-Component System**:

1. **QR Code Check-in System**
   - Client-specific QR codes scanned by suppliers at service delivery
   - Captures: geolocation, timestamp, device identifiers (MAC/IP)
   - Supplier self-identifies: name, phone, email
   - Selects service type from approved/budgeted services list

2. **Voice Notes with Multilingual Support**
   - Voice dictation → AI transcription → structured case notes
   - Multi-language support with auto-translation to English
   - Designed for support workers with limited computer interaction

3. **Dynamic Wellbeing Surveys**
   - Quick radio button survey about client wellbeing during shift
   - Questions tailored to service type and supplier category (support levels 1-5)
   - Captures high-level health/wellbeing changes
   - Distinct from formal incident investigations

4. **AI-Powered Incident Detection**
   - Auto-review shift notes and flag care concerns
   - Trigger recommendations for care partners or clinical referrals
   - Match self-managed services to billing data
   - Escalate only critical incidents (reduce noise)

5. **Billing Reconciliation Engine**
   - Check-in data as proof of service delivery
   - Match invoices against actual visits on same day
   - Auto-flag bills that exceed budgeted amounts
   - Reduce bills on hold and prevent budget overspending

---

## Benefits

**Operational**:
- Pre-invoice evidence of service delivery (July 1st compliance)
- Proactive incident detection vs reactive investigation
- Scalable verification process (eliminate manual review)
- Improved data quality (voice transcription vs meaningless text)

**Financial**:
- Prevent budget overspending through real-time reconciliation
- Detect billing fraud (services not delivered)
- Reduce bills on hold and payment delays

**Clinical**:
- Earlier detection of care concerns
- Better visibility into client wellbeing trends
- Auto-escalation of critical incidents

---

## Owner & Stakeholders

**Owner**: Steven Boge (PRD author)

**Stakeholders**:
- Romy Blacklaw - Incident reporting requirements
- Erin Headley - Historical context
- David - Meeting organizer
- Philippines team - Current invoice processors
- Support workers - End users (QR check-in, voice notes)
- Care coordinators - Incident reviews, billing reconciliation

---

## Assumptions, Dependencies, Risks

**Assumptions**:
- Support workers have smartphones with camera and microphone
- Clients consent to geolocation tracking
- Voice transcription accuracy is sufficient for clinical notes

**Dependencies**:
- AI transcription service (multilingual support)
- QR code generation infrastructure
- Incident management system integration

**Risks**:
- **HIGH**: Supplier adoption - making process too cumbersome in remote areas could lose providers
- **MEDIUM**: Voice transcription accuracy for clinical notes
- **MEDIUM**: Data quality if workers bypass system or use workarounds
- **LOW**: QR code scanning issues (poor lighting, damaged codes)

---

## Estimated Effort

**Complexity**: High (AI integration, multilingual support, real-time reconciliation)

**Timeline**: 6-9 months (phased rollout)

**Team Requirements**:
- Technical lead (AI/ML expertise)
- Backend developer (Laravel)
- Frontend developer (mobile-first UI)
- Product owner (Steven Boge)
- QA engineer

---

## Scope Boundaries

**In Scope (V1)**:
- QR code check-in system
- Voice notes with transcription
- Wellbeing surveys
- AI incident flagging
- Billing reconciliation

**Out of Scope (V1)**:
- Budget management tools for coordinators
- Budget v2 enhancements
- Formal incident investigation workflow
- Supplier rostering/scheduling

---

## Decision

**Recommendation**: Proceed to PRD

**Next Steps**:
1. Assign technical lead (AI/ML expertise required)
2. Create PRD with detailed requirements (15 sections)
3. Design QR code infrastructure and voice transcription flow
4. Pilot with small supplier group (reduce adoption risk)
5. Phased rollout by region

**Go/No-Go Criteria**:
- Technical lead available for AI/ML components
- Support worker feedback on QR check-in process (not too cumbersome)
- Voice transcription accuracy >90% for clinical notes
- Budget approved for AI transcription service
