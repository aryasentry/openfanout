import { describe, expect, it } from 'vitest';
import {
  aiLessons,
  aiModules,
  getAiLessonNeighbors,
  publicAiYoutubeIds,
} from './ai-lessons';

const expectedModuleCounts = [15, 4, 9, 27, 7, 3, 5, 4, 1, 5, 25, 3];
const expectedYoutubeIds = [
  'kvGsIo1TmsM',
  '9vKqVkMQHKk',
  'fNk_zzaMoSs',
  'vp2oUoBDH4w',
  '5H4crNlLK_A',
  '_MaVzNUjMPk',
  'lAq96T8FkTw',
  'QtlDV2r1ryE',
  'TjHH_--7l8g',
  'L94MdLdP21s',
  'yXbF-1n9wxs',
  'O2yAMJu8LpI',
  'oYIBwbHM_PI',
  'bu5dhaLmr7E',
  'enPFr-WxHgQ',
  'P9zzUM0PrBM',
];

describe('AI curriculum registry', () => {
  it('contains all 12 modules and 108 lessons in the observed order', () => {
    expect(aiModules).toHaveLength(12);
    expect(aiModules.map((module) => module.lessons.length)).toEqual(expectedModuleCounts);
    expect(aiLessons).toHaveLength(108);
    expect(aiLessons.at(0)?.title).toBe('Functions');
    expect(aiLessons.at(-1)?.title).toBe('100x AI Reasoning — Tiny Recursive Model');
  });

  it('uses unique ids, slugs, and local routes', () => {
    expect(new Set(aiLessons.map((lesson) => lesson.id)).size).toBe(108);
    expect(new Set(aiLessons.map((lesson) => lesson.slug)).size).toBe(108);
    expect(new Set(aiLessons.map((lesson) => lesson.route)).size).toBe(108);
    expect(aiLessons.every((lesson) => lesson.route === `/ai/lessons/${lesson.slug}`)).toBe(true);
  });

  it('contains exactly the 16 mapped public YouTube lessons', () => {
    expect(publicAiYoutubeIds).toEqual(expectedYoutubeIds);
    expect(aiLessons.filter((lesson) => lesson.youtubeEmbedUrl)).toHaveLength(16);
  });

  it('derives previous and next lessons across module boundaries', () => {
    expect(getAiLessonNeighbors('math-fundamentals-functions').previous).toBeNull();
    expect(getAiLessonNeighbors('math-fundamentals-more-math-lessons').next?.title).toBe('Similarity With Dot Product');
    expect(getAiLessonNeighbors('core-ai-intuitions-similarity-with-dot-product').previous?.title).toBe('More Math Lessons');
    expect(getAiLessonNeighbors('bonus-lessons-100x-ai-reasoning-tiny-recursive-model').next).toBeNull();
  });
});
