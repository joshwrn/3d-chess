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

export const useOpponentState = create<{
  position: [number, number, number]
  rotation: [number, number, number]
  mousePosition: [number, number, number]
  setPosition: (position: [number, number, number]) => void
  setRotation: (rotation: [number, number, number]) => void
  setMousePosition: (mousePosition: [number, number, number]) => void
}>((set) => ({
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  mousePosition: [0, 0, 0],
  setMousePosition: (mousePosition) => set({ mousePosition }),
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
