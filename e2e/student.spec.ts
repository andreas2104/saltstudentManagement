import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test.describe("Student module", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("creates a new student", async ({ page }) => {
    await page.goto("/student");
    await expect(
      page.getByRole("heading", { name: /Student management/i }),
    ).toBeVisible();

    await page.getByLabel(/Registration Number/i).fill("E2E-STU-001");
    await page.getByLabel("Lastname").fill("Doe");
    await page.getByLabel("Firstname").fill("Jane");
    await page.getByLabel(/Gender/i).selectOption("FEMALE");
    await page.getByLabel(/Birth Date/i).fill("2010-05-15");
    await page.getByLabel(/Class/i).selectOption({ label: "E2E Class (E2E)" });
    await page.getByLabel(/Parent Phone/i).fill("+237600000000");

    await page.getByRole("button", { name: /Create student/i }).click();

    await expect(page.getByText("Jane Doe")).toBeVisible();
    await expect(page.getByText(/Student created successfully/i)).toBeVisible();
  });

  test("shows validation errors when required fields missing", async ({
    page,
  }) => {
    await page.goto("/student");
    await page.getByRole("button", { name: /Create student/i }).click();
    await expect(page.getByText(/Lastname is required/i)).toBeVisible();
    await expect(page.getByText(/Firstname is required/i)).toBeVisible();
    await expect(page.getByText(/Class is required/i)).toBeVisible();
  });
});
