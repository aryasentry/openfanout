export interface AiModuleSummary {
  id: string;
  index: number;
  title: string;
  lessonCount: number;
}

export const aiModuleSummaries: AiModuleSummary[] = [
  { id: 'math-fundamentals', index: 1, title: 'Math Fundamentals', lessonCount: 15 },
  { id: 'core-ai-intuitions', index: 2, title: 'Core AI Intuitions', lessonCount: 4 },
  { id: 'pytorch-fundamentals', index: 3, title: 'PyTorch Fundamentals', lessonCount: 9 },
  { id: 'tensorflow-fundamentals', index: 4, title: 'TensorFlow Fundamentals', lessonCount: 27 },
  { id: 'neural-network-from-scratch', index: 5, title: 'Neural Network from Scratch', lessonCount: 7 },
  { id: 'transformers', index: 6, title: 'Transformers', lessonCount: 3 },
  { id: 'reinforcement-learning', index: 7, title: 'Reinforcement Learning', lessonCount: 5 },
  { id: 'llm-from-scratch', index: 8, title: 'LLM From Scratch', lessonCount: 4 },
  { id: 'write-research-paper', index: 9, title: 'Write Research Paper', lessonCount: 1 },
  { id: 'fine-tuning', index: 10, title: 'How to Fine-Tune Models', lessonCount: 5 },
  { id: 'mlops', index: 11, title: 'Machine Learning Operations', lessonCount: 25 },
  { id: 'bonus-lessons', index: 12, title: 'Bonus Lessons', lessonCount: 3 },
];

export const mathPreviewLessons = [
  { index: '01.01', title: 'Functions', detail: 'Variables, mappings, composition, and inverses.', duration: '8 min' },
  { index: '01.02', title: 'Derivatives', detail: 'Rates of change and the slopes models optimize.', duration: '10 min' },
  { index: '01.03', title: 'Vectors', detail: 'Coordinates, direction, magnitude, and model representations.', duration: '12 min' },
];
