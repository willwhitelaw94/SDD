# mfs/lth

February 06, 2026, 09:45 am

## Notes

### **Funding Streams Management and Onboarding**
- The team agreed on the urgent need to capture and manage multiple funding streams per client during onboarding to reduce funding withdrawal risks and improve fund tracking (00:16).
- **Capturing multiple funding streams and their take-up dates** in Zoho CRM and syncing them to the Portal is critical to avoid funding withdrawals caused by delayed recording of funding expiry entries (01:22).
    - Romy Blacklaw highlighted that recording entries after the expiry date currently causes funding to be withdrawn by Services Australia.
    - Sales must capture all relevant funding streams and expiry dates upfront to prevent lost funding.
    - Implementation requires updating onboarding forms to allow selection of up to **five** concurrent funding streams, each with commencement and expiry dates.
    - This will reduce funding errors, increase claim accuracy, and help maintain steady revenue flow.
    - The competitive context is that accurate funding capture distinguishes Trilogy Care’s management from less organized providers.
- A **multi-select classification picklist** in Zoho CRM is proposed to replace existing fragmented fields, simplifying the onboarding input while enforcing rules on mutually exclusive funding types (12:00).
    - JavaScript customization will enforce rules like allowing only one ATHM or Home Mod selection per client.
    - The maximum number of simultaneous funding streams per client is capped at **six**.
    - This approach balances data integrity with usability, reducing training complexity for the 200 coordinators who must adopt the system.
    - The MVP focuses on core functionality in leads, care plans, and consumer modules, deferring agreement updates to later phases.
    - Romy stressed onboarding is the priority since post-onboarding funding streams are tracked automatically via the Portal API.
- The existing **funding and services module in CRM** is designed to track clients’ funding history and applications but is currently unused, representing an opportunity to improve visibility on funding changes over a client’s lifecycle (41:26).
    - Visibility into funding changes will help identify overspending instances and prompt timely package review requests.
    - This historical tracking supports long-term client management and revenue optimization.
    - Romy noted this module needs dedicated resources to activate and maintain.
### **Portal Inbox and Notification Enhancements**
- The Portal inbox requires enhancements to alert care partners about at-risk budgets and unverified funding streams to ensure timely actions and prevent funding losses (04:03).
- A new **tab in the inbox** will list clients with allocated but unverified funding, enabling care partners to detect funding streams that require manual verification or action (06:47).
    - Luke requested a **daily report** on these unverified allocations to monitor backlog and reduce revenue leakage.
    - Notifications will be embedded in the existing Portal inbox interface rather than relying on email alerts, which are often overlooked.
    - Romy explained that AI-powered Teams prompts remind care partners to tag communications, improving accountability.
    - The inbox is a core tool used daily by care partners, especially when coordinating with external coordinators.
- To improve accountability, status changes in the inbox will track funding streams through verification and termination stages (10:12).
    - Funding streams take about **two hours** to appear in the system after entry recording.
    - Process improvements include manual or automated polling of the API to update statuses and trigger notifications.
    - This system will help care partners prioritize urgent funding issues and reduce missed funding opportunities.
### **Funding Stream Termination and Exit Process**
- The meeting clarified the need to separate termination of individual funding streams from terminating an entire client relationship to avoid accidental funding losses (34:07).
- The Portal must allow care partners to **close individual funding streams** independently, with the client record only terminated once all streams are closed (34:20).
    - Currently, terminating a client in the consumer module closes all funding streams indiscriminately, causing operational risks.
    - Romy emphasized the need for warnings and verification steps before care partners can exit a funding stream via the API to prevent errors.
    - Only Beck currently manages termination of complex funding streams like restorative care and end of life.
    - The new process will require workflow changes for Brandon and accounts to handle exit lodgment correctly.
    - This granular termination capability supports better client lifecycle management and funding accuracy.
- Terminology clarification was agreed: "exit" will be used for closing funding streams, while "terminate" will refer to ending the entire client relationship to avoid confusion (37:02).
    - The system will implement clear UI messaging and confirmation prompts aligned with product standards.
    - Romy noted that about **60%** of monthly client exits result from death or residential moves, justifying the need for differentiated handling.
    - Most short-term funding pathways will expire naturally, but restorative care and end of life require active management.
### **Care Partner Roles and Clinical Coordination**
- The team acknowledged the need to support **multiple care partners per client**, including a new clinical care partner role specifically for restorative care funding streams (22:21).
- Restorative care funding requires a **clinical care partner** distinct from the primary care partner, reflecting the specialized coordination needs (23:00).
    - Romy explained that clinical care partners handle billing and coordination for restorative care to avoid misdirected invoices.
    - The Portal UI will add a "clinical care partner" section alongside existing care partner and care coordinator menus.
    - Mass assignment features are planned to efficiently allocate care partners across pods and funding streams.
    - This role separation aligns with operational realities and improves accountability and billing accuracy.
- Multi-care partner support introduces complexity to existing one-to-one care partner filters in the Portal inbox, requiring architectural changes to support one-to-many relationships (27:40).
    - Romy stressed this transformation is critical to scale with the growing pod structure and leadership visibility needs.
    - The upcoming **team manager impersonation feature** releasing on Tuesday will improve pod leader oversight but does not yet support mass reassignments.
    - The strategic shift enables better management of client funding streams and team accountability.
### **Coordination Fee Structures and Billing Implications**
- Coordination fee logic varies by funding stream type and coordinator, affecting billing and client agreements (29:19).
- Restorative care funding streams have a **0% coordination fee** when coordinated internally by Trilogy Care, regardless of the client’s ongoing package coordination (29:28).
    - External coordinators charge standard coordination fees on ongoing packages, but restorative care remains zero fee internally.
    - End of life funding always carries a **10% coordination fee** if Trilogy Care is the coordinator.
    - Romy confirmed that custom coordination fees are entered at the budget level and must reflect these rules to ensure correct billing.
    - This fee matrix is complex and requires clear documentation and adherence to avoid revenue leakage.
- The team plans to maintain a **coordination fee matrix** to guide care partners and billing teams, supported by Excel documentation shared by Pat (30:10).
    - This matrix will help care partners apply appropriate fees and prevent billing disputes.
    - The billing nuances support Trilogy Care’s competitive differentiation by accurately reflecting service coordination costs.
### **Timelines, Priorities, and MVP Scope**
- Urgency was emphasized to deliver core multi-funding stream functionality as soon as possible to enable claims and revenue capture (45:18).
- Romy stated the solution is needed **immediately** due to clients currently unclaimable under the existing system (45:26).
    - The MVP will focus on onboarding capture, multi-funding stream selection, and clinical care partner assignment.
    - Agreement updates and more advanced workflows have been scoped out to avoid delaying delivery.
    - The team will leverage the **sandbox environment** to experiment with Zoho CRM custom picklists and JavaScript rules this week (19:52).
    - Clear MVP boundaries will avoid overcomplication and ensure fast deployment.
- The **Lead to HCA (LTH) epic** in the TC Portal backlog will incorporate these funding stream enhancements, with initial tickets created and team access granted (46:16).
    - Ongoing coordination between CRM and Portal teams is vital to align data flows and status synchronization.
    - The team agreed on prioritizing business needs over UI polish for the MVP, focusing on functional completeness first.
    - Training for 200 coordinators remains a key consideration for rollout planning to ensure adoption.
- Romy committed to providing matrices and documentation around coordination fees and funding classifications to support development and training (49:50).

## Action items

##### **David H**
- Investigate Zoho CRM sandbox to develop a multi-select pick list with bespoke JavaScript for multi funding stream onboarding fields (15:00)
- Create ticket and design MVP for multi funding stream onboarding and status tracking in Portal and CRM, focusing on ease and accuracy (46:00)
- Develop Inbox page tab to show clients with allocated but unverified funding requiring action by care partners (05:00)
- Plan to extend team management features for mass assigning care partners once initial multi stream onboarding is deployed (25:00)
- Ensure termination workflow in Portal supports individual funding stream closure, sending appropriate signals to field staff (34:00)
- Coordinate with Romy Blacklaw on specification for funding stream types, coordination fees, and report structures for clinical and care partner assignments (29:00)
##### **Romy Blacklaw**
- Advise on critical onboarding data capture requirements, including accurate expiry/take-up date recording and implications for claims (01:00)
- Communicate training needs for circa 200 coordinators due to changes in Zoho forms and onboarding procedures (16:00)
- Provide matrices and business rules for coordination fees and funding stream classification as inputs for development (48:00)
- Validate termination processes and impact on billing and client status with finance and claims teams (33:00)
- Support MVP scope discussions and prioritization to balance urgent functional capability vs longer term full integration (44:00)

