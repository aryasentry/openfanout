import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType, ReactNode } from 'react';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { MathOverview } from './MathOverview';
import { fullMathTopicBySlug } from '../../content/local-course-topics';
import {
  mathContentPendingTopicCount,
  mathNotesAvailableTopicCount,
  mathVideoAvailableTopicCount,
  mathVideoNotesPendingTopicCount,
} from '../../content/math-topic-navigation';

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
  it('renders every captured mathematics topic and marks inventory-only routes as pending', () => {
    renderWithProgress(<MathOverview />);

    expect(screen.getByRole('heading', { level: 1, name: 'Build the math intuition models depend on.' })).toBeInTheDocument();
    expect(screen.getByText('12', { selector: 'strong' })).toBeInTheDocument();
    const statistics = within(screen.getByLabelText('Course statistics'));
    expect(statistics.getByText('Captured topics').parentElement).toHaveTextContent('301');
    expect(statistics.getByText('Notes available').parentElement).toHaveTextContent(String(mathNotesAvailableTopicCount));
    expect(statistics.getByText('Videos available').parentElement).toHaveTextContent(String(mathVideoAvailableTopicCount));
    expect(screen.getAllByTestId('math-module-link')).toHaveLength(12);
    expect(screen.getAllByTestId('math-module-section')).toHaveLength(12);
    expect(screen.getAllByTestId('math-lesson-link')).toHaveLength(34);
    expect(screen.getAllByTestId('math-pending-link')).toHaveLength(267);
    expect(screen.queryAllByTestId('math-video-notes-pending')).toHaveLength(mathVideoNotesPendingTopicCount);
    expect(screen.queryAllByTestId('math-content-pending')).toHaveLength(mathContentPendingTopicCount);
    expect(screen.getAllByText('Set Language for Machine Learning').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Statistical Estimation from Samples').length).toBeGreaterThan(0);
    const hyperboloids = screen.getAllByTestId('math-pending-link').find(
      (link) => link.textContent?.includes('Hyperboloids'),
    );
    expect(hyperboloids).toHaveAttribute(
      'href',
      '/ml-math/lessons/calculus-hyperboloids-t-0hnekga',
    );
    expect(hyperboloids).toHaveTextContent(fullMathTopicBySlug.get('calculus-hyperboloids-t-0hnekga')?.videoAvailable
      ? 'Video available · Notes pending' : 'Content pending');
  });

  it('labels a video-only topic without implying that its notes are present', () => {
    renderWithProgress(<MathOverview />);

    const statements = screen.getAllByTestId('math-pending-link').find(
      (link) => link.textContent?.includes('Statements and Predicates'),
    );
    expect(statements).toHaveTextContent('Video available · Notes pending');
    expect(statements).not.toHaveTextContent('Notes available');
  });

  it('preserves symbols from real lessons without inventing guidance for pending topics', () => {
    renderWithProgress(<MathOverview />);

    expect(screen.getByText('ℕ⊂ℤ')).toBeInTheDocument();
    expect(screen.getByText('UΣVᵀ')).toBeInTheDocument();
    expect(screen.getByText('Var[X|Y]')).toBeInTheDocument();
    expect(screen.queryByText('Topic orientation')).not.toBeInTheDocument();
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
