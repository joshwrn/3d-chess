import type { JoinRoomClient } from '@/components/GameCreation'
import type { Color } from '@/logic/pieces'
import type { MyServer, MySocket, playerJoinedServer } from '@/pages/api/socket'

export const joinRoom = (socket: MySocket, io: MyServer): void => {
  socket.on(`joinRoom`, (data: JoinRoomClient) => {
    const { room, username } = data

    const playerCount = io.sockets.adapter.rooms.get(data.room)?.size || 0
    if (playerCount === 2) {
      socket.emit(`newError`, `Room is full`)
      return
    }

    socket.join(room)
    const color: Color = playerCount === 1 ? `black` : `white`
    const props: playerJoinedServer = { room, username, color, playerCount }
    io.sockets.in(room).emit(`playerJoined`, props)
  })
}
