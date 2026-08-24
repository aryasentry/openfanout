'use client';

import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createProgressStore } from './storage';
import { createEmptyProgress, type ProgressPatch, type ProgressSnapshot } from './types';

interface ProgressContextValue {
  progress: ProgressSnapshot;
  ready: boolean;
  updateProgress(patch: ProgressPatch): Promise<ProgressSnapshot>;
  exportProgress(): Promise<string>;
  importProgress(json: string): Promise<ProgressSnapshot>;
  clearProgress(): Promise<void>;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);

const progressStore = createProgressStore();

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(createEmptyProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    progressStore.load().then((snapshot) => {
      if (active) {
        setProgress(snapshot);
        setReady(true);
      }
    });
    return () => { active = false; };
  }, []);

  const updateProgress = useCallback(async (patch: ProgressPatch) => {
    const snapshot = await progressStore.update(patch);
    setProgress(snapshot);
    return snapshot;
  }, []);

  const importProgress = useCallback(async (json: string) => {
    const snapshot = await progressStore.import(json);
    setProgress(snapshot);
    return snapshot;
  }, []);

  const clearProgress = useCallback(async () => {
    await progressStore.clear();
    setProgress(createEmptyProgress());
  }, []);

  const value = useMemo<ProgressContextValue>(() => ({
    progress,
    ready,
    updateProgress,
    exportProgress: () => progressStore.export(),
    importProgress,
    clearProgress,
  }), [clearProgress, importProgress, progress, ready, updateProgress]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
