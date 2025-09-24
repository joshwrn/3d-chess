/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import type { NextApiRequest, NextApiResponse } from 'next'
import type { Socket } from 'socket.io'
import { Server } from 'socket.io'

import type { MakeMoveClient, MovingTo } from '@/components/Board'
import type { MessageClient } from '@/components/Chat'
import type { JoinRoomClient } from '@/components/GameCreation'
import type { Color } from '@/logic/pieces'
import type { CameraMove } from '@/server/cameraMove'
import { cameraMove } from '@/server/cameraMove'
import { disconnect } from '@/server/disconnect'
import { fetchPlayers } from '@/server/fetchPlayers'
import { joinRoom } from '@/server/joinRoom'
import { makeMove } from '@/server/makeMove'
import { resetGame } from '@/server/resetGame'
import { sendMessage } from '@/server/sendMessage'
import type { Message } from '@/state/player'

export type playerJoinedServer = {
  room: string
  username: string
  color: Color
  playerCount: number
}

export type Room = {
  room: string
}
export interface SocketClientToServer {
  createdMessage: (MessageClient: MessageClient) => void
  joinRoom: (JoinRoomClient: JoinRoomClient) => void
  makeMove: (MakeMoveClient: MakeMoveClient) => void
  cameraMove: (CameraMove: CameraMove) => void
  fetchPlayers: (Room: Room) => void
  resetGame: (Room: Room) => void
  playerLeft: (Room: Room) => void
  disconnect: (Room: Room) => void
  disconnecting: (Room: Room) => void
  error: (Room: Room) => void
  existingPlayer: (room: Room & { name: string }) => void
}

export interface SocketServerToClient {
  newIncomingMessage: (MessageClient: Message) => void
  playerJoined: (playerJoinedServer: playerJoinedServer) => void
  moveMade: (movingTo: MovingTo) => void
  cameraMoved: (CameraMove: CameraMove) => void
  playersInRoom: (players: number) => void
  gameReset: (data: boolean) => void
  newError: (error: string) => void
  joinRoom: (JoinRoomClient: JoinRoomClient) => void
  playerLeft: (Room: Room) => void
  clientExistingPlayer: (name: string) => void
}

export type MySocket = Socket<SocketClientToServer, SocketServerToClient>
export type MyServer = Server<SocketClientToServer, SocketServerToClient>

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse & {
    socket: {
      server: any & {
        io?: Server
      }
    }
  },
): void {
  if (res?.socket?.server?.io) {
    console.log(`Socket server already initialized`)
    res.end()
    return
  }

  const io = new Server<SocketClientToServer, SocketServerToClient>(
    res?.socket?.server,
    {
      cors: {
        origin: `*`,
        methods: [`GET`, `POST`],
        credentials: true,
      },
      allowEIO3: true,
      transports: [`polling`],
      pingTimeout: 60000,
      pingInterval: 25000,
    },
  )
  res.socket.server.io = io

  const onConnection = (socket: MySocket) => {
    sendMessage(socket, io)
    joinRoom(socket, io)
    makeMove(socket, io)
    cameraMove(socket, io)
    fetchPlayers(socket, io)
    resetGame(socket, io)
    disconnect(socket, io)
    socket.on(`existingPlayer`, (data) => {
      io.sockets.in(data.room).emit(`clientExistingPlayer`, data.name)
    })
  }

  // Define actions inside
  io.on(`connection`, onConnection)

  console.log(`Setting up socket`)
  res.end()
}
