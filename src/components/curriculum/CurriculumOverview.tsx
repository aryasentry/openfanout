import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Boxes,
  BrainCircuit,
  ChevronDown,
  ChevronRight,
  FilePenLine,
  FunctionSquare,
  Gift,
  Layers3,
  Network,
  Orbit,
  Repeat2,
  ServerCog,
  Sigma,
  SlidersHorizontal,
  type LucideIcon,
} from 'lucide-react';
import { aiModuleSummaries, mathPreviewLessons } from '../../content/ai-curriculum';
import styles from './CurriculumOverview.module.css';

const moduleIcons: LucideIcon[] = [
  Sigma,
  Orbit,
  Boxes,
  Layers3,
  Network,
  BrainCircuit,
  Repeat2,
  SlidersHorizontal,
  FilePenLine,
  SlidersHorizontal,
  ServerCog,
  Gift,
];

export function CurriculumOverview() {
  return (
    <main id="main-content" className={styles.main}>
      <section className={styles.intro}>
        <div className={styles.introCopy}>
          <h1>AI Research archive</h1>
          <p>A structured path from math foundations to advanced AI research, with code, theory, and practice at every step.</p>
          <Image
            className={styles.illustration}
            src="/assets/knowledge-branches.png"
            width={560}
            height={267}
            priority
            alt="A branching map of learning concepts growing from an open book"
          />
        </div>
        <div className={styles.openCallout}>
          <span className={styles.calloutIcon}><BookOpen size={29} strokeWidth={1.65} aria-hidden="true" /></span>
          <div>
            <h2>Your open curriculum</h2>
            <p>108 lessons, always available</p>
            <Link className={styles.primaryButton} href="/ai/lessons/math-fundamentals-functions">
              Start reading <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.panel} aria-labelledby="curriculum-structure-title">
        <h2 id="curriculum-structure-title">Curriculum structure</h2>
        <div className={styles.moduleGrid}>
          {aiModuleSummaries.map((module, position) => {
            const Icon = moduleIcons[position] ?? FunctionSquare;
            return (
              <Link data-testid="module-link" className={styles.moduleLink} href={`#${module.id}`} key={module.id}>
                <span className={styles.moduleIcon}><Icon size={18} strokeWidth={1.65} aria-hidden="true" /></span>
                <span className={styles.moduleNumber}>{String(module.index).padStart(2, '0')}.</span>
                <span className={styles.moduleTitle}>{module.title}</span>
                <ChevronRight className={styles.moduleChevron} size={16} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className={`${styles.panel} ${styles.resumeStrip}`} aria-labelledby="continue-title">
        <div>
          <h2 id="continue-title">Continue Learning</h2>
          <div className={styles.resumeLesson}>
            <span className={styles.functionIcon}>ƒ(x)</span>
            <strong>Functions</strong>
          </div>
        </div>
        <div className={styles.progressGroup}>
          <span>0% complete</span>
          <span className={styles.progressTrack}><span /></span>
        </div>
        <Link className={styles.resumeButton} href="/ai/lessons/math-fundamentals-functions">
          Resume <ChevronRight size={15} aria-hidden="true" />
        </Link>
      </section>

      <section className={`${styles.panel} ${styles.moduleSection}`} id="math-fundamentals" aria-labelledby="math-title">
        <header className={styles.moduleHeader}>
          <div>
            <h2 id="math-title"><span>01.</span> Math Fundamentals</h2>
            <p>Build the mathematical foundation required for modern AI.</p>
          </div>
          <ChevronDown size={18} aria-hidden="true" />
        </header>
        <div>
          {mathPreviewLessons.map((lesson) => (
            <Link className={styles.lessonRow} href={lesson.route} key={lesson.index}>
              <span className={styles.lessonIndex}>{lesson.index}</span>
              <span className={styles.lessonCopy}><strong>{lesson.title}</strong><small>{lesson.detail}</small></span>
              <span className={styles.lessonStatus}>0%</span>
              <span className={styles.lessonDuration}>{lesson.duration}</span>
              <ChevronRight size={15} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
