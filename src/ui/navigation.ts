export const PRIMARY_TABS = [
  { id: 'home', label: 'Home' },
  { id: 'game', label: 'Game' },
  { id: 'boost', label: 'Boost' },
  { id: 'history', label: 'History' },
  { id: 'device', label: 'Device' },
] as const;

export type PrimaryTab = typeof PRIMARY_TABS[number]['id'];

export function isPrimaryTab(value: unknown): value is PrimaryTab {
  return typeof value === 'string' && PRIMARY_TABS.some((tab) => tab.id === value);
}
