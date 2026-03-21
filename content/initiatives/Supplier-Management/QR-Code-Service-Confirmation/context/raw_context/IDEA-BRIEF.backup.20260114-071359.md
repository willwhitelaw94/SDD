---
title: "QRW 1. Idea Brief"
---


**Epic Code**: QRW  
**Created**: 2026-01-14

## Problem Statement (What)

[Problem description needed]

## Possible Solution (How)

A lightweight, QR-based Visit Confirmation module: Each recipient gets a client-specific QR (printed on care plan and optionally fridge magnet) Worker scans QR on arrival and departure to open a mobile page unique to that recipient Worker enters details (name, supplier ID), selects booking ID, ticks confirmation box ("I have attended"), and submits System validates recipient ↔ booking linkage and time window, stores an auditable record, and optionally updates booking status Other solution elements: Capture photo evidence of service delivery Geolocation of service provider Provider questionnaire: general wellbeing and service-specific wellbeing Voice case notes (multi-language) AI review of notes to extract important information Technical scope: Mobile web page (PWA-capable) Backend endpoints, validations, and audit store QR slug generator and asset pack for care plan + magnet Basic admin views: visit log, exceptions, export Optional toggles: GPS capture, client PIN, auto-set booking "Arrived"

## Benefits (Why)

Operational certainty: Verifiable "I was there" signals tied to bookings Reduced disputes & leakage: Fewer timesheet/admin disputes; lower risk of over-claiming Faster claiming: Clean data for finance and compliance Low friction for workforce: No login; ~10–20 seconds per check-in Rapid rollout: QR issued at onboarding and embedded in care plan PDFs Security by design: Scoping, time-window checks, duplicate detection, optional PIN, revocable QR slugs Fewer admin hours: Save coordinator/payroll time weekly Leakage reduction: Example – if 4,000 visits/month and QR reduces questionable claims by 1–2% at $60/visit, monthly savings ≈ $2.4k–$4.8k (annualised $28k–$58k) Data quality: Clear evidence trail (who, where/when, which booking)

## Owner (Who)

Romy Blacklaw – Care Innovation and Transformation Lead

## Other Stakeholders (Accountable / Consulted / Informed)

Care Workers – submit confirmations Recipients / Families – consent to QR display Scheduling / Care Coordination – manage bookings, monitor exceptions Finance – rely on confirmations for approvals and audits Quality & Compliance – evidence for program requirements and investigations IT / Engineering – build & support module; integrate with bookings/care plan PDFs Provider Partners – onboarding collateral (magnets, print)

## Assumptions & Dependencies, Risks

### Assumptions
Assumptions: Workers have smartphones with cameras and intermittent data Booking system exposes recipient-scoped bookings and stable IDs Care plan generation pipeline can embed QR and short URL Worker names can be entered free text (no SSO for MVP) Dependencies: Recipient & booking data (API/DB access) Short URL/slug service for non-PII QR links PDF generation for care plans; vendor/print for magnets Basic reporting/eventing for finance/compliance

### Risks
Spoofing (no auth): Mitigate with scoping, time-window validation, roster cross-check, device/IP rate-limits, optional PIN/GPS, QR rotation Wrong booking selection: Filter by recipient + near-timeframe; highlight "today/now"; allow search; flag out-of-window Privacy concerns: No PII in QR; hash IP; explicit GPS consent; retention policy Connectivity gaps: Fast-loading short form; queued submit/retry; fallback short URL Change management: Provide 1-page worker guide and quick video

## Estimated Effort

Engineering: ~2.5–4.0 person-weeks total Discovery: 1 week Design: 1 week Development: 2 weeks Print collateral: 2 weeks

## Proceed to PRD?

Not specified in QRW draft
