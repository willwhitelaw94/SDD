---
title: "IDEA BRIEF: On Hold Bills Flow (OHB)"
---


**Epic Code**: OHB  
**Created**: 2026-01-14

## Problem Statement (What)

Trilogy Care processes hundreds of thousands of bill line items monthly. Bills that can't be auto-rejected or auto-paid go "on hold" with only ONE reason at a time. This creates: - Multiple rejection-resubmission cycles as suppliers fix issues one at a time - No coordination between departments (care, compliance, accounts) for internal resolution - Bottlenecks, delayed payments, and wasted capacity on preventable resubmissions ---

## Possible Solution (How)

Multi-issue tracking system with AI-assisted diagnosis and three distinct communication paths: - **AI Auto-Reject**: Instantly reject bills with 99% accurate disqualifiers (e.g., missing ABN, calculation errors) - **Multi-Issue Diagnosis**: Identify ALL internal + external reasons simultaneously (36 reason taxonomy) - **Internal Routing**: Route to care/compliance/accounts with discrete reason-level outcome tracking (no hard timeouts) - **Temporal Re-validation**: Re-check time-sensitive qualifiers (funding, authorization, supplier status) before every communication - **Three Communication Types**: REJECT-RESUBMIT (invoice issues), REJECT PERIOD (permanent blockers), ON HOLD (awaiting external action) - **Smart Filtering**: Can-coexist logic ensures only relevant reasons appear in communications - **Limited-Time Soft Warnings**: Flag time-sensitive issues (e.g., funding expiring soon) in rejection notices - **Cadence Management**: Day 0→3→7→10 countdown for ON HOLD communications only ---

## Benefits (Why)

- 60-70% fewer resubmission cycles (fix all issues in one go) - 50% faster processing with AI auto-reject - Better supplier/client experience with clear, consolidated feedback - 40% reduction in duplicate work across departments - Audit trail for root cause analysis and process improvement ---

## Owner (Who)

- **Owner**: TBD (Bills Processing team lead) - **Stakeholders**: Bills processors, Care (Romy), Compliance (Zoe), Accounts (Mellette), Data (David), Suppliers, Clients ---

## Other Stakeholders (Accountable / Consulted / Informed)

[Stakeholders to be defined]

## Assumptions & Dependencies, Risks

### Assumptions
**Assumptions**: - AI capability exists for 99% accurate auto-reject - Master reason list (TP-3816) will be complete and deduplicated - Departments can define clear resolution criteria **Dependencies**: - TP-3813: Care team reasons (Romy) - IN PROGRESS - TP-3814: Compliance reasons (Zoe) - AVAILABLE - TP-3815: Accounts reasons (Mellette) - AVAILABLE - TP-3816: Master list compilation (David) - IN PROGRESS **Risks**: - AI accuracy <99% → Phased rollout with human review for edge cases - Master list incomplete → TP-3816 deduplication + stakeholder validation - Department workflows unclear → Early workshops with teams ---

### Risks
[Risks to be identified]

## Estimated Effort

**Size**: Large **Complexity**: High **Timeline**: 10-14 weeks Includes master reason taxonomy, AI integration, multi-issue engine, department routing, re-validation framework, supplier communication templates, audit trail, analytics dashboard. ---

## Proceed to PRD?

Yes.
