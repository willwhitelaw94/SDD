---
title: "Idea Brief: Assessments & Products"
---

# Idea Brief: Assessments & Products

**Epic Code**: SR6
**Created**: 2026-03-19
**Author**: Will Whitelaw
**Status**: Draft

---

## The Problem

Trilogy Care manages a wide range of product and assistive technology services for clients under the Support at Home programme. Today, there is no structured way to link an assessment (e.g., occupational therapy, mobility, nutrition) to the supplier who delivers the resulting product or service. The assessment-to-supplier-to-payment chain is manually tracked, creating compliance gaps and billing errors.

Specific pain points:

- **No digital assessment record** -- assessments and prescriptions exist in documents, emails, and external systems but are not tracked as structured data in the portal. Care Partners have no single place to view what assessments a client has had, what was recommended, or what is pending
- **No mandatory assessment-to-billing linkage** -- suppliers can submit bills for products without a linked assessment or budget approval, making it impossible to systematically verify that a product was prescribed, approved, and budgeted before payment
- **Supplier product capabilities are invisible** -- when a supplier adds product-related service categories to their price list, there is no automatic discovery mechanism. Care Partners searching for a supplier who can provide assistive technology or nursing consumables must rely on manual knowledge or spreadsheets
- **Product workflow is ad-hoc** -- the lifecycle from "assessment recommends a product" through "supplier is selected, product is ordered, bill is received, payment is made" has no defined status workflow. Items get lost between steps, and there is no audit trail
- **S@H product categories are not enforced** -- Support at Home defines specific product categories (Assistive Technology, Nursing consumables, Home maintenance, Nutrition, Mobility, Domestic life, Managing body functions, Self-care, Communication & information management) but these are not consistently applied in billing or supplier matching

---

## The Solution

Build the **assessment management and product supplier flow** that creates a verified chain from clinical recommendation through to supplier payment.

1. **Assessment Management** -- Care Partners and coordinators can create, view, and manage assessments linked to clients. Each assessment captures the category (AT, nursing, mobility, nutrition, communication aids), purpose, recommendation, and status. Assessments link directly to the client record and serve as the authorisation for product procurement
2. **Product Supplier Discovery** -- When a supplier adds product-related service categories to their price list, a Products tab is automatically created in their supplier portal profile. Care Partners can search for suppliers by product category, seeing only suppliers who are registered and priced for that category
3. **Mandatory Assessment-Budget-Supplier Linkage** -- Before a product bill can be processed, the system requires a linked assessment (proving clinical need), a linked budget line item (proving funding availability), and a linked supplier (proving the supplier is approved for this category). Bills without all three linkages are rejected
4. **Product Status Workflow** -- A defined workflow tracks each product from approval through delivery: Approved (Pending Product) -> Bill Received -> Paid, with a Rejected path for items that fail validation. Each status transition is auditable
5. **S@H Product Category Enforcement** -- The nine Support at Home product categories are enforced as the taxonomy for assessments, supplier capabilities, and billing. This ensures consistency across the assessment-to-payment chain

---

## Why Now

- **SR4 (Billing & Invoicing) is landing** -- the billing infrastructure now exists to validate bills against linked records, but without assessments and product categories, there is nothing to validate against
- **This epic unblocks the full supplier portal transition** -- the current supplier portal cannot be decommissioned until product flows are rebuilt in the new system. Assessments and products are the last major functional gap before migration
- **Support at Home compliance** -- the S@H programme requires documented clinical justification for product expenditure. Without structured assessment records, Trilogy Care carries audit risk
- **Existing Linear projects are blocked** -- ASS1 (Assessments/Prescriptions) and PSF (Product Supplier Flow) have been in Blocked/Backlog status waiting for the billing foundation

---

## RACI

| Role | Person | Responsibility |
|------|--------|----------------|
| Accountable | Will Whitelaw | Epic owner, spec approval |
| Responsible | Dev team | Implementation |
| Consulted | David Henry | Product workflow, supplier operations |
| Consulted | Khoa Duong | Data model, billing integration |
| Informed | Sophie Pickett | Compliance implications |

---

## Success

- Care Partners can create an assessment for a client and link it to a product category in under 3 minutes
- Suppliers with product capabilities are automatically discoverable by category
- 100% of product bills require a linked assessment and budget before payment processing
- Product lifecycle is fully auditable from assessment through to payment
- Zero product bills processed without clinical justification (assessment linkage)

---

## Estimated Effort

| Metric | Value |
|--------|-------|
| **Size** | L (Large) |
| **Confidence** | Medium |

**Key Drivers**: Assessment CRUD with client linkage, product category taxonomy, mandatory three-way linkage validation on billing, product status workflow, supplier product discovery, integration with existing billing pipeline (SR4)

**Assumptions**: SR0 API foundation and SR4 billing infrastructure are in place. Existing supplier price list and service category models can be extended for product categories. Figma designs exist for assessment flows (ASS1 project).

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR6-Assessments-Products/spec)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- [SR4 - Billing & Invoicing](/initiatives/Supplier-REDONE/SR4-Billing-Invoicing)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
- Figma: https://www.figma.com/design/3wJaYylJlP5WSeiGD9ym6s/
- PRD: https://trilogycare.atlassian.net/wiki/x/hoQKGg
- Miro (Assessments): https://miro.com/app/board/uXjVJE8_Rlk=/
- Miro (Product Flow): https://miro.com/app/board/uXjVJsbo8Tk=/
- Loom: https://www.loom.com/share/9006af4349054ec0a4e200901cbb2bc3
