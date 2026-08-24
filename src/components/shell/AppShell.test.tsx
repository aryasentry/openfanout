import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders the openFanout workspace without forbidden controls', () => {
    render(
      <AppShell workspace="AI" title="Overview" navigation={[]}>
        <main>Body</main>
      </AppShell>,
    );

    expect(screen.getByRole('banner')).toHaveTextContent('openFanout');
    expect(screen.getByRole('navigation', { name: 'Course navigation' })).toBeInTheDocument();
    expect(screen.queryByText(/pricing|upgrade|account/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /dark mode/i })).not.toBeInTheDocument();
  });
});
