# Priority System

The Support at Home Priority System ensures equitable allocation of funding to participants. Older people cannot access government-funded services until funding has been allocated.

## Government References

| Section | Topic | Manual Reference |
|---------|-------|------------------|
| 6.8 | The Support at Home Priority System | V4.2, Page 52-54 |
| 6.8.1 | Interim funding (MSO) | V4.2, Page 52-54 |
| 6.9 | Finding a Support at Home provider | V4.2, Page 54-55 |
| 6.9.1 | Single provider model | V4.2, Page 55 |

## Priority Categories

The priority category is determined during the aged care needs assessment based on standardised criteria.

| Priority | Description | Wait Time |
|----------|-------------|-----------|
| **Urgent** | Critical care needs | Immediate (always full funding) |
| **High** | Significant care needs | Shorter wait |
| **Medium** | Moderate care needs | Medium wait |
| **Standard** | Lower care needs | Longer wait |

### Factors Determining Position
1. Priority category (urgent, high, medium, standard)
2. Date of approval for home care

## Seeking Services Status

### Actively Seeking
- Automatically placed in Priority System
- Set as "seeking services"
- Receive funding as soon as available
- Notified via letter from Department of Health

### Not Actively Seeking
- Set as "not seeking services" during assessment
- Will not be allocated funding until status changed
- Can update status via My Aged Care or Online Account

## Immediate Funding Allocations

The following always receive immediate full funding (bypass priority system):
- **Urgent priority** participants
- **Restorative Care Pathway** participants
- **End-of-Life Pathway** participants

## Interim Funding (Minimum Service Offer)

### What Is Interim Funding?
- 60% of total classification funding
- Also called Minimum Service Offer (MSO)
- Allows participants to start receiving critical services
- Remaining 40% allocated when available (Full Service Offer - FSO)

### When Interim Funding Is Used
- Demand for Support at Home higher than expected
- Would lead to increased wait times
- Applies to:
  - People on National Priority System on 31 October 2025
  - People assessed eligible from 1 November 2025

### Interim Funding Rules
- Participant must still find provider and enter service agreement
- Care plan and individualised budget developed within 60% allocation
- When FSO received, care plan and budget reviewed/updated
- Service agreement may require updating

### Notifications

**Participant Receives:**
1. MSO Letter - Interim funding allocated (60%)
2. FSO Letter - Full funding allocated (remaining 40%)

**Provider Sees (My Aged Care Portal):**
- Referral page: "place assigned" shows "MSO"
- Approvals page: "place assigned" shows "MSO"
- When FSO assigned: Notification "participant receiving MSO is assigned FSO"
- Additional funding applied pro-rata from FSO allocation date

## Finding a Provider Timeline

| Days | Milestone |
|------|-----------|
| 0 | Funding allocated, letter sent |
| 56 | Deadline to enter service agreement |
| +28 | Extension available (contact My Aged Care) |
| 84 | Maximum time with extension |
| After | Funding withdrawn, removed from Priority System |

### If Funding Withdrawn
- No longer in Priority System
- Can re-join by contacting My Aged Care
- Re-entry date = original approval date
- No new assessment needed (unless needs changed)

## Single Provider Model

- One provider oversees all Support at Home services
- Includes care management and AT-HM services
- Each participant linked to single service delivery branch
- Provider responsible for coordinating, delivering, and claiming all services

### Provider Checks Before Committing
- Check My Aged Care record for active services
- Do not commit if participant has active in-home or residential care
- Confirm cessation date with current provider
- Committing with active entry record may cause claiming disputes

## TC Portal Implementation

### Current Features
- Participant funding status tracking
- Classification and funding level display
- Provider assignment workflow

### Future Considerations
- MSO/FSO status indicators
- Funding allocation timeline tracking
- Priority category display (where available)
- 56/84 day deadline alerts
- Current provider coordination tools
- Funding upgrade notifications (MSO to FSO)

## Business Rules

1. **No Services Without Funding** - Cannot provide government-funded services until funding allocated
2. **Single Provider** - All services through one service delivery branch
3. **MSO Care Planning** - Care plan must work within 60% if interim funding
4. **Provider Check** - Must verify no active services before committing
5. **Deadline Tracking** - 56 days (84 with extension) to enter service agreement

## Related Domains

- [Participant Onboarding](./participant-onboarding.md) - Receiving referrals and entering service agreements
- [Care Plans](./care-plans.md) - Developing care plans for MSO/FSO
- [Individualised Budgets](./individualised-budgets.md) - Budget development for interim funding
- [Service Cessation](./service-cessation.md) - Coordinating with previous providers
- [Restorative Care Pathway](./restorative-care-pathway.md) - Immediate funding allocation
- [End-of-Life Pathway](./end-of-life-pathway.md) - Immediate funding allocation
