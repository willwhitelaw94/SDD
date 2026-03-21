---
title: Self-Made Development
description: Custom implementations and proprietary approaches
---

Terms related to custom implementations, proprietary solutions, and self-built systems unique to Trilogy Care.

---

## Custom Implementation Patterns

**Budget Reloaded** — Initiative redesigning budget planning and management system with improved UX and performance.

**Collections V1** — First version of collections management system for organizing services and items.

**Package-Level Upgrade** — Enhancement allowing budget operations at package level rather than individual item level.

**Invoice Recode** — System for manually recoding invoice line items to correct service categories.

**Invoice Classification (AI)** — AI-powered system automatically categorizing and classifying invoice line items using machine learning.

**Funding Sidebar** — UI component providing quick access to funding information and allocation details.

---

## Proprietary Calculations

**Contribution Percentage** — Custom calculation determining percentage of services user-funded vs. government-funded.

**Utilization Trend** — Trilogy Care proprietary algorithm tracking spending patterns over time for predictions.

**Coordinator Loading Fee** — Custom calculation of fees charged for coordination complexity.

**Service Allocation** — Proprietary algorithm distributing budget across multiple service groups based on preferences.

**Fee Distribution** — Custom system distributing total fees proportionally across budget items.

---

## Custom Data Structures

**Rate Card** — Versioned rate configuration supporting multiple rates per service with historical tracking.

**Quarterly Breakdown** — Custom quarterly budget structure tracking services amount, fees, totals, and usage separately.

**Funding Consumption Record** — Track linking specific bill items to funding streams for consumption reporting.

**Discrepancy Variance** — Custom variance calculation identifying gaps between planned and actual spending.

**Service Plan Bulk Operation** — System for batch processing service plan changes across multiple recipients.

---

## Specialized Features

**Service Plan PDF Generation** — Custom document generation creating formatted service plans as PDFs for printing/distribution.

**Bulk Submission** — Feature allowing coordinators to submit multiple service plans in single batch.

**Bulk Publishing** — Feature for publishing multiple approved service plans simultaneously.

**Coordinator Loading Resubmission** — System allowing resubmission of coordinator fees for approval.

**Home Care Funding Migration** — Data migration system transitioning recipients from legacy HCP to new SAH program.

**Unplanned Service Tracking** — System for monitoring and managing services not in original service plan.

---

## Analytics & Reporting

**Funding Discrepancy Export** — System exporting detailed discrepancy analysis for financial reporting.

**Discrepancy Summary** — Aggregated view of variances across budget items and funding streams.

**Variance Reporting** — Custom variance calculations and reporting for budget vs. actual.

**Utilization Report** — Analysis of service utilization against budgeted allocations.

**Funding Stream Analysis** — Detailed breakdown of usage by funding source.

**Bill Item Reconciliation** — Process matching bill items to budget items and resolving discrepancies.

---

## Workflow & State Management

**Budget Plan Status** — Custom workflow states:
- **DRAFT** — Being created, not yet submitted
- **SUBMITTED** — Pending approval
- **PUBLISHED** — Approved and published
- **ACTIVE** — Currently in use
- **ARCHIVED** — Historical, no longer active

**Funding Consumption Status** — States for consumption records:
- **ACTIVE** — Currently consuming funding
- **ARCHIVED** — No longer tracking
- **COMPLETED** — Fully consumed

**SAH Fix** — Custom system for correcting issues in Support at Home data integration and synchronization.

**Service Plan Coordination** — Workflow for coordinating service plan approvals between stakeholders.

---

## UI/UX Components

**Coordinator Portal** — Dashboard for care coordinators to manage services, budgets, and communications.

**Budget Management Interface** — Tools for creating, updating, and tracking service plans and budget allocation.

**Claims Management Dashboard** — Integration for submitting claims to Services Australia and tracking claim status.

**Bill Processing UI** — Supplier invoice ingestion, validation, matching, and payment processing interface.

**Contributions Manager** — Management interface for voluntary client top-ups and additional funding sources.

**Statements Module** — Financial transaction history and reporting interface for recipients and coordinators.

**Documents Module** — File management system for service agreements, assessments, and compliance documents.

**Notes System** — Internal communication and care log interface for documenting interactions and decisions.

**Utilisation Dashboard** — Monitoring and reporting interface for actual spend vs. planned allocation.

**Supplier Directory** — Onboarding, verification, and performance management interface for service providers.

---

## Data Integration

**Bill Item Linking** — System linking bill items to budget plan items for consumption tracking.

**Legacy Data Migration** — Process converting old system data to new budget structure.

**Package Budget Item** — Legacy model representing budget items before BudgetPlan redesign.

**Service Item Mapping** — System mapping service types across internal taxonomy.

**Supplier Relationship Management** — Tracking suppliers associated with specific budget items and services.

---

## Performance Optimization

**Budget Caching** — Caching budget calculations to avoid recalculation on repeated requests.

**Trend Data Cache** — Caching utilization trend calculations for fast dashboard loading.

**Deferred Props** — Inertia.js feature deferring loading of expensive data until needed.

**Lazy Loading** — Deferring service plan loading until user interaction.

**Batch Processing** — Processing bulk service plan operations in background jobs.

---

## Testing & Quality

**Budget Factory** — Test fixture for generating realistic budget plan data.

**Service Plan Scenario** — Test scenario covering complete service plan workflow.

**Bill Matching Tests** — Tests verifying correct matching logic between bills and budgets.

**Consumption Tracking Tests** — Tests verifying accurate consumption calculations.

**Rate Card Versioning Tests** — Tests ensuring rate card history preserved correctly.
