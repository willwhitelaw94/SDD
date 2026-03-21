---
title: "SOP2 - 2294. Idea - Brief"
---


**Epic Code**: SPO  
**Created**: 2026-01-14

## Problem Statement (What)

Suppliers require an enhanced self-service portal to manage service pricing, particularly for complex scenarios involving direct and indirect pricing models across multiple locations and service types. Current manual processes create significant bottlenecks in supplier onboarding and pricing management, with spreadsheet-based workflows introducing errors and delays. This initiative streamlines Portal 2 enhancements to deliver improved supplier experience and operational efficiency. The solution implements Supplier Portal 2 (SOP2) with enhanced capabilities for comprehensive pricing matrix management supporting direct and indirect pricing by location, service type, and time-of-service. The Portal enables streamlined data entry and bulk operations for managing complex pricing scenarios, introduces real-time validation and error handling to prevent pricing errors, and integrates seamlessly with bill matching and budget systems. Conditional workflows support complex multi-location, multi-service pricing scenarios where suppliers operate across different regions and service categories.

## Possible Solution (How)

[Solution description needed]

## Benefits (Why)

**Effort Breakdown**: Development of Portal enhancements is estimated at one to two months of effort including Portal UI development, database implementation of pricing logic, validation rule implementation, EFTSure integration, and testing of complex pricing scenarios. Quality assurance testing is critical given the impact of pricing errors on billing accuracy. **Cost**: Estimated cost is moderate, requiring two to three development squad members for the duration of the project. Infrastructure and EFTSure integration costs are additional considerations. **Timeframe**: Completion target is Q1 2026, allowing time for thorough testing of multi-location and complex pricing scenarios before widespread supplier adoption. This timeline aligns with overall supplier management roadmap priorities. **Projected Benefits**: Supplier pricing management time is reduced by fifty percent through bulk operations and streamlined data entry. Billing errors from incorrect pricing are reduced by an estimated forty to fifty percent through real-time validation. Coordinator overhead for pricing updates is substantially reduced through supplier self-service capabilities. Financial accuracy improves through consistent pricing application across all locations and services. **Alignment with Strategic Goals**: This initiative enhances the supplier experience through a more intuitive, self-service portal. It strengthens operational efficiency by eliminating manual pricing workflows. It improves financial control and accuracy through validated pricing and seamless system integration. The initiative supports scaling supplier operations from current levels to support organizational growth.

## Owner (Who)

[Owner to be assigned]

## Other Stakeholders (Accountable / Consulted / Informed)

**Supplier Management (Owner)**: Zoe Judd leads workflow design, pricing requirement definition, and stakeholder coordination to ensure supplier needs are met. **Engineering Team**: Steven Boge (Lead) and Elton Fernando Doehnert are responsible for system architecture, Portal UI development, and database implementation of pricing logic. **Product and Development Teams**: Provide product management, development resources, and release coordination to deliver the Portal enhancements on schedule. **Finance and Accounts Payable**: Manage bank verification through EFTSure integration and ensure MYOB sync for financial reconciliation. They validate pricing against contracts and budgets. **Operations**: Suppliers use the Portal to manage and update pricing. Care Coordinators leverage supplier pricing data for service procurement and budgeting. **Quality Assurance**: Validate pricing logic, test edge cases with complex multi-location scenarios, and verify bill matching accuracy.

## Assumptions & Dependencies, Risks

### Assumptions
**Assumptions**: Supplier pricing requirements are finalized prior to development commencing. EFTSure integration is available and stable for production use. Database pricing logic has been validated and is ready for implementation. Direct and indirect pricing models are clearly defined and documented. **Dependencies**: Multi-rate and multi-location pricing logic must be fully operational before Portal enhancements are deployed. Miro Auth Flow must be implemented to enable conditional workflow logic. Direct and indirect pricing models must be defined and documented. ABN duplicate issue resolution must be completed to ensure supplier records are accurate and deduplicated. **Risks**: Complex pricing logic could impact bill matching accuracy if validation is insufficient, requiring extensive testing and possible fallback procedures. EFT integration delays could require fallback to manual verification, creating bottlenecks during supplier onboarding. Duplicate ABN handling edge cases could cause supplier records to be incorrectly linked or split. High volume of supplier updates during launch window could create performance issues or data corruption if scalability is not properly tested. Multi-location pricing scenarios with service overlaps could create confusion or billing disputes requiring manual resolution.

### Risks
[Risks to be identified]

## Estimated Effort

[Effort estimate needed]

## Proceed to PRD?

Yes.
