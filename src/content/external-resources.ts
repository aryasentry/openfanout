import snapshot from './external-resources.json';
import type { CatalogRecord } from './schema';

export interface ExternalResourceRecord extends CatalogRecord {
  kind: 'resource' | 'company';
  externalUrl: string;
  sourcePage: string;
  pageTitle: string;
}

export interface DirectorySection {
  title: string;
  records: ExternalResourceRecord[];
}

export interface DirectoryPageRecord {
  route: string;
  title: string;
  description: string;
  records: ExternalResourceRecord[];
  sections: DirectorySection[];
}

const pageDescriptions: Record<string, string> = {
  '/ai/resources': 'Books, courses, playlists, and channels for building durable AI foundations.',
  '/ai/community': 'Active groups and organizations where serious learners compare notes and build together.',
  '/study-with-me': 'A focused ambient study companion for quiet working sessions.',
  '/ai/articles': 'Long-form technical writing selected for clarity, depth, and practical research value.',
  '/ai/blogs': 'Researcher and lab writing that exposes how modern machine-learning systems are developed.',
  '/ai/tools': 'A compact working stack for experiments, data, evaluation, and reproducible research.',
  '/ai/newsletters': 'High-signal digests for research results, engineering practice, and industry movement.',
  '/ai/guides': 'Hands-on references for common research and model-building workflows.',
  '/ai/papers': 'A small foundational reading sequence for modern machine learning.',
  '/ai/jobs': 'Public destinations for current research and machine-learning opportunities.',
  '/ai/misc': 'Useful talks, tools, archives, and technical rabbit holes that resist a single category.',
  '/companies': 'Labs and startups shaping models, infrastructure, data, evaluation, and applied AI.',
  '/ai/deep-learning': 'Courses, books, implementations, and lectures from neural-network basics to current architectures.',
  '/ai/machine-learning': 'Classical learning theory, practical algorithms, and reliable implementation references.',
  '/ai/reinforcement-learning': 'Courses and papers covering agents, value functions, policies, and learning from feedback.',
  '/ai/gpu': 'CUDA, Triton, architecture, profiling, and distributed-compute references for faster models.',
};

export const externalResources = snapshot.records as ExternalResourceRecord[];

export const supplementalMathResources: ExternalResourceRecord[] = [
  {
    id: 'resource-seeing-theory', slug: 'seeing-theory', title: 'Seeing Theory', kind: 'resource', workspace: 'ml-math', section: 'Visual intuition',
    route: '/ml-math/resources#seeing-theory', sourceUrl: 'https://seeing-theory.brown.edu/', provenanceCheckedAt: '2026-08-24', externalUrl: 'https://seeing-theory.brown.edu/',
    summary: 'An interactive visual reference for probability and statistics.', tags: ['Mathematics resources', 'Visual intuition'], sourcePage: '/ml-math/resources', pageTitle: 'Mathematics resources',
  },
  {
    id: 'resource-openstax-statistics', slug: 'openstax-statistics', title: 'OpenStax Introductory Statistics', kind: 'resource', workspace: 'ml-math', section: 'Probability and inference',
    route: '/ml-math/resources#openstax-statistics', sourceUrl: 'https://openstax.org/details/books/introductory-statistics-2e', provenanceCheckedAt: '2026-08-24', externalUrl: 'https://openstax.org/details/books/introductory-statistics-2e',
    summary: 'A complete open textbook with examples and exercises in statistics.', tags: ['Mathematics resources', 'Probability'], sourcePage: '/ml-math/resources', pageTitle: 'Mathematics resources',
  },
  {
    id: 'resource-harvard-stat-110', slug: 'harvard-stat-110', title: 'Harvard Stat 110', kind: 'resource', workspace: 'ml-math', section: 'Probability and inference',
    route: '/ml-math/resources#harvard-stat-110', sourceUrl: 'https://stat110.hsites.harvard.edu/', provenanceCheckedAt: '2026-08-24', externalUrl: 'https://stat110.hsites.harvard.edu/',
    summary: 'A public probability course with lectures, notes, and practice.', tags: ['Mathematics resources', 'Probability'], sourcePage: '/ml-math/resources', pageTitle: 'Mathematics resources',
  },
];

export const allExternalResources = [...externalResources, ...supplementalMathResources];

export const directoryPages = new Map<string, DirectoryPageRecord>();

for (const record of externalResources) {
  let page = directoryPages.get(record.sourcePage);
  if (!page) {
    page = {
      route: record.sourcePage,
      title: record.pageTitle,
      description: pageDescriptions[record.sourcePage] ?? `Open public references organized for ${record.pageTitle.toLocaleLowerCase()}.`,
      records: [],
      sections: [],
    };
    directoryPages.set(record.sourcePage, page);
  }
  page.records.push(record);
  let section = page.sections.find((candidate) => candidate.title === record.section);
  if (!section) {
    section = { title: record.section, records: [] };
    page.sections.push(section);
  }
  section.records.push(record);
}
