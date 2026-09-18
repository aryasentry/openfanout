import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TopBar } from './TopBar';

describe('TopBar workspace switcher', () => {
  it('opens destinations for AI Research and ML Math', () => {
    render(<TopBar workspace="AI" title="Overview" onOpenMenu={() => undefined} onOpenSearch={() => undefined} />);

    fireEvent.click(screen.getByRole('button', { name: 'Switch learning space' }));

    expect(screen.getByRole('menu', { name: 'Learning spaces' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'AI Research' })).toHaveAttribute('href', '/ai/overview');
    expect(screen.getByRole('menuitem', { name: 'ML Math' })).toHaveAttribute('href', '/ml-math/overview');
  });
});
