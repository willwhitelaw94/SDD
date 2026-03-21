---
title: "Business Alignment: Integrations & Migration"
---

# Business Alignment: Integrations & Migration

**Epic Code**: SR9
**Created**: 2026-03-19
**Author**: Will Whitelaw

---

## Business Objectives

1. **Protect revenue-critical integrations during migration** -- Zoho CRM sync (sales pipeline), MYOB vendor mapping (supplier payments), and EFTSure verification (payment fraud protection) are active in production. Any disruption has immediate business impact.
2. **Migrate ~13,000 supplier profiles safely** -- existing profiles need Organisation Administrator role assignment without schema changes. The migration must be incremental, resumable, and reversible.
3. **De-risk the portal cutover** -- a parallel frontend strategy with feature flag routing and kill switch means no all-or-nothing cutover. Any supplier can be reverted to the legacy portal within 30 seconds.
4. **Close the compliance register automation gap** -- AHPRA, NDIS, aged care, and AFRA register checks are currently manual. Automating these reduces compliance risk and frees staff time.
5. **Enable transparent user migration** -- existing users get API tokens on first post-migration login with zero manual steps. No re-registration, no password reset, no support tickets at scale.

---

## Success Metrics

| KPI | Target | Measurement Method | Baseline |
|-----|--------|--------------------|----------|
| Zoho CRM sync failures caused by migration | Zero | Horizon job monitoring, Zoho sync status dashboard | Zero today (current system is stable) |
| MYOB payment run failures from broken mappings | Zero | MYOB reconciliation report post-migration | Zero today |
| EFTSure verification coverage on new API | 100% of bank detail submissions | Automated check on bank detail save event | 100% on legacy portal |
| Profiles successfully migrated to two-tier model | 100% of ~13,000 (less manual review cases) | Migration report (FR-008) | 0% migrated |
| Manual review cases flagged (multi-supplier ambiguity) | 100% of ambiguous cases flagged, zero silent misassignments | Migration report audit | N/A |
| Kill switch revert time | < 30 seconds | Operational drill / timing test | N/A (no kill switch exists) |
| API token provisioning on first login | 100% of existing users, zero manual intervention | Login event monitoring | N/A |
| Feature flag routing accuracy | Zero mis-routes | Routing audit during wave rollouts | N/A |

---

## ROI Analysis

### Costs

| Item | Estimate | Notes |
|------|----------|-------|
| Integration continuity (Zoho, MYOB, EFTSure) | ~2-3 weeks | Verify existing jobs fire from new API paths, add deduplication testing, EFTSure trigger on new bank detail flows |
| Data migration tooling | ~2-3 weeks | Artisan command with batch/offset, role_migrated_at tracking, multi-supplier reconciliation, migration report |
| Feature flag + kill switch infrastructure | ~1-2 weeks | Pennant feature flag for portal routing, middleware for redirect logic, kill switch via Pennant override |
| Token provisioning | ~1 week | Transparent token issuance on first login, SSO support, duplicate prevention |
| Compliance register framework (stub) | ~1 week | ComplianceRegisterCheck model, job skeleton, schedule entry, alert mechanism. Actual register connectors deferred |
| Search index updates | ~0.5-1 week | Scout/Elasticsearch index includes org hierarchy, tested across both portals |
| QA and migration dry-runs | ~3-4 weeks | Integration testing, migration rehearsals on staging, wave rollout testing |
| **Total estimated cost** | **~12-16 weeks (spread across initiative)** | Not a single sprint -- work is distributed across the SR0-SR8 timeline |

### Benefits

| Benefit | Estimated Value | Timeframe |
|---------|----------------|-----------|
| Avoided payment disruption (MYOB) | A broken payment run affects all supplier payments for a cycle. A single disrupted fortnightly cycle = $500K-$2M in delayed payments, plus manual reconciliation cost of 40-80 hrs | Ongoing during migration |
| Avoided sales pipeline disruption (Zoho) | Stale CRM data means missed follow-ups. Difficult to quantify but the sales team relies on portal-to-CRM sync for daily operations | Ongoing during migration |
| Avoided fraud exposure (EFTSure) | A single fraudulent bank detail change that bypasses EFTSure could result in a misdirected payment of $10K-$100K+ | Ongoing during migration |
| Support ticket avoidance (token provisioning) | Without transparent tokens, ~13,000 users would need manual intervention. Even 5% needing support = 650 tickets at ~15 min each = ~160 hours of support time | One-time at migration |
| Kill switch risk reduction | Avoids an all-or-nothing cutover. If the new portal has critical issues, revert within 30 seconds instead of an emergency rollback taking hours/days | Duration of parallel running |
| Compliance register automation | ~2-4 hrs/week staff time currently spent on manual AHPRA and banning order checks across ~100+ active suppliers | Post-connector delivery |

### Payback Period

**Integration continuity is not an ROI question -- it is a risk mitigation requirement.** The cost of NOT doing this (broken payments, stale CRM, fraud exposure) dwarfs the development investment. The question is not "should we do it" but "can we afford not to."

The migration tooling and feature flag infrastructure pay back immediately by enabling safe, incremental cutover instead of a risky big-bang deployment.

---

## Stakeholder Impact

| Stakeholder | Impact | Sentiment |
|-------------|--------|-----------|
| **Finance team** | MYOB payment runs continue uninterrupted. Bank verification (EFTSure) remains active. No manual reconciliation required | Strongly positive (their #1 concern is payment continuity) |
| **Sales/CRM team** | Zoho CRM sync continues bidirectionally. No stale pipeline data during migration | Positive |
| **Suppliers (~13,000)** | Transparent migration -- existing credentials work, API tokens issued automatically, feature flags control which portal they see. Kill switch provides safety net | Neutral to positive (they should not notice the migration) |
| **TC Staff (Support)** | Compliance register automation reduces manual checking. Migration report gives visibility into profile status | Positive |
| **Sophie Pickett (Compliance)** | AHPRA and banning order check framework is established. Actual register connectors delivered incrementally | Positive (long-requested) |
| **Lachlan Dennis (Infrastructure)** | Consulted on deployment strategy. Pennant-based routing means no reverse proxy changes needed | Neutral |
| **Khoa Duong (Tech)** | Consulted on existing integration code (Zoho, MYOB, EFTSure). Validates that new API paths trigger existing jobs correctly | Neutral |

---

## Risk to Business

### If we don't do this

- **Integrations break silently**: New API paths do not trigger Zoho sync, MYOB updates, or EFTSure checks. Payments go out without verification. CRM data drifts. These failures may not be detected until a payment run fails or an audit reveals gaps.
- **Big-bang cutover is the only option**: Without feature flags and kill switch, deploying the new portal is all-or-nothing for ~13,000 suppliers. If something goes wrong, the rollback is manual and could take hours.
- **Manual migration at scale**: Without automated role assignment, someone must manually assign Organisation Administrator roles to ~13,000 profiles. At 2 minutes per profile, that is ~430 hours of manual work.
- **Token provisioning creates support flood**: Without transparent token issuance, every existing user needs manual intervention to access the new portal. Even a 5% support rate = 650 tickets.

### If we do it badly

- **Duplicate sync jobs corrupt CRM data**: If deduplication fails during the parallel-running period, the same supplier update could fire twice to Zoho, creating duplicate records or overwriting concurrent changes.
- **Migration script assigns wrong roles**: If multi-supplier organisation reconciliation has bugs, the wrong person gets Organisation Administrator access to all entities under an ABN. This is a data access and security issue.
- **Kill switch does not work under load**: If the Pennant flag check is slow or cached incorrectly, the 30-second revert target is missed and suppliers are stuck on a broken portal.
- **Feature flag routing leaks**: If the middleware has edge cases (bookmarked URLs, mid-session flag changes, SSO callbacks), suppliers end up on the wrong portal with broken sessions.

---

## Dependencies on Other Epics

| Dependency | Type | Detail |
|------------|------|--------|
| **SR0-SR8 (All epics)** | SR9 supports all | Integration continuity and migration infrastructure must be in place before any supplier-facing epic goes live |
| **SR0 (API Foundation)** | Hard prerequisite for migration | The two-tier Organisation/Supplier model must exist before role migration can run |
| **SR2 (Profile Management)** | Integration trigger | New bank detail flows from SR2 must trigger EFTSure verification through the new API |
| **SR4 (Billing & Invoicing)** | Integration trigger | Billing changes must trigger MYOB vendor updates correctly through the new API |

**Key insight**: SR9 is not a standalone epic -- it is a cross-cutting workstream that runs in parallel with everything else. Work starts with SR0 (integration continuity verification) and continues through to final legacy portal decommission.

---

## Go/No-Go Criteria

### Integration Continuity (start immediately with SR0)

- [ ] **Existing integration code is audited** -- Zoho sync (SyncSupplierToZohoJob, 4 action classes, 1 controller), MYOB (MyobCreateOrUpdateVendorAction), EFTSure triggers are documented and tested
- [ ] **ShouldBeUnique on SyncSupplierToZohoJob is verified** -- confirm the uniqueId() implementation prevents duplicate dispatches during parallel running
- [ ] **Integration test suite exists** -- automated tests that verify Zoho, MYOB, and EFTSure are triggered from both legacy and new API paths

### Data Migration (before first wave rollout)

- [ ] **SR0 Organisation/Supplier model is live** -- role migration requires the two-tier model to exist
- [ ] **Migration script is tested on staging** -- dry run against a copy of production data, with migration report reviewed
- [ ] **Manual review process is defined** -- who reviews ambiguous multi-supplier cases, and what is the turnaround expectation
- [ ] **Rollback procedure is documented** -- if migration assigns wrong roles, how do we revert

### Feature Flag Rollout (before first supplier sees new portal)

- [ ] **Pennant feature flag is implemented and tested** -- `SupplierNewPortal` flag with per-supplier granularity
- [ ] **Kill switch is tested under load** -- revert within 30 seconds confirmed
- [ ] **Parallel frontend routing is validated** -- both portals hit the same API, middleware correctly redirects based on flag state
- [ ] **Wave rollout plan is defined** -- which suppliers go first (new registrations), wave size for existing suppliers, monitoring criteria between waves

---

## Links

- [Spec](/initiatives/Supplier-REDONE/SR9-Integrations-Migration/spec)
- [Idea Brief](/initiatives/Supplier-REDONE/SR9-Integrations-Migration/idea-brief)
- [SR0 - API Foundation](/initiatives/Supplier-REDONE/SR0-API-Foundation/spec)
- Parent: [Supplier REDONE](/initiatives/Supplier-REDONE)
