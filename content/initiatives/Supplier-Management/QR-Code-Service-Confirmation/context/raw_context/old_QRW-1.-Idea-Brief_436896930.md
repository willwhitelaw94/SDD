<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : QRW 1. Idea Brief </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span>, last modified by <span class="editor"> Steven Boge</span> on Oct 02, 2025

</div>

<div id="main-content" class="wiki-content group">

<div class="table-wrap">

<table class="confluenceTable" data-table-width="1066" data-layout="center" data-local-id="054d7b5a-3f48-4b1b-8997-77a751c8dcca">
<tbody>
<tr>
<td class="confluenceTd" data-highlight-colour="#b3d4ff"><p><strong>Section</strong></p></td>
<td class="confluenceTd" data-highlight-colour="#b3d4ff"><p><strong>Details</strong></p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Idea Brief – Title</p></td>
<td class="confluenceTd"><p>QRW 1 (Visit Confirmation via QR Codes)</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Problem Statement</p></td>
<td class="confluenceTd"><p>Trilogy Care has a responsibility not just to organise care for clients, but to make sure that the care is actually delivered. Under the Support at Home program and the Aged Care Rules, providers must maintain accurate records confirming services were delivered before any government funding can be claimed.</p>
<p>Currently, confirmation relies heavily on supplier invoices and manual checks, which are inconsistent and leave gaps in assurance. This creates risks:</p>
<ul>
<li><p>Clients may lose trust</p></li>
<li><p>Services may go unverified</p></li>
<li><p>Trilogy Care may face compliance issues</p></li>
</ul>
<p>A clearer, more reliable way of confirming delivery is essential to safeguard client wellbeing, maintain trust, and meet obligations as a registered provider.</p>
<p>References:</p>
<ul>
<li><p>Support at Home Manual, Section 10.5</p></li>
<li><p>Aged Care Rules 2025:<br />
  – Keep and retain records that allow claims to be verified (s.154-1205)<br />
  – Follow conditions on registration requiring service agreements (s.148-70) and care/service plans (s.148-80)</p></li>
</ul>
<p>Additional compliance needs:</p>
<ul>
<li><p>Cross-reference needs and goals to services delivered</p></li>
<li><p>Identify wellbeing changes/deterioration</p></li>
<li><p>Capture incidents (e.g., broken vase)</p></li>
<li><p>Capture if any health and wellbeing changes occurred</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p>Possible Solution</p></td>
<td class="confluenceTd"><p>A lightweight, QR-based Visit Confirmation module:</p>
<ul>
<li><p>Each recipient gets a client-specific QR (printed on care plan and optionally fridge magnet)</p></li>
<li><p>Worker scans QR on arrival and departure to open a mobile page unique to that recipient</p></li>
<li><p>Worker enters details (name, supplier ID), selects booking ID, ticks confirmation box (“I have attended”), and submits</p></li>
<li><p>System validates recipient ↔︎ booking linkage and time window, stores an auditable record, and optionally updates booking status</p></li>
</ul>
<p>Other solution elements:</p>
<ul>
<li><p>Capture photo evidence of service delivery</p></li>
<li><p>Geolocation of service provider</p></li>
<li><p>Provider questionnaire: general wellbeing and service-specific wellbeing</p></li>
<li><p>Voice case notes (multi-language)</p></li>
<li><p>AI review of notes to extract important information</p></li>
</ul>
<p>Technical scope:</p>
<ul>
<li><p>Mobile web page (PWA-capable)</p></li>
<li><p>Backend endpoints, validations, and audit store</p></li>
<li><p>QR slug generator and asset pack for care plan + magnet</p></li>
<li><p>Basic admin views: visit log, exceptions, export</p></li>
<li><p>Optional toggles: GPS capture, client PIN, auto-set booking “Arrived”</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p>Benefits</p></td>
<td class="confluenceTd"><ul>
<li><p>Operational certainty: Verifiable “I was there” signals tied to bookings</p></li>
<li><p>Reduced disputes &amp; leakage: Fewer timesheet/admin disputes; lower risk of over-claiming</p></li>
<li><p>Faster claiming: Clean data for finance and compliance</p></li>
<li><p>Low friction for workforce: No login; ~10–20 seconds per check-in</p></li>
<li><p>Rapid rollout: QR issued at onboarding and embedded in care plan PDFs</p></li>
<li><p>Security by design: Scoping, time-window checks, duplicate detection, optional PIN, revocable QR slugs</p></li>
<li><p>Fewer admin hours: Save coordinator/payroll time weekly</p></li>
<li><p>Leakage reduction: Example – if 4,000 visits/month and QR reduces questionable claims by 1–2% at $60/visit, monthly savings ≈ $2.4k–$4.8k (annualised $28k–$58k)</p></li>
<li><p>Data quality: Clear evidence trail (who, where/when, which booking)</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p>Owner</p></td>
<td class="confluenceTd"><p>Romy Blacklaw – Care Innovation and Transformation Lead</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Other Stakeholders</p></td>
<td class="confluenceTd"><ul>
<li><p>Care Workers – submit confirmations</p></li>
<li><p>Recipients / Families – consent to QR display</p></li>
<li><p>Scheduling / Care Coordination – manage bookings, monitor exceptions</p></li>
<li><p>Finance – rely on confirmations for approvals and audits</p></li>
<li><p>Quality &amp; Compliance – evidence for program requirements and investigations</p></li>
<li><p>IT / Engineering – build &amp; support module; integrate with bookings/care plan PDFs</p></li>
<li><p>Provider Partners – onboarding collateral (magnets, print)</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p>Assumptions &amp; Dependencies</p></td>
<td class="confluenceTd"><p>Assumptions:</p>
<ul>
<li><p>Workers have smartphones with cameras and intermittent data</p></li>
<li><p>Booking system exposes recipient-scoped bookings and stable IDs</p></li>
<li><p>Care plan generation pipeline can embed QR and short URL</p></li>
<li><p>Worker names can be entered free text (no SSO for MVP)</p></li>
</ul>
<p>Dependencies:</p>
<ul>
<li><p>Recipient &amp; booking data (API/DB access)</p></li>
<li><p>Short URL/slug service for non-PII QR links</p></li>
<li><p>PDF generation for care plans; vendor/print for magnets</p></li>
<li><p>Basic reporting/eventing for finance/compliance</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p>Risks</p></td>
<td class="confluenceTd"><ul>
<li><p>Spoofing (no auth): Mitigate with scoping, time-window validation, roster cross-check, device/IP rate-limits, optional PIN/GPS, QR rotation</p></li>
<li><p>Wrong booking selection: Filter by recipient + near-timeframe; highlight “today/now”; allow search; flag out-of-window</p></li>
<li><p>Privacy concerns: No PII in QR; hash IP; explicit GPS consent; retention policy</p></li>
<li><p>Connectivity gaps: Fast-loading short form; queued submit/retry; fallback short URL</p></li>
<li><p>Change management: Provide 1-page worker guide and quick video</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p>Estimated Effort</p></td>
<td class="confluenceTd"><p>Engineering: ~2.5–4.0 person-weeks total</p>
<ul>
<li><p>Discovery: 1 week</p></li>
<li><p>Design: 1 week</p></li>
<li><p>Development: 2 weeks</p></li>
<li><p>Print collateral: 2 weeks</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p>Proceed to PRD?</p></td>
<td class="confluenceTd"><p>Not specified in QRW draft</p></td>
</tr>
<tr>
<td class="confluenceTd"><p>Other information I can't find a place for</p></td>
<td class="confluenceTd"><p>Link to Support at Home Program Manual – Dept of Health:<br />
<a href="https://www.health.gov.au/sites/default/files/2025-09/support-at-home-program-manual-a-guide-for-registered-providers.pdf" class="external-link" rel="nofollow">https://www.health.gov.au/sites/default/files/2025-09/support-at-home-program-manual-a-guide-for-registered-providers.pdf</a></p></td>
</tr>
</tbody>
</table>

</div>

</div>

<div class="pageSection group">

<div class="pageSectionHeader">

## Attachments:

</div>

<div class="greybox" align="left">

<img src="images/icons/bullet_blue.gif" width="8" height="8" /> [{D6A78D15-EAC6-40F8-92BE-BFB32A6732A5}-20250715-080709.png](attachments/436896930/436897513.png) (image/png)  

</div>

</div>

</div>

</div>

<div id="footer" role="contentinfo">

<div class="section footer-body">

Document generated by Confluence on Nov 07, 2025 09:52

<div id="footer-logo">

[Atlassian](http://www.atlassian.com/)

</div>

</div>

</div>

</div>
