# Onboarding multiple funding streams and ACER lodgement

January 30, 2026, 11:00 am

## Notes

### **Funding Streams Management for New Clients**
- The team agreed that onboarding multiple funding streams at point of sale is the ideal but currently limited by system constraints (07:58).
- **Rebecca Eadie** highlighted the current limitation where only a single funding stream can be onboarded per client, with additional funding streams noted only in care plan notes, making tracking difficult (04:10).
    - This approach prioritizes the highest funding amount, but fails to capture full client funding accurately.
    - The onboarding forms and Bernie's crew processes do not currently support capturing multiple funding streams.
    - The lack of structured capture causes challenges in monitoring and billing.
- **Romy Blacklaw** stressed the need for confirmation from clients before activating additional funding streams, as some are time-limited or once-in-a-lifetime, like home modifications (07:26).
    - Current practice risks activating funding streams without client consent.
    - This disconnect may cause compliance and billing issues.
- The team discussed transforming the CRM's current one-to-one funding relationship into a consumer-to-many care plan model to allow multiple funding streams per client (08:10).
    - This would enable terminating individual funding streams without affecting the entire client account.
    - Such a change represents a major migration effort but aligns with long-term scalability.
- The expectation was confirmed that amendments must be signed for each new funding stream before recording entries in Proda, per **Erin's** guidance (09:46).
    - This ensures legal compliance and client consent.
    - **Celeste** will follow up with the team to clarify amendment requirements and communicate next steps (43:52).
### **System and Process Gaps in Funding Stream Tracking**
- Current tools lack proper tracking, notification, and management of multiple funding streams, causing operational inefficiencies (39:16).
- There is no automated way to track applications, approvals, or entries for additional funding streams in CRM or Portal (39:33).
    - Care partners manually find and record funding streams, often relying on external systems like My Aged Care.
    - This manual process leads to missed activations and unpaid invoices.
- A new CRM module was proposed to track funding applications, approval stages, and exits, linking closely with API notifications from My Aged Care (24:35).
    - The module would allow care partners to record applications and update stages as funding progresses.
    - API updates would trigger notifications to care partners, improving visibility and accuracy.
- **Rebecca Eadie** suggested integrating this module into the existing sales push form to capture multiple funding streams at onboarding (35:44).
    - This would provide a single source of truth for funding stream status.
    - Collaboration between assessment, CRM, and Portal teams is needed to implement this smoothly.
- Notifications to care partners about funding approvals are not currently automated but are a priority, with dashboard solutions preferred over email to avoid missed communication (38:03).
    - Management-level visibility is required to avoid lost or delayed funding activations.
    - This notification infrastructure ties into a broader work management initiative planned for Portal.
### **Proda Entry and Funding Stream Activation Challenges**
- Accurate Proda entries are critical for billing but are currently inconsistent, causing payment delays and tracking issues (30:04).
- Entries are often recorded late or only for a single funding stream, causing bills to be unpaid or misdated (31:39).
    - Backdating entries is possible but must be carefully managed due to funding time limits, such as the 12-month limit on Assistive Tech Home Modifications (ATHM) (33:52).
- **Rebecca Eadie** raised that exit or termination processes only capture the original funding stream, ignoring later-added streams, complicating client exits or funding terminations (22:28).
    - This leads to risks of wrongful termination or incomplete funding closure.
- The team agreed on the need for a termination field or flag for individual funding streams to prevent whole-package termination errors (17:01).
    - Such granularity would give **Brennan** and operations clearer signals on what exactly to terminate in Proda.
- The issue of coordination fees for Restorative Care, which must be fully coordinated internally and separate from ongoing package fees, requires distinct budget and fee management in Portal (19:31).
    - This calls for toggles or separate budget items for coordination types to avoid fee misapplication.
### **Multi-Funding Stream Agreements and Consent**
- Legal and consent frameworks require clarity to support multiple funding streams per client without workflow or compliance risks (13:51).
- Amendments must be signed for each additional funding stream to meet legal requirements before funding activation (09:46).
    - **Romy Blacklaw** is seeking clarification on amendment workflows and notification responsibilities.
- The team discussed agreement complexity when clients have mixed management options, such as external coordinators for ongoing packages but internal coordination for Restorative Care (20:16).
    - This demands UI and system flexibility to represent multiple coordination types simultaneously.
- Existing agreements can be adapted for ATHM-only onboarding, confirmed by **Erin** and discussed by the team (13:51).
    - This avoids the need for creating entirely new agreement templates but requires process rigor.
### **Strategic Next Steps and Collaboration**
- Immediate cross-team collaboration and quick wins are prioritized to resolve funding stream tracking and notification gaps (39:51).
- **Romy Blacklaw** will coordinate with **Jack** and **Will** on CRM updates to capture additional funding streams accurately for new clients (39:51).
    - Parallel work with **Matt** and **Tim** will focus on enabling additional unverified funding streams in Portal to reflect these changes.
- The team emphasized minimizing workflow disruptions by designing solutions that integrate well with existing sales and assessment processes (36:27).
    - Clear ownership of record creation and updates in CRM and Portal is essential for accountability.
- End of Life and Restorative Care pathways require specific attention to access controls and checkboxes within CRM to verify Acer lodgements, as raised by **Rebecca Eadie** (41:44).
    - Access rights for users to mark lodgements need review and adjustment.
- The overall goal is to achieve fast, simple solutions that improve visibility, reduce manual effort, and ensure timely billing, as summarized by **Rebecca Eadie** and **Romy Blacklaw** (40:45).
    - This includes building dashboards or portals for care partners and management to track funding status and required actions without relying solely on email notifications.

## Action items

##### **Romy Blacklaw**
- Lead separate meetings with Jack and Will to detail necessary CRM changes to capture multiple funding streams for new clients (39:51)
- Coordinate with Matt and Tim on creating unverified funding streams in Portal to match CRM data for new client onboarding (39:51)
- Oversee follow-up on amendment requirements and consent/agreements needed when onboarding additional funding streams for new and existing clients (43:52)
- Facilitate creation of notifications and tracking mechanisms in Portal/CRM for additional funding streams and Acer lodgement (40:00)
##### **Rebecca Eadie**
- Collaborate on CRM module/form development to enable multi-funding stream capture at point of sale (35:44)
- Investigate and resolve access issues related to Acer lodgement checkbox in CRM for end of life/restorative care pathway (41:44)
- Confirm and close loop on amendment signature requirements for additional funding streams with Erin and Celeste (43:15)
- Support coordination between assessment, sales, and CRM teams on handling multi-funding tracking and recording (40:12)
##### **Celeste D**
- Follow up and clarify amendment and consent requirements related to new and additional funding streams for client agreements (43:52)
##### **Matthewa & Timb**
- Work on API integration to automate detection of funding status changes and trigger CRM/Portal updates for funding approvals and allocations (25:45)
##### **Jack**
- Provide access support and liaise with Rebecca to resolve CRM ACL issues for Acer lodgement recording (41:50)
##### **Team-wide**
- Maintain detailed records of issues, actions, and requirements for follow-up and process improvements beyond business analysis roles (40:15)

