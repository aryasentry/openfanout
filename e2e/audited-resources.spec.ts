import { expect, test } from '@playwright/test';
import links from '../src/content/audited-resource-links.json' with { type: 'json' };

test('community organization categories show the source-audited memberships', async ({ page }) => {
  await page.goto('/ai/community');
  const organizations = page.getByRole('region', { name: 'AI research organizations', exact: true });
  for (const [category, count, url] of [
    ['Frontier Labs', 12, 'https://openai.com/'],
    ['Big Tech', 13, 'https://research.google/'],
    ['Startups', 19, 'https://deepseek.com/'],
    ['Academic', 14, 'https://www.baai.ac.cn/'],
    ['Government', 4, 'https://aip.riken.jp/'],
  ] as const) {
    await organizations.getByRole('button', { name: category, exact: true }).click();
    await expect(organizations.getByTestId('directory-resource')).toHaveCount(count);
    await expect(organizations.locator(`a[href="${url}"]`)).toBeVisible();
  }
  await organizations.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.getByTestId('directory-resource')).toHaveCount(144);
  const people = page.getByRole('region', { name: 'Who to follow on X', exact: true });
  const communities = page.getByRole('region', { name: 'Twitter, Discord & Reddit communities', exact: true });
  for (const [name, count] of [['Researchers', 16], ['Educators', 19], ['Builders', 17], ['Leaders', 11]] as const) {
    await people.getByRole('button', { name, exact: true }).click();
    await expect(people.getByTestId('directory-resource')).toHaveCount(count);
    await expect(organizations.getByTestId('directory-resource')).toHaveCount(62);
  }
  for (const [name, count] of [['X', 3], ['Discord', 12], ['Reddit', 4]] as const) {
    await communities.getByRole('button', { name, exact: true }).click();
    await expect(communities.getByTestId('directory-resource')).toHaveCount(count);
    await expect(people.getByTestId('directory-resource')).toHaveCount(11);
  }
  await page.setViewportSize({ width: 320, height: 760 });
  await page.reload();
  await expect(people.getByTestId('directory-resource')).toHaveCount(63);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/openfanout-community-mobile.png', animations: 'disabled' });
});

test('resource categories combine with search and remain usable on mobile', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/ai/resources');
  await page.getByRole('button', { name: 'Books', exact: true }).click();
  await expect(page.getByTestId('directory-resource')).toHaveCount(10);
  await page.getByRole('searchbox', { name: 'Filter Resource library' }).fill('Khan Academy');
  await expect(page.getByRole('heading', { name: 'No matching references' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.getByTestId('directory-resource')).toHaveCount(40);
  await page.setViewportSize({ width: 320, height: 760 });
  await expect.poll(async () => {
    const bounds = await page.getByRole('navigation', { name: 'Course navigation' }).boundingBox();
    return bounds ? bounds.x + bounds.width : 0;
  }).toBeLessThanOrEqual(0);
  await page.getByRole('button', { name: 'Platforms', exact: true }).click();
  await expect(page.getByTestId('directory-resource')).toHaveCount(10);
  await expect(page.getByRole('status')).toHaveText('10 of 40 references');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/tmp/openfanout-resource-categories-mobile.png' });
  expect(errors).toEqual([]);
});

test('renders every September audit destination on its source directory', async ({ page }) => {
  for (const route of new Set(links.map((link) => link.page))) {
    await page.goto(route);
    const hrefs = await page.locator('main a[href]').evaluateAll((anchors) => anchors.map((anchor) => anchor.getAttribute('href')));
    for (const link of links.filter((link) => link.page === route)) {
      expect(hrefs, `${route}: ${link.url}`).toContain(link.url);
    }
  }
  await page.goto('/ai/hardware');
  await expect(page.getByRole('heading', { name: 'GPU vs CPU for ML' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'llmfit', exact: true })).toHaveAttribute('href', 'https://github.com/AlexsJones/llmfit');
});
