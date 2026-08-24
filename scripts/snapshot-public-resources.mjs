import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const pages = [
  ['/ai/resources', 'Resource library'],
  ['/ai/community', 'Communities'],
  ['/study-with-me', 'Study with me'],
  ['/ai/articles', 'Articles'],
  ['/ai/blogs', 'Blogs'],
  ['/ai/tools', 'Tools'],
  ['/ai/newsletters', 'Newsletters'],
  ['/ai/guides', 'Guides'],
  ['/ai/papers', 'Research papers'],
  ['/ai/jobs', 'Jobs'],
  ['/ai/misc', 'Miscellany'],
  ['/companies', 'Companies and startups'],
  ['/ai/deep-learning', 'Deep learning'],
  ['/ai/machine-learning', 'Machine learning'],
  ['/ai/reinforcement-learning', 'Reinforcement learning'],
  ['/ai/gpu', 'GPU and CUDA'],
];

function slugify(value) {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64);
}

const recordsByUrl = new Map();

for (const [sourcePage, pageTitle] of pages) {
  const response = await fetch(`https://fanout.sh${sourcePage}.md`);
  if (!response.ok) throw new Error(`Failed ${sourcePage}.md: ${response.status}`);
  const markdown = await response.text();
  let section = 'Featured';

  for (const line of markdown.split('\n')) {
    const sectionMatch = line.match(/^## (?!\[)(.+)$/);
    if (sectionMatch) section = sectionMatch[1].trim();

    const linkMatch = line.match(/^#{2,4} \[([^\]]+)\]\(([^)]+)\)$/);
    if (!linkMatch) continue;
    const [, title, externalUrl] = linkMatch;
    if (!/^https?:\/\//.test(externalUrl) || recordsByUrl.has(externalUrl)) continue;

    const digest = createHash('sha1').update(externalUrl).digest('hex').slice(0, 9);
    const slug = `${slugify(title)}-${digest}`;
    recordsByUrl.set(externalUrl, {
      id: `resource-${digest}`,
      slug,
      title,
      kind: sourcePage === '/companies' ? 'company' : 'resource',
      workspace: sourcePage === '/study-with-me' || sourcePage === '/companies' ? 'global' : 'ai',
      section,
      route: `${sourcePage}#${slug}`,
      sourceUrl: externalUrl,
      provenanceCheckedAt: '2026-08-24',
      externalUrl,
      summary: `A public ${section.toLocaleLowerCase()} reference filed under ${pageTitle}.`,
      tags: [pageTitle, section],
      sourcePage,
      pageTitle,
    });
  }
}

const records = [...recordsByUrl.values()];
if (records.length !== 422) throw new Error(`Expected 422 unique public directory links, received ${records.length}`);

const outputPath = resolve('src/content/external-resources.json');
await writeFile(outputPath, `${JSON.stringify({ checkedAt: '2026-08-24', records }, null, 2)}\n`);
console.log(`Wrote ${records.length} records to ${outputPath}`);
