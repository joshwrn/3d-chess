import type { Server } from 'socket.io'

import type { MySocket, SocketEmitEvents } from '@/pages/api/socket'

export const disconnect = (socket: MySocket, io: Server): void => {
  socket.on(`disconnect`, (data: { room: string }) => {
    console.log(`playerLeft`, data)
    io.sockets.in(data.room).emit<SocketEmitEvents>(`newError`, `Player left`)
  })
}
