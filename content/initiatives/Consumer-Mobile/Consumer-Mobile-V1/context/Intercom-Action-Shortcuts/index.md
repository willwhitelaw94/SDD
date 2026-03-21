---
title: "Intercom Action Shortcuts"
description: "Authenticated Intercom integration for consumer mobile actions"
---

> One-tap actions that create pre-filled Intercom tickets with user context

---

## TL;DR

- **What**: Integrate Intercom into the mobile app with shortcuts that pre-fill ticket titles and context
- **Why**: Avoid building complex backend workflows; leverage Intercom's existing ticket management
- **How**: Authenticated Intercom session + deep links/shortcuts that pass context

---

## The Problem

Building full action workflows (invoice disputes, service changes, funding requests) requires:
- Backend state machines
- Notification workflows
- Assignment logic
- SLA tracking
- Audit trails

**Intercom already has all of this.**

---

## The Solution

### Pattern

```
User taps "Query Invoice" in mobile app
        │
        ▼
App opens Intercom with:
  - Authenticated user identity
  - Pre-filled ticket title: "Invoice Query: INV-12345"
  - Context: Invoice ID, amount, date, package
        │
        ▼
Intercom creates ticket
  - Routed to finance team
  - User visible in Intercom (who raised it)
  - Standard SLA/workflow applies
```

### Benefits

| Benefit | Detail |
|---------|--------|
| **Ship faster** | No backend workflow to build |
| **User context** | Intercom knows who the user is |
| **Routing** | Existing team routing in Intercom |
| **SLAs** | Intercom SLA management |
| **Audit** | Full ticket history |
| **Mobile-friendly** | Intercom SDK handles the UX |

---

## Shortcut Definitions

### Finance Actions

| Shortcut | Pre-filled Title | Context Passed | Routes To |
|----------|------------------|----------------|-----------|
| Query Invoice | "Invoice Query: INV-{id}" | Invoice ID, amount, date, supplier | Finance |
| Dispute Charge | "Charge Dispute: INV-{id} - {line_item}" | Invoice ID, line item, amount | Finance |
| Request Statement | "Statement Request: {month}" | Package ID, month | Finance |
| Payment Question | "Payment Question" | Package ID, balance | Finance |

### Service Actions

| Shortcut | Pre-filled Title | Context Passed | Routes To |
|----------|------------------|----------------|-----------|
| Request Service Change | "Service Change: {service_type}" | Package ID, current service | Care Coordination |
| Report Missed Service | "Missed Service: {date}" | Package ID, service, date | Care Coordination |
| Supplier Feedback | "Supplier Feedback: {supplier}" | Package ID, supplier ID | Care Coordination |

### Care Actions

| Shortcut | Pre-filled Title | Context Passed | Routes To |
|----------|------------------|----------------|-----------|
| Update Care Goals | "Care Goal Update Request" | Package ID, current goals | Care Coordination |
| Report Concern | "Care Concern: {category}" | Package ID, category | Clinical |
| Request Callback | "Callback Request" | Package ID, preferred time | Care Coordination |

### Account Actions

| Shortcut | Pre-filled Title | Context Passed | Routes To |
|----------|------------------|----------------|-----------|
| Update Contact Details | "Contact Update" | User ID, current details | Admin |
| Add Care Circle Member | "Add Care Circle Member" | Package ID | Admin |
| Access Question | "Portal Access Help" | User ID | Support |

---

## Technical Implementation

### Intercom SDK Integration

```javascript
// Authenticate user with Intercom
Intercom.registerIdentifiedUser({
  userId: user.id,
  email: user.email,
  name: user.name,
  customAttributes: {
    package_id: package.id,
    package_type: package.type,
    coordinator_name: package.coordinator.name
  }
});

// Open Intercom with pre-filled message
Intercom.presentMessageComposer({
  initialMessage: `Invoice Query: INV-${invoice.id}\n\nInvoice Amount: $${invoice.amount}\nDate: ${invoice.date}\nSupplier: ${invoice.supplier.name}`
});
```

### Shortcut Configuration

Store shortcut definitions in config:

```php
// config/intercom-shortcuts.php
return [
    'invoice_query' => [
        'title_template' => 'Invoice Query: INV-{invoice_id}',
        'context_fields' => ['invoice_id', 'amount', 'date', 'supplier_name'],
        'route_to' => 'finance',
    ],
    'service_change' => [
        'title_template' => 'Service Change: {service_type}',
        'context_fields' => ['package_id', 'service_type', 'current_supplier'],
        'route_to' => 'care_coordination',
    ],
    // ...
];
```

### API Endpoint

```
GET /api/v1/recipient/shortcuts
```

Returns available shortcuts with their templates, allowing the mobile app to render action buttons dynamically.

---

## User Experience

### In the Mobile App

1. User views invoice
2. Sees "Query this invoice" button
3. Taps button
4. Intercom opens with pre-filled message
5. User can add details or just send
6. Ticket created, user can track in Intercom

### Visibility

- User sees their tickets in Intercom
- Gets push notifications on replies
- Full conversation history

---

## Intercom Configuration Required

| Configuration | Purpose |
|---------------|---------|
| **Teams** | Finance, Care Coordination, Clinical, Admin, Support |
| **Routing Rules** | Route by ticket title prefix |
| **Attributes** | Package ID, Package Type, Coordinator |
| **Push Notifications** | Enable mobile push for ticket updates |

---

## Future Evolution

| Phase | Capability |
|-------|------------|
| **MOB1** | All actions via Intercom shortcuts |
| **MOB2** | Some actions native (edit goals), complex via Intercom |
| **MOB3** | Full native workflows (invoice disputes trigger reversals) |

The Intercom pattern lets us ship fast while building the foundation for native workflows later.

---

## Success Metrics

| Metric | Target |
|--------|--------|
| **Shortcut usage** | 50% of tickets created via shortcuts |
| **Context quality** | 80% of tickets have full context |
| **Resolution time** | 20% faster than manual tickets |
| **User satisfaction** | Higher CSAT for shortcut-created tickets |

---

## Related

- [MOB1 Design](../DESIGN) — Overall mobile architecture
- [Intercom on Portal](/initiatives/ADHOC/Intercom-On-Portal/) — Existing Intercom integration
