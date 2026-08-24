import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { aiLessons } from '../src/content/ai-lessons';
import { mathLessons } from '../src/content/math-lessons';
import { labs } from '../src/content/labs';
import { aiNavigation, mathNavigation } from '../src/content/navigation';

const dailySnapshot = JSON.parse(readFileSync(new URL('../src/content/daily-papers.json', import.meta.url), 'utf8')) as { records: Array<{ route: string }> };

test('every local catalog route responds successfully', async ({ request }) => {
  const routes = [...new Set([
    ...aiNavigation.flatMap((group) => group.items.map((item) => item.href)),
    ...mathNavigation.flatMap((group) => group.items.map((item) => item.href)),
    ...aiLessons.map((lesson) => lesson.route),
    ...mathLessons.map((lesson) => lesson.route),
    ...labs.map((lab) => lab.route),
    ...dailySnapshot.records.map((paper) => paper.route),
    '/daily',
    '/labs',
  ])];
  for (let index = 0; index < routes.length; index += 16) {
    const batch = routes.slice(index, index + 16);
    const responses = await Promise.all(batch.map(async (route) => ({ route, response: await request.get(route) })));
    for (const { route, response } of responses) {
      expect(response.status(), `${route} returned ${response.status()}`).toBeLessThan(400);
    }
  }
});

test('opens directories, glossary, labs, and daily archive with complete counts', async ({ page }) => {
  await page.goto('/ai/resources');
  await expect(page.getByTestId('directory-resource')).toHaveCount(40);

  await page.goto('/ai/glossary');
  await expect(page.getByTestId('glossary-term')).toHaveCount(192);

  await page.goto('/labs');
  await expect(page.getByTestId('lab-card')).toHaveCount(15);

  await page.goto('/daily');
  await expect(page.getByTestId('daily-paper-link')).toHaveCount(30);
});

test('persists a lab edit and daily read state after reload', async ({ page }) => {
  await page.goto('/labs/kv-cache');
  const context = page.getByRole('spinbutton', { name: 'Context tokens' });
  await context.fill('16384');
  await page.reload();
  await expect(context).toHaveValue('16384');

  await page.goto('/daily/2026-08-24-google-borg-cluster-management');
  const markRead = page.getByRole('button', { name: 'Mark as read' });
  if (await markRead.isVisible()) await markRead.click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Mark as unread' })).toBeVisible();
});
