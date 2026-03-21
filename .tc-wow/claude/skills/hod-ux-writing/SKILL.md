---
name: hod-ux-writing
description: Write clear, concise, user-centered interface copy (UX text/microcopy) for digital products. Use when writing buttons, labels, error messages, success messages, empty states, notifications, form fields, or establishing voice and tone. Triggers on: UX writing, microcopy, interface copy, button text, error message, success message, empty state, form labels.
---

# UX Writing

Write clear, concise, user-centered interface copy (UX text/microcopy) for digital products and experiences. This skill provides frameworks, patterns, and best practices for creating text that helps users accomplish their goals.

## When to Use This Skill

Use this skill when:

- Writing interface copy (buttons, labels, titles, messages, forms)
- Editing existing UX text for clarity and effectiveness
- Creating error messages, notifications, or success messages
- Designing conversational flows or onboarding experiences
- Establishing voice and tone for a product
- Auditing product content for consistency and usability

## Core UX Writing Principles

### The Four Quality Standards

Every piece of UX text should be:

1. **Purposeful** - Helps users or the business achieve goals
2. **Concise** - Uses the fewest words possible without losing meaning
3. **Conversational** - Sounds natural and human, not robotic
4. **Clear** - Unambiguous, accurate, and easy to understand

### Key Best Practices

**Conciseness**

- Use 40-60 characters per line maximum
- Every word must have a job
- Break dense text into scannable chunks
- Front-load important information

**Clarity**

- Use plain language (7th grade reading level for general, 10th for professional)
- Avoid jargon, idioms, and technical terms
- Use consistent terminology throughout
- Choose meaningful, specific verbs

**Conversational Tone**

- Write how you speak
- Use active voice 85% of the time
- Include prepositions and articles
- Avoid robotic phrasing

**User-Centered**

- Focus on user benefits, not features
- Anticipate and answer user questions
- Use second-person ("you") language
- Match user's language and mental models

---

## UX Text Patterns

Apply these common patterns for interface elements.

### Titles

- **Purpose**: Orient users to where they are
- **Format**: Noun phrases, sentence case
- **Types**: Brand titles, content titles, category titles, task titles
- **Examples**: "Account settings", "Your library", "Create new post"

### Buttons and Links

- **Purpose**: Enable users to take action
- **Format**: Active imperative verbs, sentence case
- **Pattern**: `[Verb] [object]`
- **Examples**: "Save changes", "Delete account", "View details"
- **Avoid**: Generic labels like "OK", "Submit", "Click here"

### Error Messages

- **Purpose**: Explain problem and provide solution
- **Format**: Empathetic, clear, actionable
- **Pattern**: `[What failed]. [Why/context]. [What to do].`

**Validation Errors (Inline)**

- Show as user completes field or on blur
- Brief, specific guidance to correct input
- Pattern: `[Field] [specific requirement]`
- Examples:
  - "Email must include @"
  - "Password must be at least 8 characters"
  - "Choose a date in the future"
- Timing: Real-time or on field exit
- Location: Below or beside the field

**System Errors (Modal/Banner)**

- Show when backend operations fail
- Explain what happened and why
- Pattern: `[Action failed]. [Likely cause]. [Recovery step].`
- Examples:
  - "Payment failed. Your card was declined. Try a different payment method."
  - "Couldn't save changes. Connection lost. Reconnect and try again."
  - "Upload failed. File is too large. Choose a file under 10MB."
- Timing: Immediately after failure
- Location: Modal dialog or prominent banner

**Blocking Errors (Full-screen)**

- Prevent continued use until resolved
- Clear explanation of blocker and resolution
- Pattern: `[What's blocked]. [Why]. [Specific action needed].`
- Examples:
  - "Update required. This version is no longer supported. Update now to continue."
  - "Subscription expired. Your account is paused. Renew subscription to restore access."
  - "Verification needed. Confirm your email to access features. Check your inbox."
- Timing: On app launch or feature access
- Location: Full screen or large modal

**Permission Errors**

- Explain benefit before requesting permission
- Pattern: `[User benefit]. [Permission needed].`
- Examples:
  - "Get notified when orders ship. Enable notifications."
  - "Find nearby stores. Allow location access."
  - "Back up your photos. Grant storage permission."
- Timing: When feature is first used
- Location: In context of the feature

**What to Avoid**

- Technical codes without explanation ("Error 403")
- Blame language ("invalid input", "illegal character")
- Robotic tone ("An error has occurred")
- Dead ends (error with no recovery path)
- Vague causes ("Something went wrong")

### Success Messages

- **Purpose**: Confirm action completion
- **Format**: Past tense, specific, encouraging
- **Pattern**: `[Action] [result/benefit]`
- **Examples**: "Changes saved", "Email sent", "Profile updated"

### Empty States

- **Purpose**: Guide users when content is absent
- **Types**: First-use, user-cleared, error/no results
- **Format**: Explanation + CTA to populate
- **Example**: "No messages yet. Start a conversation to connect with your team."

### Form Fields

- **Labels**: Clear noun phrases describing input ("Email address", "Phone number")
- **Instructions**: Verb-first, explain why information is needed
- **Placeholder**: Use sparingly, only for standard inputs like "name@example.com"
- **Helper text**: Static, on-demand, or automatic based on importance

### Notifications

- **Purpose**: Deliver timely, valuable information
- **Types**: Action-required (intrusive), Passive (less intrusive)
- **Format**: Verb-first title + contextual description
- **Example**: "Update required. Install the latest version to continue."

---

## Voice and Tone

### Voice (Consistent Brand Personality)

Voice is the consistent personality of the product. Establish voice using:

- **Concepts**: 3-5 key brand principles/values
- **Voice characteristics**: Descriptive adjectives for each concept
- **Do/Don't examples**: Concrete examples showing voice in action

### Tone (Adaptive to Context)

Tone is how voice adapts to specific situations. While voice remains constant, tone shifts based on user context and emotional state.

**Tone Variables**

- **Purpose**: Why user is seeing this text (information, action, confirmation)
- **Context**: What user is trying to do (learning, completing task, recovering from error)
- **Emotional state**: How user likely feels (frustrated, excited, confused, cautious)
- **Stakes**: Impact of the action (low: changing theme, high: deleting account)

**Tone Adaptation by User Emotional State**

| State | Approach | Example |
|-------|----------|---------|
| **Frustrated** | Empathetic, solution-focused, no blame | "Payment failed. Your card was declined. Try a different payment method." |
| **Confused** | Patient, explanatory, step-by-step | "Connect your bank to see spending insights. We'll guide you through it." |
| **Confident** | Efficient, direct, minimal | "Saved" |
| **Cautious** | Serious, transparent, consequences clear | "Delete account? You'll lose all data and this can't be undone." |
| **Successful** | Positive, proportional, brief | "Profile updated. Your changes are live." |

**Tone by Content Type**

| Type | Tone | Key Principle |
|------|------|---------------|
| Error messages | Empathetic, reassuring | Never blame user |
| Success messages | Positive, specific | Proportional to action |
| Instructions | Clear, direct | Front-load key action |
| Onboarding | Inviting, encouraging | Focus on value |
| Confirmations | Serious, transparent | Easy to back out |
| Empty states | Hopeful, actionable | Clear next action |

---

## Editing Process

Edit UX text in four phases:

### Phase 1: Purposeful

- Does text help user achieve their goal?
- Does text serve business objectives?
- Is value to user clear?
- Are concerns anticipated and addressed?

### Phase 2: Concise

- Remove unnecessary words
- Combine redundant information
- Ensure every word earns its space
- Front-load important concepts

### Phase 3: Conversational

- Read aloud - would you say this?
- Use active voice (unless passive is clearer)
- Include natural connecting words
- Avoid corporate jargon

### Phase 4: Clear

- Use specific, accurate verbs
- Maintain consistent terminology
- Test readability (Hemingway Editor, Flesch-Kincaid)
- Ensure unambiguous meaning

---

## Accessibility in UX Writing

Writing accessible content ensures all users, including those using assistive technology, can understand and interact with your product.

### Screen Reader Optimization

- Label all interactive elements explicitly ("Submit form" not just "Submit")
- Write descriptive link text ("Read pricing details" not "Click here")
- Structure error messages to work with screen readers
- Use ARIA labels when visual context isn't sufficient

### Cognitive Accessibility

- Target 8-14 words per sentence (8 words = 100% comprehension)
- Break complex information into scannable chunks
- Use clear headings and logical hierarchy
- Provide consistent, predictable patterns

### Multi-Modal Communication

- Don't rely on color alone to convey meaning
- Pair visual indicators with text ("Error: Email required" with red icon)
- Provide text alternatives for icons and images
- Ensure sufficient color contrast (WCAG AA: 4.5:1)

### Plain Language for All

- Target 7th-8th grade reading level for general audience
- Define technical terms when first used
- Avoid idioms, metaphors, and cultural references
- Use common, everyday words

### Accessible Pattern Examples

| Element | Bad | Good |
|---------|-----|------|
| Buttons | "Submit" | "Submit application" |
| Links | "Click here" | "Read our privacy policy" |
| Errors | Red "Invalid" | "Error: Email must include @" |
| Forms | Placeholder only | Visible label + placeholder |

---

## UX Text Benchmarks

Use these research-backed metrics to create effective UX text.

### Sentence Length Targets

| Content Type | Ideal | Maximum |
|--------------|-------|---------|
| Buttons/CTAs | 2-4 words | 6 words |
| Titles | 3-6 words | 40 characters |
| Error messages | 12-18 words | Include solution |
| Instructions | 14 words | 20 words |
| Body copy | 15-20 words avg | Vary for rhythm |
| Notifications | 10-15 words | Title + body |

### Comprehension Rates

- **8 words or fewer**: 100% user comprehension
- **14 words or fewer**: 90% user comprehension
- **25+ words**: Comprehension drops significantly

### Character and Line Length

| Element | Optimal |
|---------|---------|
| Line length | 40-60 characters |
| Button labels | 15-25 characters |
| Page titles | 30-50 characters |
| Notification titles | 35-45 characters |

### Reading Level Guidelines

| Audience | Target Grade |
|----------|--------------|
| General public | 7th-8th grade |
| Professional tools | 9th-10th grade |
| Technical products | 10th-11th grade |

---

## Common Mistakes to Avoid

- Using passive voice excessively
- Generic button labels ("Submit", "OK")
- Blaming users in error messages
- Overly clever humor in serious contexts
- Inconsistent terminology
- Hidden instructions or explanations
- System-oriented language vs. user language
- Too many words (not concise enough)
- Robotic, corporate tone
- Relying on color alone for meaning
- Writing inaccessible link text ("Click here")

---

## Quick Reference

| Principle | Do | Don't |
|-----------|-----|-------|
| Case | "Save your changes" | "Save Your Changes" |
| Buttons | "Delete account" | "Account deletion" |
| Focus | "Save time with shortcuts" | "We offer shortcuts" |
| Verbs | "Delete" (permanent) | "Remove" (when deleting) |
| Order | "Password must be 8 characters" | "Must be 8 characters for your password" |

---

## Content Usability Checklist

Rate each criterion 0-10 when evaluating UX text:

### Concise

- [ ] Every word has a distinct job
- [ ] High information density in minimal words
- [ ] 40-60 characters per line
- [ ] Short sentences and paragraphs
- [ ] Front-loaded with signal words
- [ ] Ideas ordered by priority

### Purposeful

- [ ] User goals are clear and supported
- [ ] Business goals are met
- [ ] Brand voice is reflected
- [ ] Value proposition is evident
- [ ] Subject matter focuses on user benefit
- [ ] Active, inviting framing

### Conversational

- [ ] Natural, spoken language
- [ ] Active voice predominates
- [ ] Connecting words included
- [ ] Familiar words and phrases
- [ ] Personality in appropriate moments

### Clear

- [ ] Accurate action words
- [ ] Command forms used appropriately
- [ ] Plain language
- [ ] Meaningful, descriptive titles
- [ ] Consistent patterns and terminology

### Scoring Guide

- **9-10**: Excellent - Best practice example
- **7-8**: Good - Minor improvements possible
- **5-6**: Adequate - Notable issues to address
- **3-4**: Needs work - Significant problems
- **0-2**: Poor - Major revision required

---

## TC Portal: Aged Care & Support at Home Context

TC Portal serves multiple user types in the aged care sector. Voice and tone must adapt based on who is reading and the sensitivity of the context.

> **Terminology Reference**: See `.tc-docs/content/context/glossary/` for complete glossaries:
> - `01-support-at-home.md` - SAH program, funding, service groups
> - `04-trilogy-terminology.md` - Roles, processes, internal terms
>
> **Personas Reference**: See `.tc-docs/content/context/6.Industry/personas.md` for detailed user profiles.

---

### User Types & Voice Adaptation

TC Portal has distinct user groups with different needs, technical literacy, and emotional contexts.

#### Recipients (Clients)

People receiving care services - often older Australians, potentially with cognitive, sensory, or language barriers.

| Attribute | Guidance |
|-----------|----------|
| **Terminology** | Use "you/your" language. Prefer "your services", "your budget", "your care plan" |
| **Reading level** | 6th-7th grade. Simpler than standard. Many users are 70+ with varying literacy |
| **Tone** | Warm, reassuring, respectful. Never patronising |
| **Cognitive load** | Minimal. One concept per sentence. Break complex info into steps |
| **Cultural safety** | Avoid idioms, colloquialisms. Consider CALD and Indigenous users |
| **Autonomy** | Emphasise choice and control. "You can", "You choose", "Your decision" |

**Voice characteristics**: Supportive, clear, empowering, patient

**Do:**
- "Your budget has $1,200 remaining this quarter"
- "You can change your services anytime"
- "We're here to help"

**Don't:**
- "Unutilised funds will roll over per SAH guidelines"
- "Contact your Care Partner to action this request"
- "Your package is underspent"

---

#### Care Partners (TC Staff)

Trilogy Care staff managing recipient care day-to-day. Need efficiency and precision.

| Attribute | Guidance |
|-----------|----------|
| **Terminology** | Use industry terms: "recipient", "package", "utilisation", "NOA", "IPA" |
| **Reading level** | 9th-10th grade. Professional but not overly technical |
| **Tone** | Professional, efficient, supportive. They're busy - respect their time |
| **Information density** | Higher than recipient-facing. Can include more detail |
| **Actionability** | Clear next steps. What do they need to do? |

**Voice characteristics**: Efficient, precise, helpful, professional

**Do:**
- "Margaret O'Brien - 62% utilisation, $4,200 remaining"
- "3 bills pending approval"
- "Budget review due: 15 Feb"

**Don't:**
- "This person hasn't used much of their money yet"
- "There are some invoices that need looking at"
- Unnecessary pleasantries in dense UI

---

#### Suppliers (Service Providers)

External providers delivering care services - ranges from sole traders to large organisations.

| Attribute | Guidance |
|-----------|----------|
| **Terminology** | Business terms: "invoice", "payment", "ABN", "compliance" |
| **Reading level** | 8th-9th grade. Clear business communication |
| **Tone** | Professional, transactional, clear. They want to get paid and move on |
| **Efficiency** | They're running a business. Minimise friction |

**Voice characteristics**: Professional, transactional, clear, respectful

**Do:**
- "Invoice submitted. Payment in 5-7 business days"
- "Police check expires 15 Mar. Upload renewal to continue receiving work"
- "3 invoices need attention"

**Don't:**
- "Thanks so much for submitting your invoice!"
- Overly warm language for transactional contexts

---

#### Family Members / Representatives

Often involved in care decisions, especially for recipients with cognitive decline.

| Attribute | Guidance |
|-----------|----------|
| **Terminology** | Plain language like recipients, but can handle slightly more complexity |
| **Reading level** | 7th-8th grade |
| **Tone** | Supportive, informative. They're often anxious about their loved one |
| **Transparency** | Clear about what's happening with care and budget |
| **Inclusion** | "You and [Recipient name]" - acknowledge their role |

**Voice characteristics**: Reassuring, transparent, inclusive, informative

---

### Sensitive Contexts in Aged Care

Aged care involves emotionally charged situations requiring careful tone adaptation.

#### Budget Constraints

When funds are low or services can't be approved.

| For Recipients | For Care Partners |
|----------------|-------------------|
| "Your budget is running low this quarter. Let's look at your options together." | "Budget at 92% utilisation. $340 remaining. Review service plan." |
| "This service isn't covered by your current plan. Here's what we can do..." | "Service outside NOA scope. Options: VC top-up, resubmit NOA, decline." |

**Never say** (to recipients): "You've overspent", "Funding denied", "Not approved"

---

#### Service Changes / Reductions

When services need to change, especially reductions.

**Do:**
- Explain the "why" simply
- Present alternatives
- Emphasise continuity of care
- Offer to discuss

**Don't:**
- Use bureaucratic language ("due to policy changes")
- Make it feel like punishment
- Leave them without next steps

**Example (Recipient):**
> "Your cleaning service is changing from weekly to fortnightly from 1 March. This helps make sure your budget lasts the full quarter. If you'd like to discuss other options, we're here to help."

---

#### Clinical Escalations / Health Concerns

When there are health or safety concerns.

| Tone | Guidance |
|------|----------|
| **Serious but calm** | Don't alarm, but don't minimise |
| **Action-oriented** | Clear what happens next |
| **Reassuring** | Help is available |

**Example:**
> "We've noticed some changes and want to make sure you're getting the right support. [Name] from our clinical team will call you today."

---

#### End of Life Pathway

The most sensitive context. Requires utmost care and dignity.

| Principle | Application |
|-----------|-------------|
| **Dignity** | Always respectful, never clinical or cold |
| **Clarity** | People need to understand what's happening |
| **Support** | Emphasise that support is available |
| **Choice** | Honour autonomy and preferences |

**Language preferences:**
- "End of life care" not "palliative" (unless user prefers)
- "Comfort and quality of life"
- "Your wishes", "Your choices"

---

#### Bereavement / Recently Bereaved

For users like Lynne Fox (recently lost spouse) or family after recipient passes.

**Tone**: Gentle, patient, no pressure

**Do:**
- Acknowledge the difficulty
- Provide clear but gentle guidance
- Offer support
- Allow time

**Don't:**
- Use urgent language
- Focus on administrative tasks first
- Be overly formal or cold

---

### Terminology Quick Reference

| Context | Recipient-Facing | Staff-Facing |
|---------|------------------|--------------|
| The person receiving care | "You" / by name | "Recipient", "Client" |
| Money available | "Your budget", "funds available" | "Budget", "allocation", "utilisation" |
| Government funding | "Your funding", "support from the government" | "SAH", "IPA", "NOA" |
| Running out of money | "Budget is running low" | "High utilisation", "budget at X%" |
| Services | "Your services", "help at home" | "Services", "service plan", "SERG" |
| Fees | "Costs", "your contribution" | "CC fee", "TC fee", "VC" |
| Care Partner | "Your Care Partner [Name]" | "[Name]", "CP" |
| Problems | "We've noticed...", "There's been a change" | "Issue", "escalation", "incident" |

---

### Cultural Safety Considerations

TC Portal serves diverse populations including CALD (Culturally and Linguistically Diverse) communities and Aboriginal and Torres Strait Islander peoples.

#### General Principles

- **No idioms or colloquialisms** - "Running low" may confuse; prefer "Your budget has $200 left"
- **Simple sentence structure** - Easier for translation and comprehension
- **Respectful naming** - Use preferred names and titles (e.g., "Aunty", "Uncle" for Indigenous elders)
- **Family involvement** - Many cultures have collective decision-making; accommodate this

#### For Aboriginal and Torres Strait Islander Users

- Acknowledge connection to Country and community
- Respect kinship structures
- Use culturally safe language
- Consider Sorry Business and cultural obligations

#### For CALD Users

- Avoid jargon that doesn't translate
- Consider right-to-left reading for some languages
- Family members often translate - write for that context
- Religious and cultural observances may affect service preferences

---

### Dignity of Risk

A core principle in aged care: clients have the right to make informed decisions even if those decisions involve some risk.

**In UX writing, this means:**

- Present information clearly so users can make informed choices
- Don't be paternalistic ("You shouldn't...")
- Explain consequences without judgment
- Respect the decision once made

**Example:**
> "Reducing your cleaning service will save $200/month. This means less frequent cleaning. It's your choice - we're here to support whatever you decide."

**Not:**
> "We recommend keeping your cleaning service. Reducing it could affect your wellbeing."
