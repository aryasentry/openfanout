'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
} from 'lucide-react';
import { aiLessonBySlug, aiLessons, aiModules } from '../../content/ai-lessons';
import { useProgress } from '../../lib/progress/useProgress';
import styles from './CurriculumOverview.module.css';

export function CurriculumOverview() {
  const { progress } = useProgress();
  const completedIds = new Set(progress.completedLessonIds);
  const resumeLesson = aiLessons.find((lesson) => lesson.route === progress.lastRoute)
    ?? aiLessonBySlug.get('math-fundamentals-functions')
    ?? aiLessons[0];
  const overallPercent = Math.round((progress.completedLessonIds.length / aiLessons.length) * 100);

  return (
    <main id="main-content" className={styles.main}>
      <section className={styles.intro}>
        <div className={styles.introCopy}>
          <h1>AI Research archive</h1>
          <p>A structured path from math foundations to advanced AI research, with code, theory, and practice at every step.</p>
          <span className={styles.archiveMeta}>12 modules · 108 lessons, always available</span>
          <Link className={styles.studyButton} href={resumeLesson.route}>
            Study progress <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
        <Image
          className={styles.illustration}
          src="/assets/research-archive-stack.png"
          width={1365}
          height={1365}
          priority
          alt="A staggered archive of AI research notebooks with mathematical symbols"
        />
      </section>

      <section className={styles.panel} aria-labelledby="curriculum-structure-title">
        <h2 id="curriculum-structure-title">Curriculum structure</h2>
        <div className={styles.moduleGrid}>
          {aiModules.map((module) => (
              <Link data-testid="module-link" className={styles.moduleLink} href={`#${module.id}`} key={module.id}>
                <span className={styles.moduleNumber}>{String(module.index).padStart(2, '0')}.</span>
                <span className={styles.moduleCopy}>
                  <strong className={styles.moduleTitle}>{module.title}</strong>
                  <small>{module.lessons.length} lessons</small>
                </span>
                <ChevronRight className={styles.moduleChevron} size={16} aria-hidden="true" />
              </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.panel} ${styles.resumeStrip}`} aria-labelledby="continue-title">
        <div>
          <h2 id="continue-title">Continue Learning</h2>
          <div className={styles.resumeLesson}>
            <span className={styles.functionIcon}>{resumeLesson.symbol}</span>
            <strong>{resumeLesson.title}</strong>
          </div>
        </div>
        <div className={styles.progressGroup}>
          <span>{overallPercent}% complete</span>
          <span className={styles.progressTrack}><span style={{ width: `${overallPercent}%` }} /></span>
        </div>
        <Link className={styles.resumeButton} href={resumeLesson.route}>
          Resume <ChevronRight size={15} aria-hidden="true" />
        </Link>
      </section>

      <div className={styles.fullCurriculum} aria-hidden="true"><span>Full curriculum</span></div>

      {aiModules.map((module) => {
        const completedCount = module.lessons.filter((lesson) => completedIds.has(lesson.id)).length;
        return (
          <section
            className={`${styles.panel} ${styles.moduleSection}`}
            id={module.id}
            aria-labelledby={`${module.id}-title`}
            data-testid="module-section"
            key={module.id}
          >
            <header className={styles.moduleHeader}>
              <div>
                <h2 id={`${module.id}-title`}><span>{String(module.index).padStart(2, '0')}.</span> {module.title}</h2>
                <p>{module.description}</p>
              </div>
              <div className={styles.moduleCompletion}>
                <span>{completedCount}/{module.lessons.length} done</span>
                <ChevronDown size={18} aria-hidden="true" />
              </div>
            </header>
            <div>
              {module.lessons.map((lesson) => {
                const completed = completedIds.has(lesson.id);
                return (
                  <Link className={styles.lessonRow} href={lesson.route} key={lesson.id} data-testid="lesson-link">
                    <span className={styles.topicSymbol}>{lesson.symbol}</span>
                    <span className={styles.lessonIndex}>
                      {String(module.index).padStart(2, '0')}.{String(lesson.lessonNumber).padStart(2, '0')}
                    </span>
                    <span className={styles.lessonCopy}>
                      <strong>{lesson.title}</strong>
                      <small>{lesson.youtubeEmbedUrl ? 'Video · ' : 'YouTube search · '}Notes · {lesson.summary}</small>
                    </span>
                    <span className={styles.lessonStatus}>
                      {completed ? <CheckCircle2 size={13} aria-hidden="true" /> : <Circle size={13} aria-hidden="true" />}
                      {completed ? 'Done' : 'Open'}
                    </span>
                    <span className={styles.lessonDuration}>{lesson.duration}</span>
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
