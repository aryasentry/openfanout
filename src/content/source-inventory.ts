import foundationInventory from './source-inventory.json';
import { aiLessons } from './ai-lessons';
import type { SourceInventoryRecord } from './schema';

export type CoveragePartition =
  | 'pages'
  | 'externalResources'
  | 'aiLessons'
  | 'aiYoutubeLessons'
  | 'mathLessons'
  | 'labs'
  | 'dailyIssues';

export const coverageRequirements: Record<CoveragePartition, number> = {
  pages: 26,
  externalResources: 455,
  aiLessons: 108,
  aiYoutubeLessons: 16,
  mathLessons: 34,
  labs: 15,
  dailyIssues: 30,
};

export const deferredCoveragePartitions: CoveragePartition[] = [
  'externalResources',
  'mathLessons',
  'labs',
  'dailyIssues',
];

export const requiredAiYoutubeIds = [
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
] as const;

const aiLessonInventory: SourceInventoryRecord[] = aiLessons.map((lesson) => ({
  sourceUrl: lesson.sourceUrl,
  localId: lesson.id,
  kind: lesson.kind,
  checkedAt: lesson.provenanceCheckedAt,
}));

export const sourceInventory: SourceInventoryRecord[] = [
  ...(foundationInventory.records as SourceInventoryRecord[]),
  ...aiLessonInventory,
];
