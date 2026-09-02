// Serialized local persistence for readiness history. The session starts by
// validating stored data, then every write is queued so rapid test completions
// cannot overwrite one another.

import {
  addResult,
  createStoredResult,
  sanitizeHistory,
  type StoredResult,
  type StoredResultOptions,
} from './history.ts';
import type { ReadinessResult } from '../net/readiness.ts';

export interface HistoryStorage {
  read(): Promise<unknown>;
  write(history: StoredResult[]): Promise<void>;
}

export interface HistorySession {
  load(): Promise<StoredResult[]>;
  snapshot(): StoredResult[];
  record(
    result: ReadinessResult,
    game: string | null | undefined,
    options?: StoredResultOptions,
  ): Promise<StoredResult[]>;
  clear(): Promise<StoredResult[]>;
}

function copyHistory(history: StoredResult[]): StoredResult[] {
  return history.map((item) => ({ ...item }));
}

export function createHistorySession(storage: HistoryStorage): HistorySession {
  let records: StoredResult[] = [];
  let loadPromise: Promise<StoredResult[]> | null = null;
  let writeQueue: Promise<void> = Promise.resolve();

  function snapshot(): StoredResult[] {
    return copyHistory(records);
  }

  function load(): Promise<StoredResult[]> {
    if (loadPromise) return loadPromise;

    const pending = storage.read().then((value) => {
      records = sanitizeHistory(value);
      return snapshot();
    });
    loadPromise = pending;
    // A transient storage read must not permanently poison this session. The
    // original caller still receives the error, while a later local action can
    // retry the read instead of inheriting the rejected promise forever.
    void pending.catch(() => {
      if (loadPromise === pending) loadPromise = null;
    });
    return pending;
  }

  function queueWrite(next: StoredResult[]): Promise<void> {
    const savedCopy = copyHistory(next);
    const write = writeQueue.catch(() => undefined).then(() => storage.write(savedCopy));
    writeQueue = write;
    return write;
  }

  async function record(
    result: ReadinessResult,
    game: string | null | undefined,
    options: StoredResultOptions = {},
  ): Promise<StoredResult[]> {
    await load();
    const next = addResult(records, createStoredResult(result, game, options));
    records = next;
    await queueWrite(next);
    return snapshot();
  }

  async function clear(): Promise<StoredResult[]> {
    await load();
    records = [];
    await queueWrite(records);
    return snapshot();
  }

  return { load, snapshot, record, clear };
}
