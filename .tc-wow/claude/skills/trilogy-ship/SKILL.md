---
name: trilogy-ship
description: Orchestrate releases with changelog, commits, tags, and push. Use when shipping releases, creating changelogs, or deploying. Triggers on: ship, release, deploy, changelog, version bump, push release.
---

# Trilogy Ship Skill

Orchestrate a complete release: generate changelog (or use existing), commit, tag (optional), and push to remote.

## Parse User Intent

Extract from user's request:
- **Time range** for changelog: "since v1.2.0", "last 30 days", etc.
- **Version** to release: "patch", "minor", "major", or custom "v1.2.3"
- **Target**: "push to current", "create PR to main"
- **Create tag**: yes/no
- **Quick mode**: Skip changelog if user says "quick"

## Execute Release Workflow

```
MODE: Full Release

Ship a release with parameters:
- Time range: [user's specified range]
- Version: [patch/minor/major/v1.2.3/skip]
- Target: [push to current / create PR to main]
- Create tag: [yes/no]

Complete workflow:
1. Run pre-flight checks
2. Generate changelog (or use existing)
3. Commit changelog
4. Create git tag (if requested)
5. Push to remote
6. Create PR (if requested)
7. Provide release summary
```

## Special Cases

**Quick Ship** (no changelog):
```
User: /ship quick
→ Skip changelog, commit and push current branch
```

**Use Existing Changelog**:
```
User: /ship use existing changelog
→ Find most recent changelog file and use it
```

## Pre-Flight Checks

- Check git status
- Verify branch is up-to-date
- Warn about uncommitted changes
- Check for conflicts

## Safety Features

- ⚠️ Warn about breaking changes and require confirmation
- 🛡️ Check for sensitive data in changelog
- 🔍 Detect uncommitted changes
- ✋ Require confirmation before pushing
- 🔄 Provide rollback plan

## Version Bumping

**Auto-increment:**
- `patch`: 1.2.3 → 1.2.4 (bug fixes)
- `minor`: 1.2.3 → 1.3.0 (new features)
- `major`: 1.2.3 → 2.0.0 (breaking changes)

**Custom:**
- `v1.5.0`: Use exact version
- `skip`: No version tag, just push

## Quick Reference

| Command | What It Does |
|---------|--------------|
| `/ship` | Interactive release |
| `/ship quick` | Skip changelog, just push |
| `/ship since v1.2.0` | Release with time range |
| `/ship patch` | Auto-bump patch version |
| `/ship minor` | Auto-bump minor version |
| `/ship major` | Auto-bump major version |
| `/ship to main` | Create PR to main branch |
