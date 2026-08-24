'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { catalog } from '../../content/catalog';
import { searchCatalog } from '../../lib/search/searchCatalog';
import styles from './SearchPageClient.module.css';

export function SearchPageClient() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchCatalog(query, catalog, 40), [query]);

  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.header}>
        <h1>Search openFanout</h1>
        <p>Find a local lesson, paper, lab, directory, or learning resource.</p>
      </header>
      <label className={styles.searchField}>
        <Search size={18} aria-hidden="true" />
        <input
          autoFocus
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “reinforcement learning” or “CUDA”"
          aria-label="Search the openFanout catalog"
        />
      </label>
      {results.length > 0 ? (
        <section className={styles.results} aria-label="Search results">
          {results.map((record) => (
            <Link className={styles.result} href={record.route} key={record.id}>
              <small>{record.kind} · {record.section}</small>
              <strong>{record.title}</strong>
              <p>{record.summary}</p>
            </Link>
          ))}
        </section>
      ) : (
        <p className={styles.empty}>{query ? 'No local records match this search yet.' : 'Start typing to explore the library.'}</p>
      )}
    </main>
  );
}
