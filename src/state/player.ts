import create from 'zustand'

import type { Color } from '@/logic/pieces'

export type Message = {
  author: string
  message: string
}

export const useMessageState = create<{
  messages: Message[]
  addMessage: (message: Message) => void
}>((set) => ({
  messages: [] as Message[],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
}))

export const usePlayerState = create<{
  username: string
  setUsername: (username: string) => void
  room: string
  setRoom: (room: string) => void
  joinedRoom: boolean
  setJoinedRoom: (joinedRoom: boolean) => void
  playerColor: Color
  setPlayerColor: (color: Color) => void
}>((set) => ({
  username: ``,
  setUsername: (username) => set({ username }),
  room: ``,
  setRoom: (room) => set({ room }),
  joinedRoom: false,
  setJoinedRoom: (joinedRoom) => set({ joinedRoom }),
  playerColor: `white`,
  setPlayerColor: (color: Color) => set({ playerColor: color }),
}))
