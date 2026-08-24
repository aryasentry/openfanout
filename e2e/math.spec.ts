import { expect, test } from '@playwright/test';

test('renders the complete mathematics map and persists lesson completion', async ({ page }) => {
  await page.goto('/ml-math/overview');
  await expect(page.getByRole('heading', { name: 'Build the math intuition models depend on.' })).toBeVisible();
  await expect(page.getByTestId('math-module-link')).toHaveCount(12);
  await expect(page.getByTestId('math-lesson-link')).toHaveCount(34);
  await expect(page.getByTestId('math-lesson-link').filter({ hasText: 'SVD for 2x2 Matrices' }).getByText('UΣVᵀ', { exact: true })).toBeVisible();

  await page.getByTestId('math-lesson-link').first().click();
  await expect(page.getByRole('heading', { name: 'Special Sets and the Number-System Ladder' })).toBeVisible();
  await page.getByRole('button', { name: 'Mark complete' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Mark incomplete' })).toBeVisible();
});

test('decodes notation locally', async ({ page }) => {
  await page.goto('/ml-math/decoder');
  await page.getByRole('textbox', { name: 'Expression or concept' }).fill('UΣVᵀ');
  await expect(page.getByRole('heading', { name: 'Singular value decomposition' })).toBeVisible();
});

test.describe('mobile mathematics overview', () => {
  test.use({ viewport: { width: 320, height: 760 } });

  test('has no horizontal overflow and keeps symbols visible', async ({ page }) => {
    await page.goto('/ml-math/overview');
    await expect(page.getByTestId('math-lesson-link').first().getByText('ℕ⊂ℤ', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.body.scrollWidth)).toBeLessThanOrEqual(320);
  });
});
