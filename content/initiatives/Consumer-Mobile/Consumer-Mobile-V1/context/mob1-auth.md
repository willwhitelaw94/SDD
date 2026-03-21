---
title: "MOB1 - Authentication"
description:
---

**Endpoints**: 5  
**Build Effort**: Moderate. Add endpoints and verify password reset flow  
**Status**: ⚠️ Partially complete - forgot/reset/update flows need work  

---

## Implementation Status

| Feature            | Mobile | Web | Backend | Notes                            |
|--------------------|--------|-----|---------|----------------------------------|
| Login              | ✅      | ✅   | ✅       | Working                          |
| Logout             | ✅      | ✅   | ✅       | Working with confirmation dialog |
| Remember me        | ✅      | ✅   | ✅       | Saving auth in local storage     |
| One-time PIN login | ❌      | ❌   | ❌       | SMS service?                     |
| Forgot password    | ✅      | ✅   | ✅       | Working                          |
| Reset password     | ✅      | ✅   | ✅       | Working                          |
| Update password    | ❌      | ✅   | ✅       | **Mobile UI missing**            |

---

## Endpoints

| Endpoint                       | Method | Status | Notes                                           |
|--------------------------------|--------|--------|-------------------------------------------------|
| `/api/v1/auth/login`           | POST   | ✅      | Sanctum token, working                          |
| `/api/v1/auth/logout`          | POST   | ✅      | Revoke token, working                           |
| `/api/v1/auth/forgot-password` | POST   | ⚠️     | Endpoint doesn't exist, email sending not setup |
| `/api/v1/auth/reset-password`  | POST   | ⚠️     | Endpoint doesn't exists, mobile UI missing      |
| `/api/v1/auth/update-password` | POST   | ⚠️     | Web working, mobile UI missing                  |

---

## Screens

### Login Flow

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Login Screen**

- Email and password fields
- "Forgot your password?" link
- Remember me checkbox
- "LOG IN" button
- ✅ Working

![Login Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/auth/portal-login.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Login Screen**

- Email and password fields
- "FORGOT PASSWORD" link
- Remember me checkbox
- "GET STARTED" button (primary)
- "LOGIN WITH ONE TIME PIN" button (secondary)
- ✅ Working

![Login Screen](/images/initiatives/consumer-mobile/consumer-mobile-v1/auth/app-login.png)

</td>
</tr>
</table>

---

### Forgot Password Flow

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Reset Password Screen**

- Email input field
- "EMAIL PASSWORD RESET LINK" button

![Reset Password Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/auth/portal-forgot.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Forgot Password Screen**

- Email input field
- "SEND RESET LINK" button
- Instructions with icon
- ⚠️ **Backend email generation not configured**
- User sees success message but no email arrives

![Forgot Password](/images/initiatives/consumer-mobile/consumer-mobile-v1/auth/app-forgot.png)

</td>
</tr>
</table>

---

### Logout Flow

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Logout**

- Shows signed in email
- "Sign out" button
- Profile navigation
- ✅ Working

![Profile Menu Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/auth/portal-logout.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Logout**

- Shows signed in email
- "Sign out" button in menu
- Profile navigation option
- ✅ Working

![Profile Menu](/images/initiatives/consumer-mobile/consumer-mobile-v1/auth/app-logout.png)

</td>
</tr>
</table>

---

### Update Password Flow

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Update Password Screen**

- Current password field
- New password field
- Confirm password field
- Password requirements displayed:
  - Uppercase letter
  - Lowercase letter
  - Number
  - Special character
- "UPDATE PASSWORD" button
- ✅ Working

![Update Password Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/auth/portal-update.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Update Password Screen**

*Screen not yet built*

- ❌ **Not yet implemented**
- Needs mobile-optimized layout
- Same validation rules as web
- Should be accessible from profile/settings
- Real-time password strength indicator
- **Estimate**: 1 day

</td>
</tr>
</table>

---

### Reset Password Flow (via Email Link)

<table>
<tr>
<td width="50%">

#### 🖥️ Portal (Web)

**Reset Password Handler**

*Working via email link*

- Token validation from email
- New password fields
- Password confirmation
- ✅ Working (email generation pending)

</td>
<td width="50%">

#### 📱 Mobile App

**Reset Password Handler**

*Not yet built*

- ❌ **Mobile UI missing**
- ❌ **Deep link handler missing**
- Needs deep link handling: `trilogycare://reset-password?token=...`
- Fallback to browser if app not installed
- **Estimate**: 2 days

</td>
</tr>
</table>

---

## Outstanding Work

### 1. Forgot Password Email Generation

**Issue**: Backend endpoint does not exist

**What happens now**:
- User taps "SEND RESET LINK"
- API returns success
- No email is sent
- User left waiting

**What's needed**:
- Configure mail driver in Laravel
- Enable `ForgotPasswordNotification`
- Test email delivery
- Add proper error handling if email fails

**Estimate**: 1 day

---

### 2. Reset Password Link Handler

**Issue**: No mobile screen exists to handle password reset links.

**What happens now**:
- User receives email (once email generation fixed)
- Clicks link in email
- Link opens in browser (web portal works)
- Mobile app has no handler for deep link

**What's needed**:
- Create mobile reset password screen
- Configure deep link handling (`trilogycare://reset-password?token=...`)
- Test iOS and Android deep link handling
- Fallback to browser if app not installed

**Estimate**: 2 days

---

### 3. Update Password Mobile Screen

**Issue**: No mobile screen exists for users to change their password while logged in.

**What happens now**:
- Web portal has working update password screen
- Mobile app has no equivalent
- Users must use web portal to change password

**What's needed**:
- Create mobile update password screen
- Match web functionality:
  - Current password validation
  - New password with confirmation
  - Password requirements display
  - Real-time validation feedback
- Add navigation from profile/settings
- Test on iOS and Android

**Estimate**: 1 day

---
