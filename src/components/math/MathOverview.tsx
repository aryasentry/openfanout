'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { mathLessonBySlug, mathLessons } from '../../content/math-lessons';
import {
  mathContentPendingTopicCount,
  mathNotesAvailableTopicCount,
  mathVideoAvailableTopicCount,
  mathVideoNotesPendingTopicCount,
  mathTopicCount,
  mathTopicNavigationModules,
} from '../../content/math-topic-navigation';
import { useProgress } from '../../lib/progress/useProgress';
import styles from './MathOverview.module.css';

function moduleCountLabel(module: typeof mathTopicNavigationModules[number]) {
  const notesCount = module.lessons.filter((lesson) => lesson.notesAvailable).length;
  const videoOnlyCount = module.lessons.filter((lesson) => lesson.status === 'video-notes-pending').length;
  const missingCount = module.lessons.filter((lesson) => lesson.status === 'content-pending').length;
  return `${notesCount} notes · ${videoOnlyCount} video-only · ${missingCount} missing`;
}

function lessonStatusLabel(status: 'notes' | 'video-notes-pending' | 'content-pending') {
  if (status === 'notes') return 'Notes available';
  if (status === 'video-notes-pending') return 'Video available · Notes pending';
  return 'Content pending';
}

export function MathOverview() {
  const { progress } = useProgress();
  const completedIds = new Set(progress.completedLessonIds);
  const savedSlug = progress.lastRoute?.startsWith('/ml-math/lessons/')
    ? progress.lastRoute.split('/').at(-1)
    : undefined;
  const resumeLesson = (savedSlug && mathLessonBySlug.get(savedSlug)) || mathLessons[0];
  const hasMathHistory = Boolean(savedSlug && mathLessonBySlug.has(savedSlug));

  return (
    <main id="main-content" className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Machine learning mathematics</p>
          <h1>Build the math intuition models depend on.</h1>
          <p className={styles.heroDescription}>
            Follow a structured route through set language, logic, linear algebra, calculus,
            probability, joint distributions, and statistical reasoning.
          </p>
          <div className={styles.heroActions}>
            <Link className={styles.primaryAction} href={resumeLesson.route}>
              {hasMathHistory ? 'Resume learning' : 'Start learning'} <ArrowRight size={14} aria-hidden="true" />
            </Link>
            <Link className={styles.secondaryAction} href="/ml-math/resources">Math resources</Link>
          </div>
          <dl className={styles.stats} aria-label="Course statistics">
            <div><strong>12</strong><span>Modules</span></div>
            <div><strong>{mathTopicCount}</strong><span>Captured topics</span></div>
            <div><strong>{mathNotesAvailableTopicCount}</strong><span>Notes available</span></div>
            <div><strong>{mathVideoAvailableTopicCount}</strong><span>Videos available</span></div>
          </dl>
        </div>
        <Image
          className={styles.heroArt}
          src="/assets/math-course-stack.png"
          width={1536}
          height={1536}
          priority
          alt="An original stack of mathematics folders, charts, vectors, and matrix diagrams"
        />
      </section>

      <section className={styles.courseMap} aria-labelledby="course-map-title">
        <header className={styles.sectionIntro}>
          <div>
            <p className={styles.eyebrow}>Course map</p>
            <h2 id="course-map-title">Main topics</h2>
          </div>
          <p>Browse all {mathTopicCount} captured topics. {mathNotesAvailableTopicCount} have local notes, {mathVideoAvailableTopicCount} have videos, and every remaining topic is labeled by what is still pending.</p>
        </header>
        <div className={styles.moduleGrid}>
          {mathTopicNavigationModules.map((module) => {
            return (
            <Link
              className={styles.moduleLink}
              href={`#${module.id}`}
              key={module.id}
              data-testid="math-module-link"
            >
              <span className={styles.moduleNumber}>{String(module.index).padStart(2, '0')}</span>
              <span className={styles.moduleCopy}>
                <strong>{module.title}</strong>
                <small>{moduleCountLabel(module)}</small>
              </span>
              <ChevronRight size={15} aria-hidden="true" />
            </Link>
            );
          })}
        </div>
      </section>

      <div className={styles.curriculumDivider}>
        <span>{mathTopicCount} captured topics · {mathNotesAvailableTopicCount} notes available · {mathVideoAvailableTopicCount} videos · {mathVideoNotesPendingTopicCount} notes pending · {mathContentPendingTopicCount} fully missing</span>
      </div>

      {mathTopicNavigationModules.map((module) => {
        const availableLessons = module.lessons.filter((lesson) => lesson.notesAvailable);
        const completedCount = availableLessons.filter((lesson) => completedIds.has(lesson.id)).length;
        return (
          <section
            className={styles.moduleSection}
            id={module.id}
            aria-labelledby={`${module.id}-title`}
            data-testid="math-module-section"
            key={module.id}
          >
            <header className={styles.moduleHeader}>
              <span className={styles.largeIndex}>{String(module.index).padStart(2, '0')}</span>
              <div>
                <h2 id={`${module.id}-title`}>{module.title}</h2>
                <p>{module.description}</p>
              </div>
              <span className={styles.moduleMeta}>
                {completedCount}/{availableLessons.length} done · {module.lessons.length - availableLessons.length} pending
              </span>
            </header>

            <div>
              {module.lessons.map((lesson) => {
                const completed = lesson.notesAvailable && completedIds.has(lesson.id);
                const statusLabel = lessonStatusLabel(lesson.status);
                return (
                  <Link
                    className={`${styles.lessonRow} ${lesson.notesAvailable ? '' : styles.lessonRowPending}`}
                    href={lesson.route}
                    key={lesson.id}
                    data-testid={lesson.notesAvailable ? 'math-lesson-link' : 'math-pending-link'}
                  >
                    <span className={styles.topicSymbol}>{lesson.symbol}</span>
                    <span className={styles.lessonIndex}>{String(lesson.topicNumber).padStart(2, '0')}</span>
                    <span className={styles.lessonCopy}>
                      <strong>{lesson.title}</strong>
                      <small>{lesson.notesAvailable ? lesson.equation : statusLabel}</small>
                    </span>
                    {lesson.notesAvailable ? (
                      <span className={styles.lessonStatus}>
                        {completed ? <CheckCircle2 size={13} aria-hidden="true" /> : <Circle size={13} aria-hidden="true" />}
                        {completed ? 'Done' : 'Open'}
                      </span>
                    ) : (
                      <span className={`${styles.lessonStatus} ${styles.lessonStatusPending} ${lesson.videoAvailable ? styles.lessonStatusVideo : ''}`} data-testid={lesson.videoAvailable ? 'math-video-notes-pending' : 'math-content-pending'}>
                        {statusLabel}
                      </span>
                    )}
                    <ChevronRight size={15} aria-hidden="true" />
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </main>
  );
}
