import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const sitemap = await (await fetch('https://fanout.sh/sitemap.md')).text();
const entries = [...sitemap.matchAll(/^- \[([^\]]+)\]\((https:\/\/fanout\.sh\/daily\/([^)]+))\.md\):/gm)]
  .map((match) => ({ title: match[1], sourceUrl: match[2], slug: match[3] }))
  .slice(-30);

function metadata(markdown, label) {
  return markdown.match(new RegExp(`^- ${label}: (.+)$`, 'm'))?.[1]?.trim() ?? 'Not specified';
}

const records = [];
for (const [index, entry] of entries.entries()) {
  const markdown = await (await fetch(`${entry.sourceUrl}.md`)).text();
  const originalPaper = metadata(markdown, 'Original paper');
  if (!/^https?:\/\//.test(originalPaper)) throw new Error(`Missing original paper for ${entry.slug}`);
  records.push({
    id: `daily-${entry.slug}`,
    slug: entry.slug,
    title: entry.title,
    kind: 'paper',
    workspace: 'daily',
    section: entry.slug.slice(0, 7),
    route: `/daily/${entry.slug}`,
    sourceUrl: entry.sourceUrl,
    provenanceCheckedAt: '2026-08-24',
    externalUrl: originalPaper,
    summary: `A guided openFanout reading of ${entry.title}, focused on the paper's mechanism, evidence, engineering consequences, and limits.`,
    tags: [metadata(markdown, 'Track'), metadata(markdown, 'Difficulty')],
    authors: metadata(markdown, 'Authors'),
    venue: metadata(markdown, 'Venue'),
    track: metadata(markdown, 'Track'),
    difficulty: metadata(markdown, 'Difficulty'),
    readingTime: metadata(markdown, 'Reading time'),
    order: index + 1,
  });
}

if (records.length !== 30) throw new Error(`Expected 30 daily records, received ${records.length}`);
await writeFile(resolve('src/content/daily-papers.json'), `${JSON.stringify({ checkedAt: '2026-08-24', records }, null, 2)}\n`);
console.log(`Wrote ${records.length} daily paper records`);
