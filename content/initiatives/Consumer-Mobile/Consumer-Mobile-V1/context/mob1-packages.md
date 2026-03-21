---
title: "MOB1 - Package & Dashboard"
description:
---

**Endpoints**: 4  
**Build Effort**: Moderate - How do we sync data that's zoho specific?
**Status**: ⚠️ Partially complete - profile upload and missing fields need work  

---

## Implementation Status

| Feature                           | Mobile | Web | Backend | Notes                                            |
|-----------------------------------|--------|-----|---------|--------------------------------------------------|
| Package overview (About My Plan)  | ❌      | ✅   | ✅       | Working                                          |
| Personal information              | ⚠️     | ⚠️  | ⚠️      | **Portal missing fields, profile upload broken** |
| Contact information               | ✅      | ✅   | ✅       | Working                                          |
| Profile picture upload            | ❌      | ✅   | ✅       | **Mobile upload not working**                    |
| Address search                    | ✅      | ❌   | ❌       | **Google Places not Installed**                  |
| Title field                       | ✅      | ❌   | ❌       | **Only in Zoho, not available in portal**        |
| Pronouns field                    | ✅      | ❌   | ❌       | **Only in Zoho, not available in portal**        |
| Aboriginal/Torres Strait Islander | ✅      | ❌   | ❌       | **Only in Zoho, not available in portal**        |

---

## Endpoints

| Endpoint                                       | Method | Status | Notes                                     |
|------------------------------------------------|--------|--------|-------------------------------------------|
| `/api/v1/recipient/packages`                   | GET    | ✅      | List user's packages                      |
| `/api/v1/recipient/packages/{package}`         | GET    | ✅      | Package summary                           |
| `/api/v1/recipient/packages/{package}/details` | GET    | ⚠️     | Full details (needs, risks, goals)        |
| `/api/v1/recipient/user`                       | GET    | ⚠️     | User profile/credentials - missing fields |

---

## Screens

### Package Overview (About My Plan)

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**About My Plan Section**

- SAH package level
- Trilogy Care ID (with clipboard copy)
- Care Recipient ID
- Care Partner (with email link)
- Care Coordinator
- Commencement Date
- Download Care Plan button
- ✅ Working

![Package Overview Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/package/portal-package.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Home Tab Dashboard**

- ❌ Package information display
- ❌ Quick actions
- ❌ Download Care Plan

*Mobile displays package info on home tab rather than dedicated "About My Plan" section*

</td>
</tr>
</table>

---

### Personal Information

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Profile Details Screen**

- Profile photo upload (working)
- Full Name (combined field)
- Email
- Phone number
- Address
- Postal Address
- Timezone
- Date format

*Note: These fields exist in Zoho but are not exposed in the portal*

![Profile Details Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/package/portal-profile.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Personal Information Screen**

- ❌ Profile photo upload
- First Name
- Preferred name
- Last name
- Gender
- Pronouns
- Date of birth
- ⚠️ **These fields are not available in portal**
- ❌ Title
- ❌ Pronouns
- ❌ Aboriginal or Torres Straight Islander status 

![Personal Information Mobile](/images/initiatives/consumer-mobile/consumer-mobile-v1/package/app-profile-1.png)

</td>
</tr>
</table>

---

### Contact Information

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Contact Information Fields**

- Email
- Contact Number (with country code selector)
- Residential Address (dropdown/autocomplete)
- Postal Address (checkbox to use residential)
- Timezone (dropdown)
- Date Format (dropdown)
- ✅ Working
- Note: Name, email, phone can only be updated by care partner (security measure)

![Contact Information Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/package/portal-profile.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Contact Information Screen**

- Email
- Phone (with country code selector)
- ❌ Google places addresses not setup
- Unit
- Street address
- Suburb
- State
- Postcode

![Contact Information Mobile](/images/initiatives/consumer-mobile/consumer-mobile-v1/package/app-profile-2.png)

</td>
</tr>
</table>

---

## Outstanding Work

### 1. Mobile Profile Picture Upload

**Issue**: Profile picture upload does not work in the mobile app

**What happens now**:
- Web portal has working profile picture upload
- Mobile app shows "Add Profile Image" button with initials placeholder
- Tapping upload button does nothing or fails silently
- Users must use web portal to upload profile picture

**What's needed**:
- Implement image picker in mobile (expo-image-picker)
- Add image upload API endpoint or use existing
- Handle image compression/resizing for mobile upload
- Test on iOS and Android
- Error handling for failed uploads
- Show upload progress indicator

**Estimate**: 1-2 days

---

### 2. Missing Profile Fields in Portal Data

**Issue**: Mobile is missing several profile fields that exist in Zoho that need to be displayed in mobile
**Missing fields**:
- Title (Mr, Mrs, Ms, Dr, etc.)
- Pronouns (he/him, she/her, they/them, etc.)
- Aboriginal/Torres Strait Islander status

**What happens now**:
- These fields exist in Zoho CRM
- These fields are not available in portal db

**What's needed**:
- Sync fields from Zoho to tc-portal database
- Read only fields or editable fields? How do we sync changes?
- Ensure mobile app can update these fields via API
- Decide on data governance: Zoho as master or portal as master

**Estimate**: Unknown

---

### 3. Google Places API

**Issue**: Mobile address prediction fields don't have access to the google places address lookup
**What's needed**:
- Firebase installed on android and ios
- Google places key installed on firebase
- Integration of google places api with input field to do address lookup when typing in field
- Selection of actual field and parsing separate address components into different areas
- Saving address blob from google into database

**Estimate**: 5 days