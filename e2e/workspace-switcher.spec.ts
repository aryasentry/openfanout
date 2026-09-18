import { expect, test } from '@playwright/test';

test('switches from AI Research to ML Math', async ({ page }) => {
  await page.goto('/ai/overview');

  await page.getByRole('button', { name: 'Switch learning space' }).click();
  await page.getByRole('menuitem', { name: 'ML Math' }).click();

  await expect(page).toHaveURL(/\/ml-math\/overview$/);
  await expect(page.getByRole('button', { name: 'Switch learning space' })).toContainText('ML Math');
});

test('switches from ML Math to AI Research', async ({ page }) => {
  await page.goto('/ml-math/overview');

  await page.getByRole('button', { name: 'Switch learning space' }).click();
  await page.getByRole('menuitem', { name: 'AI Research' }).click();

  await expect(page).toHaveURL(/\/ai\/overview$/);
  await expect(page.getByRole('button', { name: 'Switch learning space' })).toContainText('AI');
});

test('selects a workspace with the keyboard', async ({ page }) => {
  await page.goto('/ai/overview');

  const switcher = page.getByRole('button', { name: 'Switch learning space' });
  await switcher.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu', { name: 'Learning spaces' })).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/ml-math\/overview$/);
});
