import { fullMathTopics } from './local-course-topics';
import { mathLessonBySlug, mathModules } from './math-lessons';

export interface MathTopicNavigationLesson {
  id: string;
  title: string;
  route: string;
  symbol: string;
  equation?: string;
  available: boolean;
  notesAvailable: boolean;
  videoAvailable: boolean;
  status: 'notes' | 'video-notes-pending' | 'content-pending';
  topicNumber: number;
}

export interface MathTopicNavigationModule {
  id: string;
  index: number;
  shortTitle: string;
  title: string;
  description: string;
  lessons: MathTopicNavigationLesson[];
}

const sourceTopicsByModule = new Map<string, typeof fullMathTopics>();

for (const topic of fullMathTopics) {
  const moduleTopics = sourceTopicsByModule.get(topic.moduleId);
  if (moduleTopics) {
    moduleTopics.push(topic);
  } else {
    sourceTopicsByModule.set(topic.moduleId, [topic]);
  }
}

export const mathTopicNavigationModules: MathTopicNavigationModule[] = Array.from(
  sourceTopicsByModule,
  ([moduleId, topics], modulePosition) => {
    const curriculumModule = mathModules[modulePosition];
    const moduleIndex = modulePosition + 1;
    const pendingSymbol = curriculumModule?.openNoteSymbol ?? `Ch ${String(moduleIndex).padStart(2, '0')}`;

    return {
      id: moduleId,
      index: moduleIndex,
      shortTitle: curriculumModule?.shortTitle ?? topics[0]!.moduleTitle,
      title: topics[0]!.moduleTitle,
      description: curriculumModule?.description ?? '',
      lessons: topics.map((topic, topicPosition) => {
        const lesson = mathLessonBySlug.get(topic.slug);
        return {
          id: lesson?.id ?? `math-pending-${topic.slug}`,
          title: topic.title,
          route: topic.route,
          symbol: lesson?.symbol ?? pendingSymbol,
          equation: lesson?.equation,
          available: topic.available,
          notesAvailable: topic.notesAvailable,
          videoAvailable: topic.videoAvailable,
          status: topic.notesAvailable
            ? 'notes'
            : topic.videoAvailable
              ? 'video-notes-pending'
              : 'content-pending',
          topicNumber: topicPosition + 1,
        };
      }),
    };
  },
);

export const mathTopicCount = fullMathTopics.length;
export const mathNotesAvailableTopicCount = fullMathTopics.filter(topic => topic.notesAvailable).length;
export const mathVideoAvailableTopicCount = fullMathTopics.filter(topic => topic.videoAvailable).length;
export const mathVideoNotesPendingTopicCount = fullMathTopics.filter(
  topic => topic.videoAvailable && !topic.notesAvailable,
).length;
export const mathContentPendingTopicCount = fullMathTopics.filter(
  topic => !topic.videoAvailable && !topic.notesAvailable,
).length;

// Keep these names as compatibility aliases for consumers that only need the
// original notes-backed versus pending split.
export const mathAvailableTopicCount = mathNotesAvailableTopicCount;
export const mathPendingTopicCount = mathTopicCount - mathAvailableTopicCount;
