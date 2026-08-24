import { describe, expect, it } from 'vitest';
import { aiLessons } from './ai-lessons';
import {
  coverageRequirements,
  deferredCoveragePartitions,
  requiredAiYoutubeIds,
  sourceInventory,
} from './source-inventory';

describe('composed source inventory', () => {
  it('maps every AI lesson record in addition to the 26 foundation pages', () => {
    expect(sourceInventory).toHaveLength(134);
    const inventoryIds = new Set(sourceInventory.map((record) => record.localId));
    expect(aiLessons.every((lesson) => inventoryIds.has(lesson.id))).toBe(true);
  });

  it('closes AI lesson partitions while leaving later slices explicit', () => {
    expect(coverageRequirements.aiLessons).toBe(108);
    expect(coverageRequirements.aiYoutubeLessons).toBe(16);
    expect(deferredCoveragePartitions).not.toContain('aiLessons');
    expect(deferredCoveragePartitions).not.toContain('aiYoutubeLessons');
    expect(deferredCoveragePartitions).toEqual([
      'externalResources',
      'mathLessons',
      'labs',
      'dailyIssues',
    ]);
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
