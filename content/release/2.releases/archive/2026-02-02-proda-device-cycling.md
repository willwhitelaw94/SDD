---
title: "PRODA Device Cycling Improvements"
description: "Enhanced UX for cycling PRODA device credentials"
date: 2026-02-02
version: "5.7"
ticket: TP-5824
category: improvement
impact: low
---

# PRODA Device Cycling Improvements

**Released:** 2 February 2026 | **Ticket:** TP-5824 | **Impact:** Low

---

## What's New

The PRODA device cycling workflow has been improved with a cleaner user experience. Staff can now cycle PRODA credentials with clearer feedback and fewer clicks.

### Improved Cycling Flow

The updated workflow includes:
- **Clearer status indicators** - Know exactly where you are in the process
- **Better error messages** - Understand what went wrong if issues occur
- **Confirmation feedback** - Clear success/failure messaging
- **Streamlined UI** - Fewer steps to complete the cycling process

**How it works:**
1. Navigate to PRODA device settings
2. Click "Cycle Device"
3. Follow the streamlined confirmation process
4. Receive clear feedback on completion

**Who benefits:** System Administrators managing PRODA integrations

---

## Why This Matters

### Reduced Confusion

The previous workflow sometimes left users uncertain about:
- Whether the cycling was complete
- What to do if errors occurred
- The current state of the device

### Faster Resolution

When PRODA issues arise:
- Clearer UI means faster troubleshooting
- Better error messages guide next steps
- Reduced support tickets for cycling questions

---

## Technical Notes

<details>
<summary>For developers</summary>

- **Component:** PRODA device management Vue components
- **Changes:** UX improvements only - no API changes
- **Testing:** Updated browser tests for new flow

</details>

---

## Related

- [How-to Guides](/developer-docs/how-to)
