import type { Server } from 'socket.io'

import type { MakeMoveClient } from '@/components/Board'
import type { MySocket, SocketEmitEvents } from '@/pages/api/socket'

export const makeMove = (socket: MySocket, io: Server): void => {
  socket.on(`makeMove`, (data: MakeMoveClient) => {
    io.sockets.in(data.room).emit<SocketEmitEvents>(`moveMade`, data.movingTo)
  })
}
