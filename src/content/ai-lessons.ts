import type { CurriculumModule, LessonRecord } from './schema';
import { publicAiLessonSnapshots } from './ai-public-lessons';
import providedProLessonSnapshots from './ai-pro-lessons.json' with { type: 'json' };

interface LessonSeed {
  title: string;
  youtubeId?: string;
  slugSuffix?: string;
}

interface ModuleSeed {
  id: string;
  index: number;
  title: string;
  shortTitle: string;
  description: string;
  lessons: LessonSeed[];
}

export interface AiLessonRecord extends LessonRecord {
  moduleIndex: number;
  lessonNumber: number;
  symbol: string;
  publicContent: boolean;
  contentOrigin: 'fanout-public' | 'user-provided' | 'fanout-overview';
  sourceHeading?: string;
}

export interface AiCurriculumModule extends CurriculumModule {
  shortTitle: string;
  lessons: AiLessonRecord[];
}

function lesson(title: string, youtubeId?: string, slugSuffix?: string): LessonSeed {
  return { title, youtubeId, slugSuffix };
}

const moduleSeeds: ModuleSeed[] = [
  {
    id: 'math-fundamentals',
    index: 1,
    title: 'Math Fundamentals',
    shortTitle: 'Math',
    description: 'The mathematical foundations you need for AI research — from functions and derivatives to information theory and SVD.',
    lessons: [
      lesson('Functions', 'kvGsIo1TmsM'),
      lesson('Derivatives', '9vKqVkMQHKk'),
      lesson('Vectors', 'fNk_zzaMoSs'),
      lesson('Gradients', 'vp2oUoBDH4w'),
      lesson('Matrices', '5H4crNlLK_A'),
      lesson('Derivation Rules & Examples'),
      lesson('The Chain Rule'),
      lesson('Backprop in Python'),
      lesson('The Jacobian Matrix'),
      lesson('Hadamard Product (Element-wise Op)', '_MaVzNUjMPk', 'hadamard-product'),
      lesson('Entropy & Information Theory'),
      lesson('KL Divergence'),
      lesson('Singular Value Decomposition (SVD)'),
      lesson('Moving Averages (EMA)', 'lAq96T8FkTw', 'moving-averages'),
      lesson('More Math Lessons'),
    ],
  },
  {
    id: 'core-ai-intuitions',
    index: 2,
    title: 'Core AI Intuitions',
    shortTitle: 'AI Intuitions',
    description: 'Build deep intuition for the core operations that power all of AI — dot products, softmax, broadcasting, and norms.',
    lessons: [
      lesson('Similarity With Dot Product'),
      lesson('Softmax Probabilities'),
      lesson('Tensor Broadcasting'),
      lesson('L1 vs L2 Norms'),
    ],
  },
  {
    id: 'pytorch-fundamentals',
    index: 3,
    title: 'PyTorch Fundamentals',
    shortTitle: 'PyTorch',
    description: 'Master the tensor operations that are the building blocks of every neural network implementation.',
    lessons: [
      lesson('Creating Tensors'),
      lesson('Matrix Multiplication'),
      lesson('Transposing Tensors'),
      lesson('flatten, reshape, view, squeeze, unsqueeze'),
      lesson('Indexing and Slicing'),
      lesson('cat, stack'),
      lesson('Special Tensors (eye, rand, arange, linspace)'),
      lesson('New Full Lesson'),
      lesson('7 PyTorch Tasks (Advanced)', 'QtlDV2r1ryE', '7-pytorch-tasks'),
    ],
  },
  {
    id: 'tensorflow-fundamentals',
    index: 4,
    title: 'TensorFlow Fundamentals',
    shortTitle: 'TensorFlow',
    description: 'Learn TensorFlow from the ground up — linear models, CNNs, transfer learning, adversarial examples, NLP, reinforcement learning, and more.',
    lessons: [
      lesson('Simple Linear Model'),
      lesson('Convolutional Neural Network'),
      lesson('Pretty Tensor'),
      lesson('Layers API'),
      lesson('Keras API'),
      lesson('Save & Restore'),
      lesson('Ensemble Learning'),
      lesson('CIFAR-10'),
      lesson('Inception Model'),
      lesson('Transfer Learning'),
      lesson('Video Data'),
      lesson('Fine-Tuning'),
      lesson('Adversarial Examples'),
      lesson('Adversarial Noise for MNIST'),
      lesson('Visual Analysis'),
      lesson('Visual Analysis for MNIST'),
      lesson('Deep Dream'),
      lesson('Style Transfer'),
      lesson('TensorFlow GPU vs CPU'),
      lesson('Reinforcement Learning'),
      lesson('Estimator API'),
      lesson('TFRecords & Dataset API'),
      lesson('Hyper-Parameter Optimization'),
      lesson('Natural Language Processing'),
      lesson('Machine Translation'),
      lesson('Image Captioning'),
      lesson('Time-Series Prediction'),
    ],
  },
  {
    id: 'neural-network-from-scratch',
    index: 5,
    title: 'Neural Network from Scratch',
    shortTitle: 'Neural Nets',
    description: 'Build neural networks from the ground up — single neurons, layers, training loops, normalization, and optimization.',
    lessons: [
      lesson('Single Neuron From Scratch'),
      lesson('Building a Layer'),
      lesson('Implementing a Network'),
      lesson('RMSNorm'),
      lesson('Learning Rate, Decay'),
      lesson('Adam Optimizer'),
      lesson('Neural Network From Scratch'),
    ],
  },
  {
    id: 'transformers',
    index: 6,
    title: 'Transformers',
    shortTitle: 'Transformers',
    description: 'The architecture that changed everything — attention mechanisms, self-attention, and building GPT from scratch.',
    lessons: [
      lesson('Attention Mechanism Explained'),
      lesson('Self Attention from Scratch'),
      lesson('GPT From Scratch'),
    ],
  },
  {
    id: 'reinforcement-learning',
    index: 7,
    title: 'Reinforcement Learning',
    shortTitle: 'Reinforcement Learning',
    description: 'How agents learn from interaction — from basic environments to PPO and modern LLM reasoning techniques.',
    lessons: [
      lesson('Agents & Environments'),
      lesson('Policy Gradients (REINFORCE)'),
      lesson('Deep Q-Learning (DQN)'),
      lesson('PPO, LLM Reasoning, Importance Ratio, Advantage', 'TjHH_--7l8g'),
      lesson('Qwen 3 GSPO & DeepSeek GRPO — LLM Reasoning', 'L94MdLdP21s'),
    ],
  },
  {
    id: 'llm-from-scratch',
    index: 8,
    title: 'LLM From Scratch',
    shortTitle: 'LLM From Scratch',
    description: 'Build state-of-the-art large language models from scratch — LLaMA 4, DeepSeek V3, Qwen 3, and more.',
    lessons: [
      lesson('Llama 4 From Scratch', 'yXbF-1n9wxs'),
      lesson('DeepSeek V3 From Scratch'),
      lesson('Qwen 3 From Scratch'),
      lesson('Self-Study LLM'),
    ],
  },
  {
    id: 'write-research-paper',
    index: 9,
    title: 'Write Research Paper',
    shortTitle: 'Research Paper',
    description: 'The complete workflow from coding experiments to writing and publishing an AI research paper.',
    lessons: [lesson('Code, Write & Publish AI Research Paper', 'O2yAMJu8LpI')],
  },
  {
    id: 'fine-tuning',
    index: 10,
    title: 'How to Fine-Tune Models',
    shortTitle: 'Fine-Tuning',
    description: 'From LoRA to full fine-tuning — learn to adapt pre-trained models to your data and tasks.',
    lessons: [
      lesson('Why Fine-Tune?'),
      lesson('LoRA & QLoRA'),
      lesson('Data Preparation'),
      lesson('Training & Hyperparameters'),
      lesson('Evaluation & Deployment'),
    ],
  },
  {
    id: 'mlops',
    index: 11,
    title: 'Machine Learning Operations (MLOps)',
    shortTitle: 'MLOps',
    description: 'Deploy and maintain ML models in production — from Git and Docker to Kubernetes, CI/CD, and monitoring with Prometheus & Grafana.',
    lessons: [
      lesson('Introduction to MLOps'),
      lesson('Git & GitHub'),
      lesson('Python OOP for MLOps'),
      lesson('Data Versioning with DVC'),
      lesson('ML Pipeline with DVC & AWS S3', 'oYIBwbHM_PI'),
      lesson('MLflow | Experiment Tracking'),
      lesson('Continuous Integration'),
      lesson('Docker'),
      lesson('Project: Vehicle Insurance Domain'),
      lesson('MongoDB Setup & Notebook Experiment'),
      lesson('Data Ingestion Component'),
      lesson('Data Validation & Transformation'),
      lesson('Model Evaluation & AWS S3'),
      lesson('Building ML App with FastAPI'),
      lesson('Complete CI/CD on AWS'),
      lesson('Kubernetes Part 1'),
      lesson('Project: First Kubernetes Deployment'),
      lesson('Prometheus & Grafana'),
      lesson('Project: Prometheus-Grafana on Kubernetes'),
      lesson('Capstone Project: End-to-End MLOps'),
      lesson('Experiment Tracking with MLflow & DagsHub'),
      lesson('App Building & Automation with DVC'),
      lesson('CI/CD Implementation (Capstone)'),
      lesson('EKS Cluster Deployment'),
      lesson('Prometheus-Grafana on EKS'),
    ],
  },
  {
    id: 'bonus-lessons',
    index: 12,
    title: 'Bonus Lessons',
    shortTitle: 'Bonus',
    description: 'Advanced topics — training dynamics, activation functions, and cutting-edge reasoning architectures.',
    lessons: [
      lesson('Train LLM — Sequence Length vs Batch Size', 'bu5dhaLmr7E'),
      lesson('SwiGLU — Better Neural Networks', 'enPFr-WxHgQ'),
      lesson('100x AI Reasoning — Tiny Recursive Model', 'P9zzUM0PrBM'),
    ],
  },
];

function slugify(value: string) {
  return value
    .normalize('NFKD')
    .toLocaleLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const lessonSymbols: Record<string, string[]> = {
  'math-fundamentals': ['ƒ(x)', 'd/dx', 'v⃗', '∇', 'A', 'd·', '∂z/∂x', 'δ', 'J', '⊙', 'H', 'Dₖₗ', 'UΣVᵀ', 'EMA', '∑'],
  'core-ai-intuitions': ['a·b', 'σ(z)', '↗', '‖x‖'],
  'pytorch-fundamentals': ['T', '@', 'Tᵀ', '↔', '[i:j]', '⊕', 'Iₙ', 'T*', '7×'],
  'tensorflow-fundamentals': ['ŷ', 'Conv', 'PT', 'L', 'K', '↺', 'Σ', '10', 'Inc', 'TL', '▶', 'FT', 'δ', 'ε', 'Viz', 'MNIST', 'Dream', 'Style', 'GPU', 'RL', 'Est', 'TFRec', 'λ', 'NLP', 'MT', 'Cap', 't'],
  'neural-network-from-scratch': ['∑wx+b', 'L', 'NN', 'RMS', 'η', 'Adam', 'fθ'],
  transformers: ['QKᵀ', 'SA', 'GPT'],
  'reinforcement-learning': ['(s,a)', '∇J', 'Q', 'πθ', 'G'],
  'llm-from-scratch': ['L4', 'V3', 'Q3', 'Σ'],
  'write-research-paper': ['✎'],
  'fine-tuning': ['Δθ', 'BA', 'D', 'η', '✓'],
  mlops: ['∞', 'git', 'class', 'DVC', 'S3', 'MLf', 'CI', '◫', 'VI', 'DB', '↓', '✓→', 'Eval', 'API', 'CD', 'K8s', '⎈', 'P/G', '📈', 'E2E', 'DAG', 'DVC+', 'CI/CD', 'EKS', 'P/G+'],
  'bonus-lessons': ['L×B', 'Swi', 'ρ'],
};

// Exact topic element ids observed on the public AI overview, in curriculum order.
const sourceTopicAnchorIds = [
  'math-fundamentals-functions',
  'math-fundamentals-derivatives',
  'math-fundamentals-vectors',
  'math-fundamentals-gradients',
  'math-fundamentals-matrices',
  'math-fundamentals-derivation-rules',
  'math-fundamentals-chain-rule',
  'math-fundamentals-backprop-python',
  'math-fundamentals-jacobian-matrix',
  'math-fundamentals-hadamard-product',
  'math-fundamentals-entropy',
  'math-fundamentals-kl-divergence',
  'math-fundamentals-svd',
  'math-fundamentals-moving-averages',
  'math-fundamentals-more-math',
  'core-ai-intuitions-similarity-dot-product',
  'core-ai-intuitions-softmax',
  'core-ai-intuitions-tensor-broadcasting',
  'core-ai-intuitions-l1-l2-norms',
  'pytorch-fundamentals-creating-tensors',
  'pytorch-fundamentals-matrix-multiplication',
  'pytorch-fundamentals-transposing-tensors',
  'pytorch-fundamentals-flatten-reshape-view',
  'pytorch-fundamentals-indexing-slicing',
  'pytorch-fundamentals-cat-stack',
  'pytorch-fundamentals-special-tensors',
  'pytorch-fundamentals-new-full-lesson',
  'pytorch-fundamentals-7-pytorch-tasks',
  'tensorflow-fundamentals-simple-linear-model',
  'tensorflow-fundamentals-convolutional-neural-network',
  'tensorflow-fundamentals-pretty-tensor',
  'tensorflow-fundamentals-layers-api',
  'tensorflow-fundamentals-keras-api',
  'tensorflow-fundamentals-save-restore',
  'tensorflow-fundamentals-ensemble-learning',
  'tensorflow-fundamentals-cifar-10',
  'tensorflow-fundamentals-inception-model',
  'tensorflow-fundamentals-transfer-learning',
  'tensorflow-fundamentals-video-data',
  'tensorflow-fundamentals-fine-tuning-tf',
  'tensorflow-fundamentals-adversarial-examples',
  'tensorflow-fundamentals-adversarial-noise-mnist',
  'tensorflow-fundamentals-visual-analysis',
  'tensorflow-fundamentals-visual-analysis-mnist',
  'tensorflow-fundamentals-deep-dream',
  'tensorflow-fundamentals-style-transfer',
  'tensorflow-fundamentals-tf-gpu-cpu',
  'tensorflow-fundamentals-reinforcement-learning-tf',
  'tensorflow-fundamentals-estimator-api',
  'tensorflow-fundamentals-tfrecords-dataset-api',
  'tensorflow-fundamentals-hyperparameter-optimization',
  'tensorflow-fundamentals-nlp-sentiment',
  'tensorflow-fundamentals-machine-translation',
  'tensorflow-fundamentals-image-captioning',
  'tensorflow-fundamentals-timeseries-prediction',
  'neural-network-from-scratch-single-neuron',
  'neural-network-from-scratch-building-layer',
  'neural-network-from-scratch-implementing-network',
  'neural-network-from-scratch-rmsnorm',
  'neural-network-from-scratch-learning-rate-decay',
  'neural-network-from-scratch-adam-optimizer',
  'neural-network-from-scratch-neural-network-scratch',
  'transformers-attention-mechanism',
  'transformers-self-attention',
  'transformers-gpt-from-scratch',
  'reinforcement-learning-agents-environments',
  'reinforcement-learning-policy-gradients',
  'reinforcement-learning-deep-q-learning',
  'reinforcement-learning-ppo-llm-reasoning',
  'reinforcement-learning-qwen-deepseek-grpo',
  'llm-from-scratch-llama-4',
  'llm-from-scratch-deepseek-v3',
  'llm-from-scratch-qwen-3',
  'llm-from-scratch-self-study-llm',
  'write-research-paper-code-write-publish',
  'fine-tuning-why-finetune',
  'fine-tuning-lora',
  'fine-tuning-data-preparation',
  'fine-tuning-training-loop',
  'fine-tuning-evaluation',
  'mlops-intro-to-mlops',
  'mlops-git-github-mlops',
  'mlops-oops-python',
  'mlops-data-versioning-dvc',
  'mlops-ml-pipeline-dvc-aws',
  'mlops-mlflow-experiment-tracking',
  'mlops-continuous-integration',
  'mlops-docker-mlops',
  'mlops-project-1-vehicle-insurance',
  'mlops-mongodb-setup',
  'mlops-data-ingestion',
  'mlops-data-validation-transformation',
  'mlops-model-eval-aws-s3',
  'mlops-fastapi-ml-app',
  'mlops-cicd-aws',
  'mlops-kubernetes-part-1',
  'mlops-project-2-kubernetes',
  'mlops-prometheus-grafana',
  'mlops-project-3-monitoring',
  'mlops-capstone-project-1',
  'mlops-mlflow-dagshub',
  'mlops-app-building-automation-dvc',
  'mlops-cicd-implementation-capstone',
  'mlops-eks-cluster-deployment',
  'mlops-prometheus-grafana-eks',
  'bonus-lessons-seq-len-vs-batch',
  'bonus-lessons-swiglu',
  'bonus-lessons-tiny-recursive-model',
] as const;

const providedProLessonByAnchorId = new Map(
  providedProLessonSnapshots.map((snapshot) => [snapshot.topicAnchorId, snapshot]),
);

let globalLessonOrder = 0;

export const aiModules: AiCurriculumModule[] = moduleSeeds.map((module) => {
  const lessons = module.lessons.map((seed, lessonIndex): AiLessonRecord => {
    globalLessonOrder += 1;
    const suffix = seed.slugSuffix ?? slugify(seed.title);
    const slug = `${module.id}-${suffix}`;
    const publicSnapshot = seed.youtubeId
      ? publicAiLessonSnapshots.find((snapshot) => snapshot.youtubeId === seed.youtubeId)
      : undefined;
    const sourceTopicAnchorId = sourceTopicAnchorIds[globalLessonOrder - 1];
    const providedSnapshot = publicSnapshot ? undefined : providedProLessonByAnchorId.get(sourceTopicAnchorId);
    const sourcePath = publicSnapshot?.sourcePath ?? `/ai/overview#${sourceTopicAnchorId}`;
    return {
      id: `ai-${slug}`,
      slug,
      title: seed.title,
      kind: 'lesson',
      workspace: 'ai',
      section: module.id,
      route: `/ai/lessons/${slug}`,
      sourceUrl: `https://fanout.sh${sourcePath}`,
      provenanceCheckedAt: '2026-08-24',
      summary: publicSnapshot?.summary,
      tags: [module.shortTitle, seed.title],
      moduleId: module.id,
      moduleIndex: module.index,
      lessonNumber: lessonIndex + 1,
      order: globalLessonOrder,
      symbol: lessonSymbols[module.id]?.[lessonIndex] ?? String(lessonIndex + 1),
      publicContent: Boolean(publicSnapshot),
      contentOrigin: publicSnapshot ? 'fanout-public' : providedSnapshot ? 'user-provided' : 'fanout-overview',
      sourceHeading: publicSnapshot?.heading,
      youtubeEmbedUrl: publicSnapshot
        ? `https://www.youtube-nocookie.com/embed/${publicSnapshot.youtubeId}`
        : providedSnapshot?.youtubeId
          ? `https://www.youtube-nocookie.com/embed/${providedSnapshot.youtubeId}`
          : undefined,
      notes: (publicSnapshot?.notes ?? providedSnapshot?.notes ?? []).map((body) => ({ body })),
    };
  });
  return {
    id: module.id,
    index: module.index,
    title: module.title,
    shortTitle: module.shortTitle,
    description: module.description,
    lessons,
    lessonIds: lessons.map((currentLesson) => currentLesson.id),
  };
});

export const aiLessons = aiModules.flatMap((module) => module.lessons);

export const aiLessonBySlug = new Map(aiLessons.map((currentLesson) => [currentLesson.slug, currentLesson]));

export const publicAiYoutubeIds = aiLessons
  .filter((currentLesson) => currentLesson.publicContent)
  .map((currentLesson) => currentLesson.youtubeEmbedUrl?.split('/').at(-1))
  .filter((videoId): videoId is string => Boolean(videoId));

export function getAiLessonNeighbors(slug: string) {
  const index = aiLessons.findIndex((currentLesson) => currentLesson.slug === slug);
  if (index < 0) return { previous: null, next: null };
  return {
    previous: aiLessons[index - 1] ?? null,
    next: aiLessons[index + 1] ?? null,
  };
}
