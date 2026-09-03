import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test.describe("SchoolYear module", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("creates a new school year", async ({ page }) => {
    await page.goto("/schoolYear");
    await expect(
      page.getByRole("heading", { name: /SchoolYear management/i }),
    ).toBeVisible();

    const label = `E2E Year ${Date.now()}`;
    await page.getByLabel(/Label/i).fill(label);
    await page.getByLabel(/Start date/i).fill("2026-09-01");
    await page.getByLabel(/End date/i).fill("2027-06-30");
    await page.getByRole("button", { name: /Create school year/i }).click();

    await expect(page.getByText(label)).toBeVisible();
  });
});
