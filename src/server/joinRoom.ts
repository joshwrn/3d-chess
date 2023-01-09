import type { Server } from 'socket.io'

import type { JoinRoomClient } from '@/components/GameCreation'
import type { Color } from '@/logic/pieces'
import type {
  MySocket,
  SocketEmitEvents,
  playerJoinedServer,
} from '@/pages/api/socket'

export const joinRoom = (socket: MySocket, io: Server): void => {
  socket.on(`joinRoom`, (data: JoinRoomClient) => {
    const rooms = new Set<string>()
    const { room, username } = data

    const playerCount = io.sockets.adapter.rooms.get(data.room)?.size || 0
    if (playerCount === 2) {
      socket.emit<SocketEmitEvents>(`newError`, `Room is full`)
      return
    }

    if (!rooms.has(room)) {
      rooms.add(room)
    }

    socket.join(room)
    const color: Color = playerCount === 1 ? `black` : `white`
    const props: playerJoinedServer = { room, username, color, playerCount }
    io.sockets.in(room).emit<SocketEmitEvents>(`playerJoined`, props)
  })
}
