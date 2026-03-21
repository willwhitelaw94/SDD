---
title: Design Specification
description: "UX/UI design decisions for Client HCA epic"
---

# Design Specification: Client Home Care Agreement

**Epic Code**: HCA
**Created**: 2026-02-07
**Status**: Draft
**Source**: Figma Walkthrough Video (see [rich-content/analysis.md](./rich-content/analysis.md))

---

## 1. UX Decisions

### User Context

- **Primary User**: Care Partners (staff) and Recipients/Representatives (clients)
- **Device Priority**: Desktop-first, with mobile support for client portal
- **Usage Pattern**: Staff - frequent daily use; Clients - occasional (signing, viewing)

### Navigation & Information Architecture

**Location**: Profile section of Package view

**Tab Structure**:
```
Client Details | Care Circle | Agreements and fees
```

**Content Organization**:
- HCA and variations grouped together (not separate sections)
- "Other Agreements" section for supplier contracts (TPC, ATHM, etc.)

### Task Flow

**Happy Path (Staff sending for signature)**:
1. View HCA in Sample state
2. Click "Convert to Sign"
3. Select signature collection method
4. For digital: Send email to client → Wait for signature
5. Agreement transitions to Signed

**Happy Path (Client signing)**:
1. Receive email with magic link
2. Login to portal → Redirected to agreement
3. Review PDF document
4. Check consent box
5. Click "Sign Agreement"
6. Success confirmation

### Interaction Model

- **Feedback Style**: Optimistic for simple actions, wait-for-server for signature
- **Validation**: Inline validation on forms
- **State Transitions**: Visual badges update immediately

---

## 2. UI Decisions

### Agreement States (Terminology)

| Design Term | Spec Term | Badge Color | Description |
|-------------|-----------|-------------|-------------|
| **Sample** | Draft | Gray | Pre-meeting, watermarked, non-offer |
| **Pending** | Sent | Yellow/Orange | Awaiting signature |
| **Signed** | Signed | Green | Consent captured |

### Page Layout

**Agreement Detail View**: Split panel layout
- Left: PDF viewer (60% width)
- Right: Context/action panel (40% width)

### Component Inventory

#### Existing Components (from Storybook)

| Component | Usage | Props/Variants |
|-----------|-------|----------------|
| CommonTable | Agreement list | Sortable, filterable |
| CommonBadge | Status badges | Sample/Pending/Signed variants |
| CommonCard | Agreement summary | With header slot |
| CommonModal | Confirmation dialogs | Size: medium |
| CommonTabs | Overview/History tabs | Default variant |
| CommonButton | Actions | Primary/Secondary |
| CommonSelectMenu | Signature method dropdown | With description |
| CommonDatePicker | Date fields | Default |
| CommonForm | Consent forms | With validation |

#### New Components Required

| Component | Purpose | Similar To |
|-----------|---------|------------|
| PdfViewer | Display agreement PDFs | react-pdf wrapper |
| SignaturePanel | Signature capture | Custom |
| StatusTimeline | History tab | Activity log pattern |

### States

- **Loading**: Skeleton loader for PDF viewer
- **Empty**: "No agreements yet" with illustration
- **Error**: Inline error messages with retry

### Responsive Behavior

- **Desktop**: Full split panel layout
- **Tablet**: Stacked layout (PDF above, actions below)
- **Mobile**: Separate views (PDF preview, then sign screen)

---

## 3. Screen Specifications

### Home Care Agreement Table

**Columns**:
| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| Document type | 200px | No | e.g., "Home Care Agreement" |
| Parties | 150px | No | e.g., "Trilogy Care" |
| Status | 100px | Yes | Sample/Pending/Signed badge |
| Signed | 120px | Yes | Date or "-" |
| Valid until | 120px | Yes | Expiry date |
| Actions | 80px | No | "View" button |

**Features**:
- Search by document type
- Filter by status (multi-select)

### Agreement Detail - Staff View

**PDF Viewer Features**:
- Zoom in/out (buttons + keyboard)
- Page navigation ("Page 1 of 3")
- Scroll through pages
- Expand to full page view
- Watermark displayed on Sample agreements

**Context Panel - Sample State**:
```
┌─────────────────────────────────┐
│ Client Name         Trilogy Care ID  │
│ Name Surname        JD-123456        │
│                                      │
│ Commencement date   Management option│
│ dd/mm/yyyy          Self-service     │
│                                      │
│ Created date        Sent date        │
│ dd/mm/yyyy          dd/mm/yyyy       │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ Signature collection method  ▼ │   │
│ │ Digital signature from client  │   │
│ └────────────────────────────────┘   │
│                                      │
│ [ Convert to Sign ]                  │
└─────────────────────────────────────┘
```

### Signature Collection Methods

#### Digital Signature Flow

**Step 1: Send Request**
```
┌─────────────────────────────────┐
│ 📧 Re-invite to portal          │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Send signature request      │ │
│ │ An email will be sent...    │ │
│ │                             │ │
│ │ [ SEND EMAIL TO CLIENT → ]  │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Step 2: Awaiting Signature**
```
┌─────────────────────────────────┐
│ ✓ Signature request sent        │
│                                 │
│ Email sent to name@email.com    │
│ 02/12/2025 at 14:23             │
│ Awaiting client signature       │
│                                 │
│ [ RESEND LINK ]                 │
└─────────────────────────────────┘
```

#### Signed Document Upload

**Fields**:
- Signed date* (date picker)
- Signed document* (file upload - accepts PDF)
- Uploaded by (auto-filled with current user)

#### Verbal Consent

**Fields**:
- Signed date* (date picker)
- Call ID* (text input - from Aircall)
- Full recording URL (text input - link to recording)
- Consent transcript (textarea - optional)
- Captured by (auto-filled with current user)

### Completed Agreement View

**Overview Tab**:
- Document details (type, parties, dates)
- Signed document with download button
- "Terminate Package" action (destructive)

**History Tab**:
```
┌─────────────────────────────────────────┐
│ Overview    History                     │
├─────────────────────────────────────────┤
│ ✓ November 25, 2025, 10:00 AM           │
│   Signed document uploaded              │
│   👤 Deepika Radhakrishnan              │
│                                         │
│ ✓ November 19, 2025, 10:00 AM           │
│   Sent to client                        │
│   ✉️ name@mailaddress.com.au            │
│   👤 Deepika Radhakrishnan              │
│                                         │
│ ✓ November 25, 2025, 10:00 AM           │
│   Home Care Agreement Sample created    │
│   👤 Deepika Radhakrishnan              │
└─────────────────────────────────────────┘
```

### Annual Review Alerts

**Visual Indicators**:
| Days Until | Color | Icon | Style |
|------------|-------|------|-------|
| 30 days | Blue/Gray | ℹ️ | Informational |
| 7 days | Yellow | ⚠️ | Warning |
| 1 day | Red | 🚨 | Critical |

**Banner Format**:
```
⚠️ Home Care Agreement - Annual review due in 7 days
```

### Client Portal - Dashboard

**Alert Banner**:
```
┌─────────────────────────────────────────┐
│ 🔴 Please sign your Home Care Agreement │
│    Click view to view your agreement    │
│    and sign it to begin...              │
│    [ READ NOW ]                         │
└─────────────────────────────────────────┘
```

### Client Portal - Signing View

**Layout**: Split view (same as staff)

**Signing Panel**:
```
┌─────────────────────────────────────────┐
│ Sign your Home Care Agreement           │
│                                         │
│ You are signing as:                     │
│ Beth Findingy                           │
│                                         │
│ By signing this document, you confirm:  │
│ • You have read and understood...       │
│ • You agree to the terms...             │
│ • All information provided is accurate  │
│                                         │
│ ☐ I confirm that I have read and agree  │
│   to the terms of the Home Care         │
│   Agreement, and I consent to signing   │
│   it electronically                     │
│                                         │
│ [ SIGN AGREEMENT ]   [ DECLINE ]        │
└─────────────────────────────────────────┘
```

### Client Portal - Mobile View

**Agreements List**:
- Card-based layout
- Tap to expand/view
- Sign action at bottom of expanded view

---

## 4. Keyframe Reference

| Screen | Timestamp | Keyframe |
|--------|-----------|----------|
| Agreement Table View | 00:44 | [keyframe_0001](./rich-content/keyframes/keyframe_0001_00-44-233.png) |
| Sample Agreement with Watermark | 01:12 | [keyframe_0003](./rich-content/keyframes/keyframe_0003_01-12-366.png) |
| Convert to Sign | 01:36 | [keyframe_0010](./rich-content/keyframes/keyframe_0010_01-36-566.png) |
| Verbal Consent Fields | 01:50 | [keyframe_0017](./rich-content/keyframes/keyframe_0017_01-50-433.png) |
| Signed Document Upload | 02:11 | [keyframe_0020](./rich-content/keyframes/keyframe_0020_02-11-133.png) |
| Digital Signature - Send Email | 02:35 | [keyframe_0050](./rich-content/keyframes/keyframe_0050_02-35-866.png) |
| Completed State - Overview | 03:16 | [keyframe_0070](./rich-content/keyframes/keyframe_0070_03-16-400.png) |
| History Tab | 03:37 | [keyframe_0079](./rich-content/keyframes/keyframe_0079_03-37-400.png) |
| Annual Review Alert | 04:04 | [keyframe_0100](./rich-content/keyframes/keyframe_0100_04-04-133.png) |
| Client Portal - Sign Agreement | 04:56 | [keyframe_0125](./rich-content/keyframes/keyframe_0125_04-56-933.png) |
| Client Dashboard Alert | 06:01 | [keyframe_0149](./rich-content/keyframes/keyframe_0149_06-01-566.png) |
| Mobile View | 06:12 | [keyframe_0160](./rich-content/keyframes/keyframe_0160_06-12-133.png) |

---

## 5. Open Design Questions

1. **Decline Button**: Is the "Decline" button necessary on client signing view?
   - Pro: Triggers explicit follow-up if client disagrees
   - Con: May encourage declining vs. contacting for clarification

2. **Consent Transcript**: Is the transcript field necessary for verbal consent?
   - Currently optional but included in design
   - Call recording URL may be sufficient for audit

---

## 6. Approval

- [ ] UX decisions approved
- [ ] UI decisions approved
- [ ] Ready for implementation
