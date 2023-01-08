import type { Server } from 'socket.io'

import type { JoinRoomClient } from '@/components/GameCreation'
import type { Color } from '@/logic/pieces'
import type {
  MySocket,
  SocketEmitEvents,
  playerJoinedServer,
} from '@/pages/api/socket'

const rooms = new Map<string, string[]>()

export const joinRoom = (socket: MySocket, io: Server): void => {
  socket.on(`joinRoom`, (data: JoinRoomClient) => {
    const { room, username } = data
    socket.join(room)

    const playerCount = io.sockets.adapter.rooms.get(data.room)?.size || 0
    if (playerCount > 2) {
      socket.emit<SocketEmitEvents>(`newError`, `Room is full`)
      return
    }

    if (rooms.has(room)) {
      const players = rooms.get(room)
      if (players?.includes(username)) {
        socket.emit<SocketEmitEvents>(`newError`, `Username is already taken`)
        return
      }
      if (players) {
        players.push(username)
        rooms.set(room, players)
      }
    } else {
      rooms.set(room, [username])
    }

    const color: Color = playerCount === 2 ? `black` : `white`
    const props: playerJoinedServer = { room, username, color, playerCount }
    io.sockets.in(room).emit<SocketEmitEvents>(`playerJoined`, props)
  })
}
