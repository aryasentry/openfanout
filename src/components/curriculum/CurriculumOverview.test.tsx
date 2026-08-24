import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CurriculumOverview } from './CurriculumOverview';

describe('CurriculumOverview', () => {
  it('renders all twelve AI modules and the local resume surface', () => {
    render(<CurriculumOverview />);

    expect(screen.getByRole('heading', { level: 1, name: 'AI Research archive' })).toBeInTheDocument();
    expect(screen.getAllByTestId('module-link')).toHaveLength(12);
    expect(screen.getAllByText('Math Fundamentals').length).toBeGreaterThan(0);
    expect(screen.getByText('Machine Learning Operations')).toBeInTheDocument();
    expect(screen.getByText('108 lessons, always available')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute('href', '/ai/lessons/math-fundamentals-functions');
  });
});
