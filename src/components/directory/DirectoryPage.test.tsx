import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { directoryPages } from '../../content/external-resources';
import { DirectoryPage } from './DirectoryPage';

describe('DirectoryPage', () => {
  it('filters community people, organizations, and platforms independently', () => {
    render(<DirectoryPage page={directoryPages.get('/ai/community')!} />);
    const people = within(screen.getByRole('region', { name: 'Who to follow on X' }));
    const organizations = within(screen.getByRole('region', { name: 'AI research organizations' }));
    const communities = within(screen.getByRole('region', { name: 'Twitter, Discord & Reddit communities' }));
    fireEvent.click(people.getByRole('button', { name: 'Researchers' }));
    expect(people.getAllByTestId('directory-resource')).toHaveLength(16);
    expect(organizations.getAllByTestId('directory-resource')).toHaveLength(62);
    fireEvent.click(organizations.getByRole('button', { name: 'Government' }));
    expect(organizations.getAllByTestId('directory-resource')).toHaveLength(4);
    fireEvent.click(communities.getByRole('button', { name: 'Discord' }));
    expect(communities.getAllByTestId('directory-resource')).toHaveLength(12);
    expect(people.getAllByTestId('directory-resource')).toHaveLength(16);
    expect(document.querySelectorAll('main')).toHaveLength(1);
  });

  it('combines category selection with search and resets both from an empty result', () => {
    render(<DirectoryPage page={directoryPages.get('/ai/resources')!} />);
    fireEvent.click(screen.getByRole('button', { name: 'Books' }));
    expect(screen.getAllByTestId('directory-resource')).toHaveLength(10);
    expect(screen.queryByRole('link', { name: /Essence of Linear Algebra/ })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Books' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Khan Academy' } });
    expect(screen.getByRole('heading', { name: 'No matching references' })).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
    expect(screen.getAllByTestId('directory-resource')).toHaveLength(40);
    expect(screen.getByRole('searchbox')).toHaveValue('');
    fireEvent.click(screen.getByRole('button', { name: 'Platforms' }));
    expect(screen.getAllByTestId('directory-resource')).toHaveLength(10);
    expect(screen.getByRole('link', { name: /Khan Academy/ })).toBeVisible();
  });

  it('renders every grouped resource for a source page', () => {
    const page = directoryPages.get('/ai/gpu');
    if (!page) throw new Error('Missing GPU directory');
    render(<DirectoryPage page={page} />);

    expect(screen.getByRole('heading', { level: 1, name: 'GPU programming resources' })).toBeInTheDocument();
    expect(screen.getAllByTestId('directory-resource')).toHaveLength(15);
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
