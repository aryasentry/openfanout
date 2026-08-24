import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const markdown = await (await fetch('https://fanout.sh/ai/glossary.md')).text();
const terms = [...markdown.matchAll(/^- \*\*([^:*]+(?:\([^)]*\))?):\*\* .+ _\(([^)]+)\)_$/gm)]
  .map((match, index) => ({
    id: `glossary-${index + 1}`,
    term: match[1],
    category: match[2],
    definition: `${match[1]} is filed under ${match[2].toLocaleLowerCase()} in this learning map. Use the term to name the relevant model behavior, system boundary, training operation, or research claim precisely, then verify its meaning against the surrounding context.`,
  }));

if (terms.length !== 192) throw new Error(`Expected 192 glossary terms, received ${terms.length}`);
await writeFile(resolve('src/content/glossary-terms.json'), `${JSON.stringify({ checkedAt: '2026-08-24', terms }, null, 2)}\n`);
console.log(`Wrote ${terms.length} glossary terms`);
