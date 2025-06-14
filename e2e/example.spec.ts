import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Create Next App/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Click the "Read our docs" link.
  await page.getByRole('link', { name: 'Read our docs' }).click();

  // Expects page to have a heading with the name of "Getting Started".
  await expect(page.getByRole('heading', { name: 'Getting Started' })).toBeVisible();
});
