'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Circle, Sigma } from 'lucide-react';
import { useEffect } from 'react';
import { mathModules, type MathLessonRecord } from '../../content/math-lessons';
import { useProgress } from '../../lib/progress/useProgress';
import styles from '../lesson/LessonReader.module.css';

interface MathLessonReaderProps {
  lesson: MathLessonRecord;
  neighbors: { previous: MathLessonRecord | null; next: MathLessonRecord | null };
}

export function MathLessonReader({ lesson, neighbors }: MathLessonReaderProps) {
  const { progress, updateProgress } = useProgress();
  const completed = progress.completedLessonIds.includes(lesson.id);
  const currentModule = mathModules.find((candidate) => candidate.id === lesson.moduleId);
  const moduleCompleted = currentModule?.lessons.filter((candidate) => progress.completedLessonIds.includes(candidate.id)).length ?? 0;
  const moduleTotal = currentModule?.lessons.length ?? 0;
  const modulePercent = moduleTotal ? Math.round((moduleCompleted / moduleTotal) * 100) : 0;

  useEffect(() => {
    void updateProgress({ lastRoute: lesson.route });
  }, [lesson.route, updateProgress]);

  const toggleCompletion = () => {
    const completedLessonIds = completed
      ? progress.completedLessonIds.filter((id) => id !== lesson.id)
      : [...progress.completedLessonIds, lesson.id];
    void updateProgress({ completedLessonIds, lastRoute: lesson.route });
  };

  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.lessonHeader}>
        <div>
          <p className={styles.eyebrow}>
            {String(lesson.moduleIndex).padStart(2, '0')}.{String(lesson.lessonNumber).padStart(2, '0')} · {lesson.groupTitle}
          </p>
          <div className={styles.titleRow}>
            <span className={styles.lessonSymbol} aria-hidden="true">{lesson.symbol}</span>
            <h1>{lesson.title}</h1>
          </div>
          <p className={styles.summary}>{lesson.summary}</p>
        </div>
        <button
          className={`${styles.completeButton} ${completed ? styles.completeButtonDone : ''}`}
          type="button"
          onClick={toggleCompletion}
          aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {completed ? <Check size={17} aria-hidden="true" /> : <Circle size={17} aria-hidden="true" />}
          {completed ? 'Completed' : 'Mark complete'}
        </button>
      </header>

      <div className={styles.layout}>
        <div className={styles.content}>
          <section className={`${styles.panel} ${styles.readingBanner}`} aria-label="Key mathematical relation">
            <span className={styles.readingIcon}><Sigma size={23} aria-hidden="true" /></span>
            <div>
              <h2>Key relation</h2>
              <p>{lesson.equation}</p>
            </div>
          </section>

          <article className={`${styles.panel} ${styles.notes}`}>
            {lesson.notes.map((note) => (
              <section className={styles.note} key={note.heading}>
                <h2>{note.heading}</h2>
                <p>{note.body}</p>
              </section>
            ))}
          </article>

          <section className={`${styles.panel} ${styles.notes}`} aria-labelledby="references-title">
            <div className={styles.note}>
              <h2 id="references-title">Open references</h2>
              <p>
                {lesson.references.map((reference, index) => (
                  <span key={reference.url}>
                    {index ? ' · ' : ''}
                    <a href={reference.url} target="_blank" rel="noreferrer noopener">{reference.title}</a>
                  </span>
                ))}
              </p>
            </div>
          </section>

          <nav className={styles.lessonNavigation} aria-label="Lesson navigation">
            {neighbors.previous ? (
              <Link href={neighbors.previous.route} aria-label={`Previous: ${neighbors.previous.title}`}>
                <ArrowLeft size={18} aria-hidden="true" />
                <span><small>Previous</small><strong>{neighbors.previous.title}</strong></span>
              </Link>
            ) : <span />}
            {neighbors.next ? (
              <Link className={neighbors.previous ? undefined : styles.nextOnly} href={neighbors.next.route} aria-label={`Next: ${neighbors.next.title}`}>
                <span><small>Next</small><strong>{neighbors.next.title}</strong></span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            ) : null}
          </nav>
        </div>

        <aside className={styles.courseRail} aria-label="Module progress">
          <h2>{currentModule?.title}</h2>
          <p>{currentModule?.description}</p>
          <div className={styles.progressLabel}><span>{moduleCompleted} of {moduleTotal}</span><span>{modulePercent}%</span></div>
          <span className={styles.progressTrack}><span style={{ width: `${modulePercent}%` }} /></span>
          <Link className={styles.overviewLink} href={`/ml-math/overview#${lesson.moduleId}`}>
            Course overview <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
