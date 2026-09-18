import { describe, expect, it } from 'vitest';
import { aiLessons } from './ai-lessons';
import { mathLessons } from './math-lessons';
import { dailyPapers } from './daily-papers';
import { allExternalResources } from './external-resources';
import { labs } from './labs';
import {
  coverageRequirements,
  deferredCoveragePartitions,
  requiredAiYoutubeIds,
  sourceInventory,
} from './source-inventory';

describe('composed source inventory', () => {
  it('maps every AI and mathematics lesson plus all observed workspace pages', () => {
    expect(sourceInventory).toHaveLength(804);
    const inventoryIds = new Set(sourceInventory.map((record) => record.localId));
    expect(aiLessons.every((lesson) => inventoryIds.has(lesson.id))).toBe(true);
    expect(mathLessons.every((lesson) => inventoryIds.has(lesson.id))).toBe(true);
    expect(dailyPapers.every((paper) => inventoryIds.has(paper.id))).toBe(true);
    expect(allExternalResources.every((record) => inventoryIds.has(record.id))).toBe(true);
    expect(labs.every((record) => inventoryIds.has(record.id))).toBe(true);
  });

  it('closes AI lesson partitions while leaving later slices explicit', () => {
    expect(coverageRequirements.aiLessons).toBe(108);
    expect(coverageRequirements.aiYoutubeLessons).toBe(107);
    expect(deferredCoveragePartitions).not.toContain('aiLessons');
    expect(deferredCoveragePartitions).not.toContain('aiYoutubeLessons');
    expect(coverageRequirements.pages).toBe(33);
    expect(coverageRequirements.mathLessons).toBe(34);
    expect(deferredCoveragePartitions).not.toContain('mathLessons');
    expect(coverageRequirements.externalResources).toBe(456);
    expect(coverageRequirements.dailyIssues).toBe(30);
    expect(coverageRequirements.labs).toBe(15);
    expect(deferredCoveragePartitions).toEqual([]);
  });

  it('locks the exact public video IDs independently of the lesson registry', () => {
    expect(requiredAiYoutubeIds).toEqual([
      'kvGsIo1TmsM', '9vKqVkMQHKk', 'fNk_zzaMoSs', 'vp2oUoBDH4w', '5H4crNlLK_A',
      '_MaVzNUjMPk', 'lAq96T8FkTw', 'QtlDV2r1ryE', 'TjHH_--7l8g', 'L94MdLdP21s',
      'yXbF-1n9wxs', 'O2yAMJu8LpI', 'oYIBwbHM_PI', 'bu5dhaLmr7E', 'enPFr-WxHgQ',
      'P9zzUM0PrBM',
    ]);
  });
});
