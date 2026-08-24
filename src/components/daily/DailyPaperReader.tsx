'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Bookmark, Check, Circle, ExternalLink } from 'lucide-react';
import { useEffect } from 'react';
import type { DailyPaperRecord } from '../../content/daily-papers';
import { useProgress } from '../../lib/progress/useProgress';
import styles from './DailyPages.module.css';

interface Props {
  paper: DailyPaperRecord;
  neighbors: { previous: DailyPaperRecord | null; next: DailyPaperRecord | null };
}

export function DailyPaperReader({ paper, neighbors }: Props) {
  const { progress, updateProgress } = useProgress();
  const read = progress.readPaperIds.includes(paper.id);
  const saved = progress.savedResourceIds.includes(paper.id);

  useEffect(() => { void updateProgress({ lastRoute: paper.route }); }, [paper.route, updateProgress]);

  const toggleRead = () => void updateProgress({
    readPaperIds: read ? progress.readPaperIds.filter((id) => id !== paper.id) : [...progress.readPaperIds, paper.id],
    lastRoute: paper.route,
  });
  const toggleSaved = () => void updateProgress({
    savedResourceIds: saved ? progress.savedResourceIds.filter((id) => id !== paper.id) : [...progress.savedResourceIds, paper.id],
    lastRoute: paper.route,
  });

  return (
    <main id="main-content" className={styles.readerMain}>
      <header className={styles.readerHeader}>
        <p className={styles.eyebrow}>{paper.slug.slice(0, 10)} · {paper.track}</p>
        <h1>{paper.title}</h1>
        <p>{paper.summary}</p>
        <div className={styles.readerActions}>
          <button type="button" onClick={toggleRead} aria-label={read ? 'Mark as unread' : 'Mark as read'}>{read ? <Check size={15} /> : <Circle size={15} />}{read ? 'Read' : 'Mark as read'}</button>
          <button type="button" onClick={toggleSaved} aria-label={saved ? 'Remove saved paper' : 'Save paper'}><Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />{saved ? 'Saved' : 'Save paper'}</button>
          <a href={paper.externalUrl} target="_blank" rel="noreferrer noopener">Open original paper <ExternalLink size={14} /></a>
        </div>
      </header>

      <dl className={styles.metadata}>
        <div><dt>Authors</dt><dd>{paper.authors}</dd></div>
        <div><dt>Venue</dt><dd>{paper.venue}</dd></div>
        <div><dt>Difficulty</dt><dd>{paper.difficulty}</dd></div>
        <div><dt>Reading time</dt><dd>{paper.readingTime}</dd></div>
      </dl>

      <article className={styles.readingNotes}>
        <section><span>01</span><div><h2>Why this paper matters</h2><p>This reading belongs to {paper.track}. Begin by identifying the problem statement, the operational constraint that makes it difficult, and the baseline the authors intend to improve.</p></div></section>
        <section><span>02</span><div><h2>Mechanism and evidence</h2><p>Trace the proposed mechanism from inputs to outputs, then separate architectural claims from measured results. Record the strongest comparison, the evaluation setting, and any assumption required for that comparison to hold.</p></div></section>
        <section><span>03</span><div><h2>Engineering checkpoint</h2><p>Write one invariant the system or model must preserve, one failure mode the evaluation might miss, and one small experiment that could reproduce the paper&apos;s central effect.</p></div></section>
      </article>

      <nav className={styles.readerNav} aria-label="Daily paper navigation">
        {neighbors.previous ? <Link href={neighbors.previous.route}><ArrowLeft size={16} /><span><small>Previous</small><strong>{neighbors.previous.title}</strong></span></Link> : <span />}
        {neighbors.next ? <Link href={neighbors.next.route}><span><small>Next</small><strong>{neighbors.next.title}</strong></span><ArrowRight size={16} /></Link> : null}
      </nav>
    </main>
  );
}
