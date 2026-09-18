import { aiModules } from './ai-lessons';

export interface RoadmapModule { id: string; title: string; count: number; topics: { title: string; href?: string }[] }
export interface RoadmapTrack { id: string; title: string; unit: string; note: string; href: string; modules: RoadmapModule[] }

const mlModules = [
  ['math-for-models', 'Mathematics for Models', 'Linear algebra', 'Multivariable calculus', 'Probability & statistics', 'Convex optimization'],
  ['data-and-features', 'Data, Features & Preprocessing', 'Sampling & data generation', 'EDA and missingness', 'Scaling & encoding', 'Feature engineering'],
  ['learning-theory', 'Learning Theory & Generalization', 'Empirical risk', 'Bias–variance', 'Regularization', 'PAC intuition'],
  ['linear-models', 'Linear & Generalized Linear Models', 'Linear regression', 'Logistic regression', 'GLMs', 'Regularized regression'],
  ['trees-and-ensembles', 'Trees & Ensemble Methods', 'Decision trees', 'Random forests', 'Gradient boosting', 'XGBoost & LightGBM'],
  ['kernel-methods', 'Geometry, Margins & Kernel Methods', 'Geometric classifiers', 'Support vector machines', 'The kernel trick', 'Kernel selection'],
  ['probabilistic-models', 'Probabilistic Models', 'MLE & MAP', 'Bayesian inference', 'Naive Bayes', 'Gaussian mixtures'],
  ['unsupervised-learning', 'Unsupervised Learning', 'K-means & clustering', 'PCA & factorization', 'Manifold learning', 'Density estimation'],
  ['neural-networks', 'Neural Networks & Deep Learning', 'Backpropagation', 'Initialization & normalization', 'Optimizers', 'CNNs & sequence models'],
  ['representation-generative', 'Representation & Generative Models', 'Embeddings', 'Autoencoders', 'GANs', 'Diffusion models'],
  ['model-evaluation', 'Evaluation, Selection & Error Analysis', 'Train/validation/test', 'Cross-validation', 'Metrics & thresholds', 'Hyperparameter search'],
  ['production-research', 'Production ML & Research Practice', 'Reproducible experiments', 'Experiment tracking', 'Serving & monitoring', 'Drift & retraining'],
];

// Public roadmap metadata inspected in the rendered source on 2026-09-18.
// Counts describe the source roadmap, not imported lesson bodies.
export const roadmapTracks: RoadmapTrack[] = [
  { id: 'ai', title: 'AI Research', unit: 'lessons', href: '/ai/overview', note: 'Open local lessons below. Availability of notes and videos is shown on each lesson page.',
    modules: aiModules.map(module => ({ id: module.id, title: module.title, count: module.lessons.length, topics: module.lessons.map(lesson => ({ title: lesson.title, href: lesson.route })) })) },
  { id: 'ml', title: 'In-depth ML', unit: 'topics', href: '/ml-math/overview', note: 'Source topic previews only. This 59-topic roadmap is separate from the 301-lesson ML Math course; it does not represent 59 imported lessons.',
    modules: mlModules.map(([id, title, ...topics], index) => ({ id, title, count: index === 0 ? 4 : 5, topics: topics.map(title => ({ title })) })) },
  { id: 'system-design', title: 'System Design', unit: 'lessons', href: 'https://fanout.sh/system/overview', note: 'Source roadmap previews only. System Design remains on Fanout; its roadmap counts differ from the separately captured course index.', modules: [
    { id: 'part-1', title: 'Part 1: Fundamentals', count: 174, topics: ['Requirements clarification', 'Logical system design', 'Non-functional requirements', 'System design tradeoffs'].map(title => ({ title })) },
    { id: 'part-2', title: 'Part 2: Real-world systems', count: 21, topics: ['Design: a URL shortener, one machine', 'Design: rate limiting and abuse prevention', 'Design: a URL shortener at scale', 'Design: a product listing'].map(title => ({ title })) },
    { id: 'part-3', title: 'Part 3: Case studies', count: 5, topics: ["Case: Instagram’s first architecture", "Case: Stripe’s idempotency keys", 'Case: how Discord stores trillions of messages', 'Case: Amazon Dynamo, the paper'].map(title => ({ title })) },
  ] },
];
