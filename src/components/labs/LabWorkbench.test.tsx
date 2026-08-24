import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ContextType } from 'react';
import { labs } from '../../content/labs';
import { ProgressContext } from '../../lib/progress/ProgressProvider';
import { createEmptyProgress } from '../../lib/progress/types';
import { LabWorkbench } from './LabWorkbench';

type Value = NonNullable<ContextType<typeof ProgressContext>>;

describe('LabWorkbench', () => {
  it('recalculates locally and persists edited inputs', () => {
    const lab = labs.find((candidate) => candidate.slug === 'kv-cache');
    if (!lab) throw new Error('Missing KV-cache lab');
    const progress = createEmptyProgress();
    const updateProgress = vi.fn(async (patch) => ({ ...progress, ...patch }));
    const value: Value = { progress, ready: true, updateProgress, exportProgress: vi.fn(), importProgress: vi.fn(), clearProgress: vi.fn() };
    render(<ProgressContext.Provider value={value}><LabWorkbench lab={lab} /></ProgressContext.Provider>);

    expect(screen.getByRole('heading', { level: 1, name: lab.title })).toBeInTheDocument();
    const context = screen.getByRole('spinbutton', { name: 'Context tokens' });
    const before = screen.getByTestId('metric-total-kv').textContent;
    fireEvent.change(context, { target: { value: '16384' } });
    expect(screen.getByTestId('metric-total-kv').textContent).not.toBe(before);
    expect(updateProgress).toHaveBeenCalled();
  });
});
