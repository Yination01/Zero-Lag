// Game catalog. Maps detected Android package ids to a known game and the
// metric the UI should headline for that genre.

export type HeadlineMetric = 'ping' | 'strength';

export interface GameProfile {
  id: string;
  label: string;
  packages: string[];
  headline: HeadlineMetric;
  // Why this metric: twitch shooters punish raw ping; sports titles desync
  // on jitter and connection-instability bursts, so stability is the headline.
  why: string;
}

export const ALL_GAMES: GameProfile[] = [
  {
    id: 'cod-mobile',
    label: 'Call of Duty: Mobile',
    packages: ['com.activision.callofduty.shooter', 'com.activision.callofduty.warzone'],
    headline: 'ping',
    why: 'Fast shooter, every millisecond matters.',
  },
  {
    id: 'efootball',
    label: 'eFootball',
    packages: ['jp.konami.pesam', 'jp.konami.efootball'],
    headline: 'strength',
    why: 'Matches are sensitive to jitter and connection instability.',
  },
  {
    id: 'pubg-mobile',
    label: 'PUBG Mobile',
    packages: ['com.tencent.ig', 'com.pubg.imobile', 'com.pubg.krmobile'],
    headline: 'ping',
    why: 'Battle royale rewards low ping.',
  },
  {
    id: 'free-fire',
    label: 'Free Fire',
    packages: ['com.dts.freefireth', 'com.dts.freefiremax'],
    headline: 'ping',
    why: 'Fast-paced shooter, low ping matters.',
  },
  {
    id: 'mlbb',
    label: 'Mobile Legends: Bang Bang',
    packages: ['com.mobile.legends'],
    headline: 'strength',
    why: 'MOBA sessions are sensitive to jitter and connection instability.',
  },
];

export function detectGame(packageName: string | null | undefined): GameProfile | null {
  if (!packageName) return null;
  return ALL_GAMES.find((g) => g.packages.includes(packageName)) ?? null;
}

export function headlineMetricFor(game: GameProfile): HeadlineMetric {
  return game.headline;
}
