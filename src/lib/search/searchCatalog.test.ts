import { describe, expect, it } from 'vitest';
import type { CatalogRecord } from '../../content/schema';
import { searchCatalog } from './searchCatalog';

const records: CatalogRecord[] = [
  {
    id: 'rl',
    slug: 'reinforcement-learning',
    title: 'Reinforcement Learning',
    kind: 'page',
    workspace: 'ai',
    section: 'domains',
    route: '/ai/reinforcement-learning',
    sourceUrl: 'https://fanout.sh/ai/reinforcement-learning',
    provenanceCheckedAt: '2026-08-24',
    tags: ['agents'],
  },
  {
    id: 'agents',
    slug: 'agent-control-room',
    title: 'Agent Control Room',
    kind: 'lab',
    workspace: 'labs',
    section: 'labs',
    route: '/labs/agent-control-room',
    sourceUrl: 'https://fanout.sh/labs/agent-control-room',
    provenanceCheckedAt: '2026-08-24',
    tags: ['reinforcement learning'],
  },
];

describe('searchCatalog', () => {
  it('ranks exact titles before tag matches and returns local routes', () => {
    expect(searchCatalog('reinforcement learning', records, 10).map((record) => record.route)).toEqual([
      '/ai/reinforcement-learning',
      '/labs/agent-control-room',
    ]);
  });

  it('matches title prefixes and summaries without depending on case', () => {
    const withSummary = records.map((record) => (
      record.id === 'agents' ? { ...record, summary: 'Inspect a policy in motion.' } : record
    ));
    expect(searchCatalog('POLICY', withSummary).map((record) => record.id)).toEqual(['agents']);
    expect(searchCatalog('agent', withSummary).map((record) => record.id)).toEqual(['agents', 'rl']);
  });
});
