import type { FC } from 'react'
import { useState } from 'react'

import { BoardComponent } from '@components/Board'
import { GameOverScreen } from '@components/GameOverScreen'
import type { History } from '@components/History'
import { Sidebar } from '@components/Sidebar'
import { css } from '@emotion/react'
import type { Board, Tile } from '@logic/board'
import { createBoard } from '@logic/board'
import type { Color, GameOverType, Move, Piece } from '@logic/pieces'
import { Border } from '@models/Border'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import create from 'zustand'

import { Loader } from '@/components/Loader'

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

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(createBoard())
  const [selected, setSelected] = useState<Piece | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const resetHistory = useHistoryState((state) => state.reset)
  const [turn, setTurn] = useState<Color>(`white`)

  const reset = () => {
    setBoard(createBoard())
    setSelected(null)
    setMoves([])
    resetHistory()
    setTurn(`white`)
    setGameOver(null)
  }

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
      <Sidebar
        board={board}
        moves={moves}
        selected={selected}
        reset={reset}
        setBoard={setBoard}
        setTurn={setTurn}
      />
      <GameOverScreen gameOver={gameOver} reset={reset} />
      <Loader />
      <Canvas shadows camera={{ position: [-10, 5, 6], fov: 70 }}>
        <OrbitControls
          maxDistance={25}
          minDistance={7}
          enabled={!gameOver}
          enableZoom={true}
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
          turn={turn}
          setTurn={setTurn}
        />
      </Canvas>
    </div>
  )
}

export default Home
