import type { FC } from 'react'
import { useEffect, useState } from 'react'

import type { History } from '@components/History'
import type { Board, Tile } from '@logic/board'
import { createBoard } from '@logic/board'
import type { Color, GameOverType, Move, Piece } from '@logic/pieces'
import type { DefaultEventsMap } from '@socket.io/component-emitter'
import type { Socket } from 'socket.io-client'
import io from 'socket.io-client'
import create from 'zustand'

export type ThreeMouseEvent = {
  stopPropagation: () => void
}
export type MovingTo = {
  move: Move
  tile: Tile
}
export type GameOver = {
  type: GameOverType
  winner: Color
}

export const useHistoryState = create<{
  history: History[]
  reset: VoidFunction
  addItem: (item: History) => void
  undo: VoidFunction
}>((set) => ({
  history: [] as History[],
  reset: () => set({ history: [] }),
  addItem: (item) => set((state) => ({ history: [...state.history, item] })),
  undo: () => set((state) => ({ history: state.history.slice(0, -1) })),
}))

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

type Message = {
  author: string
  message: string
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(createBoard())
  const [selected, setSelected] = useState<Piece | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const resetHistory = useHistoryState((state) => state.reset)
  const [turn, setTurn] = useState<Color>(`white`)

  const [room, setRoom] = useState(``)
  const [username, setUsername] = useState(``)
  const [chosenUsername, setChosenUsername] = useState(``)
  const [message, setMessage] = useState(``)
  const [messages, setMessages] = useState<Array<Message>>([])

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    // We just call it because we don't need anything else out of it
    await fetch(`/api/socket`)

    socket = io()

    socket.on(`newIncomingMessage`, (msg) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ])
      console.log(messages)
    })
  }

  const sendMessage = async () => {
    socket.emit(`createdMessage`, {
      room: room,
      msg: { author: chosenUsername, message },
    })
    console.log({ room })
    // setMessages((currentMsg) => [
    //   ...currentMsg,
    //   { author: chosenUsername, message },
    // ])
    setMessage(``)
  }

  const sendRoom = async () => {
    socket.emit(`joinRoom`, room)
    // setChosenUsername(username)
  }

  // const handleKeypress = (e: { keyCode: number }) => {
  //   //it triggers by pressing the enter key
  //   if (e.keyCode === 13) {
  //     if (message) {
  //       sendMessage()
  //     }
  //   }
  // }

  const reset = () => {
    setBoard(createBoard())
    setSelected(null)
    setMoves([])
    resetHistory()
    setTurn(`white`)
    setGameOver(null)
  }

  useEffect(() => {
    console.log(messages)
  }, [messages])

  return (
    <div className="flex items-center p-4 mx-auto min-h-screen justify-center bg-purple-500">
      <main className="gap-4 flex flex-col items-center justify-center w-full h-full">
        {!chosenUsername ? (
          <>
            <h3 className="font-bold text-white text-xl">
              How people should call you?
            </h3>
            <input
              type="text"
              placeholder="Identity..."
              value={username}
              className="p-3 rounded-md outline-none"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              onClick={() => setChosenUsername(username)}
              className="bg-white rounded-md px-4 py-2 text-xl"
            >
              set name
            </button>
            <input
              type="text"
              placeholder="room"
              value={room}
              className="p-3 rounded-md outline-none"
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              onClick={sendRoom}
              className="bg-white rounded-md px-4 py-2 text-xl"
            >
              join room
            </button>
          </>
        ) : (
          <>
            <p className="font-bold text-white text-xl">
              Your username: {username}
            </p>
            <div className="flex flex-col justify-end bg-white h-[20rem] min-w-[33%] rounded-md shadow-md ">
              <div className="h-full last:border-b-0 overflow-y-scroll">
                {messages.map((msg, i) => {
                  return (
                    <div
                      className="w-full py-1 px-2 border-b border-gray-200"
                      key={i}
                    >
                      {msg.author} : {msg.message}
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-gray-300 w-full flex rounded-bl-md">
                <input
                  type="text"
                  placeholder="New message..."
                  value={message}
                  className="outline-none py-2 px-2 rounded-bl-md flex-1"
                  onChange={(e) => setMessage(e.target.value)}
                  // onKeyUp={handleKeypress}
                />
                <div className="border-l border-gray-300 flex justify-center items-center  rounded-br-md group hover:bg-purple-500 transition-all">
                  <button
                    className="group-hover:text-white px-3 h-full"
                    onClick={() => {
                      sendMessage()
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
  // (
  //   <div
  //     css={css`
  //       height: 100vh;
  //       width: 100vw;
  //       background-color: #000;
  //       background: linear-gradient(180deg, #000000, #242424);
  //       display: flex;
  //       justify-content: center;
  //       align-items: center;
  //       flex-direction: column;
  //     `}
  //   >
  //     <Sidebar
  //       board={board}
  //       moves={moves}
  //       selected={selected}
  //       reset={reset}
  //       setBoard={setBoard}
  //       setTurn={setTurn}
  //     />
  //     <GameOverScreen gameOver={gameOver} reset={reset} />
  //     <Loader />
  //     <Canvas shadows camera={{ position: [-10, 5, 6], fov: 70 }}>
  //       <OrbitControls
  //         maxDistance={25}
  //         minDistance={7}
  //         enabled={!gameOver}
  //         enableZoom={true}
  //       />
  //       <Environment preset="dawn" />
  //       <Border />
  //       <BoardComponent
  //         selected={selected}
  //         setSelected={setSelected}
  //         board={board}
  //         setBoard={setBoard}
  //         moves={moves}
  //         setMoves={setMoves}
  //         setGameOver={setGameOver}
  //         turn={turn}
  //         setTurn={setTurn}
  //       />
  //     </Canvas>
  //   </div>
  // )
}

export default Home
