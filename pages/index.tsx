import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { VscDebugRestart } from 'react-icons/vsc'

import { BoardComponent } from '../src/components/Board'
import { MiniMap } from '../src/components/MiniMap'
import type { Board, Position, Tile } from '../src/logic/board'
import { DEFAULT_BOARD } from '../src/logic/board'
import type { Move } from '../src/logic/pieces'
import { Border } from '../src/models/Border'

export type ThreeMouseEvent = {
  stopPropagation: () => void
}
export type MovingTo = {
  move: Position
  tile: Tile
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(DEFAULT_BOARD)
  const [selected, setSelected] = useState<Tile | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [checkmate, setCheckmate] = useState(``)

  const reset = () => {
    setBoard(DEFAULT_BOARD)
    setSelected(null)
    setMoves([])
    setCheckmate(``)
  }
  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        background-color: #000;
        background: linear-gradient(180deg, #1b1b1b, #111);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      <MiniMap board={board} selected={selected} moves={moves} />
      {checkmate !== `` && (
        <div
          css={css`
            position: absolute;
            width: 50vw;
            min-width: 300px;
            height: 300px;
            background-color: #ffffff2c;
            backdrop-filter: blur(10px);
            border: 1px solid #ffffff29;
            border-radius: 10px;
            display: flex;
            gap: 1rem;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            top: 50%;
            left: 50%;
            z-index: 100;
            transform: translate(-50%, -50%);
            h1 {
              color: #fff;
            }
            button {
              background-color: #fff;
              font-size: 2rem;
            }
          `}
        >
          <h1>{checkmate} wins!</h1>
          <button onClick={reset}>
            <VscDebugRestart />
          </button>
        </div>
      )}
      <Canvas shadows camera={{ position: [-5, 2, 10], fov: 70 }}>
        <OrbitControls enabled={checkmate === ``} enableZoom={true} />
        <Environment preset="dawn" />
        <Border />
        <BoardComponent
          selected={selected}
          setSelected={setSelected}
          board={board}
          setBoard={setBoard}
          moves={moves}
          setMoves={setMoves}
          checkmate={checkmate}
          setCheckmate={setCheckmate}
        />
      </Canvas>
    </div>
  )
}

export default Home
