# E2E Testing with Playwright

This directory contains end-to-end tests for the JuryFlow application using [Playwright](https://playwright.dev/).

## Overview

The E2E test suite covers:
- **Landing page** (`landing.spec.ts`): Public homepage and navigation
- **Authentication** (`auth.spec.ts`, `auth-login.spec.ts`): Organisateur login flows
- **Jury join** (`jury-join.spec.ts`): Jury access via event slug and PIN
- **Navigation** (`navigation.spec.ts`, `navigation-guards.spec.ts`): Route protection and redirects
- **User journeys** (`journeys.spec.ts`): Complete user flows across the application
- **Critical paths** (`critical-paths.spec.ts`): High-priority user workflows

## Prerequisites

Before running E2E tests, ensure you have:

1. **Node.js 20+** installed
2. **PostgreSQL database** running and accessible
3. **Environment variables** configured (see below)
4. **Dependencies installed**: `npm ci` or `npm install`

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/jurynote?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### Generating NEXTAUTH_SECRET

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

## Database Setup

Before running tests, ensure your database is set up:

```bash
# Generate Prisma Client
npm run db:generate

# Push database schema
npm run db:push

# Seed test data (creates admin@juryflow.local user)
npm run db:seed
```

### Test Data

The seed script (`prisma/seed.ts`) creates the following test data:

- **Organisateur user**: `admin@juryflow.local` (no password required for email-based auth)

For jury tests, you'll need to:
1. Create an event via the admin interface
2. Generate a PIN code for the event
3. Use the event slug and PIN in your tests

## Running Tests

### Run all E2E tests

```bash
npm run test:e2e
```

This command:
- Starts the Next.js dev server automatically (via `webServer` config)
- Runs all tests in the `tests/e2e/` directory
- Generates an HTML report in `playwright-report/`

### Run tests with UI mode

```bash
npm run test:e2e:ui
```

Opens Playwright's interactive UI where you can:
- See all tests and their status
- Run individual tests or groups
- Watch tests execute in real-time
- Debug test failures

### Run tests in debug mode

```bash
npm run test:e2e:debug
```

Launches Playwright Inspector for step-by-step debugging:
- Pause execution at any point
- Inspect page state
- Step through test actions
- View network requests and console logs

### Run specific test files

```bash
# Run a single test file
npx playwright test tests/e2e/auth.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run tests in a specific project (browser)
npx playwright test --project=chromium
```

## Test Configuration

The Playwright configuration (`playwright.config.ts`) is optimized for Next.js 16:

### Features

- **Auto-start dev server**: Tests automatically start `npm run dev` before running
- **Parallel execution**: Tests run in parallel locally (sequential in CI)
- **CI-friendly**: Retries, single worker, GitHub reporter
- **Debug support**: Traces, screenshots, and videos on failure
- **Multi-browser**: Runs on Chromium, Firefox, and WebKit locally

### Configuration Details

- **Base URL**: `http://localhost:3000` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Timeout**: 10 seconds for assertions
- **Retries**: 2 retries in CI, 0 locally
- **Workers**: 1 in CI (sequential), unlimited locally (parallel)
- **Reporters**: GitHub reporter in CI, HTML reporter locally

## Writing New Tests

### Test Structure

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature name", () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto("/path");
  });

  test("should do something", async ({ page }) => {
    // Test implementation
    await expect(page.getByRole("button")).toBeVisible();
  });
});
```

### Best Practices

1. **Use semantic selectors**: Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
2. **Wait for elements**: Use `toBeVisible()`, `toBeEnabled()` instead of `waitFor()`
3. **Test user flows**: Write tests from the user's perspective
4. **Keep tests isolated**: Each test should be independent and not rely on others
5. **Use descriptive names**: Test names should clearly describe what they verify

### Example Test

```typescript
test("organisateur can login with valid email", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/email/i).fill("admin@juryflow.local");
  await page.getByRole("button", { name: /se connecter/i }).click();
  await expect(page).toHaveURL(/\/admin/);
});
```

## CI/CD Integration

E2E tests run automatically on:

- **Push to `main` or `develop` branches**
- **Pull requests** targeting `main` or `develop`
- **Manual trigger** via GitHub Actions workflow dispatch

### GitHub Actions Workflow

The workflow (`.github/workflows/e2e.yml`) automatically:

1. Sets up Node.js 20
2. Installs dependencies
3. Sets up PostgreSQL service
4. Generates Prisma Client
5. Pushes database schema
6. Seeds test data
7. Runs Playwright tests
8. Uploads test reports and videos on failure

### Required GitHub Secrets

For CI to work properly, configure these secrets in GitHub:

- `NEXTAUTH_SECRET`: NextAuth secret key (generate with `openssl rand -base64 32`)

The `DATABASE_URL` is automatically configured for the PostgreSQL service container.

## Debugging Failed Tests

### View Test Reports

After running tests, open the HTML report:

```bash
npx playwright show-report
```

### View Test Artifacts

Failed tests generate:
- **Screenshots**: Captured on failure (stored in `test-results/`)
- **Videos**: Recorded on first retry (stored in `test-results/`)
- **Traces**: Interactive trace files for debugging (stored in `test-results/`)

### Common Issues

1. **Database connection errors**: Ensure PostgreSQL is running and `DATABASE_URL` is correct
2. **Port already in use**: Stop any running dev server or change `PLAYWRIGHT_BASE_URL`
3. **Timeout errors**: Increase timeout in `playwright.config.ts` or check server startup time
4. **Element not found**: Use Playwright Inspector to debug selector issues

## Test Maintenance

### Updating Tests

When UI changes:
1. Run tests to identify failures
2. Use Playwright Inspector to debug
3. Update selectors to match new UI
4. Verify tests still pass

### Adding New Test Files

1. Create a new `.spec.ts` file in `tests/e2e/`
2. Follow the existing test structure
3. Use semantic selectors
4. Add descriptive test names
5. Run tests to verify they pass

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Next.js Testing Guide](https://nextjs.org/docs/app/building-your-application/testing)
- [Playwright Selectors](https://playwright.dev/docs/selectors)
