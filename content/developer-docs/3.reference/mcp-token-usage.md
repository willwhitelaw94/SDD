---
title: MCP Token Usage
description: Token consumption analysis for Model Context Protocol (MCP) servers used in Claude Code
---

# MCP Token Usage

This document provides a breakdown of token consumption for each MCP server configured in the project. Understanding token usage helps optimize context window utilization when working with Claude Code.

## Summary

| MCP Server | Total Tokens |
|------------|--------------|
| Laravel Boost | 2,028 |
| Herd | 1,295 |
| Atlassian | 8,412 |
| Fireflies | 1,892 |
| MS-365 | 460 |
| **Total** | **14,087** |

---

## Laravel Boost

**Total: 2,028 tokens**

Laravel ecosystem MCP server offering database schema access, Artisan commands, error logs, Tinker execution, semantic documentation search and more.

| Tool | Tokens |
|------|--------|
| application-info | 104 |
| browser-logs | 93 |
| database-connections | 55 |
| database-query | 135 |
| database-schema | 121 |
| get-absolute-url | 144 |
| get-config | 114 |
| last-error | 70 |
| list-artisan-commands | 60 |
| list-available-config-keys | 65 |
| list-available-env-vars | 118 |
| list-routes | 276 |
| read-log-entries | 102 |
| search-docs | 383 |
| tinker | 188 |

---

## Herd

**Total: 1,295 tokens**

Laravel Herd local development environment management tools for PHP versions, sites, services, and debugging.

| Tool | Tokens |
|------|--------|
| find_available_services | 153 |
| install_service | 131 |
| start_or_stop_service | 214 |
| start_debug_session | 69 |
| stop_debug_session | 60 |
| get_all_php_versions | 76 |
| install_php_version | 102 |
| get_all_sites | 93 |
| get_site_information | 91 |
| secure_or_unsecure_site | 108 |
| isolate_or_unisolate_site | 198 |

---

## Atlassian

**Total: 8,412 tokens**

Integration with Atlassian products including Jira and Confluence for issue tracking, documentation, and project management.

| Tool | Tokens |
|------|--------|
| atlassianUserInfo | 78 |
| getAccessibleAtlassianResources | 85 |
| getConfluencePage | 411 |
| searchConfluenceUsingCql | 449 |
| getConfluenceSpaces | 628 |
| getPagesInConfluenceSpace | 475 |
| getConfluencePageFooterComments | 373 |
| getConfluencePageInlineComments | 405 |
| getConfluencePageDescendants | 299 |
| createConfluencePage | 449 |
| updateConfluencePage | 465 |
| createConfluenceFooterComment | 334 |
| createConfluenceInlineComment | 500 |
| getJiraIssue | 366 |
| editJiraIssue | 303 |
| createJiraIssue | 679 |
| getTransitionsForJiraIssue | 357 |
| getJiraIssueRemoteIssueLinks | 419 |
| getVisibleJiraProjects | 443 |
| getJiraProjectIssueTypesMetadata | 294 |
| getJiraIssueTypeMetaWithFields | 330 |
| addCommentToJiraIssue | 413 |
| transitionJiraIssue | 760 |
| searchJiraIssuesUsingJql | 393 |
| lookupJiraAccountId | 220 |
| addWorklogToJiraIssue | 413 |
| search | 140 |
| fetch | 185 |

---

## Fireflies

**Total: 1,892 tokens**

Meeting transcript and summary retrieval from Fireflies.ai for accessing recorded meeting content and insights.

| Tool | Tokens |
|------|--------|
| fireflies_get_transcript | 147 |
| fireflies_get_summary | 154 |
| fireflies_get_transcripts | 544 |
| fireflies_get_user | 134 |
| fireflies_get_usergroups | 168 |
| fireflies_get_user_contacts | 169 |
| fireflies_search | 451 |
| fireflies_fetch | 125 |

---

## MS-365

**Total: 460 tokens**

CLI for Microsoft 365 commands for SharePoint, Teams, and other Microsoft services.

| Tool | Tokens |
|------|--------|
| m365_search_commands | 176 |
| m365_get_command_docs | 159 |
| m365_run_command | 125 |

---

## Notes

- Token counts are based on tool definitions loaded into the context window
- Actual usage may vary based on tool invocation and response sizes
- Consider disabling unused MCP servers to reduce context consumption
- Last updated: 2026-01-28
