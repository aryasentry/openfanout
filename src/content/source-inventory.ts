import foundationInventory from './source-inventory.json';
import { aiLessons } from './ai-lessons';
import { mathLessons } from './math-lessons';
import { dailyArchiveCatalog, labsCatalogPage, pageCatalog } from './catalog';
import { allExternalResources } from './external-resources';
import { dailyPapers } from './daily-papers';
import { labs } from './labs';
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
  pages: 31,
  externalResources: 456,
  aiLessons: 108,
  aiYoutubeLessons: 83,
  mathLessons: 34,
  labs: 15,
  dailyIssues: 30,
};

export const deferredCoveragePartitions: CoveragePartition[] = [];

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

const existingFoundationUrls = new Set(
  (foundationInventory.records as SourceInventoryRecord[]).map((record) => record.sourceUrl),
);

const observedWorkspacePageInventory: SourceInventoryRecord[] = pageCatalog
  .filter((page) => !existingFoundationUrls.has(page.sourceUrl))
  .map((page) => ({
    sourceUrl: page.sourceUrl,
    localId: page.id,
    kind: page.kind,
    checkedAt: page.provenanceCheckedAt,
  }));

const mathLessonInventory: SourceInventoryRecord[] = mathLessons.map((lesson) => ({
  sourceUrl: lesson.sourceUrl,
  localId: lesson.id,
  kind: lesson.kind,
  checkedAt: lesson.provenanceCheckedAt,
}));

const externalResourceInventory: SourceInventoryRecord[] = allExternalResources.map((record) => ({
  sourceUrl: record.sourceUrl,
  localId: record.id,
  kind: record.kind,
  checkedAt: record.provenanceCheckedAt,
}));

const dailyPaperInventory: SourceInventoryRecord[] = dailyPapers.map((paper) => ({
  sourceUrl: paper.sourceUrl,
  localId: paper.id,
  kind: paper.kind,
  checkedAt: paper.provenanceCheckedAt,
}));

const labInventory: SourceInventoryRecord[] = labs.map((lab) => ({
  sourceUrl: lab.sourceUrl,
  localId: lab.id,
  kind: lab.kind,
  checkedAt: lab.provenanceCheckedAt,
}));

export const sourceInventory: SourceInventoryRecord[] = [
  ...(foundationInventory.records as SourceInventoryRecord[]),
  ...observedWorkspacePageInventory,
  { sourceUrl: dailyArchiveCatalog.sourceUrl, localId: dailyArchiveCatalog.id, kind: dailyArchiveCatalog.kind, checkedAt: dailyArchiveCatalog.provenanceCheckedAt },
  { sourceUrl: labsCatalogPage.sourceUrl, localId: labsCatalogPage.id, kind: labsCatalogPage.kind, checkedAt: labsCatalogPage.provenanceCheckedAt },
  ...aiLessonInventory,
  ...mathLessonInventory,
  ...externalResourceInventory,
  ...dailyPaperInventory,
  ...labInventory,
];
