# Service Confirmation

Service confirmation ensures transparency, accountability and participant satisfaction by maintaining documentation that demonstrates delivery of care and services.

## Government References

| Section | Topic | Manual Reference |
|---------|-------|------------------|
| 10.5 | Confirmation of service delivery | V4.2, Page 136-137 |
| 16.6 | Evidence required for claiming | V4.2, Page 187+ |

## Acceptable Evidence Types

### Care Documentation
- **Progress notes** - Clinical records or reports detailing episodes of service
- **Care notes** - Documentation of service delivery
- **Photos** - For equipment delivery or completion of services (gardening, home maintenance) where no privacy concerns exist

### Time & Attendance Records
- **Worker sign in/out** - Electronic or hand-written attendance records
- **Clock in/out data** - System-recorded timestamps
- **Geolocation data** - Registers care worker location and service times

### Participant Verification
- **Sign in book** - Physical record at participant's home
- **QR code** - Digital check-in accessed at participant's home

### Special Cases
- **Allied health** - Invoice accepted, but progress notes/clinical records encouraged
- **Meal delivery** - Invoice accepted, but progress notes confirming delivery and nutritional needs encouraged
- **AT-HM services** - Specific confirmation requirements in section 13.7.2

## TC Portal Implementation

### Current Features
- Service notes attached to bookings
- Shift records with timestamps
- Care notes linked to participant profiles

### QR Code System
- QR codes generated per participant/location
- Worker scans on arrival/departure
- Automatic timestamp recording
- Geolocation capture on scan

### Future Considerations
- Digital sign-in capability
- Photo attachment for equipment/completion
- Integration with billing/claiming systems
- Compliance reporting dashboard

## Business Rules

1. **Documentation Required** - All services must have confirmation evidence
2. **Third-party Included** - Applies to services delivered by third-party workers
3. **Self-managed Included** - Applies to self-managed participants
4. **Privacy Compliance** - Photos only where no privacy concerns
5. **Allied Health Exception** - Invoice acceptable but additional documentation encouraged

## Open Questions

| Question | Context |
|----------|---------|
| **When will geolocation be added?** | Documented as future capability but no code exists |
| **Visit/scan recording?** | QR system is auth-only - no timestamps for arrival/departure captured |
| **ServiceConfirmation model?** | No dedicated model - uses Package + QR relationship |

---

## Technical Reference

<details>
<summary><strong>Implementation Status</strong></summary>

### What Actually Exists

**QR Code System** - Complete PIN-based authentication:

```
domain/QrCode/
├── Models/QrCode.php                    # Polymorphic to Package
├── Traits/HasQrCode.php                 # Used by Package model
├── Actions/GenerateQRCodeAndPdfLetterForPackageAction.php
├── Http/Controllers/QrAuthController.php # PIN login/logout
├── Http/Middleware/EnsureQRAccess.php
└── Data/QrCodeData.php

routes/web/qr.php                        # QR route group
resources/js/Pages/QR/Login.vue          # 4-digit PIN entry
```

**Database Table:**
- `qr_codes` - uuid, qrable_type/id (polymorphic), pin (4-digit)

### What Does NOT Exist

| Feature | Status |
|---------|--------|
| ServiceConfirmation model | ❌ No dedicated domain |
| Geolocation tracking | ❌ Documented as future |
| Clock-in/attendance table | ❌ Not implemented |
| Shift management | ❌ No Shift model |
| Visit/scan timestamps | ❌ QR is auth-only |

### Current Limitations

QR system is **authentication-only** - does NOT record:
- When workers scan (arrival/departure)
- Geolocation of scan
- Which booking was fulfilled
- Service duration

**Planned**: QRW initiative (TP-1906) outlines future capabilities.

</details>

---

## Related Domains

- [Service Delivery](./service-delivery.md) - Core service delivery processes
- [Third-Party Services](./third-party-services.md) - Third-party worker service confirmation
- [Self-Management](./self-management.md) - Self-managed participant requirements
- [Billing & Claiming](./billing-claiming.md) - Evidence required for subsidy claims
