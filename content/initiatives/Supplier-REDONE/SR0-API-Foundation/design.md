---
title: "Design: API Foundation & Two-Tier Auth"
---

**Status:** Draft
**Designer:** Bruce (AI)
**Feature Spec:** [spec.md](/initiatives/supplier-redone/sr0-api-foundation/spec)
**Created:** 2026-03-19
**Last Updated:** 2026-03-19

---

## Overview

SR0 is primarily API infrastructure with minimal user-facing UI. The design scope covers the login/authentication page, the supplier context switcher for multi-supplier organisations, error and rate-limit display patterns, and the auto-generated API documentation page. All UI is built in the new standalone React (Next.js) frontend using Shadcn/ui + Tailwind.

---

## Design Resources

### Figma

| File | Link | Description |
|------|------|-------------|
| Supplier Portal Design System | TBD | Token colours, typography, component primitives for React app |

### Other Resources

| Type | Link | Description |
|------|------|-------------|
| TC Brand Guidelines | Internal | Navy #2C4C79, Teal #007F7E, Green #4DC375, Orange #FF8F51, Red #E04B51 |
| Shadcn/ui | https://ui.shadcn.com | Component library for the React frontend |

---

## User Context

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| **Primary User** | Supplier (Organisation Administrator, Supplier Administrator) | Auth and context switching are supplier-facing |
| **Device Priority** | Mobile-first | Suppliers register and operate from phones; iPhone bugs flagged in meetings |
| **Usage Pattern** | Daily — login is the entry point for every session | High frequency, must be fast and reliable |
| **Information Density** | Spacious-friendly | Login and account switcher are single-purpose screens |

---

## Layout & Structure

### Page Type

- **Login**: Single-page centered form
- **Account Switcher**: Dropdown/popover component within the app shell header
- **API Docs**: Full-page reference (auto-generated from OpenAPI spec)

### Navigation Pattern

Login has no navigation (pre-auth). The account switcher lives in the global header after authentication. API docs use sidebar navigation (generated).

---

## Component Inventory

### Shadcn/ui Components Used

| Component | Usage | Notes |
|-----------|-------|-------|
| `Card` | Login form container | Centered on page with brand header |
| `Input` | Email, password fields | With label and inline validation |
| `Button` | Login action, context switch | Primary = Navy, Ghost for secondary |
| `DropdownMenu` | Account/supplier switcher | In app header |
| `Badge` | Role indicator, verification status | Teal for active, Gray for inactive |
| `Alert` | Error messages, rate limit warnings | Destructive variant for errors |
| `Skeleton` | Loading states during token refresh | Prevents layout shift |

### New Components Needed

- [ ] **SupplierSwitcher** — dropdown showing current supplier context with list of available suppliers. Displays supplier trading name + verification badge. Only visible when user has access to 2+ supplier entities.
- [ ] **RateLimitBanner** — sticky banner that appears when API returns 429, showing remaining time before retry. Uses `Retry-After` header value.

---

## Interaction Design

### Login Flow

| Aspect | Decision | Details |
|--------|----------|---------|
| **Validation** | Inline on blur + submit-time | Email format on blur, credentials on submit |
| **Save Feedback** | Wait-for-server | Show spinner in button, disable form during auth |
| **Error Display** | Inline alert below form | "Invalid credentials" — no field-level for security |
| **Token Storage** | Memory + httpOnly refresh cookie | Access token in memory, refresh in secure cookie |
| **Post-Login Landing** | Last-used supplier entity dashboard | System remembers last active context; first login defaults to first entity alphabetically (CL-002) |

### Supplier Context Switcher

| Aspect | Decision | Details |
|--------|----------|---------|
| **Trigger** | Click on current supplier name in header | Shows dropdown of available suppliers |
| **Switch Action** | API call to update active context | < 1 second target (SC-003) |
| **Feedback** | Optimistic UI with skeleton fallback | Page content shows skeleton while new context loads |
| **Visibility** | Hidden for single-supplier users | Per FR-005 and Story 4, AC3 |

### Rate Limit Display

| Aspect | Decision | Details |
|--------|----------|---------|
| **429 Response** | Sticky banner at top of viewport | Shows countdown from `Retry-After` header |
| **Auto-dismiss** | Yes, when timer expires | Banner disappears and queued requests retry |
| **Colour** | Orange warning | Not red — rate limiting is temporary, not an error |

---

## States

### Loading States

| Context | Treatment | Duration Threshold |
|---------|-----------|-------------------|
| Login submit | Spinner in button, form disabled | Immediate |
| Token refresh | Transparent — no UI change | Background |
| Context switch | Skeleton content area | Immediate |
| API docs page | Full page skeleton | Show after 200ms |

### Empty States

| Context | Message | CTA |
|---------|---------|-----|
| No suppliers (edge case) | "Your account isn't linked to any supplier entities." | "Contact your Organisation Administrator" |
| API docs unavailable | "API documentation is currently unavailable." | Retry button |

### Error States

| Scenario | Handling |
|----------|----------|
| Invalid credentials | Alert below form: "The email or password you entered is incorrect." |
| Account locked/deactivated | Alert: "This account has been deactivated. Contact support." |
| Token refresh fails | Redirect to login with message: "Your session has expired. Please log in again." |
| Rate limited (429) | Orange banner: "Too many requests. Please wait [X] seconds." |
| Network error | Alert: "Unable to connect. Check your internet connection and try again." |
| CORS error | Should not occur in production; dev-only console warning |

---

## Responsive Behavior

### Desktop (1024px+)

```
+--------------------------------------------------+
|              [TC Logo]                            |
|                                                   |
|         +----------------------------+            |
|         |   [TC Logo]                |            |
|         |   Supplier Portal          |            |
|         |                            |            |
|         |   Email                    |            |
|         |   [____________________]   |            |
|         |                            |            |
|         |   Password                 |            |
|         |   [____________________]   |            |
|         |                            |            |
|         |   [ Forgot password? ]     |            |
|         |                            |            |
|         |   [====== Log in ======]   |            |
|         |                            |            |
|         |   Don't have an account?   |            |
|         |   Register here            |            |
|         +----------------------------+            |
|                                                   |
+--------------------------------------------------+
```

- Login card centered, max-width 400px
- Generous whitespace around the card

### Mobile (320-767px)

```
+------------------------+
| [TC Logo]              |
|                        |
| Supplier Portal Login  |
|                        |
| Email                  |
| [____________________] |
|                        |
| Password               |
| [____________________] |
|                        |
| [ Forgot password? ]  |
|                        |
| [===== Log in =====]  |
|                        |
| Don't have an account? |
| Register here          |
+------------------------+
```

- Full-width form with `px-4` padding
- Touch targets 44px minimum
- No card border on mobile — form fills viewport width

### Account Switcher — Desktop Header

```
+---------------------------------------------------------------+
| [TC Logo]   Dashboard   Bills   Documents   |  Acme Pty v |  |
|                                              +-------------+  |
|                                              | ● Acme Pty  |  |
|                                              | ● Beta Ltd  |  |
|                                              | ◐ Gamma Co  |  |
|                                              +-------------+  |
+---------------------------------------------------------------+
```

### Account Switcher — Mobile Header

```
+---------------------------+
| [=] TC Logo    [Acme v]   |
|                +---------+|
|                |● Acme   ||
|                |● Beta   ||
|                |◐ Gamma  ||
|                +---------+|
+---------------------------+
```

- Switcher in top-right of mobile header
- Dropdown aligned to right edge

---

## Accessibility

| Requirement | Implementation |
|-------------|----------------|
| **WCAG Level** | AA |
| **Keyboard Navigation** | Tab through form fields, Enter to submit, Escape to close switcher |
| **Focus Indicators** | Visible focus rings using Shadcn defaults (`:focus-visible`) |
| **Screen Reader** | Login form has `aria-label`, errors use `aria-live="polite"`, switcher announces active supplier |
| **Focus Trapping** | Switcher dropdown traps focus when open |
| **Color Independence** | Errors use icon + text, not just red. Rate limit uses icon + countdown. |

---

## Visual Design

### Colors (TC Brand — React App)

| Usage | Color | Tailwind Class |
|-------|-------|----------------|
| Primary actions | Navy #2C4C79 | `bg-[#2C4C79]` (custom) |
| Accent / active state | Teal #007F7E | `text-[#007F7E]` |
| Success | Green #4DC375 | `text-green-600` / `bg-green-50` |
| Warning (rate limit) | Orange #FF8F51 | `text-orange-600` / `bg-orange-50` |
| Error | Red #E04B51 | `text-red-600` / `bg-red-50` |
| Page background | Gray-50 | `bg-gray-50` |
| Card background | White | `bg-white` |

### Typography

| Element | Style |
|---------|-------|
| Page title (Login heading) | `text-2xl font-bold text-gray-900` |
| Form labels | `text-sm font-medium text-gray-700` |
| Body text | `text-base text-gray-700` |
| Helper/secondary text | `text-sm text-gray-500` |
| Error text | `text-sm text-red-600` |

### Spacing

| Context | Value |
|---------|-------|
| Login card padding | `p-6` (desktop), `px-4 py-6` (mobile) |
| Form field gaps | `space-y-4` |
| Button height | `h-10` (40px) minimum, `h-12` (48px) on mobile |

---

## Wireframes

### Login Page — Error State

```
+----------------------------+
|   Supplier Portal Login    |
|                            |
| +------------------------+ |
| | ! Invalid email or     | |
| |   password.            | |
| +------------------------+ |
|                            |
|   Email                    |
|   [john@example.com_____]  |
|                            |
|   Password                 |
|   [********************_]  |
|                            |
|   [ Forgot password? ]    |
|                            |
|   [====== Log in ======]  |
+----------------------------+
```

**Notes:** Error alert uses Shadcn `Alert` with destructive variant. Appears above form fields so it is visible without scrolling on mobile.

### Rate Limit Banner

```
+---------------------------------------------------------------+
| [!] Too many requests. Please wait 45 seconds.           [x]  |
+---------------------------------------------------------------+
| [TC Logo]   Dashboard   Bills   Documents   | Acme Pty v |    |
|                                                                |
|   ... page content ...                                         |
```

**Notes:** Sticky banner at top of viewport. Orange background (`bg-orange-50 border-orange-200`). Countdown timer updates every second. Dismiss button available but banner auto-removes when timer expires.

### Token Expired Redirect

```
+----------------------------+
|   Supplier Portal Login    |
|                            |
| +------------------------+ |
| | Your session has        | |
| | expired. Please log in  | |
| | again.                  | |
| +------------------------+ |
|                            |
|   Email                    |
|   [____________________]   |
|   ...                      |
+----------------------------+
```

**Notes:** Info-level alert (blue), not error. Session expiry is expected behaviour, not an error condition.

---

## Open Questions

- [x] ~~Should the login page include a "Remember me" checkbox (extends refresh token to 90 days)?~~ **Resolved: No** — see CL-001
- [ ] Should the API documentation page be public or require authentication?
- [x] ~~What branding treatment for the login page — full TC logo, supplier portal sub-brand, or co-branded?~~ **Resolved: TC logo + "Supplier Portal" subtitle** — see CL-003
- [x] ~~Should the context switcher show verification status badges next to each supplier entity name?~~ **Resolved: Yes** — see CL-005

---

## Approval

| Role | Name | Date | Status |
|------|------|------|--------|
| Product Manager | Will Whitelaw | | [ ] Approved |
| Designer | Vishal | | [ ] Approved |
| Developer | | | [ ] Approved |

---

## Next Steps

- [x] ~~Finalise brand treatment for standalone React login page~~ **Resolved via CL-003**
- [ ] Confirm Shadcn/ui theme customisation with TC brand colours
- [ ] `/speckit-plan` — Create technical implementation plan

---

## Clarification Log

### UX Clarifications

**CL-001: Should the login page include a "Remember me" checkbox?**
- **Option A (Recommended): No checkbox** — keep session duration server-controlled (e.g., 30-day refresh token by default). Simpler login form, fewer decisions for the user, avoids explaining token duration.
- Option B: Checkbox that extends refresh token to 90 days.
- Option C: Checkbox with "Keep me signed in" label and tooltip explaining duration.
- **Decision: Option A** — No "Remember me" checkbox. Refresh token duration is a server config concern, not a user-facing choice. Keeps the login form minimal and mobile-friendly.

**CL-002: What happens when a user with access to multiple supplier entities logs in — where do they land?**
- **Option A (Recommended): Land on the last-used supplier entity's dashboard.** System remembers the last active context (per SR2 FR-003). First-time login defaults to the first entity alphabetically.
- Option B: Always land on an organisation-level dashboard showing all entities.
- Option C: Show an explicit "Choose your workspace" interstitial on login.
- **Decision: Option A** — Resume the last-used context. Reduces friction for daily use. The account switcher in the header provides easy context changes when needed.

**CL-003: What branding treatment for the login page?**
- **Option A (Recommended): TC logo + "Supplier Portal" subtitle.** Single logo mark with the product name below it. Clean, branded, no confusion about which portal the user is in.
- Option B: Full Trilogy Care wordmark + "Supplier Portal" in the card header.
- Option C: Co-branded (TC logo + supplier's organisation logo after ABN lookup).
- **Decision: Option A** — TC logo with "Supplier Portal" subtitle. Simple, consistent, no dynamic elements needed. Applied to wireframes.

### UI Clarifications

**CL-004: How should the rate-limit banner coexist with the sticky header on mobile?**
- **Option A (Recommended): Banner pushes content down, sits above the sticky header.** Uses `position: fixed; top: 0` with the header adjusting its top offset while the banner is visible. Auto-dismisses on timer expiry so it is temporary.
- Option B: Banner replaces the header temporarily.
- Option C: Banner appears as a toast notification instead.
- **Decision: Option A** — Fixed banner above the header. It is temporary (auto-dismisses), so the displacement is brief. The countdown gives users clear feedback.

**CL-005: Should the context switcher dropdown show verification status badges next to each supplier entity?**
- **Option A (Recommended): Yes — show a small status dot.** Green dot for verified, amber for pending, no dot for onboarding. Keeps the dropdown compact while giving useful context.
- Option B: No badges — keep the switcher as a simple name list.
- Option C: Full compliance badges (same as SR2 dashboard cards).
- **Decision: Option A** — Small status dot next to each entity name. Gives users quick context without cluttering the dropdown. Applied to account switcher wireframes.
