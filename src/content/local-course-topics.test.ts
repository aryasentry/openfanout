import { expect, it } from 'vitest';
import { aiLessons } from './ai-lessons';
import { localCourseTopics, fullMathTopics } from './local-course-topics';

it('gives every non-system topic a unique local route and preserves existing AI lessons', () => {
  expect(localCourseTopics).toHaveLength(409);
  expect(fullMathTopics).toHaveLength(301);
  expect(new Set(localCourseTopics.map(t => t.route)).size).toBe(409);
  for (const topic of localCourseTopics) expect(topic.route).toMatch(/^\/(ai|ml-math)\/lessons\//);
  const aiRoutes = new Set(aiLessons.map(lesson => lesson.route));
  for (const topic of localCourseTopics.filter(t => t.courseId === 'ai')) expect(aiRoutes.has(topic.route as `/${string}`)).toBe(true);
  expect(fullMathTopics.filter(t => t.available)).toHaveLength(34);
});
