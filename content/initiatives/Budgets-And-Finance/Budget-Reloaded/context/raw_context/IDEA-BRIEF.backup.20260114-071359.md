---
title: "Idea Brief: Budget Reloaded (BUR)"
---


**Epic Code**: BUR  
**Created**: 2026-01-14

## Problem Statement (What)

Care coordinators face multiple pain points when managing budgets: 1. **Supplier Integration Gap**: Cannot list suppliers in budget pivot tables or attach them to bookings. Rate cards exist in isolation without flexible supplier workflows (plan rates, expose rates, then add supplier later). 2. **High Cognitive Load**: Every budget requires selecting funding streams from scratch. No defaults exist, forcing coordinators to make repetitive selections. Service totals and save buttons occupy persistent screen space. 3. **Unclear Coordination Settings**: Coordination loading and co-contribution categories are buried in UI. Coordinators cannot quickly see "This is Coordinated by X for Y%" without hunting. 4. **Inconsistent Funding Stream Display**: Current UI shows funding period data but lacks human-readable context ("last quarter for this funding", "6 week period"). The spent vs forecast representation uses 3-bar patterns without interactivity, creating visual noise. 5. **Scattered UI Patterns**: "Add Plan" floats separately, package metadata uses prominent key-value pairs inconsistently, and action buttons lack unified placement. These issues slow down budget creation, increase errors, and frustrate experienced coordinators who repeat the same selections across hundreds of budgets.

## Possible Solution (How)

### 1. Supplier & Rate Card Integration - Enable supplier listing in budget pivot tables - Support supplier attachment to bookings - Implement flexible rate card workflow: plan rates independently, expose rates without supplier assignment, then add supplier and inherit their rate cards - Decouple rate planning from supplier selection ### 2. Exception-Based Funding Defaults - Establish DEFAULT funding streams per service to eliminate repetitive selection - Funding stream selection drives available dates automatically - Surface "use alternative funding" only as exception case - Reduce funding stream dropdown to Services Australia-approved options only ### 3. Prominent Coordination Display - Show coordination loading in collapsed budget state with service total - Display "This is Coordinated by X for Y%" prominently in budget header - Create dedicated modal for "Choose Coordination Loading" - Elevate co-contribution categories to modal pattern for clarity ### 4. Human-Readable Funding Context - Display funding period info: "last quarter for this funding", "6 week period remaining" - Improve "Funding this quarter" to show $, %, Daily in unified format - Represent spent vs forecast as single data point: "spent $60/day forecast to reach $600 by end of quarter" - Remove non-interactive 3-bar patterns to reduce visual noise ### 5. Unified UI & Workflow Patterns - Move "Add Plan" into dropdown or input group (remove floating button) - Add "Suggested Plan" category with care partner workflow - Create unified action tray on right side for all buttons - Simplify package metadata display (created by, commencement date/quarter, last modified) with consistent key-value pattern - Collapse service total + save button to reduce persistent screen clutter ### 6. Enhanced Notifications & Export - Email notifications following CMA Activity style (familiar pattern) - Expand print options via dropdown (future iteration)

## Benefits (Why)

- **Reduced Cognitive Load**: Default funding streams eliminate 80% of repetitive selections, coordinators focus on exceptions only - **Faster Budget Creation**: Unified UI patterns and collapsed states reduce clicks and screen scanning time - **Improved Accuracy**: Supplier-rate card integration ensures correct rates are applied when suppliers are added - **Better Transparency**: Prominent coordination display and human-readable funding periods increase stakeholder confidence - **Flexible Planning**: Decouple rate planning from supplier selection, enabling forward planning without blocking on supplier decisions - **Consistent Experience**: Unified action tray and metadata patterns create predictable interaction model across all budget workflows

## Owner (Who)

- **Owner:** William Whitelaw (Lead) - **Consulted:** Patt - **Primary Stakeholders:** Care Coordinators, Care Partners, Support Staff - **Influenced by:** Bruce, Beth, Tim (UX/Product feedback)

## Other Stakeholders (Accountable / Consulted / Informed)

[Stakeholders to be defined]

## Assumptions & Dependencies, Risks

### Assumptions
- Services Australia funding streams are well-defined and stable enough to establish defaults - Rate cards exist in current system and can be extended to support supplier attachment workflow - Coordination loading percentages are stored and accessible for display - Package metadata (created by, commencement date, last modified) is tracked in current system - CMA Activity email notification pattern exists and can be reused

### Risks
### Dependencies - **TP-2293 (Critical)**: Closely coupled with supplier/rate card concerns. Rate card updates cascade into budget rebalance and plan resubmission workflow. Changes in TP-2293 directly impact supplier-booking attachment implementation. - **Data Model**: Supplier-booking relationship schema must support attachment workflow - **Funding Stream Data**: Requires analysis of current funding selections to establish intelligent defaults - **Rate Card System**: Must support flexible supplier attachment (planned rates, exposed rates, inherited rates) - **Coordination Settings**: Access to coordination loading and co-contribution data - **Notification Infrastructure**: Email system capable of CMA Activity-style notifications ### Risks - **TP-2293 Coupling Risk (HIGH)**: Changes to rate card behavior in TP-2293 could require rework of supplier attachment logic. Close coordination required between epics. - **Complexity Creep**: Supplier-rate card workflow has multiple states (planned, exposed, attached) - requires careful UX design to avoid new confusion - **Default Accuracy**: If funding stream defaults are wrong for edge cases, could create new errors - **Migration Effort**: Existing budgets may need data migration to support new supplier attachment model - **Stakeholder Alignment**: Bruce, Beth, Tim feedback needs validation with broader coordinator community - **Scope Expansion**: "Future print options" and advanced filtering could inflate timeline ### Mitigation - Establish regular sync meetings between TP-2501 and TP-2293 teams to manage interdependencies - Phased rollout: Start with supplier attachment and funding defaults, then tackle UI unification - Extensive user testing with coordinators before funding defaults go live - Clear error messaging and override paths for exception cases - Regular check-ins with Bruce, Beth, Tim during design phase

## Estimated Effort

**Requires Sizing Discussion** – This epic contains multiple large initiatives (supplier-rate card integration, funding defaults, UI redesign) that should be sized in 1-week, 2-week, and 4-week increments. **Sub-Epics Needed:** - **TP-2502 (Discovery)**: Data analysis + vendor workflow validation – *Recommend: 2-4 weeks* - **TP-2503 (Design)**: UI patterns, modals, coordination display – *Recommend: 4-6 weeks* - **TP-2504 (Development)**: Schema, API, supplier attachment – *Recommend: 4-8 weeks* - **TP-2505 (QA)**: Testing strategy + user validation – *Recommend: 2-4 weeks* - **TP-2506 (Release)**: Migration, deployment, rollout – *Recommend: 1-2 weeks* **Note:** Each sub-epic should be independently scoped and estimated with the team before development begins. The total impact is likely 4-8 weeks of parallel work, not 3-6 months sequential.

## Proceed to PRD?

Yes.
