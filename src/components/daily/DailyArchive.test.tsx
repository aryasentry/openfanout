import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType } from 'react';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { DailyArchive } from './DailyArchive';

type Value = NonNullable<ContextType<typeof ProgressContext>>;

describe('DailyArchive', () => {
  it('renders all 30 issues grouped by month', () => {
    const progress = createEmptyProgress();
    const value: Value = { progress, ready: true, updateProgress: vi.fn(), exportProgress: vi.fn(), importProgress: vi.fn(), clearProgress: vi.fn() };
    render(<ProgressContext.Provider value={value}><DailyArchive /></ProgressContext.Provider>);
    expect(screen.getByRole('heading', { level: 1, name: 'Daily paper archive' })).toBeInTheDocument();
    expect(screen.getAllByTestId('daily-paper-link')).toHaveLength(30);
    expect(screen.getByRole('heading', { name: 'July 2026' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'August 2026' })).toBeInTheDocument();
  });
});
