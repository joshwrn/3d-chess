import { Server } from 'socket.io'

export default function SocketHandler(req: any, res: any): any {
  // It means that socket server was already initialised
  if (res?.socket?.server?.io) {
    console.log(`Already set up`)
    res.end()
    return
  }

  const io = new Server(res.socket.server)
  res.socket.server.io = io

  const onConnection = (socket: any) => {
    const createdMessage = (data: any) => {
      console.log(`createdMessage`, data)
      io.sockets.in(data.room).emit(`newIncomingMessage`, data.msg)
    }
    socket.on(`createdMessage`, createdMessage)

    socket.on(`joinRoom`, (room: any) => {
      socket.join(room)
      console.log(`join room ${room}`)
    })
  }

  // Define actions inside
  io.on(`connection`, onConnection)

  console.log(`Setting up socket`)
  res.end()
}
