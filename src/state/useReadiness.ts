// React state hook for running a readiness test. The test logic lives in
// the pure net layer so it can be reused and reasoned about.

import { useCallback, useState } from 'react';
import { probeSeries, rnRequest } from '../net/probe';
import { computeReadiness, type ReadinessResult } from '../net/readiness';

export type TestState = 'idle' | 'loading' | 'error' | 'success';

export function useReadiness() {
  const [state, setState] = useState<TestState>('idle');
  const [result, setResult] = useState<ReadinessResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const samples = await probeSeries({ request: rnRequest }, 8, 250);
      setResult(computeReadiness(samples));
      setState('success');
    } catch (e) {
      setError('Could not run the test. Check your connection and try again.');
      setState('error');
    }
  }, []);

  return { state, result, error, run };
}
