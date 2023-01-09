import { useEffect } from 'react'

import type { DefaultEventsMap } from '@socket.io/component-emitter'
import { toast } from 'react-toastify'
import type { Socket } from 'socket.io-client'
// eslint-disable-next-line import/no-named-as-default
import io from 'socket.io-client'
import create from 'zustand'

import type { MovingTo } from '@/components/Board'
import type { playerJoinedServer } from '@/pages/api/socket'
import type { CameraMove } from '@/server/cameraMove'
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
  const { setPlayerColor, setJoinedRoom } = usePlayerState((state) => state)

  const {
    setPosition,
    setRotation,
    setMousePosition,
    setName: setOpponentName,
  } = useOpponentState((state) => state)

  const { socket: socketState, setSocket } = useSocketState((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }))
  useEffect(() => {
    socketInitializer()

    return () => {
      if (socketState) {
        socketState.emit(`playerLeft`, { room: usePlayerState.getState().room })
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
      const split = data.username.split(`#`)
      addMessage({
        author: `System`,
        message: `${split[0]} has joined ${data.room}`,
      })
      const { id } = usePlayerState.getState()
      if (split[1] === id) {
        setPlayerColor(data.color)
        setJoinedRoom(true)
      } else {
        setOpponentName(split[0])
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

    socket.on(`newError`, (err: string) => {
      toast.error(err, {
        theme: `dark`,
      })
    })
  }
}
