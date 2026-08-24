import type { CurriculumModule, LessonRecord } from './schema';

interface MathLessonSeed {
  title: string;
  slug: string;
  symbol: string;
  equation: string;
  intuition: string;
  example: string;
}

interface MathGroupSeed {
  title: string;
  lessons: MathLessonSeed[];
}

interface MathModuleSeed {
  id: string;
  index: number;
  shortTitle: string;
  title: string;
  description: string;
  groups: MathGroupSeed[];
  openNote?: string;
  openNoteSymbol?: string;
}

export interface MathReference {
  title: string;
  url: string;
}

export interface MathLessonRecord extends LessonRecord {
  moduleIndex: number;
  lessonNumber: number;
  groupIndex: number;
  groupTitle: string;
  duration: string;
  symbol: string;
  equation: string;
  references: MathReference[];
}

export interface MathCurriculumGroup {
  id: string;
  index: number;
  title: string;
  lessons: MathLessonRecord[];
}

export interface MathCurriculumModule extends CurriculumModule {
  shortTitle: string;
  groups: MathCurriculumGroup[];
  lessons: MathLessonRecord[];
  openNote?: string;
  openNoteSymbol?: string;
}

function topic(
  title: string,
  slug: string,
  symbol: string,
  equation: string,
  intuition: string,
  example: string,
): MathLessonSeed {
  return { title, slug, symbol, equation, intuition, example };
}

const moduleSeeds: MathModuleSeed[] = [
  {
    id: 'set-language-for-models',
    index: 1,
    shortTitle: 'Sets',
    title: 'Set Language for Machine Learning',
    description: 'Use membership, construction rules, products, boundaries, and extrema to describe data and feasible regions precisely.',
    groups: [
      {
        title: 'Sets, Membership and Notation',
        lessons: [
          topic('Special Sets and the Number-System Ladder', 'sets-special-sets-and-the-number-system-ladder-t-1ojbjcc', 'ℕ⊂ℤ', 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ', 'Number systems form a containment ladder. Moving upward adds expressive power: negatives, ratios, limits, and finally two-dimensional complex values.', 'A model count belongs to ℕ, a signed offset may require ℤ, and a continuously valued weight is usually modeled in ℝ.'),
          topic('Equivalent Sets', 'sets-equivalent-sets-t-1r7vp9a', 'A≃B', '|A| = |B|', 'Two sets are equivalent when their elements can be paired one-to-one, even if the elements themselves look unrelated.', 'The labels {cat, dog, fox} and indices {0, 1, 2} are equivalent because a bijection pairs every label with one index.'),
          topic('Building Sets by Listing Members', 'sets-building-sets-by-listing-members-t-0z1zgrp', '{·}', 'S = {x₁, x₂, …, xₙ}', 'Roster notation exposes each member directly and is most useful for small finite collections.', 'A three-class vocabulary can be written V = {positive, neutral, negative}; repeated entries do not change the set.'),
          topic('Building Sets with Membership Conditions', 'sets-building-sets-with-membership-conditions-t-1o2m92b', 'x∈S', 'S = {x : P(x)}', 'A membership condition defines a collection through a predicate instead of enumerating every element.', 'The valid probabilities are P = {p ∈ ℝ : 0 ≤ p ≤ 1}, which describes infinitely many values compactly.'),
          topic('Set-Builder Notation', 'sets-set-builder-notation-t-1h3pbb0', '{x∣P}', '{x ∈ D ∣ P(x)}', 'Set-builder notation combines a domain with a rule, making the universe and the selection criterion explicit.', 'A unit circle is {(x,y) ∈ ℝ² ∣ x² + y² = 1}; changing equality to ≤ fills the disk.'),
          topic('Planar Regions in Set-Builder Form', 'sets-planar-regions-in-set-builder-form-t-020hek0', 'ℝ²', 'R = {(x,y) ∈ ℝ² : g(x,y) ≤ c}', 'Inequalities carve geometric regions out of the plane and reveal whether a constraint describes an interior, boundary, or complement.', 'The strip {(x,y) : −1 ≤ x ≤ 1} is infinite vertically but bounded in its horizontal coordinate.'),
          topic('Indicator Functions', 'sets-indicator-functions-t-19sbp2q', '𝟙S', '𝟙S(x) = 1 if x∈S, else 0', 'An indicator turns membership into a numeric switch that can be multiplied, summed, or averaged.', 'Summing 𝟙S(xᵢ) over a batch counts how many observations satisfy the set condition S.'),
          topic('Indicator Functions for Predicates', 'sets-indicator-functions-for-predicates-t-1289tky', '𝟙[P]', '𝟙[P(x)] ∈ {0,1}', 'A predicate indicator converts a logical statement directly into a binary-valued function.', 'Accuracy on n examples is n⁻¹Σᵢ𝟙[ŷᵢ = yᵢ], an average of correctness predicates.'),
        ],
      },
      {
        title: 'Set Operations',
        lessons: [
          topic('The Cartesian Product', 'sets-the-cartesian-product-t-0pult90', 'A×B', 'A × B = {(a,b) : a∈A, b∈B}', 'A Cartesian product combines independent choices into ordered tuples and is the basic language for input-output spaces.', 'If X contains two features and Y contains three labels, X × Y contains every admissible feature-label pair.'),
          topic('Cartesian Products as Regions', 'sets-cartesian-products-as-regions-t-09634sc', 'I×J', '[a,b] × [c,d]', 'Products of intervals become axis-aligned regions whose boundaries come from the interval endpoints.', '[0,1] × [−1,1] is a rectangle of width one and height two in ℝ².'),
        ],
      },
      {
        title: 'Set Structure and Boundaries',
        lessons: [
          topic('Interior and Boundary Points', 'sets-interior-and-boundary-points-t-1qzjuqn', '∂S', 'S = int(S) ∪ ∂S', 'Interior points have a small neighborhood fully inside the set; boundary points remain arbitrarily close to both the set and its complement.', 'For a closed disk, points with radius below one are interior and points with radius exactly one form the boundary.'),
          topic('Supremum and Infimum', 'sets-supremum-and-infimum-t-07348eh', 'sup/inf', 'inf S ≤ x ≤ sup S', 'The supremum is the least upper bound and the infimum is the greatest lower bound; neither must be attained by a member.', 'For S = (0,1), inf S = 0 and sup S = 1 even though neither endpoint belongs to S.'),
          topic('Argmax and Argmin Notation', 'sets-argmax-and-argmin-notation-t-08l0bn3', 'arg min', 'x* ∈ arg minₓ f(x)', 'Min and max return values; argmin and argmax return the input locations that attain those values.', 'Training chooses parameters θ* in arg minθ L(θ), while minθ L(θ) is the resulting best loss value.'),
          topic('Reading Argmax and Argmin from Data', 'sets-reading-argmax-and-argmin-from-data-t-1kn9xdk', 'i*', 'i* = arg maxᵢ sᵢ', 'On a finite table, argmax identifies the row or index associated with the largest score and may contain ties.', 'For scores [0.2, 0.7, 0.7], the argmax set contains indices 2 and 3 unless a tie-breaking rule is specified.'),
        ],
      },
    ],
  },
  {
    id: 'logic-and-boolean-reasoning',
    index: 2,
    shortTitle: 'Logic',
    title: 'Logic for Precise Reasoning',
    description: 'Translate claims into predicates, test implications, and simplify Boolean rules used by models and data pipelines.',
    groups: [
      {
        title: 'Statements, Predicates and Truth',
        lessons: [
          topic('Truth Tables', 'logic-truth-tables-t-0wtmcjb', 'T/F', 'p ∧ q, p ∨ q, ¬p', 'A truth table evaluates a compound statement for every possible assignment to its atomic propositions.', 'The conjunction p∧q is true only in the row where both p and q are true; the disjunction needs at least one true input.'),
          topic("De Morgan's Laws for Logic", 'logic-de-morgan-s-laws-for-logic-t-16g9699', '¬(∧)', '¬(p∧q) ≡ ¬p∨¬q', 'Negating a conjunction changes it into a disjunction of negations, and negating a disjunction changes it into a conjunction.', '“Not both checks passed” means at least one check failed; that is different from saying both checks failed.'),
        ],
      },
      {
        title: 'Conditional Logic',
        lessons: [
          topic('Truth Sets of Predicates', 'logic-truth-sets-of-predicates-t-0xviok0', 'T(P)', 'T(P) = {x∈D : P(x)}', 'A predicate becomes a set when we collect every input on which the predicate evaluates to true.', 'For P(x): x²≤4 over ℝ, the truth set is [−2,2]. This lets logic and geometry describe the same constraint.'),
        ],
      },
      {
        title: 'Boolean Algebra for Logic',
        lessons: [
          topic('Boolean Functions', 'logic-boolean-functions-t-1ozow7e', 'f:{0,1}', 'f : {0,1}ⁿ → {0,1}', 'A Boolean function maps binary inputs to one binary output and can represent rules, gates, masks, or feature tests.', 'An eligibility rule might output 1 only when consent=1 and quality_ok=1, which is the AND function.'),
          topic('Boolean Functions And Logical Operations', 'logic-boolean-functions-and-logical-operations-t-0awaw4u', '⊕', 'p ⊕ q = (p∨q)∧¬(p∧q)', 'Logical operations compose into larger Boolean functions, and equivalent formulas can be verified row by row.', 'Exclusive OR is true when exactly one input is true; its expression combines OR with the negation of AND.'),
        ],
      },
    ],
  },
  {
    id: 'vectors-matrices-and-solvers',
    index: 3,
    shortTitle: 'Linear systems',
    title: 'Linear Systems and Geometric Maps',
    description: 'Read affine transformations as linear maps followed by translation and reason about their reachable outputs.',
    groups: [{
      title: 'Affine Transformations',
      lessons: [topic('The Image of an Affine Transformation', 'linear-systems-the-image-of-an-affine-transformation-t-0gq5n1d', 'Ax+b', 'T(x)=Ax+b', 'The image contains every output reachable after applying the matrix and then adding the offset vector.', 'A rank-one matrix maps the plane onto a line; adding b shifts that line without changing its direction.')],
    }],
  },
  {
    id: 'vector-spaces-and-rank',
    index: 4,
    shortTitle: 'Spaces',
    title: 'Vector Spaces, Bases, and Rank',
    description: 'Treat coordinates as descriptions relative to a basis and convert safely between representations.',
    groups: [{
      title: 'Bases as Coordinate Systems',
      lessons: [
        topic('Change-of-Coordinates Matrices', 'spaces-change-of-coordinates-matrices-t-01rmmob', 'Pᴮ←ᶜ', '[v]ᴮ = Pᴮ←ᶜ[v]ᶜ', 'A change-of-coordinates matrix changes the numeric description of a vector while the geometric vector stays fixed.', 'Place the old basis vectors, expressed in the new basis, as columns of the conversion matrix.'),
        topic('Converting Between Bases', 'spaces-converting-between-bases-t-1kbjxu0', 'B↔C', '[v]ᶜ = (Pᴮ←ᶜ)⁻¹[v]ᴮ', 'Converting back uses the inverse map when both coordinate systems are valid bases for the same space.', 'Verify a conversion by reconstructing v from both coordinate vectors and confirming the ambient-space result matches.'),
      ],
    }],
  },
  {
    id: 'spectral-thinking',
    index: 5,
    shortTitle: 'Spectral',
    title: 'Spectral Thinking and Diagonalization',
    description: 'Understand a linear map through directions that are preserved and scaled.',
    groups: [],
    openNoteSymbol: 'Aq=λq',
    openNote: 'An eigenvector is a direction a matrix does not rotate away from: Aq = λq. When a full basis of such directions exists, diagonalization turns repeated matrix action into independent scalar scaling. The public source map exposes no lesson routes for this module, so openFanout records the topic without inventing one.',
  },
  {
    id: 'orthogonality-and-projections',
    index: 6,
    shortTitle: 'Projection',
    title: 'Orthogonality and Projections',
    description: 'Recognize transformations that preserve geometry and the inner products that encode it.',
    groups: [{
      title: 'Orthogonal Structure',
      lessons: [topic('Distance-Preserving Linear Maps', 'projection-distance-preserving-linear-maps-t-1bnius0', 'QᵀQ=I', '‖Qx−Qy‖₂ = ‖x−y‖₂', 'An orthogonal matrix preserves inner products, lengths, and angles because its transpose is its inverse.', 'Rotations and reflections preserve pairwise distances; scaling by two does not, because every distance doubles.')],
    }],
  },
  {
    id: 'svd-quadratic-forms-and-compression',
    index: 7,
    shortTitle: 'Low rank',
    title: 'Low-Rank Structure and Quadratic Geometry',
    description: 'Use singular values to measure directional stretch and expose compressible matrix structure.',
    groups: [{
      title: 'Singular Value Decomposition',
      lessons: [
        topic('Singular Values as Matrix Stretch', 'low-rank-singular-values-as-matrix-stretch-t-0hyqio8', 'σᵢ', 'σ₁ = max‖x‖=1 ‖Ax‖', 'Singular values report how strongly a matrix stretches mutually orthogonal input directions.', 'The largest singular value is the maximum output length obtained from any unit input vector.'),
        topic('Computing Matrix Singular Values', 'low-rank-computing-matrix-singular-values-t-0c9xyle', '√λ', 'σᵢ = √λᵢ(AᵀA)', 'The eigenvalues of A transpose A are nonnegative; their square roots are the singular values of A.', 'Compute AᵀA, solve its characteristic equation, clamp tiny negative roundoff errors, and take nonnegative square roots.'),
        topic('SVD for 2x2 Matrices', 'low-rank-svd-for-2x2-matrices-t-1gmgxu9', 'UΣVᵀ', 'A = UΣVᵀ', 'The SVD decomposes a map into an input rotation or reflection, axis-aligned scaling, and an output rotation or reflection.', 'For a 2×2 matrix, eigenvectors of AᵀA form V; normalized Avᵢ vectors form the corresponding columns of U.'),
        topic('SVD with Zero or Repeated Eigenvalues', 'low-rank-svd-with-zero-or-repeated-eigenvalues-t-167c5gm', 'σ=0', 'rank(A) = #{σᵢ>0}', 'Zero singular values reveal collapsed directions, while repeated values allow multiple valid orthonormal bases inside the same subspace.', 'If A is the identity, every orthonormal basis is a valid singular-vector basis because both singular values equal one.'),
      ],
    }],
  },
  {
    id: 'linear-algebra-in-models',
    index: 8,
    shortTitle: 'Applications',
    title: 'Linear Algebra in Models',
    description: 'Connect matrix factorizations to representation learning, dimensionality reduction, and data geometry.',
    groups: [{
      title: 'Principal Component Analysis',
      lessons: [
        topic('Introduction to Principal Component Analysis', 'applications-introduction-to-principal-component-analysis-t-1h3q66k', 'PC₁', 'z = Xv₁', 'PCA finds orthogonal directions that explain descending amounts of variance after the data has been centered.', 'Projecting centered two-dimensional points onto the leading component gives a one-dimensional summary with maximal sample variance.'),
        topic('How PCA Connects to SVD', 'applications-how-pca-connects-to-svd-t-1hcpchm', 'X=UΣVᵀ', 'XᵀX = VΣ²Vᵀ', 'The right singular vectors of a centered data matrix are principal directions, and squared singular values scale the explained variance.', 'Computing a thin SVD avoids explicitly forming a potentially ill-conditioned covariance matrix.'),
      ],
    }],
  },
  {
    id: 'multivariable-calculus-for-learning',
    index: 9,
    shortTitle: 'Calculus',
    title: 'Multivariable Calculus for Learning',
    description: 'Differentiate with respect to the variables that matter while holding the rest of a model fixed.',
    groups: [{
      title: 'Gradients and Vector-Valued Maps',
      lessons: [topic('Gradients over Selected Variables', 'calculus-gradients-over-selected-variables-t-02cyl64', '∇ₛf', '∇ₛf = (∂f/∂xᵢ)ᵢ∈S', 'A selected-variable gradient includes derivatives only for a chosen coordinate subset and treats all other variables as constants.', 'For f(x,y,z)=xy+z², the gradient over {x,z} is (y,2z); the y coordinate is excluded, not differentiated.')],
    }],
  },
  {
    id: 'probability-and-random-variables',
    index: 10,
    shortTitle: 'Probability',
    title: 'Reasoning Under Uncertainty',
    description: 'Transform discrete random variables and track how probability mass moves to new outcomes.',
    groups: [{
      title: 'Transforming Random Variables',
      lessons: [
        topic('Many-to-One Transforms of Discrete Variables', 'probability-many-to-one-transforms-of-discrete-variables-t-020v3n7', 'Y=g(X)', 'P(Y=y)=Σx:g(x)=y P(X=x)', 'When several input values map to one output, their probability masses must be added rather than assigned separately.', 'If Y=X² and X can be −2 or 2, both outcomes contribute to P(Y=4).'),
        topic('CDF Methods for Many-to-One Transforms', 'probability-cdf-methods-for-many-to-one-transforms-t-1ko0j9h', 'Fᵧ(y)', 'Fᵧ(y)=P(g(X)≤y)', 'A cumulative-distribution approach works even when the transformation is not one-to-one by translating an output event back into an input event.', 'For Y=X², the event Y≤y becomes −√y≤X≤√y when y is nonnegative.'),
      ],
    }],
  },
  {
    id: 'joint-distributions-and-covariance',
    index: 11,
    shortTitle: 'Joint RVs',
    title: 'Joint Distributions and Covariance',
    description: 'Reason about paired variables through conditional spread and transformed expectations.',
    groups: [{
      title: 'Moments of Joint Distributions',
      lessons: [
        topic('Conditional Variance for Continuous Variables', 'joint-rvs-conditional-variance-for-continuous-variables-t-17qzlzc', 'Var[X|Y]', 'Var(X|Y=y)=E[X²|Y=y]−E[X|Y=y]²', 'Conditional variance measures the remaining spread in X after fixing information about Y.', 'For a bivariate Gaussian, stronger correlation typically reduces the conditional variance of one variable given the other.'),
        topic('Transforming Expectations for Two Variables', 'joint-rvs-transforming-expectations-for-two-variables-t-1u4i5eg', 'E[g(X,Y)]', 'E[g(X,Y)] = ∬g(x,y)fₓᵧ(x,y)dxdy', 'The law of the unconscious statistician computes an expectation from the joint density without first deriving the distribution of the transformed quantity.', 'To compute E[XY], integrate xy against the joint density over its full support, respecting any dependence between X and Y.'),
      ],
    }],
  },
  {
    id: 'statistical-estimation-from-samples',
    index: 12,
    shortTitle: 'Inference',
    title: 'Statistical Estimation from Samples',
    description: 'Connect samples to estimators, uncertainty, and repeatable claims about a population.',
    groups: [],
    openNoteSymbol: 'θ̂',
    openNote: 'An estimator is a rule that maps observed samples to a candidate population parameter. Bias, variance, consistency, and uncertainty describe how that rule behaves across repeated samples. The public source map exposes no lesson routes for this module, so openFanout provides this orientation without inventing a public lesson.',
  },
];

const references: MathReference[] = [
  { title: 'Mathematics for Machine Learning', url: 'https://mml-book.github.io/' },
  { title: 'OpenStax Introductory Statistics', url: 'https://openstax.org/details/books/introductory-statistics-2e' },
];

function buildNotes(seed: MathLessonSeed, module: MathModuleSeed) {
  return [
    {
      heading: 'Core intuition',
      body: `${seed.intuition} In ${module.title}, this idea provides a precise way to reason about the objects a learning system receives, transforms, or estimates.`,
    },
    {
      heading: 'Worked example',
      body: `${seed.example} Write the relevant objects first, apply ${seed.equation}, and check the result against the definition instead of relying on pattern matching.`,
    },
    {
      heading: 'Verification checkpoint',
      body: `State what ${seed.symbol} means, identify the domain and codomain or sample space, and test one ordinary case plus one boundary case. A correct explanation should make clear which assumptions are necessary and which details are merely notation.`,
    },
  ];
}

let globalOrder = 0;

export const mathModules: MathCurriculumModule[] = moduleSeeds.map((module) => {
  let moduleLessonNumber = 0;
  const groups = module.groups.map((group, groupIndex): MathCurriculumGroup => {
    const lessons = group.lessons.map((seed): MathLessonRecord => {
      globalOrder += 1;
      moduleLessonNumber += 1;
      return {
        id: `math-${seed.slug}`,
        slug: seed.slug,
        title: seed.title,
        kind: 'lesson',
        workspace: 'ml-math',
        section: module.id,
        route: `/ml-math/lessons/${seed.slug}`,
        sourceUrl: `https://fanout.sh/ml-math/lessons/${seed.slug}`,
        provenanceCheckedAt: '2026-08-24',
        summary: `${seed.intuition} Key relation: ${seed.equation}.`,
        tags: [module.shortTitle, group.title, seed.symbol],
        moduleId: module.id,
        moduleIndex: module.index,
        lessonNumber: moduleLessonNumber,
        groupIndex: groupIndex + 1,
        groupTitle: group.title,
        order: globalOrder,
        duration: `${9 + (globalOrder % 7)} min`,
        symbol: seed.symbol,
        equation: seed.equation,
        notes: buildNotes(seed, module),
        references,
      };
    });
    return {
      id: `${module.id}-${groupIndex + 1}`,
      index: groupIndex + 1,
      title: group.title,
      lessons,
    };
  });
  const lessons = groups.flatMap((group) => group.lessons);
  return {
    id: module.id,
    index: module.index,
    shortTitle: module.shortTitle,
    title: module.title,
    description: module.description,
    openNote: module.openNote,
    openNoteSymbol: module.openNoteSymbol,
    groups,
    lessons,
    lessonIds: lessons.map((lesson) => lesson.id),
  };
});

export const mathLessons = mathModules.flatMap((module) => module.lessons);
export const mathLessonBySlug = new Map(mathLessons.map((lesson) => [lesson.slug, lesson]));

export function getMathLessonNeighbors(slug: string) {
  const index = mathLessons.findIndex((lesson) => lesson.slug === slug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: mathLessons[index - 1] ?? null,
    next: mathLessons[index + 1] ?? null,
  };
}
