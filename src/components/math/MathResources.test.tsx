import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MathResources } from './MathResources';

describe('MathResources', () => {
  it('renders grouped public references with safe external links', () => {
    render(<MathResources />);

    expect(screen.getByRole('heading', { level: 1, name: 'Mathematics resources' })).toBeInTheDocument();
    expect(screen.getAllByTestId('resource-group').length).toBeGreaterThanOrEqual(4);
    expect(screen.getAllByTestId('math-resource').length).toBeGreaterThanOrEqual(10);
    expect(screen.getByRole('link', { name: /Mathematics for Machine Learning/ })).toHaveAttribute('href', 'https://mml-book.github.io/');
    expect(screen.queryByText(/pricing|account|upgrade/i)).not.toBeInTheDocument();
  });
});
