import { fireEvent, render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import snapshot from '../../content/glossary-terms.json';
import { GlossaryPage } from './GlossaryPage';

it('provides distinct definitions instead of the old category placeholder', () => {
  expect(snapshot.terms).toHaveLength(192);
  expect(snapshot.terms.every((term) => !term.definition.includes('is filed under'))).toBe(true);
  expect(snapshot.terms.find((term) => term.term === 'Precision')?.definition).toMatch(/true positives.*predicted positives/i);
  expect(snapshot.terms.find((term) => term.term === 'Recall')?.definition).toMatch(/true positives.*actual positives/i);
});

it('combines category, initial letter, and definition search and can clear an empty result', () => {
  render(<GlossaryPage />);
  for (const term of snapshot.terms) {
    expect(document.getElementById(term.id)).toHaveTextContent(term.term);
  }
  fireEvent.click(screen.getByRole('button', { name: 'Training' }));
  fireEvent.click(within(screen.getByRole('group', { name: 'Starting letter' })).getByRole('button', { name: 'A' }));
  expect(screen.getAllByTestId('glossary-term')).toHaveLength(2);
  expect(screen.getByRole('heading', { name: 'AdamW' })).toBeVisible();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'decouples' } });
  expect(screen.getAllByTestId('glossary-term')).toHaveLength(1);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'no-such-concept' } });
  expect(screen.getByRole('heading', { name: 'No matching terms' })).toBeVisible();
  fireEvent.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(screen.getAllByTestId('glossary-term')).toHaveLength(192);
});
