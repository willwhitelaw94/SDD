---
title: "🚀 Releases"
description: "Release notes, deployment history and communication resources for the TC Portal"
icon: i-heroicons-megaphone
navigation:
  order: 7
---

Release notes are generated via `/trilogy-release-notes` which analyses the deployment PR from GitHub and extracts all the commits to produce a summary for what has just been released and why we've made the changes, addressed to multiple audiences.

This skill doesn't need to be manually ran by anyone, it will automatically run when code has been pushed into the `staging` branch, indicating that there are changes coming to production soon. However, this will only create a draft release note, which will need to be reviewed and approved by a developer before it is published here for everyone to see.

Each release note will have the following views:

| View Type      | Audience                                       |
| -------------- | ---------------------------------------------- |
| Business View  | CEO, CFO, Managers, Stakeholders               |
| End User View  | Recipients, Coordinators, Suppliers, Staff     |
| Support View   | Customer service, non technical internal teams |
| Technical View | Developers, QA                                 |

## Communication Plan

When we're scheduling a new release, it's important we plan how we're going to communicate this to all the relevant audiences

### Pre-Release

| Task                        | Owner | Timing          |
| --------------------------- | ----- | --------------- |
| Brief Support team          | PM    | 2-3 days before |
| Update Help Center drafts   | PM    | 2-3 days before |
| Internal Teams notification | PM    | 1 day before    |
| Feature flag configuration  | Dev   | Day of          |

### Release Day

| Task                                          | Owner | Timing           |
| --------------------------------------------- | ----- | ---------------- |
| Deploy to production                          | Dev   | Scheduled window |
| Post in `TC Portal Release and Announcements` | Dev   | After deploy     |
| Monitor error rates                           | Dev   | 1 hour post      |
| Smoke test key flows                          | QA    | 30 min post      |

### Post-Release

| Task                                   | Owner | Timing     |
| -------------------------------------- | ----- | ---------- |
| Publish Help Center articles           | PM    | Same day   |
| Send user announcement (if applicable) | PM    | Same day   |
| Review error logs                      | Dev   | Next day   |
| Gather initial feedback                | PM    | First week |
| Leadership summary (if major)          | PM    | First week |

---

## Communication Resources

| Type                    | When to Use           | Format              |
| ----------------------- | --------------------- | ------------------- |
| **Release Notes**       | Every release         | Markdown in tc-docs |
| **Help Center Article** | User-facing features  | Intercom article    |
| **Teams Announcement**  | Internal notification | Teams message       |
| **Email Campaign**      | Major features        | Email template      |
| **Training Video**      | Complex features      | Loom/video          |
| **PowerPoint**          | Stakeholder briefing  | Slides              |
