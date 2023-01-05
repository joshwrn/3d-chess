import create from 'zustand'

import type { Color } from '@/logic/pieces'
import { oppositeColor } from '@/logic/pieces'

export const useGameSettingsState = create<{
  gameType: `local` | `online`
  setGameType: (type: `local` | `online`) => void
  turn: Color
  setTurn: () => void
  resetTurn: () => void
}>((set) => ({
  gameType: `local`,
  setGameType: (type) => set({ gameType: type }),
  turn: `white`,
  setTurn: () => set((state) => ({ turn: oppositeColor(state.turn) })),
  resetTurn: () => set({ turn: `white` }),
}))
