// Foreground game detection. The actual Usage Access query runs in the
// native plugin (plugins/zerolag-net). This hook is pure TS and tolerates
// the plugin being absent by returning an unknown-game state honestly.

import { useEffect, useState } from 'react';
import { detectGame, type GameProfile } from '../game/catalog';
import { getForegroundGamePackage } from '../plugins/gameDetection';

export interface GameState {
  packageName: string | null;
  game: GameProfile | null;
  permissionGranted: boolean;
  loading: boolean;
}

export function useGame(active: boolean, refreshMs = 3000): GameState & { refresh: () => void } {
  const [state, setState] = useState<GameState>({
    packageName: null,
    game: null,
    permissionGranted: false,
    loading: true,
  });

  async function refresh() {
    try {
      const pkg = await getForegroundGamePackage();
      if (pkg.needsPermission) {
        setState({ packageName: null, game: null, permissionGranted: false, loading: false });
        return;
      }
      const game = detectGame(pkg.packageName);
      setState({ packageName: pkg.packageName, game, permissionGranted: true, loading: false });
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }

  useEffect(() => {
    if (!active) return;
    refresh();
    const id = setInterval(refresh, refreshMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, refreshMs]);

  return { ...state, refresh };
}
