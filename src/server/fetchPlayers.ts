import type { MyServer, MySocket } from '@/pages/api/socket'

export const fetchPlayers = (socket: MySocket, io: MyServer): void => {
  socket.on(`fetchPlayers`, (data: { room: string }) => {
    const players = io.sockets.adapter.rooms.get(data.room)?.size || 0
    io.sockets.in(data.room).emit(`playersInRoom`, players)
  })
}
