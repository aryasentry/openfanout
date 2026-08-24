import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const pages = [
  '/ai/resources',
  '/ai/community',
  '/study-with-me',
  '/ai/articles',
  '/ai/blogs',
  '/ai/tools',
  '/ai/newsletters',
  '/ai/guides',
  '/ai/papers',
  '/ai/jobs',
  '/ai/misc',
  '/companies',
  '/ai/deep-learning',
  '/ai/machine-learning',
  '/ai/reinforcement-learning',
  '/ai/gpu',
];

function slugify(value) {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

function frontmatterValue(markdown, key) {
  const match = markdown.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
  return match?.[1]?.trim() ?? '';
}

function parseEntry(lines, headingIndex) {
  const description = [];
  const metadata = {};
  const details = [];

  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();
    if (/^#{1,4}\s/.test(line) || line === '---') break;
    if (!line) continue;

    const metadataMatch = line.match(/^-\s+([^:]+):\s+(.+)$/);
    if (metadataMatch) {
      metadata[metadataMatch[1].trim()] = metadataMatch[2].trim();
    } else if (line.startsWith('- ')) {
      details.push(line.slice(2).trim());
    } else {
      description.push(line);
    }
  }

  return {
    summary: description.join(' ').trim(),
    metadata,
    details,
  };
}

const records = [];
const sourcePages = [];
const exactPlacements = new Set();

for (const sourcePage of pages) {
  const response = await fetch(`https://fanout.sh${sourcePage}.md`);
  if (!response.ok) throw new Error(`Failed ${sourcePage}.md: ${response.status}`);
  const markdown = await response.text();
  const pageTitle = frontmatterValue(markdown, 'title');
  const pageDescription = frontmatterValue(markdown, 'description');
  const lines = markdown.split('\n');
  let section = 'Featured';
  let count = 0;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    const sectionMatch = line.match(/^## (?!\[)(.+)$/);
    if (sectionMatch) section = sectionMatch[1].trim();

    const linkMatch = line.match(/^#{2,4} \[([^\]]+)\]\(([^)]+)\)$/);
    if (!linkMatch) continue;
    const [, title, sourceHref] = linkMatch;
    const externalUrl = /^https?:\/\//.test(sourceHref)
      ? sourceHref
      : new URL(sourceHref, 'https://fanout.sh').href;
    if (!/^https?:\/\//.test(externalUrl)) continue;

    const placementKey = `${sourcePage}|${title}|${externalUrl}`;
    if (exactPlacements.has(placementKey)) continue;
    exactPlacements.add(placementKey);

    const { summary, metadata, details } = parseEntry(lines, lineIndex);
    const digest = createHash('sha1').update(placementKey).digest('hex').slice(0, 9);
    const slug = `${slugify(title)}-${digest}`;
    records.push({
      id: `resource-${digest}`,
      slug,
      title,
      kind: sourcePage === '/companies' ? 'company' : 'resource',
      workspace: sourcePage === '/study-with-me' || sourcePage === '/companies' ? 'global' : 'ai',
      section,
      route: `${sourcePage}#${slug}`,
      sourceUrl: `https://fanout.sh${sourcePage}.md#${slug}`,
      provenanceCheckedAt: '2026-08-24',
      externalUrl,
      summary,
      metadata,
      details,
      tags: [pageTitle, section, ...Object.values(metadata), ...details],
      sourcePage,
      pageTitle,
    });
    count += 1;
  }

  sourcePages.push({ route: sourcePage, title: pageTitle, description: pageDescription, count });
}

if (records.length !== 430) throw new Error(`Expected 430 public directory placements, received ${records.length}`);
if (new Set(records.map((record) => record.externalUrl)).size !== 423) throw new Error('Public URL set drifted from the audited source snapshot');

const outputPath = resolve('src/content/external-resources.json');
await writeFile(outputPath, `${JSON.stringify({ checkedAt: '2026-08-24', pages: sourcePages, records }, null, 2)}\n`);
console.log(`Wrote ${records.length} source placements (${new Set(records.map((record) => record.externalUrl)).size} unique URLs) to ${outputPath}`);
