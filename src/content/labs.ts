import type { CatalogRecord } from './schema';

export interface LabInput {
  key: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface LabMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
}

export interface LabRecord extends CatalogRecord {
  kind: 'lab';
  workspace: 'labs';
  symbol: string;
  question: string;
  inputs: LabInput[];
  compute(values: Record<string, number>): LabMetric[];
}

const input = (key: string, label: string, defaultValue: number, min: number, max: number, step: number, unit?: string): LabInput => ({ key, label, defaultValue, min, max, step, unit });
const metric = (id: string, label: string, value: string, detail: string): LabMetric => ({ id, label, value, detail });
const number = (values: Record<string, number>, key: string) => Number(values[key] ?? 0);
const compact = (value: number, digits = 1) => new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);

function lab(slug: string, title: string, symbol: string, question: string, inputs: LabInput[], compute: LabRecord['compute']): LabRecord {
  return {
    id: `lab-${slug}`, slug, title, symbol, question, inputs, compute,
    kind: 'lab', workspace: 'labs', section: 'interactive', route: `/labs/${slug}`,
    sourceUrl: `https://fanout.sh/labs/${slug}`, provenanceCheckedAt: '2026-08-24',
    summary: `An original local simulator for ${title.toLocaleLowerCase()}, with editable inputs and deterministic outputs.`,
    tags: ['interactive', title],
  };
}

export const labs: LabRecord[] = [
  lab('math-decoder', 'Math Decoder', 'Σ?', 'How complex is the notation tree before you interpret its semantics?', [
    input('terms', 'Terms', 5, 1, 100, 1), input('operators', 'Operators', 3, 0, 100, 1), input('groups', 'Nested groups', 2, 0, 20, 1),
  ], (v) => [
    metric('parse-nodes', 'Parse nodes', compact(number(v, 'terms') + number(v, 'operators') + number(v, 'groups')), 'A rough syntax-tree node count.'),
    metric('reading-passes', 'Suggested passes', compact(Math.max(1, number(v, 'groups') + 1)), 'Read scope from the outside inward, then resolve operators.'),
  ]),
  lab('agent-control-room', 'Agent Control Room', 'A×N', 'How much useful work survives retries and agent failures?', [
    input('agents', 'Agents', 4, 1, 64, 1), input('tasks', 'Tasks', 40, 1, 1000, 1), input('minutes', 'Minutes per task', 8, 1, 240, 1), input('failure', 'Failure rate', 5, 0, 100, 1, '%'),
  ], (v) => {
    const waves = Math.ceil(number(v, 'tasks') / number(v, 'agents'));
    return [metric('wall-time', 'Ideal wall time', `${compact(waves * number(v, 'minutes'))} min`, 'Tasks divided into parallel agent waves.'), metric('expected-retries', 'Expected retries', compact(number(v, 'tasks') * number(v, 'failure') / 100), 'Average failed tasks requiring another attempt.')];
  }),
  lab('latency-numbers', 'Latency Numbers', 'p99', 'Does arrival rate fit inside the available service capacity?', [
    input('qps', 'Requests per second', 30, 1, 10000, 1), input('service', 'Service time', 80, 1, 10000, 1, 'ms'), input('workers', 'Concurrent workers', 4, 1, 1000, 1),
  ], (v) => {
    const utilization = number(v, 'qps') * number(v, 'service') / 1000 / number(v, 'workers');
    return [metric('utilization', 'Worker utilization', `${compact(utilization * 100)}%`, 'Arrival work divided by available worker-seconds.'), metric('headroom', 'Capacity headroom', `${compact(Math.max(0, 1 - utilization) * 100)}%`, utilization >= 1 ? 'Demand exceeds nominal capacity.' : 'Unused nominal service capacity.')];
  }),
  lab('tokenizer-context', 'Tokenizer and Context', 'tok', 'How much of the model context does the source text consume?', [
    input('characters', 'Input characters', 24000, 100, 2000000, 100), input('charsPerToken', 'Characters per token', 4, 1, 12, .1), input('context', 'Context window', 8192, 256, 2000000, 256, 'tokens'),
  ], (v) => {
    const tokens = number(v, 'characters') / number(v, 'charsPerToken');
    return [metric('tokens', 'Estimated tokens', compact(tokens, 0), 'Characters divided by the assumed tokenizer ratio.'), metric('context-use', 'Context used', `${compact(tokens / number(v, 'context') * 100)}%`, 'Prompt tokens relative to the context window.')];
  }),
  lab('rag-chunking', 'RAG Chunking and Retrieval', 'RAG', 'How many chunks and repeated tokens does an overlap policy create?', [
    input('tokens', 'Document tokens', 50000, 100, 5000000, 100), input('chunk', 'Chunk size', 800, 50, 8000, 50, 'tokens'), input('overlap', 'Overlap', 120, 0, 4000, 10, 'tokens'),
  ], (v) => {
    const stride = Math.max(1, number(v, 'chunk') - number(v, 'overlap'));
    const chunks = Math.max(1, Math.ceil((number(v, 'tokens') - number(v, 'overlap')) / stride));
    return [metric('chunks', 'Chunk count', compact(chunks, 0), 'Ceiling of document coverage by the effective stride.'), metric('duplicate-tokens', 'Repeated tokens', compact(Math.max(0, chunks - 1) * number(v, 'overlap'), 0), 'Overlap copied into adjacent chunks.')];
  }),
  lab('kv-cache', 'Inference Memory and KV Cache', 'KV', 'How much decoder memory is consumed by cached keys and values?', [
    input('layers', 'Layers', 32, 1, 256, 1), input('heads', 'KV heads', 8, 1, 128, 1), input('headDim', 'Head dimension', 128, 8, 512, 8), input('context', 'Context tokens', 8192, 128, 1000000, 128), input('bytes', 'Bytes per element', 2, 0.5, 4, .5),
  ], (v) => {
    const bytes = 2 * number(v, 'layers') * number(v, 'heads') * number(v, 'headDim') * number(v, 'context') * number(v, 'bytes');
    return [metric('total-kv', 'Total KV cache', `${compact(bytes / 2 ** 30, 2)} GiB`, 'Two tensors, key and value, across every layer.'), metric('per-token', 'Memory per token', `${compact(bytes / number(v, 'context') / 2 ** 20, 2)} MiB`, 'Incremental cache growth for one sequence token.')];
  }),
  lab('back-of-the-envelope', 'Fanout Scale', '10ˣ', 'What traffic and replica load follow from a simple usage model?', [
    input('users', 'Daily users', 100000, 1, 1000000000, 1000), input('requests', 'Requests per user', 20, 1, 10000, 1), input('peak', 'Peak multiplier', 4, 1, 20, .5), input('replicas', 'Replicas', 12, 1, 10000, 1),
  ], (v) => {
    const average = number(v, 'users') * number(v, 'requests') / 86400;
    const peak = average * number(v, 'peak');
    return [metric('peak-qps', 'Peak QPS', compact(peak), 'Average daily traffic multiplied by the peak factor.'), metric('replica-qps', 'QPS per replica', compact(peak / number(v, 'replicas')), 'Peak load divided evenly across replicas.')];
  }),
  lab('eval-confidence', 'Eval Confidence', '±', 'How wide is the uncertainty interval around an observed accuracy?', [
    input('samples', 'Evaluation samples', 1000, 10, 10000000, 10), input('accuracy', 'Observed accuracy', 80, 1, 99.9, .1, '%'), input('z', 'Z score', 1.96, 1, 3.5, .01),
  ], (v) => {
    const p = number(v, 'accuracy') / 100;
    const margin = number(v, 'z') * Math.sqrt(p * (1 - p) / number(v, 'samples'));
    return [metric('margin', 'Margin', `±${compact(margin * 100, 2)} pts`, 'Normal-approximation uncertainty for a proportion.'), metric('interval', 'Interval', `${compact((p - margin) * 100, 2)}–${compact((p + margin) * 100, 2)}%`, 'Observed accuracy plus or minus the margin.')];
  }),
  lab('gradient-descent', 'Gradient Descent', 'θ←', 'How quickly does gradient descent shrink a one-dimensional quadratic error?', [
    input('start', 'Starting parameter', 10, -100, 100, .5), input('learningRate', 'Learning rate', .1, .001, .99, .001), input('curvature', 'Curvature', 1, .01, 10, .01), input('steps', 'Steps', 20, 1, 1000, 1),
  ], (v) => {
    const factor = 1 - number(v, 'learningRate') * number(v, 'curvature');
    const theta = number(v, 'start') * factor ** number(v, 'steps');
    return [metric('parameter', 'Final parameter', compact(theta, 5), 'Closed-form iterate for a centered quadratic.'), metric('loss', 'Final loss', compact(.5 * number(v, 'curvature') * theta ** 2, 6), 'Quadratic objective after the selected number of steps.')];
  }),
  lab('sampling-playground', 'Sampling Playground', 'T/p', 'How do temperature and top-p change an approximate next-token choice set?', [
    input('vocabulary', 'Vocabulary size', 50000, 10, 1000000, 10), input('temperature', 'Temperature', 1, .05, 3, .05), input('topP', 'Top-p', .9, .05, 1, .01), input('concentration', 'Logit concentration', 12, 1, 100, 1),
  ], (v) => {
    const candidates = Math.max(1, Math.round(number(v, 'vocabulary') * number(v, 'topP') * Math.min(1, number(v, 'temperature')) / number(v, 'concentration')));
    return [metric('candidate-set', 'Approx. candidate set', compact(candidates, 0), 'A teaching approximation, not a model-independent identity.'), metric('randomness', 'Relative randomness', `${compact(number(v, 'temperature') * number(v, 'topP') * 100)}%`, 'Combined temperature and nucleus breadth indicator.')];
  }),
  lab('timeout-architect', 'Timeout Architect', '⌛', 'Does the retry policy fit inside the end-to-end deadline?', [
    input('timeout', 'Attempt timeout', 800, 10, 60000, 10, 'ms'), input('retries', 'Retries', 2, 0, 10, 1), input('backoff', 'Backoff per retry', 200, 0, 10000, 10, 'ms'), input('budget', 'End-to-end budget', 3000, 10, 120000, 10, 'ms'),
  ], (v) => {
    const attempts = number(v, 'retries') + 1;
    const worst = attempts * number(v, 'timeout') + number(v, 'backoff') * number(v, 'retries') * (number(v, 'retries') + 1) / 2;
    return [metric('worst-case', 'Worst-case latency', `${compact(worst)} ms`, 'Attempt timeouts plus linear retry backoff.'), metric('budget-status', 'Budget status', worst <= number(v, 'budget') ? 'Fits' : 'Exceeds', `${compact(Math.abs(number(v, 'budget') - worst))} ms ${worst <= number(v, 'budget') ? 'headroom' : 'over budget'}.`)];
  }),
  lab('how-ai-remembers', 'How AI Remembers', 'M', 'How many prior turns fit after system and response reservations?', [
    input('context', 'Context window', 32768, 1024, 2000000, 1024, 'tokens'), input('system', 'System and tools', 3000, 0, 200000, 100, 'tokens'), input('response', 'Response reserve', 4000, 128, 200000, 128, 'tokens'), input('turn', 'Tokens per turn', 900, 10, 50000, 10),
  ], (v) => {
    const available = Math.max(0, number(v, 'context') - number(v, 'system') - number(v, 'response'));
    return [metric('available-context', 'History budget', `${compact(available, 0)} tokens`, 'Context remaining after fixed reservations.'), metric('retained-turns', 'Approx. retained turns', compact(Math.floor(available / number(v, 'turn')), 0), 'Whole average turns that fit in the history budget.')];
  }),
  lab('daily-planner', 'Daily Planner', '▦', 'How much focused work fits around tasks and recovery breaks?', [
    input('hours', 'Available hours', 8, .5, 24, .5), input('focus', 'Focus block', 50, 10, 180, 5, 'min'), input('break', 'Break', 10, 0, 60, 5, 'min'), input('tasks', 'Priority tasks', 5, 1, 30, 1),
  ], (v) => {
    const sessions = Math.floor(number(v, 'hours') * 60 / (number(v, 'focus') + number(v, 'break')));
    return [metric('sessions', 'Focus sessions', compact(sessions, 0), 'Whole focus-plus-break cycles in the available day.'), metric('task-budget', 'Sessions per task', compact(sessions / number(v, 'tasks'), 1), 'Average focus blocks available for each priority task.')];
  }),
  lab('model-router-and-pareto-explorer', 'Model Router and Pareto Explorer', '⇄', 'Which candidate wins under explicit quality, latency, and cost weights?', [
    input('qualityWeight', 'Quality weight', 60, 0, 100, 1, '%'), input('latencyWeight', 'Latency weight', 25, 0, 100, 1, '%'), input('costWeight', 'Cost weight', 15, 0, 100, 1, '%'), input('traffic', 'Daily requests', 100000, 1, 1000000000, 1000),
  ], (v) => {
    const total = Math.max(1, number(v, 'qualityWeight') + number(v, 'latencyWeight') + number(v, 'costWeight'));
    const fast = (78 * number(v, 'qualityWeight') + 92 * number(v, 'latencyWeight') + 90 * number(v, 'costWeight')) / total;
    const strong = (94 * number(v, 'qualityWeight') + 58 * number(v, 'latencyWeight') + 45 * number(v, 'costWeight')) / total;
    return [metric('winner', 'Weighted winner', fast >= strong ? 'Fast model' : 'Strong model', `Scores: ${compact(fast)} vs ${compact(strong)}.`), metric('daily-volume', 'Daily routed volume', compact(number(v, 'traffic'), 0), 'Requests evaluated under the selected policy.')];
  }),
  lab('pdf-to-rag-readiness-scan', 'PDF-to-RAG Readiness Scan', 'PDF', 'What extraction and chunking workload follows from a document collection?', [
    input('pages', 'Pages', 240, 1, 100000, 1), input('characters', 'Characters per page', 2200, 100, 10000, 100), input('ocr', 'OCR quality', 92, 1, 100, 1, '%'), input('chunk', 'Chunk tokens', 700, 50, 4000, 50),
  ], (v) => {
    const tokens = number(v, 'pages') * number(v, 'characters') / 4;
    const chunks = Math.ceil(tokens / number(v, 'chunk'));
    const score = Math.max(0, Math.min(100, number(v, 'ocr') - (number(v, 'pages') > 1000 ? 8 : 0)));
    return [metric('estimated-chunks', 'Estimated chunks', compact(chunks, 0), 'Character-to-token estimate divided by target chunk size.'), metric('readiness', 'Readiness score', `${compact(score, 0)}/100`, 'OCR quality with a scale penalty for very large collections.')];
  }),
];

export const labBySlug = new Map(labs.map((currentLab) => [currentLab.slug, currentLab]));
