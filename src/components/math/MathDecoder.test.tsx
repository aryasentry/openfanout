import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MathDecoder } from './MathDecoder';

describe('MathDecoder', () => {
  it('decodes symbols and phrases with deterministic local output', () => {
    render(<MathDecoder />);

    const input = screen.getByRole('textbox', { name: 'Expression or concept' });
    fireEvent.change(input, { target: { value: 'argmax' } });
    expect(screen.getByRole('heading', { name: 'Argument of the maximum' })).toBeInTheDocument();
    expect(screen.getByText(/returns the input location/i)).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'UΣVᵀ' } });
    expect(screen.getByRole('heading', { name: 'Singular value decomposition' })).toBeInTheDocument();
  });

  it('offers clickable examples and a useful unknown-state explanation', () => {
    render(<MathDecoder />);
    fireEvent.click(screen.getByRole('button', { name: 'Conditional variance' }));
    expect(screen.getByRole('heading', { name: 'Conditional variance' })).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: 'Expression or concept' }), { target: { value: 'mystery operator' } });
    expect(screen.getByText(/break the expression into operators/i)).toBeInTheDocument();
  });
});
