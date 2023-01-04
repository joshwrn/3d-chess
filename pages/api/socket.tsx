import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket, ServerOptions } from 'socket.io'
import { Server } from 'socket.io'

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse & {
    socket: {
      server: ServerOptions & {
        io: Server
      }
    }
  },
): void {
  // It means that socket server was already initialised
  if (res?.socket?.server?.io) {
    console.log(`Already set up`)
    res.end()
    return
  }

  const io = new Server(res?.socket?.server)
  res.socket.server.io = io

  const onConnection = (socket: Socket) => {
    socket.on(`createdMessage`, (data: any) => {
      io.sockets.in(data.room).emit(`newIncomingMessage`, data.msg)
    })

    socket.on(`joinRoom`, async (data: any) => {
      const { room, username } = data
      socket.join(room)

      io.sockets.in(room).emit(`playerJoined`, { room, username })

      console.log(`join room ${room}`)
    })

    socket.on(`fetchPlayers`, async (data: any) => {
      const players = await io.sockets.adapter.rooms.get(data.room)?.size
      console.log(`players in room ${players}`)
      io.sockets.in(data.room).emit(`playersInRoom`, players)
    })
  }

  // Define actions inside
  io.on(`connection`, onConnection)

  console.log(`Setting up socket`)
  res.end()
}
