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
  it('renders the exact public video and working notes', () => {
    renderLesson('math-fundamentals-functions');

    expect(screen.getByRole('heading', { name: 'Functions' })).toBeInTheDocument();
    expect(screen.getByText('ƒ(x)')).toBeInTheDocument();
    expect(screen.getByTitle('Video: Functions')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/kvGsIo1TmsM');
    expect(screen.getByRole('link', { name: 'Open Functions on YouTube' })).toHaveAttribute('href', 'https://www.youtube.com/watch?v=kvGsIo1TmsM');
    expect(screen.getByText('Functions are the foundation of neural networks. A function is a mathematical relationship that maps inputs to outputs.')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Concept map' })).not.toBeInTheDocument();
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
    const slug = 'fine-tuning-evaluation-and-deployment';
    const lesson = aiLessonBySlug.get(slug);
    if (!lesson) throw new Error('Missing evaluation lesson');
    const { updateProgress } = renderLesson(slug, [lesson.id]);

    expect(screen.queryByTitle(/Video:/)).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Provided notes' })).toBeInTheDocument();
    expect(screen.getByText('Evaluation methods:')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Mark incomplete' }));
    expect(updateProgress).toHaveBeenCalledWith({ completedLessonIds: [], lastRoute: lesson.route });
  });

  it('renders the supplied video and notes for a Pro topic', () => {
    renderLesson('core-ai-intuitions-similarity-with-dot-product');

    expect(screen.getByTitle('Video: Similarity With Dot Product')).toHaveAttribute('src', 'https://www.youtube-nocookie.com/embed/B2ZSC9228ak');
    expect(screen.getByText(/The dot product is the engine of AI/)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Pro topic' })).not.toBeInTheDocument();
  });

  it('keeps recommended YouTube URLs in supplied notes clickable', () => {
    renderLesson('tensorflow-fundamentals-inception-model');

    expect(screen.getByRole('link', { name: 'youtu.be/C86ZXvgpejM' })).toHaveAttribute(
      'href',
      'https://youtu.be/C86ZXvgpejM',
    );
  });

  it('shows only the Pro status when no content was supplied', () => {
    renderLesson('mlops-introduction-to-mlops');

    expect(screen.getByRole('heading', { name: 'Pro topic' })).toBeInTheDocument();
    expect(screen.getByText('Fanout does not expose a public lesson page, video, or notes for this topic.')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /YouTube/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Concept map' })).not.toBeInTheDocument();
  });
});
