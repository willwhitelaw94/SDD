---
title: AI Automation Initiatives - TC Portal
---

> Comprehensive roadmap of AI/ML automation opportunities across the Trilogy Care workflow lifecycle

- - -

## Overview

This document outlines automation opportunities across 7 key stages of the care management process. Each initiative aims to reduce manual work, improve accuracy, and enable care teams to focus on high-value client interactions.

**Total Estimated Monthly Impact:** ~15,500-19,800 automated records/tasks

> Includes ~1,500-2,800/month from Provider Onboarding automation (Stage 7)

- - -

## Stage 1: Lead Management

### 1.1 Lead Calls (Sales Phone Only)

**Current Process:** Sales team manually takes notes during calls with prospective clients.

**Automation Opportunities:**

* AI transcriptions to summarize notes, score call intent, identify lead traits, and prioritize next steps
* Extract contact details, categorize intent, and flag risks
* Generate picklists to capture what's most important to the lead (e.g., services, location, cost)

**Estimated Impact:** ~1,000-2,000 records/month

**Key Benefits:**

* Faster lead qualification
* Consistent data capture
* Automated lead scoring and prioritization

**Target Users:**

* Sales Team (STEPHEN, JACQUI, BERNIE)
* Onboarding Team

**Technical Considerations:**

* Voice transcription API (e.g., AssemblyAI, Deepgram, OpenAI Whisper)
* NLP for intent classification and entity extraction
* Integration with CRM/lead management system

- - -

### 1.2 Questionnaire

**Current Process:** Manual data entry from questionnaire forms and government portal PDFs (ACAT/IAT).

**Automation Opportunities:**

* Extract questionnaire data from form submissions
* Scrape government portal for PDF ACAT/IAT data, convert to JSON
* Use AI to categorize recipient data and generate recommended care plan, budget, and risk assessment

**Estimated Impact:** ~400-500 records/month

**Key Benefits:**

* Eliminate manual data entry
* Auto-generate initial care plan drafts
* Identify risks early in the process

**Target Users:**

* Assessment Team (PAT & SIAN)
* Care Partners

**Technical Considerations:**

* PDF parsing (e.g., PyPDF2, pdfplumber, or OCR for scanned docs)
* Form data extraction and validation
* AI model for care plan generation (LLM with prompt engineering)
* Integration with Package/BudgetPlan domains

- - -

## Stage 2: Needs Assessment

### 2.1 Medical Summary

**Current Process:** Manual review of Medical Health Summary PDFs to identify risks and needs.

**Automation Opportunities:**

* Extract text from Medical Health Summary assessment PDFs
* Use AI to cross-reference with other assessment data (questionnaire, care partner notes) to identify risks, needs, and goals
* Summarize data into actionable items

**Estimated Impact:** ~200-300 records/month

**Key Benefits:**

* Faster risk identification
* Comprehensive cross-referencing of multiple data sources
* Actionable summaries for care teams

**Target Users:**

* Assessment Team
* Clinical Team (Clinical Nurse)
* Care Partners

**Technical Considerations:**

* PDF text extraction
* AI summarization and cross-referencing
* Risk scoring/classification model
* Integration with clinical records and Package needs

- - -

### 2.2 Meeting Conducted (Post-Assessment)

**Current Process:** Manual note-taking and care plan refinement after assessment meetings.

**Automation Opportunities:**

* Summarize post-assessment meeting transcripts using AI to refine care plans and suggest additional services
* Provide recommendations for care plan improvement
* Compare notes with initial care plan and generate updated content

**Estimated Impact:** ~400-500 records/month

**Key Benefits:**

* Consistent meeting documentation
* AI-suggested care plan improvements
* Version tracking of care plan changes

**Target Users:**

* Assessment Team
* Care Partners
* Clinical Team

**Technical Considerations:**

* Meeting transcription (Zoom API, AssemblyAI, etc.)
* AI comparison of initial vs. updated care plans
* Care plan versioning (potentially event sourcing)
* Integration with BudgetPlan domain

- - -

## Stage 3: Care Planning

### 3.1 Care Plan Written

**Current Process:** Care Partners manually write care plans; manual QA for compliance.

**Automation Opportunities:**

* AI proofing for consistency, grammar, spelling errors, and formatting compliance
* Ensure care plan aligns with regulatory standards (e.g., measurable goals, review schedules)
* With holistic care plan, identify vulnerability rating and other high-level classifications (tags) for the Package

**Estimated Impact:** ~400-500 records/month

**Key Benefits:**

* Regulatory compliance assurance
* Consistent formatting and quality
* Auto-classification of vulnerability and risk levels

**Target Users:**

* Care Partners
* Quality Team (ERIN, MEAGAN)

**Technical Considerations:**

* AI grammar/compliance checker (GPT-4, Claude)
* Regulatory rules engine
* Tagging and classification system for Packages
* Integration with Package domain

- - -

### 3.2 Assigning a Case Manager

**Current Process:** Manual assignment of Care Partners/Coordinators based on location, language, and client needs.

**Automation Opportunities:**

* Look up internal database to find the most suitable Care Partner and/or Coordinator based on:

  * Geographic location
  * Language preferences
  * Client needs
  * Workload capacity
* AI recommends best-fit assignments with reasoning for the choice

**Estimated Impact:** ~400-500 assignments/month

**Key Benefits:**

* Faster, data-driven assignments
* Better care partner/client matching
* Balanced workload distribution

**Target Users:**

* Case Managers (supervise coordinators)
* Administrators
* Onboarding Team

**Technical Considerations:**

* Requires storing detailed Care Partner profiles (location, languages, specialties, capacity)
* Matching algorithm (rule-based + ML scoring)
* Integration with User domain and Package assignments

**Dependencies:**

* Need to build Care Partner profile management system first

- - -

## Stage 4: Care Delivery (Calls Made)

### 4.1 General Call Classifications

**Current Process:** Manual note-taking and task creation after calls with clients.

**Automation Opportunities:**

* AI transcription and summarization of calls
* Generate general tasks and action items for the right stakeholders
* Custom tagging: Apply Trilogy's custom tag classifications (for Notes)
* Log summary + transcript + tags to call records in CRM/Portal for easy call reviewing

**Estimated Impact:** ~10,000 calls/month

**Key Benefits:**

* Automatic call documentation
* Consistent tagging and classification
* Actionable task generation
* Searchable call history

**Target Users:**

* Care Partners
* Care Coordinators
* Clinical Team

**Technical Considerations:**

* Real-time or batch transcription
* AI summarization and task extraction
* Custom tag taxonomy and classification model
* Storage: summaries in database, full transcripts in blob storage (S3/similar)
* Integration with Notes/Tasks system

**Privacy/Compliance:**

* GDPR/privacy compliance for call recordings
* Secure storage and access controls
* Consent and notification requirements

- - -

### 4.2 Need/Goal/Budget Change

**Current Process:** Manual detection of care plan changes discussed in calls/emails.

**Automation Opportunities:**

* Analyze calls and emails for discussions related to changes in:

  * Client needs
  * Living situation
  * Goals
* Trigger workflows to update care plans, budgets, or service utilization in draft stage
* Require Care Partner approval before committing changes

**Estimated Impact:** TBD (subset of 10,000 calls)

**Key Benefits:**

* Proactive care plan updates
* Reduced risk of outdated care plans
* Automated draft creation with human-in-the-loop

**Target Users:**

* Care Partners
* Care Coordinators

**Technical Considerations:**

* NLP model to detect change signals
* Draft budget/care plan creation
* Workflow/approval system
* Integration with BudgetPlan and Package domains
* Event sourcing for audit trail

- - -

### 4.3 Incidents Logged

**Current Process:** Manual incident logging after calls.

**Automation Opportunities:**

* Log specific incidents (e.g., falls, medication issues) flagged during calls
* Categorize incidents by severity and trigger workflows for follow-up or escalation
* Create recommendations and action plans that fit clinical policy

**Estimated Impact:** ~300-500 incidents/month

**Key Benefits:**

* Faster incident reporting
* Consistent categorization and severity scoring
* Automated escalation workflows

**Target Users:**

* Care Partners
* Clinical Team
* Quality Team

**Technical Considerations:**

* Incident classification model
* Severity scoring algorithm
* Escalation workflow engine
* Integration with incident management system (if exists) or new Incident domain
* Compliance with Serious Incident Response Scheme

- - -

### 4.4 Risks Identified

**Current Process:** Manual risk identification during calls.

**Automation Opportunities:**

* Detect minor risks based on Risk Criteria during calls (keywords/phrases like fall risks, health changes)
* Assign severity scores and log risks in risk management system

**Estimated Impact:** ~100-200 risks/month

**Key Benefits:**

* Proactive risk detection
* Consistent risk scoring
* Centralized risk tracking

**Target Users:**

* Care Partners
* Clinical Team

**Technical Considerations:**

* Risk keyword/phrase detection model
* Risk severity scoring
* Integration with Package risk management
* Relationship to clinical team workflows

- - -

### 4.5 Refine Risk (Backlog)

**Current Status:** Backlog item - current risk data is not refined.

**Automation Opportunities:**

* Work through backlog of existing risk data in context with other client data
* When risks are identified by Care Partner, classify and refine shorthand info
* Standardize risk data format

**Estimated Impact:** TBD (one-time backlog processing + ongoing)

**Key Benefits:**

* Clean, structured risk data
* Better reporting and analytics
* Improved clinical decision-making

**Target Users:**

* Clinical Team
* Care Partners
* Data/Analytics Team

**Technical Considerations:**

* Data migration and cleanup
* Risk taxonomy and standardization
* AI-assisted classification of existing unstructured data

- - -

### 4.6 Feedback

**Current Process:** Manual feedback review and classification.

**Automation Opportunities:**

* Analyze feedback from clients or families to help Operations team classify it
* Identify potential feedback or complaints made via phone calls
* Flag sentiment (positive/negative) on a scale of 1-5
* Generate reports for service improvement

**Estimated Impact:** ~100-200 feedback items/month

**Key Benefits:**

* Automated sentiment analysis
* Faster identification of complaints
* Data-driven service improvement

**Target Users:**

* Quality Team
* Operations Team
* Care Partners

**Technical Considerations:**

* Sentiment analysis model
* Feedback classification taxonomy
* Reporting dashboard
* Integration with Quality domain

- - -

### 4.7 Requests (Cab Charge, OT Reports, Meals, etc.)

**Current Process:** Manual detection and processing of client requests.

**Automation Opportunities:**

* Detect specific client requests during calls (e.g., cab charge, OT reports, meals)
* Validate against client's budget
* Recommend budget adjustments or create tasks
* Ensure budget utilization aligns with service requirements

**Estimated Impact:** ~100-200 requests/month

**Key Benefits:**

* Faster request processing
* Automatic budget validation
* Task creation for fulfillment

**Target Users:**

* Care Partners
* Finance Team
* Service Providers

**Technical Considerations:**

* Request entity extraction
* Budget validation logic
* Task/workflow creation
* Integration with BudgetPlan and Billing domains

- - -

### 4.8 Package Upgrade

**Current Process:** Manual detection and processing of package upgrade requests.

**Automation Opportunities:**

* Detect Package Upgrade Requests from calls (different logic from general tasks)
* Automate workflows to notify care teams about package changes
* Trigger reassessment or budget review processes

**Estimated Impact:** ~50-100 requests/month

**Key Benefits:**

* Faster package upgrade processing
* Automated notification workflows
* Better tracking of upgrade requests

**Target Users:**

* Care Partners
* Sales/Onboarding Team
* Finance Team

**Technical Considerations:**

* Specialized request detection (different from general requests)
* Workflow automation for upgrades
* Integration with Package domain
* Possible integration with Services Australia API

- - -

### 4.9 Check-ins

**Current Process:** Manual documentation of routine check-in calls.

**Automation Opportunities:**

* Extension of General Call Summary
* Tag phone calls as "Check-in" and summarize notes
* Use AI to contextualize unique note type to write check-in notes reflective of recent goals, needs, and budgets
* Generate actionable insights for care teams and families

**Estimated Impact:** ~200-400 check-ins/month

**Key Benefits:**

* Consistent check-in documentation
* Context-aware note generation
* Actionable insights for ongoing care management

**Target Users:**

* Care Partners
* Care Coordinators

**Technical Considerations:**

* Check-in classification
* Context-aware summarization (pull in recent care plan, goals, budgets)
* Integration with Package and BudgetPlan data

- - -

## Stage 5: Bill Management

### 5.1 Bill Analysis

**Current Process:** Manual extraction and categorization of bill data.

**Automation Opportunities:**

* Extract data from bills (e.g., client name, provider, line items) into JSON format
* Categorize line items and match against client budgets
* Recommend adjustments or highlight discrepancies using match suitability formula for budget alignment
* Automate insights into budget utilization

**Estimated Impact:** ~200-400 bills/month

**Key Benefits:**

* Faster bill processing
* Automatic budget matching
* Early discrepancy detection
* Better budget utilization insights

**Target Users:**

* Finance Team (MELLETTE, GUS)
* Care Partners

**Technical Considerations:**

* PDF/document parsing
* Line item classification
* Budget matching algorithm
* Integration with Billing and BudgetPlan domains
* Potential integration with existing bill processing workflows

- - -

### 5.2 Bill Notes for Case Management

**Current Process:** Manual review of bill notes to identify case management implications.

**Automation Opportunities:**

* Review bill notes and use AI to suggest tasks or next steps for case managers
* Flag unusual expenses
* Recommend budget reviews
* Feed insights back into care plans or risk tracking systems

**Estimated Impact:** ~100-200 bill notes/month

**Key Benefits:**

* Proactive case management insights from financial data
* Early detection of budget issues
* Better integration of financial and care planning

**Target Users:**

* Care Partners
* Finance Team

**Technical Considerations:**

* Bill note analysis and task generation
* Integration with case management workflows
* Feedback loop to BudgetPlan and Package domains

- - -

## Stage 6: OT Reports / Inclusions

### 6.1 OT Report Provided

**Current Process:** Manual review of Occupational Therapist reports.

**Automation Opportunities:**

* Convert OT reports into text (PDF parsing)
* Analyze reports for risks, goals, needs, and budget implications
* Cross-reference with existing care plans and trigger updates where necessary

**Estimated Impact:** ~50-100 reports/month

**Key Benefits:**

* Faster OT report processing
* Automatic care plan updates
* Risk identification from clinical reports

**Target Users:**

* Clinical Team
* Care Partners
* Assessment Team

**Technical Considerations:**

* PDF text extraction
* Clinical entity extraction (risks, goals, recommendations)
* Care plan update workflows
* Integration with Package and clinical data

- - -

### 6.2 Inclusion/Exclusion

**Current Process:** Manual processing of inclusion/exclusion requests based on 11-question framework.

**Automation Opportunities:**

* Automate identification of inclusion/exclusion requests
* Apply 11-question framework for decision support
* Prefill relevant fields in records for faster processing

**Estimated Impact:** ~50-100 requests/month

**Key Benefits:**

* Faster inclusion/exclusion decisions
* Consistent application of framework
* Reduced manual data entry

**Target Users:**

* Care Partners
* Clinical Team
* Finance Team

**Technical Considerations:**

* 11-question framework logic (decision tree or rule engine)
* Request classification
* Form prefilling
* Integration with service approval workflows

- - -

## Technical Architecture Considerations

### Core AI/ML Infrastructure

**Transcription & Speech-to-Text:**

* AssemblyAI, Deepgram, or OpenAI Whisper
* Real-time vs. batch processing
* Language support (multilingual clients)

**Natural Language Processing:**

* OpenAI GPT-4 / Claude for summarization, classification, task extraction
* Fine-tuning for domain-specific terminology (aged care, HCP)
* Prompt engineering and template management

**Document Processing:**

* PDF parsing: PyPDF2, pdfplumber, or Tesseract OCR for scanned docs
* Form data extraction
* Structured data output (JSON)

**Data Storage:**

* Summaries and structured data: PostgreSQL (existing)
* Full transcripts and large documents: Blob storage (S3, Azure Blob)
* Vector embeddings for semantic search: Pinecone, Weaviate, or pgvector

**Queue and Async Processing:**

* Laravel Queues + Horizon (existing)
* Background jobs for AI processing
* Webhook handlers for external API callbacks

**Monitoring & Logging:**

* AI job success/failure rates
* Processing times and costs
* Accuracy metrics (human-in-the-loop feedback)

- - -

## Privacy, Security, and Compliance

**Key Considerations:**

* **Consent:** Client consent for call recording and AI processing
* **Data Privacy:** Compliance with Australian Privacy Principles, GDPR
* **Secure Storage:** Encrypted storage for sensitive data
* **Access Controls:** Role-based access to AI-generated content
* **Audit Trail:** Event sourcing for AI decisions and human overrides
* **De-identification:** Consider de-identifying data for model training

**Serious Incident Response Scheme:**

* Ensure AI-flagged incidents comply with mandatory reporting requirements
* Clinical team review and approval before submission

- - -

## Implementation Priorities

### Phase 1: High-Impact, Low-Complexity

1. **General Call Classifications** (Stage 4.1) - Highest volume, foundational
2. **Care Plan Proofing** (Stage 3.1) - Immediate quality improvement
3. **Bill Analysis** (Stage 5.1) - High ROI, existing pain point

### Phase 2: Risk and Compliance

4. **Incidents Logged** (Stage 4.3) - Compliance and safety
5. **Risks Identified** (Stage 4.4) - Proactive risk management
6. **Medical Summary** (Stage 2.1) - Clinical decision support

### Phase 3: Workflow Automation

7. **Need/Goal/Budget Change** (Stage 4.2) - Proactive care plan updates
8. **Lead Calls** (Stage 1.1) - Sales pipeline optimization
9. **Assigning a Case Manager** (Stage 3.2) - Workload balancing

### Phase 4: Advanced Features

10. **Questionnaire** (Stage 1.2) - End-to-end onboarding automation
11. **OT Reports** (Stage 6.1) - Clinical integration
12. **Refine Risk Backlog** (Stage 4.5) - Data quality improvement

- - -

## Success Metrics

**Efficiency Metrics:**

* Time saved per Care Partner/Coordinator (hours/week)
* Reduction in manual data entry (%)
* Faster turnaround times (lead-to-client, incident-to-resolution)

**Quality Metrics:**

* Care plan compliance rate
* Incident detection accuracy
* Risk identification recall/precision

**Financial Metrics:**

* Cost savings from automation
* AI processing costs vs. manual labor costs
* Budget utilization improvement

**User Satisfaction:**

* Care Partner satisfaction with AI tools
* Reduction in administrative burden (survey)
* Client satisfaction with care responsiveness

- - -

## Next Steps

1. **Prioritize** specific initiatives based on business impact and technical feasibility
2. **Prototype** high-priority features (e.g., call transcription + summarization)
3. **Pilot** with small user group (e.g., 5-10 Care Partners)
4. **Iterate** based on feedback and metrics
5. **Scale** to all users with feature flags

- - -

## Stage 7: Provider Onboarding

> **Note:** This stage was identified as a key automation opportunity during BRP planning and is critical for the Support at Home transition (100% supplier recontracting by November 2025).

### 7.1 Document Submission

**Current Process:** Manual review of submitted provider documents (IDs, certifications, qualifications).

**Automation Opportunities:**

* Use AI to extract data from submitted documents (e.g., names, dates, identification numbers)
* Flag expired documents or mismatched information (e.g., name discrepancies)
* Verify if the person in submitted documents matches system data using image/text matching AI models (identity verification algorithms)

**Estimated Impact:** ~500-1,000 submissions/month

**Key Benefits:**

* Faster document processing
* Automatic expiry detection
* Reduced manual verification effort
* Identity mismatch flagging

**Target Users:**

* Supplier Onboarding Team
* Compliance Team
* Operations

**Technical Considerations:**

* Document text extraction (OCR for scanned docs)
* Identity verification algorithms
* Expiry date parsing and alerting
* Integration with Supplier domain and onboarding workflow

- - -

### 7.2 Checking Insurance Policies

**Current Process:** Manual extraction and validation of insurance policy details.

**Automation Opportunities:**

* Extract key fields from insurance policy summaries (e.g., coverage amount, expiration dates, liability limits)
* Flag missing or insufficient liability coverage based on pre-set thresholds
* Auto-validate against Trilogy's minimum insurance requirements

**Estimated Impact:** ~400-800 policies/month

**Key Benefits:**

* Faster insurance validation
* Automatic coverage gap detection
* Compliance assurance
* Reduced manual review time

**Target Users:**

* Supplier Onboarding Team
* Compliance Team
* Finance Team

**Technical Considerations:**

* PDF parsing for insurance documents
* Field extraction (coverage amounts, dates, policy numbers)
* Rules engine for minimum coverage requirements
* Alerting for insufficient or expiring coverage

- - -

### 7.3 Conducting an Audit

**Current Process:** Manual audit form distribution and review.

**Automation Opportunities:**

* Automate sending audit forms to providers
* Prefill known information (e.g., prior issues, flagged items)
* Use AI to analyze submitted forms for anomalies or missing fields
* Review employee registers automatically for completeness and compliance (e.g., required certifications, licensing)

**Estimated Impact:** ~300-500 audits/month

**Key Benefits:**

* Faster audit initiation
* Consistent audit form distribution
* Automatic anomaly detection
* Compliance verification

**Target Users:**

* Compliance Team
* Quality Team
* Operations

**Technical Considerations:**

* Automated form distribution workflow
* Prefilling from existing provider data
* Anomaly detection model
* Employee register validation rules
* Integration with audit tracking system

- - -

### 7.4 Phone Audit

**Current Process:** Manual transcription and documentation of phone audits.

**Automation Opportunities:**

* Use AI transcription to summarize phone audit conversations
* Flag inconsistencies between verbal responses and submitted documentation
* Generate audit write-ups automatically based on findings
* Cross-reference verbal claims with system data

**Estimated Impact:** ~300-500 phone audits/month

**Key Benefits:**

* Faster audit documentation
* Automatic inconsistency detection
* Consistent audit write-up format
* Better audit trail

**Target Users:**

* Compliance Team
* Quality Team

**Technical Considerations:**

* Phone call transcription
* AI summarization
* Cross-referencing with provider documentation
* Audit report generation
* Integration with compliance tracking

- - -

*This document serves as a living roadmap for AI automation initiatives. It should be updated as initiatives are implemented, deprioritized, or new opportunities emerge.*

- - -

## Related Documentation

* [Product Mission](Product%20Mission.md) - Overall product vision and goals
* [Departments & Stakeholders](Departments%20&%20Stakeholders.md) - User roles and responsibilities
* [Roadmap](Roadmap.md) - Current development priorities

- - -

## Industry Adoption: AI in Software Development

The industry is rapidly embracing AI-assisted development. Here we catalogue real-world examples from reputable industry figures.

---

### Linus Torvalds — Creator of Linux & Git

**January 2026** — Linus Torvalds, arguably the most influential software engineer alive, is now using AI to write code.

> "This is Google Antigravity fixing up my visualization tool (which was also generated with help from google, but of the normal kind).
>
> It mostly went smoothly, although I had to figure out what the problem with using the builtin rectangle select was. After telling antigravity to just do a custom RectangleSelector, things went much better.
>
> **Is this much better than I could do by hand? Sure is.**"

![Linus Torvalds Vibe Coding](/images/strategy/ai-initiatives/linus-torvalds-vibe-coding.webp)

**Primary Sources:**
- [GitHub Commit](https://github.com/torvalds/AudioNoise/commit/93a72563cba609a414297b558cb46ddd3ce9d6b5) — The actual commit with Linus's message
- [AudioNoise Repository](https://github.com/torvalds/AudioNoise) — Linus's personal visualization tool project
- [X Post: @MMatt14](https://x.com/MMatt14/status/2010188315572793467) — "Linus is Vibecoding now. It's literally over, they might vibe-code the Linux kernel now"
- [X Post: @krishnanrohit](https://x.com/krishnanrohit/status/2010138009388364190) — Discussion thread

**Why This Matters:**

If Linus Torvalds—who created the tools that run nearly every server on earth—says AI coding is "much better than I could do by hand," that's not hype. That's the industry's most credible voice validating the direction we're taking.

---

### Andrej Karpathy — Coined "Vibe Coding"

**February 2025** — Co-founder of OpenAI, former AI Director at Tesla

> "There's a new kind of coding I call 'vibe coding', where you fully give in to the vibes, embrace exponentials, and forget that the code even exists."

**Primary Sources:**
- [Original Tweet (4.5M+ views)](https://x.com/karpathy/status/1886192184808149383)

---

### Jensen Huang — NVIDIA CEO

**2025** — Founder and CEO of NVIDIA, the company powering most AI compute globally

> "Nothing would give me more joy than if none of them are coding at all."

> "The purpose of a software engineer is to solve known problems and to find new problems to solve. Coding is one of the tasks."

> "We use Cursor here, and we use Cursor pervasively here. Every engineer uses it."

**Primary Sources:**
- [No Priors Podcast (Spotify)](https://open.spotify.com/episode/4kSlkESoQ8GPU6meWACSlf)
- [Podscripts Transcript](https://podscripts.co/podcasts/no-priors-artificial-intelligence-technology-startups/nvidias-jensen-huang-on-reasoning-models-robotics-and-refuting-the-ai-bubble-narrative)

---

### Sundar Pichai — Google/Alphabet CEO

**October 2024 → April 2025** — 25% → 30%+ of Google's new code is AI-generated

> "Today, more than a quarter of all new code at Google is generated by AI, then reviewed and accepted by engineers."

**Primary Sources:**
- [Fortune - October 2024](https://fortune.com/2024/10/30/googles-code-ai-sundar-pichai/)
- [The Hill - October 2024](https://thehill.com/policy/technology/4962336-google-ceo-says-more-than-25-percent-of-companys-new-code-written-by-ai/)

---

### Satya Nadella — Microsoft CEO

**April 2025** — 30-40% of Microsoft code is AI-generated, "going up monotonically"

> "Maybe 20%, 30% of the code that is inside of our repos today... are probably all written by software."

Microsoft CTO Kevin Scott expects **95% of all code to be AI-generated by 2030**.

**Primary Sources:**
- [CNBC - April 2025](https://www.cnbc.com/2025/04/29/satya-nadella-says-as-much-as-30percent-of-microsoft-code-is-written-by-ai.html)
- [TechCrunch - April 2025](https://techcrunch.com/2025/04/29/microsoft-ceo-says-up-to-30-of-the-companys-code-was-written-by-ai/)

---

### Mark Zuckerberg — Meta CEO

**April 2025** — Predicts 50% of Meta development done by AI within a year

> "Every engineer is basically gonna end up being more of like a tech lead" leading "an army of AI agents."

**Primary Sources:**
- [Engadget - April 2025](https://www.engadget.com/ai/mark-zuckerberg-predicts-ai-will-write-most-of-metas-code-within-12-to-18-months-213851646.html)
- [Dwarkesh Podcast](https://www.dwarkesh.com/p/mark-zuckerberg-2)

---

### Dario Amodei — Anthropic CEO

**March 2025** — CEO of Claude's creator

> "In 12 months, we may be in a world where AI is writing essentially all of the code."

> "I have some engineers, some engineering leads within Anthropic, who have basically said to me I don't write any code anymore."

**Primary Sources:**
- [Entrepreneur - March 2025](https://www.entrepreneur.com/business-news/anthropic-ceo-predicts-ai-will-take-over-coding-in-12-months/488533)
- [TIME Interview](https://time.com/6990386/anthropic-dario-amodei-interview/)

---

### Boris Cherny — Head of Claude Code, Anthropic

**January 2026** — The person building Claude Code

> "For me personally, it has been 100% for two+ months now, I don't even make small edits by hand."

> "I shipped 22 PRs yesterday and 27 the day before, each one 100% written by Claude."

> "Fun fact: 90% of code in Claude Code is written by itself!"

**Primary Sources:**
- [Fortune - January 2026](https://fortune.com/2026/01/29/100-percent-of-code-at-anthropic-and-openai-is-now-ai-written-boris-cherny-roon/)
- [Fortune Interview](https://fortune.com/2026/01/24/anthropic-boris-cherny-claude-code-non-coders-software-engineers/)

---

### Sebastian Siemiatkowski — Klarna CEO

**2025** — $40B+ fintech, cut workforce 40% while increasing tech employees

> "Rather than disrupting my poor engineers and product people with what is half good ideas and half bad ideas, now I test it myself."

Creates prototypes in 20 minutes that previously took engineers weeks.

**Primary Sources:**
- [Futurism](https://futurism.com/ceo-engineers-vibe-coded)
- [Sequoia Podcast](https://sequoiacap.com/podcast/training-data-sebastian-siemiatkowski/)

---

### Tobi Lutke — Shopify CEO

**April 2025** — Internal memo making AI usage mandatory

> "Using AI effectively is now a fundamental expectation of everyone at Shopify."

Before asking for new hires, employees must prove AI can't do the job first.

**Primary Sources:**
- [Tobi Lutke's Tweet](https://x.com/tobi/status/1909251946235437514)
- [Fast Company](https://www.fastcompany.com/91312832/shopify-ceo-tobi-lutke-ai-is-now-a-fundamental-expectation-for-employees)

---

### Patrick Collison — Stripe CEO

**2025** — 5% of all Stripe PRs are fully automated "minions"

> "This is not just using LLMs in Cursor. This is a human never logged into the dev box. It's completely automated."

**Primary Sources:**
- [Retool Blog](https://retool.com/blog/stripe-ceo-ai-agents-and-the-future-of-software)

---

### Kent Beck — Creator of Extreme Programming

**April 2023** — Co-author of Agile Manifesto

> "The value of 90% of my skills just dropped to $0. The leverage for the remaining 10% went up 1000x. I need to recalibrate."

**Primary Sources:**
- [Kent Beck's Tweet](https://twitter.com/KentBeck/status/1648413998025707520)

---

## Industry Statistics

| Metric | Value | Source |
|--------|-------|--------|
| Developers using AI tools | 84% | Stack Overflow 2025 |
| GitHub Copilot users | 20 million | TechCrunch July 2025 |
| Fortune 100 Copilot adoption | 90% | GitHub |
| AI-generated code (avg) | 41% | Industry surveys |
| Productivity improvement | 20-55% | GitHub, Google, Microsoft |

---

## Further Reading

### Academic Research
- [Measuring AI Impact on Developer Productivity](https://arxiv.org/abs/2302.06590) — 55.8% faster task completion (arXiv)
- [Stanford HAI 2025 AI Index Report](https://hai.stanford.edu/ai-index/2025-ai-index-report) — Industry produced 90% of notable AI models

### Tech Publications
- [AI coding is now everywhere](https://www.technologyreview.com/2025/12/15/1128352/rise-of-ai-coding-developers-2026/) — MIT Technology Review
- [The second wave of AI coding is here](https://www.technologyreview.com/2025/01/20/1110180/the-second-wave-of-ai-coding-is-here/) — MIT Technology Review
- [AI Engineering Trends in 2025](https://thenewstack.io/ai-engineering-trends-in-2025-agents-mcp-and-vibe-coding/) — The New Stack

### Developer Surveys
- [Stack Overflow 2025 Developer Survey](https://survey.stackoverflow.co/2025/ai) — 84% using AI tools
- [JetBrains State of Developer Ecosystem 2025](https://blog.jetbrains.com/research/2025/10/state-of-developer-ecosystem-2025/) — 85% regular AI tool usage

### Enterprise Adoption
- [Anthropic Enterprise Case Studies](https://www.anthropic.com/news/driving-ai-transformation-with-claude) — Novo Nordisk, Salesforce, others
- [Cognizant deploys Claude to 350,000 associates](https://news.cognizant.com/2025-11-04-Cognizant-Adopts-Anthropics-Claude)

---

This validates the direction of AI-assisted development workflows at Trilogy Care.
