import snapshot from './daily-papers.json';
import type { CatalogRecord } from './schema';

export interface DailyPaperRecord extends CatalogRecord {
  kind: 'paper';
  workspace: 'daily';
  externalUrl: string;
  authors: string;
  venue: string;
  track: string;
  difficulty: string;
  readingTime: string;
  order: number;
}

export const dailyPapers = snapshot.records as DailyPaperRecord[];
export const dailyPaperBySlug = new Map(dailyPapers.map((paper) => [paper.slug, paper]));

export function getDailyPaperNeighbors(slug: string) {
  const index = dailyPapers.findIndex((paper) => paper.slug === slug);
  if (index < 0) return { previous: null, next: null };
  return { previous: dailyPapers[index - 1] ?? null, next: dailyPapers[index + 1] ?? null };
}

export const papersByMonth = dailyPapers.reduce<Map<string, DailyPaperRecord[]>>((months, paper) => {
  const month = paper.slug.slice(0, 7);
  months.set(month, [...(months.get(month) ?? []), paper]);
  return months;
}, new Map());
