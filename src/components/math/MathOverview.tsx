'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight, Circle } from 'lucide-react';
import { mathLessonBySlug, mathLessons, mathModules } from '../../content/math-lessons';
import { useProgress } from '../../lib/progress/useProgress';
import styles from './MathOverview.module.css';

function countLabel(count: number) {
  return `${count} open ${count === 1 ? 'lesson' : 'lessons'}`;
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
            <div><strong>12</strong><span>Main topics</span></div>
            <div><strong>34</strong><span>Open lessons</span></div>
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
          <p>Browse all twelve topics and open any of the 34 public lessons.</p>
        </header>
        <div className={styles.moduleGrid}>
          {mathModules.map((module) => (
            <Link
              className={styles.moduleLink}
              href={`#${module.id}`}
              key={module.id}
              data-testid="math-module-link"
            >
              <span className={styles.moduleNumber}>{String(module.index).padStart(2, '0')}</span>
              <span className={styles.moduleCopy}>
                <strong>{module.title}</strong>
                <small>{module.lessons.length ? countLabel(module.lessons.length) : 'Open topic note'}</small>
              </span>
              <ChevronRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <div className={styles.curriculumDivider}><span>Open curriculum · 34 complete lessons</span></div>

      {mathModules.map((module) => {
        const completedCount = module.lessons.filter((lesson) => completedIds.has(lesson.id)).length;
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
                {module.groups.length ? `${module.groups.length} ${module.groups.length === 1 ? 'group' : 'groups'} · ` : ''}
                {module.lessons.length ? `${completedCount}/${module.lessons.length} done` : 'Open note'}
              </span>
            </header>

            {module.openNote ? (
              <div className={styles.openNote}>
                <span>{module.openNoteSymbol}</span>
                <div><strong>Topic orientation</strong><p>{module.openNote}</p></div>
              </div>
            ) : null}

            {module.groups.map((group) => (
              <section className={styles.group} key={group.id} aria-labelledby={`${group.id}-title`}>
                <header className={styles.groupHeader}>
                  <span>{String(group.index).padStart(2, '0')}</span>
                  <h3 id={`${group.id}-title`}>{group.title}</h3>
                  <small>{group.lessons.length} {group.lessons.length === 1 ? 'lesson' : 'lessons'}</small>
                </header>
                <div>
                  {group.lessons.map((lesson, lessonIndex) => {
                    const completed = completedIds.has(lesson.id);
                    return (
                      <Link
                        className={styles.lessonRow}
                        href={lesson.route}
                        key={lesson.id}
                        data-testid="math-lesson-link"
                      >
                        <span className={styles.topicSymbol}>{lesson.symbol}</span>
                        <span className={styles.lessonIndex}>{String(lessonIndex + 1).padStart(2, '0')}</span>
                        <span className={styles.lessonCopy}>
                          <strong>{lesson.title}</strong>
                          <small>{lesson.equation}</small>
                        </span>
                        <span className={styles.lessonStatus}>
                          {completed ? <CheckCircle2 size={13} aria-hidden="true" /> : <Circle size={13} aria-hidden="true" />}
                          {completed ? 'Done' : 'Open'}
                        </span>
                        <ChevronRight size={15} aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </section>
        );
      })}
    </main>
  );
}
