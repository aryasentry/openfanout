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

test('opens a video-only mathematics lesson from global search', async ({ page }) => {
  await page.goto('/ml-math/overview');
  await page.getByRole('button', { name: 'Search openFanout' }).click();
  const dialog = page.getByRole('dialog', { name: 'Search openFanout' });
  await dialog.getByRole('searchbox').fill('Matrix Gradients');
  const result = dialog.getByRole('link', { name: /^Matrix Gradients/ });
  await expect(result).toHaveCount(1);
  await result.click();
  await expect(page).toHaveURL(/\/ml-math\/lessons\/calculus-matrix-gradients-t-1aubeb6$/);
  await expect(page.getByRole('heading', { name: 'Matrix Gradients', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Written notes pending' })).toBeVisible();
  await expect(page.locator('main iframe')).toHaveAttribute('src', /youtube-nocookie\.com\/embed\//);
});
