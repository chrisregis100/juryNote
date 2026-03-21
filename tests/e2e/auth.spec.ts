import { test, expect } from "@playwright/test";

test.describe("Login page (organisateur)", () => {
  test("loads and shows organisateur login form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
    await expect(page.getByText("Organisateur")).toBeVisible();
  });

  test("has email input and submit button", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByLabel("Adresse email de l'organisateur", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Se connecter" })).toBeVisible();
  });

  test("has link to jury join page", async ({ page }) => {
    await page.goto("/login");
    await expect(
      page.getByRole("link", { name: "Accéder à la notation" })
    ).toHaveAttribute("href", "/jury/join");
  });

  test("shows error when submitting unknown email", async ({ page }) => {
    await page.goto("/login");
    await page
      .getByLabel("Adresse email de l'organisateur", { exact: true })
      .fill("unknown@example.com");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "Email non reconnu" })
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe("Jury join page", () => {
  test("loads and shows jury access form", async ({ page }) => {
    await page.goto("/jury/join");
    await expect(page.getByRole("heading", { name: "Accès jury" })).toBeVisible();
    await expect(page.getByText("Jury")).toBeVisible();
  });

  test("has event slug input and PIN inputs", async ({ page }) => {
    await page.goto("/jury/join");
    await expect(
      page.getByLabel("Slug de l'événement", { exact: true })
    ).toBeVisible();
    await expect(
      page.getByLabel("Chiffre 1 du code PIN", { exact: true })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Accéder à la notation" })).toBeVisible();
  });

  test("has link to organisateur login", async ({ page }) => {
    await page.goto("/jury/join");
    await expect(page.getByRole("link", { name: "Se connecter" })).toHaveAttribute(
      "href",
      "/login"
    );
  });

  test("submit button disabled until 6-digit PIN", async ({ page }) => {
    await page.goto("/jury/join");
    await expect(page.getByRole("button", { name: "Accéder à la notation" })).toBeDisabled();
    await page.getByLabel("Slug de l'événement", { exact: true }).fill("test-event");
    const pinInputs = page.locator('input[aria-label^="Chiffre"]');
    for (let i = 0; i < 6; i++) {
      await pinInputs.nth(i).fill("1");
    }
    await expect(page.getByRole("button", { name: "Accéder à la notation" })).toBeEnabled();
  });
});

test.describe("Protected route redirects", () => {
  test("unauthenticated /admin redirects to /login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated /jury redirects to /jury/join", async ({ page }) => {
    await page.goto("/jury");
    await expect(page).toHaveURL(/\/jury\/join/);
  });
});
