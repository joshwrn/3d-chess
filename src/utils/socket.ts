import { useEffect } from 'react'

import type { DefaultEventsMap } from '@socket.io/component-emitter'
import type { Socket } from 'socket.io-client'
// eslint-disable-next-line import/no-named-as-default
import io from 'socket.io-client'

import { useMessageState, usePlayerState } from '@/state/player'

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

export const useSockets = (): Socket => {
  const [addMessage] = useMessageState((state) => [state.addMessage])
  const [setTotalPlayers] = usePlayerState((state) => [state.setTotalPlayers])
  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    await fetch(`/api/socket`)
    socket = io()

    socket.on(`newIncomingMessage`, (msg) => {
      addMessage({ author: msg.author, message: msg.message })
    })

    socket.on(`playerJoined`, (data) => {
      addMessage({
        author: `System`,
        message: `${data.username} has joined ${data.room}`,
      })
    })

    socket.on(`playersInRoom`, (data) => {
      setTotalPlayers(data)
    })
  }

  return socket
}
