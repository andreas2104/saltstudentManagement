import { expect, test } from "@playwright/test";
import { login } from "./helpers";

test.describe("Assignment module", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("creates a new assignment selecting a teacher", async ({ page }) => {
    await page.goto("/assignment");
    await expect(
      page.getByRole("heading", { name: /Assignment management/i }),
    ).toBeVisible();

    await page.getByLabel(/Teacher/i).selectOption("Teacher1 One");
    await page.getByLabel(/Class/i).selectOption("E2E Class (E2E)");
    await page.getByLabel(/Course/i).selectOption("E2E Course (E2E-1)");
    await page.getByLabel(/School Year/i).selectOption("E2E Year (ACTIVE)");

    await page.getByRole("button", { name: /Create assignment/i }).click();

    await expect(page.getByText(/Assignment created successfully/i)).toBeVisible();
    await expect(page.getByText(/E2E Course/i)).toBeVisible();
  });

  test("blocks duplicate assignment with conflict error", async ({
    page,
  }) => {
    await login(page);
    // Create once via UI
    await page.goto("/assignment");
    await page.getByLabel(/Teacher/i).selectOption("Teacher2 Two");
    await page.getByLabel(/Class/i).selectOption("E2E Class (E2E)");
    await page.getByLabel(/Course/i).selectOption("E2E Course (E2E-1)");
    await page.getByLabel(/School Year/i).selectOption("E2E Year (ACTIVE)");
    await page.getByRole("button", { name: /Create assignment/i }).click();
    await expect(
      page.getByText(/Assignment created successfully/i),
    ).toBeVisible();

    // Attempt duplicate via authenticated API call in the page context
    const dup = await page.request.post("/api/assignment", {
      data: {
        teacherId: 2,
        classId: 1,
        courseId: 1,
        schoolYearId: 1,
      },
    });
    const body = await dup.json();
    expect(dup.status()).toBe(409);
    expect(body.error).toMatch(/already exists/i);
  });
});
