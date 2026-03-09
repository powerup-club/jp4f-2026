import { expect, test } from "@playwright/test";

test("unauthenticated admin access lands on the login page", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login/);
  await expect(page.getByRole("button", { name: /continuer avec google/i })).toBeVisible();
});
