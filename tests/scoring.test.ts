import { describe, expect, it } from 'vitest';
import { calculateAverageScore, clampScore } from '../lib/scoring';

describe('scoring', () => {
  it('clamps score between 1 and 10', () => {
    expect(clampScore(-4)).toBe(1);
    expect(clampScore(4.4)).toBe(4);
    expect(clampScore(11)).toBe(10);
  });

  it('calculates average score with clamping', () => {
    const average = calculateAverageScore([{ score: 2 }, { score: 9 }, { score: 13 }]);
    expect(average).toBe(7);
  });
});
