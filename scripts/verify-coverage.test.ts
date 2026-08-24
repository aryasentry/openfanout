import { describe, expect, it } from 'vitest';
import type { CatalogRecord, NavigationGroup, SourceInventoryRecord } from '../src/content/schema';
import { verifyCoverage } from './verify-coverage';

describe('verifyCoverage', () => {
  it('reports unmatched source records and forbidden UI labels', () => {
    const navigation: NavigationGroup[] = [
      {
        id: 'bad',
        label: 'Workspace',
        items: [{ label: 'Pricing', href: '/pricing', icon: 'Lock' }],
      },
    ];
    const inventory: SourceInventoryRecord[] = [
      {
        sourceUrl: 'https://example.com/paper',
        localId: 'paper-1',
        kind: 'paper',
        checkedAt: '2026-08-24',
      },
    ];

    expect(verifyCoverage({ catalog: [], inventory, navigation }).errors).toEqual([
      'inventory localId missing from catalog: paper-1',
      'forbidden navigation label: Pricing',
      'forbidden navigation route: /pricing',
      'navigation route missing from catalog: /pricing',
    ]);
  });

  it('reports duplicate inventory URLs and count mismatches', () => {
    const catalog: CatalogRecord[] = [
      {
        id: 'lab-one',
        slug: 'one',
        title: 'One lab',
        kind: 'lab',
        workspace: 'labs',
        section: 'labs',
        route: '/labs/one',
        sourceUrl: 'https://fanout.sh/labs/one',
        provenanceCheckedAt: '2026-08-24',
      },
    ];
    const inventory: SourceInventoryRecord[] = [
      { sourceUrl: 'https://fanout.sh/labs/one', localId: 'lab-one', kind: 'lab', checkedAt: '2026-08-24' },
      { sourceUrl: 'https://fanout.sh/labs/one', localId: 'lab-one', kind: 'lab', checkedAt: '2026-08-24' },
    ];

    expect(verifyCoverage({
      catalog,
      inventory,
      navigation: [],
      requirements: { labs: 15 },
    }).errors).toEqual([
      'duplicate inventory URL: https://fanout.sh/labs/one',
      'count mismatch for labs: expected 15, received 1',
    ]);
  });

  it('accepts matched local records and reports explicitly deferred partitions', () => {
    const catalog: CatalogRecord[] = [
      {
        id: 'overview',
        slug: 'overview',
        title: 'Overview',
        kind: 'page',
        workspace: 'ai',
        section: 'workspace',
        route: '/ai/overview',
        sourceUrl: 'https://fanout.sh/ai/overview',
        provenanceCheckedAt: '2026-08-24',
      },
    ];
    const inventory: SourceInventoryRecord[] = [
      { sourceUrl: 'https://fanout.sh/ai/overview', localId: 'overview', kind: 'page', checkedAt: '2026-08-24' },
    ];

    const result = verifyCoverage({
      catalog,
      inventory,
      navigation: [],
      requirements: { aiLessons: 108 },
      deferredPartitions: ['aiLessons'],
    });

    expect(result.errors).toEqual([]);
    expect(result.deferred).toEqual(['aiLessons: expected 108, currently 0']);
  });
});
