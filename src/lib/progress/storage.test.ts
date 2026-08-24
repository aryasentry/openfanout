import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createProgressStore } from './storage';

const usedStoreNames: string[] = [];

function storeName(label: string) {
  const name = `openfanout-test-${label}-${crypto.randomUUID()}`;
  usedStoreNames.push(name);
  return name;
}

afterEach(async () => {
  vi.unstubAllGlobals();
  await Promise.all(usedStoreNames.splice(0).map((name) => new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase(name);
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  })));
  localStorage.clear();
});

describe('ProgressStore', () => {
  it('persists completion and the last route across store instances', async () => {
    const name = storeName('reload');
    const first = createProgressStore(name);
    await first.update({
      completedLessonIds: ['ai-functions'],
      lastRoute: '/ai/lessons/math-fundamentals-functions',
    });

    const second = createProgressStore(name);
    await expect(second.load()).resolves.toMatchObject({
      completedLessonIds: ['ai-functions'],
      lastRoute: '/ai/lessons/math-fundamentals-functions',
    });
  });

  it('mirrors an update before its asynchronous database round trip finishes', async () => {
    const name = storeName('immediate-reload');
    const first = createProgressStore(name);
    const pendingWrite = first.update({
      completedLessonIds: ['ai-functions'],
      lastRoute: '/ai/lessons/math-fundamentals-functions',
    });

    const mirrored = localStorage.getItem(`${name}:fallback`);
    await pendingWrite;

    expect(mirrored).not.toBeNull();
    expect(JSON.parse(mirrored ?? '{}')).toMatchObject({
      completedLessonIds: ['ai-functions'],
      lastRoute: '/ai/lessons/math-fundamentals-functions',
    });
  });

  it('round-trips every supported local progress field through export and import', async () => {
    const source = createProgressStore(storeName('export'));
    await source.update({
      completedLessonIds: ['ai-functions'],
      readPaperIds: ['rag-paper'],
      savedResourceIds: ['d2l'],
      labState: { 'gradient-descent': { rate: 0.1 } },
      lastRoute: '/labs/gradient-descent',
    });

    const destination = createProgressStore(storeName('import'));
    const imported = await destination.import(await source.export());

    expect(imported).toMatchObject({
      schemaVersion: 1,
      completedLessonIds: ['ai-functions'],
      readPaperIds: ['rag-paper'],
      savedResourceIds: ['d2l'],
      labState: { 'gradient-descent': { rate: 0.1 } },
      lastRoute: '/labs/gradient-descent',
    });
  });

  it('rejects invalid imports without overwriting saved progress', async () => {
    const store = createProgressStore(storeName('invalid'));
    await store.update({ savedResourceIds: ['d2l'] });

    await expect(store.import('{"schemaVersion":99}')).rejects.toThrow('Unsupported progress schema');
    expect((await store.load()).savedResourceIds).toEqual(['d2l']);
  });

  it('falls back to localStorage when IndexedDB is unavailable', async () => {
    const name = storeName('fallback');
    vi.stubGlobal('indexedDB', undefined);

    await createProgressStore(name).update({ completedLessonIds: ['ai-vectors'] });

    expect((await createProgressStore(name).load()).completedLessonIds).toEqual(['ai-vectors']);
  });
});
