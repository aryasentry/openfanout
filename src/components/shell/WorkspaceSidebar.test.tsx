import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { aiNavigation } from '../../content/navigation';
import { WorkspaceSidebar } from './WorkspaceSidebar';

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
});
