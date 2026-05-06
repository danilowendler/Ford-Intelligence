import { create } from 'zustand';
import type { Alert } from '@/services/mocks/alertsApi';

type AlertsState = {
  alerts: Alert[];
  dismissedIds: string[];
  setAlerts: (alerts: Alert[]) => void;
  dismiss: (id: string) => void;
  clearDismissed: () => void;
};

export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: [],
  dismissedIds: [],
  setAlerts: (alerts) => {
    const { dismissedIds } = get();
    const filtered = alerts.filter((alert) => !dismissedIds.includes(alert.id));
    set({ alerts: filtered });
  },
  dismiss: (id) =>
    set((state) => ({
      alerts: state.alerts.filter((alert) => alert.id !== id),
      dismissedIds: state.dismissedIds.includes(id)
        ? state.dismissedIds
        : [...state.dismissedIds, id],
    })),
  clearDismissed: () => set({ dismissedIds: [] }),
}));
