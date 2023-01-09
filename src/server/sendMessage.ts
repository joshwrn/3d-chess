import type { MessageClient } from '@/components/Chat'
import type { MyServer, MySocket } from '@/pages/api/socket'
import type { Message } from '@/state/player'

export const sendMessage = (socket: MySocket, io: MyServer): void => {
  socket.on(`createdMessage`, (data: MessageClient) => {
    const send: Message = data.message
    io.sockets.in(data.room).emit(`newIncomingMessage`, send)
  })
}
