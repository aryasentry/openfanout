import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MathLessonReader } from '@/components/math/MathLessonReader';
import { AppShell } from '@/components/shell/AppShell';
import { getMathLessonNeighbors, mathLessonBySlug } from '@/content/math-lessons';
import { mathNavigation } from '@/content/navigation';
import { fullMathTopics, fullMathTopicBySlug } from '@/content/local-course-topics';
import Link from 'next/link';
import styles from '@/components/curriculum/CourseSourceIndex.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return fullMathTopics.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = fullMathTopicBySlug.get(slug);
  return { title: lesson?.title ?? 'Lesson not found' };
}

export default async function MathLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = mathLessonBySlug.get(slug);
  const topic = fullMathTopicBySlug.get(slug);
  if (!topic) notFound();
  if (!lesson) {
    const index = fullMathTopics.findIndex(entry => entry.slug === slug);
    const previous = fullMathTopics[index - 1];
    const next = fullMathTopics[index + 1];
    return <AppShell workspace="ML Math" title={topic.title} navigation={mathNavigation} activePath={topic.route}>
      <main id="main-content" className={styles.main}>
        <p className={styles.eyebrow}>{topic.moduleTitle}</p>
        <h1>{topic.title}</h1>
        <section aria-label="Lesson content pending"><h2>Lesson content pending</h2><p className={styles.intro}>This topic is part of openFanout. Its notes and video have not been added yet.</p></section>
        <nav className={styles.tabs} aria-label="Lesson navigation">
          {previous ? <Link href={previous.route}>Previous: {previous.title}</Link> : null}
          <Link href="/courses#ml-math">All mathematics topics</Link>
          {next ? <Link href={next.route}>Next: {next.title}</Link> : null}
        </nav>
      </main>
    </AppShell>;
  }

  return (
    <AppShell workspace="ML Math" title={lesson.title} navigation={mathNavigation} activePath={lesson.route}>
      <MathLessonReader lesson={lesson} neighbors={getMathLessonNeighbors(slug)} />
    </AppShell>
  );
}
