---
title: "Teams Chat: Multi-Package Support Context"
date: 2026-01-27
source: Teams Chat
---

# Teams Chat Context: Multi-Package Support

Raw context from Teams discussion about multi-funding stream onboarding challenges.

---

## Message 1: Problem Statement (Dom)

Quick context and problem statement.

### Meet Margaret
Margaret is a new Support at Home client starting with our service. Here's what should happen vs. what actually happens:

**What Margaret qualifies for:**
- **Ongoing Home Support**
  - Classification: SaH 4
  - Funding: $18,000 per quarter
  - Purpose: Personal care, domestic help, etc.
- **Assistive Technology**
  - Classification: AT - Low
  - Funding: $5,000 one-time
  - Duration: 1-year funding period
- Package Level: Support at Home Level 3 (from Zoho CRM)

**What should happen during onboarding:**
1. Zoho sends "Support at Home Level 3" → Portal creates a budget of $18,000 per quarter
2. Services Australia confirms Margaret has two classifications (Home Support + Assistive Technology)
3. Portal automatically creates two funding streams:
   - Ongoing Home Support: $18,000/quarter (ongoing)
   - Assistive Technology: $5,000 (1-year, short-term)
4. Budget Coordinator reviews and approves
5. Margaret's services begin immediately with correct funding in place

**What actually happens today:**
1. Zoho sends "Support at Home Level 3" → Portal creates a budget of $18,000 per quarter
2. Portal creates only one funding stream (Ongoing Home Support)
3. Services Australia later confirms Assistive Technology eligibility
4. Budget Coordinator notices missing AT funding
5. Budget Coordinator manually adds a second funding stream
6. Service delivery is delayed while the budget is corrected

**The Core Issue:**
- Current behavior: One package level → one funding stream
- Required behavior: One package level + multiple classifications → multiple funding streams (automatically)

*Numbers and classification enumerations here are non actuals but it gets the problem/issue across.*

---

## Message 2: Onboarding Team Perspective

Thanks Dom -

Key points from an onboarding and grow team perspective for how we got to current state:

- There was an immediate need for an onboarding process that allowed for TC to take on ATHM ONLY clients
- We piggybacked off the existing onboarding process by simply adding additional values the HCP picklist and updating the funding level table (that may not be correct name) for portal sync
- Same webhook and triggers for portal record creation

**Early Identified Issue:**
- We can only onboard 1 funding stream at a time
- Clients with AT and HM could only proceed through onboarding process for 1 stream
- The other we have to manually take up later - this is still causing problems for the assessment team

**Identified Need:**
- Multiple funding onboarding process that allows for TC to take up multiple packages at POS
- Way for TC to effectively manage multiple funding streams that clients may be approved for during their time with TC

**Growth Perspective:**
- Interest in understanding the notification process of clients with changes in funding level and allocation of additional funding streams
- Material for AT HM only clients that have a SaH package in tow - we would like to be in front of them early as preferred provider

**Additional Challenges:**
- ACER lodgement being a requirement for all funding streams
- Our ACER process being tied to the Consider module
- Challenging when 1 consumer may require multiple lodgements to be tracked against their profile but we have a system designed only for a single lodgement to be recorded

**Additional Considerations:**
- Partner onboarding forms need to connect to both CRM and Portal

---

## Message 3: ACER/PRODA Complication

Add in complication of ACER lodgement process triggers requiring CRM stages to be:
1. 'care plan sent'
2. Consumer 'signed'

We then require the CR-ID in consumer to be entered which syncs via webhook to Portal.

**THIS is how we sync funding with SA.**

**Current Gap:**
- We have no process at the moment for triggering multiple PRODA entries to be recorded for the various funding streams
- This means the funding stream is never activated in Portal

---

## Key Technical Gaps Identified

1. **Zoho → Portal Sync**: Only creates 1 funding stream per package level
2. **ACER Lodgement**: Tied to single CR-ID per consumer in Consider module
3. **PRODA Activation**: No process for multiple entries per consumer
4. **CRM Stage Triggers**: Only support single lodgement workflow
5. **Partner Forms**: Need dual CRM + Portal connection

## Classifications to Support

- Standard (Home Support)
- Restorative Care
- End-of-Life
- ATHM (Assistive Technology / Home Modification)
