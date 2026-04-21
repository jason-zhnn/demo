import { test, expect } from "@playwright/test";

test("dashboard links to library and shows a book", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.getByRole("link", { name: "Library" }).first().click();
  await expect(page.getByRole("heading", { name: "Library" })).toBeVisible();

  const firstBook = page.locator("a[href^='/books/']").first();
  await firstBook.click();
  await expect(page.locator("h1")).toBeVisible();
});
