---
title: "User Stories: Budget Reloaded (TP-2501)"
---


Extracted from: TC-Budgets V2 Meeting Actions AND Data feedback (4 Nov 2025)

---

## 1. Supplier & Rate Card Integration

### US-001: Support item-based rate cards (quantity/price model)
**Impact:** 🔴 I can't do my job without this
**Sub-Epic:** TP-2504 (Development)
**Priority:** P0

**User Story:**
As a care coordinator, I need to add budget items like falls alarms, nutritional powder, and equipment using quantity + price model (not hours + rate), so that I can allocate non-hourly services correctly.

**Acceptance Criteria:**
- [ ] Budget item creation supports "Item" service type with quantity/price fields
- [ ] Rate card section exists for item-based services separate from hourly services
- [ ] Can specify unit price and quantity
- [ ] Calculations correctly multiply quantity × unit price
- [ ] UI clearly distinguishes item-based vs hourly service planning

**Feedback Source:** "Budget items like falls alarm, nutritional powder, items etc. needs its own rate card section where its quantity and price rather than only hours and rate."

---

### US-002: Expand frequency options for maintenance services
**Impact:** 🟠 I can find a workaround
**Sub-Epic:** TP-2503 (Design) / TP-2504 (Development)
**Priority:** P1

**User Story:**
As a care coordinator, I need frequency options beyond weekly/fortnightly/monthly (specifically: 3-weekly, 6-weekly, 8-weekly, 13-weekly, biannual, annual), so that I can accurately plan maintenance services that don't fit standard patterns.

**Acceptance Criteria:**
- [ ] Frequency dropdown includes: weekly, fortnightly, 3-weekly, 4-weekly (monthly), 6-weekly, 8-weekly, 13-weekly, biannual, annual
- [ ] Frequency options available for all applicable service types
- [ ] Form validates correctly with all frequency options
- [ ] Calculations (4-weekly totals) work correctly with all frequencies

**Feedback Source:** "Frequency on services like home maintenance need more frequencies than weekly, f/n, mth, as required. (it needs 3, 6, 8, 13 weekly, biannual, and annual)"

---

### US-003: Add "requires falls alarm" option to needs section
**Impact:** 🟠 I can find a workaround
**Sub-Epic:** TP-2503 (Design) / TP-2504 (Development)
**Priority:** P1

**User Story:**
As a care coordinator, I need a "requires falls alarm" option in the needs dropdown (not just available when already accessing it), so that I can record fall intervention needs upfront.

**Acceptance Criteria:**
- [ ] "Requires falls alarm" appears as a selectable option in the needs dropdown
- [ ] Works independently (not dependent on existing falls alarm access)
- [ ] Can be toggled on/off during budget creation
- [ ] Syncs to care plan correctly

**Feedback Source:** "No option for requires falls alarm, only if they are already accessing it (drop down menu needs section)"

---

## 2. Exception-Based Funding Defaults

### US-004: Funding stream allocation priority logic
**Impact:** 🟠 I can find a workaround
**Sub-Epic:** TP-2502 (Discovery) / TP-2504 (Development)
**Priority:** P0

**User Story:**
As a care coordinator, I need budgets to allocate to quarterly funding first, then unspent funds (when both are selected), so that funding allocation follows the correct priority and doesn't create glitches requiring re-selection.

**Acceptance Criteria:**
- [ ] When both quarterly and unspent funds are selected, quarterly funds allocated first
- [ ] Unspent funds only allocated after quarterly budget exhausted
- [ ] No need to unselect/reselect unspent to fix allocation order
- [ ] Allocation order visible and confirmed before submit
- [ ] Tested with hybrid funding scenarios

**Feedback Source:** "Budgets using unspent funds instead of using up quarterly budget first when both funding streams selected, is this a glitch? If I unselect unspent, save, reselect unspent it fixes it"

---

### US-005: Quarterly vs total planned view toggle
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2502 (Discovery) / TP-2504 (Development)
**Priority:** P1

**User Story:**
As a care coordinator, I need to toggle between "total planned" and "planned this quarter" for unspent funds display, so that I can focus on quarterly budget planning without seeing multi-quarter totals.

**Acceptance Criteria:**
- [ ] Toggle switch visible on budget page
- [ ] "Total planned" shows cumulative across all quarters
- [ ] "Planned this quarter" shows only current quarter allocation
- [ ] Toggle state persists for user session
- [ ] Correctly updates when changing date range

**Feedback Source:** "Has there been any update on Unspent Funds only showing from the quarter we are planning in? Would it at least be possible to add a toggle to switch from 'total planned' to 'planned this quarter'?"

---

### US-006: Add "Every 3 weeks" frequency option
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2503 (Design) / TP-2504 (Development)
**Priority:** P2

**User Story:**
As a care coordinator, I need a "every 3 weeks" frequency option, so that I can accommodate coordinator requests for non-standard frequencies.

**Acceptance Criteria:**
- [ ] "Every 3 weeks" appears in frequency dropdown
- [ ] 4-weekly total calculated correctly
- [ ] Saves and persists correctly

**Feedback Source:** "Can we add every three week in the options, as i have had a few client ask for this option."

---

## 3. Prominent Coordination Display

### US-007: Display total coordination fee for period
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2504 (Development)
**Priority:** P2

**User Story:**
As a care coordinator, I need a field showing total coordination fee for the period, so that I can see at a glance how much coordination cost is budgeted.

**Acceptance Criteria:**
- [ ] New field "Total Coordination Fee" displays on budget page
- [ ] Automatically calculates sum of all coordination fees for the period
- [ ] Updates when coordination services are added/removed
- [ ] Formatted as currency

**Feedback Source:** "Can you add a field in the Portal which shows the "Total Coordination fee" for the period."

---

### US-008: Suppress supplementary budget fields by default
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2503 (Design)
**Priority:** P2

**User Story:**
As a care coordinator, I need supplementary/extra budget fields to appear on care plan by default (not require clicking dropdown), so that I can see all planned services without extra navigation.

**Acceptance Criteria:**
- [ ] Supplements section visible on initial load (not collapsed)
- [ ] Can still collapse if desired
- [ ] Shows summary of supplements in collapsed state
- [ ] Clearly labeled as "Supplements" or "Additional Services"

**Feedback Source:** "Supplements don't show on service plan page" + "Following up... can we have a summary similar to the old budget screen instead of having to click the dropdown bar"

---

## 4. Human-Readable Funding Context

### US-009: Clarify funding stream eligibility per service
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2503 (Design)
**Priority:** P2

**User Story:**
As a care coordinator, I need UI clarity about which funding streams each service CAN and CANNOT be assigned to, so that I understand eligibility rules upfront.

**Acceptance Criteria:**
- [ ] Service type shows allowed funding stream(s) or funding stream restrictions
- [ ] Tooltips or help text explain why certain streams aren't available
- [ ] Error message if trying to assign to ineligible stream is explanatory
- [ ] Tested with all service types

**Feedback Source:** "UI could be more explanatory about which funding stream different services CAN and CANNOT be assigned to"

---

### US-010: Fix supplement visibility on service plan
**Impact:** 🟠 I can find a workaround
**Sub-Epic:** TP-2504 (Development)
**Priority:** P1

**User Story:**
As a care coordinator, I need supplements to show on the service plan page, so that I can verify all allocated services before submission.

**Acceptance Criteria:**
- [ ] Supplements section appears on service plan page
- [ ] All selected supplements listed with quantities/details
- [ ] Clearly distinguished from primary services
- [ ] Visible in both draft and submitted states

**Feedback Source:** "Supplements don't show on service plan page - Could you please advise where I can check if the client has a supplement included under the new budget?"

---

## 5. Unified UI & Workflow Patterns

### US-011: Batch save budget amendments
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2503 (Design) / TP-2504 (Development)
**Priority:** P1

**User Story:**
As a care coordinator, I need to save all budget amendments in one action (not individual saves), so that I can edit multiple services efficiently without waiting for each to load.

**Acceptance Criteria:**
- [ ] Single "Save All" button at top-right or bottom of form (like "Submit")
- [ ] All pending changes saved in one request
- [ ] Loading occurs once after all changes submitted
- [ ] Success confirmation shows all changes saved
- [ ] Validation occurs for all fields before save

**Feedback Source:** "Having to save each budget amendments individually and having to wait for them to load one after another can be a bit counterproductive... Can we have one save button... would save a lot more time."

---

### US-012: Rename duplicate action to "Edit"
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2503 (Design)
**Priority:** P2

**User Story:**
As a care coordinator, I need the action to edit a submitted plan called "Edit" (not "Duplicate"), so that the UI is intuitive for making changes.

**Acceptance Criteria:**
- [ ] Button/menu item labeled "Edit" instead of "Duplicate"
- [ ] Maintains same functionality (creates new version for editing)
- [ ] Help text clarifies that editing submitted plans creates a new revision

**Feedback Source:** "UI is not intuitive to knowing that you need to duplicate a plan to make any edits to a submitted plan. Edit is the expected terminology"

---

### US-013: Minimalist SAH budget screen design
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2503 (Design)
**Priority:** P2

**User Story:**
As a care coordinator, I need the SAH budget screen to load faster with a minimalist design, so that switching between old and new budget screens isn't slow.

**Acceptance Criteria:**
- [ ] Page load time < 2 seconds for typical budget (benchmark: measure baseline first)
- [ ] Minimized visual clutter (remove non-essential elements initially visible)
- [ ] Summary view on hover; details expand on click (not all visible by default)
- [ ] Performance tested on standard laptop hardware

**Feedback Source:** "Is there a way that we can make the new SAH budget screen more 'minimalist'; I would think this could make the transitions/loading up of the new budget quicker"

---

### US-014: Summary view similar to old budget interface
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2503 (Design)
**Priority:** P2

**User Story:**
As a care coordinator, I need a summary view (like the old budget) shown on hover, with detailed breakdown only on dropdown click, so that I can quickly scan budgets without opening full details.

**Acceptance Criteria:**
- [ ] Hovering over budget line shows summary (Frequency, Units, Rates, 4-weekly Total)
- [ ] Click dropdown to expand full details (planned/projected spend)
- [ ] Faster rendering with lazy-loaded detail sections
- [ ] Works on both desktop and laptop

**Feedback Source:** "Maybe switching it up and present the summary of the budget (when we hover over the budget line) and only show the entire budget details inc. planned/projected to spend when we click the drop down bar."

---

### US-015: Budget change visibility/comparison
**Impact:** 🟠 I can find a workaround
**Sub-Epic:** TP-2503 (Design)
**Priority:** P1

**User Story:**
As a care coordinator receiving a budget change, I need to see what changed (not just the new version), so that I can approve or reject changes confidently.

**Acceptance Criteria:**
- [ ] When CO submits budget change, "View Changes" or "Compare" option available
- [ ] Shows side-by-side diff of old vs new (or highlights changed fields)
- [ ] Clearly indicates which line items changed
- [ ] Approve/Reject buttons appear after reviewing changes

**Feedback Source:** "When CO sent a budget change, I don't see what has been changed and not sure what to approve... as before, I could easily see the change request and reject or approve straight away"

---

### US-016: Fix form validation inconsistency (required field marking)
**Impact:** 🟠 I can find a workaround
**Sub-Epic:** TP-2503 (Design) / TP-2504 (Development)
**Priority:** P1

**User Story:**
As a care coordinator, I need form validation to be consistent (fields with * required, without * optional), so that I don't save incomplete forms and get errors.

**Acceptance Criteria:**
- [ ] All required fields marked with *
- [ ] All optional fields NOT marked with *
- [ ] Server-side validation rejects saves with missing required fields
- [ ] Error message specifies which required fields are missing
- [ ] Tested across all budget forms

**Feedback Source:** "Fields with * are able to be saved without being filled, then details with no * on the text box is required to be filled (description in needs)"

---

### US-017: Auto-expand needs field by default
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2503 (Design)
**Priority:** P2

**User Story:**
As a care coordinator, I need the needs field to appear by default with a checkbox to uncheck if not needed (not hidden by default), so that I don't miss recording important care needs.

**Acceptance Criteria:**
- [ ] Needs section visible on initial page load
- [ ] Checkbox "Include in care plan" checked by default
- [ ] Can uncheck to exclude from care plan
- [ ] Helps prevent missed data entry

**Feedback Source:** "It would be good if it automatically had the needs entry show up on care plan and have a tick box if you don't want it, rather than vice versa."

---

### US-018: Display screen unblurred on laptop
**Impact:** 🟠 I can find a workaround
**Sub-Epic:** TP-2504 (Development)
**Priority:** P1

**User Story:**
As a care coordinator, I need the budget screen to render clearly on laptop without blur, so that I can read and edit budgets properly.

**Acceptance Criteria:**
- [ ] No blur/rendering issues on standard laptop resolutions (1920x1080, 1366x768)
- [ ] Text clarity verified at 100% and 125% zoom
- [ ] Tested on Chrome, Firefox, Safari, Edge
- [ ] Performance acceptable on older laptops

**Feedback Source:** "Coordinators raising that screen is blurred on laptop"

---

## 6. Enhanced Notifications & Export

### US-019: Outlook email tagging add-in
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2506 (Release) or separate future epic
**Priority:** P2

**User Story:**
As a care team member, I need an Outlook add-in that intercepts send and prompts me to tag emails before sending, so that all budget-related emails are categorized correctly.

**Acceptance Criteria:**
- [ ] Event-based Outlook add-in listens for Send button
- [ ] Custom popup appears with tag dropdown
- [ ] Cannot send email until tag selected
- [ ] Tags stored in email metadata
- [ ] Works with Outlook desktop and web versions

**Technical Approach:**
1. Intercept Send event via Office.js
2. Open custom task pane popup
3. Display dropdown with available tagging options
4. Block send until selection made
5. Store tag in email custom properties

**Feedback Source:** "Create an event-based add in for Outlook: 1. Run a code when the user clicks send 2. open a custom pop-up for tagging 3. Block the send until the tagging is complete"

---

### US-020: Service plan sent email template
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** TP-2504 (Development)
**Priority:** P1

**User Story:**
As a care coordinator, I need configurable email templates for service plan notifications, so that clients receive consistent, branded communication about their budgets.

**Acceptance Criteria:**
- [ ] Template variables: [ClientName], [ServicePlanDate], [CoordinatorName], [ContactInfo]
- [ ] Admin can customize template text and formatting
- [ ] Draft and live versions available
- [ ] Tested with bulk send tool

**Feedback Source:** "Provide service plan sent email template to Tim" (Action: Romy to create post-Nov 1 template)

---

## 7. Clinical/Care Plan Integration (Out of scope for Budget Reloaded, but referenced)

### US-021: Include care coordinator name in "Service Plans" inbox
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** Future epic (beyond TP-2501)
**Priority:** P3

**User Story:**
As a clinical team member, I need to see the care coordinator name in the Service Plans inbox, so that I know who to contact about budget changes.

**Feedback Source:** "Can we include the CR name in the 'Service Plans' Inbox?"

---

### US-022: Change service plan PDF language to "planned with you"
**Impact:** 🟠 I can find a workaround
**Sub-Epic:** TP-2504 (Development)
**Priority:** P2

**User Story:**
As a client receiving a service plan PDF, I need the language to reflect collaborative planning ("planned with you") instead of paternalistic ("planned for you"), so that I feel heard in the planning process.

**Acceptance Criteria:**
- [ ] PDF template updated: "A list of services planned for you" → "A list of services planned with you"
- [ ] Language updated consistently across all service plan sections
- [ ] Tested in generated PDF output

**Feedback Source:** "Can we change this to 'planned with you' to reflect the collaborative process and requirements"

---

### US-023: Mandatory action plan for all risks
**Impact:** 🔴 I can't do my job without this
**Sub-Epic:** Future epic (clinical care plan redesign)
**Priority:** P3

**User Story:**
As a clinical coordinator, I need all risks to have mandatory action plan sections (not just yes/no), so that I can document how we're addressing identified risks.

**Feedback Source:** "Not all risks have a action plan section that is mandatory, when it should be... We always used to have details and action plans in place. Now we don't."

---

### US-024: Add EPOA and AHD recording fields
**Impact:** 🔴 I can't do my job without this
**Sub-Epic:** Future epic (clinical care plan redesign)
**Priority:** P3

**User Story:**
As a clinical coordinator, I need clear fields for recording EPOA and AHD documents, so that I can track legal authority without searching through supplemental data.

**Feedback Source:** "EPOA and AHD does not have a clear spot to be recorded. This is sometimes placed under the overview in the portal care plan and is exclusively recorded using the current onboarding questionnaire"

---

### US-025: Add Country of Birth field
**Impact:** 🟢 Nice to have/fix
**Sub-Epic:** Future epic (client data model)
**Priority:** P3

**User Story:**
As an operations team member managing government reporting, I need a "Country of Birth" field separate from "Nationality", so that we can satisfy end-of-life questionnaire requirements.

**Feedback Source:** "We also need to record Country of Birth for clients in addition to Nationality. This was something that we could not find during a EOL questionnaire from the government."

---

## Triage Summary

| Impact | Count | Examples |
|--------|-------|----------|
| 🔴 Red (Blocker) | 3 | US-001, US-004, US-023 |
| 🟠 Orange (Workaround) | 8 | US-002, US-005, US-010, US-015, US-016, US-018, US-022 |
| 🟢 Green (Polish) | 14 | US-003, US-006, US-007, US-008, US-011-014, US-019-021, US-024-025 |

## Sub-Epic Mapping

| Sub-Epic | Stories |
|----------|---------|
| **TP-2502** (Discovery: 2-4 weeks) | US-004 (Funding logic), US-005 (Quarterly toggle) |
| **TP-2503** (Design: 4-6 weeks) | US-002 (Frequencies), US-003 (Falls alarm), US-008 (Supplements), US-009 (Funding clarity), US-012 (Edit rename), US-013 (Minimalist), US-014 (Summary), US-016 (Validation), US-017 (Needs default) |
| **TP-2504** (Development: 4-8 weeks) | US-001 (Item rate card), US-004 (Funding logic), US-006 (3-week freq), US-007 (Total fee), US-010 (Supplement visibility), US-011 (Batch save), US-015 (Change visibility), US-018 (Screen blur), US-020 (Email template), US-022 (PDF language) |
| **TP-2505** (QA: 2-4 weeks) | All stories as QA work item |
| **TP-2506** (Release: 1-2 weeks) | US-019 (Outlook add-in), deployment tasks |
| **Future Epics** | US-021-025 (clinical/data model beyond scope) |

---

## Next Steps

1. **Validate with team:** Present stories to Romy (Lead PO), Tim (Lead Dev), Beth (UX), Meagan (QA)
2. **Refine acceptance criteria:** Especially for design-heavy stories (US-013, US-014)
3. **Identify dependencies:** US-004 (funding logic) required before US-005 (toggle)
4. **Size stories:** Estimate story points once acceptance criteria approved
5. **Create Jira issues:** One issue per story, tag with sub-epic, assign to owners
6. **Generate PRD:** If detailed requirements doc needed before design phase

**Owner assignments (from TEAM.json + RACI):**
- **Product Lead:** Will (Romy in PO role)
- **Design Lead:** Beth
- **Backend Lead:** Khoa
- **Frontend Lead:** [TBD]
- **QA Lead:** Meagan
