<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)

</div>

# <span id="title-text"> Trilogy Care Portal : SPO - 2. PRD - Supplier onboarding & recontracting </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> Mike Wise</span>, last modified by <span class="editor"> Steven Boge</span> on Sep 23, 2025

</div>

<div id="main-content" class="wiki-content group">

**NOTE - this has proceeded to Development without the PRD and user stories being written here, in this format.**

<div class="plugin-tabmeta-details">

<div class="table-wrap">

<table class="confluenceTable" data-layout="default" data-local-id="ccd144b7-02e9-45c9-95dd-51f6bb697866">
<tbody>
<tr>
<th class="confluenceTh"><p><strong>Product name</strong></p></th>
<td class="confluenceTd"><p>Supplier Portal Changes</p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Jira ID (link)</strong></p></th>
<td class="confluenceTd"></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Document status</strong></p></th>
<td class="confluenceTd"><p><span class="status-macro aui-lozenge aui-lozenge-visual-refresh">DRAFT</span></p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Idea Brief (link)</strong></p></th>
<td class="confluenceTd"><p>Big Room Planning - Aug…. This work is also explicitly tracked in BRP tasks (“Supplier Onboarding”, “Supplier Data”, “Supplier Recontract”, “Supplier Recontracting”) BRP Tasks.</p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Initiative (Jira)</strong></p></th>
<td class="confluenceTd"><p><span data-colorid="rzwo4ujge6">What initiative does this fall under?</span></p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Target release</strong></p></th>
<td class="confluenceTd"><p><strong>Supplier Onboarding delivered by 1 Sept 2025</strong></p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>PRD owner</strong></p></th>
<td class="confluenceTd"><p><span data-colorid="aarok25j7a">@ mention owner.. who is writing this?</span></p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Designer consulted</strong></p></th>
<td class="confluenceTd"><p><span data-colorid="fh62686751">@ designer who was consulted to draft this</span></p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Developer consulted</strong></p></th>
<td class="confluenceTd"><p><span data-colorid="th1shjwdfr">@ lead who was consulted to draft this</span></p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Business Stakeholders</strong></p></th>
<td class="confluenceTd"><p><strong>R (Responsible) -</strong><br />
<strong>A (Accountable) -</strong><br />
<strong>C (Consulted) -</strong><br />
<strong>I (Informed) -</strong></p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>Product owners</strong></p></th>
<td class="confluenceTd"><p>The product owner and the exec sponsor</p></td>
</tr>
<tr>
<th class="confluenceTh"><p><strong>T-shirt sizing</strong></p></th>
<td class="confluenceTd"><p>BRP roadmap calls for <strong>Supplier Onboarding delivered by 1 Sept 2025</strong>, noting “a lot of edge cases” and a ~2‑month effort.</p>
<p>Planning and scoping are framed in terms of <strong>Time to Impact</strong>; a single dev squad sprint is ~$30k, with up to 3 squads operating in parallel BRP Meeting Transcript.</p></td>
</tr>
</tbody>
</table>

</div>

</div>

## Executive Summary ✍️

<div class="table-wrap">

<table class="confluenceTable" data-table-width="760" data-layout="center" data-local-id="3af0f801-01e8-4550-989f-8dd02610157b">
<tbody>
<tr>
<td class="confluenceTd"><p><strong>Problem Statement</strong></p></td>
<td class="confluenceTd"><p>Supplier intake is fragmented across website forms, Zoho CRM and ad‑hoc back‑office creation from invoices. It cannot scale to (a) onboarding ~15,000 suppliers, and (b) recontracting existing suppliers to Support at Home (SAH) agreements inside an 8‑week window before the <strong>1 Nov</strong> cutoverSupplier Onboarding Mee….</p></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Solution</strong></p></td>
<td class="confluenceTd"><p>A unified <strong>Supplier Onboarding &amp; Recontracting</strong> capability in the Portal that:</p>
<ul>
<li><p>supports <strong>self‑registration</strong> (~90% of cases) and <strong>internal creation from invoices</strong>Supplier Onboarding Mee…,</p></li>
<li><p>captures <strong>non‑negotiable data</strong> (legal name, ABN, GST status, services, five price types)Supplier Onboarding Mee…,</p></li>
<li><p>provides <strong>matrix pricing</strong> across outlets and weekday/Weekend/PH variations with “apply to all”Supplier Onboarding Mee…,</p></li>
<li><p>verifies bank details via <strong>EFTSure/EFT Shore</strong> Supplier Onboarding Mee…,</p></li>
<li><p>runs <strong>bulk recontracting</strong> with conditional “minimal steps” for no‑change suppliers and partial onboarding where neededSupplier Onboarding Mee…,</p></li>
<li><p>seeds a <strong>risk‑based audit</strong> model to replace legacy SLA‑style reviews (Phase 2)Supplier Onboarding Mee…,</p></li>
<li><p>bridges to <strong>Zoho CRM</strong> until Portal‑native audit workflows are completeSupplier Onboarding Mee</p></li>
</ul></td>
</tr>
<tr>
<td class="confluenceTd"><p><strong>Success metrics</strong></p></td>
<td class="confluenceTd"></td>
</tr>
</tbody>
</table>

</div>

<div class="table-wrap">

|  |  |  |  |
|----|----|----|----|
| **\#** | **User Story** | **MoSCoW** | **Acceptance Criteria** |
|  | <a href="https://trilogycare.atlassian.net/wiki/spaces/TC/pages/394723380/July+2+2025+Supplier+Onboarding" data-linked-resource-id="394723380" data-linked-resource-version="2" data-linked-resource-type="page">July 2, 2025 (Supplier Onboarding)</a> |  |  |

</div>

## 🗺️ Background / Context

- Competitive insights or regulatory drivers.

# 📦 Scope Requirements

<div class="table-wrap">

|  |  |  |  |  |
|----|----|----|----|----|
| **area** | **User Story** | **Importance** | **Jira Issue** | **Notes** |
|  |  | <span class="status-macro aui-lozenge aui-lozenge-visual-refresh aui-lozenge-error">HIGH</span> |  |  |
|   |   |   |   |   |

</div>

### Out‑of‑Scope

- Clearly list deferred or excluded items.

## <img src="images/icons/emoticons/help_16.png" class="emoticon emoticon-question" data-emoji-id="atlassian-question_mark" data-emoji-shortname=":question_mark:" data-emoji-fallback=":question_mark:" data-emoticon-name="question" width="16" height="16" alt="(question)" /> Open Questions

<div class="table-wrap">

|              |            |                   |
|--------------|------------|-------------------|
| **Question** | **Answer** | **Date Answered** |
|              |            |                   |

</div>

## <img src="images/icons/emoticons/72/1f3a8.png" class="emoticon emoticon-blue-star" data-emoji-id="1f3a8" data-emoji-shortname=":art:" data-emoji-fallback="\uD83C\uDFA8" data-emoticon-name="blue-star" width="16" height="16" alt="(blue star)" /> User interaction and design

### Vibe App

Insert a Vibe app here if you have made one.

## <img src="images/icons/emoticons/72/1f31f.png" class="emoticon emoticon-blue-star" data-emoji-id="1f31f" data-emoji-shortname=":star2:" data-emoji-fallback="\uD83C\uDF1F" data-emoticon-name="blue-star" width="16" height="16" alt="(blue star)" /> Milestones (Rich)

## Milestones (Simple)

<div class="table-wrap">

|          |       |       |     |        |
|----------|-------|-------|-----|--------|
| Phase    | Owner | Start | End | Status |
| Design   |       |       |     |        |
| Dev      |       |       |     |        |
| QA / UAT |       |       |     |        |
| Release  |       |       |     |        |

</div>

## <img src="images/icons/emoticons/72/1f5c3.png" class="emoticon emoticon-blue-star" data-emoji-id="1f5c3" data-emoji-shortname=":card_box:" data-emoji-fallback="🗃️" data-emoticon-name="blue-star" width="16" height="16" alt="(blue star)" /> Reference materials

-  

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
