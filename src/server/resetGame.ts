import type { Server } from 'socket.io'

import type { MySocket, SocketEmitEvents } from '@/pages/api/socket'

export const resetGame = (socket: MySocket, io: Server): void => {
  socket.on(`resetGame`, (data: { room: string }) => {
    io.sockets.in(data.room).emit<SocketEmitEvents>(`gameReset`)
  })
}
