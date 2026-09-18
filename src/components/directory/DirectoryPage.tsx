'use client';

import { ArrowUpRight, Search } from 'lucide-react';
import { useCallback, useId, useMemo, useState } from 'react';
import { useAnchorReveal } from '../../lib/search/anchorNavigation';
import type { DirectoryPageRecord } from '../../content/external-resources';
import styles from './DirectoryPage.module.css';

export function DirectoryPage({ page }: { page: DirectoryPageRecord }) {
  if (page.route !== '/ai/community') return <DirectoryPanel key={page.route} page={page} />;

  const labels: Record<string, string> = {
    'Researchers & Scientists': 'Researchers', 'Educators & Creators': 'Educators',
    'Builders & Engineers': 'Builders', 'Leaders & Thinkers': 'Leaders',
    twitter: 'X', discord: 'Discord', reddit: 'Reddit',
  };
  const groups = [
    { title: 'Who to follow on X', records: page.records.filter((record) => record.section === 'People to follow') },
    { title: 'AI research organizations', records: page.records.filter((record) => !['People to follow', 'Community servers'].includes(record.section)) },
    { title: 'Twitter, Discord & Reddit communities', records: page.records.filter((record) => record.section === 'Community servers') },
  ];
  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.hero}><div className={styles.titleRow}><div><h1>{page.title}</h1><p>{page.description}</p></div></div></header>
      {groups.map((group) => {
        const sections: DirectoryPageRecord['sections'] = [];
        for (const record of group.records) {
          const category = record.metadata?.Category ?? record.metadata?.Platform ?? record.section;
          const title = labels[category] ?? category;
          let section = sections.find((candidate) => candidate.title === title);
          if (!section) { section = { title, records: [] }; sections.push(section); }
          section.records.push(record);
        }
        return <DirectoryPanel key={group.title} embedded page={{ ...page, title: group.title, description: '', records: group.records, sections }} />;
      })}
    </main>
  );
}

function DirectoryPanel({ page, embedded = false }: { page: DirectoryPageRecord; embedded?: boolean }) {
  const panelId = useId();
  const Container = embedded ? 'section' : 'main';
  const Heading = embedded ? 'h2' : 'h1';
  const SectionHeading = embedded ? 'h3' : 'h2';
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  useAnchorReveal(useCallback((id: string) => {
    if (!page.records.some((record) => record.slug === id)) return false;
    setQuery(''); setCategory(null);
    return true;
  }, [page.records]));
  const normalized = query.trim().toLocaleLowerCase();
  const sections = useMemo(() => page.sections
    .filter((section) => category === null || section.title === category)
    .map((section) => ({
      ...section,
      records: section.records.filter((record) => !normalized || [record.title, record.section, record.summary, record.externalUrl, ...Object.values(record.metadata ?? {}), ...(record.details ?? []), ...(record.tags ?? [])]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalized)),
    }))
    .filter((section) => section.records.length > 0), [normalized, category, page.sections]);
  const visibleCount = sections.reduce((count, section) => count + section.records.length, 0);

  return (
    <Container id={embedded ? undefined : 'main-content'} aria-label={embedded ? page.title : undefined} className={embedded ? styles.embedded : styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Curated directory</p>
        <div className={styles.titleRow}>
          <div><Heading>{page.title}</Heading>{page.description ? <p>{page.description}</p> : null}</div>
          <span><strong>{page.records.length}</strong> public links</span>
        </div>
        <label className={styles.filter}>
          <Search size={16} aria-hidden="true" />
          <span className={styles.srOnly}>Filter {page.title}</span>
          <input type="search" aria-label={`Filter ${page.title}`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Filter ${page.title.toLocaleLowerCase()}…`} />
          <small>{visibleCount}</small>
        </label>
        <div className={styles.categories} role="group" aria-label="Resource categories">
          <button type="button" aria-pressed={category === null} onClick={() => setCategory(null)}>All</button>
          {page.sections.map((section) => (
            <button type="button" key={section.title} aria-pressed={category === section.title} onClick={() => setCategory(section.title)}>
              {page.route === '/ai/resources' && section.title === 'Learning platforms' ? 'Platforms' : section.title}
            </button>
          ))}
        </div>
        <p className={styles.resultCount} role="status">{visibleCount} of {page.records.length} references</p>
      </header>

      {sections.length ? sections.map((section, sectionIndex) => (
        <section className={styles.section} key={section.title} aria-labelledby={`${panelId}-${sectionIndex}`}>
          <header><span>{String(sectionIndex + 1).padStart(2, '0')}</span><SectionHeading id={`${panelId}-${sectionIndex}`}>{section.title}</SectionHeading><small>{section.records.length}</small></header>
          <div className={styles.grid}>
            {section.records.map((record) => (
              <a id={record.slug} data-testid="directory-resource" href={record.externalUrl} target="_blank" rel="noreferrer noopener" key={record.id}>
                <span className={styles.monogram} aria-hidden="true">{record.title.slice(0, 2).toLocaleUpperCase()}</span>
                <span className={styles.copy}>
                  <strong>{record.title}</strong>
                  {Object.keys(record.metadata ?? {}).length > 0 || (record.details?.length ?? 0) > 0 ? (
                    <span className={styles.metadata}>{[...Object.values(record.metadata ?? {}), ...(record.details ?? [])].join(' · ')}</span>
                  ) : null}
                  {record.summary ? <small>{record.summary}</small> : null}
                  <code>{record.externalUrl}</code>
                </span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        </section>
      )) : (
        <section className={styles.empty}><h2>No matching references</h2><p>Try a broader topic, tool name, author, or organization.</p><button type="button" onClick={() => { setQuery(''); setCategory(null); }}>Clear filters</button></section>
      )}
    </Container>
  );
}
