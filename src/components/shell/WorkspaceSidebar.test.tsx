import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aiNavigation } from '../../content/navigation';
import { mathNavigation } from '../../content/navigation';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { mathContentPendingTopicCount, mathVideoNotesPendingTopicCount } from '../../content/math-topic-navigation';

describe('WorkspaceSidebar', () => {
  it('contains every AI module and all 108 directly routed lessons', () => {
    render(
      <WorkspaceSidebar
        groups={aiNavigation}
        activePath="/ai/lessons/math-fundamentals-functions"
        open
        onClose={() => undefined}
      />,
    );

    expect(screen.getAllByTestId('sidebar-module')).toHaveLength(12);
    expect(screen.getAllByTestId('sidebar-lesson-link')).toHaveLength(108);
    expect(screen.getByRole('link', { name: /Functions/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /100x AI Reasoning — Tiny Recursive Model/ })).toHaveAttribute(
      'href',
      '/ai/lessons/bonus-lessons-100x-ai-reasoning-tiny-recursive-model',
    );
  });

  it('lists every captured mathematics topic and distinguishes pending content from real lessons', () => {
    render(
      <WorkspaceSidebar
        groups={mathNavigation}
        activePath="/ml-math/lessons/sets-relative-complements-t-0x92bp9"
        open
        onClose={() => undefined}
      />,
    );

    expect(screen.getAllByTestId('sidebar-module')).toHaveLength(12);
    expect(screen.getAllByTestId('sidebar-lesson-link')).toHaveLength(301);
    expect(screen.queryAllByTestId('sidebar-video-notes-pending')).toHaveLength(mathVideoNotesPendingTopicCount);
    expect(screen.queryAllByTestId('sidebar-content-pending')).toHaveLength(mathContentPendingTopicCount);
    expect(screen.getByRole('link', { name: /Relative Complements/ })).toHaveAttribute(
      'href',
      '/ml-math/lessons/sets-relative-complements-t-0x92bp9',
    );
    expect(screen.getByRole('link', { name: /Relative Complements/ })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Statements and Predicates/ })).toHaveTextContent('Video available · Notes pending');
  });
});
