# Release Lens

Validate release readiness by probing deployment risks, rollback plans, feature flag strategy, data migration safety, and stakeholder communication.

## Output
Updates `spec.md` or creates `release-notes.md` in the epic folder.

## Taxonomy Categories

Scan the epic artifacts (spec.md, plan.md, db-spec.md, tasks.md) for each category. Mark status: Clear / Partial / Missing.

| Category | Focus Areas |
|----------|-------------|
| **Deployment Strategy** | Release order, feature flag gating, phased rollout vs big-bang, environment promotion path (dev → staging → prod) |
| **Data Migration Safety** | New tables, altered columns, backfill scripts, reversibility, zero-downtime migration compatibility |
| **Rollback Plan** | Feature flag kill switch, migration rollback steps, data cleanup if reverted, maximum safe rollback window |
| **Breaking Changes** | API contract changes, removed endpoints/columns, renamed routes, Zoho sync field mapping changes |
| **Dependency Coordination** | Other epics that must deploy first, shared migrations, queue worker restarts, cache invalidation |
| **Permissions & Access** | New permissions/roles required, gate/policy changes, who needs access before launch |
| **Monitoring & Observability** | Key metrics to watch post-deploy, error rate thresholds, Horizon queue health, expected log volume changes |
| **Stakeholder Communication** | Who needs to know (sales, clinical, support), training required, documentation updates, tc-docs pages |
| **Edge Cases at Scale** | Behavior with existing data (legacy leads, incomplete profiles), large dataset performance, concurrent user scenarios |
| **Post-Release Validation** | Smoke test checklist, critical user journeys to verify, data integrity checks, Zoho sync verification |

## Question Constraints

- Minimum 5 questions per session; after every 5, ask "Keep clarifying release?" to continue or wrap up
- Each answerable with: multiple-choice (2-5 options) OR short-phrase (<=5 words)
- Prioritise questions that surface deployment risks — things that could cause a rollback or incident
- Focus on what happens to existing data and existing users when the feature goes live

## Example Questions

- "What happens to the 2,400 existing leads created via the old wizard when LES goes live? Do they appear in the new staff list view as-is, or do they need backfill?"
- "If the feature flag is turned off after 1 week of production use, what happens to data created during that window (status histories, timeline entries, assignments)?"
- "Which Zoho sync fields change meaning or format? Will in-flight syncs during deployment produce corrupt data?"
- "Is there a migration that alters an existing column? If so, does the old code still work with the altered column during rolling deployment?"
- "Who outside engineering needs to be notified before go-live? Sales team training? Support team documentation?"

## Integration Format

Ensure `## Clarifications` section exists in spec with:
```markdown
### Session YYYY-MM-DD (Release Lens)
- Q: <question> -> A: <final answer>
```

Apply clarification to appropriate sections. If release-specific decisions warrant it, create a `## Release Plan` section in spec.md or a standalone `release-plan.md`.
