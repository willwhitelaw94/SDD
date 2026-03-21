---
title: Product & Technical
description: Features, technical concepts, and architecture
---

Terms related to product features, technical architecture, and implementation patterns.

---

## Product Features & Domains

**Coordinator Portal** — Dashboard for care coordinators to manage services, budgets, and communications.

**Budget Management** — Tools for creating, updating, and tracking service plans and budget allocation.

**Claims Management** — Integration for submitting claims to Services Australia and tracking claim status.

**Bill Processing** — Supplier invoice ingestion, validation, matching, and payment processing.

**Contributions** — Management of voluntary client top-ups and additional funding sources.

**Statements** — Financial transaction history and reporting for recipients and coordinators.

**Documents** — File management system for service agreements, assessments, and compliance documents.

**Notes** — Internal communication and care log system for documenting interactions and decisions.

**Utilisation Tracking** — Monitoring and reporting on actual spend vs. planned allocation.

**Supplier Management** — Onboarding, verification, and performance management of service providers.

**Team Management** — User permissions, organizational hierarchy, and access control.

**Feature Flags** — System for gradual feature rollouts and A/B testing using Laravel Pennant.

---

## Technical Architecture

**Backend** — Server-side application handling business logic and data management.

**Frontend** — Client-side UI for user interaction and data display.

**Database** — Persistent data storage (MySQL/Aurora).

**Cache** — In-memory data store (Redis) for performance optimization.

**Queue** — Background job processing system (Redis-based).

**API** — Application Programming Interface; structured endpoint for system communication.

**REST** — Representational State Transfer; architectural style for APIs using HTTP methods.

**Inertia.js** — Server-side routing framework bridging Laravel backend and Vue frontend.

**Component** — Reusable UI element (button, form, card, etc.).

**Page** — Full page component representing a route/URL.

**Reactive** — Automatically updating UI when underlying data changes.

---

## Technology Stack

**Laravel** — PHP web framework for backend application.

**Vue.js** — JavaScript framework for interactive frontend components.

**TypeScript** — Typed superset of JavaScript for type safety.

**Tailwind CSS** — Utility-first CSS framework for styling.

**MySQL** — Relational database for persistent storage.

**Redis** — In-memory data store for caching and queues.

**Meilisearch** — Search engine for full-text search functionality.

**Eloquent** — Laravel's ORM (Object-Relational Mapping) for database interaction.

**Blade** — Laravel's templating engine (legacy, being replaced by Inertia).

**Vite** — Modern frontend build tool and development server.

---

## Code Patterns & Principles

**MVC** — Model-View-Controller architectural pattern separating concerns.

**Repository Pattern** — Abstraction layer for data access.

**Service Layer** — Business logic layer separate from HTTP handling.

**Dependency Injection** — Passing dependencies to classes rather than creating internally.

**DRY** — Don't Repeat Yourself; avoiding code duplication.

**SOLID** — Set of principles for writing maintainable object-oriented code.

**Single Responsibility** — Class should have one reason to change.

**Open/Closed** — Code should be open for extension, closed for modification.

**Liskov Substitution** — Derived classes should be substitutable for base classes.

**Interface Segregation** — Clients shouldn't depend on interfaces they don't use.

**Dependency Inversion** — Depend on abstractions, not concrete implementations.

---

## Data & State Management

**State** — Current data and configuration of application.

**Props** — Data passed from parent to child component.

**Emit** — Child component sending data back to parent.

**Computed Property** — Property derived from other state, cached until dependencies change.

**Watcher** — Function responding to changes in data.

**Store** — Centralized state management (Pinia, Vuex).

**Mutations** — Functions that synchronously modify state.

**Actions** — Functions that can be asynchronous and commit mutations.

**Selectors** — Functions extracting derived data from state.

**Serialization** — Converting objects to JSON for transmission.

**Deserialization** — Converting JSON back to objects.

---

## User Experience

**UX** — User Experience; overall feel and usability of application.

**UI** — User Interface; visual design and interactive elements.

**Accessibility** — Ability for all users including those with disabilities to use application.

**WCAG** — Web Content Accessibility Guidelines standard.

**Usability** — Ease with which users can accomplish tasks.

**User Research** — Understanding user needs, behaviors, and pain points.

**User Flow** — Sequence of steps user takes to accomplish goal.

**Wireframe** — Low-fidelity sketch of page layout.

**Mockup** — High-fidelity visual design of interface.

**Prototype** — Interactive model for testing design concepts.

---

## Performance & Optimization

**Performance** — Speed and responsiveness of application.

**Latency** — Time delay between request and response.

**Throughput** — Number of requests processed per second.

**Load Time** — Time for page to fully load and render.

**Time to First Byte (TTFB)** — Time until first data arrives from server.

**First Contentful Paint (FCP)** — Time until first content visible on screen.

**Largest Contentful Paint (LCP)** — Time until largest content element is visible.

**Cumulative Layout Shift (CLS)** — Unexpected layout changes during page load.

**Caching** — Storing computed results to avoid recalculation.

**Minification** — Removing unnecessary code characters (spaces, comments).

**Code Splitting** — Breaking code into smaller chunks loaded on demand.

**Tree Shaking** — Removing unused code during build process.

---

## Security & Privacy

**Authentication** — Verifying user identity (login).

**Authorization** — Determining what authenticated user can do.

**Encryption** — Converting data to unreadable form using key.

**Hashing** — One-way conversion of data to fixed-length value.

**Token** — Credential proving authentication (JWT, session token).

**Session** — Connection between client and server for authenticated user.

**CORS** — Cross-Origin Resource Sharing; controlling cross-domain requests.

**CSRF** — Cross-Site Request Forgery; attack attempting unauthorized actions.

**XSS** — Cross-Site Scripting; attack injecting malicious scripts.

**SQL Injection** — Attack manipulating SQL queries through input.

**Rate Limiting** — Restricting number of requests from user/IP.

**Secrets Management** — Securely storing and accessing sensitive data (API keys, passwords).

---

## Testing

**Unit Test** — Test verifying single function or class in isolation.

**Integration Test** — Test verifying multiple components work together.

**E2E Test** — End-to-end test simulating user workflows in real browser.

**Test Coverage** — Percentage of code exercised by tests.

**Mock** — Fake object substituting real dependency for testing.

**Stub** — Simplified version of object returning hardcoded responses.

**Fixture** — Test data used consistently across tests.

**Assertion** — Statement verifying expected condition is true.

**Test Failure** — Test detecting bug or incorrect behavior.

**Test Skipping** — Temporarily disabling test without removing it.

---

## Deployment & Operations

**Deployment** — Process of releasing code to production.

**Environment** — Separate instance of application (development, staging, production).

**CI/CD** — Continuous Integration/Continuous Deployment automation.

**Build** — Compiling and packaging code for deployment.

**Release** — Version of code deployed to production.

**Rollback** — Reverting to previous version due to issues.

**Hotfix** — Urgent fix for critical production issue.

**Downtime** — Period when application is unavailable.

**Zero-Downtime Deployment** — Releasing without interrupting user access.

**Monitoring** — Tracking application health and performance metrics.

**Alerting** — Notifying team when issues occur.

**Logging** — Recording application events and errors.

**Observability** — Ability to understand system behavior from external outputs.
