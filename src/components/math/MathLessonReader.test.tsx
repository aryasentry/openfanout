import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType } from 'react';
import { mathLessonBySlug } from '../../content/math-lessons';
import { fullMathTopics } from '../../content/local-course-topics';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { MathLessonReader } from './MathLessonReader';

type ProgressContextValue = NonNullable<ContextType<typeof ProgressContext>>;

function getFullMathNeighbors(slug: string) {
  const index = fullMathTopics.findIndex((topic) => topic.slug === slug);
  return {
    previous: fullMathTopics[index - 1] ?? null,
    next: fullMathTopics[index + 1] ?? null,
  };
}

function renderLesson(slug: string, completedLessonIds: string[] = []) {
  const lesson = mathLessonBySlug.get(slug);
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
      <MathLessonReader lesson={lesson} neighbors={getFullMathNeighbors(slug)} />
    </ProgressContext.Provider>,
  );
  return { lesson, updateProgress };
}

describe('MathLessonReader', () => {
  it('renders the symbol, key relation, original notes, references, and next lesson', () => {
    renderLesson('sets-special-sets-and-the-number-system-ladder-t-1ojbjcc');

    expect(screen.getByRole('heading', { name: 'Special Sets and the Number-System Ladder' })).toBeInTheDocument();
    expect(screen.getByText('ℕ⊂ℤ')).toBeInTheDocument();
    expect(screen.getByText('ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Core intuition' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Mathematics for Machine Learning' })).toHaveAttribute('href', 'https://mml-book.github.io/');
    expect(screen.getByTitle('Video: Special Sets and the Number-System Ladder')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/5ZhNmKb-dqk',
    );
    expect(screen.getByRole('link', { name: 'Open on YouTube: Special Sets and the Number-System Ladder' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=5ZhNmKb-dqk',
    );
    expect(screen.getByRole('heading', { name: 'Interactive checks' })).toBeInTheDocument();
    expect(screen.getByText('Quiz questions are pending in this local copy.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Next: Equivalent Sets/ })).toHaveAttribute(
      'href',
      '/ml-math/lessons/sets-equivalent-sets-t-1r7vp9a',
    );
  });

  it('persists completion and the current mathematics route', () => {
    const { lesson, updateProgress } = renderLesson('sets-equivalent-sets-t-1r7vp9a');
    fireEvent.click(screen.getByRole('button', { name: 'Mark complete' }));
    expect(updateProgress).toHaveBeenCalledWith({ completedLessonIds: [lesson.id], lastRoute: lesson.route });
  });

  it('uses the full source module total and links to the next pending canonical topic', () => {
    renderLesson('sets-indicator-functions-for-predicates-t-1289tky');

    expect(screen.getByText('0 of 25')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Next: Relative Complements' })).toHaveAttribute(
      'href',
      '/ml-math/lessons/sets-relative-complements-t-0x92bp9',
    );
    expect(screen.getByRole('link', { name: /Course overview/ })).toHaveAttribute(
      'href',
      '/ml-math/overview#set-language-for-models',
    );
  });
});
