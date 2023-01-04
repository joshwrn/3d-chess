import type { FC } from 'react'
import { useEffect, useState } from 'react'

import type { History } from '@components/History'
import { css } from '@emotion/react'
import type { Board, Tile } from '@logic/board'
import { createBoard } from '@logic/board'
import type { Color, GameOverType, Move, Piece } from '@logic/pieces'
import { oppositeColor } from '@logic/pieces'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import type { DefaultEventsMap } from '@socket.io/component-emitter'
import type { Socket } from 'socket.io-client'
import io from 'socket.io-client'
import create from 'zustand'

import { BoardComponent } from '@/components/Board'
import type { Message } from '@/components/Chat'
import { Chat } from '@/components/Chat'
import { GameCreation } from '@/components/GameCreation'
import { GameOverScreen } from '@/components/GameOverScreen'
import { Sidebar } from '@/components/Sidebar'
import { Border } from '@/models/Border'

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

export const useGameSettingsState = create<{
  gameType: `local` | `online`
  setGameType: (type: `local` | `online`) => void
  turn: Color
  setTurn: () => void
  resetTurn: () => void
  playerColor: Color
  setPlayerColor: (color: Color) => void
}>((set) => ({
  gameType: `local`,
  setGameType: (type) => set({ gameType: type }),
  turn: `white`,
  setTurn: () => set((state) => ({ turn: oppositeColor(state.turn) })),
  resetTurn: () => set({ turn: `white` }),
  playerColor: `white`,
  setPlayerColor: (color: Color) => set({ playerColor: color }),
}))

export const usePlayerState = create<{
  username: string
  setUsername: (username: string) => void
  room: string
  setRoom: (room: string) => void
  joinedRoom: boolean
  setJoinedRoom: (joinedRoom: boolean) => void
}>((set) => ({
  username: ``,
  setUsername: (username) => set({ username }),
  room: ``,
  setRoom: (room) => set({ room }),
  joinedRoom: false,
  setJoinedRoom: (joinedRoom) => set({ joinedRoom }),
}))

let socket: Socket<DefaultEventsMap, DefaultEventsMap>

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(createBoard())
  const [selected, setSelected] = useState<Piece | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const resetHistory = useHistoryState((state) => state.reset)
  const [resetTurn] = useGameSettingsState((state) => [state.resetTurn])
  const { room, username } = usePlayerState((state) => ({
    room: state.room,
    username: state.username,
  }))

  const [messages, setMessages] = useState<Array<Message>>([])
  const [players, setPlayers] = useState<number>(0)

  useEffect(() => {
    socketInitializer()
  }, [])

  const socketInitializer = async () => {
    await fetch(`/api/socket`)
    socket = io()

    socket.on(`newIncomingMessage`, (msg) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        { author: msg.author, message: msg.message },
      ])
    })

    socket.on(`playerJoined`, (data) => {
      setMessages((currentMsg) => [
        ...currentMsg,
        {
          author: `System`,
          message: `${data.username} has joined ${data.room}`,
        },
      ])
    })

    socket.on(`playersInRoom`, (data) => {
      setPlayers(data)
    })
  }

  const reset = () => {
    setBoard(createBoard())
    setSelected(null)
    setMoves([])
    resetHistory()
    resetTurn()
    setGameOver(null)
  }

  useEffect(() => {
    console.log({ players })
  }, [players])

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        background-color: #000;
        background: linear-gradient(180deg, #000000, #242424);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      <GameCreation socket={socket} />
      <Sidebar
        board={board}
        moves={moves}
        selected={selected}
        reset={reset}
        setBoard={setBoard}
      />
      <Chat
        messages={messages}
        room={room}
        socket={socket}
        chosenUsername={username}
      />
      <div
        css={css`
          position: absolute;
          top: 30px;
          left: 50%;
          transform: translateX(-50%);
          color: #ffffff8d;
          font-size: 20px;
          z-index: 100;
        `}
      >
        {room}
      </div>
      <GameOverScreen gameOver={gameOver} reset={reset} />
      <Canvas shadows camera={{ position: [-10, 5, 6], fov: 70 }}>
        <OrbitControls
          maxDistance={25}
          minDistance={7}
          enabled={!gameOver && players === 2}
          enableZoom={true}
          enablePan={false}
        />
        <Environment preset="dawn" />
        <Border />
        <BoardComponent
          selected={selected}
          setSelected={setSelected}
          board={board}
          setBoard={setBoard}
          moves={moves}
          setMoves={setMoves}
          setGameOver={setGameOver}
        />
      </Canvas>
    </div>
  )
}

export default Home
