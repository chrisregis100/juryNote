import { test, expect } from "@playwright/test";

test.describe("User journeys", () => {
  test("landing -> login -> back to landing via home", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /JuryFlow - Accueil/i }).click();
    await expect(page).toHaveURL("/");

    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
    await page.goto("/");
    await expect(page.locator("#features")).toBeVisible();
  });

  test("landing -> jury join via login page link", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: "Accéder à la notation" }).click();
    await expect(page).toHaveURL("/jury/join");
    await expect(page.getByRole("heading", { name: "Accès jury" })).toBeVisible();
  });

  test("jury join -> login -> jury join round-trip", async ({ page }) => {
    await page.goto("/jury/join");
    await page.getByRole("link", { name: "Se connecter" }).click();
    await expect(page).toHaveURL("/login");
    await page.getByRole("link", { name: "Accéder à la notation" }).click();
    await expect(page).toHaveURL("/jury/join");
  });

  test("direct navigation to key public routes", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /JuryFlow/i })).toBeVisible();

    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();

    await page.goto("/jury/join");
    await expect(page.getByRole("heading", { name: "Accès jury" })).toBeVisible();
  });
});
