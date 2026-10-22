import type { FC } from 'react'
import React from 'react'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { BishopComponent } from '@models/Bishop'
import { KingComponent } from '@models/King'
import { KnightComponent } from '@models/Knight'
import { MeshWrapper } from '@models/index'
import { PawnModel } from '@models/Pawn'
import { QueenComponent } from '@models/Queen'
import { RookComponent } from '@models/Rook'

const FILES = 'abcdefgh'
const models: Record<string, FC> = {
  p: PawnModel,
  r: RookComponent,
  n: KnightComponent,
  b: BishopComponent,
  q: QueenComponent,
  k: KingComponent,
}

type BoardProps = { fen: string; lastMove?: string | null; view?: 'isometric' | 'top' | 'white'; colors?: { light: string; dark: string } }

const Scene: FC<BoardProps> = ({ fen, lastMove, colors = { light: '#EEEED2', dark: '#769656' } }) => {
  const ranks = fen.split(' ')[0].split('/')
  const pieces: { key: string; file: number; rank: number; symbol: string }[] = []
  ranks.forEach((row, rowIndex) => {
    let file = 0
    for (const symbol of row) {
      if (/\d/.test(symbol)) {
        file += Number(symbol)
      } else {
        pieces.push({ key: `${FILES[file]}${8 - rowIndex}-${symbol}`, file, rank: rowIndex, symbol })
        file += 1
      }
    }
  })
  const lastSquares = lastMove ? [lastMove.slice(0, 2), lastMove.slice(2, 4)] : []

  return (
    <group position={[-3.5, -0.5, -3.5]}>
      <OrbitControls maxDistance={22} minDistance={7} enablePan={false} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 10, 5]} intensity={0.8} />
      <hemisphereLight intensity={0.3} color="#ffffff" groundColor="#9299a1" />
      {Array.from({ length: 64 }, (_, index) => {
        const file = index % 8
        const rank = Math.floor(index / 8)
        const square = `${FILES[file]}${8 - rank}`
        const isLast = lastSquares.includes(square)
        const light = (file + rank) % 2 === 0
        return (
          <mesh key={square} position={[file, 0.22, rank]}>
            <boxGeometry args={[1, 0.44, 1]} />
            <meshStandardMaterial
              color={isLast ? '#BACB48' : light ? colors.light : colors.dark}
              roughness={0.92}
            />
          </mesh>
        )
      })}
      {pieces.map(({ key, file, rank, symbol }) => {
        const Model = models[symbol.toLowerCase()]
        const color = symbol === symbol.toUpperCase() ? 'white' : 'black'
        return (
          <MeshWrapper
            key={key}
            position={[file, 0.5, rank]}
            scale={[0.17, 0.17, 0.17]}
            color={color}
            isSelected={false}
            canMoveHere={null}
            movingTo={null}
            finishMovingPiece={() => undefined}
            pieceIsBeingReplaced={false}
            wasSelected={false}
          >
            <Model />
          </MeshWrapper>
        )
      })}
      <mesh position={[3.5, -0.16, 3.5]}>
        <boxGeometry args={[8.4, 0.22, 8.4]} />
      <meshStandardMaterial color="#3b3d39" roughness={0.82} />
      </mesh>
    </group>
  )
}

export const DemoBoard: FC<BoardProps> = ({ view = 'isometric', ...props }) => {
  const camera = view === 'top' ? [0, 17, 0.01] as [number, number, number]
    : view === 'white' ? [0, 11, 16] as [number, number, number]
      : [6, 9, 15] as [number, number, number]
  const fov = view === 'top' ? 32 : view === 'white' ? 27 : 24
  return <Canvas camera={{ position: camera, fov }} dpr={[1, 1.7]}>
    <color attach="background" args={['#bac4b8']} />
    <Scene {...props} />
  </Canvas>
}
