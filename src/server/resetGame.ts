import type { MyServer, MySocket } from '@/pages/api/socket'

export const resetGame = (socket: MySocket, io: MyServer): void => {
  socket.on(`resetGame`, (data: { room: string }) => {
    io.sockets.in(data.room).emit(`gameReset`, true)
  })
}
