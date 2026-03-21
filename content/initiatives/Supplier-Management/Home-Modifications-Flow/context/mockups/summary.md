---
title: "HMF UI Mockup Summary"
---


**Created**: 2025-12-05
**Feature**: Home Modifications Flow (HMF)
**Epic**: TP-3155

---

## Overview

Created 8 distinct UI component mockups with 24 total variations across:
1. Compliance Dashboard ("Works" Tab) - 8 variations
2. Supplier Onboarding Forms - 6 variations
3. Document Review Interface - 5 variations

---

## Recommendations by Component

### 1. Compliance Dashboard ("Works" Tab)

**RECOMMENDED: Option F - Accordion List with Embedded Actions**

**Why:**
- Best balance of overview and detail
- Expand only works needing review
- All actions inline (no navigation required)
- Grouped by supplier (matches mental model)
- Progress bars visible at collapsed level
- Scalable (works with 5 or 50 works)

**Alternative:** Option B - Compact Table with Expandable Rows (for high-volume power users)

**File**: `compliance-dashboard-variations.txt`

---

### 2. Supplier Onboarding Forms

**For Product Suppliers:**

**RECOMMENDED: Option B - Wizard with Progress**

**Why:**
- Simple, guided experience
- Progress indicator builds confidence
- Category descriptions help selection
- Review step prevents submission errors
- Appropriate for straightforward registration

**For Home Modifications Contractors:**

**RECOMMENDED: Option E - Accordion/Expandable Sections**

**Why:**
- Handles complexity (multi-state credentials)
- See entire registration scope at once
- Jump to incomplete sections easily
- Progress indicator motivates completion
- Works well for multi-session completion
- Visual status icons (✓, ⚠, ○) helpful

**Alternative:** Option D - Multi-Step Wizard (if contractors prefer more guidance)

**File**: `supplier-onboarding-variations.txt`

---

### 3. Document Review Interface

**RECOMMENDED: Option B - Side-by-Side Document List with Quick Actions**

**Why:**
- Efficient workflow: all documents + current doc visible
- Quick approve/reject actions inline
- Dropdown for common rejection reasons
- Document list shows overall progress
- Scalable for varying document counts

**For Multi-Quote Scenarios:**

**Use: Option E - Comparison View**

**Why:**
- Critical for validating independent quotes
- Side-by-side prevents errors
- Price difference highlighted
- Validates different suppliers requirement

**For Power Users:**

**Alternative: Option C - Full-Screen Review Mode**

**Why:**
- Keyboard shortcuts enable fast batch processing
- Minimal UI maximizes document visibility
- Good for 50+ documents/day reviewers

**File**: `document-review-variations.txt`

---

## Key Design Principles Applied

### 1. Progressive Disclosure
- Start simple, reveal complexity only when needed
- Collapsed/expandable sections reduce overwhelm
- Wizards break complex processes into steps

### 2. Status Visibility
- Progress indicators show completion (50%, 2/4, etc.)
- Visual status icons (●, ○, ✓, ⚠, ✗)
- Color coding for work/payment status
- Clear pending/approved/rejected states

### 3. Batch Operations
- Group similar items (works by supplier)
- Inline actions reduce navigation
- Bulk approve/reject where appropriate
- Filter and search for efficiency

### 4. Context Preservation
- Show work details while reviewing documents
- Breadcrumbs and navigation aids
- Previous/next navigation maintains flow
- Master-detail patterns keep context

### 5. Error Prevention
- Validation before submission
- Review/confirmation steps
- Undo options for mistakes
- Clear required fields (*)
- Helpful error messages

---

## Responsive Considerations

### Mobile/Tablet Adaptations Needed

**Compliance Dashboard:**
- Card grid (Option A) stacks better on mobile than tables
- Accordion (Option F) works well with tap-to-expand
- Filters should collapse into dropdown/modal

**Supplier Onboarding:**
- Wizard steps (Option B/D) naturally mobile-friendly
- Category cards should stack vertically
- File upload needs mobile camera integration

**Document Review:**
- Side-by-side (Option B) becomes stacked on mobile
- PDF viewer needs mobile-optimized controls
- Quick actions should remain visible/sticky

---

## Accessibility Notes

All mockups should implement:
- **Keyboard navigation**: Tab order, arrow keys, shortcuts
- **Screen reader support**: ARIA labels, semantic HTML
- **Color contrast**: WCAG AA minimum (AAA preferred)
- **Focus indicators**: Clear visible focus states
- **Alternative text**: Images, icons, status indicators
- **Error messages**: Associated with form fields, descriptive

---

## Implementation Priority

### Phase 1: MVP (Minimum Viable Product)
1. **Product Supplier Onboarding** (Option B - Wizard)
   - Simplest flow, validates registration process
   - Tier-3 category selection
   - Basic profile creation

2. **Compliance Dashboard** (Option F - Accordion, simplified)
   - Core review interface
   - View works grouped by supplier
   - Basic document list

3. **Document Review** (Option B - Side-by-Side, basic)
   - Approve/reject functionality
   - PDF viewer
   - Rejection reasons

### Phase 2: Enhanced Features
1. **Contractor Onboarding** (Option E - Accordion)
   - State-specific credential logic
   - Multi-state support
   - File uploads per state

2. **Compliance Dashboard Enhancements**
   - Filters (state, status, supplier)
   - Search functionality
   - Bulk actions

3. **Document Review Enhancements**
   - Comparison view for multi-quote (Option E)
   - Document version history
   - Internal notes

### Phase 3: Power User Features
1. **Full-screen review mode** (Option C)
2. **Keyboard shortcuts**
3. **Batch operations**
4. **Export/reporting**
5. **Activity timeline** (Option H from dashboard)

---

## Next Steps

### Before Development:
1. **Validate with Users**:
   - Show mockups to compliance team
   - Walk through contractor onboarding flow
   - Test document review workflow with product suppliers

2. **Iterate Based on Feedback**:
   - Adjust based on user preferences
   - Test with actual documents/data
   - Refine visual design

3. **Create Detailed Mockups**:
   - High-fidelity designs in Figma/similar
   - Component library/design system
   - Interaction specifications

4. **Technical Planning**:
   - `/speckit.plan` - Create implementation plan
   - Define API requirements
   - Database schema design
   - Component architecture

---

## Questions for Stakeholders

1. **Compliance Team**:
   - How many works do you typically review per day?
   - What device do you primarily use (desktop/tablet)?
   - Which dashboard layout feels most efficient?
   - Are keyboard shortcuts valuable to you?

2. **Contractors**:
   - Have you used similar registration systems before?
   - Would you complete registration in one session or multiple?
   - Do you prefer step-by-step wizard or all-at-once form?
   - What credential documents do you typically have ready?

3. **Product Suppliers**:
   - How many Tier-3 categories do you typically supply?
   - Do you have existing price lists ready to upload?
   - What format are your price lists in (CSV, XLSX, PDF)?
   - Would you add price lists later or during registration?

---

## Technical Considerations

### Performance
- **PDF Viewer**: Use lightweight library (PDF.js), lazy load pages
- **Document List**: Virtualized scrolling for 100+ documents
- **Image Thumbnails**: Generate server-side, cache aggressively
- **Filters**: Client-side for <100 items, server-side for larger datasets

### File Upload
- **Progress indicators**: Show upload progress for large files
- **Drag-and-drop**: Support for desktop browsers
- **Mobile**: Camera integration for photo documents
- **Validation**: File type, size limits, malware scanning
- **Storage**: S3/blob storage with CDN for serving

### Real-time Updates
- **Notifications**: WebSocket/polling for new documents
- **Collaborative Editing**: Lock documents during review
- **Status Updates**: Real-time badge counts (X pending review)

---

## Design System Alignment

### Colors (Examples - adjust to TC Portal branding)
- **Success/Approved**: Green (#10B981)
- **Warning/Pending**: Amber (#F59E0B)
- **Error/Rejected**: Red (#EF4444)
- **Info/Under Review**: Blue (#3B82F6)
- **Neutral/Quoted**: Gray (#6B7280)

### Icons
- ✓ Checkmark: Approved
- ✗ X-mark: Rejected
- ● Filled circle: Active/In Progress
- ○ Empty circle: Pending/Not Started
- ⚠ Warning triangle: Attention needed
- 📄 Document icon: Files
- 📅 Calendar icon: Dates

### Typography
- **Headings**: Bold, larger font
- **Body**: Regular weight, readable size (16px+)
- **Labels**: Slightly smaller, medium weight
- **Helper text**: Smaller, gray color

---

## Files Generated

1. `compliance-dashboard-variations.txt` - 8 dashboard layout options
2. `supplier-onboarding-variations.txt` - 6 onboarding form options
3. `document-review-variations.txt` - 5 document review interfaces
4. `summary.md` - This file (recommendations and next steps)

---

**Total Variations Created**: 24 across 3 main UI components

**Recommended Path**: Use recommended options from each category for fastest MVP, iterate based on user feedback, add power features in later phases.
