import { expect, test } from '@playwright/test';

test('loads the AI workspace shell and local search directly', async ({ page }) => {
  await page.goto('/ai/overview');
  await expect(page.getByRole('banner')).toContainText('openFanout');
  await expect(page.getByRole('navigation', { name: 'Course navigation' })).toBeVisible();
  await expect(page.getByText(/pricing|upgrade|account/i)).toHaveCount(0);

  await page.getByRole('button', { name: 'Search openFanout' }).click();
  await page.getByRole('searchbox').fill('cuda');
  const searchDialog = page.getByRole('dialog', { name: 'Search openFanout' });
  await expect(searchDialog.getByRole('link', { name: /GPU & CUDA/ })).toHaveAttribute('href', '/ai/gpu');
});
