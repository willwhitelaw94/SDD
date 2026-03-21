---
title: "Database Snapshots"
description: "Fast database restore for local development and QA testing"
---

# Database Snapshots

Fast alternative to `migrate:fresh --seed` (~2s vs ~90s). Creates a local MySQL dump of your seeded database and restores from it instantly.

## Quick Start

```bash
# 1. Seed your database (only needed once)
php artisan migrate:fresh --seed

# 2. Save a snapshot
php artisan db:snapshot save

# 3. Restore anytime (~2 seconds)
php artisan db:snapshot restore
```

## When to Use

- **Before QA testing** — restore a clean seeded database in seconds
- **After breaking your local DB** — instant reset without waiting for seeders
- **Between feature branches** — snapshot per branch with `--name`
- **Playwright E2E tests** — global-setup auto-restores from snapshot if available

## Commands

### Save a Snapshot

```bash
php artisan db:snapshot save                  # saves database/snapshots/local.sql
php artisan db:snapshot save --name=my-branch # saves database/snapshots/my-branch.sql
```

### Restore a Snapshot

```bash
php artisan db:snapshot restore                  # restores from local.sql
php artisan db:snapshot restore --name=my-branch # restores from my-branch.sql
```

## How It Works

1. **Save** runs `mysqldump` against your local database, producing a `.sql` file in `database/snapshots/`
2. **Restore** drops and recreates the database, then imports the `.sql` file
3. Snapshots are `.gitignored` — they're local to your machine
4. Safety: only connects to local databases (`127.0.0.1`, `localhost`, `mysql`)

## Playwright Integration

The E2E `global-setup.ts` automatically checks for a local snapshot when the database is empty:

1. If `database/snapshots/local.sql` exists, restores from it (~2s)
2. If no snapshot exists, falls back to `migrate:fresh --seed` (~90s)
3. After a slow seed, it reminds you to save a snapshot

## When to Re-Snapshot

Re-run `php artisan db:snapshot save` after:

- Running new migrations
- Changing seeders
- Switching to a branch with different database structure

If a restore fails (e.g. missing tables), just run `migrate:fresh --seed` and save a fresh snapshot.

## Test Users

All snapshots include the seeded test users. See [Testing](/developer-docs/how-to/testing) for the full list of test credentials (password: `foobar` for all).

| Email | Role |
|-------|------|
| `admin@example.com` | Admin |
| `care_partner@example.com` | Care Partner |
| `recipient@example.com` | Recipient |
| `supplier.verified@example.com` | Supplier Administrator |
| `bill_processing_manager@example.com` | Bill Processing Manager |
| `care_management_administrator@example.com` | Care Management Administrator |

Full list in `domain/User/Seeders/UserSeeder.php`.
