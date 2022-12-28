import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { BoardComponent } from '../src/components/Board'
import type { Board, Position, Tile } from '../src/logic/board'
import { TEST_BOARD } from '../src/logic/board'
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
  const [board, setBoard] = useState<Board>(TEST_BOARD)
  const [selected, setSelected] = useState<Tile | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
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
      {/* <MiniMap board={board} selected={selected} moves={moves} /> */}
      <Canvas shadows camera={{ position: [-5, 2, 10], fov: 70 }}>
        <OrbitControls enableZoom={true} />
        <Environment preset="dawn" />
        <Border />
        <BoardComponent
          selected={selected}
          setSelected={setSelected}
          board={board}
          setBoard={setBoard}
          moves={moves}
          setMoves={setMoves}
        />
      </Canvas>
    </div>
  )
}

export default Home
