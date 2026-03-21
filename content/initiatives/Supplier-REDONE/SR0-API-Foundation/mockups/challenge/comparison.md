---
title: "Design Challenge Comparison: SR0 API Foundation"
---

# Pattern Comparison: SR0 API Foundation & Two-Tier Auth

## Screen 1: Login Page

| Aspect | Minimal Maya | Dashboard Dan | Mobile Mo |
|--------|-------------|---------------|-----------|
| **Layout** | Centered card on gradient, generous whitespace | Split-screen: brand panel left, form right | Full-bleed form, no card border on mobile |
| **Branding** | TC logo + subtitle only, ultra-clean | Large brand panel with tagline + feature highlights | Logo at top, wave/curve decorative element |
| **Form density** | 2 fields + 1 button, nothing else visible | 2 fields + forgot link + register link + help icon | 2 fields stacked vertically, extra-large touch targets |
| **Error display** | Subtle inline alert, appears above fields | Prominent alert box with icon, shakes on error | Full-width banner slides down from top |
| **Mobile treatment** | Card becomes full-width, padding increases | Split-screen collapses to stacked | Native-app feel, bottom-anchored submit button |

### Verdict: Login Page
- **Maya** nails the "single-purpose screen" brief — zero distraction, fast to scan
- **Dan** adds useful context (brand reinforcement, feature preview) but risks over-engineering a login
- **Mo** is the most thumb-friendly but the bottom-anchored button may confuse desktop users

---

## Screen 2: Account Switcher

| Aspect | Minimal Maya | Dashboard Dan | Mobile Mo |
|--------|-------------|---------------|-----------|
| **Trigger** | Text button in header: "Acme Pty" with chevron | Rich header tile with org logo + supplier name + role badge | Tap avatar/name in top-right, bottom-sheet slides up |
| **Dropdown style** | Minimal list: name + status dot, nothing else | Card per supplier: name, role, verification badge, last-active timestamp | Bottom sheet with large touch rows, swipe to dismiss |
| **Status indicators** | Colour dot only (green/amber/none) | Badge + dot + "Verified" / "Pending" text label | Colour dot + text, large row height for tap accuracy |
| **Org context** | Organisation name as section header | Organisation card at top with ABN + entity count | Organisation name in sheet header |
| **Switch feedback** | Instant — optimistic swap, no animation | Skeleton shimmer across page content | Haptic-style feedback + skeleton |

### Verdict: Account Switcher
- **Maya** is the fastest to parse — minimal cognitive load, but may lack context for new users
- **Dan** gives the most information density — great for power users managing many entities
- **Mo** is the most touch-friendly — bottom sheet is a natural mobile pattern

---

## Screen 3: Error States

| Aspect | Minimal Maya | Dashboard Dan | Mobile Mo |
|--------|-------------|---------------|-----------|
| **Rate limit banner** | Thin bar at top, countdown text only | Rich banner with icon, countdown, progress bar, dismiss button | Full-width banner, large text, prominent countdown |
| **Token expiry** | Clean redirect to login, blue info alert | Modal warning before expiry ("Session expiring in 2 min"), then redirect | Toast notification + auto-redirect with countdown |
| **API error** | Inline alert below content, muted styling | Error card with code, message, retry button, expand for details | Full-screen error state with large retry button |
| **Network error** | Subtle banner: "Check connection" | Illustrated empty state with retry CTA | Offline indicator in header + cached content hint |

### Verdict: Error States
- **Maya** keeps errors unobtrusive — good for expected states (rate limit, session expiry)
- **Dan** provides the most actionable error information — debug-friendly for technical users
- **Mo** ensures errors are impossible to miss on small screens

---

## Trade-Off Matrix

| Criterion | Weight | Maya | Dan | Mo |
|-----------|--------|------|-----|-----|
| Mobile usability | 30% | 7/10 | 6/10 | 10/10 |
| Information density | 15% | 5/10 | 9/10 | 6/10 |
| Speed to complete task | 25% | 9/10 | 7/10 | 8/10 |
| Learnability (new users) | 15% | 8/10 | 7/10 | 9/10 |
| Scalability (future features) | 15% | 6/10 | 9/10 | 7/10 |
| **Weighted Total** | 100% | **7.5** | **7.4** | **8.4** |

---

## Cherry-Pick Recommendations

These are the patterns worth adopting in the unified design:

1. **Maya's Login Layout** — Centered card with generous whitespace. Clean, focused, proven pattern.
2. **Mo's Touch Targets** — 48px minimum button height, generous spacing between interactive elements.
3. **Dan's Switcher Info Density** — Show verification badge text + last-active timestamp in dropdown.
4. **Mo's Bottom Sheet (Mobile)** — Use bottom sheet for account switcher on mobile, dropdown on desktop.
5. **Maya's Rate Limit Banner** — Thin, unobtrusive, auto-dismiss. Rate limiting is temporary, not alarming.
6. **Dan's Session Warning** — Pre-expiry modal warning is genuinely useful — prevents surprise logouts.
7. **Mo's Error Visibility** — Large touch targets on retry buttons, impossible to miss on mobile.
8. **Dan's Error Details** — Expandable error details for technical users / API consumers.
