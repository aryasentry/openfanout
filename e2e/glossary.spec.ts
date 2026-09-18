import { expect, test } from '@playwright/test';

test('global search reveals a glossary term hidden by local filters', async ({ page }) => {
  await page.goto('/ai/glossary');
  await page.getByRole('button', { name: 'Fundamentals', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'AdamW', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: 'Search openFanout' }).click();
  const dialog = page.getByRole('dialog', { name: 'Search openFanout' });
  await dialog.getByRole('searchbox').fill('AdamW');
  await dialog.getByRole('link', { name: /^AdamW/ }).click();
  await expect(page.locator('#glossary-130')).toBeVisible();
  await expect(page.locator('#glossary-130')).toBeInViewport();
  await page.getByRole('button', { name: 'Fundamentals', exact: true }).click();
  await page.getByRole('button', { name: 'Search openFanout' }).click();
  await dialog.getByRole('link', { name: /^AdamW/ }).click();
  await expect(page.locator('#glossary-130')).toBeInViewport();
});

test('global search reveals a resource hidden by a directory category', async ({ page }) => {
  await page.goto('/ai/resources');
  await page.getByRole('button', { name: 'Books', exact: true }).click();
  await page.getByRole('button', { name: 'Search openFanout' }).click();
  const dialog = page.getByRole('dialog', { name: 'Search openFanout' });
  await dialog.getByRole('searchbox').fill('Khan Academy');
  await dialog.getByRole('link', { name: /^Khan Academy/ }).click();
  await expect(page.locator('main').getByRole('link', { name: /Khan Academy/ })).toBeInViewport();
});

test('opens a glossary definition from either workspace search', async ({ page }) => {
  for (const route of ['/ai/overview', '/ml-math/overview']) {
    await page.goto(route);
    await page.getByRole('button', { name: 'Search openFanout' }).click();
    const dialog = page.getByRole('dialog', { name: 'Search openFanout' });
    await dialog.getByRole('searchbox').fill('AdamW');
    await dialog.getByRole('link', { name: /^AdamW/ }).click();
    await expect(page).toHaveURL(/\/ai\/glossary#glossary-130$/);
    await expect(page.locator('#glossary-130')).toContainText('decouples weight decay');
    await expect(page.locator('#glossary-130')).toBeInViewport();
  }
});

test('glossary explains terms and combines category, letter, and definition search', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/ai/glossary');
  await expect(page.getByTestId('glossary-term')).toHaveCount(192);
  await expect(page.getByText(/is filed under/)).toHaveCount(0);
  await page.getByRole('button', { name: 'Training', exact: true }).click();
  await page.getByRole('group', { name: 'Starting letter' }).getByRole('button', { name: 'A', exact: true }).click();
  await expect(page.getByTestId('glossary-term')).toHaveCount(2);
  await page.getByRole('searchbox').fill('decouples');
  await expect(page.getByTestId('glossary-term')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'AdamW', exact: true })).toBeVisible();
  await page.getByRole('searchbox').fill('no-such-concept');
  await expect(page.getByRole('heading', { name: 'No matching terms' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.getByTestId('glossary-term')).toHaveCount(192);
  await page.getByRole('searchbox').fill('GRPO');
  await expect(page.getByRole('link', { name: 'Technical reference' })).toHaveAttribute('href', 'https://arxiv.org/abs/2402.03300');
  await page.setViewportSize({ width: 320, height: 760 });
  await page.reload();
  await page.getByRole('searchbox').fill('GRPO');
  await page.getByRole('heading', { name: 'AI glossary, in plain English' }).scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/openfanout-glossary-mobile.png', animations: 'disabled' });
  expect(errors).toEqual([]);
});
