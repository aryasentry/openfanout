import { describe, expect, it } from 'vitest';
import {
  getMathLessonNeighbors,
  mathLessonBySlug,
  mathLessons,
  mathModules,
} from './math-lessons';

const expectedModuleCounts = [14, 5, 1, 2, 0, 1, 4, 2, 1, 2, 2, 0];

const expectedTitles = [
  'Special Sets and the Number-System Ladder',
  'Equivalent Sets',
  'Building Sets by Listing Members',
  'Building Sets with Membership Conditions',
  'Set-Builder Notation',
  'Planar Regions in Set-Builder Form',
  'Indicator Functions',
  'Indicator Functions for Predicates',
  'The Cartesian Product',
  'Cartesian Products as Regions',
  'Interior and Boundary Points',
  'Supremum and Infimum',
  'Argmax and Argmin Notation',
  'Reading Argmax and Argmin from Data',
  'Truth Tables',
  "De Morgan's Laws for Logic",
  'Truth Sets of Predicates',
  'Boolean Functions',
  'Boolean Functions And Logical Operations',
  'The Image of an Affine Transformation',
  'Change-of-Coordinates Matrices',
  'Converting Between Bases',
  'Distance-Preserving Linear Maps',
  'Singular Values as Matrix Stretch',
  'Computing Matrix Singular Values',
  'SVD for 2x2 Matrices',
  'SVD with Zero or Repeated Eigenvalues',
  'Introduction to Principal Component Analysis',
  'How PCA Connects to SVD',
  'Gradients over Selected Variables',
  'Many-to-One Transforms of Discrete Variables',
  'CDF Methods for Many-to-One Transforms',
  'Conditional Variance for Continuous Variables',
  'Transforming Expectations for Two Variables',
];

describe('mathematics curriculum registry', () => {
  it('contains the observed 12-module, 34-public-lesson sequence', () => {
    expect(mathModules).toHaveLength(12);
    expect(mathModules.map((module) => module.lessons.length)).toEqual(expectedModuleCounts);
    expect(mathLessons.map((lesson) => lesson.title)).toEqual(expectedTitles);
  });

  it('preserves the observed group structure', () => {
    expect(mathModules[0]?.groups.map((group) => [group.title, group.lessons.length])).toEqual([
      ['Sets, Membership and Notation', 8],
      ['Set Operations', 2],
      ['Set Structure and Boundaries', 4],
    ]);
    expect(mathModules[1]?.groups.map((group) => group.title)).toEqual([
      'Statements, Predicates and Truth',
      'Conditional Logic',
      'Boolean Algebra for Logic',
    ]);
    expect(mathModules[4]?.openNote).toBeTruthy();
    expect(mathModules[11]?.openNote).toBeTruthy();
  });

  it('uses unique local routes and the exact recovered public source slugs', () => {
    expect(new Set(mathLessons.map((lesson) => lesson.id)).size).toBe(34);
    expect(new Set(mathLessons.map((lesson) => lesson.route)).size).toBe(34);
    expect(mathLessons.every((lesson) => lesson.route === `/ml-math/lessons/${lesson.slug}`)).toBe(true);
    expect(mathLessonBySlug.get('probability-many-to-one-transforms-of-discrete-variables-t-020v3n7')?.sourceUrl)
      .toBe('https://fanout.sh/ml-math/lessons/probability-many-to-one-transforms-of-discrete-variables-t-020v3n7');
    expect(mathLessonBySlug.get('joint-rvs-conditional-variance-for-continuous-variables-t-17qzlzc')?.sourceUrl)
      .toBe('https://fanout.sh/ml-math/lessons/joint-rvs-conditional-variance-for-continuous-variables-t-17qzlzc');
    expect(mathLessonBySlug.get('joint-rvs-transforming-expectations-for-two-variables-t-1u4i5eg')?.sourceUrl)
      .toBe('https://fanout.sh/ml-math/lessons/joint-rvs-transforming-expectations-for-two-variables-t-1u4i5eg');
  });

  it('assigns a mathematical symbol and substantive original notes to every lesson', () => {
    expect(mathLessons.every((lesson) => lesson.symbol.trim().length > 0)).toBe(true);
    expect(mathLessons.every((lesson) => lesson.notes.length >= 3)).toBe(true);
    expect(mathLessons.every((lesson) => lesson.notes.some((note) => note.body.length > 80))).toBe(true);
  });

  it('derives previous and next lessons across modules with public lessons', () => {
    const first = mathLessons[0];
    const setLast = mathLessons[13];
    const final = mathLessons.at(-1);
    expect(first && getMathLessonNeighbors(first.slug).previous).toBeNull();
    expect(setLast && getMathLessonNeighbors(setLast.slug).next?.title).toBe('Truth Tables');
    expect(final && getMathLessonNeighbors(final.slug).next).toBeNull();
  });
});
