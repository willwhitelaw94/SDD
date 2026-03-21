---
title: "Feature Specification: Intercom on Portal (ITC)"
---

> **[View Mockup](/mockups/intercom-on-portal/index.html)**{.mockup-link}

# Feature Specification: Intercom on Portal (ITC)

**Status**: Draft
**Epic**: ITC (TP-3028) — Intercom on Portal | **Initiative**: TP-2141
**Created**: 2026-03-20
**Assignee**: Naveen Rodrigo

---

## Overview

Trilogy Care receives a large volume of enquiries from prospective clients, current clients, suppliers, and general website visitors. These arrive through several channels — emails, web forms, and phone calls — creating delays, inconsistent responses, and duplicated effort across Intake, Care Partners, and Compliance teams.

Many questions are routine (pricing, onboarding steps, Support at Home reforms, supplier obligations, portal access) yet require manual triage and manual drafting, slowing down response times and reducing capacity for higher-value work.

This epic delivers an AI-powered chatbot on the TC Portal using Intercom, with live chat fallback for queries the AI cannot resolve. The goal is to provide instant self-service for common questions, reduce manual email handling, and capture query data for continuous improvement.

> **Scope note**: This spec covers the portal-facing chatbot and live chat integration. Backend CRM integration, marketing automation, and outbound messaging campaigns are out of scope.

---

## User Scenarios & Testing

### User Story 1 — Get an Instant Answer to a Common Question (Priority: P1)

As a **portal visitor** (prospective client, current client, or supplier), when I have a question about Trilogy Care services, pricing, onboarding, or Support at Home reforms, I want to get an instant answer from the chatbot — so that I do not have to wait for a manual email response.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page of the TC Portal, **When** they click the chat widget, **Then** the Intercom chatbot opens and presents a greeting with suggested common topics
2. **Given** a visitor types a question about a topic covered in the knowledge base (e.g., "How much does home care cost?"), **When** the AI processes the query, **Then** it returns a relevant, accurate answer within 30 seconds sourced from the approved knowledge base
3. **Given** a visitor asks a question that the AI can answer, **When** the answer is displayed, **Then** the visitor is prompted to confirm whether the answer was helpful (thumbs up/down feedback)
4. **Given** a visitor asks a follow-up question in the same conversation, **When** the AI processes it, **Then** it maintains context from the prior exchange and provides a coherent follow-up response

### User Story 2 — Escalate to a Human When the AI Cannot Help (Priority: P1)

As a **portal visitor**, when the chatbot cannot answer my question or I am unsatisfied with the AI response, I want to be connected to a live support agent — so that I still get the help I need without leaving the portal.

**Acceptance Scenarios**:

1. **Given** the AI cannot find a relevant answer in the knowledge base, **When** it responds, **Then** it acknowledges the limitation and offers to connect the visitor with a live agent or submit a support request
2. **Given** a visitor requests a live agent, **When** an agent is available during business hours, **Then** the conversation is transferred to the agent with full context (prior AI messages and visitor details) preserved
3. **Given** a visitor requests a live agent outside business hours, **When** no agent is available, **Then** the chatbot collects the visitor's name, email, and question summary, and creates a support ticket for follow-up on the next business day
4. **Given** a visitor rates an AI response as unhelpful (thumbs down), **When** the feedback is recorded, **Then** the chatbot offers escalation to a live agent as an immediate next step

### User Story 3 — Report a Bug or Issue via Chat (Priority: P2)

As a **portal user**, when I encounter a bug or issue in the portal, I want to report it through the chat widget — so that I have a convenient, in-context way to flag problems without navigating to a separate support page.

**Acceptance Scenarios**:

1. **Given** a user selects "Report an issue" from the chatbot menu or types a bug-related query, **When** the flow starts, **Then** the chatbot collects a description of the issue, the page URL where it occurred, and optionally a screenshot
2. **Given** a bug report is submitted through the chatbot, **When** it is logged, **Then** a support ticket is created in the internal tracking system with all collected details and the user receives a confirmation message with a reference number
3. **Given** a bug report has been submitted, **When** the user returns to the chatbot, **Then** they can ask about the status of their report using the reference number

### User Story 4 — Review Chat Analytics and Improve the Knowledge Base (Priority: P2)

As a **TC product owner or support manager**, I want to review analytics on chatbot conversations — so that I can identify gaps in the knowledge base, track resolution rates, and improve the AI over time.

**Acceptance Scenarios**:

1. **Given** a support manager accesses the Intercom dashboard, **When** they view conversation analytics, **Then** they see metrics including: total conversations, AI resolution rate, escalation rate, average response time, and user satisfaction scores
2. **Given** conversations are logged, **When** the support manager filters by "unresolved by AI", **Then** they see a list of queries the AI could not answer, grouped by topic, to identify knowledge base gaps
3. **Given** a knowledge base gap is identified, **When** new content is added to the knowledge base, **Then** the AI begins using the updated content for future queries within 24 hours

### Edge Cases

- A visitor sends abusive or inappropriate messages — the AI responds with a standard moderation message and logs the conversation for review; it does not escalate to a live agent automatically
- The Intercom service is temporarily unavailable — the chat widget displays a fallback message ("Chat is temporarily unavailable. Please email support@trilogycare.com.au") and logs the outage
- A visitor switches between languages — the AI responds in English only for this phase; non-English queries receive a polite message directing the visitor to email support
- A visitor starts a chat on mobile and continues on desktop — Intercom maintains conversation continuity if the visitor is identified (logged in or email provided)
- The knowledge base contains outdated information — a content review process runs monthly to ensure accuracy; the AI includes a "This information was last updated on [date]" note where applicable

---

## Functional Requirements

### Chat Widget

- **FR-001**: The Intercom chat widget MUST be displayed on all portal pages, positioned in the bottom-right corner, and accessible to both authenticated and unauthenticated visitors
- **FR-002**: The chat widget MUST load asynchronously and MUST NOT degrade portal page load performance by more than 200ms
- **FR-003**: The chat widget MUST be responsive and functional on mobile devices (iOS Safari, Android Chrome)

### AI Chatbot

- **FR-004**: The AI chatbot MUST respond to visitor queries using content from a curated Trilogy Care knowledge base
- **FR-005**: AI responses MUST be generated within 30 seconds of the visitor submitting a query
- **FR-006**: The AI MUST NOT fabricate information — responses MUST be grounded in the knowledge base content. If no relevant content is found, the AI MUST acknowledge that it cannot answer and offer escalation
- **FR-007**: The AI MUST maintain conversational context within a single session so that follow-up questions are understood in context
- **FR-008**: The AI MUST present a feedback mechanism (thumbs up/down) after each response

### Live Chat Escalation

- **FR-009**: The chatbot MUST offer escalation to a live agent when it cannot resolve a query or when the visitor explicitly requests human assistance
- **FR-010**: When escalating, the system MUST transfer the full conversation history and any known visitor details (name, email, portal role) to the live agent
- **FR-011**: Outside business hours, the system MUST collect visitor contact details and create a support ticket for next-business-day follow-up
- **FR-012**: System SHOULD display estimated wait times when a visitor is queued for a live agent

### Bug Reporting

- **FR-013**: The chatbot MUST support a structured bug reporting flow that collects: issue description, page URL, and optional screenshot
- **FR-014**: Bug reports submitted via chat MUST be logged as support tickets with all collected metadata

### Query Logging and Analytics

- **FR-015**: All chatbot conversations MUST be logged and available in the Intercom dashboard for review
- **FR-016**: The system MUST track and report: total conversations, AI resolution rate, escalation rate, average response time, and user satisfaction scores
- **FR-017**: Unresolved AI queries MUST be identifiable and filterable in the dashboard to support knowledge base improvement

### Knowledge Base

- **FR-018**: The knowledge base MUST be maintainable by non-technical staff through the Intercom content management interface
- **FR-019**: Updates to the knowledge base MUST be reflected in AI responses within 24 hours
- **FR-020**: Knowledge base content MUST be reviewed at least monthly for accuracy

---

## Key Entities

- **Chat Conversation**: A session between a visitor and the AI chatbot or live agent. Contains messages, timestamps, visitor identity (if known), resolution status, and feedback ratings
- **Knowledge Base Article**: A content item used by the AI to generate responses. Contains topic, content body, last updated date, and author
- **Support Ticket**: Created when a query is escalated or a bug is reported. Contains visitor details, conversation history, issue description, and status
- **Visitor**: A portal user or anonymous visitor who interacts with the chatbot. Identified by portal login (if authenticated) or email (if provided)

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: AI-handled queries receive a response in under 30 seconds
- **SC-002**: AI resolution rate exceeds 60% — meaning 60% or more of conversations are resolved without human escalation
- **SC-003**: Support email volume is reduced by 30% or more within 3 months of launch
- **SC-004**: User satisfaction score for chat interactions averages 4.0 or higher on a 5-point scale
- **SC-005**: Knowledge base coverage gaps (topics with no relevant article) decrease month-over-month as analytics inform content creation

---

## Assumptions

- Intercom is the selected platform for chatbot and live chat (evaluation vs alternatives completed prior to implementation)
- Knowledge base content exists or will be authored prior to launch — covering at minimum: pricing, onboarding, Support at Home reforms, supplier obligations, and portal access
- The TC Portal infrastructure supports embedding a third-party JavaScript widget without security or CSP conflicts
- Live chat agents are existing TC support staff — no new hires are required for the initial launch
- Business hours for live chat are Australian Eastern Time, Monday to Friday

---

## Dependencies

- Intercom platform subscription and account provisioning
- Knowledge base content authoring (must be completed before AI can be effective)
- Portal deployment access to embed the Intercom widget script
- Internal support workflow for handling escalated tickets and bug reports
- Content review process for ongoing knowledge base maintenance

---

## Out of Scope

- Outbound messaging or marketing campaigns via Intercom
- CRM integration (e.g., syncing chat data to Zoho or other systems)
- Multilingual AI support — English only for this phase
- Custom AI model training — relies on Intercom's built-in AI capabilities with knowledge base content
- Replacing existing email support channels — chat is an additional channel, not a replacement

## Clarification Outcomes

### Q1: [Integration] How does Intercom bug reporting integrate with BAU work intake?
**Answer:** Per the BAU spec clarification: **manual triage handoff.** Intercom-submitted bugs go through the support team first. If engineering work is needed, support creates a Linear BAU ticket referencing the Intercom conversation. **No automatic Intercom-to-Linear integration for MVP.** This is intentional -- not all Intercom bug reports require engineering intervention; some are user errors, misunderstandings, or duplicate reports. The triage step prevents noise in the Linear backlog.

### Q2: [Data] What user context should be passed to Intercom for authenticated users?
**Answer:** The Portal already has Intercom integration -- `resources/js/composables/useIntercom.ts` handles the Intercom SDK. For authenticated users, **the following context should be passed:** (a) User ID, (b) User email, (c) User role (from `current_role_id`), (d) Organisation name (if applicable), (e) Active package ID (if recipient), (f) Portal URL at time of chat opening (for bug context). **The existing `useIntercom.ts` composable can be extended** to include this context via Intercom's `intercomSettings` object. This enables support agents to see the user's role and package context without asking.

### Q3: [Scope] Is there a risk of creating a parallel ticketing system?
**Answer:** Yes. Intercom creates "conversations" that can become "tickets." Linear tracks engineering work. **The risk is support tickets living in Intercom while engineering tickets live in Linear, with no linkage.** **Mitigation:** Establish a clear boundary: Intercom owns customer-facing conversations and support tickets. Linear owns engineering work items. When a support ticket requires engineering, a Linear ticket is created with a link back to the Intercom conversation. **Do not try to sync tickets between systems** -- a manual link is sufficient for MVP.

### Q4: [Dependency] Who owns knowledge base content? What is the volume?
**Answer:** The spec assumes content "exists or will be authored prior to launch." Based on the spec's topics (pricing, onboarding, SAH reforms, supplier obligations, portal access), **estimated volume: 30-50 articles for MVP.** Content should be owned by the Operations/Care Management team (they know the subject matter), with Product team reviewing for accuracy. **Recommendation:** Create a content calendar with 10 articles per week for 3-5 weeks pre-launch. Start with the highest-volume query topics identified from existing support email analysis.

### Q5: [Performance] What is the impact of the Intercom widget on page load?
**Answer:** FR-002 requires "MUST NOT degrade portal page load performance by more than 200ms." The existing `useIntercom.ts` already loads the Intercom SDK asynchronously. **The Intercom JavaScript widget is ~150KB (gzipped) and loads asynchronously via script injection.** Based on the existing implementation in `resources/js/Layouts/AppLayout.vue` and `resources/js/Layouts/GuestLayout.vue`, Intercom is already embedded in the Portal. **This epic extends existing functionality** (adding AI chatbot and knowledge base) rather than introducing the widget for the first time. Performance impact should be minimal.

### Q6: [Data] How is chat conversation data retained?
**Answer:** Intercom stores all conversation data in its cloud platform. **The Portal does not need to store chat data locally.** Intercom provides APIs for conversation export if data retention requirements change. For audit purposes, the Intercom conversation ID can be stored alongside Linear ticket references. **No database tables needed in Portal for chat data.**

## Refined Requirements

1. **Extend the existing `useIntercom.ts` composable** to pass user context (role, organisation, package ID) for authenticated users.
2. **Establish a clear boundary** between Intercom (support) and Linear (engineering) ticketing. No automated sync for MVP.
3. **Create a knowledge base content calendar** -- 30-50 articles authored over 3-5 weeks pre-launch.
4. **Intercom is already embedded in the Portal** -- this epic extends existing functionality, not introducing new infrastructure.
5. **No local chat data storage needed** -- Intercom cloud is the single repository for conversation data.
