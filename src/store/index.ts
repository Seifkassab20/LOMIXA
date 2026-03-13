import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, User, Visit, Bundle, Notification, AvailabilitySlot } from '../types';

interface AppState {
  users: User[];
  visits: Visit[];
  bundles: Bundle[];
  notifications: Notification[];
  slots: AvailabilitySlot[];
  credits: Record<string, number>; // companyId -> credits

  addUser: (user: User) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  addVisit: (visit: Visit) => void;
  updateVisit: (id: string, visit: Partial<Visit>) => void;
  deleteVisit: (id: string) => void;

  addBundle: (bundle: Bundle) => void;
  updateBundle: (id: string, bundle: Partial<Bundle>) => void;
  deleteBundle: (id: string) => void;

  addNotification: (notif: Notification) => void;
  markNotificationRead: (id: string) => void;
  deleteNotification: (id: string) => void;

  addSlot: (slot: AvailabilitySlot) => void;
  deleteSlot: (id: string) => void;

  setCredits: (companyId: string, amount: number) => void;
  consumeCredit: (companyId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      users: [],
      visits: [],
      bundles: [
        { id: 'starter', name: 'Starter', credits: 50, price: 2500, features: ['50 Visit Credits', 'Basic Analytics', 'Email Support'] },
        { id: 'professional', name: 'Professional', credits: 200, price: 8000, features: ['200 Visit Credits', 'Advanced Analytics', 'Priority Support'] },
      ],
      notifications: [],
      slots: [],
      credits: {},

      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updatedUser) => set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...updatedUser } : u)),
      })),
      deleteUser: (id) => set((state) => ({ users: state.users.filter((u) => u.id !== id) })),

      addVisit: (visit) => set((state) => ({ visits: [...state.visits, visit] })),
      updateVisit: (id, updatedVisit) => set((state) => ({
        visits: state.visits.map((v) => (v.id === id ? { ...v, ...updatedVisit } : v)),
      })),
      deleteVisit: (id) => set((state) => ({ visits: state.visits.filter((v) => v.id !== id) })),

      addBundle: (bundle) => set((state) => ({ bundles: [...state.bundles, bundle] })),
      updateBundle: (id, updatedBundle) => set((state) => ({
        bundles: state.bundles.map((b) => (b.id === id ? { ...b, ...updatedBundle } : b)),
      })),
      deleteBundle: (id) => set((state) => ({ bundles: state.bundles.filter((b) => b.id !== id) })),

      addNotification: (notif) => set((state) => ({ notifications: [notif, ...state.notifications] })),
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      deleteNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      addSlot: (slot) => set((state) => ({ slots: [...state.slots, slot] })),
      deleteSlot: (id) => set((state) => ({ slots: state.slots.filter(s => s.id !== id) })),

      setCredits: (companyId, amount) => set((state) => ({
        credits: { ...state.credits, [companyId]: amount }
      })),
      consumeCredit: (companyId) => set((state) => ({
        credits: { ...state.credits, [companyId]: Math.max(0, (state.credits[companyId] || 0) - 1) }
      })),
    }),
    {
      name: 'medvisit-storage',
    }
  )
);
