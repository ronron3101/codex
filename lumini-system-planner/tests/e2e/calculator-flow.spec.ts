import { expect, test } from "@playwright/test";

test("user completes planner and reaches result page", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Start Planning" }).click();

  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Calculate" }).click();

  await expect(page.getByTestId("result-panel")).toBeVisible();
  await expect(page.getByText("Transformer Recommendation")).toBeVisible();
  await expect(page.getByRole("button", { name: "Download PDF" })).toBeVisible();
});
