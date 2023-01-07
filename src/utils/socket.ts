import { useEffect } from 'react'

import type { DefaultEventsMap } from '@socket.io/component-emitter'
import type { Socket } from 'socket.io-client'
// eslint-disable-next-line import/no-named-as-default
import io from 'socket.io-client'
import create from 'zustand'

import type { MovingTo } from '@/components/Board'
import type { CameraMove, playerJoinedServer } from '@/pages/api/socket'
import { useGameSettingsState } from '@/state/game'
import type { Message } from '@/state/player'
import {
  useOpponentState,
  usePlayerState,
  useMessageState,
} from '@/state/player'

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

export const useSocketState = create<{
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null
  setSocket: (socket: Socket<DefaultEventsMap, DefaultEventsMap>) => void
}>((set) => ({
  socket: null,
  setSocket: (socket) => set({ socket }),
}))

export const useSockets = ({ reset }: { reset: VoidFunction }): void => {
  const [addMessage] = useMessageState((state) => [state.addMessage])
  const { setGameStarted, setMovingTo } = useGameSettingsState((state) => ({
    setGameStarted: state.setGameStarted,
    setMovingTo: state.setMovingTo,
  }))
  const { setPlayerColor } = usePlayerState((state) => ({
    setPlayerColor: state.setPlayerColor,
  }))

  const { setPosition, setRotation, setMousePosition } = useOpponentState(
    (state) => state,
  )

  const { socket: socketState, setSocket } = useSocketState((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }))
  useEffect(() => {
    socketInitializer()

    return () => {
      if (socketState) {
        socketState.disconnect()
      }
    }
  }, [])

  const socketInitializer = async () => {
    await fetch(`/api/socket`)
    socket = io()
    setSocket(socket)

    socket.on(`newIncomingMessage`, (msg: Message) => {
      addMessage(msg)
    })

    socket.on(`playerJoined`, (data: playerJoinedServer) => {
      addMessage({
        author: `System`,
        message: `${data.username} has joined ${data.room}`,
      })
      const { username } = usePlayerState.getState()
      if (data.username === username) {
        setPlayerColor(data.color)
      }
    })

    socket.on(`cameraMoved`, (data: CameraMove) => {
      const { playerColor } = usePlayerState.getState()
      if (playerColor === data.color) {
        return
      }
      setPosition(data.position)
      setRotation(data.rotation)
    })

    socket.on(`moveMade`, (data: MovingTo) => {
      setMovingTo(data)
    })

    socket.on(`resetGame`, () => {
      reset()
    })

    socket.on(`playersInRoom`, (data: number) => {
      if (data === 2) {
        setGameStarted(true)
      }
    })
  }
}
