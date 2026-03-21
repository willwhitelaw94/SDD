---
title: "MOB1 - Documents"
description:
---

**Endpoints**: 4  
**Build Effort**: Medium - upload functionality needed, no portal version exists  
**Status**: ⚠️ Partially complete - viewing works, upload and portal missing  

---

## Implementation Status

| Feature                   | Mobile | Web | Backend | Notes                                      |
|---------------------------|--------|-----|---------|--------------------------------------------|
| List documents            | ❌      | ❌   | ✅       | Mobile working, **no portal version**      |
| View/download document    | ❌      | ❌   | ✅       | Mobile working, **no portal version**      |
| Upload document           | ❌      | ❌   | ❌       | **Not yet implemented**                    |
| Delete document           | ❌      | ❌   | ❌       | **Not yet implemented**                    |
| Document preview (in-app) | ❌      | ❌   | ❌       | S3 URLs work, **in-app preview not built** |
| Document categorization   | ❌      | ❌   | ❌       | Mobile shows document types                |

---

## Endpoints

| Endpoint                                              | Method | Status | Notes                                      |
|-------------------------------------------------------|--------|--------|--------------------------------------------|
| `/api/v1/recipient/packages/{package}/documents`      | GET    | ✅      | List documents                             |
| s3 bucket                                             | GET    | ✅      | Get document with download URL             |
| `/api/v1/recipient/packages/{package}/documents`      | POST   | ❌      | **Upload document - needs implementation** |
| `/api/v1/recipient/packages/{package}/documents/{id}` | DELETE | ❌      | **Delete document - needs implementation** |

---

## Screens

### Documents List

<table>
<tr>
<td width="50%">

#### 🌐 Web App

**Documents List Screen**

- List of all package documents
- Document name/title
- Document type/category
- Upload date
- File size
- Click to download/view
- ❌ **Not yet implemented**

![Documents List Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/documents/app-web-documents.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Documents List Screen**

- List of all package documents
- Document name/title
- Document type/category
- Upload date
- File size
- Tap to download/view
- ❌ **Not yet implemented**

![Documents List Mobile](/images/initiatives/consumer-mobile/consumer-mobile-v1/documents/app-documents.png)

</td>
</tr>
</table>

---

### Upload Document

<table>
<tr>
<td width="50%">

#### 🌐 Web App

**Upload Document Screen**

- File picker
- Document type selector
- Title/description fields
- Upload progress indicator
- File size/type validation
- ❌ **Not yet implemented**

![Upload Document Web](/images/initiatives/consumer-mobile/consumer-mobile-v1/documents/app-web-add-document.png)

</td>
<td width="50%">

#### 📱 Mobile App

**Upload Document Screen**

- Document picker (camera, files, photos)
- Document type dropdown
- Title/description fields
- Upload button
- Progress indicator
- File validation
- ❌ **Not yet implemented**

![Upload Document Mobile](/images/initiatives/consumer-mobile/consumer-mobile-v1/documents/app-add-document.png)

</td>
</tr>
</table>

---

## Outstanding Work

### 1. Portal Documents View (Not in MOB1 Scope)

**Issue**: There is no recipient-facing portal version of the documents feature

**What happens now**:
- Mobile app has document viewing capability
- Portal has no equivalent screen for recipients
- Only internal staff portal has document management
- Inconsistent experience between mobile and web

**What's needed**:
- Create recipient portal documents page
- List view matching mobile functionality
- Download/view capability
- Document filtering and search
- Responsive design for desktop

**Estimate**: 3-5 days

---

### 2. Document Upload Functionality

**Issue**: Recipients cannot upload documents from mobile or portal

**What happens now**:
- Recipients can only view/download documents
- All uploads happen through internal staff portal
- No self-service document submission
- Limits use cases (e.g., receipts, medical reports, ID documents)

**What's needed - Backend:**
- `POST /api/v1/recipient/packages/{package}/documents` endpoint
- S3 multipart upload handling
- File validation (type, size, virus scanning)
- Thumbnail generation for images/PDFs
- Document type/category assignment
- Metadata storage (uploader, date, description)

**What's needed - Mobile:**
- Document picker integration (expo-document-picker)
- Camera integration for photos
- Photo library access
- Document type selector
- Title/description form
- Upload progress indicator
- Error handling and retry logic
- File size validation before upload

**What's needed - Portal:**
- File upload component
- Drag-and-drop support
- Multi-file upload
- Upload queue management
- Same validation as mobile

**Estimate**: 5-7 days (backend + mobile + portal)

---

### 3. Document Delete Functionality

**Issue**: No ability to delete uploaded documents

**What happens now**:
- Documents accumulate indefinitely
- No way to remove duplicates or mistakes
- Only staff can delete via internal portal

**What's needed - Backend:**
- `DELETE /api/v1/recipient/packages/{package}/documents/{id}` endpoint
- Authorization check (only uploader or staff can delete)
- Soft delete vs hard delete decision
- S3 cleanup of deleted files
- Audit log of deletions

**What's needed - Mobile/Portal:**
- Delete button on document detail
- Confirmation dialog
- Handling of in-progress downloads
- Success/error messaging
- Refresh list after deletion

**Estimate**: 2-3 days

---

### 4. In-App Document Preview

**Issue**: Documents only download, no in-app preview

**What happens now**:
- Tapping a document downloads to device
- Opens in external app (Files, Photos, etc.)
- Leaves the app experience
- No quick preview capability

**What's needed - Mobile:**
- PDF viewer component (react-native-pdf or similar)
- Image viewer for photos
- Document type detection
- Zoom/pan controls
- Share button
- Download option from preview
- Loading states

**What's needed - Portal:**
- Browser-native preview for PDFs
- Image lightbox for photos
- Document viewer modal
- Download option
- Print option

**Estimate**: 3-4 days

---

### 5. Document Categorization and Filtering

**Issue**: Basic categorization exists but no filtering UI

**What happens now**:
- Documents have types (care plan, assessment, letter, etc.)
- All documents shown in single list
- No way to filter by type or date
- No search functionality

**What's needed**:
- Filter dropdown by document type
- Date range filter
- Search by document name
- Sort options (date, name, type)
- Clear filters action
- Show active filter badges

**Estimate**: 2-3 days
