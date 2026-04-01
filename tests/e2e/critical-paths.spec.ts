import { test, expect } from "@playwright/test";

/**
 * Critical paths E2E test suite.
 * 
 * This file demonstrates the basic E2E test structure and covers
 * the most important user journeys:
 * - Landing page navigation
 * - Authentication flows (organisateur login, jury join)
 * - Basic navigation after login
 * - Protected route redirects
 */

test.describe("Critical user journeys", () => {
  test("Landing page → Login → Admin dashboard flow", async ({ page }) => {
    // 1. Landing page loads
    await page.goto("/");
    await expect(page.getByRole("link", { name: /JuryNote/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Fonctionnalités" })).toBeVisible();

    // 2. Navigate to login
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
    await expect(
      page.getByLabel("Adresse email de l'organisateur", { exact: true })
    ).toBeVisible();

    // 3. Login as organisateur (requires seeded user: admin@juryflow.local)
    await page
      .getByLabel("Adresse email de l'organisateur", { exact: true })
      .fill("admin@juryflow.local");
    await page.getByRole("button", { name: "Se connecter" }).click();

    // 4. Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin/, { timeout: 15_000 });
    await expect(page.getByRole("main")).toBeVisible();
  });

  test("Landing page → Jury join page flow", async ({ page }) => {
    // 1. Landing page
    await page.goto("/");
    await expect(page.getByRole("link", { name: /JuryNote/i })).toBeVisible();

    // 2. Navigate to jury join
    await page.goto("/jury/join");
    await expect(page.getByRole("heading", { name: "Accès jury" })).toBeVisible();
    await expect(
      page.getByLabel("Slug de l'événement", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByLabel("Chiffre 1 du code PIN", { exact: true })
    ).toBeVisible();

    // 3. Verify link back to login
    await expect(page.getByRole("link", { name: "Se connecter" })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  test("Login ↔ Jury join page navigation", async ({ page }) => {
    // Login page → Jury join link
    await page.goto("/login");
    await page.getByRole("link", { name: /accéder à la notation/i }).click();
    await expect(page).toHaveURL(/\/jury\/join/);

    // Jury join → Login link
    await page.getByRole("link", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("Protected routes redirect unauthenticated users", async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();

    // /admin redirects to /login
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);

    // /jury redirects to /jury/join
    await page.goto("/jury");
    await expect(page).toHaveURL(/\/jury\/join/);

    // /supervisor redirects to /login
    await page.goto("/supervisor");
    await expect(page).toHaveURL(/\/login/);
  });

  test("Jury join form validation", async ({ page }) => {
    await page.goto("/jury/join");

    const submitButton = page.getByRole("button", { name: "Accéder à la notation" });

    // Submit button should be disabled initially
    await expect(submitButton).toBeDisabled();

    // Fill event slug
    await page.getByLabel("Slug de l'événement", { exact: true }).fill("test-event");

    // Still disabled without PIN
    await expect(submitButton).toBeDisabled();

    // Fill 6-digit PIN
    const pinInputs = page.locator('input[aria-label^="Chiffre"]');
    for (let i = 0; i < 6; i++) {
      await pinInputs.nth(i).fill("1");
    }

    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
  });

  test("Login form shows error for invalid email", async ({ page }) => {
    await page.goto("/login");

    // Submit invalid email
    await page
      .getByLabel("Adresse email de l'organisateur", { exact: true })
      .fill("unknown@example.com");
    await page.getByRole("button", { name: "Se connecter" }).click();

    // Should show error and stay on login page
    await expect(page.getByRole("alert")).toContainText(/non reconnu|email/i, {
      timeout: 10_000,
    });
    await expect(page).toHaveURL(/\/login/);
  });
});
