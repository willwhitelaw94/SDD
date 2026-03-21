---
title: Internal Development
description: TC infrastructure, tools, and technical systems
---

Terms related to Trilogy Care's internal development infrastructure, tools, and technical systems.

---

## Integration & Systems

**MYOB** — MyObjective
Accounting software integration for financial record synchronization and reporting.

**Services Australia API** — Government API for retrieving SAH program data, recipient info, and funding details.

**N+1 Query Problem** — Database performance issue where queries multiply with data volume. Avoided through eager loading.

**Event Sourcing** — Design pattern capturing all changes to application state as immutable events for audit trail and replay capability.

**Soft Delete** — Marking records as deleted without removing them from database, preserving historical data and enabling recovery.

**Activity Logging** — Automated tracking of changes to records including who made the change and when.

---

## Documentation & Knowledge

**Context Engineering** — Philosophy of building rich, accessible knowledge bases to improve AI-assisted development.

**Nuxt Content** — File-based CMS for Nuxt applications powering TC Docs. Uses markdown files with YAML frontmatter.

**Nuxt Studio** — Visual editing interface for Nuxt Content documentation, enabling non-technical editing.

**MCP Server** — Model Context Protocol server providing tools and resources to Claude for specialized tasks.

**Submodule** — Git submodule managing external dependencies as separate repositories within the main project.

---

## Database & Architecture

**UUID** — Universally Unique Identifier
Used for cross-domain relationships and distributed system identification instead of auto-increment IDs.

**Domain-Driven Design** — Architectural approach organizing code by business domains rather than technical layers.

**Foreign Key** — Database constraint maintaining referential integrity between related tables.

**Composite Index** — Database index on multiple columns for optimizing multi-field queries.

**Eager Loading** — Database optimization technique loading related records in single query instead of N+1 queries.

**Migration** — Versioned database schema change managed through Laravel migrations for reproducible deployments.

---

## Development Workflow

**Git Worktree** — Git feature allowing multiple working directories from single repository.

**Pre-commit Hook** — Script running before commits to validate code quality and prevent bad commits.

**Linter** — Tool checking code style and quality (Laravel Pint).

**Type Hint** — PHP language feature declaring expected parameter and return types for functions.

**Factory** — Testing utility generating model instances with realistic test data.

**Seeder** — Database script populating test or demo data.

---

## Testing & Quality

**Unit Test** — Test verifying single function or class in isolation.

**Feature Test** — Test verifying complete user workflows end-to-end.

**Test Coverage** — Percentage of code paths exercised by automated tests.

**Pest** — Modern PHP testing framework used throughout TC Portal.

**Playwright** — Browser automation testing tool for frontend testing.

**Fixture** — Static test data used consistently across multiple tests.

---

## Code Organization

**Service Class** — Class encapsulating business logic for a specific domain concern.

**Policy** — Laravel authorization class defining permissions for model actions.

**Middleware** — HTTP request/response interceptor for cross-cutting concerns.

**Trait** — Reusable code block that can be composed into multiple classes.

**Controller** — HTTP endpoint handler processing requests and returning responses.

**Request Class** (Form Request) — Class encapsulating validation rules and messages for form inputs.

---

## Infrastructure

**Laravel Herd** — Local development environment providing MySQL, Redis, and other services.

**Laravel Horizon** — Dashboard for monitoring and managing Redis queues and jobs.

**Laravel Sanctum** — Lightweight API authentication for token-based and session-based auth.

**Laravel Pennant** — Feature flag system enabling gradual feature rollouts and A/B testing.

**Queue Job** — Background task processed asynchronously via Redis.

**Schedule** — Cron-like task scheduled via Laravel scheduler.

---

## Performance & Optimization

**Caching** — Storing computed results to avoid recalculation.

**Pagination** — Dividing large result sets into pages for faster loading.

**Database Indexing** — Optimizing query performance through strategic index placement.

**Query Optimization** — Analyzing and improving slow database queries.

**Lazy Loading** — Deferring data loading until needed.

---

## External Tools & Services

**GitHub** — Version control and collaboration platform.

**GitHub Actions** — CI/CD automation running tests and deployments on code changes.

**Envoyer** — Zero-downtime deployment service.

**AWS** — Amazon Web Services hosting infrastructure.

**Sentry** — Error tracking and monitoring service.

**CloudWatch** — AWS monitoring and logging service.

**Laravel Telescope** — Local development debugging tool for inspecting requests, queries, and logs.
