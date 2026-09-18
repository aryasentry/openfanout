import { describe, expect, it } from 'vitest';
import { directoryPages, externalResources } from './external-resources';

describe('September resource audit additions', () => {
  it('exposes every research organization under its observed category', () => {
    const page = directoryPages.get('/ai/community')!;
    for (const [title, count, url] of [
      ['Frontier Labs', 12, 'https://openai.com/'],
      ['Big Tech', 13, 'https://research.google/'],
      ['Startups', 19, 'https://deepseek.com/'],
      ['Academic', 14, 'https://www.baai.ac.cn/'],
      ['Government', 4, 'https://aip.riken.jp/'],
    ] as const) {
      const section = page.sections.find((item) => item.title === title);
      expect(section?.records).toHaveLength(count);
      expect(section?.records.some((record) => record.externalUrl === url)).toBe(true);
    }
    expect(page.sections.some((section) => section.title === 'Additional resources')).toBe(false);
  });

  it.each([
    ['/ai/tools', 'https://jupyter.org/'],
    ['/ai/tools', 'https://github.com/karpathy/nanochat'],
    ['/ai/community', 'https://openai.com/'],
    ['/ai/community', 'https://www.aisi.gov.uk/'],
    ['/ai/gpu', 'https://leonardoaraujosantos.gitbook.io/opencl'],
    ['/ai/jobs', 'https://remotive.com/'],
    ['/ai/deep-learning', 'https://www.youtube.com/watch?v=bMXqnLiVgLk'],
  ])('makes the observed destination available on %s: %s', (page, url) => {
    expect(directoryPages.get(page)?.records.some((record) => record.externalUrl === url)).toBe(true);
  });

  it('keeps shared destinations in both relevant directories with separate identities', () => {
    const records = externalResources.filter((record) => record.externalUrl === 'https://together.ai/');
    expect(records.map((record) => record.sourcePage).sort()).toEqual(['/ai/community', '/ai/tools']);
    expect(new Set(records.map((record) => record.id)).size).toBe(2);
    expect(new Set(records.map((record) => record.route)).size).toBe(2);
  });
});
