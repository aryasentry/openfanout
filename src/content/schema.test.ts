import { describe, expect, it } from 'vitest';
import { validateCatalog, type CatalogRecord } from './schema';

describe('validateCatalog', () => {
  it('rejects duplicate ids, duplicate local routes, and forbidden Fanout destinations', () => {
    const records: CatalogRecord[] = [
      {
        id: 'one',
        slug: 'one',
        title: 'One',
        kind: 'resource',
        workspace: 'ai',
        section: 'tools',
        route: '/ai/tools/one',
        sourceUrl: 'https://fanout.sh/ai/tools',
        provenanceCheckedAt: '2026-08-24',
      },
      {
        id: 'one',
        slug: 'two',
        title: 'Two',
        kind: 'resource',
        workspace: 'ai',
        section: 'tools',
        route: '/ai/tools/one',
        sourceUrl: 'https://fanout.sh/pricing',
        provenanceCheckedAt: '2026-08-24',
      },
    ];

    expect(validateCatalog(records)).toEqual([
      'duplicate id: one',
      'duplicate route: /ai/tools/one',
      'forbidden Fanout destination: https://fanout.sh/pricing',
    ]);
  });
});
