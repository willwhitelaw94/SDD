---
title: "Trilogy Care Portal : SALES PORTAL FULL REQUIREMENTS V1"
---

<div id="page">

<div id="main" class="aui-page-panel">

<div id="main-header">

<div id="breadcrumb-section">

1.  [Trilogy Care Portal](index.html)
2.  [Consumer Journey](Consumer-Journey_436208084.html)
3.  [LTH - Lead to HCA](LTH----Lead-to-HCA_436896288.html)

</div>

# <span id="title-text"> Trilogy Care Portal : SALES PORTAL FULL REQUIREMENTS V1 </span>

</div>

<div id="content" class="view">

<div class="page-metadata">

Created by <span class="author"> David Henry</span>, last modified on Oct 08, 2025

</div>

<div id="main-content" class="wiki-content group">

# **1. Intro**

This document outlines the requirements for the **Sales Portal** within Portal. It begins with enhancements to the **Leads List View**.

Every consumer or person who signs up with Trilogy will automatically have a **Lead Profile**, regardless of whether that profile has been interacted with. Over time, this system is intended to fully **replace the CRM**, serving as the central record for all lead interactions and sales processes.

## **1.1. Note to the Design Team**

I'm drafting this PRD as a functional guide, not a design specification. The descriptions that reference cards, UI components, or visual styles are simply shorthand to communicate intent—**not** prescriptive design directions. I trust the design team’s expertise to interpret and execute these ideas more effectively. My goal is to convey the reasoning, requirements, and desired outcomes for each feature as clearly as possible. This document draws on existing material and aims to streamline discussion by framing needs in familiar visual terms.

------------------------------------------------------------------------

# **2. Leads List View**

## **2.1. Columns & Filters**

The **Leads List Page** serves as the primary workspace for sales agents to view and manage all leads.

### **List View Requirements**

Sales agents must be able to see all leads in a structured list view that includes the following columns:

- Lead Name (primary identifier)

- Lead Contact Name displayed beneath it

- Email

- Phone

- Journey Stage (current stage of the lead)

- Lead Status

- Assigned Agent

- Created Date

- Tasks Indicator (flag if any tasks are associated)

- Task Due Date (if applicable)

### **Interactions**

- Clicking on a **Lead Name** opens that lead’s detailed profile page.

- Agents must be able to **filter** the list by any of the above columns for efficient sorting and segmentation.

## **2.2 Create a Lead (in Portal) **

Within the lead list view Sales users should be able to create a lead.  
Which should open up a minimal set of all of the individual fields that comprise a lead records.  
The mandatory fields should be.

1.  Lead Name

2.  Email

# **3. Lead Profile View**

The **Lead Page** is organized into multiple tabs to separate key areas of information and workflow. The tabs include:

- Overview Tab

- Lead Timeline Tab

- Attribution Tab

- Options and Traits Tab

- Package Tab

- Settings Tab

### **Persistent UI Elements**

Three interface components should remain visible across all tabs:

- Journey Stage Progress Bar – displayed at the top of the page, showing the lead’s progression through defined journey stages.

- Status Actions Card – positioned alongside the progress bar, allowing quick access to key status updates or actions.

- Notes – persistent at the bottom of the interface across all tabs, allowing agents to reference or add notes without changing views.

## **3.1. Journey Stage Bar UI**

### **3.1.1. What is Journey Stage**

The **Journey Stage Progress Bar** visually represents a lead’s position along the client conversion path. It contains five primary milestone stages selected from the broader journey sequence to ensure clarity and compactness within the UI.

#### **Milestone Stages Displayed**

The UI will always display the following key milestones:

- **Pre-Care**

- **ACAT**

- **Booked**

- **Approved**

- **Allocated**

- **Active**

- **Converted**

These stages represent the client’s movement from initial engagement (**Pre-Care**) through to successful onboarding (**Converted**). Journey Stages are grouped into three funnel levels:

- **Top Funnel** – early engagement

- **Middle Funnel** – progressing through assessments and approvals

- **Bottom Funnel** – active clients nearing conversion

Each level will be color-coded in the UI for quick visual reference. When a lead is at a specific stage, the bar will highlight that stage and display a short **description** beneath it (e.g., *“Active – already with another provider, needs transfer process”*).

Only milestone stages will appear by default. Interim stages are shown by name only when a lead is actively in one of those stages, maintaining a clean and accessible layout.

### **3.1.2. Update Journey Stage Wizard**

Sales representatives can update a lead’s Journey Stage directly by:

- Selecting the stage from the **progress bar**, or

- Clicking an **Update** button.

Upon choosing to update, a **wizard** will open to guide the agent through the process. This wizard may include **mandatory** or **suggested fields** that must be completed before confirming the stage change. This ensures that all relevant data for that stage is captured consistently and accurately.

## **3.2. Lead Status UI**

### **3.2.1. What is Lead Status**

While **Journey Stage** reflects an objective measure of how far a lead has progressed through their aged care assessment process, **Lead Status** captures the lead’s level of interaction with the sales team.

#### **Lead Status Values**

- **Not Contacted** – default status for any newly generated lead.

- **Made Contact** – indicates successful communication with the lead.

- **Attempted Contact** – outreach has been made, but no response yet.

- **Lost** – lead is no longer pursuing or suitable for conversion.

- **Converted** – lead has successfully transitioned into a client.

These statuses form a core component of the sales workflow. Each actionable status (excluding *Not Contacted*) will require certain **fields or conditions** to be completed before selection, ensuring consistent and accurate tracking of lead engagement.

### **3.2.2. Update Lead Status Wizard**

When a sales representative updates a lead’s status, a **wizard** will appear to ensure all required information is captured accurately.

### **Functionality**

- The wizard will display **mandatory fields** that must be completed before the status change can be saved.

- It will also include **optional fields** that prompt the rep to add additional context or notes.

- If any of these fields have already been completed within the lead profile, they will appear **prefilled** in the wizard but remain **editable**.

This process ensures that each status change is accompanied by the relevant data entry, maintaining consistent and complete lead records.

#### **3.2.2.1. Made Contact**

When a lead’s status is updated to **Made Contact**, the **Made Contact Wizard** will appear to collect or confirm key details.

**Mandatory Fields**

- **Journey Stage** – select from a drop-down list.

- **Lead Attribution** – select from a drop-down list.

- **Purchase Intent** – 5-point scale ranging from *Very High* to *Very Low*.

- **Contact Status** – identifies whether the contact is *Primary* or *Secondary*.

**Optional Fields**

- **Contact Method** – medium used for communication (e.g., phone, email, SMS).

- **Contact Outcome** – select from a drop-down list (e.g., successful, pending callback, unavailable).

- **Follow-up Date** – allows the rep to set a future follow-up reminder.

- **Contact Notes** – quick-entry field for capturing notes (same as the standard Notes field).

If any of these fields have been completed within the lead profile, they will appear **prefilled** but remain **editable** in the wizard.

#### **3.2.2.2. Attempted Contact**

When a lead’s status is updated to **Attempted Contact**, it indicates that the sales representative has tried to reach the lead but was unsuccessful.

**Mandatory Fields**

- **Contact Method** – medium used for outreach (e.g., phone, email, SMS, letter).

- **Contact Outcome** – select from the following options:

  - No Answer

  - Left Voicemail

  - Line Busy

  - Wrong Number

  - Email Bounced

  - Other

**Optional Fields**

- **Notes** – free-text field for capturing any relevant context or observations about the contact attempt.

#### **3.2.2.3. Lost**

When a lead’s status is set to **Lost**, it signifies that the lead will not result in a package under any circumstance. This status triggers **dynamic logic** that tailors the available options based on the type of loss selected.

**Mandatory Fields**

- **Lost Type** – select from one of the following categories:

  - **Lost Lead** – the lead has explicitly indicated they do not wish to proceed or be contacted again. (A genuine contact, but no conversion potential.)

  - **Junk** – the lead was invalid, spam, or unrelated to care services (e.g., job seekers, incorrect inquiries).

  - **Uncontactable** – repeated attempts to reach the lead were unsuccessful using the provided contact information.

- **Reason** – a dynamic drop-down field filtered according to the selected *Lost Type*:

  - For **Lost Lead**, a list of possible reasons relevant to disengagement.

  - For **Junk**, a separate set of predefined junk-related reasons.

  - For **Uncontactable**, no sub-options are required; the reason defaults to the status itself.

This setup ensures structured, accurate categorization of lost leads while maintaining data quality for reporting and workflow analysis.

#### **3.2.2.4. Converted**

When a lead’s status is changed to **Converted**, the system will direct the sales representative to the **Onboarding Wizard**. Before proceeding, the rep must complete all **Made Contact** mandatory fields.

- If these fields were already entered earlier, they will appear **prefilled** and can be reviewed or updated before continuing.

- If this is the first interaction with the client, the same fields must be completed at this point to ensure all required information is captured.

Once these fields are confirmed, the rep can proceed to the **Conversion and Onboarding flow**, which will be detailed in a later section of this document.

## **3.3. Notes**

The **Notes** section remains fixed at the bottom of the Lead Profile page and functions as the central record for all comments and updates related to a lead.

- This is the standard Notes field, capturing the **date**, **time**, and **author** for each entry.

- Notes entered from various **wizards** (e.g., Journey Stage, Lead Status, Conversion) will automatically populate here, ensuring all interactions are visible in one place.

- The section requires no unique functionality beyond consistent formatting and reliable syncing across modules.

------------------------------------------------------------------------

# **4. Lead Profile Tabs**

## **4.1. Overview Tab**

The sections described earlier (Journey Stage Progress Bar, Status Actions Card, and Notes) persist across all tabs in the sales-facing Lead Portal. The **Overview Tab** serves as the default landing page when a sales representative selects a lead.

### **Overview**

The **Overview Tab** focuses on presenting a concise, high-level summary of the lead’s key details. It enables sales representatives to quickly review, assess, and act without navigating away from the page.

### **4.1.1. Lead Information**

Before finalizing the logic for this section, a **business decision** is required to clearly define what constitutes a *lead*. This decision will affect how certain downstream elements function.

For now, we assume that **each lead represents one potential consumer**. However, there are cases where a person contacts Trilogy on behalf of someone else (e.g., *Bart* fills out a form for *Homer*). To prevent misclassification, the system should include logic or validation to discourage or flag instances where the submitter’s details differ from the intended client’s.

**Displayed Fields:**

- **Lead Name** – First and Last Name of the lead.

- **Journey Stage** – Current stage of the lead in the funnel.

- **Lead Status** – Current engagement status.

- **Record Created Date** – When the lead record was generated.

- **Last Contact Date** – Date of the most recent interaction.

### **4.1.2. User Description**

Many leads originate from **public-facing forms**, where the lead can submit a **message or written description** as part of their inquiry. This section will display that submitted message directly within the lead profile, allowing sales representatives to quickly understand the context or intent behind the lead’s initial contact.

### **4.1.3. Assigned Agent**

The **Assigned Agent** field identifies the sales representative responsible for managing the lead.

Assignment logic can vary based on the source of the lead:

- If the lead is **created manually by a sales rep**, it will be **automatically assigned** to that rep by default.

- If the lead is **pre-existing** or originates from another pipeline, the **Sales Team Leader** or **Head of Sales** can manually assign ownership.

This ensures every lead is clearly owned and tracked by a specific sales representative for accountability and workflow management.

### **4.1.4. Address Information**

The **Address Information** section displays the residential or contact address details of the **lead (potential client)**. This ensures accurate geographic information for service eligibility and correspondence.

**Displayed Fields:**

- **Street Address**

- **Suburb**

- **State**

- **Postcode**

### **4.1.5. Contact Table**

The **Contact Information** section must always include **at least one contact**, representing the potential client. This contact record will be **prefilled** using details from the **Lead Information** section, since *Lead = Potential Client*.

In scenarios where someone other than the potential client (e.g., *Bart* for *Homer*) submits the lead form, it is the **sales representative’s responsibility** to update the Lead Information section to correctly reflect the client’s name (at minimum, the first name).

#### **Contact Requirements**

- At least **one contact** must include both **Email** and **Phone** fields.

- If only one contact includes both fields, that contact is automatically set as **Primary**.

- There can only be **one contact** with the **Primary** designation at any time.

The term *Primary Contact* in this context identifies the **main person to call** for this lead—it may be the client themselves or a representative. This designation is distinct from formal care roles (e.g., EPOAs) used in other contexts but serves to clearly indicate the first point of contact.

#### **Contact Fields**

- **Name**

- **Relationship to Lead / Client**

- **Email**

- **Phone**

- **Contact Type** (*Primary* or *Secondary*)

### **4.1.6. Add 'Linked Lead'**

Although not part of the original design concept, the **Add Linked Lead** function is a necessary addition to reflect real-world sales scenarios. In many cases, one person (e.g., *Homer*) may contact Trilogy on behalf of multiple clients (e.g., *Homer and Marge*). To accommodate this, the **Contact Information** section will include a button to **Add Linked or Connected Lead**.

#### **Functionality**

- Clicking **Add Linked Lead** will open a **wizard** containing a minimal set of required fields.

- This allows quick creation and linking of another lead profile while maintaining the current contact structure.

- The wizard will require at least the essential details from both the **Made Contact** and **Lead Information** sections.

#### **Data and UI Behavior**

- The linked record establishes a **two-way relationship** between the two leads (e.g., *Lead A* ↔ *Lead B*).

- The **Linked Lead** will appear in the Contact Information section as an additional row, showing:

  - **Name**

  - **Relationship to Lead** (e.g., spouse, sibling, carer)

  - **Contact Type:** *Linked Lead*

- Creating a linked lead does not require separate email or phone fields, though they may be optionally included.

#### **Example Scenario**

If *Homer Simpson* creates a lead form under his own name, his contact record will include:

- **Name:** Homer Simpson

- **Relationship:** Self

- **Email** and **Phone**

- **Contact Type:** Primary

When the sales rep clicks **Add Linked Lead**, a wizard appears allowing quick entry of *Marge Simpson*’s details. In Homer’s lead profile, Marge appears as a **Linked Lead** with the relationship *Spouse*. In Marge’s lead profile, Homer is mirrored as a **Linked Lead** with the relationship *Spouse* as well.

#### **Workflow Benefits**

This feature enables sales reps to:

- Easily manage multiple related clients (e.g., couples or family members).

- Quickly navigate between linked profiles.

- Automatically mirror relationships and relevant data between profiles.

- Optionally suggest or duplicate relevant information when converting one linked lead (e.g., converting *Homer* prompts an option to convert *Marge* as well).

## **4.2. Lead Timeline Tab**

The **Lead Timeline Tab** is a critical feature for tracking and auditing all major updates to a lead’s profile. It provides a chronological record of changes across key data points, enabling better transparency and accountability within the sales process.

#### **Purpose**

The timeline serves as a **timestamped history** of edits and updates, allowing users to see:

- The **previous value** and the **new value** (e.g., Journey Stage changes, Lead Status updates).

- The **date and time** the change occurred.

- The **author** (user who made the update).

#### **Behavior and Functionality**

There are two possible approaches to how changes are captured:

1.  **Event-Based Saving** – Updates are logged whenever a key action occurs, such as updating Lead Status or Journey Stage.

2.  **Manual Save Option** – A general **Save** button allows reps to manually commit all current changes, grouping them into a single timeline event.

The ideal approach can be finalized by design and development, but the end goal remains the same: to **synchronize and record all lead-related changes**—not just to individual fields, but across the entire profile—for a clear, unified activity history.

## **4.3. Attribution Tab**

The **Attribution Tab** consolidates all data related to **lead generation and attribution** for a given lead. It serves as a single location for tracking how the lead was created, sourced, and influenced across both marketing/partnerships and sales touchpoints.

#### **Purpose**

This page functions as a **catch-all for attribution and analytics data**, accommodating both existing and future data capture mechanisms. It ensures consistency between marketing and sales datasets, enabling automation and reporting across different consumer pipelines.

#### **Structure**

The tab will be divided into two main sections:

- **Sales Defined Attribution** – sales-collected attribution data recorded through direct interaction.

- **Lead Generation Attribution** – marketing and automated source data captured at the point of lead creation.

This structure helps delineate between manually gathered sales information and automatically captured marketing data while ensuring both are visible and accessible in one unified view.

#### **Data Handling and Logic**

- All current and future marketing lead capture methods (e.g., forms, ad campaigns, UTM parameters) will feed data into this tab.

- When a lead spawns another linked lead (e.g., *Homer → Marge*), the attribution data from the original lead will be **duplicated** to the new record, except where an existing lead profile already holds attribution values.

- For automation and reporting integrity, all key attribution fields—whether captured automatically or manually—must pass through this tab.

### **4.3.1. Sales Defined Attribution**

The **Sales Defined Attribution** section records attribution data manually gathered by sales representatives. This includes any information captured during direct engagement with the client.

- Captured primarily when the lead status is updated to **Made Contact**.

- Examples include answers to questions like *“How did you hear about Trilogy Care?”*.

- This data reflects the client’s **self-reported awareness source**, which may differ from automated marketing capture.

### **4.3.2. Lead Generation Attribution**

The **Lead Generation Attribution** section contains data captured automatically during the creation of the lead. This typically comes from marketing forms, ad campaigns, or digital tracking systems and also Business Development ID fields where teh lead was a referral from a partnership .

- Includes fields such as **Source**, **Medium**, **Campaign**, and other marketing metadata (e.g., Google Ads, social media, website forms).

- Ensures consistent visibility of marketing-origin data for all leads, including those that enter the system via non-sales channels.

- Data duplication logic applies for linked leads (e.g., *Homer → Marge*), where marketing attribution is carried over unless existing attribution data is already present.

### **4.3.3. Key Information**

In addition to these strict Attribution based fields, some other key fields that need to be displayed include

- Client Name

- Email

- Contact Name

- Summary of Traits if applicable

- First Journey Stage (system generated from when the journey stage is first updated from ‘unknown’ to something else

## **4.4. Options and Traits Tab**

The **Options and Traits Tab** captures information about the client’s chosen management option, unique personal traits, and specific care needs that may influence their service delivery. This tab also acts as the operational hub for initiating **self‑management checks**, **availability lookups**, and **concierge‑style activities**.

#### **Purpose**

The goal of this tab is to centralize all client‑specific contextual information and enable the sales or coordination team to take practical follow‑up actions. For example, it may include tools to assess how many workers exist within a certain area (via Care Vicinity or similar integrations) or whether self‑management options are currently available for the client’s region or service type.

The subsections below will detail these features in more depth.

### **4.4.1. Lead Traits**

The **Lead Traits** subsection provides a quick, intuitive way for sales representatives to capture descriptive information about a client that may influence their care preferences, communication style, or service delivery.

#### **Purpose**

This section allows for structured but flexible entry of personal details that help contextualize the client’s needs, personality, and living situation. It supports both **preset categories** and **custom entries**, ensuring comprehensive coverage of client characteristics.

#### **Categories and Example Values**

Each trait is recorded under a **Category** (multi-select enabled), with common pre-defined options for quick input:

- **Language** – e.g., Non-English Speaking, English as a Second Language, Mandarin, Greek, Italian.

- **Culture** – distinct from language; may include cultural background or heritage group.

- **Living Situation** – e.g., Lives Alone, Lives with Family, Lives with Spouse.

- **Dietary Requirements** – e.g., Shellfish Allergy, Kosher, Halal, Enteral Feeding.

- **Mobility** – e.g., Limited Mobility, Uses Walker, Wheelchair User.

- **Medical Conditions** – general or specific relevant health notes.

- **Interests** – e.g., Knitting, Lawn Bowls, Reading, Gardening.

- **Other** – catch-all for additional relevant details.

#### **Additional Functionality**

- **Custom Value Entry** – Sales reps can add unique text values when none of the preset options apply.

- **Summary Section** – Displays selected traits for easy review, with an option to quickly add commonly used traits.

- **Snapshot Saving** – The section should save as a single event in the **Lead Timeline**, allowing all updates to be recorded together under one timestamp.

### **4.4.2. Address & Location (Repeated) / Required Services**

This section duplicates the **Address Information** field from the Overview Tab for practical reasons. When configuring or viewing client services, it is essential that address information is readily available in this tab.

#### **Purpose**

Re-displaying the address here ensures that all **location-based service setup** and **availability integrations** can occur in one place without switching tabs. The data shown will directly mirror the address values from the lead’s primary record but remain editable if location details change during onboarding or service scoping.

#### **Use in Integrations**

This address field will be the **primary location reference** for any **service availability checks**, **mapping integrations**, or **Care Vicinity–style tools** accessed from within this tab.

#### **Required Services**

Below the address field, a **Required Services** card allows sales reps to record the client’s requested or anticipated services. The interaction works as follows:

- The card initially appears blank with a prompt to **select a service**.

- Upon selection, it expands to display **multi-select buttons** for commonly requested services (e.g., personal care, domestic assistance, nursing, allied health).

- Multiple services can be selected and saved simultaneously.

This feature provides a quick and organized way to capture service requirements directly from within the same context as the client’s address.

### **4.4.3. Management Option / Check Coordination Availability (Dynamic)**

#### **Management Option**

This section allows the sales representative to record the **management model** the client prefers — typically **Self-Management** or **Self-Management Plus (SM+)**. The chosen option determines which follow-up features become available on this tab.

#### **Check SM+ Availability**

If the client selects **Self-Management Plus**, an additional **availability window** opens to assess internal coordination capacity. This feature connects to internal systems or workflows that evaluate **worker availability** for service delivery.

##### **Functionality**

- The window allows entry of key details including **postcode**, **package level**, and the **services** selected above in the Needed Services section.

- These fields are **pre-populated** when the sales rep has entered the same data elsewhere in the profile.

- The rep can then click **Check Availability**, which triggers a request to the relevant internal endpoint or system.

- Once a response is returned, the **availability result** is displayed in this section of the UI.

##### **Notifications**

When an availability response is received, the system will:

- Send a **notification** to the sales representative alerting them that the availability result has been received.

- Display the result **directly within this section**, ensuring the rep can immediately view or act on it without navigating away.

This feature is particularly valuable for **rural or remote clients**, helping the sales team provide realistic expectations of service coordination feasibility during early engagement.

### **4.4.4. Check Service Availability**

This section allows the sales representative to explore real-time **service availability**, regardless of which management option the client selects.

#### **Purpose**

The feature helps sales reps enhance sales discussions by providing transparency on service options in the client’s area. It integrates with external systems such as **Care Vicinity** to display available providers and services based on the client’s selected preferences.

#### **Functionality**

- The section enables the rep to check available providers or workers for each service the client has expressed interest in.

- Results could display a few representative options per selected service (e.g., *cleaners, gardeners, personal care workers*), including indicative rates or details.

- The tool may connect with marketing systems such as **Klaviyo** to send the client a **link to their Care Vicinity search results**, mirroring the parameters used in the sales portal.

- Fields such as **postcode**, **service type**, and **management option** are prefilled where possible, based on previous entries in the lead profile.

#### **Sales Use Case**

This feature is especially helpful for clients evaluating **self‑management** options. By surfacing local service availability during the conversation, the sales rep can:

- Demonstrate the ease of finding suitable providers.

- Reduce uncertainty or hesitation caused by unclear worker availability (a common sales friction point).

- Optionally share a generated search link with the client to explore results directly.

## **4.5. Package Tab**

The **Package Tab** displays key information about the client’s **Home Care Package (HCP)** and their progress through the **My Aged Care (MAC)** system. It centralizes all package‑related fields required for both **tracking** and **onboarding**. It will be split into three main sections.

#### **Purpose**

This tab provides sales representatives with a clear, structured overview of the client’s package journey — from assessment to approval and ongoing management. Several fields here are **mandatory for onboarding**, ensuring that essential information is completed before a client can progress to activation.

### **4.5.1. MAC Progress**

This section consolidates all key MAC-related milestones that define where a lead sits in the care approval journey. Each field supports either direct input or automatic updates tied to journey stage changes.

#### **Field Details**

- **AC Number** – A simple text field for recording the client’s Aged Care Number.

- **MAC First Contacted Date** – A date field indicating when the client first engaged with My Aged Care. This can be entered manually or automatically populated when the Journey Stage is updated to the stage representing MAC contact.

- **Assessment Date** – The date when the client had their ACAT assessment confirmed. Like the previous field, it links to the corresponding journey stage or can be entered manually.

- **Approval Date** – The official date on which the client was approved for a Home Care Package, also tied to the journey stage logic.

- **Approved Before September 1, 2024 (Boolean)** – A manually entered field that identifies whether the client’s approval predates the **No Worse-Off Principle** cutoff. This indicator influences certain downstream onboarding and eligibility processes.

### **4.5.2. Package Information**

This section captures key details for clients who are **existing Home Care Package recipients**, dynamically expanding based on their responses.

#### **Functionality and Fields**

- **Existing Recipient (Boolean)** – A simple Yes/No tick box. Selecting **Yes** reveals additional related fields.

- **Current Provider** – Text input to specify the client’s current Home Care provider.

- **Assessment Type** – Picklist with two options: **ACAT** or **IAT**.

- **Level** – Drop-down with selectable package levels (e.g., Level 1–4).

- **Pensioner Status** – Picklist with options **Full Pensioner**, **Part Pensioner**, or **Self-Funded Retiree**.

- **Contribution Rates** – If known, allows entry of percentage values for the two variable contribution components:

  - **Everyday Living**

  - **Independence**

If the client’s approval date (from Section 4.5.1) indicates they were **approved before September 1, 2024**, these contribution rate fields will appear **greyed out** and read-only. Otherwise, they remain editable for manual input.

This design ensures data capture is context-aware, reducing clutter for non-recipients while presenting complete package information for active recipients.

### **4.5.3. Onboarding Information**

This section captures all **key onboarding details** required to activate or transfer a client’s Home Care Package to Trilogy Care. These fields ensure all critical package dates, codes, and preferences are recorded accurately for operational readiness.

#### **Field Details**

- **Cessation Date** – The end date of the client’s current package with another provider, if applicable. This date typically aligns with when Trilogy Care will begin managing the client’s package if transferring.

- **Commencement Date / End Date** – Two date fields capturing:

  - **Commencement Date** – The planned start date for Trilogy Care’s management of the client’s package.

  - **End Date** – The expiry date of the current package allocation, typically **56 days after the allocation date** in the MAC system. Both are standard date inputs.

- **Referral Code** – A unique identifier used to lodge the client with Trilogy Care. This follows a fixed pattern (e.g., two dashes with several digits).

- **Preferred Management Option** – Drop-down selection between **Self-Managed** and **Self-Management Plus (SM+)**, aligning with the client’s chosen care management model.

Together, these fields form the **onboarding data foundation**, ensuring all operational prerequisites are complete before the client’s transition or activation within Trilogy Care’s systems.

# **5. Conversion Wizard**

The **Conversion Wizard** serves as the central **sales interface** for converting a lead into an active Home Care Package client. This guided process ensures all required onboarding, compliance, and agreement steps are completed within a single, structured flow.

#### **Purpose**

The wizard represents the **final step of the sales pipeline**, culminating in a signed **Home Care Agreement** and the automatic creation of a **Package Record** within Portal. It integrates both **sales** and **clinical onboarding** elements to streamline client activation.

While this document details the intended design and functionality, specific components—especially those related to **Home Care Agreement workflows** and **IAT/ACAT extraction**—may evolve in line with ongoing onboarding system changes.

Nevertheless, the following outlines the current vision and requirements for the Conversion Wizard experience.

## **5.1. Mandatory Field Checks**

When a **Sales Representative** selects **Convert Package**, the system will first display the same fields found in the **Made Contact** status transition. These fields are mandatory prerequisites for conversion, ensuring all essential client information has been captured.

#### **Behavior**

- If the Sales Rep has **already completed** these fields within the lead profile or during the earlier *Made Contact* stage, they will appear **prefilled** and ready for confirmation.

- The rep can quickly review the values and proceed by selecting **Next**.

- If the conversion occurs **on the first client call**, the wizard will display the **Made Contact** fields for completion before allowing the conversion to continue.

#### **Rationale**

This safeguard prevents critical data from being skipped during conversion—a common issue when sales reps attempt to convert a client prematurely. By enforcing these mandatory fields upfront, the process ensures that all relevant lead, attribution, and contact details are properly recorded before progressing to package creation.

See section **3.2.2.1 Made Contact** for the full list of mandatory fields referenced here.

## **5.2. Convert Lead to Package Stepper**

After confirming the mandatory **Made Contact** details, the sales representative proceeds to the **Convert Lead to Package Stepper**. This guided process is divided into **four sequential sections**, each representing a distinct stage of the conversion workflow. The stepper structure ensures a logical, step-by-step progression from verification through to final agreement.

### **5.2.1. MAC Details**

The **MAC Details** step is the first stage in the conversion stepper. It captures the **essential My Aged Care (MAC) information** required to successfully convert a lead into a client package record. These fields form the foundation of the conversion process, ensuring all baseline data is in place before continuing.

#### **5.2.1.1. Package Details**

This section records the **core package information** required for conversion. Each field uses a **single-select picklist** to standardize data entry and prevent errors.

**Fields:**

- **Referral Code** – Text input for the unique MAC referral identifier.

- **Level** – Single-select picklist representing the approved package level (e.g., Level 1–4).

- **Preferred Management Option** – Single-select picklist with values such as *Self-Managed* or *Self-Management Plus*.

- **Financial Status** – Single-select picklist defining the client’s funding status (e.g., *Full Pensioner*, *Part Pensioner*, *Self-Funded Retiree*).

These details form the minimum data set needed to create a valid package record.

#### **5.2.1.2. Dates**

This subsection captures the **key timeline dates** for the package conversion.

**Fields**

- **Commencement Date** — the date Trilogy Care will begin managing the client’s package.

- **Cessation Date** — the date the client’s current provider arrangement ends (or the package concludes).

**Validation**

- The system must **prevent Cessation Date from being earlier than Commencement Date** and display a clear inline error.

**Note Box**

- Provide a **note box** beneath the date fields for any contextual details (e.g., transfer timing, special circumstances).

#### **5.2.1.3. HCA Recipients**

This section provides a condensed view of the **Contacts module**, showing all contacts linked to the lead who have an email address. These are the addresses available for sending the **Home Care Agreement (HCA)**.

- Displays **Name**, **Role** (Lead/Primary), and **Email Address**.

- The **Lead** and **Primary Contact** are preselected by default.

- Multiple contacts can be selected to receive the HCA simultaneously.

- A **Quick Add Contact** button allows new contacts to be added directly without leaving this view.

This ensures the sales rep can quickly review, add, and select the right recipients before sending agreements.

##### **5.2.1.3.1. Quick Add Contact**

The **Quick Add Contact** feature enables sales reps to add an additional contact inline within the stepper.

**Fields:** Name, Relationship to Lead, Email Address.

When added, the contact instantly appears in the recipient list and can be selected for the HCA. This keeps contact management simple, fast, and within the same workflow.

### **5.2.2. ACAT/IAT Extraction**

The **ACAT/IAT Extraction** step fulfills the system’s need to gather and process data from the client’s **My Aged Care (MAC)** assessment documentation.

#### **Purpose**

This step ensures that all screening and eligibility data are accurately captured, either automatically or manually, for onboarding and compliance purposes.

#### **Functionality**

- The system first retrieves the **Referral Code** and attempts to automatically extract the **IAT or ACAT** data through a **Webhook** or **API** call.

- If automatic retrieval fails, a fallback option allows the **Sales Representative** to manually **upload** the assessment file.

- The upload field accepts **PDF** files and includes a selector for identifying whether the file is an **IAT** or **ACAT** document.

#### **Validation & Notifications**

- The system displays a **success or error message** based on whether the extraction or upload was successful.

- Any successful extraction or processing result triggers a **notification** in the sales rep’s UI, displayed within this step of the wizard.

This approach provides flexibility for both automated data handling and manual entry, ensuring essential assessment data is always available for conversion.

### **5.2.3. Screening Questions**

The **Screening Questions** step captures additional manual data to complement the information extracted from the **IAT/ACAT**. Together, these inputs determine the client’s eligibility and suitability, which will be summarized in the next stepper (Result).

#### **Functionality**

- All screening fields are presented as **radio buttons** (Yes/No) or **single-select picklists**.

- The UI uses the VIBE design system for consistency and clarity.

- Responses are **saved automatically** and linked to the client’s lead record for reference in the result step.

#### **Screening Fields**

1.  **Previously Offboarded by Trilogy** – Yes/No

2.  **Switching from a Self-Managed Provider** – Yes/No

3.  **Number of Previous Providers** – Single-select: *1*, *2*, *3+*, or *N/A*

4.  **Can Use Online Banking** – Yes/No

5.  **Has Support for Technology** – Yes/No

Each answer contributes to the evaluation logic that determines the **screening result**, alongside the extracted **ACAT/IAT** data. This combined data set ensures the system can assess conversion readiness with both automated and human-verified inputs.

### **5.2.4. Result**

The **Result** step displays the outcome of the screening and eligibility process, combining data from the **ACAT/IAT Extraction** and **Screening Questions**.

#### **Possible Outcomes**

The system can return one of three distinct outcomes:

- **Approved** – The lead is fully approved for conversion to a client package.

- **Coordinator Approved** – The lead is approved for coordination services only.

- **Rejected** – The lead is not eligible for conversion at this stage.

#### **Additional Data Fields**

Each outcome record will include:

- **Confidence Rating** – Numeric or visual indicator of certainty based on available data.

- **Risk Score** – System-generated risk metric derived from assessment and screening inputs.

- **Assessment Date** – The date the result was finalized or last updated.

This final step concludes the **Convert Lead to Package Stepper**, ensuring all eligibility checks and system validations are complete before proceeding to Home Care Agreement preparation.

### **5.3. HCA Page**

The **HCA Page** is where the **Home Care Agreement** is prepared, previewed, and sent to the client. It is divided into three main parts to simplify the agreement process and ensure accuracy before sending.

#### **5.3.1. Recipient Confirmation**

This section lists the contacts selected to receive the Home Care Agreement. These are drawn from the contacts identified during the conversion process (see Section 5.2.1.3). The list allows the sales representative to confirm recipients before proceeding to send.

#### **5.3.2. HCA Preview**

This section displays a scrollable preview of the **Home Care Agreement**, including all legal terms, conditions, and client‑specific details. It ensures the representative can review the document in full before dispatch.

#### **5.3.3. Send Agreement**

From this section, the sales representative can send the Home Care Agreement directly to the confirmed recipients. Once sent, the client receives the agreement for signature and the workflow automatically tracks its completion status.

#### **5.3.4. Upload Alternative Signature**

As an alternative to sending the agreement digitally, the sales representative can upload a **client signature** directly within the portal.

Upon selecting **Upload Signature**, a secondary window appears prompting the user to choose a **signature type**:

- **Written Signature** – Allows upload of a signed **PDF** version of the Home Care Agreement.

- **Call Recording** – Enables submission of a **Call ID** and corresponding **transcript text**.

The call transcript must meet internal compliance requirements confirming the client’s explicit consent to the agreement. A disclaimer outlines these requirements in detail.

This should also align with the same manual signature capture that exists in other portal workflows.

#### **Validation and Confirmation**

- The system will display **validation messages** confirming whether each upload was successful or flagging any errors.

- Once a valid signature (written or call) is uploaded, the agreement is considered **signed**.

After completion, the system returns the user to the **HCA Page**, where the agreement now appears as a **signed copy**. No further action from the client is required, marking the end of the HCA workflow.

### **5.4. Convert Linked Lead**

In some cases, a lead represents more than one individual—such as a couple or family members. The Convert Linked Lead function streamlines the process of converting both individuals into separate packages while maintaining their connection.

#### Functionality

- When the primary lead is converted and a Linked Lead exists, the system prompts the user to Convert Linked Lead.

- If the user selects Yes, the UI automatically transitions to the linked lead’s profile and restarts the conversion workflow:

  - Confirm Made Contact mandatory fields.

  - Proceed through the Convert Lead to Package Stepper.

  - Continue to the Home Care Agreement (HCA) Page for review and signing.

- If the user selects No, the process concludes, and the user is redirected to the converted lead’s Package page.

This feature ensures linked clients can be converted efficiently in sequence, reducing friction for cases involving couples or related parties

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
