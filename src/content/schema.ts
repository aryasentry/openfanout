export type Workspace = 'global' | 'ai' | 'ml-math' | 'labs' | 'daily';

export type CatalogKind =
  | 'page'
  | 'resource'
  | 'lesson'
  | 'paper'
  | 'lab'
  | 'company'
  | 'glossary';

export interface CatalogRecord {
  id: string;
  slug: string;
  title: string;
  kind: CatalogKind;
  workspace: Workspace;
  section: string;
  route: `/${string}`;
  sourceUrl: string;
  provenanceCheckedAt: string;
  externalUrl?: string;
  summary?: string;
  tags?: string[];
}

export interface LessonNote {
  heading?: string;
  body: string;
}

export interface LessonRecord extends CatalogRecord {
  kind: 'lesson';
  moduleId: string;
  order: number;
  youtubeEmbedUrl?: string;
  contentOrigin?: 'fanout-public' | 'user-provided' | 'fanout-overview';
  notes: LessonNote[];
}

export interface CurriculumModule {
  id: string;
  index: number;
  title: string;
  description: string;
  lessonIds: string[];
}

export interface NavigationItem {
  label: string;
  href: `/${string}`;
  icon: string;
}

export interface NavigationGroup {
  id: string;
  label: string;
  items: NavigationItem[];
}

export interface SourceInventoryRecord {
  sourceUrl: string;
  localId: string;
  kind: CatalogKind;
  checkedAt: string;
}

export function validateCatalog(records: readonly CatalogRecord[]): string[] {
  const ids = new Set<string>();
  const routes = new Set<string>();
  const errors: string[] = [];

  for (const record of records) {
    if (ids.has(record.id)) {
      errors.push(`duplicate id: ${record.id}`);
    }
    if (routes.has(record.route)) {
      errors.push(`duplicate route: ${record.route}`);
    }
    if (/^https:\/\/fanout\.sh\/(pricing|account|login)(?:[/?#]|$)/.test(record.sourceUrl)) {
      errors.push(`forbidden Fanout destination: ${record.sourceUrl}`);
    }
    ids.add(record.id);
    routes.add(record.route);
  }

  return errors;
}
