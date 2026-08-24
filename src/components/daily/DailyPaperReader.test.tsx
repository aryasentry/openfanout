import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType } from 'react';
import { dailyPaperBySlug, getDailyPaperNeighbors } from '../../content/daily-papers';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { DailyPaperReader } from './DailyPaperReader';

type Value = NonNullable<ContextType<typeof ProgressContext>>;

describe('DailyPaperReader', () => {
  it('shows citation metadata and persists read and saved state', () => {
    const paper = dailyPaperBySlug.get('2026-08-24-google-borg-cluster-management');
    if (!paper) throw new Error('Missing Borg issue');
    const progress = createEmptyProgress();
    const updateProgress = vi.fn(async (patch) => ({ ...progress, ...patch }));
    const value: Value = { progress, ready: true, updateProgress, exportProgress: vi.fn(), importProgress: vi.fn(), clearProgress: vi.fn() };
    render(<ProgressContext.Provider value={value}><DailyPaperReader paper={paper} neighbors={getDailyPaperNeighbors(paper.slug)} /></ProgressContext.Provider>);

    expect(screen.getByRole('heading', { level: 1, name: paper.title })).toBeInTheDocument();
    expect(screen.getByText('Verma et al.')).toBeInTheDocument();
    expect(screen.getByText('EuroSys 2015')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open original paper' })).toHaveAttribute('href', paper.externalUrl);
    fireEvent.click(screen.getByRole('button', { name: 'Mark as read' }));
    expect(updateProgress).toHaveBeenCalledWith({ readPaperIds: [paper.id], lastRoute: paper.route });
    fireEvent.click(screen.getByRole('button', { name: 'Save paper' }));
    expect(updateProgress).toHaveBeenCalledWith({ savedResourceIds: [paper.id], lastRoute: paper.route });
  });
});
