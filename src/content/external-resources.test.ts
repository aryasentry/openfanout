import { describe, expect, it } from 'vitest';
import { directoryPages, externalResources } from './external-resources';

describe('public external resource registry', () => {
  it('contains the 422 unique directory links observed in public Markdown mirrors', () => {
    expect(externalResources).toHaveLength(422);
    expect(new Set(externalResources.map((record) => record.externalUrl)).size).toBe(422);
    expect(new Set(externalResources.map((record) => record.id)).size).toBe(422);
    expect(externalResources.every((record) => record.route.startsWith('/'))).toBe(true);
  });

  it('preserves source-page grouping without source descriptions', () => {
    expect(directoryPages.get('/ai/resources')?.records).toHaveLength(39);
    expect(directoryPages.get('/ai/community')?.records).toHaveLength(82);
    expect(directoryPages.get('/ai/gpu')?.records).toHaveLength(12);
    expect(directoryPages.get('/companies')?.records).toHaveLength(24);
    expect(externalResources.every((record) => record.summary?.startsWith('A public '))).toBe(true);
  });

  it('keeps exact public titles and destinations for representative records', () => {
    const mml = externalResources.find((record) => record.title === 'Mathematics for Machine Learning');
    const cuda = externalResources.find((record) => record.title === 'CUDA Toolkit Documentation');
    expect(mml?.externalUrl).toBe('https://mml-book.github.io/');
    expect(cuda?.externalUrl).toBe('https://docs.nvidia.com/cuda/');
  });
});
