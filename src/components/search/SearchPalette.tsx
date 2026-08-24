'use client';

import Link from 'next/link';
import { ArrowUpRight, BookOpen, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CatalogRecord } from '../../content/schema';
import { searchCatalog } from '../../lib/search/searchCatalog';
import styles from './SearchPalette.module.css';

interface SearchPaletteProps {
  open: boolean;
  records: readonly CatalogRecord[];
  onClose: () => void;
}

export function SearchPalette({ open, records, onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => searchCatalog(query, records), [query, records]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div className={styles.backdrop} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-label="Search openFanout">
        <label className={styles.searchField}>
          <Search size={18} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search lessons, papers, labs, and resources…"
            aria-label="Search the openFanout catalog"
          />
          <kbd>esc</kbd>
        </label>
        {results.length > 0 ? (
          <ul className={styles.results}>
            {results.map((record) => (
              <li key={record.id}>
                <Link className={styles.resultLink} href={record.route} onClick={onClose}>
                  <span className={styles.resultIcon}><BookOpen size={17} aria-hidden="true" /></span>
                  <span className={styles.resultCopy}>
                    <strong>{record.title}</strong>
                    <small>{record.summary ?? record.section}</small>
                  </span>
                  <span className={styles.resultKind}>{record.kind} <ArrowUpRight size={12} aria-hidden="true" /></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>{query ? 'No matching openFanout records.' : 'Type to search the local library.'}</p>
        )}
      </section>
    </div>
  );
}
