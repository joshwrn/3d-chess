import type { Server } from 'socket.io'

import type { Color } from '@/logic/pieces'
import type { MySocket, SocketEmitEvents } from '@/pages/api/socket'

export type CameraMove = {
  position: [number, number, number]
  rotation: [number, number, number]
  room: string
  color: Color
}

export const cameraMove = (socket: MySocket, io: Server): void => {
  socket.on(`cameraMove`, (data: CameraMove) => {
    io.sockets.in(data.room).emit<SocketEmitEvents>(`cameraMoved`, data)
  })
}
