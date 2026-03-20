import { Page } from "@playwright/test";

/**
 * Test helper utilities for authentication flows.
 * 
 * These helpers reduce duplication across test files and provide
 * consistent authentication patterns for E2E tests.
 */

/**
 * Default test credentials (from seed data).
 * Override via environment variables:
 * - E2E_ORGANISER_EMAIL: Email for organisateur login
 * - E2E_JURY_EVENT_SLUG: Event slug for jury join
 * - E2E_JURY_PIN: 6-digit PIN for jury join
 */
export const TEST_CREDENTIALS = {
  organisateur: {
    email: process.env.E2E_ORGANISER_EMAIL ?? "admin@juryflow.local",
  },
  jury: {
    eventSlug: process.env.E2E_JURY_EVENT_SLUG ?? "test-event",
    pin: process.env.E2E_JURY_PIN ?? "123456",
  },
};

/**
 * Log in as an organisateur.
 * 
 * @param page - Playwright page instance
 * @param email - Optional email override (defaults to TEST_CREDENTIALS.organisateur.email)
 * @returns Promise that resolves when login is complete and redirect to /admin is confirmed
 */
export async function loginAsOrganisateur(
  page: Page,
  email?: string
): Promise<void> {
  const emailToUse = email ?? TEST_CREDENTIALS.organisateur.email;
  
  await page.goto("/login");
  await page.getByLabel(/adresse email|email/i).fill(emailToUse);
  await page.getByRole("button", { name: /se connecter/i }).click();
  
  // Wait for redirect to admin dashboard
  await page.waitForURL(/\/admin/, { timeout: 15_000 });
}

/**
 * Join as a jury member using event slug and PIN.
 * 
 * @param page - Playwright page instance
 * @param eventSlug - Optional event slug override
 * @param pin - Optional PIN override (6 digits as string)
 * @returns Promise that resolves when join is complete and redirect to /jury is confirmed
 */
export async function joinAsJury(
  page: Page,
  eventSlug?: string,
  pin?: string
): Promise<void> {
  const slugToUse = eventSlug ?? TEST_CREDENTIALS.jury.eventSlug;
  const pinToUse = pin ?? TEST_CREDENTIALS.jury.pin;
  
  await page.goto("/jury/join");
  
  // Fill event slug
  await page.getByLabel(/slug de l'événement|slug/i).fill(slugToUse);
  
  // Fill 6-digit PIN
  const pinInputs = page.locator('input[aria-label^="Chiffre"]');
  for (let i = 0; i < 6; i++) {
    await pinInputs.nth(i).fill(pinToUse[i] ?? "0");
  }
  
  // Submit
  await page.getByRole("button", { name: /accéder à la notation/i }).click();
  
  // Wait for redirect to jury dashboard
  await page.waitForURL(/\/jury/, { timeout: 15_000 });
}

/**
 * Clear all authentication state (cookies, localStorage, sessionStorage).
 * 
 * @param page - Playwright page instance
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Check if user is authenticated (has session cookie).
 * 
 * @param page - Playwright page instance
 * @returns Promise<boolean> - true if authenticated, false otherwise
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const cookies = await page.context().cookies();
  return cookies.some(
    (cookie) =>
      cookie.name.includes("next-auth") ||
      cookie.name.includes("session") ||
      cookie.name.includes("auth")
  );
}
