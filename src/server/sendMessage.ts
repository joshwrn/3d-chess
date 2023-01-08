import type { Server } from 'socket.io'

import type { MessageClient } from '@/components/Chat'
import type { MySocket, SocketEmitEvents } from '@/pages/api/socket'
import type { Message } from '@/state/player'

export const sendMessage = (socket: MySocket, io: Server): void => {
  socket.on(`createdMessage`, (data: MessageClient) => {
    const send: Message = data.message
    io.sockets.in(data.room).emit<SocketEmitEvents>(`newIncomingMessage`, send)
  })
}
