import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const audit = JSON.parse(readFileSync(new URL('../src/content/math-media-audit.json', import.meta.url), 'utf8')) as {
  observations: Array<{ sourceUrl: string; videoUrls: string[] }>;
};

test('all 301 local math routes render their verified source video', async ({ request }) => {
  test.setTimeout(120_000);
  expect(audit.observations).toHaveLength(301);
  for (let start = 0; start < audit.observations.length; start += 8) {
    await Promise.all(audit.observations.slice(start, start + 8).map(async (observation) => {
      const route = new URL(observation.sourceUrl).pathname;
      const response = await request.get(route);
      expect(response.status(), route).toBe(200);
      const html = await response.text();
      const frames = html.match(/<iframe\b[^>]*>/g) ?? [];
      const videoId = new URL(observation.videoUrls[0]!).searchParams.get('v');
      expect(frames.some(frame => frame.includes(`src="https://www.youtube-nocookie.com/embed/${videoId}"`)), route).toBe(true);
    }));
  }
});
