// Single source of design tokens. Locked in DESIGN.md.
// Screens import from here. Do not hardcode hex in components.

export const tokens = {
  color: {
    bg: '#0A0F14',
    surface: '#141C24',
    surfaceVariant: '#1C2733',
    onSurface: '#E6EDF3',
    muted: '#93A1B0',
    good: '#00FF88',
    warn: '#FFC107',
    danger: '#FF4D4D',
    info: '#4DA6FF',
  },
  space: { xs: 4, sm: 8, md: 16, lg: 20, xl: 24 },
  radius: { card: 18, button: 14, badge: 12 },
  font: { display: 34, title: 20, body: 16, secondary: 14, stat: 22 },
  minTouch: 44,
} as const;

export type ColorToken = keyof typeof tokens.color;

// Map a readiness verdict to a token color.
export function verdictColor(verdict: 'match-ready' | 'playable' | 'risky' | 'no-connection'): ColorToken {
  switch (verdict) {
    case 'match-ready':
      return 'good';
    case 'playable':
      return 'warn';
    case 'risky':
    case 'no-connection':
      return 'danger';
  }
}
