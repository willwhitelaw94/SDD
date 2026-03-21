---
title: "AI EXTRACTION PROMPT: OT Assessment Report → Tier Classification"
---

## YOUR TASK

Extract product and service recommendations from the assessment document and classify them using the tier database provided.

**Speed over perfection.** If you're unsure, flag it and move on.

---

## INPUT

You will receive:
1. An assessment document (OT report, quote, or amendment)
2. A tier classification database (CSV or table format)

---

## OUTPUT

Return a simple JSON array of items:

```json
[
  {
    "item_name": "Product or service name",
    "item_type": "product | service",
    "quantity": 1,
    "price": 250.00,
    "tier_code": "12 06 06",
    "tier_description": "Rollators",
    "prescription_requirement": "Prescribed | Under advice | Low risk",
    "confidence": "high | medium | low",
    "notes": "Any relevant context or uncertainty"
  }
]
```

**Field Rules:**
- `item_name`: Extract exactly as written in the document
- `item_type`: "product" or "service"
- `quantity`: Integer (use 1 if not specified)
- `price`: Number or null if not mentioned
- `tier_code`: **Tier-5 code for products, Tier-3 code for services**
- `tier_description`: Human-readable name from tier database
- `prescription_requirement`: Copy from tier database
- `confidence`: "high" = exact match, "medium" = semantic match, "low" = guess/uncertain
- `notes`: Optional - only if there's something important to flag

---

## CLASSIFICATION RULES

### Products → Tier-5
Products must be classified to **Tier-5** (the most specific code).

Example: "Rollator walker" → Search tier database → Find "Rollators" → Code: `12 06 06`

### Services → Tier-3
Services have **no Tier-4 or Tier-5**. Only classify to Tier-3.

Example: "Physiotherapy sessions" → Code: `SERV-PHYSIO` (or similar T3 code from database)

### How to Match

1. **Search the tier database** for the item name
2. Look for exact matches first
3. If no exact match, search for semantically similar terms
4. If still no match, use your best judgment and mark confidence as "low"
5. **Copy the prescription requirement** from the database row

### If You Can't Find a Match

- Set `tier_code: null`
- Set `tier_description: "No match found"`
- Set `confidence: "low"`
- Add note explaining the issue

---

## EXAMPLES

### Example 1: Simple Product Extraction

**Input Document:**
```
Recommendations:
1. Four-wheeled rollator with seat - $285
2. Shower chair (height adjustable) - $178
```

**Output:**
```json
[
  {
    "item_name": "Four-wheeled rollator with seat",
    "item_type": "product",
    "quantity": 1,
    "price": 285.00,
    "tier_code": "12 06 06",
    "tier_description": "Rollators",
    "prescription_requirement": "Prescribed",
    "confidence": "high",
    "notes": null
  },
  {
    "item_name": "Shower chair (height adjustable)",
    "item_type": "product",
    "quantity": 1,
    "price": 178.00,
    "tier_code": "09 33 07",
    "tier_description": "Shower chairs with and without wheels",
    "prescription_requirement": "Prescribed",
    "confidence": "high",
    "notes": null
  }
]
```

### Example 2: Bundled Items

**Input Document:**
```
Custom bathroom package: grab rails + shower seat - $1,200 total
```

**Output:**
```json
[
  {
    "item_name": "Grab rails",
    "item_type": "product",
    "quantity": 1,
    "price": null,
    "tier_code": "18 18 10",
    "tier_description": "Removable grab rails and hand grips",
    "prescription_requirement": "Prescribed",
    "confidence": "medium",
    "notes": "Part of bundled package - individual price unknown"
  },
  {
    "item_name": "Shower seat",
    "item_type": "product",
    "quantity": 1,
    "price": null,
    "tier_code": "09 33 07",
    "tier_description": "Shower chairs with and without wheels",
    "prescription_requirement": "Prescribed",
    "confidence": "medium",
    "notes": "Part of bundled package - individual price unknown"
  }
]
```

### Example 3: Uncertain Classification

**Input Document:**
```
Electric kettle tipper - $95
```

**Output:**
```json
[
  {
    "item_name": "Electric kettle tipper",
    "item_type": "product",
    "quantity": 1,
    "price": 95.00,
    "tier_code": "15 03 OTH",
    "tier_description": "Other (Preparing food and drink)",
    "prescription_requirement": "Low risk",
    "confidence": "low",
    "notes": "No exact match - classified under 'Other' for food preparation"
  }
]
```

---

## IMPORTANT REMINDERS

1. **Extract every product/service mentioned** - even if bundled together
2. **Always classify products to Tier-5** (not Tier-3 or Tier-4)
3. **Always classify services to Tier-3 only**
4. **Copy prescription requirement from the database** - don't guess
5. **If uncertain, mark confidence as "low" and move on** - don't overthink
6. **No nested objects** - keep the output flat and simple
7. **Work quickly** - speed matters more than perfection

---

## START NOW

Extract items from the document and return the JSON array.
