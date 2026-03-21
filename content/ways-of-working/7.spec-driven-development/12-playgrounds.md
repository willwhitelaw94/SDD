---
title: "Interactive Playgrounds"
description: "Self-contained interactive explorers for the SD pipeline, domains, personas, architecture, and more"
---

Interactive playgrounds that make TC Portal documentation explorable and hands-on. Each is self-contained with dark theme and TC brand colours. Use fullscreen mode for the best experience.

---

## Workflow & Process

### SD Pipeline Explorer

Navigate the 7-phase, 7-gate spec-driven workflow. Filter by feature size, see skip consequences, explore skills per phase.

::playground{src="/playgrounds/sd-pipeline-explorer.html" title="SD Pipeline Explorer" height="750"}
::

### Quality Gates Checklist

Interactive checklist for Gates 0–6. Persists per-epic in localStorage. Shows pass/fail verdict and the skill command to run.

::playground{src="/playgrounds/quality-gates.html" title="Quality Gates Checklist" height="750"}
::

### Initiative Roadmap

Kanban board of all initiatives and epics across stages. Swim lanes, drag-and-drop, timeline view toggle.

::playground{src="/playgrounds/initiative-roadmap.html" title="Initiative Roadmap Board" height="750"}
::

---

## Architecture & Technical

### Architecture Explorer

Trace a request through the full Laravel stack — from Vue to Eloquent to Event Sourcing. 5 animated scenarios.

::playground{src="/playgrounds/architecture-explorer.html" title="Architecture Layer Explorer" height="750"}
::

### Middleware Pipeline

Visualize how requests flow through middleware. Toggle 10 user states to see where requests get blocked. Build-your-own-stack mode.

::playground{src="/playgrounds/middleware-pipeline.html" title="Middleware Pipeline Visualizer" height="750"}
::

### Domain Relationship Map

Force-directed graph of all 36 domains. Filter by category, overlay by persona, search, drag to rearrange.

::playground{src="/playgrounds/domain-map.html" title="Domain Relationship Map" height="750"}
::

---

## People & Context

### Persona Explorer

Day-in-the-life for 9 personas. Timelines, domain touchpoints, escalation paths, pain points, key screens.

::playground{src="/playgrounds/persona-explorer.html" title="Persona Day-in-the-Life Explorer" height="750"}
::

### Glossary Explorer

48 terms across 7 categories with search, related-term navigation, flashcard mode, relationship graph, and "I'm New" filter.

::playground{src="/playgrounds/glossary-explorer.html" title="Glossary & Concept Explorer" height="750"}
::

---

## Design

### Design System

Live colour palette, typography scale, spacing bars, component previews, and palette builder — all from the actual Tailwind config.

::playground{src="/playgrounds/design-system.html" title="Design System Playground" height="750"}
::

---

## Where the files live

- **Source**: `.tc-docs/playgrounds/` — edit here
- **Served**: `.tc-docs/public/playgrounds/` — static serving
- **Component**: `app/components/content/Playground.vue` — iframe wrapper with fullscreen and open-in-new-tab

To add a new playground, create the HTML in `playgrounds/`, copy to `public/playgrounds/`, and embed with:

```md
::playground{src="/playgrounds/my-playground.html" title="My Playground" height="750"}
::
```
