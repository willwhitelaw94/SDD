---
title: "AI EXTRACTION PROMPT: OT Assessment Report → Tier Classification"
---


## YOUR TASK

Extract **PRODUCT recommendations ONLY** from the assessment document and classify them using the tier database provided.

**SCOPE: This prompt handles PRODUCTS only. Services (physiotherapy, nursing, etc.) are out of scope and will be handled separately.**

**CRITICAL: You MUST search the tier database and cite the exact row you matched. No guessing allowed.**

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
    "database_match": "Exact match to 'Rollators' in tier database",
    "notes": "Any relevant context or uncertainty"
  }
]
```

**Field Rules:**
- `item_name`: Clean product name (e.g., "Shower chair" NOT "Buy Shower Chair Online - ILS (ilsau.com.au)")
- `item_type`: Always "product" (services are out of scope)
- `quantity`: Integer (use 1 if not specified)
- `price`: Number or null if not mentioned
- `tier_code`: **Tier-5 code** - MUST come from database (products always use Tier-5, never Tier-3 or Tier-4)
- `tier_description`: Copy exactly from the "Tier 5 (Item)" column in database
- `prescription_requirement`: Copy exactly from "Prescription requirement" column in database
- `confidence`: "high" = exact match, "medium" = semantic match, "low" = best guess from database
- `database_match`: **REQUIRED** - Explain which row/term you matched in the tier database
- `notes`: Optional - only if there's something important to flag

**Installation & Home Modifications:**
- If a product requires installation (e.g., grab rails, ramps), the Tier-5 code **includes both product and installation** (materials + labor)
- Prefer specific equipment Tier-5 codes (e.g., `18 18 10` for grab rails) over generic HM codes
- Only use HM (Home Modification) codes when there is NO specific equipment tier code available or when the recommendation is purely structural modification (not equipment)

---

## CLASSIFICATION RULES

### STEP 1: Extract Items from Document

**Read the entire document first**, then extract items systematically:

1. **Primary source: Look for "Recommendations" or "Product" sections first**
   - These contain the specific items being prescribed
   - Prefer specific product names over generic descriptions

2. **Avoid duplicates:**
   - If the same item appears multiple times (e.g., mentioned generically in narrative, then listed specifically in recommendations), extract it **only once**
   - Use the **most specific product name** available (e.g., "Ellipse Super Lite Rollator Medium" not "rollator walker")
   - Use the **most complete information** (quantity, price, supplier if available)

3. **When to extract separately:**
   - Different products that happen to serve the same function (e.g., "Non-slip shower mat" + "Peak Shower Deluxe Mat" are both bath mats but are separate recommendations)
   - Explicitly numbered/listed items (e.g., "1. Product A" and "2. Product B")
   - Items for different locations (e.g., "Grabrail for front patio" vs "Grabrail for shower")

**Example - Avoid This Duplication:**
```
Report says:
"Client requires a shower chair for safe transfers...
Product: Drive Medical Shower Chair"

❌ Don't extract both:
- "Shower chair" (generic)
- "Drive Medical Shower Chair" (specific)

✅ Extract once:
- "Drive Medical Shower Chair"
```

**Example - Extract Both (Not Duplicates):**
```
Report says:
"Replace existing non-slip mat...
Product: Peak Shower Deluxe Mat"

✅ Extract both (different items):
- "Replacement anti-slip bathmat" (generic recommendation)
- "Peak Shower Deluxe Mat" (specific product)
```

### STEP 2: Search Tier Database for Each Item
For each extracted item, **you MUST search the tier database** using these strategies:

**Strategy A: Exact Name Match**
- Search the "Tier 5 (Item)" column for exact or near-exact matches
- Example: "Rollator" in document → Search database → Find "Rollators" in Tier 5 column

**Strategy B: Keyword Search in Tier 5 Column**
- Search for key terms from the item name
- Example: "Digital Calendar Clock" → Search database for "clock" → Find "Clocks and timepieces"

**Strategy C: Category Search via Tier 4**
- If no Tier 5 match, search the "tier_4" column for functional category
- Example: "Grab rails" → Search tier_4 for "grab" or "rail" → Find "Supporting handrails and grab bars"

**Strategy D: Use "Other" Category as Last Resort**
- If no match found in A-C, find the most relevant Tier 4 category and use its "OTH" code
- Example: "Kettle tipper" → No exact match → Use "15 03 OTH" (Other - Preparing food and drink)

### STEP 3: Copy Data from Matched Row
Once you've found the matching row in the database:
1. Copy the **t5_code** (Tier-5 code) - e.g., "12 06 06"
2. Copy the **Tier 5 (Item)** description - e.g., "Rollators"
3. Copy the **Prescription requirement** - e.g., "Prescribed"
4. Document your match in **database_match** field

### Products → Tier-5
Products must be classified to **Tier-5** (the most specific code from the t5_code column).

### Services → Tier-3
Services have **no Tier-4 or Tier-5**. Only classify to Tier-3 (t3_code column).

### If You Truly Can't Find a Match
Only if the database has NO relevant category at all:
- Set `tier_code: null`
- Set `tier_description: "No match found"`
- Set `prescription_requirement: null`
- Set `confidence: "low"`
- Set `database_match: "No suitable category found in tier database"`

---

## EXAMPLES

### Example 1: Exact Match

**Item from Report:** "Four-wheeled rollator with seat - $285"

**Database Search Process:**
1. Search "Tier 5 (Item)" column for "rollator"
2. Find exact match: "Rollators" with code "12 06 06"
3. Check prescription requirement: "Prescribed"

**Output:**
```json
{
  "item_name": "Four-wheeled rollator with seat",
  "item_type": "product",
  "quantity": 1,
  "price": 285.00,
  "tier_code": "12 06 06",
  "tier_description": "Rollators",
  "prescription_requirement": "Prescribed",
  "confidence": "high",
  "database_match": "Exact match to 'Rollators' (12 06 06) in tier database",
  "notes": null
}
```

### Example 2: Keyword Match

**Item from Report:** "Digital Calendar Clock Large"

**Database Search Process:**
1. Search "Tier 5 (Item)" for "calendar clock" - no exact match
2. Search for "clock" - find "Clocks and timepieces" with code "22 28 03"
3. Check prescription requirement: "Prescribed"

**Output:**
```json
{
  "item_name": "Digital Calendar Clock Large",
  "item_type": "product",
  "quantity": 1,
  "price": null,
  "tier_code": "22 28 03",
  "tier_description": "Clocks and timepieces",
  "prescription_requirement": "Prescribed",
  "confidence": "medium",
  "database_match": "Keyword match: 'clock' matched to 'Clocks and timepieces' (22 28 03)",
  "notes": null
}
```

### Example 3: Category Match

**Item from Report:** "Grab rails"

**Database Search Process:**
1. Search "Tier 5 (Item)" for "grab rails" - no exact match
2. Search tier_4 column for "grab" - find "Supporting handrails and grab bars"
3. Find Tier 5 item: "Removable grab rails and hand grips" with code "18 18 10"
4. Check prescription requirement: "Prescribed"

**Output:**
```json
{
  "item_name": "Grab rails",
  "item_type": "product",
  "quantity": 1,
  "price": null,
  "tier_code": "18 18 10",
  "tier_description": "Removable grab rails and hand grips",
  "prescription_requirement": "Prescribed",
  "confidence": "high",
  "database_match": "Found 'Removable grab rails and hand grips' (18 18 10) under 'Supporting handrails and grab bars' category",
  "notes": null
}
```

### Example 4: Using "Other" Category

**Item from Report:** "Uccello Tipping Kettle"

**Database Search Process:**
1. Search "Tier 5 (Item)" for "kettle" - no match
2. Search tier_4 for "kettle" - no match
3. Determine functional category: food/drink preparation
4. Find tier_4 "Preparing food and drink" (15 03)
5. Use "Other" code: "15 03 OTH"
6. Check prescription requirement for that tier_4 category

**Output:**
```json
{
  "item_name": "Uccello Tipping Kettle",
  "item_type": "product",
  "quantity": 1,
  "price": null,
  "tier_code": "15 03 OTH",
  "tier_description": "Other",
  "prescription_requirement": "Low risk",
  "confidence": "low",
  "database_match": "No exact match - classified under 'Other' (15 03 OTH) for 'Preparing food and drink' category",
  "notes": "No specific kettle/tipper category in database"
}
```

### Example 5: Bundled Items - Extract Separately

**Item from Report:** "Bidet with 3-in-1 arms and toilet seat raiser"

**Database Search Process:**
Separate into individual items, then search each:
1. "Bidet" - no match in database
2. "3-in-1 arms" (toilet arms) - search for "toilet arm" → find "Toilet arm supports and toilet back supports, free-standing" (09 12 25)
3. "Toilet seat raiser" - search for "raised toilet seat" → find "Raised toilet seats, detachable" (09 12 15)

**Output:**
```json
[
  {
    "item_name": "Bidet",
    "item_type": "product",
    "quantity": 1,
    "price": null,
    "tier_code": null,
    "tier_description": "No match found",
    "prescription_requirement": null,
    "confidence": "low",
    "database_match": "No bidet category found in tier database",
    "notes": "Home modification referral form mentioned"
  },
  {
    "item_name": "3-in-1 toilet arms",
    "item_type": "product",
    "quantity": 1,
    "price": null,
    "tier_code": "09 12 25",
    "tier_description": "Toilet arm supports and toilet back supports, free-standing",
    "prescription_requirement": "Low risk",
    "confidence": "medium",
    "database_match": "Matched 'toilet arms' to 'Toilet arm supports and toilet back supports, free-standing' (09 12 25)",
    "notes": "Part of bidet with 3-in-1 arms recommendation"
  },
  {
    "item_name": "Toilet seat raiser",
    "item_type": "product",
    "quantity": 1,
    "price": null,
    "tier_code": "09 12 15",
    "tier_description": "Raised toilet seats, detachable",
    "prescription_requirement": "Prescribed",
    "confidence": "high",
    "database_match": "Matched 'toilet seat raiser' to 'Raised toilet seats, detachable' (09 12 15)",
    "notes": "Part of bidet with 3-in-1 arms recommendation"
  }
]
```

---

## COMMON PRODUCT MAPPINGS (Reference Only)

Use these as hints, but **always verify against the actual tier database**:

| Common Item | Search Term | Likely Tier-5 Code |
|-------------|-------------|-------------------|
| Rollator / Walker | "Rollators" | 12 06 06 |
| Shower chair | "Shower chairs" | 09 33 07 |
| Grab rails | "grab rails" | 18 18 10 |
| Non-slip mat | "non-slip" or "mat" | 09 33 06 |
| Commode chair (with wheels) | "Commode chairs" | 09 12 03 |
| Raised toilet seat | "Raised toilet seats" | 09 12 15 or 09 12 12 |
| Over-bed table | "Bed tables" | 18 03 15 |
| Electric bed (hi-lo) | "powered adjustment" | 18 12 10 |
| Jar/bottle opener | "Container openers" | 24 06 03 |
| Reacher / Pick-up tool | "Manual gripping tongs" | 24 21 03 |
| Swivel cushion | "Turntables" | 12 31 06 |
| Chair lift / Lift chair | "Chair lifts and chair transporters" | 18 09 24 |
| Clock (calendar/orientation) | "Clocks and timepieces" | 22 28 03 |

---

## IMPORTANT REMINDERS

1. **You MUST search the tier database** - Do not guess tier codes
2. **Always document your database match** - Explain which row you used
3. **Extract every product/service mentioned** - Even if bundled together, separate them
4. **Always classify products to Tier-5** (t5_code column)
5. **Always classify services to Tier-3 only** (t3_code column)
6. **Copy prescription requirement from the database** - Don't infer it
7. **If uncertain, use "Other" category** - Better than null
8. **Work methodically** - Extract → Search → Match → Document

---

## START NOW

Extract items from the document and return the JSON array with verified database matches.
