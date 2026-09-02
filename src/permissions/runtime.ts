// Runtime permission result handling is kept independent from React Native so
// the UI can tell users what Android actually granted.

export interface RuntimePermissionSummary {
  requested: number;
  granted: number;
  denied: number;
  complete: boolean;
}

export function summarizeRuntimePermissionResults(results: readonly unknown[]): RuntimePermissionSummary {
  const requested = results.length;
  const granted = results.filter((result) => result === 'granted').length;
  return {
    requested,
    granted,
    denied: requested - granted,
    complete: requested > 0 && granted === requested,
  };
}
