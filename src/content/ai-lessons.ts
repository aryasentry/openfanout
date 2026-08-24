import type { CurriculumModule, LessonRecord } from './schema';

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
  duration: string;
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
    description: 'Build the mathematical language used to describe models, optimization, and information.',
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
    description: 'Develop intuition for the small tensor operations that repeatedly appear inside learning systems.',
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
    description: 'Practice the tensor transformations needed to implement and debug neural networks in PyTorch.',
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
    description: 'Move from first TensorFlow models to vision, sequence modeling, optimization, and deployment-oriented APIs.',
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
    description: 'Assemble neurons, layers, normalization, learning rates, and optimizers into a trainable network.',
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
    description: 'Trace the path from attention scores to self-attention blocks and a compact GPT implementation.',
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
    description: 'Connect agents and environments to value learning, policy gradients, PPO, and modern reasoning methods.',
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
    description: 'Study recent language-model architectures by rebuilding their important components and training choices.',
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
    description: 'Turn an experimental question into reproducible code, clear evidence, and a publishable technical narrative.',
    lessons: [lesson('Code, Write & Publish AI Research Paper', 'O2yAMJu8LpI')],
  },
  {
    id: 'fine-tuning',
    index: 10,
    title: 'How to Fine-Tune Models',
    shortTitle: 'Fine-Tuning',
    description: 'Plan a fine-tuning run from task definition and data preparation through evaluation and deployment.',
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
    description: 'Build a production path across version control, pipelines, containers, cloud delivery, and observability.',
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
    description: 'Investigate selected training tradeoffs, activation design, and compact reasoning architectures.',
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

function buildNotes(title: string, moduleTitle: string) {
  return [
    {
      heading: 'Concept map',
      body: `${title} sits inside ${moduleTitle}. Start by naming the inputs, the transformation being performed, and the observable output before introducing implementation details.`,
    },
    {
      heading: 'Working method',
      body: `Build the smallest inspectable example of ${title}. Record tensor shapes, assumptions, and intermediate values so a wrong result can be traced to a specific step.`,
    },
    {
      heading: 'Practice checkpoint',
      body: `Explain ${title} without jargon, create one boundary-case example, and state how you would verify the result in code or with a numerical check.`,
    },
  ];
}

let globalLessonOrder = 0;

export const aiModules: AiCurriculumModule[] = moduleSeeds.map((module) => {
  const lessons = module.lessons.map((seed, lessonIndex): AiLessonRecord => {
    globalLessonOrder += 1;
    const suffix = seed.slugSuffix ?? slugify(seed.title);
    const slug = `${module.id}-${suffix}`;
    return {
      id: `ai-${slug}`,
      slug,
      title: seed.title,
      kind: 'lesson',
      workspace: 'ai',
      section: module.id,
      route: `/ai/lessons/${slug}`,
      sourceUrl: `https://fanout.sh/ai/lessons/${slug}`,
      provenanceCheckedAt: '2026-08-24',
      summary: `A focused openFanout study note for ${seed.title}, positioned within ${module.title}.`,
      tags: [module.shortTitle, seed.title],
      moduleId: module.id,
      moduleIndex: module.index,
      lessonNumber: lessonIndex + 1,
      order: globalLessonOrder,
      duration: `${8 + (globalLessonOrder % 9)} min`,
      youtubeEmbedUrl: seed.youtubeId ? `https://www.youtube-nocookie.com/embed/${seed.youtubeId}` : undefined,
      notes: buildNotes(seed.title, module.title),
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
