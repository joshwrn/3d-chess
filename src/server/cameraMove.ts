import type { Color } from '@/logic/pieces'
import type { MyServer, MySocket } from '@/pages/api/socket'

export type CameraMove = {
  position: [number, number, number]
  room: string
  color: Color
}

export const cameraMove = (socket: MySocket, io: MyServer): void => {
  socket.on(`cameraMove`, (data: CameraMove) => {
    io.sockets.in(data.room).emit(`cameraMoved`, data)
  })
}
