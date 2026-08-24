import { openDB } from 'idb';
import {
  PROGRESS_SCHEMA_VERSION,
  createEmptyProgress,
  type ProgressPatch,
  type ProgressSnapshot,
  type ProgressStore,
} from './types';

const STORE_NAME = 'progress';
const SNAPSHOT_KEY = 'snapshot';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function validateSnapshot(value: unknown): ProgressSnapshot {
  if (!value || typeof value !== 'object') {
    throw new Error('Progress import must be a JSON object');
  }

  const candidate = value as Partial<ProgressSnapshot>;
  if (candidate.schemaVersion !== PROGRESS_SCHEMA_VERSION) {
    throw new Error('Unsupported progress schema');
  }

  if (
    !isStringArray(candidate.completedLessonIds)
    || !isStringArray(candidate.readPaperIds)
    || !isStringArray(candidate.savedResourceIds)
    || !candidate.labState
    || typeof candidate.labState !== 'object'
    || Array.isArray(candidate.labState)
    || (candidate.lastRoute !== null && typeof candidate.lastRoute !== 'string')
    || typeof candidate.updatedAt !== 'string'
  ) {
    throw new Error('Invalid progress snapshot');
  }

  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    completedLessonIds: [...candidate.completedLessonIds],
    readPaperIds: [...candidate.readPaperIds],
    savedResourceIds: [...candidate.savedResourceIds],
    labState: { ...candidate.labState },
    lastRoute: candidate.lastRoute,
    updatedAt: candidate.updatedAt,
  };
}

function fallbackKey(databaseName: string) {
  return `${databaseName}:fallback`;
}

function readFallback(databaseName: string): ProgressSnapshot {
  if (typeof localStorage === 'undefined') return createEmptyProgress();
  const serialized = localStorage.getItem(fallbackKey(databaseName));
  if (!serialized) return createEmptyProgress();

  try {
    return validateSnapshot(JSON.parse(serialized));
  } catch {
    return createEmptyProgress();
  }
}

function writeFallback(databaseName: string, snapshot: ProgressSnapshot) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(fallbackKey(databaseName), JSON.stringify(snapshot));
  }
}

async function withDatabase<T>(databaseName: string, operation: (database: Awaited<ReturnType<typeof openDB>>) => Promise<T>) {
  const database = await openDB(databaseName, 1, {
    upgrade(upgradeDatabase) {
      if (!upgradeDatabase.objectStoreNames.contains(STORE_NAME)) {
        upgradeDatabase.createObjectStore(STORE_NAME);
      }
    },
  });

  try {
    return await operation(database);
  } finally {
    database.close();
  }
}

async function readSnapshot(databaseName: string): Promise<ProgressSnapshot> {
  try {
    const value = await withDatabase(databaseName, (database) => database.get(STORE_NAME, SNAPSHOT_KEY));
    return value ? validateSnapshot(value) : readFallback(databaseName);
  } catch {
    return readFallback(databaseName);
  }
}

async function writeSnapshot(databaseName: string, snapshot: ProgressSnapshot): Promise<ProgressSnapshot> {
  writeFallback(databaseName, snapshot);
  try {
    await withDatabase(databaseName, (database) => database.put(STORE_NAME, snapshot, SNAPSHOT_KEY));
  } catch {
    // The localStorage mirror remains the source of truth when IndexedDB is unavailable.
  }
  return snapshot;
}

export function createProgressStore(databaseName = 'openfanout-progress'): ProgressStore {
  return {
    load() {
      return readSnapshot(databaseName);
    },

    async update(patch: ProgressPatch) {
      const current = await readSnapshot(databaseName);
      const next: ProgressSnapshot = {
        ...current,
        ...patch,
        schemaVersion: PROGRESS_SCHEMA_VERSION,
        completedLessonIds: patch.completedLessonIds ? [...patch.completedLessonIds] : current.completedLessonIds,
        readPaperIds: patch.readPaperIds ? [...patch.readPaperIds] : current.readPaperIds,
        savedResourceIds: patch.savedResourceIds ? [...patch.savedResourceIds] : current.savedResourceIds,
        labState: patch.labState ? { ...patch.labState } : current.labState,
        updatedAt: new Date().toISOString(),
      };
      return writeSnapshot(databaseName, next);
    },

    async export() {
      return JSON.stringify(await readSnapshot(databaseName), null, 2);
    },

    async import(json: string) {
      let parsed: unknown;
      try {
        parsed = JSON.parse(json);
      } catch {
        throw new Error('Progress import is not valid JSON');
      }
      return writeSnapshot(databaseName, validateSnapshot(parsed));
    },

    async clear() {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(fallbackKey(databaseName));
      }
      try {
        await withDatabase(databaseName, (database) => database.delete(STORE_NAME, SNAPSHOT_KEY));
      } catch {
        // Clearing the fallback is sufficient when IndexedDB is unavailable.
      }
    },
  };
}
