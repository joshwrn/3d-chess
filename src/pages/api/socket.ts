/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket, ServerOptions } from 'socket.io'
import { Server } from 'socket.io'

import type { MakeMoveClient, MovingTo } from '@/components/Board'
import type { MessageClient } from '@/components/Chat'
import type { JoinRoomClient } from '@/components/GameCreation'
import type { Color } from '@/logic/pieces'
import type { Message } from '@/state/player'

export type playerJoinedServer = {
  room: string
  username: string
  color: Color
  playerCount: number
}

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
    socket.on(`createdMessage`, (data: MessageClient) => {
      const send: Message = data.message
      io.sockets.in(data.room).emit(`newIncomingMessage`, send)
    })

    socket.on(`joinRoom`, (data: JoinRoomClient) => {
      const { room, username } = data
      socket.join(room)

      const playerCount = io.sockets.adapter.rooms.get(data.room)?.size || 0
      const color: Color = playerCount === 2 ? `black` : `white`
      const props: playerJoinedServer = { room, username, color, playerCount }
      io.sockets.in(room).emit(`playerJoined`, props)

      console.log(`join room ${room}`)
    })

    socket.on(`makeMove`, (data: MakeMoveClient) => {
      console.log(`move made ${data.movingTo.move.piece.color}`)
      io.sockets.in(data.room).emit(`moveMade`, data.movingTo)
    })

    socket.on(`fetchPlayers`, (data: { room: string }) => {
      const players = io.sockets.adapter.rooms.get(data.room)?.size
      console.log(`players in room ${players}`)
      io.sockets.in(data.room).emit(`playersInRoom`, players)
    })
  }

  // Define actions inside
  io.on(`connection`, onConnection)

  console.log(`Setting up socket`)
  res.end()
}
