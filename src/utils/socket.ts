/* eslint-disable no-console */
import { useEffect } from 'react'

import { toast } from 'react-toastify'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import create from 'zustand'

import type { MovingTo } from '@/components/Board'
import type {
  SocketClientToServer,
  SocketServerToClient,
  playerJoinedServer,
} from '@/pages/api/socket'
import type { CameraMove } from '@/server/cameraMove'
import { useGameSettingsState } from '@/state/game'
import type { Message } from '@/state/player'
import {
  useOpponentState,
  usePlayerState,
  useMessageState,
} from '@/state/player'

type ClientSocket = Socket<SocketServerToClient, SocketClientToServer>
let socket: ClientSocket

export const useSocketState = create<{
  socket: ClientSocket | null
  setSocket: (socket: ClientSocket) => void
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

  const { setPosition, setName: setOpponentName } = useOpponentState(
    (state) => state,
  )

  const { socket: socketState, setSocket } = useSocketState((state) => ({
    socket: state.socket,
    setSocket: state.setSocket,
  }))
  useEffect(() => {
    if (!socketState) {
      socketInitializer()
    }

    return () => {
      if (socketState) {
        socketState.emit(`playerLeft`, { room: usePlayerState.getState().room })
        socketState.disconnect()
      }
    }
  }, [])

  const socketInitializer = async () => {
    try {
      const response = await fetch(`/api/socket`)
      if (!response.ok) {
        throw new Error(`Failed to initialize socket server: ${response.status}`)
      }
      socket = io(`/`, {
        transports: [`polling`],
        upgrade: false,
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })
      setSocket(socket)

      socket.on(`connect_error`, (error) => {
        console.error(`Socket connection error:`, error)
        toast.error(`Connection failed. Please refresh the page.`)
      })

      socket.on(`disconnect`, (reason) => {
        console.log(`Socket disconnected:`, reason)
        if (reason === `io server disconnect`) {
          socket.connect()
        }
      })

      socket.on(`newIncomingMessage`, (msg: Message) => {
        addMessage(msg)
      })

      socket.on(`playerJoined`, (data: playerJoinedServer) => {
        const split = data.username.split(`#`)
        addMessage({
          author: `System`,
          message: `${split[0]} has joined ${data.room}`,
        })
        const { id, username } = usePlayerState.getState()
        if (split[1] === id) {
          setPlayerColor(data.color)
          setJoinedRoom(true)
        } else {
          socket.emit(`existingPlayer`, {
            room: data.room,
            name: `${username}#${id}`,
          })
          setOpponentName(split[0])
        }
      })

      socket.on(`clientExistingPlayer`, (data: string) => {
        const split = data.split(`#`)
        if (split[1] !== usePlayerState.getState().id) {
          setOpponentName(split[0])
        }
      })

      socket.on(`cameraMoved`, (data: CameraMove) => {
        const { playerColor } = usePlayerState.getState()
        if (playerColor === data.color) {
          return
        }
        setPosition(data.position)
      })

      socket.on(`moveMade`, (data: MovingTo) => {
        setMovingTo(data)
      })

      socket.on(`gameReset`, () => {
        reset()
      })

      socket.on(`playersInRoom`, (data: number) => {
        if (data === 2) {
          setGameStarted(true)
        }
      })

      socket.on(`newError`, (err: string) => {
        toast.error(err, {
          toastId: err,
        })
      })
    } catch (error) {
      console.error(`Failed to initialize socket:`, error)
      toast.error(`Failed to connect to server`)
    }
  }
}
