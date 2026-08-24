'use client';

import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { LabRecord } from '../../content/labs';
import { useProgress } from '../../lib/progress/useProgress';
import styles from './Labs.module.css';

export function defaultLabValues(lab: LabRecord) {
  return Object.fromEntries(lab.inputs.map((input) => [input.key, input.defaultValue]));
}

export function persistedLabValues(lab: LabRecord, labState: Record<string, unknown>) {
  const saved = labState[lab.id];
  return saved && typeof saved === 'object' ? { ...defaultLabValues(lab), ...(saved as Record<string, number>) } : defaultLabValues(lab);
}

export function LabWorkbench({ lab, initialValues }: { lab: LabRecord; initialValues?: Record<string, number> }) {
  const { progress, updateProgress } = useProgress();
  const [values, setValues] = useState<Record<string, number>>(() => initialValues ?? persistedLabValues(lab, progress.labState));
  const metrics = useMemo(() => lab.compute(values), [lab, values]);

  const setInput = (key: string, value: number) => {
    const next = { ...values, [key]: value };
    setValues(next);
    void updateProgress({ labState: { ...progress.labState, [lab.id]: next }, lastRoute: lab.route });
  };

  const reset = () => {
    const next = defaultLabValues(lab);
    setValues(next);
    void updateProgress({ labState: { ...progress.labState, [lab.id]: next }, lastRoute: lab.route });
  };

  return (
    <main id="main-content" className={styles.workbenchMain}>
      <Link className={styles.backLink} href="/labs"><ArrowLeft size={14} /> All labs</Link>
      <header className={styles.labHeader}><span>{lab.symbol}</span><div><p>Interactive lab</p><h1>{lab.title}</h1><strong>{lab.question}</strong></div></header>

      <div className={styles.workbenchGrid}>
        <section className={styles.controls} aria-labelledby="inputs-title">
          <header><h2 id="inputs-title">Inputs</h2><button type="button" onClick={reset}><RotateCcw size={13} /> Reset</button></header>
          <div>
            {lab.inputs.map((input) => (
              <label key={input.key}>
                <span>{input.label}<small>{input.unit}</small></span>
                <input type="number" aria-label={input.label} min={input.min} max={input.max} step={input.step} value={values[input.key]} onChange={(event) => setInput(input.key, Number(event.target.value))} />
                <input type="range" aria-label={`${input.label} slider`} min={input.min} max={input.max} step={input.step} value={values[input.key]} onChange={(event) => setInput(input.key, Number(event.target.value))} />
              </label>
            ))}
          </div>
        </section>

        <section className={styles.outputs} aria-labelledby="outputs-title">
          <header><p>Live calculation</p><h2 id="outputs-title">Outputs</h2></header>
          <div className={styles.metricGrid}>
            {metrics.map((currentMetric) => (
              <article data-testid={`metric-${currentMetric.id}`} key={currentMetric.id}><small>{currentMetric.label}</small><strong>{currentMetric.value}</strong><p>{currentMetric.detail}</p></article>
            ))}
          </div>
          <div className={styles.explanation}><h3>How to use this result</h3><p>Change one input at a time, predict the direction of change before editing it, and then explain the output using the units shown. These deterministic calculations are teaching models; validate production decisions with measured workload data.</p></div>
        </section>
      </div>
    </main>
  );
}
