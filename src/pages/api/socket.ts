/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket, ServerOptions } from 'socket.io'
import { Server } from 'socket.io'

import type { Color } from '@/logic/pieces'
import { cameraMove } from '@/server/cameraMove'
import { disconnect } from '@/server/disconnect'
import { fetchPlayers } from '@/server/fetchPlayers'
import { joinRoom } from '@/server/joinRoom'
import { makeMove } from '@/server/makeMove'
import { resetGame } from '@/server/resetGame'
import { sendMessage } from '@/server/sendMessage'

export type playerJoinedServer = {
  room: string
  username: string
  color: Color
  playerCount: number
}

export const socketOnEvents = [
  `createdMessage`,
  `joinRoom`,
  `makeMove`,
  `cameraMove`,
  `fetchPlayers`,
  `resetGame`,
  `disconnect`,
] as const
export type SocketOnEvents = typeof socketOnEvents[number]
interface On {
  on: (event: SocketOnEvents, callback: (data: any) => void) => void
}
export const socketEmitEvents = [
  `newIncomingMessage`,
  `playerJoined`,
  `moveMade`,
  `cameraMoved`,
  `playersInRoom`,
  `gameReset`,
  `newError`,
  `joinRoom`,
  `playerLeft`,
] as const
export type SocketEmitEvents = typeof socketEmitEvents[number]
export type MySocket = Omit<Socket, `on`> & On

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
  // It means that socket server was already initialized
  if (res?.socket?.server?.io) {
    console.log(`Already set up`)
    res.end()
    return
  }

  const io = new Server(res?.socket?.server)
  res.socket.server.io = io

  const onConnection = (socket: MySocket) => {
    sendMessage(socket, io)
    joinRoom(socket, io)
    makeMove(socket, io)
    cameraMove(socket, io)
    fetchPlayers(socket, io)
    resetGame(socket, io)
    disconnect(socket, io)
  }

  // Define actions inside
  io.on(`connection`, onConnection)

  console.log(`Setting up socket`)
  res.end()
}
