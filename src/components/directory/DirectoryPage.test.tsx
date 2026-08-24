import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { directoryPages } from '../../content/external-resources';
import { DirectoryPage } from './DirectoryPage';

describe('DirectoryPage', () => {
  it('renders every grouped resource for a source page', () => {
    const page = directoryPages.get('/ai/gpu');
    if (!page) throw new Error('Missing GPU directory');
    render(<DirectoryPage page={page} />);

    expect(screen.getByRole('heading', { level: 1, name: 'GPU programming resources' })).toBeInTheDocument();
    expect(screen.getAllByTestId('directory-resource')).toHaveLength(12);
    expect(screen.getByRole('link', { name: /CUDA Toolkit Documentation/ })).toHaveAttribute('href', 'https://docs.nvidia.com/cuda/');
  });

  it('filters locally while keeping the source inventory unchanged', () => {
    const page = directoryPages.get('/ai/resources');
    if (!page) throw new Error('Missing resources directory');
    render(<DirectoryPage page={page} />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Filter Resource library' }), { target: { value: 'linear algebra' } });
    expect(screen.getByRole('link', { name: /Linear Algebra Done Right/ })).toBeInTheDocument();
    expect(screen.getAllByTestId('directory-resource').length).toBeLessThan(39);
  });

  it('shows the complete source description, metadata, and destination', () => {
    const page = directoryPages.get('/ai/resources');
    if (!page) throw new Error('Missing resources directory');
    render(<DirectoryPage page={page} />);

    const card = screen.getByRole('link', { name: /Mathematics for Machine Learning/ });
    expect(card).toHaveTextContent('Deisenroht, Faisal & Ong');
    expect(card).toHaveTextContent('The foundational textbook connecting linear algebra, calculus, and probability to ML algorithms. Free PDF available.');
    expect(card).toHaveTextContent('mml-book.github.io');

    const playlist = screen.getByRole('link', { name: /Essence of Linear Algebra/ });
    expect(playlist).toHaveTextContent('https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab');
  });
});
