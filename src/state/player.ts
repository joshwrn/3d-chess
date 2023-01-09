import { nanoid } from 'nanoid'
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
  name: string
  setName: (name: string) => void
}>((set) => ({
  position: [0, 100, 0],
  rotation: [0, 0, 0],
  setPosition: (position) => set({ position }),
  setRotation: (rotation) => set({ rotation }),
  name: ``,
  setName: (name) => set({ name }),
  mousePosition: [0, 0, 0],
  setMousePosition: (mousePosition) => set({ mousePosition }),
}))

export const usePlayerState = create<{
  username: string
  id: string
  setUsername: (username: string) => void
  room: string
  setRoom: (room: string) => void
  joinedRoom: boolean
  setJoinedRoom: (joinedRoom: boolean) => void
  playerColor: Color
  setPlayerColor: (color: Color) => void
}>((set) => ({
  username: `josh`,
  setUsername: (username) => set({ username }),
  id: nanoid(),
  room: `one`,
  setRoom: (room) => set({ room }),
  joinedRoom: false,
  setJoinedRoom: (joinedRoom) => set({ joinedRoom }),
  playerColor: `white`,
  setPlayerColor: (color: Color) => set({ playerColor: color }),
}))
