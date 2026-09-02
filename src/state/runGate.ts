// A synchronous single-flight gate for UI actions. State updates are rendered
// asynchronously, so this prevents a second tap from starting duplicate work
// before a disabled button is painted.

export interface RunGate {
  isBusy(): boolean;
  tryAcquire(): boolean;
  release(): void;
}

export function createRunGate(): RunGate {
  let busy = false;

  return {
    isBusy: () => busy,
    tryAcquire: () => {
      if (busy) return false;
      busy = true;
      return true;
    },
    release: () => { busy = false; },
  };
}
