import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { catalog } from '../src/content/catalog';
import { aiNavigation, mathNavigation } from '../src/content/navigation';
import type {
  CatalogRecord,
  LessonRecord,
  NavigationGroup,
  SourceInventoryRecord,
} from '../src/content/schema';
import {
  coverageRequirements,
  deferredCoveragePartitions,
  requiredAiYoutubeIds,
  sourceInventory,
  type CoveragePartition,
} from '../src/content/source-inventory';

export interface CoverageCounts {
  inventory: number;
  pages: number;
  externalResources: number;
  aiLessons: number;
  aiYoutubeLessons: number;
  mathLessons: number;
  labs: number;
  dailyIssues: number;
}

type CountRequirement = Exclude<keyof CoverageCounts, 'inventory'>;

interface CoverageInput {
  catalog: readonly CatalogRecord[];
  inventory: readonly SourceInventoryRecord[];
  navigation: readonly NavigationGroup[];
  requirements?: Partial<Record<CountRequirement, number>>;
  deferredPartitions?: readonly CountRequirement[];
  expectedAiYoutubeIds?: readonly string[];
  expectedAiModuleCounts?: readonly number[];
}

export interface CoverageResult {
  errors: string[];
  counts: CoverageCounts;
  deferred: string[];
}

const forbiddenLabelPattern = /\b(?:pricing|account|login|upgrade|subscription|dark mode)\b/i;
const forbiddenRoutePattern = /\/(?:pricing|account|login|upgrade|subscription|dark-mode)(?:[/?#]|$)/i;

function countCoverage(records: readonly CatalogRecord[], inventoryCount: number): CoverageCounts {
  const lessons = records.filter((record): record is LessonRecord => record.kind === 'lesson');
  return {
    inventory: inventoryCount,
    pages: records.filter((record) => record.kind === 'page').length,
    externalResources: new Set(records.filter((record) => record.externalUrl).map((record) => record.externalUrl)).size,
    aiLessons: lessons.filter((record) => record.workspace === 'ai').length,
    aiYoutubeLessons: lessons.filter((record) => record.workspace === 'ai' && record.youtubeEmbedUrl).length,
    mathLessons: lessons.filter((record) => record.workspace === 'ml-math').length,
    labs: records.filter((record) => record.kind === 'lab').length,
    dailyIssues: records.filter((record) => record.kind === 'paper' && record.workspace === 'daily').length,
  };
}

export function verifyCoverage(input: CoverageInput): CoverageResult {
  const errors: string[] = [];
  const deferred: string[] = [];
  const catalogById = new Map(input.catalog.map((record) => [record.id, record]));
  const catalogRoutes = new Set(input.catalog.map((record) => record.route));
  const inventoryUrls = new Set<string>();

  for (const inventoryRecord of input.inventory) {
    if (inventoryUrls.has(inventoryRecord.sourceUrl)) {
      errors.push(`duplicate inventory URL: ${inventoryRecord.sourceUrl}`);
    }
    inventoryUrls.add(inventoryRecord.sourceUrl);

    const catalogRecord = catalogById.get(inventoryRecord.localId);
    if (!catalogRecord) {
      errors.push(`inventory localId missing from catalog: ${inventoryRecord.localId}`);
    } else if (catalogRecord.kind !== inventoryRecord.kind) {
      errors.push(`inventory kind mismatch for ${inventoryRecord.localId}: expected ${catalogRecord.kind}, received ${inventoryRecord.kind}`);
    }
  }

  const inventoryIds = new Set(input.inventory.map((record) => record.localId));
  for (const record of input.catalog) {
    if (!inventoryIds.has(record.id)) errors.push(`catalog id missing from inventory: ${record.id}`);
    if (!record.route.startsWith('/')) errors.push(`catalog route is not local: ${record.route}`);
    if (forbiddenLabelPattern.test(record.title)) errors.push(`forbidden catalog label: ${record.title}`);
    if (forbiddenRoutePattern.test(record.route)) errors.push(`forbidden catalog route: ${record.route}`);
  }

  for (const group of input.navigation) {
    for (const item of group.items) {
      if (forbiddenLabelPattern.test(item.label)) errors.push(`forbidden navigation label: ${item.label}`);
      if (forbiddenRoutePattern.test(item.href)) errors.push(`forbidden navigation route: ${item.href}`);
      if (!catalogRoutes.has(item.href)) errors.push(`navigation route missing from catalog: ${item.href}`);
    }
  }

  const counts = countCoverage(input.catalog, input.inventory.length);

  if (input.expectedAiYoutubeIds) {
    const actualIds = input.catalog
      .filter((record): record is LessonRecord => record.kind === 'lesson')
      .filter((record) => record.workspace === 'ai' && record.contentOrigin === 'fanout-public')
      .map((record) => record.youtubeEmbedUrl?.split('/').at(-1))
      .filter((videoId): videoId is string => Boolean(videoId));
    if (actualIds.join(',') !== input.expectedAiYoutubeIds.join(',')) {
      errors.push(`AI YouTube ID sequence mismatch: expected ${input.expectedAiYoutubeIds.join(',')}, received ${actualIds.join(',')}`);
    }
  }

  if (input.expectedAiModuleCounts) {
    const countsByModule = new Map<string, number>();
    input.catalog
      .filter((record): record is LessonRecord => record.kind === 'lesson' && record.workspace === 'ai')
      .forEach((record) => countsByModule.set(record.moduleId, (countsByModule.get(record.moduleId) ?? 0) + 1));
    const actualCounts = [...countsByModule.values()];
    if (actualCounts.join(',') !== input.expectedAiModuleCounts.join(',')) {
      errors.push(`AI module count sequence mismatch: expected ${input.expectedAiModuleCounts.join(',')}, received ${actualCounts.join(',')}`);
    }
  }

  const deferredSet = new Set(input.deferredPartitions ?? []);
  for (const [key, expected] of Object.entries(input.requirements ?? {}) as Array<[CountRequirement, number]>) {
    const actual = counts[key];
    if (deferredSet.has(key)) {
      deferred.push(`${key}: expected ${expected}, currently ${actual}`);
    } else if (actual !== expected) {
      errors.push(`count mismatch for ${key}: expected ${expected}, received ${actual}`);
    }
  }

  return { errors, counts, deferred };
}

function runCli() {
  const result = verifyCoverage({
    catalog,
    inventory: sourceInventory,
    navigation: [...aiNavigation, ...mathNavigation],
    requirements: coverageRequirements as Record<CountRequirement, number>,
    deferredPartitions: deferredCoveragePartitions as CoveragePartition[],
    expectedAiYoutubeIds: requiredAiYoutubeIds,
    expectedAiModuleCounts: [15, 4, 9, 27, 7, 3, 5, 4, 1, 5, 25, 3],
  });

  console.log(`openFanout coverage: ${JSON.stringify(result.counts)}`);
  for (const partition of result.deferred) console.log(`DEFERRED ${partition}`);
  if (result.errors.length > 0) {
    for (const error of result.errors) console.error(`ERROR ${error}`);
    process.exitCode = 1;
  }
}

const invokedPath = process.argv[1] ? resolve(process.argv[1]) : '';
if (invokedPath && fileURLToPath(import.meta.url) === invokedPath) runCli();
