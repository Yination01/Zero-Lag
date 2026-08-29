# Zero-Lag design

Tokens are locked below. Screens read them through `src/ui/theme.ts`.
No hardcoded hex in screens, no AI-default purple, no emoji as feature
icons. Red is a budget for destruction and warnings only.

## Color

| Token | Hex | Use |
|---|---|---|
| `bg` | `#0A0F14` | App background, always dark |
| `surface` | `#141C24` | Cards |
| `surfaceVariant` | `#1C2733` | Nested cards, dialogs |
| `onSurface` | `#E6EDF3` | Primary text |
| `muted` | `#93A1B0` | Secondary text |
| `good` | `#00FF88` | Ready, strong signal, primary action |
| `warn` | `#FFC107` | Playable, fair signal, caution |
| `danger` | `#FF4D4D` | Risky, weak signal, destructive only |
| `info` | `#4DA6FF` | Wi-Fi, informational |

## Type

- Display/title: system bold, size 34 (brand), 20 (card title).
- Body: 16. Secondary: 14.
- Numeric readouts (ping, dBm): bold, size 20 to 24.

## Layout and accessibility

- Touch target minimum 44 pt. Every Pressable has `accessibilityRole`.
- Four states on every screen: loading, empty, error, success.
- Contrast meets WCAG 2.1 AA on `bg` for `onSurface` and `muted`.
- Irreversible actions are never optimistic.
