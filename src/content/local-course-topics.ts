import capture from './course-source-index.json';
import { aiLessons, aiModules } from './ai-lessons';
import { mathLessons } from './math-lessons';
import mathMediaAudit from './math-media-audit.json';

const existingBySource = new Map([...aiLessons, ...mathLessons].map(lesson => [lesson.sourceUrl, lesson]));
const aiByAnchor = new Map(aiLessons.map(lesson => [lesson.slug, lesson]));
const mathMediaBySource = new Map(mathMediaAudit.observations.map(item => [item.sourceUrl, item]));

export const localCourseTopics = capture.courses.filter(course => course.id !== 'system').flatMap(course =>
  course.modules.flatMap((courseModule, moduleIndex) => courseModule.topics.map((topic, topicIndex) => {
    const source = new URL(topic.url);
    const existing = existingBySource.get(topic.url) ?? (course.id === 'ai'
      ? aiByAnchor.get(source.hash.slice(1)) ?? aiModules[moduleIndex]?.lessons[topicIndex]
      : undefined);
    const slug = existing?.slug ?? source.pathname.split('/').at(-1)!;
    return {
      title: topic.title, sourceUrl: topic.url, courseId: course.id, moduleId: courseModule.id,
      moduleTitle: courseModule.title, slug,
      route: existing?.route ?? `/ml-math/lessons/${slug}`,
      available: Boolean(existing && (existing.notes.length || existing.youtubeEmbedUrl)),
      notesAvailable: Boolean(existing?.notes.length),
      videoAvailable: Boolean(existing?.youtubeEmbedUrl || mathMediaBySource.get(topic.url)?.videoUrls.length),
    };
  })),
);

export const localTopicBySource = new Map(localCourseTopics.map(topic => [topic.sourceUrl, topic]));
export const fullMathTopics = localCourseTopics.filter(topic => topic.courseId === 'ml-math');
export const fullMathTopicBySlug = new Map(fullMathTopics.map(topic => [topic.slug, topic]));
