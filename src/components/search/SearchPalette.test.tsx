import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { CatalogRecord } from '../../content/schema';
import { SearchPalette } from './SearchPalette';

const records: CatalogRecord[] = [
  {
    id: 'gpu',
    slug: 'gpu',
    title: 'GPU & CUDA',
    kind: 'page',
    workspace: 'ai',
    section: 'domains',
    route: '/ai/gpu',
    sourceUrl: 'https://fanout.sh/ai/gpu',
    provenanceCheckedAt: '2026-08-24',
  },
];

describe('SearchPalette', () => {
  it('filters records into direct local links and closes with Escape', () => {
    const onClose = vi.fn();
    render(<SearchPalette open records={records} onClose={onClose} />);

    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'cuda' } });
    expect(screen.getByRole('link', { name: /GPU & CUDA/ })).toHaveAttribute('href', '/ai/gpu');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('does not render the dialog while closed', () => {
    render(<SearchPalette open={false} records={records} onClose={() => undefined} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
