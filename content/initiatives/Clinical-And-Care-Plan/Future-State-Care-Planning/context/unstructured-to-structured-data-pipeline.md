---
title: "Unstructured to Structured Data Pipeline"
description: "Architecture for extracting unstructured PDF data via LLM, storing in semi-structured JSON, and serializing to structured tables"
---

## Problem

We need a universal mechanism to:
1. Extract unstructured data from PDF documents (via LLM pipeline)
2. Store it in a semi-structured JSON format
3. Serialize it later to proper structured tables (e.g., needs table, risks table)

This is a **3-stage data lifecycle**:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  UNSTRUCTURED   │ ──▶ │  SEMI-STRUCTURED │ ──▶ │    STRUCTURED   │
│  (PDF/Document) │     │  (JSON Storage)  │     │  (DB Tables)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
     Stage 1                 Stage 2                  Stage 3
   LLM Extraction         Intermediate Store       Serialization
```

---

## Stage 1: Unstructured → LLM Extraction

**Input**: PDF documents, assessment reports, clinical notes

**Process**:
- LLM pipeline extracts key information
- Returns structured-ish output but not fully normalized

**Output**: Raw extraction payload (JSON with varying schemas)

---

## Stage 2: Semi-Structured JSON Storage

**Purpose**: Universal intermediate storage that can hold data before we know exactly how to structure it

**Requirements**:
- Flexible schema (can evolve over time)
- Preserves original extraction context
- Linkable to source document
- Queryable for review/editing
- Supports human-in-the-loop validation

**Potential Structure**:

```json
{
  "id": "uuid",
  "source_document_id": "uuid",
  "extraction_type": "needs|risks|goals|interventions",
  "extraction_version": "1.0",
  "extracted_at": "2026-01-27T00:00:00Z",
  "confidence_score": 0.85,
  "status": "pending|validated|serialized",
  "raw_extraction": {
    // LLM output - flexible schema
  },
  "validated_data": {
    // Human-reviewed/corrected version
  },
  "serialization_mapping": {
    "target_table": "needs",
    "field_mappings": {}
  }
}
```

**Storage Options**:
1. **JSON column in MySQL** - Simple, queryable with JSON functions
2. **Dedicated extraction_payloads table** - With JSON column for data
3. **Document store** - If volume is high and schema is very flexible

---

## Stage 3: Serialization to Structured Tables

**Process**:
- Take validated semi-structured data
- Apply mapping rules to target table schema
- Create proper records in needs, risks, goals tables

**Requirements**:
- Mapping configuration per extraction type
- Validation before insert
- Audit trail (link back to source extraction)
- Idempotent (can re-run without duplicates)

---

## Design Considerations

### Schema Evolution
- Semi-structured stage allows schema to evolve without migrations
- New extraction types can be added without DB changes
- Mapping rules can be updated independently

### Human-in-the-Loop
- Stage 2 supports review/editing before serialization
- Validation UI can show confidence scores
- Corrections improve future extractions (training data)

### Traceability
- Every structured record links back to extraction
- Extraction links back to source document
- Full audit trail from PDF → table row

### Reprocessing
- Can re-extract from source documents
- Can re-serialize from semi-structured data
- Supports A/B testing of extraction models

---

## Questions to Resolve

1. **Storage choice**: JSON column vs separate document store?
2. **Validation workflow**: Who validates? When is auto-serialization OK?
3. **Mapping configuration**: Code vs database-driven rules?
4. **Versioning**: How to handle extraction model changes?
5. **Retention**: How long to keep intermediate JSON?

---

## Related

- Assessment Prescriptions (ASS1) - Similar extraction pipeline for ATHM items
- Inclusion Seeds - Another semi-structured intermediate concept
