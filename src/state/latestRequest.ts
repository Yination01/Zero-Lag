// An async status check may complete after a newer check or a confirmed action.
// Keep its result from replacing a state that Android reported more recently.
export function createLatestRequest() {
  let revision = 0;

  return {
    begin(): number {
      revision += 1;
      return revision;
    },
    invalidate(): void {
      revision += 1;
    },
    isCurrent(candidate: number): boolean {
      return candidate === revision;
    },
  };
}
