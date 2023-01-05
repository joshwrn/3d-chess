import create from 'zustand'

import type { MovingTo } from '@/components/Board'
import type { Color } from '@/logic/pieces'
import { oppositeColor } from '@/logic/pieces'

export const useGameSettingsState = create<{
  gameType: `local` | `online`
  setGameType: (type: `local` | `online`) => void
  turn: Color
  setTurn: () => void
  resetTurn: () => void
  gameStarted: boolean
  setGameStarted: (started: boolean) => void
  movingTo: MovingTo | null
  setMovingTo: (move: MovingTo | null) => void
}>((set) => ({
  gameType: `online`,
  setGameType: (type) => set({ gameType: type }),
  turn: `white`,
  setTurn: () => set((state) => ({ turn: oppositeColor(state.turn) })),
  resetTurn: () => set({ turn: `white` }),
  gameStarted: false,
  setGameStarted: (started: boolean) => set({ gameStarted: started }),
  movingTo: null,
  setMovingTo: (move: MovingTo | null) => set({ movingTo: move }),
}))
