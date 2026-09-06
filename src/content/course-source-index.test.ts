import { describe, expect, it } from 'vitest';
import capture from './course-source-index.json';
import { mathLessons } from './math-lessons';

describe('September course metadata captured in Chrome', () => {
  it('preserves all observed topic placements without blank titles or invented destinations', () => {
    expect(capture.courses.map(course => [course.id, course.modules.length, course.modules.reduce((n, m) => n + m.topics.length, 0)])).toEqual([
      ['ai', 12, 108], ['system', 14, 179], ['ml-math', 12, 301],
    ]);
    for (const course of capture.courses) {
      const topics = course.modules.flatMap(m => m.topics);
      expect(new Set(topics.map(t => t.url)).size).toBe(topics.length);
      for (const topic of topics) {
        expect(topic.title.trim().length).toBeGreaterThan(0);
        expect(new URL(topic.url).origin).toBe('https://fanout.sh');
      }
    }
    const mathUrls = new Set(capture.courses.find(c => c.id === 'ml-math')!.modules.flatMap(m => m.topics.map(t => t.url)));
    expect(mathLessons.every(lesson => mathUrls.has(lesson.sourceUrl))).toBe(true);
    expect(capture.roadmaps.map(r => r.stages.length)).toEqual([7, 9]);
    expect(capture.courses.find(c => c.id === 'system')!.systems).toHaveLength(23);
  });
});
