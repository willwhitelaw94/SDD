---
title: "Design Challenge Brief: SR0 API Foundation & Two-Tier Auth"
---

# Design Challenge Brief: SR0 API Foundation & Two-Tier Auth

## Context

SR0 is the foundational epic for the Supplier Portal rebuild. It delivers the API v2 infrastructure and two-tier authentication model that every subsequent epic (SR1-SR7) depends on. While primarily backend, it has three critical user-facing screens: the login page, the account switcher, and error state patterns.

The new Supplier Portal is a **standalone React (Next.js)** app using **Shadcn/ui + Tailwind**, communicating with the Laravel API via token-based auth. It is completely separate from the existing Inertia portal.

## Design Scope

Three screens, each solving a distinct UX challenge:

### 1. Login Page
- Email/password authentication (no SSO in SR0)
- TC Logo + "Supplier Portal" subtitle branding
- Inline validation on blur, server error on submit
- Mobile-first: full-width on mobile, centered card on desktop
- No "Remember me" checkbox (CL-001)
- Touch targets 44px minimum

### 2. Account Switcher
- Header dropdown for switching between supplier entities under one organisation
- Shows supplier trading name + verification status dot (green=verified, amber=pending)
- Hidden for single-supplier users (FR-005, Story 4 AC3)
- Must remember last-used context (FR-016)
- Sub-1-second switch target (SC-003)
- Optimistic UI with skeleton fallback

### 3. Error States
- Rate limit banner: sticky, orange, countdown timer from `Retry-After` header, auto-dismiss
- Token expiry: redirect to login with info-level (blue) message
- API error: consistent alert pattern below content
- Network error: "Unable to connect" with retry CTA

## Brand Colours

| Usage | Colour | Hex |
|-------|--------|-----|
| Primary (buttons, nav) | Navy | #2C4C79 |
| Accent / active state | Teal | #007F7E |
| Success / verified | Green | #4DC375 |
| Warning / rate limit | Orange | #FF8F51 |
| Error / destructive | Red | #E04B51 |

## Key Constraints

- **Mobile-first**: Suppliers register and operate from phones
- **Token-based auth**: No cookies, no server sessions
- **Two-tier roles**: Organisation Administrator (cross-supplier) vs Supplier-level roles (scoped)
- **Progressive disclosure**: Login is single-purpose, don't overload
- **Accessibility**: WCAG AA, keyboard navigable, screen reader compatible

## Students

| # | Name | Paradigm | Approach |
|---|------|----------|----------|
| 1 | Minimal Maya | Minimal Zen | Clean login, single-focus auth, progressive disclosure |
| 2 | Dashboard Dan | Dashboard | Rich header with switcher, status-at-a-glance, notification bell |
| 3 | Mobile Mo | Mobile-First | Thumb-friendly login, bottom-sheet switcher, large touch targets |
