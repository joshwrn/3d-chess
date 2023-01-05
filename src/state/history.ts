import create from 'zustand'

import type { History } from '@/components/History'

export const useHistoryState = create<{
  history: History[]
  reset: VoidFunction
  addItem: (item: History) => void
  undo: VoidFunction
}>((set) => ({
  history: [] as History[],
  reset: () => set({ history: [] }),
  addItem: (item) => set((state) => ({ history: [...state.history, item] })),
  undo: () => set((state) => ({ history: state.history.slice(0, -1) })),
}))
