import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType, ReactNode } from 'react';
import { aiLessonBySlug } from '../../content/ai-lessons';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { CurriculumOverview } from './CurriculumOverview';

type ProgressValue = NonNullable<ContextType<typeof ProgressContext>>;

function renderWithProgress(children: ReactNode, completedLessonIds: string[] = [], lastRoute: string | null = null) {
  const progress = { ...createEmptyProgress(), completedLessonIds, lastRoute };
  const value: ProgressValue = {
    progress,
    ready: true,
    updateProgress: vi.fn(async (patch) => ({ ...progress, ...patch })),
    exportProgress: vi.fn(async () => '{}'),
    importProgress: vi.fn(async () => progress),
    clearProgress: vi.fn(async () => undefined),
  };
  return render(<ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>);
}

describe('CurriculumOverview', () => {
  it('renders all twelve AI modules and the local resume surface', () => {
    renderWithProgress(<CurriculumOverview />);

    expect(screen.getByRole('heading', { level: 1, name: 'AI Research archive' })).toBeInTheDocument();
    expect(screen.getAllByTestId('module-link')).toHaveLength(12);
    expect(screen.getAllByText('Math Fundamentals').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Machine Learning Operations (MLOps)').length).toBeGreaterThan(0);
    expect(screen.getByText(/108 lessons, always available/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('href', '/ai/lessons/math-fundamentals-functions');
    expect(screen.getAllByTestId('module-section')).toHaveLength(12);
    expect(screen.getAllByTestId('lesson-link')).toHaveLength(108);
  });

  it('derives resume state and progress from persisted completion', () => {
    const functions = aiLessonBySlug.get('math-fundamentals-functions');
    if (!functions) throw new Error('Missing Functions lesson');
    renderWithProgress(
      <CurriculumOverview />,
      [functions.id],
      '/ai/lessons/math-fundamentals-derivatives',
    );

    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('href', '/ai/lessons/math-fundamentals-derivatives');
    expect(screen.getByText('1% complete')).toBeInTheDocument();
  });
});
