import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LessonReader } from '../../../../components/lesson/LessonReader';
import { AppShell } from '../../../../components/shell/AppShell';
import { aiLessonBySlug, aiLessons, getAiLessonNeighbors } from '../../../../content/ai-lessons';
import { aiNavigation } from '../../../../content/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return aiLessons.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lesson = aiLessonBySlug.get(slug);
  return { title: lesson?.title ?? 'Lesson not found' };
}

export default async function AiLessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = aiLessonBySlug.get(slug);
  if (!lesson) notFound();

  return (
    <AppShell workspace="AI" title={lesson.title} navigation={aiNavigation} activePath={lesson.route}>
      <LessonReader lesson={lesson} neighbors={getAiLessonNeighbors(slug)} />
    </AppShell>
  );
}
