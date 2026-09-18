import { describe, expect, it } from 'vitest';
import { catalog } from './catalog';
import { fullMathTopics } from './local-course-topics';
import { mathLessons } from './math-lessons';
import glossary from './glossary-terms.json';
import { searchCatalog } from '../lib/search/searchCatalog';

describe('glossary search coverage', () => {
  it('indexes all definitions with unique local anchor destinations', () => {
    const records = catalog.filter(record => record.kind === 'glossary');
    expect(records).toHaveLength(192);
    for (const term of glossary.terms) {
      expect(records.filter(record => record.route === `/ai/glossary#${term.id}`)).toHaveLength(1);
      expect(searchCatalog(term.term, catalog, catalog.length).some(record => record.route === `/ai/glossary#${term.id}`)).toBe(true);
    }
    expect(searchCatalog('decouples', catalog)[0]?.title).toBe('AdamW');
  });
});

describe('complete mathematics search coverage', () => {
  it('finds video-only Matrix Gradients as a local lesson', () => {
    const result = searchCatalog('Matrix Gradients', catalog)[0];
    expect(result).toMatchObject({ title: 'Matrix Gradients', kind: 'lesson', workspace: 'ml-math' });
    expect(result?.route).toMatch(/^\/ml-math\/lessons\/calculus-matrix-gradients-/);
  });

  it('indexes every canonical math topic exactly once, including topics without notes', () => {
    const records = catalog.filter(record => record.workspace === 'ml-math' && record.kind === 'lesson');
    expect(records).toHaveLength(301);
    for (const topic of fullMathTopics) {
      expect(records.filter(record => record.route === topic.route)).toHaveLength(1);
      expect(searchCatalog(topic.title, catalog, catalog.length).some(record => record.route === topic.route)).toBe(true);
    }
  });

  it('preserves richer existing lesson metadata without duplicate search results', () => {
    for (const lesson of mathLessons) {
      expect(catalog.filter(record => record.route === lesson.route)).toEqual([lesson]);
    }
  });
});
