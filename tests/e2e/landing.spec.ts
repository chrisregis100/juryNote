import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows navbar with JuryFlow brand", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: /JuryFlow - Accueil/i })).toBeVisible();
  });

  test("navbar has navigation links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Fonctionnalités" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Comment ça marche" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Tarifs" })).toBeVisible();
    await expect(page.getByRole("link", { name: "FAQ" })).toBeVisible();
  });

  test("has CTA / demo link", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("link", { name: "Demander une démo" })).toBeVisible();
  });

  test("landing sections are present", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.locator("#how-it-works")).toBeVisible();
    await expect(page.locator("#pricing")).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();
  });

  test("navigating to #features scrolls to section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Fonctionnalités" }).click();
    await expect(page.locator("#features")).toBeInViewport();
  });
});
