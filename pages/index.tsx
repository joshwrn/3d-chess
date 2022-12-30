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
