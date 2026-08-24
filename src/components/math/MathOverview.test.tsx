import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType, ReactNode } from 'react';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { MathOverview } from './MathOverview';

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

describe('MathOverview', () => {
  it('renders the observed course hierarchy and every public lesson', () => {
    renderWithProgress(<MathOverview />);

    expect(screen.getByRole('heading', { level: 1, name: 'Build the math intuition models depend on.' })).toBeInTheDocument();
    expect(screen.getByText('12', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByText('34', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getAllByTestId('math-module-link')).toHaveLength(12);
    expect(screen.getAllByTestId('math-module-section')).toHaveLength(12);
    expect(screen.getAllByTestId('math-lesson-link')).toHaveLength(34);
    expect(screen.getAllByText('Set Language for Machine Learning').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Statistical Estimation from Samples').length).toBeGreaterThan(0);
  });

  it('shows real mathematical symbols and open notes for modules without public routes', () => {
    renderWithProgress(<MathOverview />);

    expect(screen.getByText('ℕ⊂ℤ')).toBeInTheDocument();
    expect(screen.getByText('UΣVᵀ')).toBeInTheDocument();
    expect(screen.getByText('Var[X|Y]')).toBeInTheDocument();
    expect(screen.getByText(/eigenvector is a direction/i)).toBeInTheDocument();
    expect(screen.getByText(/estimator is a rule/i)).toBeInTheDocument();
  });

  it('resumes only within the mathematics workspace and excludes forbidden surfaces', () => {
    renderWithProgress(<MathOverview />, [], '/ai/lessons/math-fundamentals-functions');

    expect(screen.getByRole('link', { name: /Start learning/ })).toHaveAttribute(
      'href',
      '/ml-math/lessons/sets-special-sets-and-the-number-system-ladder-t-1ojbjcc',
    );
    expect(screen.queryByText(/pricing|account|upgrade|pro curriculum/i)).not.toBeInTheDocument();
  });
});
