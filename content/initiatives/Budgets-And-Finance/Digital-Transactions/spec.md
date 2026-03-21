---
title: "Feature Specification: Digital Transactions (DTX)"
description: "Real-time transaction log view in authenticated portal for clients"
---

> **[View Mockup](/mockups/digital-transactions/index.html)**{.mockup-link}

**Status**: Draft
**Epic**: Digital Transactions | **Initiative**: Budgets & Finance
**Prefix**: DTX | **Created**: 2026-02-02

---

## Overview

Digital Transactions provides clients with a real-time transaction log view within the authenticated Trilogy Care Portal. Unlike Digital Statements (DST), which produces periodic PDF snapshots mailed or emailed to clients, Digital Transactions shows live, current transaction data that clients can browse, filter, and search at any time. This reduces "where's my money" support queries by enabling self-service transaction lookup, builds client trust through real-time budget visibility, and supports transparency requirements under the Support at Home program.

**Key distinction**: Digital Statements (DST) = PDF exports mailed/emailed to clients as point-in-time snapshots. Digital Transactions (DTX) = Real-time log view in the authenticated portal showing current state.

**Scope boundaries**: This specification covers the real-time transaction log UI component within the portal. It does not cover PDF statement generation (covered by [Digital Statements](/initiatives/budgets-and-finance/digital-statements)), budget management workflows, or invoice/billing systems.

---

## User Scenarios & Testing

### User Story 1 - Client Views Transaction History (Priority: P1)

As a client, I want to see a paginated list of all my transactions with date, description, and amount, so that I can track my spending in real-time without waiting for a statement.

**Why this priority**: Core value proposition - clients currently have no way to see transactions between periodic statement deliveries, generating support queries.

**Acceptance Scenarios**:

1. **Given** a client is logged into the portal, **When** they navigate to the Transactions section of their package, **Then** they see a paginated list of transactions ordered by date (most recent first)
2. **Given** transactions exist, **When** displayed, **Then** each transaction shows: date, description, service type, and amount
3. **Given** a client has 100+ transactions, **When** the list loads, **Then** it is paginated with a reasonable page size (e.g., 20-25 per page) and navigation controls
4. **Given** a new transaction is recorded (e.g., an invoice is paid), **When** the client refreshes or revisits the page, **Then** the new transaction appears in the list
5. **Given** a client has no transactions, **When** they view the Transactions section, **Then** an empty state message is displayed (e.g., "No transactions recorded yet")

---

### User Story 2 - Client Filters Transactions (Priority: P1)

As a client, I want to filter my transactions by date range, category, and service type, so that I can find specific transactions quickly.

**Why this priority**: Without filtering, clients with many transactions cannot efficiently locate specific entries, reducing the usefulness of the feature.

**Acceptance Scenarios**:

1. **Given** a client views their transaction list, **When** they select a date range filter, **Then** only transactions within that date range are displayed
2. **Given** a client applies a category filter (e.g., "Ongoing Support", "Assistive Technology"), **When** applied, **Then** only transactions in that funding stream category are shown
3. **Given** a client applies a service type filter (e.g., "Personal Care", "Home Maintenance"), **When** applied, **Then** only transactions matching that service type are shown
4. **Given** multiple filters are applied, **When** combined, **Then** results reflect the intersection of all active filters
5. **Given** filters are applied and no results match, **When** displayed, **Then** a "No transactions match your filters" message appears with option to clear filters

---

### User Story 3 - Client Sees Current Balance Summary (Priority: P1)

As a client, I want to see my current budget balance alongside the transaction list, so that I know how much funding remains.

**Why this priority**: Transaction history without balance context is incomplete. Clients need to understand the cumulative impact of transactions on their available funds.

**Acceptance Scenarios**:

1. **Given** a client views the Transactions section, **When** the page loads, **Then** a summary panel shows current remaining balance per funding stream
2. **Given** transactions are filtered, **When** the balance summary displays, **Then** it always shows the overall current balance (not filtered subtotals) to avoid confusion
3. **Given** a funding stream has been fully consumed, **When** displayed, **Then** the balance shows $0 with a visual indicator

---

### User Story 4 - Coordinator Views Client Transactions (Priority: P2)

As a care coordinator, I want to view my client's real-time transaction history, so that I can reference specific transactions during client conversations.

**Why this priority**: Coordinators frequently field client questions about budget spending. Access to the same transaction view enables efficient self-service.

**Acceptance Scenarios**:

1. **Given** a coordinator has access to a client's package, **When** they navigate to the Transactions section, **Then** they see the same transaction data and filters as the client
2. **Given** a coordinator does not have financial access permissions, **When** they navigate to the package, **Then** the Transactions section is not visible

---

### Edge Cases

- **Transaction recorded but not yet paid**: Determine whether unpaid/pending transactions appear in the log or only paid/completed ones. Recommendation: show only paid transactions to match statement data, with a note if pending amounts exist
- **Client with multiple packages**: Transaction log is package-scoped; client must select the relevant package to see its transactions
- **Very old transactions**: Consider a maximum lookback period or archive threshold. Transactions older than the current financial year could be available via statement PDFs
- **Transaction reversal or correction**: If a transaction is reversed in MYOB, the reversal should appear as a separate line item (credit) rather than removing the original
- **Concurrent portal sessions**: Transaction list should be consistent regardless of when the page was loaded; pagination should handle new transactions gracefully

---

## Functional Requirements

- **FR-001**: The system MUST display a paginated list of transactions for a client's package, ordered by date (most recent first)
- **FR-002**: The system MUST show date, description, service type, and amount for each transaction
- **FR-003**: The system MUST support filtering by date range
- **FR-004**: The system MUST support filtering by funding stream category (e.g., Ongoing Support, Assistive Technology, Home Modifications)
- **FR-005**: The system MUST support filtering by service type
- **FR-006**: The system MUST display a current balance summary per funding stream alongside the transaction list
- **FR-007**: The system MUST show real-time (current state) data, not point-in-time snapshots
- **FR-008**: The system MUST support pagination with a reasonable page size (20-25 items per page)
- **FR-009**: The system MUST display an appropriate empty state when no transactions exist
- **FR-010**: The system SHOULD allow care coordinators with appropriate permissions to view client transaction history
- **FR-011**: The system SHOULD restrict the Transactions section from users without financial access permissions
- **FR-012**: The system MUST display transaction reversals/corrections as separate line items rather than removing original entries

---

## Key Entities

| Entity | Description |
|--------|-------------|
| **Transaction** | A financial record representing a charge, payment, or adjustment against a client's package funding |
| **Package** | The client's care package containing funding streams and associated transactions |
| **Funding Stream** | Category of funding (Ongoing Support, Assistive Technology, Home Modifications) used to group and filter transactions |
| **Balance** | Current remaining amount per funding stream, calculated as total funding minus all approved/paid transactions |
| **Service Type** | Classification of the service delivered (Personal Care, Home Maintenance, etc.) used for filtering |

---

## Success Criteria

### Measurable Outcomes

- 50% reduction in "transaction lookup" support queries
- Measurable increase in client portal engagement (page views on Transactions section)
- Transaction list loads within 2 seconds for typical client (under 500 transactions)
- Client satisfaction with financial visibility improved (measured via portal feedback)

---

## Assumptions

- Transaction data is available in real-time from the Portal database (not dependent on MYOB sync latency)
- Clients have authenticated access to the Trilogy Care Portal
- The data source for transactions aligns with the ADR-001 decision for Digital Statements (consumptions table preferred)
- Existing permission model can be extended to control transaction visibility

---

## Dependencies

- Portal authentication infrastructure
- Budget/transaction data source (aligned with [Digital Statements](/initiatives/budgets-and-finance/digital-statements) ADR-001 data source decision)
- Funding consumption data availability and accuracy
- Permission model supporting financial data access controls
- [Budget Reloaded](/initiatives/budgets-and-finance/budget-reloaded) for accurate funding stream categorisation

---

## Out of Scope

- PDF statement generation and delivery (covered by [Digital Statements](/initiatives/budgets-and-finance/digital-statements))
- Budget management or editing capabilities
- Invoice submission or billing workflows
- Dispute lodging from transaction lines (covered as part of [Digital Statements](/initiatives/budgets-and-finance/digital-statements) interactive features)
- Spending analytics, trend charts, or predictive features
- Client-facing budget preview (covered by [Consumer Budget Preview](/initiatives/budgets-and-finance/consumer-budget-preview))

## Clarification Outcomes

### Q1: [Data] What is the actual data source for real-time transactions? Is there latency between bill payment and consumption record creation?
**Answer:** The data source should be the `budget_plan_item_funding_consumptions` table (per ADR-001, aligned with DST). The `FundingConsumptionProjector` in `domain/Funding/EventSourcing/Projectors/FundingConsumptionProjector.php` creates consumption records as part of the event sourcing pipeline. The `BillMarkedAsPaidEvent` triggers updates. Latency depends on the event processing pipeline — event sourcing projectors in the codebase run synchronously or via queued workers. For "real-time" display, projectors should be synchronous or near-synchronous. The existing `TransactionProjector` in `domain/Bill/EventSourcing/Projectors/TransactionProjector.php` already handles transaction-related projections. Latency should be under 5 seconds in practice.

### Q2: [Scope] Should a lightweight "Query this transaction" action be included despite the spec excluding dispute lodging?
**Answer:** Yes, a lightweight query action should be included. The spec explicitly excludes full dispute lodging (which requires resolution workflow), but a simple "Query this transaction" button that creates a support note/ticket would significantly improve the user experience. This is the most natural point for a client to raise a question. Recommendation: add a "Query" action that creates a tagged note (linked to the transaction) visible to the Care Partner and Finance. This does not require the full dispute resolution workflow from DST. Aligns with the DST refined requirement for a shared dispute model.

### Q3: [Edge Case] What is the expected transaction volume per client, and should there be a configurable lookback limit?
**Answer:** A typical client might have 10-30 transactions per month (weekly services x funding streams). Over a year, that is 120-360 transactions. Over 3 years, up to ~1000. The spec targets "under 500 transactions" for 2-second load (SC). Recommendation: default lookback of current financial year (12 months) with an "older transactions" link that loads additional pages. No hard limit — pagination handles volume. Index on `package_id` + `created_at` ensures efficient queries. The consumptions table is package-scoped, so queries are naturally bounded.

### Q4: [Dependency] Should DTX and DST be combined into a single epic?
**Answer:** No, they should remain separate but share infrastructure. The distinction is valid: DST = periodic PDF snapshots for compliance delivery, DTX = real-time interactive portal view for self-service. They have different user flows, different delivery mechanisms, and different priorities. However, they MUST share: (a) the same data source (consumptions table), (b) the same balance calculation logic, (c) similar filtering capabilities, and (d) a common transaction display component. Recommendation: build a shared `TransactionService` or Action class that both DTX and DST consume. The Vue components for transaction listing can also be shared (DTX is the interactive version; DST's interactive view references it).

### Q5: [Permissions] How is financial access controlled for the Transactions section?
**Answer:** FR-011 says the system should restrict transactions from users without financial access permissions. The Collections V1 spec defines `VIEW_FINANCIALS` permission. DTX should reuse this same permission rather than creating a separate one. The permission infrastructure uses `config/permissions/` config files. Both Collections and Transactions should check the same `VIEW_FINANCIALS` gate.

### Q6: [Data] FR-012 says transaction reversals appear as separate line items. How are reversals created?
**Answer:** Reversals come from the FRR (Funding Reconciliation) epic's adjustment system. When a MYOB adjustment is processed, the `MyobAdjustmentProjector` creates adjustment records. For DTX, these adjustments should appear as credit line items in the transaction list with clear "Reversal" or "Adjustment" labeling. The `source` field on consumption records (`myob_adjustment`, `claim_correction`) identifies reversals. DTX simply displays these as negative-amount transactions.

### Q7: [UX] How does the balance summary (US3) handle multiple funding streams?
**Answer:** FR-006 requires balance per funding stream. The `Funding` model tracks amounts per funding stream (ON, AT, HM, RC, VC, etc.). The budget V2 `FundingStreamData` already provides per-stream balance data. The summary panel should show one card/line per active funding stream with its remaining balance. This mirrors the BUR US3 requirement for sidebar balances. Recommendation: use the same balance calculation component as BUR US3.

### Q8: [Performance] Can the 2-second load target be met with pagination?
**Answer:** Yes. With a paginated query (20-25 items per page) against an indexed consumptions table, 2-second load is achievable even with filter application. The query pattern: `SELECT * FROM budget_plan_item_funding_consumptions WHERE package_id = ? AND payment_period >= ? ORDER BY created_at DESC LIMIT 25`. With proper indexing, this is sub-second.

### Q9: [Edge Case] How are "pending" transactions handled?
**Answer:** The spec recommends showing only paid/completed transactions. This is correct — pending transactions (unapproved bills) should not appear in the client-facing transaction log as they may be reversed. If a "pending" indicator is needed, it could show as a separate section or note (e.g., "You have X pending transactions being processed"). This avoids client confusion while providing transparency.

### Q10: [Integration] The spec mentions the data source aligns with ADR-001. Is the consumptions table the right source for "real-time" data?
**Answer:** Yes, with a caveat. Consumptions are created when bills are approved/processed, not when services are delivered. "Real-time" in this context means "current state of all processed transactions," not "instant reflection of service delivery." This is the correct interpretation — clients should see finalized financial data, not in-progress billing. The consumptions table provides this.

## Refined Requirements

- **FR-REFINED-001**: A lightweight "Query this transaction" action SHOULD be included that creates a tagged support note linked to the transaction, visible to Care Partner and Finance teams.
- **FR-REFINED-002**: DTX and DST MUST share a common `TransactionService` or Action class for data retrieval, balance calculations, and filtering logic to ensure consistency.
- **FR-REFINED-003**: DTX MUST reuse the `VIEW_FINANCIALS` permission from Collections V1 rather than creating a separate permission.
- **FR-REFINED-004**: Default lookback SHOULD be current financial year (12 months) with pagination for older transactions. No hard limit on transaction history.
