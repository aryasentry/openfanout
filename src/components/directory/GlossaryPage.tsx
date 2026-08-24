'use client';

import { useMemo, useState } from 'react';
import termsSnapshot from '../../content/glossary-terms.json';
import styles from './EditorialPage.module.css';

export function GlossaryPage() {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLocaleLowerCase();
  const terms = useMemo(() => termsSnapshot.terms.filter((term) => !normalized || `${term.term} ${term.category}`.toLocaleLowerCase().includes(normalized)), [normalized]);
  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.hero}><p>Reference index</p><h1>AI glossary, in plain English</h1><span>192 observed AI and machine-learning terms, grouped by their technical role and explained with independently written local copy.</span></header>
      <label className={styles.glossarySearch}>Filter terms<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try attention, deployment, optimizer…" /><small>{terms.length}</small></label>
      <div className={styles.glossaryGrid}>
        {terms.map((term) => <article data-testid="glossary-term" key={term.id}><span>{term.category}</span><h2>{term.term}</h2><p>{term.definition}</p></article>)}
      </div>
    </main>
  );
}
