export const PROGRESS_SCHEMA_VERSION = 1 as const;

export interface ProgressSnapshot {
  schemaVersion: typeof PROGRESS_SCHEMA_VERSION;
  completedLessonIds: string[];
  readPaperIds: string[];
  savedResourceIds: string[];
  labState: Record<string, unknown>;
  lastRoute: string | null;
  updatedAt: string;
}

export type ProgressPatch = Partial<
  Omit<ProgressSnapshot, 'schemaVersion' | 'updatedAt'>
>;

export interface ProgressStore {
  load(): Promise<ProgressSnapshot>;
  update(patch: ProgressPatch): Promise<ProgressSnapshot>;
  export(): Promise<string>;
  import(json: string): Promise<ProgressSnapshot>;
  clear(): Promise<void>;
}

export function createEmptyProgress(): ProgressSnapshot {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    completedLessonIds: [],
    readPaperIds: [],
    savedResourceIds: [],
    labState: {},
    lastRoute: null,
    updatedAt: new Date(0).toISOString(),
  };
}
