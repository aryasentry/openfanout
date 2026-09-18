import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MathObservedMedia, observedMathMediaBySource } from './MathObservedMedia';
import audit from '../../content/math-media-audit.json';

describe('MathObservedMedia', () => {
  it('keeps every verified video and resource mapping available locally', () => {
    expect(observedMathMediaBySource.size).toBe(audit.observations.length);
    expect([...observedMathMediaBySource.values()].flatMap((observation) => observation.videoUrls)).toHaveLength(audit.summary.portableYouTubeUrls);
    expect([...observedMathMediaBySource.values()].flatMap((observation) => observation.resourceUrls)).toHaveLength(audit.summary.externalResourceUrls);
  });

  it('renders audited media and marks quiz questions as pending without rendering unobserved content', () => {
    const { rerender } = render(
      <MathObservedMedia sourceUrl="https://fanout.sh/ml-math/lessons/sets-special-sets-and-the-number-system-ladder-t-1ojbjcc" />,
    );

    expect(screen.getByTitle('Video: Special Sets and the Number-System Ladder')).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/5ZhNmKb-dqk',
    );
    expect(screen.getByRole('link', { name: 'Open on YouTube: Special Sets and the Number-System Ladder' })).toHaveAttribute(
      'href',
      'https://www.youtube.com/watch?v=5ZhNmKb-dqk',
    );
    expect(screen.getByRole('link', { name: 'https://openstax.org/books/contemporary-mathematics/pages/1-1-basic-set-concepts' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Interactive checks' })).toBeInTheDocument();
    expect(screen.getByText('Quiz questions are pending in this local copy.')).toBeInTheDocument();

    rerender(<MathObservedMedia sourceUrl="https://example.com/unobserved-lesson" />);
    expect(screen.queryByLabelText('Observed lesson media')).not.toBeInTheDocument();
  });
});
