import { expect, it } from 'vitest';
import { aiLessons } from './ai-lessons';
import { observedAiMedia, notesOnlyAiTopic } from './ai-observed-media';

it('maps every captured MLOps video to exactly one local lesson', () => {
  expect(observedAiMedia).toHaveLength(24);
  expect(new Set(observedAiMedia.map(media => media.youtubeId)).size).toBe(24);
  for (const media of observedAiMedia) {
    const lessons = aiLessons.filter(lesson => lesson.sourceUrl === media.sourceUrl);
    expect(lessons).toHaveLength(1);
    expect(lessons[0].youtubeEmbedUrl).toBe(`https://www.youtube-nocookie.com/embed/${media.youtubeId}`);
    expect(lessons[0].notes).toEqual([]);
    expect(media.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
    for (const recommended of media.recommendedVideos) expect(recommended.youtubeId).toMatch(/^[A-Za-z0-9_-]{11}$/);
  }
  expect(aiLessons.filter(lesson => !lesson.youtubeEmbedUrl).map(lesson => lesson.sourceUrl)).toEqual([`https://fanout.sh/ai/overview#${notesOnlyAiTopic}`]);
});
