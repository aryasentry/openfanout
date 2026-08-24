import { expect, test } from '@playwright/test';

test('persists lesson completion after reload', async ({ page }) => {
  await page.goto('/ai/lessons/math-fundamentals-functions');
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeVisible({ timeout: 2_000 });
  await page.getByRole('button', { name: 'Mark complete' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Mark incomplete' })).toBeVisible();
});
