import snapshot from './external-resources.json';
import auditedLinks from './audited-resource-links.json';
import type { CatalogRecord } from './schema';

export interface ExternalResourceRecord extends CatalogRecord {
  kind: 'resource' | 'company';
  externalUrl: string;
  sourcePage: string;
  pageTitle: string;
  metadata?: Record<string, string>;
  details?: string[];
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

interface ExternalResourceSnapshot {
  pages: Array<{ route: string; title: string; description: string; count: number }>;
  records: ExternalResourceRecord[];
}

const publicSnapshot = snapshot as unknown as ExternalResourceSnapshot;
const sourcePages = new Map(publicSnapshot.pages.map((page) => [page.route, page]));

// Destinations observed in the September 7 browser audit. Labels below are
// concise directory labels, not copied source descriptions or fresh link checks.
const auditedResources: ExternalResourceRecord[] = auditedLinks.map((link) => {
  const slug = `audit-${link.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
  return {
    id: `resource-${link.page.split('/').at(-1)}-${slug}`,
    slug, title: link.title, kind: 'resource', workspace: 'ai',
    section: link.section ?? 'Additional resources', route: `${link.page}#${slug}` as `/${string}`,
    sourceUrl: link.url, externalUrl: link.url, sourcePage: link.page,
    pageTitle: link.pageTitle, provenanceCheckedAt: '2026-09-07',
    tags: [link.pageTitle],
  };
});

export const externalResources = [...publicSnapshot.records, ...auditedResources];

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
      description: sourcePages.get(record.sourcePage)?.description ?? '',
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
