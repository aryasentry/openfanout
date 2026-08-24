import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MathLessonReader } from '@/components/math/MathLessonReader';
import { AppShell } from '@/components/shell/AppShell';
import { getMathLessonNeighbors, mathLessonBySlug, mathLessons } from '@/content/math-lessons';
import { mathNavigation } from '@/content/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return mathLessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = mathLessonBySlug.get(slug);
  return { title: lesson?.title ?? 'Lesson not found' };
}

export default async function MathLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = mathLessonBySlug.get(slug);
  if (!lesson) notFound();

  return (
    <AppShell workspace="ML Math" title={lesson.title} navigation={mathNavigation} activePath={lesson.route}>
      <MathLessonReader lesson={lesson} neighbors={getMathLessonNeighbors(slug)} />
    </AppShell>
  );
}
