import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LabsCatalog } from './LabsCatalog';

describe('LabsCatalog', () => {
  it('links all 15 local interactive labs', () => {
    render(<LabsCatalog />);
    expect(screen.getByRole('heading', { level: 1, name: 'Interactive labs' })).toBeInTheDocument();
    expect(screen.getAllByTestId('lab-card')).toHaveLength(15);
  });
});
