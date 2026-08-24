import { describe, expect, it } from 'vitest';
import { dailyPaperBySlug, dailyPapers, getDailyPaperNeighbors } from './daily-papers';

describe('daily paper registry', () => {
  it('contains the exact latest 30 public issues in chronological order', () => {
    expect(dailyPapers).toHaveLength(30);
    expect(dailyPapers[0]?.title).toBe('Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks');
    expect(dailyPapers.at(-1)?.title).toBe('Large-scale cluster management at Google with Borg');
    expect(dailyPapers.map((paper) => paper.slug.slice(0, 10))).toEqual([...dailyPapers.map((paper) => paper.slug.slice(0, 10))].sort());
  });

  it('preserves citation metadata and unique original-paper links', () => {
    expect(new Set(dailyPapers.map((paper) => paper.externalUrl)).size).toBe(30);
    expect(dailyPapers.every((paper) => paper.authors && paper.venue && paper.track && paper.readingTime)).toBe(true);
    expect(dailyPaperBySlug.get('2026-08-24-google-borg-cluster-management')?.externalUrl)
      .toBe('https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/');
  });

  it('derives archive neighbors', () => {
    expect(getDailyPaperNeighbors(dailyPapers[0]!.slug).previous).toBeNull();
    expect(getDailyPaperNeighbors(dailyPapers[0]!.slug).next?.title).toBe('Fast Inference from Transformers via Speculative Decoding');
    expect(getDailyPaperNeighbors(dailyPapers.at(-1)!.slug).next).toBeNull();
  });
});
