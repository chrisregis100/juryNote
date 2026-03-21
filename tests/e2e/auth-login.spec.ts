import { test, expect } from "@playwright/test";

test.describe("Organisateur login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("login page shows organisateur form and jury link", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /connexion/i })).toBeVisible();
    await expect(page.getByLabel(/adresse email|email/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /se connecter/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /accéder à la notation|jury/i })).toBeVisible();
  });

  test("link to jury join goes to /jury/join", async ({ page }) => {
    await page.getByRole("link", { name: /accéder à la notation/i }).click();
    await expect(page).toHaveURL(/\/jury\/join/);
  });

  test("invalid email shows error without redirect", async ({ page }) => {
    await page.getByLabel(/adresse email|email/i).fill("unknown@example.com");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page.getByRole("alert")).toContainText(/non reconnu|email/i);
    await expect(page).toHaveURL(/\/login/);
  });
});
