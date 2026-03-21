---
title: Testing
description: Test strategy, fixtures, and test utilities
---

TC Portal uses Pest for PHP testing and Playwright for end-to-end tests. This guide covers testing patterns, best practices, and utilities.

## Test Strategy

Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to ensure they pass.

### Test Types

- **Unit Tests** - Test individual classes and methods in isolation (`tests/Unit/`)
- **Feature Tests** - Test application features with database interactions, HTTP responses, and Inertia props (`tests/Feature/`)
- **E2E Tests** - Browser-based testing with Playwright (`tests/e2e/`)

## Writing Tests

### Basic Pest Test

```php
it('creates a unique TCID', function () {
    $action = new CreateTcid;
    $tcid = $action->handle();

    expect($tcid)->toStartWith('TC')
        ->and($tcid)->toHaveLength(9);
});
```

### Testing with Factories

Use factories to create test data. Check for custom states before manually setting up models.

```php
it('displays package details for recipient', function () {
    $package = Package::factory()->create();
    $recipient = User::find($package->recipient_id);

    $this->actingAs($recipient)
        ->get(route('recipient.package.details.show', $package))
        ->assertOk();
});
```

### Testing Inertia Responses

```php
it('returns correct props to Inertia component', function () {
    $package = Package::factory()->create();

    $this->get(route('recipient.package.details.show', $package))
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Recipient/PackageDetails')
            ->has('user')
            ->has('package')
            ->has('budgets')
            ->where('package.id', $package->id)
        );
});
```

### Status Code Assertions

Use specific assertion methods instead of generic `assertStatus()`:

```php
// Good
$response->assertSuccessful();
$response->assertForbidden();
$response->assertNotFound();

// Avoid
$response->assertStatus(200);
$response->assertStatus(403);
```

## Form Request Testing

Test both validation rules and custom error messages:

```php
it('validates required fields', function () {
    $request = new CreateBudgetRequest;
    $rules = $request->rules();

    $validator = Validator::make([], $rules);

    expect($validator->fails())->toBeTrue()
        ->and($validator->errors()->has('package_id'))->toBeTrue()
        ->and($validator->errors()->has('rate'))->toBeTrue();
});

it('provides custom validation messages', function () {
    $request = new CreateBudgetRequest;
    $messages = $request->messages();

    expect($messages['rate.required'])
        ->toBe('Rate is required');
});
```

## Datasets

Use datasets to reduce duplication in tests with similar data:

```php
it('validates email formats', function (string $email, bool $valid) {
    $validator = Validator::make(
        ['email' => $email],
        ['email' => 'email']
    );

    expect($validator->passes())->toBe($valid);
})->with([
    ['valid@example.com', true],
    ['invalid.email', false],
    ['another@test.org', true],
]);
```

## Mocking

### HTTP Requests

```php
it('handles external API calls', function () {
    Http::fake([
        'api.example.com/*' => Http::response(['data' => 'value'], 200),
    ]);

    $response = Http::get('api.example.com/endpoint');

    expect($response->json('data'))->toBe('value');
});
```

### Storage

Storage is automatically faked in `TestCase.php`:

```php
it('stores files to S3', function () {
    Storage::fake('s3');

    Storage::disk('s3')->put('test.txt', 'content');

    Storage::disk('s3')->assertExists('test.txt');
});
```

### Dependencies

```php
it('does not send event when feature disabled', function () {
    $eventsMock = Mockery::mock();
    $eventsMock->shouldNotReceive('createEvent');

    $apiMock = Mockery::mock(KlaviyoAPI::class);
    $apiMock->Events = $eventsMock;

    (new CreateKlaviyoEventAction($apiMock))->handle($lead, 'event');
});
```

## Test Utilities

### Global Helper Functions

Available in `tests/Pest.php`:

```php
function getCurrentQuarterForTest(): Quarter
{
    return Quarter::getCurrent() ?? Quarter::factory()->create([
        'start_date' => now()->startOfMonth(),
        'end_date' => now()->addMonths(2)->endOfMonth(),
    ]);
}
```

### Custom Expectations

```php
expect()->extend('toBeOne', function () {
    return $this->toBe(1);
});

// Usage
expect($value)->toBeOne();
```

### Test Case Setup

All tests extend `TestCase.php` which provides:

- Database refresh with `RefreshDatabase`
- Automatic seeding with `TestingSeeder`
- HTTP request prevention (no external calls)
- S3 storage faking

## Running Tests

Run the minimal number of tests needed to ensure code quality:

```bash
# All tests
php artisan test

# Specific file
php artisan test tests/Feature/CreateTcidTest.php

# Filter by name
php artisan test --filter=test_recipient_details

# Parallel execution
php artisan test --parallel
```

### Test Coverage

```bash
# Generate coverage report
php artisan test --coverage

# With minimum threshold
php artisan test --coverage --min=80
```

## E2E Testing

Browser tests use Playwright. Tests are in `tests/e2e/`.

```typescript
test('can login to supplier dashboard', async ({ page }) => {
    await page.goto('/');

    await page.fill('input[placeholder="Enter your email"]', 'supplier@example.com');
    await page.fill('input[placeholder="Enter your password"]', 'password');

    await page.click('button:has-text("Log in")');

    await expect(page).toHaveURL('/suppliers/3/dashboard');
});
```

Run E2E tests:

```bash
npm run test:e2e
```

## Best Practices

### Test Organization

- Place tests in directories matching their purpose (`tests/Unit/`, `tests/Feature/`, `tests/e2e/`)
- Name test files with `Test.php` suffix
- Use descriptive test names that explain what's being tested

### Test Structure

```php
it('does something specific', function () {
    // Arrange - Set up test data
    $user = User::factory()->create();

    // Act - Perform the action
    $result = $user->doSomething();

    // Assert - Verify the outcome
    expect($result)->toBeTrue();
});
```

### When to Mock

- Mock external APIs and services (HTTP, third-party APIs)
- Mock file system operations when not testing file handling
- Don't mock your own application code unless necessary
- Use factories instead of mocking models

### Testing Tips

- Test happy paths, failure paths, and edge cases
- One assertion concept per test
- Use factories for all model creation
- Follow existing project conventions
- Keep tests fast - use minimal data
- Mark tests as `in_progress` before running

## CI/CD Testing

Tests run automatically via GitHub Actions on:

- Pull requests
- Pushes to `main` and `dev` branches

The test suite must pass before code can be merged.

## Code Formatting

Run Pint before finalizing changes:

```bash
vendor/bin/pint --dirty
```

This ensures code matches the project's style guide.
