import { test, expect } from "@playwright/test";

test("root redirects to /fr", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/fr$/);
});

test("language switcher keeps route while switching locale", async ({ page }) => {
  await page.goto("/fr/programme");
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/programme$/);
});

test("mobile and desktop nav expose competition route", async ({ page }) => {
  await page.goto("/fr");
  await expect(page.getByRole("link", { name: /Challenge/i }).first()).toBeVisible();
});
