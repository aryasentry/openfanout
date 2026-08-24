'use client';

import { useMemo, useState } from 'react';
import { ArrowRight, Braces, Sigma } from 'lucide-react';
import styles from './MathUtilityPages.module.css';

interface DecoderEntry {
  keys: string[];
  symbol: string;
  title: string;
  definition: string;
  reading: string;
  example: string;
}

const entries: DecoderEntry[] = [
  { keys: ['argmax', 'arg max'], symbol: 'arg max', title: 'Argument of the maximum', definition: 'Argmax returns the input location or locations where a function reaches its largest value; max returns the value itself.', reading: 'Read arg max over x of f of x as: the x values that make f largest.', example: 'If scores are [2, 7, 4], argmax is index 2 while max is 7.' },
  { keys: ['uσvᵀ', 'usv', 'svd', 'singular value decomposition'], symbol: 'UΣVᵀ', title: 'Singular value decomposition', definition: 'SVD factors a matrix into orthogonal input directions, nonnegative directional stretches, and orthogonal output directions.', reading: 'A equals U Sigma V transpose.', example: 'Keeping only the largest singular values produces a lower-rank approximation.' },
  { keys: ['conditional variance', 'var[x|y]', 'variance given'], symbol: 'Var[X|Y]', title: 'Conditional variance', definition: 'Conditional variance measures how much uncertainty remains in one variable after information about another variable is fixed.', reading: 'Variance of X given Y.', example: 'Var(X|Y=y) = E[X²|Y=y] − E[X|Y=y]².' },
  { keys: ['gradient', '∇', 'nabla'], symbol: '∇f', title: 'Gradient', definition: 'The gradient collects all first partial derivatives of a scalar function into a vector pointing toward steepest local increase.', reading: 'Nabla f, or the gradient of f.', example: 'For f(x,y)=x²+3y, ∇f=(2x,3).' },
  { keys: ['set builder', '{x|p}', 'membership condition'], symbol: '{x∣P(x)}', title: 'Set-builder notation', definition: 'Set-builder notation describes a set by stating a domain and a predicate every member must satisfy.', reading: 'The set of x such that P of x is true.', example: '{x∈ℝ : x²≤1} is the interval [−1,1].' },
  { keys: ['cartesian product', 'a×b', 'product set'], symbol: 'A×B', title: 'Cartesian product', definition: 'A Cartesian product contains every ordered pair formed by choosing one member from each input set.', reading: 'A cross B.', example: '{0,1}×{a,b} has four ordered pairs.' },
  { keys: ['indicator', '𝟙', 'indicator function'], symbol: '𝟙[P]', title: 'Indicator function', definition: 'An indicator converts a predicate into 1 when true and 0 when false, making logical conditions usable in arithmetic.', reading: 'Indicator of predicate P.', example: 'Σᵢ𝟙[ŷᵢ=yᵢ] counts correct predictions.' },
  { keys: ['supremum', 'sup', 'infimum', 'inf'], symbol: 'sup / inf', title: 'Supremum and infimum', definition: 'The supremum is the least upper bound and the infimum is the greatest lower bound, whether or not those bounds are members.', reading: 'Supremum and infimum of a set.', example: 'For (0,1), the infimum is 0 and the supremum is 1.' },
  { keys: ['pca', 'principal component'], symbol: 'PC₁', title: 'Principal component analysis', definition: 'PCA rotates centered data toward orthogonal directions ordered by how much sample variance they explain.', reading: 'First principal component.', example: 'The first right singular vector of centered X gives its leading principal direction.' },
  { keys: ['expectation', 'e[g(x,y)]', 'expected value'], symbol: 'E[g(X,Y)]', title: 'Transformed expectation', definition: 'An expectation averages a transformed random quantity using its probability mass or density as weights.', reading: 'Expected value of g of X and Y.', example: 'For continuous variables, integrate g(x,y)fXY(x,y) over the joint support.' },
];

function normalize(value: string) {
  return value.trim().toLocaleLowerCase().replaceAll(' ', '');
}

function findEntry(query: string) {
  const normalized = normalize(query);
  if (!normalized) return entries[0];
  return entries.find((entry) => entry.keys.some((key) => normalize(key).includes(normalized) || normalized.includes(normalize(key))));
}

export function MathDecoder() {
  const [query, setQuery] = useState('argmax');
  const match = useMemo(() => findEntry(query), [query]);

  return (
    <main id="main-content" className={styles.main}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Interactive notation guide</p>
        <h1>Math Decoder</h1>
        <p>Paste a symbol or type a concept to turn compact mathematical notation into a precise plain-language reading.</p>
      </header>

      <section className={styles.decoderLayout}>
        <div className={styles.inputPanel}>
          <label htmlFor="math-expression">Expression or concept</label>
          <div className={styles.inputShell}><Sigma size={18} aria-hidden="true" /><input id="math-expression" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
          <p>Try a symbol, a full name, or a fragment.</p>
          <div className={styles.examples} aria-label="Decoder examples">
            {[
              ['argmax', 'Argmax'],
              ['UΣVᵀ', 'SVD'],
              ['Var[X|Y]', 'Conditional variance'],
              ['∇f', 'Gradient'],
              ['{x∣P(x)}', 'Set-builder'],
            ].map(([value, label]) => <button type="button" key={value} onClick={() => setQuery(value)}>{label}</button>)}
          </div>
        </div>

        {match ? (
          <article className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultSymbol}>{match.symbol}</div>
            <div className={styles.resultCopy}>
              <p className={styles.eyebrow}>Decoded</p>
              <h2>{match.title}</h2>
              <p>{match.definition}</p>
              <dl>
                <div><dt>Read it</dt><dd>{match.reading}</dd></div>
                <div><dt>Example</dt><dd>{match.example}</dd></div>
              </dl>
            </div>
          </article>
        ) : (
          <article className={styles.resultPanel} aria-live="polite">
            <div className={styles.resultSymbol}><Braces size={30} aria-hidden="true" /></div>
            <div className={styles.resultCopy}>
              <p className={styles.eyebrow}>No direct match</p>
              <h2>Decode it structurally</h2>
              <p>Break the expression into operators, operands, subscripts, superscripts, and grouping marks. Then identify the domain of each object before evaluating the operation.</p>
              <a href="/ml-math/resources">Browse notation references <ArrowRight size={13} aria-hidden="true" /></a>
            </div>
          </article>
        )}
      </section>
    </main>
  );
}
