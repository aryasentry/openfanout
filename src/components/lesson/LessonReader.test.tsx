import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType } from 'react';
import { aiLessonBySlug, getAiLessonNeighbors } from '../../content/ai-lessons';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { LessonReader } from './LessonReader';

type ProgressContextValue = NonNullable<ContextType<typeof ProgressContext>>;

function renderLesson(slug: string, completedLessonIds: string[] = []) {
  const lesson = aiLessonBySlug.get(slug);
  if (!lesson) throw new Error(`Missing test lesson: ${slug}`);
  const progress = { ...createEmptyProgress(), completedLessonIds };
  const updateProgress = vi.fn(async (patch) => ({ ...progress, ...patch }));
  const value: ProgressContextValue = {
    progress,
    ready: true,
    updateProgress,
    exportProgress: vi.fn(async () => '{}'),
    importProgress: vi.fn(async () => progress),
    clearProgress: vi.fn(async () => undefined),
  };

  render(
    <ProgressContext.Provider value={value}>
      <LessonReader lesson={lesson} neighbors={getAiLessonNeighbors(slug)} />
    </ProgressContext.Provider>,
  );
  return { lesson, updateProgress };
}

describe('LessonReader', () => {
  it('renders a public video, safe fallback, notes, and adjacent lesson link', () => {
    renderLesson('math-fundamentals-functions');

    expect(screen.getByRole('heading', { name: 'Functions' })).toBeInTheDocument();
    expect(screen.getByText('ƒ(x)')).toBeInTheDocument();
    expect(screen.getByTitle('Video: Functions')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/kvGsIo1TmsM');
    expect(screen.getByRole('link', { name: 'Open Functions on YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=kvGsIo1TmsM');
    expect(screen.getByRole('heading', { name: 'Concept map' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next: Derivatives/ })).toHaveAttribute('href', '/ai/lessons/math-fundamentals-derivatives');
    expect(screen.queryByRole('link', { name: /Previous:/ })).not.toBeInTheDocument();
  });

  it('persists completion and the current route', () => {
    const { lesson, updateProgress } = renderLesson('math-fundamentals-functions');
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete' }));

    expect(updateProgress).toHaveBeenCalledWith({
      completedLessonIds: [lesson.id],
      lastRoute: lesson.route,
    });
  });

  it('can mark a completed reading lesson incomplete', () => {
    const slug = 'math-fundamentals-derivation-rules-and-examples';
    const lesson = aiLessonBySlug.get(slug);
    if (!lesson) throw new Error('Missing derivation lesson');
    const { updateProgress } = renderLesson(slug, [lesson.id]);

    expect(screen.queryByTitle(/Video:/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Mark incomplete' }));
    expect(updateProgress).toHaveBeenCalledWith({ completedLessonIds: [], lastRoute: lesson.route });
  });

  it('offers a YouTube topic search when Fanout has no public embed', () => {
    renderLesson('core-ai-intuitions-similarity-with-dot-product');

    expect(screen.getByRole('link', { name: 'Find a matching video on YouTube' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/results?search_query=Similarity%20With%20Dot%20Product%20Core%20AI%20Intuitions',
    );
    expect(screen.getByRole('heading', { name: 'Concept map' })).toBeInTheDocument();
  });
});
