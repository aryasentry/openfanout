import type { CatalogRecord } from './schema';
import { aiNavigation } from './navigation';

const summaries: Record<string, { summary: string; tags?: string[] }> = {
  '/ai/overview': { summary: 'A guided path through the complete AI curriculum.', tags: ['curriculum', 'lessons'] },
  '/ai/resources': { summary: 'Books, courses, tools, and references for practical AI work.', tags: ['library'] },
  '/ai/community': { summary: 'Communities and learning groups for researchers and builders.', tags: ['people'] },
  '/study-with-me': { summary: 'Focused sessions and ambient study companions.', tags: ['video', 'focus'] },
  '/ai/papers': { summary: 'Research-paper collections spanning modern machine learning.', tags: ['research'] },
  '/ai/gpu': { summary: 'GPU architecture, CUDA, kernels, and performance references.', tags: ['hardware', 'cuda'] },
  '/ai/reinforcement-learning': { summary: 'Agents, policies, environments, and optimization resources.', tags: ['agents', 'policy'] },
};

export const pageCatalog: CatalogRecord[] = aiNavigation.flatMap((group) => group.items.map((item) => {
  const slug = item.href.split('/').filter(Boolean).at(-1) ?? 'overview';
  const metadata = summaries[item.href] ?? {
    summary: `Open learning references for ${item.label.toLocaleLowerCase()}.`,
  };
  return {
    id: `page-${item.href.replace(/^\//, '').replaceAll('/', '-')}`,
    slug,
    title: item.label,
    kind: 'page' as const,
    workspace: item.href.startsWith('/ai/') ? 'ai' as const : 'global' as const,
    section: group.id,
    route: item.href,
    sourceUrl: `https://fanout.sh${item.href}`,
    provenanceCheckedAt: '2026-08-24',
    ...metadata,
  };
}));

export const catalog: CatalogRecord[] = [...pageCatalog];
