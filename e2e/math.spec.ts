import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const observedMedia = JSON.parse(readFileSync(new URL('../src/content/math-media-audit.json', import.meta.url), 'utf8')) as {
  observations: Array<{ sourceUrl: string; videoUrls: string[] }>;
};

test('renders the complete mathematics map and persists lesson completion', async ({ page }) => {
  await page.goto('/ml-math/overview');
  await expect(page.getByRole('heading', { name: 'Build the math intuition models depend on.' })).toBeVisible();
  await expect(page.getByTestId('math-module-link')).toHaveCount(12);
  await expect(page.getByTestId('math-lesson-link')).toHaveCount(34);
  await expect(page.getByTestId('math-pending-link')).toHaveCount(267);
  await expect(page.getByTestId('math-lesson-link').filter({ hasText: 'SVD for 2x2 Matrices' }).getByText('UΣVᵀ', { exact: true })).toBeVisible();

  await page.getByTestId('math-lesson-link').first().click();
  await expect(page.getByRole('heading', { name: 'Special Sets and the Number-System Ladder' })).toBeVisible();
  await page.getByRole('button', { name: 'Mark complete' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Mark incomplete' })).toBeVisible();

  await page.goto('/ml-math/lessons/sets-indicator-functions-for-predicates-t-1289tky');
  await expect(page.getByText('1 of 25')).toBeVisible();
  await page.getByRole('link', { name: 'Next: Relative Complements' }).click();
  await expect(page).toHaveURL('/ml-math/lessons/sets-relative-complements-t-0x92bp9');
  await expect(page.getByRole('heading', { name: 'Written notes pending' })).toBeVisible();
  await expect(page.getByText('Quiz questions are pending in this local copy.')).toBeVisible();

  await page.goto('/ml-math/lessons/logic-statements-and-predicates-t-1816xbj');
  await expect(page.getByRole('heading', { name: 'Written notes pending' })).toBeVisible();
  await expect(page.getByText(/A source video is available.*written notes have not been added/)).toBeVisible();
  await expect(page.getByTitle('Video: Statements and Predicates')).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/7mulE-zramc',
  );
  await expect(page.getByRole('link', { name: 'https://openstax.org/books/contemporary-mathematics/pages/2-1-statements-and-quantifiers' })).toBeVisible();
  await expect(page.getByText('Quiz questions are pending in this local copy.')).toBeVisible();

  await page.goto('/ml-math/lessons/calculus-hyperboloids-t-0hnekga');
  if (observedMedia.observations.some(topic => topic.sourceUrl.endsWith('/calculus-hyperboloids-t-0hnekga') && topic.videoUrls.length)) {
    await expect(page.getByRole('heading', { name: 'Written notes pending' })).toBeVisible();
    await expect(page.getByTitle('Video: Hyperboloids')).toBeVisible();
    await expect(page.getByText('Quiz questions are pending in this local copy.')).toBeVisible();
  } else {
    await expect(page.getByRole('heading', { name: 'Lesson content pending' })).toBeVisible();
    await expect(page.getByText(/Written notes and a source video have not been added/)).toBeVisible();
    await expect(page.getByText('Quiz questions are pending in this local copy.')).not.toBeVisible();
  }
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
