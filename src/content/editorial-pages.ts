export interface EditorialItem {
  symbol: string;
  title: string;
  description: string;
  checkpoint: string;
}

export interface EditorialPageRecord {
  route: string;
  title: string;
  eyebrow: string;
  description: string;
  items: EditorialItem[];
}

export const editorialPages: EditorialPageRecord[] = [
  {
    route: '/ai/roadmap', title: 'AI research roadmap', eyebrow: 'Learning sequence',
    description: 'A dependency-aware route from mathematical fluency to reproducible experiments and clear research communication.',
    items: [
      { symbol: '01', title: 'Build the language', description: 'Learn functions, derivatives, vectors, probability, and tensor shape reasoning well enough to inspect a model equation.', checkpoint: 'Explain a loss and its gradient with dimensions attached.' },
      { symbol: '02', title: 'Implement the primitives', description: 'Construct tensor operations, layers, attention, and optimizers from small inspectable pieces.', checkpoint: 'Rebuild one mechanism without a high-level helper.' },
      { symbol: '03', title: 'Train and evaluate', description: 'Run controlled experiments with baselines, held-out data, uncertainty, and failure analysis.', checkpoint: 'Make one claim that survives a seeded rerun.' },
      { symbol: '04', title: 'Read the systems', description: 'Connect model behavior to memory, kernels, data pipelines, serving, and operational constraints.', checkpoint: 'Account for the bottleneck with numbers.' },
      { symbol: '05', title: 'Contribute evidence', description: 'Turn a narrow question into a reproducible artifact, an honest comparison, and a concise technical narrative.', checkpoint: 'Publish code, assumptions, and a falsifiable result.' },
    ],
  },
  {
    route: '/ai/claude-code', title: 'Claude Code for research', eyebrow: 'Agent-assisted workflow',
    description: 'Use a coding agent as an inspectable collaborator for paper reading, experiments, implementation, and verification.',
    items: [
      { symbol: 'PDF', title: 'Explain any paper', description: 'Ask for claims, definitions, tensor shapes, assumptions, and the evidence attached to each result.', checkpoint: 'Verify every quoted number against the paper.' },
      { symbol: '↻', title: 'Reproduce a result', description: 'Translate a method into the smallest testable experiment before scaling data or compute.', checkpoint: 'Record environment, seed, command, and metric.' },
      { symbol: 'Δ', title: 'Design an ablation', description: 'Change one causal factor at a time and keep the evaluation path fixed.', checkpoint: 'State what outcome would disconfirm the hypothesis.' },
      { symbol: '✓', title: 'Audit the artifact', description: 'Use tests, type checks, logs, and independent calculations to catch plausible-looking errors.', checkpoint: 'Separate implementation success from scientific support.' },
    ],
  },
  {
    route: '/ai/system-design', title: 'ML system design', eyebrow: 'Production patterns',
    description: 'Map data, training, serving, retrieval, observability, and recovery as one measurable system.',
    items: [
      { symbol: 'D→', title: 'Data Pipeline Design', description: 'Define ingestion, validation, lineage, backfills, and ownership before model code consumes a record.', checkpoint: 'Trace one corrupt record to containment and repair.' },
      { symbol: 'M↺', title: 'Training platform', description: 'Coordinate datasets, experiments, checkpoints, schedulers, and reproducible environments.', checkpoint: 'Resume a failed run without silently changing inputs.' },
      { symbol: 'API', title: 'Online inference', description: 'Budget queueing, batching, model execution, fallbacks, and tail latency.', checkpoint: 'Explain the p99 path with a latency decomposition.' },
      { symbol: 'RAG', title: 'Retrieval systems', description: 'Choose chunking, indexes, reranking, context assembly, and grounded evaluation together.', checkpoint: 'Measure both retrieval recall and answer faithfulness.' },
      { symbol: 'SLO', title: 'Observability and recovery', description: 'Monitor quality, drift, capacity, cost, and dependency health with actionable thresholds.', checkpoint: 'Name the safe degradation mode for each dependency.' },
    ],
  },
  {
    route: '/ai/hardware', title: 'AI hardware guide', eyebrow: 'Compute foundations',
    description: 'Understand what CPUs, GPUs, memory systems, and interconnects contribute to model training and inference.',
    items: [
      { symbol: 'GPU', title: 'GPU vs CPU for ML', description: 'GPUs trade sophisticated control flow for many parallel arithmetic lanes and high memory bandwidth.', checkpoint: 'Classify the workload as compute-, memory-, or launch-bound.' },
      { symbol: 'HBM', title: 'Memory hierarchy', description: 'Registers, shared memory, caches, HBM, and host memory differ sharply in capacity, bandwidth, and latency.', checkpoint: 'Estimate bytes moved per useful operation.' },
      { symbol: 'NV', title: 'Interconnects', description: 'PCIe, NVLink, and network fabrics determine when parallel devices can cooperate efficiently.', checkpoint: 'Compare communication time with compute time.' },
      { symbol: 'TOPS', title: 'Precision and throughput', description: 'FP32, BF16, FP8, and integer formats change capacity and kernel throughput but impose accuracy constraints.', checkpoint: 'Measure end-to-end quality, not format size alone.' },
    ],
  },
  {
    route: '/ai/challenges', title: 'Hands-on challenges', eyebrow: 'Build and verify',
    description: 'Three public projects that turn core mathematical and modeling ideas into measurable artifacts.',
    items: [
      { symbol: '95%', title: 'Train MNIST from Scratch to 95%+ Accuracy', description: 'Build the input pipeline, model, loss, optimizer, and evaluation loop while keeping the result reproducible.', checkpoint: 'Report test accuracy from a clean seeded run.' },
      { symbol: '∇', title: 'Implement Linear Regression with Gradient Descent', description: 'Derive the gradient, implement updates directly, and compare convergence with a closed-form or library baseline.', checkpoint: 'Pass a numerical gradient check.' },
      { symbol: 'tok', title: 'Build a Word Tokenizer from Scratch', description: 'Specify normalization, vocabulary, unknown handling, encoding, and decoding without hiding edge cases.', checkpoint: 'Round-trip punctuation, Unicode, and unseen words.' },
    ],
  },
  {
    route: '/ai/tracks', title: 'Learning tracks', eyebrow: 'Choose a direction',
    description: 'Focused sequences through the shared curriculum for different kinds of technical work.',
    items: [
      { symbol: 'R', title: 'AI Researcher', description: 'Prioritize mathematics, implementation from scratch, papers, controlled experiments, and technical writing.', checkpoint: 'Produce a reproducible ablation report.' },
      { symbol: 'ML', title: 'ML Engineer', description: 'Prioritize data, training systems, evaluation, deployment, observability, and lifecycle ownership.', checkpoint: 'Ship a monitored model service with rollback.' },
      { symbol: 'INF', title: 'Inference Engineer', description: 'Prioritize accelerators, kernels, KV memory, batching, parallelism, and production latency.', checkpoint: 'Explain and improve a measured serving bottleneck.' },
      { symbol: 'APP', title: 'Applied AI Builder', description: 'Prioritize problem definition, retrieval, prompting, evaluation, workflow design, and reliable product behavior.', checkpoint: 'Demonstrate value against a non-AI baseline.' },
    ],
  },
  {
    route: '/ai/interviews', title: 'ML interview questions', eyebrow: 'Practice with evidence',
    description: 'Public prompts for explaining core machine-learning tradeoffs clearly and concretely.',
    items: [
      { symbol: 'U∩O', title: 'Overfitting vs. Underfitting — how to detect and fix each?', description: 'Separate optimization fit from generalization and diagnose the gap with train and validation behavior.', checkpoint: 'Propose one data, model, and regularization intervention.' },
      { symbol: 'P/R', title: 'Precision vs. Recall — when to optimize for which?', description: 'Tie the metric choice to the asymmetric cost of false positives and false negatives.', checkpoint: 'Choose a threshold using a stated business cost.' },
      { symbol: '∇', title: 'Explain Gradient Descent and its variants (SGD, Adam, AdaGrad).', description: 'Compare update rules, noise, adaptive scaling, memory, and convergence behavior.', checkpoint: 'Write the parameter update for each optimizer.' },
      { symbol: '⇈⇊', title: 'How to detect Exploding vs. Vanishing Gradients?', description: 'Use gradient norms, activation statistics, depth, and training dynamics to distinguish the two failures.', checkpoint: 'Name a targeted fix and why it changes signal flow.' },
      { symbol: 'x→ϕ', title: 'Explain Feature Engineering — key techniques and when to use them.', description: 'Transform raw observations into stable, leakage-safe signals suited to the model family and deployment path.', checkpoint: 'Validate every feature at prediction-time availability.' },
    ],
  },
  {
    route: '/ai/newbies', title: 'New to AI? Start here', eyebrow: 'Gentle on-ramp',
    description: 'A compact sequence for learning what matters first without collecting an endless prerequisite list.',
    items: [
      { symbol: 'Py', title: 'Learn enough Python', description: 'Practice functions, arrays, files, environments, debugging, and small scripts.', checkpoint: 'Read and modify a training loop confidently.' },
      { symbol: 'ƒ', title: 'Build mathematical fluency', description: 'Focus on functions, vectors, matrices, derivatives, probability, and shape reasoning.', checkpoint: 'Explain an equation in words and dimensions.' },
      { symbol: 'ML', title: 'Train small models', description: 'Start with regression and classification before deep architectures.', checkpoint: 'Evaluate on data the model did not train on.' },
      { symbol: 'NN', title: 'Understand neural networks', description: 'Trace forward computation, loss, gradients, optimization, and regularization.', checkpoint: 'Implement one layer and verify its gradient.' },
      { symbol: 'P', title: 'Read papers selectively', description: 'Use abstracts, figures, methods, and experiments to decide where deep reading pays.', checkpoint: 'Write claims, evidence, assumptions, and open questions.' },
      { symbol: '↗', title: 'Build in public', description: 'Prefer small reproducible artifacts over broad unfinished courses.', checkpoint: 'Publish a runnable result and what you learned.' },
    ],
  },
];

export const editorialPageByRoute = new Map(editorialPages.map((page) => [page.route, page]));
