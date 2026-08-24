import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'src/content/ai-pro-lessons-source.txt');
const outputPath = path.join(root, 'src/content/ai-pro-lessons.json');

const specs = [
  ['math-fundamentals-derivation-rules', 'youtube.com/watch?v=S0_qX4VJhMQ', 'S0_qX4VJhMQ', 'derivation rules and examples'],
  ['math-fundamentals-chain-rule', 'the chain rule', 'YG15m2VwSjA'],
  ['math-fundamentals-backprop-python', 'backprop in python', '76o6sM4aqXU'],
  ['math-fundamentals-jacobian-matrix', 'The jacobian matrix', 'Rw3cImDy20s'],
  ['math-fundamentals-entropy', 'Entropy and information theory', 'YtebGVx-Fxw'],
  ['math-fundamentals-kl-divergence', 'KL divergence', 'SxGYPqCgJWM'],
  ['math-fundamentals-svd', 'SVD', 'mBcLRGuAFUk'],
  ['math-fundamentals-more-math', 'more math lessons', 'xDXyepdjfMs'],
  ['core-ai-intuitions-similarity-dot-product', 'similarity with dot product', 'B2ZSC9228ak'],
  ['core-ai-intuitions-softmax', 'softmax probabilities', 'KpKog-L9veg'],
  ['core-ai-intuitions-tensor-broadcasting', 'Tensor broadcasting', 'QscEWm0QTRY'],
  ['core-ai-intuitions-l1-l2-norms', 'L1 vs L2 norms', 'It2g7sDxdqI'],
  ['pytorch-fundamentals-creating-tensors', 'creating tensors', 'AglLTlms7HU'],
  ['pytorch-fundamentals-matrix-multiplication', 'Matrix multiplication', 'yMScmAOD8IE'],
  ['pytorch-fundamentals-transposing-tensors', 'transposing tensors', 'cCQgZiljON4'],
  ['pytorch-fundamentals-flatten-reshape-view', 'flatten,reshape,squeeze,unsqueeze,view', 'fCVuiW9AFzY'],
  ['pytorch-fundamentals-indexing-slicing', 'indexing and slicing', '2t9iboeKJ2c'],
  ['pytorch-fundamentals-cat-stack', 'cat,stack', 'kF2AlpykJGY'],
  ['pytorch-fundamentals-special-tensors', 'special tensors', '_ZeNgwkrD1U'],
  ['pytorch-fundamentals-new-full-lesson', 'New full lesson', 'n_Kib2Gj39w'],
  ['tensorflow-fundamentals-simple-linear-model', 'simple linear model', 'wuo4JdG3SvU'],
  ['tensorflow-fundamentals-convolutional-neural-network', 'CNN', 'HMcx-zY8JSg'],
  ['tensorflow-fundamentals-pretty-tensor', 'Pretty Tensor', 'GCUfJQ_dec8'],
  ['tensorflow-fundamentals-layers-api', 'Layers API', 'iYQNU2O8k3g'],
  ['tensorflow-fundamentals-keras-api', 'Keras API', 'pAhPiF3yiXI'],
  ['tensorflow-fundamentals-save-restore', 'Save and restore', 'HxtBIwfy0kM'],
  ['tensorflow-fundamentals-ensemble-learning', 'Ensemble Learning', 'AVKZrPCW91A'],
  ['tensorflow-fundamentals-cifar-10', 'CIFAR 10', '7HPwo4wnJeA'],
  ['tensorflow-fundamentals-inception-model', 'Inception model', 'KfV8CJh7hE0'],
  ['tensorflow-fundamentals-transfer-learning', 'Transfer learning', 'FQM13HkEfBk'],
  ['tensorflow-fundamentals-video-data', 'Video data', 'DjQFwJGnRDY'],
  ['tensorflow-fundamentals-fine-tuning-tf', 'Fine tuning', 'dGuY1ytu1zs'],
  ['tensorflow-fundamentals-adversarial-examples', 'Adversarial Examples', '4rFOkpI0Lcg'],
  ['tensorflow-fundamentals-adversarial-noise-mnist', 'Adversarial Noise for MNIST', 'ogP5Ehh_4Rk'],
  ['tensorflow-fundamentals-visual-analysis', 'Visual analysis', 'McgxRxi2Jqo'],
  ['tensorflow-fundamentals-visual-analysis-mnist', 'Visual analysis for MNIST', 'elPTCt45ZGo'],
  ['tensorflow-fundamentals-deep-dream', 'Deep Dream', 'BsSmBPmPeYQ'],
  ['tensorflow-fundamentals-style-transfer', 'Style transfer', 'bFeltWvzZpQ'],
  ['tensorflow-fundamentals-tf-gpu-cpu', 'Tensorflow CPU vs GPU', 'e2VfNscJJUM'],
  ['tensorflow-fundamentals-reinforcement-learning-tf', 'Reinforcement Learning', 'Vz5l886eptw'],
  ['tensorflow-fundamentals-estimator-api', 'Estimator API', 'BhQW2OLzx_c'],
  ['tensorflow-fundamentals-tfrecords-dataset-api', 'TFRecords & Dataset API', 'oxrcZ9uUblI'],
  ['tensorflow-fundamentals-hyperparameter-optimization', 'Hyper Parameter optimization', 'M-NTkxfd7-8'],
  ['tensorflow-fundamentals-nlp-sentiment', 'NLP', 'DDByc9LyMV8'],
  ['tensorflow-fundamentals-machine-translation', 'Machine translation', 'L8HKweZIOmg'],
  ['tensorflow-fundamentals-image-captioning', 'Image captioning', 'uCSTpOLMC48'],
  ['tensorflow-fundamentals-timeseries-prediction', 'Time series prediction', '94PlBzgeq90'],
  ['neural-network-from-scratch-single-neuron', 'Single neutron from scratch', 'G2kER-3wmKQ'],
  ['neural-network-from-scratch-building-layer', 'Building a Layer', 'amdpmuR4hrU'],
  ['neural-network-from-scratch-implementing-network', 'Implementing a network', 'w8yWXqWQYmU'],
  ['neural-network-from-scratch-rmsnorm', 'RMS Norm', '57kd8l6Wp-4'],
  ['neural-network-from-scratch-learning-rate-decay', 'Learning rate, decay', 'QzulmoOg2JE'],
  ['neural-network-from-scratch-adam-optimizer', 'Adam optimizer', 'JXQT_vxqwIs'],
  ['neural-network-from-scratch-neural-network-scratch', 'Neural network from scratch', 'tWcH9LQKIPY'],
  ['transformers-attention-mechanism', 'Attention mechanism explained', 'PSs6nxngL6k'],
  ['transformers-self-attention', 'Self attention from scratch', 'LWMzyfvuehA'],
  ['transformers-gpt-from-scratch', 'GPT from scratch', 'kCc8FmEb1nY'],
  ['reinforcement-learning-agents-environments', 'Agents & Environments', 'bf0Nge-qdfo'],
  ['reinforcement-learning-policy-gradients', 'Policy Gradients (REINFORCE)', 'KHZVXao4qXs'],
  ['reinforcement-learning-deep-q-learning', 'Deep Q-Learning (DQN)', 'cVzvNZOBaJ4'],
  ['skip-ppo', 'PPO, LLM Reasoning, Importance Ratio, Advantage', 'TjHH_--7l8g', null, true],
  ['skip-qwen-grpo', 'Qwen 3 GSPO & DeepSeek GRPO — LLM Reasoning', 'L94MdLdP21s', null, true],
  ['llm-from-scratch-deepseek-v3', 'Deepseek v3 from scratch', 'TfEG0TwueTs'],
  ['llm-from-scratch-qwen-3', 'Qwen 3 from scratch', 'wM-KP_wNAeY'],
  ['llm-from-scratch-self-study-llm', 'Self study LLM', 'Fg8urTOImpY'],
  ['fine-tuning-why-finetune', 'Why fine-tune', '00Q0G84kq3M'],
  ['fine-tuning-lora', 'Lora and Qlora', 't1caDsMzWBk'],
  ['fine-tuning-data-preparation', 'Data preparation', 'epsaFNREHos'],
  ['fine-tuning-training-loop', 'Training and hyper parameters', 'u--UVvH-LIQ'],
  ['fine-tuning-evaluation', 'Evaluation and deployment'],
];

const moduleHeaders = new Set([
  'pytorch fundamentals',
  'tensor flow fundmentals',
  'neural networks from scratch',
  'transformers',
  'reinforcement learning',
  '07',
  'llm from scratch',
  'how to fine tune models',
]);

const normalized = fs.readFileSync(sourcePath, 'utf8')
  .replace(/[\u2028\u2029]/g, '\n')
  .replace(/\u00a0/g, ' ')
  .replace(/\r/g, '');

let cursor = 0;
const located = specs.map((spec) => {
  const marker = spec[1];
  const position = normalized.toLocaleLowerCase().indexOf(marker.toLocaleLowerCase(), cursor);
  if (position < 0) throw new Error(`Missing marker: ${marker}`);
  cursor = position + marker.length;
  return { spec, position };
});

const pureYoutubeUrl = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[A-Za-z0-9_-]+(?:[^\s]*)?$/i;
const output = located.flatMap(({ spec, position }, index) => {
  const [topicAnchorId, marker, youtubeId, extraMarker, skip] = spec;
  if (skip) return [];
  const end = located[index + 1]?.position ?? normalized.length;
  const markerNames = new Set([marker, extraMarker].filter(Boolean).map((value) => value.toLocaleLowerCase()));
  const notes = normalized.slice(position, end)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^(?:\*\s*)?·$/.test(line))
    .filter((line) => !pureYoutubeUrl.test(line))
    .filter((line) => !markerNames.has(line.toLocaleLowerCase()))
    .filter((line) => !moduleHeaders.has(line.toLocaleLowerCase()));

  return [{ topicAnchorId, ...(youtubeId ? { youtubeId } : {}), notes }];
});

if (output.length !== 68) throw new Error(`Expected 68 supplied topics, received ${output.length}`);
if (output.filter((entry) => entry.youtubeId).length !== 67) throw new Error('Expected 67 supplied primary videos');

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Wrote ${output.length} supplied Pro topics to ${path.relative(root, outputPath)}`);
