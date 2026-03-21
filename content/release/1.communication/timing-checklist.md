---
title: "Timing Checklist"
description: "Pre-release, release day, and post-release communication tasks. Use this checklist to coordinate release communications across teams. Copy the relevant tables into your release plan and track completion."
navigation:
  order: 3
---

## Pre-Release (2-3 Days Before)

| #   | Task                                     | Owner | Timing          | Notes                                             |
| --- | ---------------------------------------- | ----- | --------------- | ------------------------------------------------- |
| 1   | Brief Support team on upcoming changes   | PM    | 2-3 days before | Include FAQ and known limitations                 |
| 2   | Draft Help Center article updates        | PM    | 2-3 days before | Do not publish until release day                  |
| 3   | Prepare Teams announcement copy          | PM    | 1 day before    | Use channel `TC Portal Release and Announcements` |
| 4   | Send internal heads-up to affected teams | PM    | 1 day before    | Tag relevant team leads                           |
| 5   | Confirm feature flag configuration       | Dev   | Day of          | Verify toggle states before deploy                |

---

## Release Day

| #   | Task                                                               | Owner | Timing             | Notes                           |
| --- | ------------------------------------------------------------------ | ----- | ------------------ | ------------------------------- |
| 1   | Deploy to production                                               | Dev   | Scheduled window   | Follow deployment runbook       |
| 2   | Post release announcement in `TC Portal Release and Announcements` | Dev   | After deploy       | Link to release notes           |
| 3   | Monitor error rates and logs                                       | Dev   | 1 hour post-deploy | Check Sentry + application logs |
| 4   | Smoke test key user flows                                          | QA    | 30 min post-deploy | Cover critical paths only       |

---

## Post-Release (Same Day to Week 1)

| #   | Task                                       | Owner | Timing     | Notes                               |
| --- | ------------------------------------------ | ----- | ---------- | ----------------------------------- |
| 1   | Publish Help Center articles               | PM    | Same day   | Move drafts to live                 |
| 2   | Send user announcement (if applicable)     | PM    | Same day   | Via Intercom or email               |
| 3   | Review error logs for regressions          | Dev   | Next day   | Compare to pre-release baseline     |
| 4   | Gather initial user feedback               | PM    | First week | Monitor support tickets + Intercom  |
| 5   | Send leadership summary (if major release) | PM    | First week | Include metrics and feedback themes |
