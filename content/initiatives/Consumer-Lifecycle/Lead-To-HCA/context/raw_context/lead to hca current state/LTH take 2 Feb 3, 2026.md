# LTH take 2

February 03, 2026, 03:15 pm

## Notes

### **Onboarding Process and Point of Sale Workflow**
- The onboarding process centers on converting leads into consumers using Zoho CRM and completing a sales onboarding push form during the client’s phone call to capture essential client data and screening outcomes.
- **Leads are converted to consumers in Zoho CRM**, with required fields like consumer name, funding classification, and TCID generated prior to the push form completion (00:51)  
    - The sales rep completes an onboarding push form live with the client, capturing screening data, client details, and consent to proceed  
    - The form captures IAT screening PDF uploads, risk scoring, and client preferences for management options (self-managed, coordinated, or brokered managed)  
    - Upon form submission, a care plan record is created in CRM, triggering a webhook to the portal to generate the client’s package record  
    - This integration ensures data flows from CRM to the portal for package creation and downstream workflows  
- **Screening outcomes determine onboarding eligibility**, with three possible results: approved for all pathways, approved for coordinated model only, or rejection (04:10)  
    - The screening and risk scoring use an AI-powered logic developed by Romy, producing a score like 2.27 for approved clients (16:00)  
    - Only about **2% rejection rate** is observed, equating to roughly **60 clients out of 3,000 onboarded in 3 months** (42:35)  
    - This low false-negative rate supports confidence in moving agreement signing earlier in the process  
- **Client contact and consent details are captured in the onboarding form**, including representative nomination, preferred language, interpreter needs, pension status, and payment method preference (17:59, 14:09)  
    - Direct debit is promoted as the primary payment method, with alternatives offered only upon objection  
    - Consent for representatives includes multiple roles and relationships, ensuring compliance and clarity  
- **Post-push form, the client receives a sample home care agreement by email before the care plan meeting** (25:10)  
    - The care plan meeting finalizes budget and risk evaluations; clients can verbally accept the agreement at this point  
    - If verbal acceptance is not given, a digital signature request is sent, with sales following up on completion (26:35)  
    - Agreement acceptance status is tracked within the CRM consumer module, linking back to the portal system for claim activity  
### **Care Plan Meeting and Follow-up Timelines**
- The care plan meeting is designed to occur promptly after onboarding, aiming for a fast turnaround of care plan delivery and agreement completion.
- **The care plan and budget are targeted to be produced within 24 hours of the client’s care plan meeting and commencement date** (31:41)  
    - The meeting time is set as the default commencement date to meet this timeline  
    - Currently, turnaround has fluctuated between 7–9 days initially, but has improved to a 24-hour turnaround in recent weeks (44:07)  
- **SMS reminders and confirmation calls are sent to clients ahead of the care plan meeting** to reduce no-shows and improve engagement (29:58)  
    - Clients receive an SMS reminder and a confirmation call on the meeting day  
- **Care plan delivery differs for self-managed versus coordinated clients**: (38:09)  
    - Self-managed clients receive care plans immediately after the meeting, even if the agreement is unsigned  
    - Coordinated clients are assigned an internal coordinator who manages care plan delivery, but capacity constraints have caused delays and backlogs of about **130 clients** waiting for allocation (35:17)  
    - The internal coordination team aims to send care plans within 24 hours after client allocation, but delays remain  
- **Clients receive care plans regardless of signing status**, supporting transparency and encouraging agreement uptake (38:09)  
    - Early care plan delivery is seen as a driver to increase agreement acceptance rates  
### **Screening Tool Effectiveness and Churn Reduction Strategy**
- The AI-powered IAT screening tool has proven effective, enabling earlier agreement signing and reducing client churn.
- **The screening tool’s false rejection rate is approximately 0.2%, with only 6 of 3,000 clients rejected post-meeting after passing screening** (42:35)  
    - This high accuracy allows the business to confidently move agreement signing to the point of sale  
- **Initial onboarding churn was around 14%, largely due to delays in care plan meetings and delivery** (44:07)  
    - Recent improvements in scheduling and turnaround have reduced churn to **below 6% for January month-to-date**  
    - Faster meeting-to-care plan delivery and digital agreement options have driven this improvement  
- **Plans are underway to send digital signature requests immediately after screening approval** rather than waiting for the care plan meeting (41:18)  
    - This approach aims to capture up to 60% agreement uptake before the meeting, with additional uptake during or after the meeting  
    - Providing clients early access to portal tools for budget customization is expected to improve engagement and reduce reliance on human follow-up  
### **Multiple Funding Streams and Consent Management**
- Onboarding and care plan processes require enhancements to handle multiple funding streams and capture explicit consent for each.
- **Currently, only one funding stream (usually the highest value) is selected and onboarded at point of sale**, while additional streams are buried in care plan notes or manually checked later (50:07)  
    - This manual process risks missed budgets and incomplete consent capture for secondary funding streams  
- **Business wants to capture all applicable funding streams at point of sale with explicit client consent for each** (50:07)  
    - The push form and CRM need to be updated to support multi-select fields for funding streams and consent capture  
    - The assessment team requires full visibility of all streams to prepare accurate budgets and ACE allotments  
- **Technical design discussions are ongoing about care plan architecture and CRM data fields** (51:49)  
    - Proposals include separate care plan objects per funding stream while retaining a unified UI view  
    - Primary funding stream would remain singular for portal integration, with secondary streams added via new fields  
- **Legal and compliance considerations around agreement coverage remain unresolved** (54:46)  
    - Erin indicates a single home care agreement covers all funding streams, but system workflows currently treat terminations per stream as full client terminations  
    - Aligning database design, UI, and compliance requirements is critical to avoid client service disruption  
- **Consent capture at onboarding would be dynamic: selecting funding streams implies consent, but legal clarity on amendments vs. initial agreement is needed** (54:46)  
    - The system must trigger consent flags per funding stream and support termination or amendment workflows accordingly  
### **CRM and System Integration Overview**
- Zoho CRM is central to managing onboarding, care plans, finance workflows, and client experience tracking, but improvements are needed for efficiency and data robustness.
- **Consumer module in Zoho CRM manages finance workflows, agreement statuses, and links to portal for claims and lodgements** (26:35)  
    - Care plan module exists primarily to trigger portal webhooks for package record creation  
    - Risk and client experience ticket modules capture additional operational data linked to consumers  
- **Sales team currently sends the onboarding push form to themselves due to system constraints, creating a clunky process** (23:26)  
    - Required fields are captured both during lead conversion and in the push form but without duplication  
    - TCID and funding classification are mandatory to create consumer records and connect properly with portal data  
- **Client consent, representative details, and funding classification are all integrated within CRM modules but require UI and backend updates to handle multi-stream onboarding** (53:14)  
- **Client address and statement recipient information are managed in the consumer module but noted as not robust, indicating potential for data quality improvements** (50:07)  
- **Future process improvements include automating care plan and budget delivery immediately after assessment meetings, bypassing manual handoffs to care partners** (41:18)  
    - This would reduce delays caused by capacity issues and improve SLA compliance for the 24-hour turnaround target  

## Action items

##### **David H**
- Provide sales onboarding push form fields to meeting attendees for AI process understanding (01:40)
- Coordinate with Scott to confirm if SMS meeting reminders are sent consistently to clients (29:58)
- Share IAT screening tool scoring logic from Confluence with Mike if required (16:00)
- Follow up with Erin on compliance requirements regarding reasonable time provided to clients for agreement consideration (44:07)
- Clarify with care and claims teams about handling multiple funding streams and consent capture in CRM and portal workflows (50:07)
##### **Jackie P**
- Verify where home care agreements are stored currently in CRM or care plan module (31:41)
- Investigate reconciliation of multiple funding streams consent and legal amendments with Erin and relevant teams (54:46)
##### **Room 403**
- Prepare for Friday meeting to map out business wants and required changes to onboarding process and care plan workflows, especially around multi-stream funding and automation (40:00)
- Explore automation opportunities for sending care plans immediately post-assessment meeting to reduce delays and churn (39:43)
- Investigate feasibility of upgrading UI to support multi pick lists for funding streams and improved client consent capture at point of sale (47:07)

