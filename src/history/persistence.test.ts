import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { StoredResult } from './history.ts';
import { createHistorySession, type HistoryStorage } from './persistence.ts';

const READY = { avgPingMs: 45, jitterMs: 6, lossPercent: 0, samples: 8, verdict: 'match-ready' as const };

function result(id: string, at: number): StoredResult {
  return { id, at, game: 'Network check', avgPingMs: 70, jitterMs: 10, lossPercent: 0, verdict: 'playable' };
}

function memoryStorage(initial: unknown): HistoryStorage & { writes: StoredResult[][] } {
  const writes: StoredResult[][] = [];
  return {
    read: async () => initial,
    writes,
    write: async (next) => { writes.push(next); },
  };
}

test('loading a history session sanitizes the on-device boundary', async () => {
  const storage = memoryStorage([result('valid', 1), { id: '', at: 2 }]);
  const session = createHistorySession(storage);

  const loaded = await session.load();

  assert.deepEqual(loaded, [result('valid', 1)]);
  assert.deepEqual(session.snapshot(), [result('valid', 1)]);
});

test('recording preserves loaded results and persists a newest-first measurement', async () => {
  const storage = memoryStorage([result('older', 1)]);
  const session = createHistorySession(storage);

  const records = await session.record(READY, 'eFootball', { id: 'newest', at: 2 });

  assert.deepEqual(records.map((item) => item.id), ['newest', 'older']);
  assert.equal(records[0].game, 'eFootball');
  assert.deepEqual(storage.writes.at(-1)?.map((item) => item.id), ['newest', 'older']);
});

test('concurrent local saves preserve both completed measurements', async () => {
  let releaseFirstWrite: (() => void) | undefined;
  let signalFirstWrite: (() => void) | undefined;
  const firstWriteStarted = new Promise<void>((resolve) => { signalFirstWrite = resolve; });
  const holdFirstWrite = new Promise<void>((resolve) => { releaseFirstWrite = resolve; });
  let secondWriteStarted = false;
  let persisted: StoredResult[] = [];
  const storage: HistoryStorage = {
    read: async () => [],
    write: async (next) => {
      if (next.length === 1) {
        signalFirstWrite!();
        await holdFirstWrite;
      } else {
        secondWriteStarted = true;
      }
      persisted = next;
    },
  };
  const session = createHistorySession(storage);

  const first = session.record(READY, 'First', { id: 'first', at: 1 });
  await firstWriteStarted;
  const second = session.record(READY, 'Second', { id: 'second', at: 2 });
  try {
    await new Promise<void>((resolve) => setImmediate(resolve));
    assert.equal(secondWriteStarted, false, 'the later save must wait for the earlier write to finish');
  } finally {
    releaseFirstWrite!();
    await Promise.all([first, second]);
  }

  assert.deepEqual(session.snapshot().map((item) => item.id), ['second', 'first']);
  assert.deepEqual(persisted.map((item) => item.id), ['second', 'first']);
});

test('clearing history persists the empty result instead of leaving stale records', async () => {
  const storage = memoryStorage([result('older', 1)]);
  const session = createHistorySession(storage);

  const cleared = await session.clear();

  assert.deepEqual(cleared, []);
  assert.deepEqual(session.snapshot(), []);
  assert.deepEqual(storage.writes.at(-1), []);
});

test('a failed write does not prevent a later clear from recovering the local store', async () => {
  let writes = 0;
  let persisted: StoredResult[] | null = null;
  const storage: HistoryStorage = {
    read: async () => [],
    write: async (next) => {
      writes += 1;
      if (writes === 1) throw new Error('temporary storage failure');
      persisted = next;
    },
  };
  const session = createHistorySession(storage);

  await assert.rejects(session.record(READY, 'First', { id: 'first', at: 1 }));
  const cleared = await session.clear();

  assert.deepEqual(cleared, []);
  assert.deepEqual(persisted, []);
});

test('a temporary initial read failure can recover for a later readiness save', async () => {
  let reads = 0;
  let persisted: StoredResult[] | null = null;
  const storage: HistoryStorage = {
    read: async () => {
      reads += 1;
      if (reads === 1) throw new Error('temporary read failure');
      return [result('older', 1)];
    },
    write: async (next) => { persisted = next; },
  };
  const session = createHistorySession(storage);

  await assert.rejects(session.record(READY, 'First', { id: 'first', at: 2 }));
  const recovered = await session.record(READY, 'Second', { id: 'second', at: 3 });

  assert.equal(reads, 2);
  assert.deepEqual(recovered.map((item) => item.id), ['second', 'older']);
  assert.deepEqual(persisted, recovered);
});
