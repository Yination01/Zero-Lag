// React adapter around the tested history session. It keeps completed network
// checks on this device only and reports storage failures without blocking the
// next readiness test.

import { useCallback, useEffect, useRef, useState } from 'react';
import { KEYS, getJson, setJson } from '../storage';
import {
  createHistorySession,
  type HistorySession,
} from '../history/persistence';
import type { StoredResult } from '../history/history';
import type { ReadinessResult } from '../net/readiness';

export interface ReadinessHistoryState {
  records: StoredResult[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  record(result: ReadinessResult, game: string | null | undefined): Promise<void>;
  clear(): Promise<void>;
}

const STORAGE_ERROR = 'Could not update on-device readiness history. A later readiness check or Clear history can retry.';

export function useReadinessHistory(): ReadinessHistoryState {
  const session = useRef<HistorySession | null>(null);
  if (session.current === null) {
    session.current = createHistorySession({
      read: () => getJson<unknown>(KEYS.history, []),
      write: (history) => setJson(KEYS.history, history),
    });
  }
  const historySession = session.current;

  const [records, setRecords] = useState<StoredResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const pendingWrites = useRef(0);

  useEffect(() => {
    mounted.current = true;
    void historySession.load()
      .then((loaded) => {
        if (!mounted.current) return;
        setRecords(loaded);
        setLoading(false);
      })
      .catch(() => {
        if (!mounted.current) return;
        setRecords([]);
        setError(STORAGE_ERROR);
        setLoading(false);
      });
    return () => { mounted.current = false; };
  }, [historySession]);

  const finishWrite = useCallback(() => {
    pendingWrites.current = Math.max(0, pendingWrites.current - 1);
    if (mounted.current && pendingWrites.current === 0) setSaving(false);
  }, []);

  const record = useCallback(async (result: ReadinessResult, game: string | null | undefined) => {
    pendingWrites.current += 1;
    if (mounted.current) {
      setSaving(true);
      setError(null);
    }
    try {
      const next = await historySession.record(result, game);
      if (mounted.current) setRecords(next);
    } catch {
      if (mounted.current) {
        setRecords(historySession.snapshot());
        setError(STORAGE_ERROR);
      }
    } finally {
      finishWrite();
    }
  }, [finishWrite, historySession]);

  const clear = useCallback(async () => {
    pendingWrites.current += 1;
    if (mounted.current) {
      setSaving(true);
      setError(null);
    }
    try {
      const next = await historySession.clear();
      if (mounted.current) setRecords(next);
    } catch {
      if (mounted.current) {
        setRecords(historySession.snapshot());
        setError(STORAGE_ERROR);
      }
    } finally {
      finishWrite();
    }
  }, [finishWrite, historySession]);

  return { records, loading, saving, error, record, clear };
}
