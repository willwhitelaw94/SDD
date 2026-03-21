---
title: "Feature Specification: Consumer Mobile V3 (MOB3)"
description: "Specification for Phase 3 mobile app - Discover and Grow"
---

> **[View Mockup](/mockups/consumer-mobile-v3/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: MOB3 | **Initiative**: Consumer Mobile

---

## Overview

Consumer Mobile V3 (MOB3) is the third phase of the Trilogy Care consumer mobile application, themed "Discover and Grow." Building on MOB1's visibility layer and MOB2's action capabilities, MOB3 introduces discovery, AI-powered assistance, and proactive care features. Key capabilities include the Moonmart consumer marketplace for goods and services, an AI conversational interface (voice and chat) for care queries, proactive recommendations powered by AI (services, care plan improvements, spending optimisation), health device integrations (wearables and health apps), a referral and rewards program, and advanced family/care circle sharing with granular permissions. MOB3 transforms the app from a care management tool into an intelligent care companion that anticipates needs and connects recipients with relevant services and support.

---

## User Scenarios & Testing

### User Story 1 - Moonmart Marketplace (Priority: P1)

As a recipient, I want to browse and purchase goods and services through the Moonmart marketplace so that I can discover care-related products and providers directly from the app.

**Acceptance Scenarios**:
1. **Given** a recipient navigates to the Services tab, **When** they tap "Marketplace", **Then** they should see a categorised listing of available services and products (equipment, supplies, wellness products) filtered by their location and package eligibility.
2. **Given** a recipient searches for a specific product or service, **When** results load, **Then** each result should display supplier name, rating, price range, distance, availability, and package eligibility status.
3. **Given** a recipient selects a product, **When** they add it to cart and check out, **Then** the purchase should be processed against their package budget (if eligible) or personal payment method with clear indication of funding source.
4. **Given** a recipient has purchased an item, **When** they view their order history, **Then** they should see order status, delivery tracking, and payment details.

### User Story 2 - AI Conversational Interface (Priority: P1)

As a recipient, I want to ask questions about my care package using voice or text chat so that I get immediate answers without navigating through the app or waiting for a callback.

**Acceptance Scenarios**:
1. **Given** a recipient opens the AI assistant, **When** they type or speak "How much budget do I have left?", **Then** the assistant should retrieve and display their current available balance with a breakdown by service category.
2. **Given** a recipient asks "What services can I get for mobility support?", **When** the query is processed, **Then** the assistant should suggest relevant services from their care plan and the Moonmart marketplace.
3. **Given** a recipient uses voice input, **When** they say "Book a physiotherapy session next Tuesday", **Then** the assistant should confirm the request details and initiate the MOB2 booking workflow.
4. **Given** the assistant cannot answer a question or confidence is below threshold, **When** the query is processed, **Then** it should offer to connect the recipient with their Care Partner or create an Intercom ticket with the conversation context attached.

### User Story 3 - Proactive Recommendations (Priority: P2)

As a recipient, I want to receive AI-generated recommendations for services and care improvements so that I can make the most of my package.

**Acceptance Scenarios**:
1. **Given** a recipient's spending patterns indicate underutilisation in a service category, **When** the recommendation engine runs, **Then** the recipient should see a suggestion card on their Home dashboard recommending services in that category with specific provider options.
2. **Given** a recipient's care goals indicate mobility improvement, **When** AI analyses their profile and available services, **Then** it should suggest relevant allied health services, equipment, or community programs.
3. **Given** a recommendation is generated, **When** the recipient views it, **Then** they should be able to act on it (book service, learn more, add to plan) or dismiss it with suppression of similar suggestions for a configurable period.

### User Story 4 - Health Device Integrations (Priority: P2)

As a recipient, I want to connect my wearable health devices so that my health data informs my care plan and enables remote monitoring.

**Acceptance Scenarios**:
1. **Given** a recipient has an Apple Watch, Fitbit, or Android wearable, **When** they connect it via Profile settings, **Then** health metrics (blood pressure, blood glucose, heart rate, step count, BMI) should sync to their care profile.
2. **Given** health data indicates a concerning trend (e.g., elevated blood pressure over multiple readings), **When** the clinical threshold is breached, **Then** an alert should be generated for both the recipient and their clinical team.
3. **Given** a recipient has connected devices, **When** they view their health summary in the Profile tab, **Then** they should see historical trends, comparisons over time, and current readings.

### User Story 5 - Referral and Rewards Program (Priority: P2)

As a recipient, I want to refer friends and family to Trilogy Care and receive rewards so that I benefit from recommending a service I trust.

**Acceptance Scenarios**:
1. **Given** a recipient taps "Refer a Friend" on the Home dashboard, **When** they enter the referral details, **Then** a personalised referral link or invitation should be generated and shareable via SMS, email, or social media.
2. **Given** a referral results in a new client commencing services, **When** the referral is validated, **Then** the referring recipient should receive a reward (e.g., Cookaborough or CareVicinity voucher) and a push notification.
3. **Given** a recipient has made referrals, **When** they view their referral dashboard, **Then** they should see referral status (sent, registered, converted) and rewards earned.

### User Story 6 - Spending Predictions and Budget Optimisation (Priority: P2)

As a recipient, I want to see spending predictions and optimisation tips so that I avoid underspending or overspending my package.

**Acceptance Scenarios**:
1. **Given** a recipient views the Finances tab, **When** sufficient spending history exists, **Then** they should see a predicted end-of-quarter balance based on current spending trajectory with a confidence indicator.
2. **Given** a recipient is projected to underspend, **When** the prediction is displayed, **Then** tips should suggest how to utilise remaining funds with specific service and product recommendations.
3. **Given** a recipient is projected to overspend, **When** the prediction is displayed, **Then** the system should warn them and suggest budget adjustments.

### User Story 7 - Advanced Family Sharing (Priority: P3)

As a recipient, I want to share access to my care information with family members with configurable permissions so that my support network can help manage my care.

**Acceptance Scenarios**:
1. **Given** a recipient wants to grant family access, **When** they invite a family member via the Account tab, **Then** the family member should receive an invitation to download the app and view the recipient's care information.
2. **Given** a care partner configures sharing, **When** they set permissions, **Then** they should be able to control section-level access (finances, services, health data, care plan) per family member.
3. **Given** a family member has limited access, **When** they log in, **Then** they should only see the sections they have been granted access to, with restricted sections hidden entirely.

### User Story 8 - AI Care Plan Suggestions (Priority: P3)

As a recipient, I want AI-generated suggestions for updating my care plan so that my plan evolves with my changing needs.

**Acceptance Scenarios**:
1. **Given** a recipient's health data, service usage, and goals are analysed, **When** the AI identifies potential improvements, **Then** it should generate care plan update suggestions with clear rationale.
2. **Given** a care plan suggestion is generated, **When** the recipient approves it, **Then** it should be submitted to their Care Partner for formal review and care plan amendment.

### Edge Cases

- AI assistant providing incorrect or misleading health advice (guardrails and disclaimers required)
- Health device data sync failures, delayed readings, or inconsistent data across devices
- Marketplace purchases that exceed package budget (payment method fallback and clear UX)
- Referral fraud detection (self-referrals, circular referrals, bulk gaming)
- AI recommendations for services not available in the recipient's area (location-aware filtering)
- Family member access revocation and data privacy implications
- Health data privacy and consent management (sensitive health information under Australian privacy law)
- Multiple health devices providing conflicting data (source priority rules)
- Spending predictions with insufficient historical data for new clients (minimum data threshold)
- AI voice input accuracy with elderly speech patterns, accents, and background noise
- Marketplace listings for areas with few or no providers (empty state and waitlist handling)
- Family sharing permission conflicts when two authorised people set different permissions

---

## Functional Requirements

1. **Moonmart Marketplace** -- Categorised product and service catalogue with search, filtering, provider profiles, reviews, shopping cart, checkout (package budget or personal payment), order tracking, and delivery management
2. **AI Conversational Interface** -- Text and voice input via natural language processing, context-aware responses using recipient data (budget, goals, services, health), action initiation (booking, queries), and human escalation when confidence is below threshold
3. **Proactive Recommendations** -- AI engine analysing spending patterns, goal progress, health data, and service history to generate actionable suggestion cards with accept/dismiss/suppress workflow
4. **Health Device Integration** -- Apple HealthKit and Google Health Connect SDK integration for blood pressure, blood glucose, heart rate, steps, and BMI; configurable clinical threshold alerts; historical trend visualisation; consent and data privacy management
5. **Referral Program** -- Referral link generation, invitation sharing (SMS, email, social media), referral status tracking (sent, registered, converted), reward issuance (vouchers/credits), and referral dashboard
6. **Spending Predictions** -- Machine learning model for end-of-quarter balance prediction based on spending trajectory with confidence intervals; underspend/overspend optimisation tips with actionable recommendations
7. **AI Care Plan Suggestions** -- Analysis of health data, service usage, goal progress, and assessment outcomes to generate care plan improvement suggestions; approval workflow routing to Care Partner
8. **Advanced Family Sharing** -- Invite family members, configure section-level permissions (finances, services, health, care plan), manage shared access, revoke access, with audit trail
9. **Advanced Preferences** -- Notification preferences, display preferences, AI data sharing consent, health data privacy controls
10. **Full Native Workflows** -- All remaining Intercom shortcut actions replaced with native in-app workflows (invoice reversals, complex service changes, funding dispute resolution)

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **MoonmartProduct** | Marketplace product or service with category, price, description, availability, images, and package eligibility rules |
| **MoonmartOrder** | Purchase order with items, payment method (package budget or personal), delivery status, tracking, and invoice linkage |
| **AIConversation** | Chat/voice session with message history, user context, action triggers, and escalation status |
| **AIRecommendation** | System-generated suggestion with type (service, budget, care plan), rationale, action options, and recipient response (accepted, dismissed, suppressed) |
| **HealthReading** | Synced health metric from wearable device with type, value, unit, timestamp, source device, and quality indicator |
| **HealthAlert** | Threshold-triggered clinical alert with reading details, threshold configuration, recipient notification, and clinical team notification |
| **Referral** | Referral record with referrer, referred person, invitation method, status (sent, registered, converted), and reward details |
| **FamilyShare** | Shared access grant with recipient, family member, section-level permissions, invitation status, and audit trail |
| **SpendingPrediction** | Predicted end-of-quarter balance with confidence interval, trend direction, and optimisation suggestions |

---

## Success Criteria

### Measurable Outcomes

| Metric | Target |
|--------|--------|
| Moonmart marketplace monthly active users | Greater than 20% of app users |
| AI assistant queries per user per month | Greater than 3 |
| AI query resolution rate (without human handoff) | Greater than 70% |
| AI recommendation acceptance rate | Greater than 30% |
| Health device connection rate (of eligible users) | Greater than 15% |
| Referral program participation rate | Greater than 10% of recipients |
| Family sharing activation rate | Greater than 20% of recipients |
| Spending prediction accuracy (within 10% of actual) | Greater than 80% |
| Intercom ticket volume (further reduction from MOB2) | Additional 30% reduction |
| App retention rate (30-day) | Greater than 60% |

---

## Assumptions

- MOB1 and MOB2 are fully deployed with an established and active user base
- AI/ML infrastructure (LLM, recommendation engine, prediction models) is available and can be trained on Trilogy Care domain data with acceptable accuracy
- Moonmart product catalogue, supplier onboarding, and fulfilment infrastructure exists or is being built as a separate initiative
- Health device APIs (Apple HealthKit, Google Health Connect) are stable, accessible, and provide reliable data
- Legal and privacy frameworks for health data sharing and AI-generated care advice are established under Australian regulations
- Referral reward budget is allocated and the programme has business approval
- Family sharing data privacy and consent management comply with the Australian Privacy Act and aged care regulations
- Recipients consent to AI data usage with clear privacy controls and opt-out capability

---

## Dependencies

- **Consumer Mobile V1 (MOB1)** and **Consumer Mobile V2 (MOB2)** -- Fully deployed and stable with authentication, financial views, goal/need management, service booking, and notification infrastructure
- AI/ML platform for conversational interface, recommendation engine, and spending predictions (LLM service, model training pipeline, domain data)
- Moonmart marketplace platform, product catalogue, payment processing, and fulfilment systems (separate initiative)
- Apple HealthKit and Google Health Connect SDK integrations
- Referral tracking and reward management system (voucher/credit issuance)
- Family sharing invitation, authentication, and permission management infrastructure
- Clinical alert routing and notification system for health data thresholds
- Privacy and consent management framework compliant with Australian Privacy Act
- Legal review of AI-generated care recommendations and liability implications

---

## Out of Scope

- Building the Moonmart marketplace platform itself (MOB3 is the consumer-facing integration layer)
- Clinical decision support or medical diagnosis via AI (advisory only, not diagnostic)
- Replacing human care coordinators with AI automation
- Wearable device hardware provision or subsidisation
- Financial rewards (cash) -- rewards are credits, vouchers, or service benefits only
- Integration with hospital or GP medical records systems (My Health Record)
- Telehealth video consultations within the app
- Multi-language AI assistant (English only for initial release)
- Social media features or community forums within the app
- Third-party app store or plugin ecosystem

## Clarification Outcomes

### Q1: [Scope] Should MOB3 be broken into individual epics?
**Answer:** Yes. MOB3 is effectively 4-5 separate products: (a) Moonmart marketplace, (b) AI assistant, (c) Health device integrations, (d) Referral program, (e) Advanced family sharing. Each has independent dependencies, timelines, and risk profiles. **The AI assistant alone requires LLM infrastructure, domain training data, and compliance review.** Moonmart requires a separate catalogue and fulfilment system. **Recommendation:** Break MOB3 into 5 sub-epics: MOB3-MART (marketplace), MOB3-AI (assistant + recommendations + care plan suggestions), MOB3-HEALTH (device integrations), MOB3-REFER (referral program), MOB3-SHARE (family sharing). Each should have independent delivery timelines.

### Q2: [Data] What are the Australian privacy requirements for health data?
**Answer:** Health information is classified as "sensitive information" under the Australian Privacy Principle 3.3 (APP 3.3), requiring explicit consent for collection and higher protection standards. The My Health Records Act 2012 governs electronic health data. **A Privacy Impact Assessment (PIA) is mandatory before collecting blood pressure, blood glucose, or other clinical data.** Additionally, aged care providers must comply with the Aged Care Quality and Safety Commission standards for data handling. **This assessment must be completed before MOB3-HEALTH development begins.**

### Q3: [Dependency] What AI/LLM infrastructure decision needs to be made?
**Answer:** The Portal currently has no LLM infrastructure. The Threads spec mentions "AI Summarise" and "AI Generate reply" features, and the Calls Uplift spec references Graph-provided AI summaries. **There appear to be two AI pathways emerging:** (a) Trilogy Graph for transcription/call AI, (b) a separate LLM service for chat/recommendation AI. **A unified AI infrastructure decision must be made** -- whether to use a managed service (OpenAI, Anthropic), self-hosted models, or Graph for all AI features. This decision affects MOB3-AI, Threads, and Calls Uplift simultaneously.

### Q4: [Edge Case] What is the approval flow for AI-generated care plan suggestions?
**Answer:** AI-generated suggestions (US8) result in care plan amendments that require professional oversight. The existing care plan change workflow involves Care Partner review. **The flow should be:** AI generates suggestion -> Recipient reviews and approves -> Suggestion sent to Care Partner as a "Care Plan Amendment Request" -> Care Partner reviews with clinical context -> Care Partner approves/modifies/rejects -> If approved, care plan updated. **This is NOT the same as the budget approval workflow.** It requires clinical judgement, not financial approval.

### Q5: [Integration] Are referral partnerships (Cookaborough, CareVicinity) established?
**Answer:** No evidence of these partnerships exists in the codebase or documentation. **Assumption:** These partnerships are aspirational, not established. **Recommendation:** MOB3-REFER should define the technical integration pattern (voucher API, redemption flow) but cannot commit to specific partners until partnerships are confirmed. The referral program logic (tracking, reward issuance) should be partner-agnostic with a configurable reward type (voucher, credit, service benefit).

### Q6: [Compliance] What liability framework applies to AI-generated care advice?
**Answer:** AI-generated care recommendations could constitute "health advice" under Australian consumer law. If a recipient acts on an AI suggestion and experiences harm, Trilogy Care may have liability exposure. **Legal review is mandatory before deploying MOB3-AI.** The spec's Out of Scope section states "Not diagnostic" but even advisory recommendations carry risk. **All AI-generated suggestions must include a disclaimer and must not bypass Care Partner approval.**

## Refined Requirements

1. **Break MOB3 into 5 sub-epics** with independent timelines: MOB3-MART, MOB3-AI, MOB3-HEALTH, MOB3-REFER, MOB3-SHARE.
2. **Complete a Privacy Impact Assessment** before MOB3-HEALTH development begins. This is a regulatory requirement, not optional.
3. **Make a unified AI/LLM infrastructure decision** that covers MOB3-AI, Threads AI features, and Calls Uplift AI features.
4. **Obtain legal review of AI recommendation liability** before MOB3-AI deployment. All AI suggestions must include disclaimers and require Care Partner approval.
5. **Referral program should be partner-agnostic** -- define the integration pattern without committing to specific voucher providers until partnerships are confirmed.
