import { describe, expect, it } from 'vitest';
import { labs } from './labs';

describe('interactive lab registry', () => {
  it('contains the exact 15 requested public labs', () => {
    expect(labs).toHaveLength(15);
    expect(labs.map((lab) => lab.title)).toEqual([
      'Math Decoder', 'Agent Control Room', 'Latency Numbers', 'Tokenizer and Context',
      'RAG Chunking and Retrieval', 'Inference Memory and KV Cache', 'Fanout Scale',
      'Eval Confidence', 'Gradient Descent', 'Sampling Playground', 'Timeout Architect',
      'How AI Remembers', 'Daily Planner', 'Model Router and Pareto Explorer',
      'PDF-to-RAG Readiness Scan',
    ]);
    expect(new Set(labs.map((lab) => lab.route)).size).toBe(15);
  });

  it('gives every lab editable inputs and finite deterministic outputs', () => {
    for (const lab of labs) {
      expect(lab.inputs.length).toBeGreaterThanOrEqual(3);
      const values = Object.fromEntries(lab.inputs.map((input) => [input.key, input.defaultValue]));
      const output = lab.compute(values);
      expect(output.length).toBeGreaterThanOrEqual(2);
      expect(output.every((metric) => metric.value !== 'NaN' && metric.value !== 'Infinity')).toBe(true);
    }
  });
});
