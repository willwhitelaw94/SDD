---
title: "Local Development Setup"
description: "Set up TC Portal locally with Docker or Laravel Herd"
---

> Get the TC Portal application running on your machine.

---

## Prerequisites

Assumes macOS. Install via Homebrew:

- Docker (or [Laravel Herd](https://herd.laravel.com) as an alternative)
- Git, PHP 8.3, Composer, Node, npm
- SSH key added to GitHub — [github.com/settings/keys](https://github.com/settings/keys)

---

## Clone and Configure

```bash
git clone --recurse-submodules git@github.com:Trilogy-Care/tc-portal.git
cd tc-portal
npm run submodule:sync
cp .env.example .env
```

Get the env variables from another developer. Check Confluence for Composer keys and secrets for private repositories.

---

## Docker Setup

Build and start all containers:

```bash
docker compose up
```

This gives you PHP, Nginx, MySQL, Redis, Minio (S3), and Mailhog.

### Database Connection

| Setting  | Value       |
|----------|-------------|
| Host     | `localhost` |
| Username | `tc-portal` |
| Password | `secret`    |
| Database | `tc-portal` |
| Port     | `33062`     |

### Running Commands

Run commands inside the app container:

```bash
docker exec -it tc-portal.app php artisan migrate:fresh --seed
```

Login at `http://localhost:8280/login` with `admin@example.com` / `foobar`.

**Tip:** Add aliases to your shell profile:

```bash
alias dexec='docker exec -it tc-portal.app'
alias art='docker exec -it tc-portal.app php artisan'
```

---

## Minio (S3)

### Docker (preinstalled with `docker compose up`)

- WebUI: `http://127.0.0.1:8900`
- Credentials: `admin` / `password`
- Create a bucket called `tc-portal`

Add to `.env`:

```env
AWS_ACCESS_KEY_ID=admin
AWS_SECRET_ACCESS_KEY=password
AWS_BUCKET=tc-portal
AWS_URL=http://localhost:9001/tc-portal
AWS_ENDPOINT=http://minio:9001
```

### Local (outside Docker)

```bash
brew install minio
minio server ~/minio --address ':9002'
```

Create a bucket `tc-portal` and an access key in the Minio UI, then update `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_URL`, and `AWS_ENDPOINT` in your `.env`.

---

## Mail

Mailhog URL: `http://localhost:8025`

---

## Search (Scout + Typesense)

Index the search models:

```bash
docker exec -it tc-portal.app php artisan scout:import "Domain\Package\Models\Package"
docker exec -it tc-portal.app php artisan scout:import "App\Models\Bill\Bill"
docker exec -it tc-portal.app php artisan scout:import "Domain\Supplier\Models\Supplier"
docker exec -it tc-portal.app php artisan scout:import "App\Models\Organisation\CareCoordinator"
```

To flush an index:

```bash
docker exec -it tc-portal.app php artisan scout:flush "Domain\Package\Models\Package"
```

---

## Browsershot (Sidecar)

Deploy using the Sidecar command:

```bash
php artisan sidecar:deploy --activate
# or with Docker:
docker exec tc-portal.app php artisan sidecar:deploy --activate
```

---

## Roles and Permissions

```bash
php artisan sync:roles-permissions
```

- Add new roles in `config/roleList.php`
- Add new permissions in `config/permissionList.php`
- Don't change existing roles or permissions — append new ones only

---

## Code Formatting and Linting

Pint runs on the pre-commit hook. To run manually:

```bash
composer lint        # Full lint
composer lint:dirty  # Only changed files
npm run lint:fix     # Frontend linting
```

---

## TypeScript Types

Generate types from PHP data classes for the frontend:

```bash
composer ts
# or: php artisan typescript:custom-transform
```

This generates `generated.d.ts` and `enums.generated.ts`. CI checks these are up to date — if your PR is failing, regenerate and commit.

---

## Testing

Copy `.env.testing.example` to `.env.testing` and configure:

- **Laravel Herd users:** Default values (port 3306) should work
- **Docker users:** Set `DB_PORT=33061` and `DB_PASSWORD=secret` to match the `mysql-test` container

If you need to run migrations on the test database:

```bash
php artisan --env=testing migrate:fresh
```

```bash
php artisan test --parallel               # Run all tests
php artisan test --testsuite Controller   # Specific suite
php artisan test --filter=SupplierControllerTest  # Specific file
./vendor/bin/pest --coverage-html=coverage  # Coverage report
npm run test       # Vue/Vitest tests
npm run coverage   # Vue coverage
```

If you get a "Target class [env] does not exist" error:

```bash
php artisan config:clear
```

---

## Static Analysis

We have a baseline set at 17/11/2024 so any new issues can be resolved.

```bash
composer analyse           # Run PHPStan
composer analyse:baseline  # Update baseline if needed
```

Errors referencing the baseline file are stored in `phpstan-baseline.neon`. If you're confident they aren't real issues, update the baseline.

---

## Bruno API Collection

Generate Bruno collection files from the OpenAPI spec:

```bash
composer bruno:generate
composer bruno:generate -- --dry-run  # Preview only
```

Run the collection:

```bash
cd bruno && npx bru run generated -r --env dev --sandbox=developer --insecure && cd ..
```

**Laravel Herd users:** Create `bruno/environments/local.bru` (gitignored) with your local config and use `--env local`:

```
vars {
  baseURL: https://tc-portal.test/
  authToken: <your-token>
  createdPackageId: 1
  budgetPlanId: 1
  budgetPlanFundingStreamId: 1
}
```

Replace example IDs with actual values from your local database as needed.

---

## Ngrok (Public Access)

```bash
ngrok http 8280
```

---

## Related

- [Shipping Your First Feature](/developer-docs/tutorials/02-shipping-your-first-feature) — The dev workflow end-to-end
- [Ready to Go (IDE Setup)](/ways-of-working/environment-setup/00-ready-to-go) — Set up Cursor and Claude Code
- [Zoho Integration](https://trilogycare.atlassian.net/wiki/spaces/TC/pages/18907137/Zoho+Integration) — Confluence guide
