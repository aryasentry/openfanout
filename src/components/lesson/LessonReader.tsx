'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen, Check, Circle } from 'lucide-react';
import { useEffect } from 'react';
import { aiModules, type AiLessonRecord } from '../../content/ai-lessons';
import { useProgress } from '../../lib/progress/useProgress';
import styles from './LessonReader.module.css';

interface LessonReaderProps {
  lesson: AiLessonRecord;
  neighbors: { previous: AiLessonRecord | null; next: AiLessonRecord | null };
}

function youtubeWatchUrl(embedUrl: string) {
  return `https://www.youtube.com/watch?v=${embedUrl.split('/').at(-1)}`;
}

export function LessonReader({ lesson, neighbors }: LessonReaderProps) {
  const { progress, updateProgress } = useProgress();
  const completed = progress.completedLessonIds.includes(lesson.id);
  const currentModule = aiModules.find((candidate) => candidate.id === lesson.moduleId);
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
            {String(lesson.moduleIndex).padStart(2, '0')}.{String(lesson.lessonNumber).padStart(2, '0')} · {currentModule?.title}
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
          {lesson.youtubeEmbedUrl ? (
            <section className={styles.panel} aria-label={`${lesson.title} video`}>
              <div className={styles.videoFrame}>
                <iframe
                  src={lesson.youtubeEmbedUrl}
                  title={`Video: ${lesson.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className={styles.mediaFooter}>
                <span>Public video · {lesson.duration}</span>
                <a
                  href={youtubeWatchUrl(lesson.youtubeEmbedUrl)}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Open ${lesson.title} on YouTube`}
                >
                  Open on YouTube <ArrowRight size={13} aria-hidden="true" />
                </a>
              </div>
            </section>
          ) : (
            <section className={`${styles.panel} ${styles.readingBanner}`} aria-label="Reading lesson">
              <span className={styles.readingIcon}><BookOpen size={23} aria-hidden="true" /></span>
              <div>
                <h2>Open reading lesson</h2>
                <p>This lesson is presented as concise original notes with a verification-oriented practice checkpoint.</p>
              </div>
            </section>
          )}

          <article className={`${styles.panel} ${styles.notes}`}>
            {lesson.notes.map((note) => (
              <section className={styles.note} key={note.heading}>
                <h2>{note.heading}</h2>
                <p>{note.body}</p>
              </section>
            ))}
          </article>

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
          <Link className={styles.overviewLink} href={`/ai/overview#${lesson.moduleId}`}>
            Course overview <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </main>
  );
}
