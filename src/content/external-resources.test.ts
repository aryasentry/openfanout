import { describe, expect, it } from 'vitest';
import { directoryPages, externalResources } from './external-resources';
import snapshot from './external-resources.json';

describe('public external resource registry', () => {
  it('contains every current source placement, including intentional repeated destinations', () => {
    expect(externalResources).toEqual(expect.arrayContaining(snapshot.records));
    expect(externalResources).toHaveLength(581);
    expect(new Set(externalResources.map((record) => record.id)).size).toBe(externalResources.length);
    expect(new Set(externalResources.map((record) => record.route)).size).toBe(externalResources.length);
    expect(externalResources.every((record) => record.route.startsWith('/'))).toBe(true);
    expect(externalResources.every((record) => /^https?:\/\//.test(record.externalUrl))).toBe(true);
    expect(externalResources.filter((record) => record.externalUrl === 'https://www.deeplearningbook.org/')).toHaveLength(2);
    expect(externalResources.some((record) => record.externalUrl === 'https://fanout.sh/books/principles-of-building-ai-agents.pdf')).toBe(true);
  });

  it('preserves source-page grouping and complete source descriptions', () => {
    expect(directoryPages.get('/ai/resources')?.records).toHaveLength(40);
    expect(directoryPages.get('/ai/community')?.records).toHaveLength(144);
    expect(directoryPages.get('/ai/gpu')?.records).toHaveLength(15);
    expect(directoryPages.get('/ai/tools')?.records).toHaveLength(93);
    expect(directoryPages.get('/companies')?.records).toHaveLength(24);
    expect(externalResources.filter((record) => record.summary?.trim()).length).toBe(190);
    expect(externalResources.some((record) => record.summary?.includes('reference filed under'))).toBe(false);
    expect(externalResources.some((record) => record.summary?.includes('This representation contains public Fanout content'))).toBe(false);
  });

  it('keeps source titles, destinations, descriptions, and metadata for representative records', () => {
    const mml = externalResources.find((record) => record.title === 'Mathematics for Machine Learning');
    const cuda = externalResources.find((record) => record.title === 'CUDA Toolkit Documentation');
    const colab = externalResources.find((record) => record.sourcePage === '/ai/tools' && record.title === 'Google Colab');
    expect(mml?.externalUrl).toBe('https://mml-book.github.io/');
    expect(mml?.summary).toBe('The foundational textbook connecting linear algebra, calculus, and probability to ML algorithms. Free PDF available.');
    expect(mml?.metadata).toEqual({ Author: 'Deisenroht, Faisal & Ong', Tag: 'essential' });
    expect(cuda?.externalUrl).toBe('https://docs.nvidia.com/cuda/');
    expect(colab?.externalUrl).toBe('https://colab.research.google.com');
  });
});
