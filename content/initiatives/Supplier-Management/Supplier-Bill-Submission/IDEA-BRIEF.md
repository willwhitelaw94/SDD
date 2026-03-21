---
title: "Supplier Bill Submission: Idea Brief"
description: "Supplier Management > Supplier Bill Submission"
icon: i-heroicons-light-bulb
navigation:
  order: 1
---

**Epic Code**: SBS
**Created**: 2025-12-30
**Linear Project**: [SBS-Supplier-Bill-Submission](https://linear.app/trilogycare/project/sec-supplier-email-clients-9f484da573d8)

## Problem Statement (What)

Suppliers currently face friction when submitting invoices to Trilogy Care:

1. **Portal login friction** - Suppliers must log into the portal for every invoice submission, even for simple, routine submissions
2. **No account suppliers** - Ad-hoc suppliers who only submit occasional invoices have no streamlined way to submit without creating an account
3. **Client routing complexity** - Suppliers with multiple clients must manually select which client each invoice is for, leading to errors and delays
4. **Unclear relationships** - Suppliers can't easily see which clients they have formal agreements with vs. clients they've just invoiced

## Possible Solution (How)

### 1. Email-Based Invoice Submission
- Generate a unique inbound email address for each supplier (e.g., `supplier-abc123@invoices.trilogycare.com.au`)
- Suppliers email PDF invoices to their unique address → bills are created automatically
- Per-client email addresses for automatic routing to the correct package

### 2. Public Bill Submission Form
- Route `/bills` to a public page accessible without authentication
- Streamlined form with ABN lookup, client search, and service picklist
- Returns a reference number for tracking submission status

### 3. Enhanced Clients Page
- Tabbed interface: All Clients | With Agreements | Invoiced | Archived
- Shows which clients have formal budget item attachments vs. ad-hoc invoice history
- Per-client email addresses with copy-to-clipboard functionality

## Benefits (Why)

1. **Faster submission** - Invoice via email in <30 seconds vs. 2+ minutes via portal form
2. **Reduced errors** - Per-client emails achieve 100% accurate routing vs. ~70% for AI-based matching
3. **Lower barrier** - Ad-hoc suppliers can submit without account creation
4. **Better visibility** - Suppliers understand their formal vs. ad-hoc client relationships
5. **Reduced support** - Fewer "where do I send invoices?" queries

## Owner (Who)

- **Product Owner**: Dave (BP Team)
- **Tech Lead**: Khoa

## Other Stakeholders (Accountable / Consulted / Informed)

- **Accountable**: Romy (Operations)
- **Consulted**: Rachael (BP Team), Will (Architecture)
- **Informed**: Finance team, Support team

## Assumptions & Dependencies, Risks

### Assumptions

- Suppliers have access to email and can attach PDF invoices
- ABN-based matching is reliable enough for public form submissions
- Email domain validation is sufficient for sender verification

### Dependencies

- Email infrastructure for inbound processing (AWS SES or similar)
- AI Invoice V3 for invoice parsing and client matching fallback
- Existing supplier authentication system

### Risks

- **Spam/abuse** - Public form could be targeted; mitigate with rate limiting and CAPTCHA
- **Sender spoofing** - Domain validation may not catch all impersonation; mitigate with strict domain matching
- **Duplicate submissions** - Same invoice sent via email and form; mitigate with document hash deduplication

## Estimated Effort

- **Email submission (P1)**: 2-3 weeks
- **Public form (P2)**: 1-2 weeks
- **Enhanced Clients page (P2)**: 1 week
- **Total**: 4-6 weeks

## Proceed to PRD?

Yes - spec.md is complete with user stories and acceptance criteria.
