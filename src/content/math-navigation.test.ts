import { describe, expect, it } from 'vitest';
import { mathNavigation } from './navigation';

describe('mathematics navigation', () => {
  it('contains the workspace destinations and the full source index', () => {
    expect(mathNavigation).toHaveLength(1);
    expect(mathNavigation[0]?.items.map((item) => [item.label, item.href])).toEqual([
      ['Course overview', '/ml-math/overview'],
      ['Full course index', '/courses#ml-math'],
      ['Math Decoder', '/ml-math/decoder'],
      ['Resources', '/ml-math/resources'],
    ]);
  });
});
