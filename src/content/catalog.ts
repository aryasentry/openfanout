import type { CatalogRecord } from './schema';
import { aiLessons } from './ai-lessons';
import { mathLessons } from './math-lessons';
import { fullMathTopics } from './local-course-topics';
import courseSourceIndex from './course-source-index.json';
import { dailyPapers } from './daily-papers';
import { allExternalResources } from './external-resources';
import { labs } from './labs';
import { aiNavigation, mathNavigation } from './navigation';
import glossary from './glossary-terms.json';

const summaries: Record<string, { summary: string; tags?: string[] }> = {
  '/ai/overview': { summary: 'A guided path through the complete AI curriculum.', tags: ['curriculum', 'lessons'] },
  '/ai/resources': { summary: 'Books, courses, tools, and references for practical AI work.', tags: ['library'] },
  '/ai/community': { summary: 'Communities and learning groups for researchers and builders.', tags: ['people'] },
  '/study-with-me': { summary: 'Focused sessions and ambient study companions.', tags: ['video', 'focus'] },
  '/ai/papers': { summary: 'Research-paper collections spanning modern machine learning.', tags: ['research'] },
  '/ai/gpu': { summary: 'GPU architecture, CUDA, kernels, and performance references.', tags: ['hardware', 'cuda'] },
  '/ai/reinforcement-learning': { summary: 'Agents, policies, environments, and optimization resources.', tags: ['agents', 'policy'] },
  '/ml-math/overview': { summary: 'A 12-topic map of mathematics for machine learning.', tags: ['mathematics', 'curriculum'] },
  '/ml-math/decoder': { summary: 'Decode mathematical symbols and expressions into plain language.', tags: ['mathematics', 'interactive'] },
  '/ml-math/resources': { summary: 'Open books, notes, and practice references for machine-learning mathematics.', tags: ['mathematics', 'library'] },
};

const pageNavigation = [...aiNavigation, ...mathNavigation];

// Anchor navigation targets an existing page, not a separate catalog record.
export const pageCatalog: CatalogRecord[] = pageNavigation.flatMap((group) => group.items.filter(item => !item.href.includes('#')).map((item) => {
  const slug = item.href.split('/').filter(Boolean).at(-1) ?? 'overview';
  const metadata = summaries[item.href] ?? {
    summary: `Open learning references for ${item.label.toLocaleLowerCase()}.`,
  };
  return {
    id: `page-${item.href.replace(/^\//, '').replaceAll('/', '-')}`,
    slug,
    title: item.label,
    kind: 'page' as const,
    workspace: item.href.startsWith('/ai/') ? 'ai' as const : item.href.startsWith('/ml-math/') ? 'ml-math' as const : 'global' as const,
    section: group.id,
    route: item.href,
    sourceUrl: item.href === '/courses' ? 'https://fanout.sh/#course-directory' : `https://fanout.sh${item.href}`,
    provenanceCheckedAt: item.href === '/courses' || item.href === '/system/overview' ? '2026-09-06' : '2026-08-24',
    ...metadata,
  };
}));

export const dailyArchiveCatalog: CatalogRecord = {
  id: 'page-daily',
  slug: 'daily',
  title: 'Daily paper archive',
  kind: 'page',
  workspace: 'daily',
  section: 'daily-workspace',
  route: '/daily',
  sourceUrl: 'https://fanout.sh/daily',
  provenanceCheckedAt: '2026-08-24',
  summary: 'Thirty source-linked daily paper readings across AI and systems.',
  tags: ['papers', 'archive'],
};

export const labsCatalogPage: CatalogRecord = {
  id: 'page-labs', slug: 'labs', title: 'Interactive labs', kind: 'page', workspace: 'labs', section: 'labs-workspace', route: '/labs',
  sourceUrl: 'https://fanout.sh/labs', provenanceCheckedAt: '2026-08-24',
  summary: 'Fifteen local technical simulators with editable inputs and deterministic outputs.', tags: ['interactive', 'simulators'],
};

const mathRecordsByRoute = new Map(mathLessons.map(lesson => [lesson.route, lesson]));

// Navigation and search cover the same topics, even when written notes are pending.
const mathSearchRecords: CatalogRecord[] = fullMathTopics.map(topic =>
  mathRecordsByRoute.get(topic.route as `/${string}`) ?? {
    id: `math-topic-${topic.slug}`,
    slug: topic.slug,
    title: topic.title,
    kind: 'lesson',
    workspace: 'ml-math',
    section: topic.moduleId,
    route: topic.route as `/${string}`,
    sourceUrl: topic.sourceUrl,
    provenanceCheckedAt: courseSourceIndex.capturedAt,
    summary: `${topic.moduleTitle}. ${topic.videoAvailable ? 'Video available. Written notes pending.' : 'Lesson content pending.'}`,
    tags: ['mathematics', topic.moduleTitle, ...(topic.videoAvailable ? ['video'] : [])],
  },
);

export const catalog: CatalogRecord[] = [
  ...pageCatalog,
  dailyArchiveCatalog,
  labsCatalogPage,
  ...aiLessons,
  ...mathSearchRecords,
  ...glossary.terms.map((term): CatalogRecord => ({
    id: term.id, slug: term.id, title: term.term, kind: 'glossary', workspace: 'ai',
    section: term.category, route: `/ai/glossary#${term.id}`,
    sourceUrl: 'https://fanout.sh/ai/glossary', provenanceCheckedAt: glossary.checkedAt,
    summary: term.definition, tags: ['glossary', term.category],
  })),
  ...allExternalResources,
  ...dailyPapers,
  ...labs,
];
