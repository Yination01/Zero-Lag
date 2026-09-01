// React state hook for running a readiness test. The test logic lives in
// the pure net layer so it can be reused and reasoned about.

import { useCallback, useState } from 'react';
import { probeSeries, rnRequest } from '../net/probe';
import { computeReadiness, type ReadinessResult } from '../net/readiness';

export type TestState = 'idle' | 'loading' | 'error' | 'success';

export interface ReadinessOptions {
  sampleCount?: number;
  gapMs?: number;
}

function safeSampleCount(value: number | undefined): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 8;
  return Math.round(Math.min(10, Math.max(3, value)));
}

export function useReadiness({ sampleCount, gapMs = 250 }: ReadinessOptions = {}) {
  const [state, setState] = useState<TestState>('idle');
  const [result, setResult] = useState<ReadinessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const count = safeSampleCount(sampleCount);

  const run = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const samples = await probeSeries({ request: rnRequest }, count, gapMs);
      setResult(computeReadiness(samples));
      setState('success');
    } catch {
      setError('Could not run the test. Check your connection and try again.');
      setState('error');
    }
  }, [count, gapMs]);

  return { state, result, error, run };
}
