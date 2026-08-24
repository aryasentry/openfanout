import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { editorialPages } from '../../content/editorial-pages';
import { EditorialPage } from './EditorialPage';
import { GlossaryPage } from './GlossaryPage';

describe('original editorial pages', () => {
  it('represents every non-directory AI workspace route', () => {
    expect(editorialPages.map((page) => page.route)).toEqual([
      '/ai/roadmap', '/ai/claude-code', '/ai/system-design', '/ai/hardware', '/ai/challenges',
      '/ai/tracks', '/ai/interviews', '/ai/newbies',
    ]);
    const challenges = editorialPages.find((page) => page.route === '/ai/challenges');
    if (!challenges) throw new Error('Missing challenges page');
    render(<EditorialPage page={challenges} />);
    expect(screen.getByRole('heading', { name: 'Train MNIST from Scratch to 95%+ Accuracy' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Build a Word Tokenizer from Scratch' })).toBeInTheDocument();
    expect(screen.queryByText(/pricing|upgrade|account/i)).not.toBeInTheDocument();
  });

  it('renders all 192 observed glossary terms with local filtering', () => {
    render(<GlossaryPage />);
    expect(screen.getAllByTestId('glossary-term')).toHaveLength(192);
    expect(screen.getByRole('heading', { name: 'Ablation Study' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Tool Use / Function Calling' })).toBeInTheDocument();
  });
});
