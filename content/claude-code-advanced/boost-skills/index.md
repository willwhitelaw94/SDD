---
title: Laravel Boost Skills
description: AI skills from Laravel Boost v2 for enhanced development patterns
---

# Laravel Boost Skills

These skills are installed by [Laravel Boost v2](https://boost.laravel.com) and provide specialized AI guidance for Laravel ecosystem development.

## Installed Skills

| Skill | Description |
|-------|-------------|
| [Inertia Vue Development](./inertia-vue-development) | Inertia.js v2 + Vue patterns |
| [Pennant Development](./pennant-development) | Laravel Pennant feature flags |
| [Pest Testing](./pest-testing) | Pest v3 testing patterns |
| [Tailwind CSS Development](./tailwindcss-development) | Tailwind CSS v3 utilities |

## How Skills Work

Boost skills are loaded **on-demand** based on conversation context:
- Mention "test" or "pest" → `pest-testing` activates
- Mention "Tailwind" or "styling" → `tailwindcss-development` activates
- Mention "feature flag" or "pennant" → `pennant-development` activates
- Work with Vue + Inertia → `inertia-vue-development` activates

## Location

Skills live in `.tc-wow/claude/skills/boost/` and are symlinked to `.claude/skills/` for Claude Code discovery.

## Updating Skills

```bash
# Update Boost guidelines and skills
php artisan boost:update

# Add skills from external repos
php artisan boost:add-skill laravel/boost-skills
```

## Credits

Skills authored by Taylor Otwell and the Laravel team.
