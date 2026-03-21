---
title: "Supplier Pricing Guidance"
description: "Guided pricing entry showing cost per unit for suppliers"
date: 2026-02-02
version: "5.7"
ticket: TP-3703
category: feature
impact: medium
---

# Supplier Pricing Guidance

**Released:** 2 February 2026 | **Ticket:** [TP-3703](https://trilogycare.atlassian.net/browse/TP-3703) | **Impact:** Medium

---

## What's New

Suppliers now see clearer pricing guidance when entering their service prices. The pricing table displays costs as **$ per Unit** rather than raw values, making it easier for suppliers to understand exactly what they're charging.

### Improved Price Display

The Supplier Price Table now shows:
- Clear "$ cost per Unit" labeling
- Consistent currency formatting
- Unit type context (per hour, per session, per item)

**How it works:**
1. Suppliers navigate to their Prices page
2. Price entries display with unit context (e.g., "$45.00 per hour")
3. When editing, the unit type is clearly visible
4. Validation ensures prices are entered correctly

**Who benefits:** Suppliers entering and managing their service prices

---

## Why This Matters

### Reduces Pricing Errors

Previously, suppliers sometimes entered prices without understanding the unit basis, leading to:
- Incorrect hourly vs. per-session pricing
- Billing discrepancies
- Manual corrections by staff

### Clearer Communication

The new display format matches how prices are discussed:
- "We charge $45 per hour" → Shows as "$45.00 per hour"
- "Our session rate is $120" → Shows as "$120.00 per session"

---

## Technical Notes

<details>
<summary>For developers</summary>

- **Component:** `SupplierPriceTable.vue`
- **Changes:** Display formatting only - no data model changes
- **Dependencies:** Uses existing `UnitType` model for unit labels

</details>

---

## Related

- [Supplier Pricing Initiative](/initiatives/Supplier-Management/Supplier-Pricing)
- [Supplier Onboarding](/features/domains/suppliers)
