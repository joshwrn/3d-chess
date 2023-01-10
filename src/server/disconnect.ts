import type { MyServer, MySocket } from '@/pages/api/socket'

export const disconnect = (socket: MySocket, io: MyServer): void => {
  socket.on(`disconnecting`, (data) => {
    console.log(`disconnecting`)
  })
}
