import { aiModules } from './ai-lessons';

export interface AiModuleSummary {
  id: string;
  index: number;
  title: string;
  lessonCount: number;
}

export const aiModuleSummaries: AiModuleSummary[] = aiModules.map((module) => ({
  id: module.id,
  index: module.index,
  title: module.title,
  lessonCount: module.lessons.length,
}));

export const mathPreviewLessons = aiModules[0].lessons.slice(0, 3).map((currentLesson) => ({
  index: `01.${String(currentLesson.lessonNumber).padStart(2, '0')}`,
  title: currentLesson.title,
  detail: currentLesson.summary ?? '',
  route: currentLesson.route,
}));
