import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it } from 'vitest';
import { RoadmapPage } from './RoadmapPage';
import { roadmapTracks } from '../../content/roadmap';

beforeEach(() => window.history.replaceState(null, '', '/roadmap'));

it('keeps the three source tracks distinct and links all AI lessons locally', () => {
  expect(roadmapTracks.map(track => track.modules.reduce((sum, module) => sum + module.count, 0))).toEqual([108, 59, 200]);
  render(<RoadmapPage />);
  expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  expect(screen.getAllByRole('tab')).toHaveLength(3);
  expect(screen.getByRole('tab', { name: 'AI Research' })).toHaveAttribute('aria-selected', 'true');
  expect(document.querySelectorAll('a[href^="/ai/lessons/"]')).toHaveLength(108);
});

it('switches tracks, exposes preview limits, and supports keyboard tab navigation', () => {
  render(<RoadmapPage />);
  fireEvent.click(screen.getByRole('tab', { name: 'In-depth ML' }));
  expect(screen.getByText('59 topics · 12 modules')).toBeVisible();
  expect(screen.getByText(/separate from the 301-lesson/)).toBeVisible();
  expect(screen.getAllByText('1 additional topic not captured in the source preview.')).toHaveLength(11);
  fireEvent.keyDown(screen.getByRole('tab', { name: 'In-depth ML' }), { key: 'ArrowRight' });
  expect(screen.getByRole('tab', { name: 'System Design' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByText('200 lessons · 3 modules')).toBeVisible();
});
