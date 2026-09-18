'use client';

import { useCallback, useMemo, useState } from 'react';
import { useAnchorReveal } from '../../lib/search/anchorNavigation';
import termsSnapshot from '../../content/glossary-terms.json';
import styles from './EditorialPage.module.css';

export function GlossaryPage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [letter, setLetter] = useState('All letters');
  useAnchorReveal(useCallback((id: string) => {
    if (!termsSnapshot.terms.some((term) => term.id === id)) return false;
    setQuery(''); setCategory('All'); setLetter('All letters');
    return true;
  }, []));
  const normalized = query.trim().toLocaleLowerCase();
  const terms = useMemo(() => termsSnapshot.terms.filter((term) =>
    (category === 'All' || term.category === category)
    && (letter === 'All letters' || term.term.toUpperCase().startsWith(letter))
    && (!normalized || `${term.term} ${term.category} ${term.definition}`.toLocaleLowerCase().includes(normalized)))
    .sort((a, b) => a.term.localeCompare(b.term)), [normalized, category, letter]);
  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.hero}><p>Reference index</p><h1>AI glossary, in plain English</h1><span>192 observed AI and machine-learning terms, grouped by their technical role and explained with independently written local copy.</span></header>
      <label className={styles.glossarySearch}>Filter terms<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try attention, deployment, optimizer…" /><small>{terms.length}</small></label>
      <div className={styles.glossaryFilters} role="group" aria-label="Term category">
        {['All', 'Fundamentals', 'Architecture', 'Training', 'Deployment', 'Research'].map((item) => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <div className={styles.glossaryFilters} role="group" aria-label="Starting letter">
        {['All letters', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map((item) => <button type="button" key={item} aria-pressed={letter === item} onClick={() => setLetter(item)}>{item}</button>)}
      </div>
      <p className={styles.glossaryCount} role="status">{terms.length} of {termsSnapshot.terms.length} terms</p>
      <div className={styles.glossaryGrid}>
        {terms.map((term) => {
          const reference = termsSnapshot.technicalReferences.find((entry) => entry.terms.includes(term.term));
          return <article id={term.id} data-testid="glossary-term" key={term.id}><span>{term.category}</span><h2>{term.term}</h2><p>{term.definition}</p>{reference ? <a href={reference.url} target="_blank" rel="noopener noreferrer">Technical reference</a> : null}</article>;
        })}
      </div>
      {terms.length === 0 ? <section className={styles.glossaryEmpty}><h2>No matching terms</h2><p>Try another category, starting letter, or search phrase.</p><button type="button" onClick={() => { setQuery(''); setCategory('All'); setLetter('All letters'); }}>Clear filters</button></section> : null}
    </main>
  );
}
