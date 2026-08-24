import type { CatalogRecord } from '../../content/schema';

function normalized(value: string | undefined) {
  return (value ?? '').normalize('NFKC').toLocaleLowerCase();
}

function scoreRecord(needle: string, record: CatalogRecord) {
  const title = normalized(record.title);
  const section = normalized(record.section);
  const tags = record.tags?.map(normalized) ?? [];
  const summary = normalized(record.summary);

  if (title === needle) return 100;
  if (title.startsWith(needle)) return 70;
  if (title.includes(needle)) return 50;
  if (tags.some((tag) => tag.includes(needle))) return 30;
  if (section.includes(needle)) return 20;
  if (summary.includes(needle)) return 10;
  return 0;
}

export function searchCatalog(
  query: string,
  records: readonly CatalogRecord[],
  limit = 20,
): CatalogRecord[] {
  const needle = normalized(query.trim());
  if (!needle) return [];

  return records
    .map((record) => ({ record, score: scoreRecord(needle, record) }))
    .filter((result) => result.score > 0 && result.record.route.startsWith('/'))
    .sort((left, right) => right.score - left.score || left.record.title.localeCompare(right.record.title))
    .slice(0, limit)
    .map((result) => result.record);
}
