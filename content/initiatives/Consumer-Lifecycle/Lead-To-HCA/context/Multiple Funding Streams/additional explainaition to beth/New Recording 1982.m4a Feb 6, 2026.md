# New Recording 1982.m4a

February 06, 2026, 01:28 pm

## Notes

### **Home Care Agreement Classification and Management**
- The team decided to implement a multi-classification system on home care agreements, enabling flexible service categorization and automatic lodgement triggers.
- **Home care agreements will support multiple classifications linked via a one-to-many relationship, each with entry and exit dates tied to the agreement commencement date** (01:59)  
    - The default classification applies to all services, avoiding re-signing for additional classifications like restorative care later.  
    - Entry and exit dates track when classifications become active or expire, allowing care partners to monitor service status accurately.  
    - This structure supports funding streams and aligns with regulatory lodgement requirements.  
    - The system will poll every night at midnight to update classification statuses and trigger lodgement processes automatically.
- **Tim will investigate automating the currently manual Acer entry lodgement process to replace Brennan's manual input, improving efficiency** (05:51)  
    - This automation will reduce errors and administrative burden on the accounts team.  
    - The clinical team will maintain the ability to change agreement statuses from draft to sent in the workflow.  
    - Jackie will have controls to prevent proceeding without required clinical input, ensuring compliance and quality control.  
    - The team plans to integrate a toggle system for draft/send statuses in the lead-to-HCA process for better workflow policing.
### **Home Care Agreement Fees and Budget Workflow**
- Adjustments to fee management and budget impact require a clear amendment and approval process to maintain financial accuracy and client transparency.
- **Changing fees from self-managed to self-managed plus will trigger an amendment workflow requiring budget re-approval and client sign-off** (08:21)  
    - Bruce highlighted the need for clients to receive an accurate total cost estimate before signing amendments.  
    - Coordinators currently struggle to provide precise cost estimates before organizing services, complicating the workflow.  
    - The team discussed potential overspend workflows to handle budget adjustments and approvals systematically.  
    - This amendment process ensures budgets stay accurate and clients are informed before changes take effect.
- **The system must handle budget updates linked to management option changes without creating redundant draft budgets** (08:21)  
    - Avoiding multiple draft budgets reduces confusion and administrative overhead.  
    - The amendment email template will include the updated budget to keep clients fully informed.  
    - The process will ensure budget updates are reflected promptly and accurately in financial planning.  
    - This approach aligns with compliance and financial control requirements.
### **Lead to Home Care Agreement Onboarding and Clinical Review**
- The onboarding process will integrate risk assessments and clinical approval steps to streamline client intake and reduce delays.
- **A four-step lead-to-HCA onboarding flow will embed the risk survey to determine client suitability for self-managed or coordinated care** (00:00)  
    - The risk survey asks clients about living situation and technology use, generating a risk profile for onboarding decisions.  
    - This profile guides whether clients can self-manage or need coordination, improving placement accuracy.  
    - The survey data will pre-fill some form fields, reducing manual entry and errors.  
    - Jackie will oversee this process using a specialized Chrome browser to capture survey states accurately.
- **Clinical review will gate agreement signing, with AI and manual checks flagging cases requiring intervention** (10:00)  
    - Of the last **3,000 clients**, **60** required clinical review, with **6** passing AI checks but rejected by clinical staff.  
    - The workflow includes uploading the IIT report, which auto-generates needs, goals, and risk documentation for assessment.  
    - This reduces manual review time and supports faster decision-making on client acceptance.  
    - Clinical staff will have a workflow dashboard listing drafts needing intervention to prioritize reviews.
### **Agreement Status and Workflow Enhancements**
- The team refined agreement status states and workflows to clarify document handling and improve process transparency.
- **Agreement statuses will include draft, sent, amended, and terminated, with no requirement to revert amended agreements back to draft** (07:11)  
    - Amendments trigger a new signing workflow without reverting to draft, simplifying document control.  
    - Termination workflows will be built to handle agreement ends cleanly and consistently.  
    - Sent and amended statuses ensure clear tracking of agreement lifecycle stages.  
    - This clarity reduces confusion and improves auditability of agreement changes.
- **Additional logic will prevent Jackie from proceeding without clinical approval, ensuring compliance before booking meetings** (09:50)  
    - This control addresses delays where meetings were booked before agreements were signed.  
    - The system aims to beat the current 24-hour booking window by automating clinical sign-off triggers.  
    - Once clinical approval is confirmed, meetings with care partners can be scheduled promptly.  
    - This reduces bottlenecks and improves client onboarding speed and experience.

## Action items

##### **Tim**
- Investigate and implement API automation for Acer classification lodgement to eliminate manual entry by the accounts team (05:51)
- Build system support for multiple classifications on agreements including date tracking and linkage to Acer lodgement (09:50)
- Develop triggers for management option changes and corresponding amendment workflows with budget sign-off (08:21)
##### **Jackie**
- Ensure compliance with workflow restrictions that prevent progression of agreements requiring clinical intervention until clinical team approval (10:50)
- Use updated lead to HCA process with embedded risk survey to maintain data integrity and enforce draft/send status policing (05:51)
##### **Clinical Team/Assessment Partner**
- Review flagged agreements requiring clinical intervention based on AI-generated needs, goals, risks and gatekeeper evaluation (10:50)
- Approve agreements to enable signing and timely meeting bookings within 24-hour window (11:30)
##### **Accounts Team / Brennan**
- Currently responsible for manual lodging of entries to be replaced by automated process (05:51)
##### **Project Management**
- Establish workflow for amendment signing and handling of budget impact on management option changes, ensuring clear communication and client sign-off (08:21)

