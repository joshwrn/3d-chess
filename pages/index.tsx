import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { BoardComponent } from '../src/components/Board'
import { GameOverScreen } from '../src/components/GameOverScreen'
import type { History } from '../src/components/History'
import { Sidebar } from '../src/components/Sidebar'
import type { Board, Tile } from '../src/logic/board'
import { createBoard } from '../src/logic/board'
import type { Color, GameOverType, Move, Piece } from '../src/logic/pieces'
import { Border } from '../src/models/Border'

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

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(createBoard())
  const [selected, setSelected] = useState<Piece | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const [history, setHistory] = useState<History[]>([])
  const [turn, setTurn] = useState<Color>(`white`)

  const reset = () => {
    setBoard(createBoard())
    setSelected(null)
    setMoves([])
    setHistory([])
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
        history={history}
        moves={moves}
        selected={selected}
        reset={reset}
        setBoard={setBoard}
        setHistory={setHistory}
        setTurn={setTurn}
      />
      <GameOverScreen gameOver={gameOver} reset={reset} />
      <Canvas shadows camera={{ position: [-5, 2, 10], fov: 70 }}>
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
          setHistory={setHistory}
          turn={turn}
          setTurn={setTurn}
        />
      </Canvas>
    </div>
  )
}

export default Home
