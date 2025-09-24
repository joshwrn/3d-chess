/* eslint-disable no-console */
import type { MyServer, MySocket } from '@/pages/api/socket'

export const disconnect = (socket: MySocket, io: MyServer): void => {
  socket.on(`disconnecting`, () => {
    console.log(`Player disconnecting from rooms:`, Array.from(socket.rooms))
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        const remainingPlayers = io.sockets.adapter.rooms.get(room)?.size || 0
        socket.to(room).emit(`playersInRoom`, remainingPlayers - 1)
      }
    }
  })

  socket.on(`disconnect`, (reason) => {
    console.log(`Player disconnected:`, reason)
  })

  socket.on(`playerLeft`, (data: { room: string }) => {
    socket.leave(data.room)
    const remainingPlayers = io.sockets.adapter.rooms.get(data.room)?.size || 0
    socket.to(data.room).emit(`playersInRoom`, remainingPlayers)
  })
}
