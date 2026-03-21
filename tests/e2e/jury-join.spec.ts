import { test, expect } from "@playwright/test";

test.describe("Jury join", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/jury/join");
  });

  test("jury join page shows event slug and PIN form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /accès jury/i })).toBeVisible();
    await expect(page.getByLabel(/slug de l'événement|slug/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /accéder à la notation/i })).toBeVisible();
  });

  test("link to organisateur login goes to /login", async ({ page }) => {
    await page.getByRole("link", { name: /se connecter|organisateur/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("submit disabled until 6-digit PIN entered", async ({ page }) => {
    const submit = page.getByRole("button", { name: /accéder à la notation/i });
    await expect(submit).toBeDisabled();
    const pinInputs = page.getByLabel(/chiffre.*PIN/i);
    await pinInputs.first().fill("1");
    await expect(submit).toBeDisabled();
    for (let i = 0; i < 6; i++) {
      await page.getByLabel(new RegExp(`Chiffre ${i + 1} du code PIN`)).fill("1");
    }
    await expect(submit).toBeEnabled();
  });

  test("invalid slug and PIN show error", async ({ page }) => {
    await page.getByLabel(/slug de l'événement|slug/i).fill("no-such-event");
    const pinInputs = page.locator('input[inputmode="numeric"]');
    for (let i = 0; i < 6; i++) {
      await pinInputs.nth(i).fill("0");
    }
    await page.getByRole("button", { name: /accéder à la notation/i }).click();
    await expect(page.getByRole("alert")).toContainText(/invalide|expiré|vérifiez/i);
    await expect(page).toHaveURL(/\/jury\/join/);
  });
});
