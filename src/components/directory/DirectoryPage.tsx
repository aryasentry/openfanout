'use client';

import { ArrowUpRight, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { DirectoryPageRecord } from '../../content/external-resources';
import styles from './DirectoryPage.module.css';

export function DirectoryPage({ page }: { page: DirectoryPageRecord }) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase();
  const sections = useMemo(() => page.sections
    .map((section) => ({
      ...section,
      records: section.records.filter((record) => !normalized || [record.title, record.section, record.summary, record.externalUrl, ...Object.values(record.metadata ?? {}), ...(record.details ?? []), ...(record.tags ?? [])]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalized)),
    }))
    .filter((section) => section.records.length > 0), [normalized, page.sections]);
  const visibleCount = sections.reduce((count, section) => count + section.records.length, 0);

  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Curated directory</p>
        <div className={styles.titleRow}>
          <div><h1>{page.title}</h1><p>{page.description}</p></div>
          <span><strong>{page.records.length}</strong> public links</span>
        </div>
        <label className={styles.filter}>
          <Search size={16} aria-hidden="true" />
          <span className={styles.srOnly}>Filter {page.title}</span>
          <input type="search" aria-label={`Filter ${page.title}`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Filter ${page.title.toLocaleLowerCase()}…`} />
          <small>{visibleCount}</small>
        </label>
      </header>

      {sections.length ? sections.map((section, sectionIndex) => (
        <section className={styles.section} key={section.title} aria-labelledby={`directory-${sectionIndex}`}>
          <header><span>{String(sectionIndex + 1).padStart(2, '0')}</span><h2 id={`directory-${sectionIndex}`}>{section.title}</h2><small>{section.records.length}</small></header>
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
        <section className={styles.empty}><h2>No matching references</h2><p>Try a broader topic, tool name, author, or organization.</p></section>
      )}
    </main>
  );
}
