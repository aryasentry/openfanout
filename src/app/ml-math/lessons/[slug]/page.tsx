import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MathLessonReader } from '@/components/math/MathLessonReader';
import { MathObservedMedia } from '@/components/math/MathObservedMedia';
import { AppShell } from '@/components/shell/AppShell';
import { mathLessonBySlug } from '@/content/math-lessons';
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
  const topicIndex = fullMathTopics.findIndex(entry => entry.slug === slug);
  const neighbors = {
    previous: fullMathTopics[topicIndex - 1] ?? null,
    next: fullMathTopics[topicIndex + 1] ?? null,
  };
  if (!lesson) {
    const hasVideo = topic.videoAvailable;
    return <AppShell workspace="ML Math" title={topic.title} navigation={mathNavigation} activePath={topic.route}>
      <main id="main-content" className={styles.main}>
        <p className={styles.eyebrow}>{topic.moduleTitle}</p>
        <h1>{topic.title}</h1>
        <section aria-label={hasVideo ? 'Written notes pending' : 'Lesson content pending'}>
          <h2>{hasVideo ? 'Written notes pending' : 'Lesson content pending'}</h2>
          <p className={styles.intro}>
            {hasVideo
              ? 'A source video is available for this topic, but written notes have not been added to openFanout yet.'
              : 'Written notes and a source video have not been added to openFanout yet.'}
          </p>
        </section>
        <MathObservedMedia sourceUrl={topic.sourceUrl} />
        <nav className={styles.tabs} aria-label="Lesson navigation">
          {neighbors.previous ? <Link href={neighbors.previous.route}>Previous: {neighbors.previous.title}</Link> : null}
          <Link href="/courses#ml-math">All mathematics topics</Link>
          {neighbors.next ? <Link href={neighbors.next.route}>Next: {neighbors.next.title}</Link> : null}
        </nav>
      </main>
    </AppShell>;
  }

  return (
    <AppShell workspace="ML Math" title={lesson.title} navigation={mathNavigation} activePath={lesson.route}>
      <MathLessonReader lesson={lesson} neighbors={neighbors} />
    </AppShell>
  );
}
