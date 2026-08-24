import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 320, height: 760 } });

test('keeps the overview usable at 320px and exposes the navigation drawer', async ({ page }) => {
  await page.goto('/ai/overview');
  await expect(page.getByRole('heading', { name: 'AI Research archive' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeVisible();

  const navigation = page.getByRole('navigation', { name: 'Course navigation' });
  await expect.poll(async () => (await navigation.boundingBox())?.x ?? 0).toBeLessThan(0);
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect.poll(async () => Math.round((await navigation.boundingBox())?.x ?? -1)).toBe(0);
  await expect(page.getByRole('link', { name: 'Resources' })).toBeVisible();

  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  expect(bodyWidth).toBeLessThanOrEqual(320);
});
