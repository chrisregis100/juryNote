import { test, expect } from "@playwright/test";

test.describe("Navigation guards (unauthenticated)", () => {
  test("visiting /admin redirects to /login when not logged in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("visiting /jury redirects to /jury/join when not logged in", async ({ page }) => {
    await page.goto("/jury");
    await expect(page).toHaveURL(/\/jury\/join/);
  });

  test("home redirects to /admin when organisateur is logged in", async ({ page }) => {
    test.skip(!process.env.E2E_ORGANISER_EMAIL, "E2E_ORGANISER_EMAIL not set");
    const organizerEmail = process.env.E2E_ORGANISER_EMAIL!;
    await page.goto("/login");
    await page.getByLabel(/adresse email|email/i).fill(organizerEmail);
    await page.getByRole("button", { name: /se connecter/i }).click();
    await expect(page).toHaveURL(/\/admin/, { timeout: 10_000 });
    await page.goto("/");
    await expect(page).toHaveURL(/\/admin/);
  });
});
