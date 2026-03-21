# Home Care Agreement Design Walkthrough

This document provides a step-by-step walkthrough of the Home Care Agreement feature design, including signature capture functionality.

---

## Overview

The Home Care Agreement feature enables clients to view, review, and sign their home care agreements directly through the portal. It supports three signature collection methods: verbal signature, document upload, and digital signature.

**Pre-requisites (Sales Flow):**
1. Sales team converts lead to consumer
2. Sales sends out push form
3. Sales sends out sample agreement
4. Sample agreement appears in portal for client

---

## 1. Portal Navigation & Architecture

Under the client's package profile, a new **Agreements and Fees** tab is added alongside Client Details and Care Circle.

![Portal Navigation](keyframes/keyframe_0002_00-46-133.png)

The agreements section displays all agreements organized by category (Home Care Agreement, Supplier Agreements, etc.), with variations grouped under their respective categories rather than in separate sections.

---

## 2. Agreements Table View

The agreements table provides a comprehensive overview of all agreements with the following columns:
- **Parties** - Organizations involved (Trilogy Care for HCA, suppliers for other agreements)
- **Created Date** - When the agreement was created
- **Status** - Sample, Pending (awaiting signature), or Signed
- **Signed Date** - When the agreement was signed
- **Valid Until** - Expiration date of the agreement

![Agreements Table](keyframes/keyframe_0003_01-12-366.png)

Users can filter and search agreements by status, useful when managing many agreements.

---

## 3. Sample Agreement Preview

Clicking **View** on a sample agreement opens the document preview with a watermark indicating it's a sample.

![Sample Agreement Preview](keyframes/keyframe_0005_01-13-433.png)

**Document Viewer Features:**
- Zoom in/out
- Page navigation (click between pages or scroll)
- Full-page expansion view
- Download capability

The **Convert to Sign** button initiates the signature capture process when ready.

---

## 4. Signature Collection Panel

When converting to sign, a panel opens on the right side showing:
- Main agreement contents summary
- Signature collection method selection

![Convert to Sign Panel](keyframes/keyframe_0011_01-37-400.png)

Three signature methods are available:
1. **Verbal Signature** - For capturing consent during a meeting/call
2. **Signed Document** - For uploading a physically signed document
3. **Digital Signature from Client** - For sending a digital signing request

---

## 5. Verbal Signature Collection

Select **Verbal Signature** when capturing consent during a call or meeting.

![Verbal Signature Form](keyframes/keyframe_0017_01-50-433.png)

**Required Fields:**
- **Signed Date** - The meeting/call date
- **Call ID** - Reference ID from the call system
- **Full Recording URL** - Link to the Aircall recording
- **Consent Transcript** - Copy/paste of the transcript section containing verbal consent (optional but recommended)
- **Captured By** - Staff member who captured the consent

---

## 6. Signed Document Upload

Select **Signed Document** to upload a physically signed agreement.

![Document Upload Form](keyframes/keyframe_0024_02-13-400.png)

**Required Fields:**
- **Signed Date** - Date the document was signed
- **Document Upload** - The signed PDF/image file
- **Uploaded By** - Staff member uploading the document

After submission, a confirmation modal appears and navigates to the completed state.

![Upload Confirmation](keyframes/keyframe_0033_02-19-533.png)

---

## 7. Digital Signature Request

Select **Digital Signature from Client** to send an electronic signing request.

![Digital Signature Option](keyframes/keyframe_0044_02-27-599.png)

When selected:
- The Submit button is replaced with a **Send Email to Client** button
- Clicking this triggers an email to the client with a portal signing link

![Send Email Card](keyframes/keyframe_0047_02-29-933.png)

After sending, the card updates to a **Pending** state showing:
- Request sent status
- Sent by (staff member)
- Sent time
- Awaiting signature indicator
- **Resend Link** option if client claims they didn't receive it

![Pending Signature State](keyframes/keyframe_0051_02-41-966.png)

---

## 8. Completed State - Document Upload

After a signed document is uploaded and submitted, the completed view shows:

![Completed Document Upload](keyframes/keyframe_0065_03-06-033.png)

**Features:**
- Full document overview
- Download option
- Uploaded by information
- **Terminate** option if needed
- **History** tab showing timeline of events

### History View

![Agreement History](keyframes/keyframe_0070_03-16-400.png)

The history tab displays:
- When sample was created
- When it was sent
- When it was signed
- Any variations/amendments to the agreement

---

## 9. Completed State - Verbal Signature

For verbal signatures, the completed view shows:

![Completed Verbal Signature](keyframes/keyframe_0076_03-29-733.png)

**Displayed Information:**
- Recording URL link
- Consent transcript
- Captured by details
- Full history timeline

---

## 10. Completed State - Digital Signature

For digital signatures, the completed view shows:

![Completed Digital Signature](keyframes/keyframe_0081_03-39-199.png)

**Displayed Information:**
- Checkboxes that were selected by client
- Date completed
- History timeline

---

## 11. Expiry & Termination Alerts

The system provides visual alerts for agreement expiration:

![Expiry Alerts](keyframes/keyframe_0097_03-59-166.png)

**Alert Colors:**
- **Blue (Informational)** - 30+ days until expiry
- **Yellow (Warning)** - 7 days until expiry
- **Red (High Attention)** - 1 day or urgent

The **Valid Until** column displays days remaining until document expiration.

### Agreement Status Overview

![Status Overview](keyframes/keyframe_0101_04-04-633.png)

Table shows all different statuses at a glance: Sample, Pending, and Signed.

---

## 12. Client-Side Experience

### Email Notification Flow

When a digital signature request is sent, the client receives an email with a link.

![Client Login](keyframes/keyframe_0110_04-22-199.png)

Clicking the link directs the client to the portal login, then straight to the relevant agreement.

### Client Signing Interface

![Client Signing View](keyframes/keyframe_0117_04-32-433.png)

The client sees:
- Their name (who they're signing as)
- Agreement document preview
- Consent checkbox explaining what signing means
- **Sign Agreement** button (enabled after checking consent)
- **Decline** button (optional - triggers follow-up workflow)

### Signing Confirmation

![Signing Confirmation](keyframes/keyframe_0125_04-56-933.png)

After signing, a confirmation modal appears and navigates back to the agreements table.

---

## 13. Mobile View

The feature is fully responsive and will be available in the native app.

### Mobile Agreement View

![Mobile Agreement View](keyframes/keyframe_0131_05-20-699.png)

**Mobile Features:**
- **View Your Agreements** button
- Scrollable document preview
- Sign section below the preview (separated to avoid clutter)

### Mobile Document Preview

![Mobile Document Preview](keyframes/keyframe_0135_05-23-500.png)

Clients can scroll through the document, exit preview, and sign below.

### Mobile Table View

![Mobile Table View](keyframes/keyframe_0140_05-29-233.png)

The agreements table is optimized for mobile with:
- Expandable agreement categories
- Individual agreements listed below each category

---

## 14. Dashboard Alerts

If a client logs in without using the email link, they see an alert on their dashboard.

![Dashboard Alert](keyframes/keyframe_0147_05-50-300.png)

The alert says **"Please sign your home care agreement"** and links directly to the signing page.

---

## 15. Client Self-Navigation

Clients can also access agreements through the navigation menu:

![Client Navigation](keyframes/keyframe_0149_06-01-566.png)

1. Click dropdown on their name
2. Select **Agreement and Fees**
3. View agreements table
4. Click **View** on any agreement

### Sample Agreement (Client View)

![Client Sample View](keyframes/keyframe_0163_06-19-100.png)

For sample agreements (not yet ready for signing), clients can only:
- Preview the document
- Download the document

They cannot sign until the agreement is converted to signing mode by staff.

---

## Summary

| Feature | Description |
|---------|-------------|
| **Portal Location** | Profile > Agreements and Fees |
| **Agreement Statuses** | Sample, Pending, Signed |
| **Signature Methods** | Verbal, Document Upload, Digital |
| **History Tracking** | Full timeline of all agreement events |
| **Expiry Alerts** | Color-coded (30 days, 7 days, 1 day) |
| **Mobile Support** | Fully responsive, native app ready |
| **Client Access** | Email link or dashboard alert |

---

*Generated from video feedback analysis: Home Care Agreement Design and Signature Capture Overview.mp4*
