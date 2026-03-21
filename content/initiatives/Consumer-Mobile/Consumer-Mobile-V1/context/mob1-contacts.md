---
title: "MOB1 - Care Circle / Contacts"
description:
---

**Endpoints**: 5  
**Build Effort**: Low - actions exist, nearly complete  
**Status**: ✅ Complete - all CRUD operations working  

---

## Implementation Status

| Feature            | Mobile | Web | Backend | Notes                             |
|--------------------|--------|-----|---------|-----------------------------------|
| List contacts      | ✅      | ✅   | ✅       | Working                           |
| View contact       | ✅      | ✅   | ✅       | Working                           |
| Add contact        | ✅      | ✅   | ✅       | Working                           |
| Update contact     | ✅      | ✅   | ✅       | Working                           |
| Delete contact     | ✅      | ✅   | ✅       | Working                           |
| Contact validation | ✅      | ✅   | ✅       | Email and phone format validation |

---

## Endpoints

| Endpoint                                             | Method | Status | Notes           |
|------------------------------------------------------|--------|--------|-----------------|
| `/api/v1/recipient/packages/{package}/contacts`      | GET    | ✅      | List contacts   |
| `/api/v1/recipient/packages/{package}/contacts/{id}` | GET    | ✅      | Get contact     |
| `/api/v1/recipient/packages/{package}/contacts`      | POST   | ✅      | Add contact     |
| `/api/v1/recipient/packages/{package}/contacts/{id}` | PUT    | ✅      | Update contact  |
| `/api/v1/recipient/packages/{package}/contacts/{id}` | DELETE | ✅      | Remove contact  |

---

## Screens

### Care Circle / Contacts List

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Care Circle Contact List**

- Displays all care circle contacts
- Contact cards with photo/avatar
- Name, relationship, and contact details
- Action buttons (Edit, Delete)
- "Add Contact" button
- Clean card-based layout
- ✅ Working

![Contacts List Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/contacts/portal-contacts.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Care Circle Contact List**

- List view of all contacts
- Contact name and relationship
- Phone and email visible
- Tap to view/edit contact
- "Add new contact" button
- Mobile-optimized list layout
- ✅ Working

![Contacts List Mobile](/images/initiatives/consumer-mobile/consumer-mobile-v1/contacts/app-mobile-contacts.png)

</td>
</tr>
</table>

---

### Add / Edit Contact

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Add/Edit Contact Form**

- First name (required)
- Last name (required)
- Relationship dropdown (required)
- Mobile phone (optional)
- Email (optional, validated)
- Notes field (optional)
- Save/Cancel buttons
- Validation on submit
- ✅ Working

![Add Contact Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/contacts/portal-add-edit.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Add/Edit Contact Screen**

- First name field
- Last name field
- Relationship selector
- Mobile phone with country code
- Email field
- Notes/additional info
- Save button
- Mobile keyboard optimization
- ✅ Working

![Add Contact Mobile](/images/initiatives/consumer-mobile/consumer-mobile-v1/contacts/app-mobile-add-edit.png)

</td>
</tr>
</table>

---

## Outstanding Work

### None Currently

The Care Circle / Contacts feature is fully implemented across web, mobile, and backend with all CRUD operations working correctly.

**Completed features:**
- ✅ List all contacts with proper display
- ✅ View individual contact details
- ✅ Add new contacts with validation
- ✅ Update existing contacts
- ✅ Delete contacts with confirmation
- ✅ Mobile-optimized UI
- ✅ Form validation (email format, required fields)
- ✅ Country code selector for phone numbers

**Future enhancements (not in MOB1 scope):**
- Contact photo upload
- Contact grouping/categorization
- Emergency contact designation
- Contact activity history
- Bulk import contacts
- Share contact with care team
