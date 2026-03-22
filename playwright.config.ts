import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E config for Next.js 16 (App Router).
 * 
 * Features:
 * - Auto-starts Next.js dev server (webServer)
 * - Runs tests in parallel (fullyParallel: true)
 * - CI-friendly: retries, single worker, GitHub reporter
 * - Debug-friendly: trace, screenshots, videos on failure
 * 
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "html",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
  },
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  projects: process.env.CI
    ? [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }]
    : [
        { name: "chromium", use: { ...devices["Desktop Chrome"] } },
        { name: "firefox", use: { ...devices["Desktop Firefox"] } },
        { name: "webkit", use: { ...devices["Desktop Safari"] } },
      ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
