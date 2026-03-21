---
title: "Linear Lisa — Design Rationale"
---

# Rationale: Why Linear's Patterns Work for Clinical Risk Management

## The Problem with Clinical Risk UIs

Clinical risk management tools are typically dense data tables with dozens of columns, colour-coded cells, and modal-heavy workflows. Care partners — often working during or immediately after client calls — need to capture clinical observations quickly and accurately. Cognitive overload from busy interfaces leads to incomplete assessments, missed risk indicators, and fatigue.

## Why "Less, But Better" Works Here

### 1. Single-column cards reduce cognitive load during calls

Care partners don't need to see all 28 risks simultaneously. Linear's single-column card layout presents risks as a scannable stream. Each card surfaces only the essentials: category name, status, consequence level, and last update. During a call, a care partner can scroll to the relevant risk, expand the check-in questions accordion, and capture responses — all without navigating away from the list.

The card format also creates natural visual separation between risk categories, reducing the row-confusion problem common in dense data tables where the eye can drift across rows.

### 2. Keyboard-first interaction suits data entry during calls

Care partners often type notes while speaking with clients. Switching between keyboard and mouse breaks conversational flow. Linear's keyboard-first philosophy — where every action has a shortcut and Cmd+K provides universal search — lets care partners navigate the risk profile without leaving the keyboard. Press A to start an assessment, arrow keys to move between risks, Enter to expand.

### 3. Focused wizard modals prevent assessment errors

The consequence assessment involves clinical judgment across 16 risk areas, each with 5 severity levels. Presenting all 16 questions on a single form invites satisficing — care partners might rush through or default to middle options. Linear's one-question-per-screen pattern forces deliberate consideration of each risk area. The progress indicator ("3 of 16") creates momentum without pressure.

### 4. The radar chart tells a clinical story at a glance

Linear treats charts as hero elements — the first thing you see, not something buried in a report. The 5-domain radar chart gives care coordinators and clinical leads an instant visual signature of a client's risk profile. An asymmetric polygon immediately reveals which domains need attention. This is faster than scanning 16 rows of a consequence matrix and more intuitive than comparing numerical scores.

### 5. Monochrome with semantic colour creates genuine signal

In a typical clinical interface, everything is colour-coded: headers, buttons, badges, backgrounds, borders. When everything is colourful, nothing stands out. Linear's monochrome-with-accent approach means that when a red dot appears next to "Falls — Major (3)", it genuinely draws attention. The traffic-light system (green/amber/red) works because it's the only colour in an otherwise gray interface.

## Design Decisions

| Decision | Reasoning |
|----------|-----------|
| Single-column cards over data table | Reduces cognitive load, supports inline expansion |
| Tab bar (All Risks / Risk Radar) | Two views, one context — no page navigation |
| Inline accordion for check-in questions | Feature-flagged content stays in card context |
| Step-based form in modal overlay | Focused editing without losing list position |
| One-question assessment wizard | Forces deliberate clinical judgment |
| Radar chart as hero element | Visual risk signature beats numerical comparison |
| Gray + teal + traffic lights only | Colour carries meaning, not decoration |
| Keyboard shortcut hints | Supports call-time data entry workflows |
