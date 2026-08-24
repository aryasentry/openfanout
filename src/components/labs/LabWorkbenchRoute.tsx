'use client';

import { labBySlug } from '../../content/labs';
import { useProgress } from '../../lib/progress/useProgress';
import { LabWorkbench, persistedLabValues } from './LabWorkbench';

export function LabWorkbenchRoute({ slug }: { slug: string }) {
  const lab = labBySlug.get(slug);
  const { progress, ready } = useProgress();
  if (!lab || !ready) return null;
  return <LabWorkbench lab={lab} initialValues={persistedLabValues(lab, progress.labState)} />;
}
