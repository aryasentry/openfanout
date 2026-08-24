'use client';

import Link from 'next/link';
import { ArrowRight, Bookmark, CheckCircle2, Circle } from 'lucide-react';
import { papersByMonth } from '../../content/daily-papers';
import { useProgress } from '../../lib/progress/useProgress';
import styles from './DailyPages.module.css';

function monthTitle(value: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01T00:00:00Z`));
}

export function DailyArchive() {
  const { progress } = useProgress();
  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.archiveHero}>
        <p className={styles.eyebrow}>One paper at a time</p>
        <h1>Daily paper archive</h1>
        <p>Thirty source-linked readings across AI research, model systems, networking, databases, and distributed infrastructure.</p>
        <div><span><strong>30</strong> issues</span><span><strong>{progress.readPaperIds.length}</strong> read</span><span><strong>{progress.savedResourceIds.filter((id) => id.startsWith('daily-')).length}</strong> saved</span></div>
      </header>

      {[...papersByMonth.entries()].reverse().map(([month, papers]) => (
        <section className={styles.month} key={month} aria-labelledby={`month-${month}`}>
          <header><h2 id={`month-${month}`}>{monthTitle(month)}</h2><span>{papers.length} issues</span></header>
          <div>
            {[...papers].reverse().map((paper) => {
              const read = progress.readPaperIds.includes(paper.id);
              const saved = progress.savedResourceIds.includes(paper.id);
              return (
                <Link data-testid="daily-paper-link" href={paper.route} key={paper.id}>
                  <time>{paper.slug.slice(8, 10)}</time>
                  <span className={styles.paperCopy}><strong>{paper.title}</strong><small>{paper.track} · {paper.venue} · {paper.readingTime}</small></span>
                  <span className={styles.paperState}>{saved ? <Bookmark size={13} aria-label="Saved" /> : null}{read ? <CheckCircle2 size={14} aria-label="Read" /> : <Circle size={14} aria-label="Unread" />}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
