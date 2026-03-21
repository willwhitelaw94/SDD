# TP-2432: Multi-Package Support for Restorative Care & End of Life

## Quick Overview

This epic enables Trilogy Care Portal to support clients with multiple concurrent service packages, specifically for restorative care and end-of-life care pathways.

**Why It Matters**: Clients undergoing restorative care often want to maintain their existing ongoing support. End-of-life care requires separate coordination. Currently, the system enforces a one-to-one relationship between clients and packages, creating impossible situations.

**Current Status**:
- ✅ Specification completed
- ⏳ Awaiting 3 design clarification answers
- ⏳ Ready for technical planning
- 🚀 Interim solution can start immediately

---

## Key Documents

### Specification
- **File**: `spec.md`
- **Status**: DRAFT (complete, ready for stakeholder review)
- **Content**:
  - 3 real-world scenarios (Jane, Robert, Maria)
  - 5 user stories with acceptance criteria
  - 12 functional requirements
  - 10 success criteria
  - Architectural recommendation (Multiple Packages approach)
  - Interim solution for immediate clients

### Quality Checklist
- **File**: `checklists/spec-quality.md`
- **Status**: VALIDATED ✅
- **Content**:
  - Requirement completeness verification
  - 3 design clarifications (non-blocking)
  - Readiness assessment
  - Sign-off status

### Analysis Documents (Reference)
- **File**: `../../multi-package-analysis.md` (in parent directory)
- **Content**: Deep dive on Approach 1 vs Approach 2, effort estimates

---

## The Problem

### Current State
- ✗ One package per client (enforced by database unique constraints)
- ✗ Cannot have restorative care + ongoing simultaneously
- ✗ End-of-life clients forced to terminate existing packages
- ✗ Workarounds: manual duplicate records, lost audit trails

### Demand Signal
- **4 active end-of-life packages** (1 of 4 already passed away)
- **~20 restorative care inquiries** from direct care activities
- **Multiple clients in approval pipeline** for both programs
- **Cannot support these clients with current architecture**

### Business Impact
- Regulatory compliance: Services Australia expects multiple packages per client
- Revenue opportunity: Restorative care and EOL are new programs
- Staff efficiency: Workarounds are time-consuming and error-prone

---

## The Solution (Recommended)

### Approach: Multiple Package Records
- Remove one-to-one constraint
- Allow users to have `hasMany(packages)` relationship
- Each package: independent needs, goals, budget, bills, care plan
- Package types: STANDARD, RESTORATIVE_CARE, END_OF_LIFE
- Support different care partners per package
- Unified dashboard with package switching

### Why This Over Alternatives
- Cleaner code (less conditional partitioning)
- Better long-term flexibility
- Matches Services Australia's model
- Solves terminated package history issue
- Better for testing and maintenance

### Effort Estimate
- **Database**: 1-2 days (remove constraints, add fields)
- **Backend**: 3-5 days (model changes, package context)
- **Frontend**: 3-4 days (package selector, context awareness)
- **Testing**: 3-4 days
- **Total**: ~2-3 weeks

---

## Next Steps

### Step 1: Stakeholder Clarifications (2-3 questions)
Need input on:
1. **Care Circle**: Shared across packages or separate?
2. **Statements**: Combined or per-package?
3. **Timeline**: Show all events or active package only?

👉 **Action**: Reply to clarifications in `spec.md` → Open Questions section

### Step 2: Design (In Parallel)
Run `/trilogy.clarify-design` to nail down:
- Package selector UI placement
- Multi-care-partner component design
- Care plan separation UX
- Timeline toggle interaction

### Step 3: Technical Planning (In Parallel)
Run `/speckit.plan` to create:
- Phased implementation breakdown
- Database migration plan
- Code change checklist
- Testing strategy

### Step 4: Interim Solution (Can Start Now)
While full implementation in progress:
1. Restore package tags UI (1 day)
2. Add restorative care note types (1 day)
3. Set up Trilogy Care as internal supplier (1 day)
4. Document manual workflow for staff (1 day)

**Impact**: Unblock 20+ clients within 4 days ✅

---

## Key Clarifications Needed

### [1] Care Circle Behavior
**Question**: Should contacts be shared across packages, separate, or hybrid?
**Impact**: UI design, data model, notifications
**Recommendation**: Start with shared (simpler), refine if needed

### [2] Statement/Reporting Format
**Question**: Combined statement or per-package or user-selectable?
**Impact**: Finance reconciliation, client reporting
**Recommendation**: Toggle-able view for flexibility

### [3] Timeline & Events
**Question**: Show all packages' events or only active package?
**Impact**: Information density, context awareness
**Recommendation**: Toggle between all/active (advanced mode)

---

## Success Criteria

### Functional
- ✅ Can create 2+ packages for same client without data loss
- ✅ Restorative care package creation: <2 minutes
- ✅ Service non-duplication enforced >99%
- ✅ Bills routed to correct package first attempt: 95%+

### Operational
- ✅ Financial accuracy: >99.5%
- ✅ Services Australia compliance: 100% approval
- ✅ Staff efficiency: ≥ previous workarounds

### Experience
- ✅ Package visibility: <1 second to identify current package
- ✅ Context clarity: No confusion between packages
- ✅ Unified view: All packages visible with clear attribution

---

## Stakeholder Contacts

**Spec Owner**: Will Whitelaw (Architecture)
**Product Contact**: Romy Blacklaw (Operations/Care)
**Technical Contact**: Anthony Rae (Data/Architecture)
**Finance Contact**: Pat/Finance Team

---

## Resources

- **Meeting Transcript**: `.claude/INITIATIVES/urgent-need-for-two-packages-for-one-client-in-portal-2fac6f4e-746b.pdf`
- **Current Package Architecture**: `domain/Package/Models/Package.php` (881 lines)
- **Services Australia Integration**: Existing PRODA sync (already supports multiple packages)
- **Related Features**: Care Plans, Needs Assessment, Budget Plans, Bills

---

## Timeline Estimate

- **Design Clarification**: 2-3 days (depends on stakeholder response)
- **Technical Planning**: 2-3 days
- **Phase 1 Database/Backend**: 5-7 days
- **Phase 2 Frontend**: 4-5 days
- **Phase 3 Testing/QA**: 4-5 days
- **Total**: ~4-5 weeks (with 2-3 week interim solution working in parallel)

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Care circle complexity | Medium | Medium | Start with shared, refine iteratively |
| Multi-package business logic | High | High | Use interim solution to validate rules |
| Staff training gap | Medium | Medium | Include training plan in Phase 3 |
| Services Australia sync issues | Low | High | Test early in Phase 1 |
| Timeline/reporting complexity | Medium | Low | Implement toggle for flexibility |

---

## Related Issues

- **Terminated Package History**: Anthony's concern about losing terminated package data → SOLVED by this approach
- **Restorative Care Pipeline**: 20+ clients waiting → SOLVED by interim solution
- **End-of-Life Support**: 4 active packages → SOLVED by full implementation

---

*Last Updated: 2025-12-07*
*Next Review: After stakeholder clarifications*
