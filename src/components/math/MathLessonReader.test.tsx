import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType } from 'react';
import { getMathLessonNeighbors, mathLessonBySlug } from '../../content/math-lessons';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { MathLessonReader } from './MathLessonReader';

type ProgressContextValue = NonNullable<ContextType<typeof ProgressContext>>;

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
      <MathLessonReader lesson={lesson} neighbors={getMathLessonNeighbors(slug)} />
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
});
