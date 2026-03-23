import { expect, test } from "@playwright/test";

test("unauthenticated applicants are redirected to Google login before the registration form", async ({ page }) => {
  await page.goto("/fr/competition/register");
  await expect(page).toHaveURL(/\/auth\/login/);
  await expect(page.getByRole("button", { name: /se connecter avec google/i })).toBeVisible();
});
