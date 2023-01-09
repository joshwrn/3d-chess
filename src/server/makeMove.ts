import type { MakeMoveClient } from '@/components/Board'
import type { MyServer, MySocket } from '@/pages/api/socket'

export const makeMove = (socket: MySocket, io: MyServer): void => {
  socket.on(`makeMove`, (data: MakeMoveClient) => {
    io.sockets.in(data.room).emit(`moveMade`, data.movingTo)
  })
}
