import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'
import type { Board } from '@logic/board'
import { createBoard } from '@logic/board'
import type { Color, GameOverType, Move, Piece } from '@logic/pieces'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { BoardComponent } from '@/components/Board'
import { Chat } from '@/components/Chat'
import { GameCreation } from '@/components/GameCreation'
import { GameOverScreen } from '@/components/GameOverScreen'
import { Sidebar } from '@/components/Sidebar'
import { StatusBar } from '@/components/StatusBar'
import { Border } from '@/models/Border'
import { useGameSettingsState } from '@/state/game'
import { useHistoryState } from '@/state/history'
import { usePlayerState } from '@/state/player'
import { useSockets } from '@/utils/socket'

export type GameOver = {
  type: GameOverType
  winner: Color
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(createBoard())
  const [selected, setSelected] = useState<Piece | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const resetHistory = useHistoryState((state) => state.reset)
  const { resetTurn, gameStarted } = useGameSettingsState((state) => ({
    resetTurn: state.resetTurn,
    gameStarted: state.gameStarted,
  }))
  const { joined } = usePlayerState((state) => ({
    joined: state.joinedRoom,
  }))

  useSockets()

  const reset = () => {
    setBoard(createBoard())
    setSelected(null)
    setMoves([])
    resetHistory()
    resetTurn()
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
      <GameCreation />
      <Sidebar
        board={board}
        moves={moves}
        selected={selected}
        reset={reset}
        setBoard={setBoard}
      />
      {joined && <Chat />}
      <StatusBar />
      <GameOverScreen gameOver={gameOver} reset={reset} />
      <Canvas shadows camera={{ position: [-10, 5, 6], fov: 70 }}>
        <OrbitControls
          maxDistance={25}
          minDistance={7}
          enabled={!gameOver && gameStarted}
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
