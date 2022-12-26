import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import { MiniMap } from '../src/components/MiniMap'
import { TileComponent } from '../src/components/Tile'
import type { Board, Position, Tile } from '../src/logic/board'
import { DEFAULT_BOARD } from '../src/logic/board'
import { movesForPiece } from '../src/logic/pieces'
import { isPawn } from '../src/logic/pieces/pawn'
import type { ModelProps } from '../src/models'
import { BishopComponent } from '../src/models/Bishop'
import { KingComponent } from '../src/models/King'
import { KnightComponent } from '../src/models/Knight'
import { PawnModel } from '../src/models/Pawn'
import { QueenComponent } from '../src/models/Queen'
import { RookComponent } from '../src/models/Rook'

const copyBoard = (board: Board) => {
  return [
    ...board.map((row) => {
      return [
        ...row.map((tile) => {
          return { ...tile }
        }),
      ]
    }),
  ]
}

export type ThreeMouseEvent = {
  stopPropagation: () => void
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(DEFAULT_BOARD)

  const [selected, setSelected] = useState<Tile | null>(null)
  const [moves, setMoves] = useState<Position[]>([])

  const handleSelect = (e: ThreeMouseEvent, tile: Tile | null) => {
    e.stopPropagation()
    if (!tile?.piece?.type && !selected) return
    if (!tile?.piece) {
      setSelected(null)
      return
    }

    setMoves(movesForPiece(tile.piece, board))
    setSelected(tile)
  }

  const handleMove = (e: ThreeMouseEvent, tile: Tile) => {
    e.stopPropagation()
    if (!selected) return
    setBoard((prev) => {
      const newBoard = copyBoard(prev)
      const selectedTile = newBoard[selected.position.y][selected.position.x]
      const tileToMoveTo = newBoard[tile.position.y][tile.position.x]
      if (isPawn(selectedTile.piece)) {
        selectedTile.piece.firstMove = false
      }

      tileToMoveTo.piece = selected.piece
        ? Object.assign({}, { ...selected.piece, position: tile.position })
        : null
      selectedTile.piece = null

      return [...newBoard]
    })

    setMoves([])
    setSelected(null)
  }

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        background-color: #000;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      <MiniMap
        board={board}
        selected={selected}
        moves={moves}
        handleMove={handleMove}
        handleSelect={handleSelect}
      />
      <Canvas>
        <OrbitControls enableZoom={false} />
        <ambientLight intensity={0.25} />
        <group position={[-5, -0.5, -5]}>
          {board.map((row, i) => {
            return row.map((tile, j) => {
              const bg = `${(i + j) % 2 === 0 ? `#a8968b` : `#5e3d1e`}`
              const isSelected =
                tile.piece && selected?.piece?.getId() === tile.piece.getId()
              const canMoveTo = () => {
                if (!selected?.piece) return false

                let canMove = false
                for (const move of moves) {
                  const pos = selected.position || { x: 0, y: 0 }

                  if (
                    pos.x + move.x === tile.position.x &&
                    pos.y + move.y === tile.position.y
                  ) {
                    canMove = true
                    break
                  }
                }
                return canMove
              }

              const canMove = canMoveTo()

              const props: ModelProps = {
                position: [j, 0.8, i],
                scale: [0.15, 0.15, 0.15],
                color: tile.piece?.color || `white`,
                onClick: (e: ThreeMouseEvent) =>
                  canMove ? handleMove(e, tile) : handleSelect(e, tile),
              }

              return (
                <group key={`${j}-${i}`}>
                  <TileComponent
                    color={canMove ? `red` : bg}
                    position={[j, 0, i]}
                    onClick={(e) =>
                      canMove ? handleMove(e, tile) : handleSelect(e, tile)
                    }
                  />
                  {tile.piece?.type === `pawn` && <PawnModel {...props} />}
                  {tile.piece?.type === `rook` && <RookComponent {...props} />}
                  {tile.piece?.type === `knight` && (
                    <KnightComponent {...props} />
                  )}
                  {tile.piece?.type === `bishop` && (
                    <BishopComponent {...props} />
                  )}
                  {tile.piece?.type === `queen` && <QueenComponent {...props} />}
                  {tile.piece?.type === `king` && <KingComponent {...props} />}
                </group>
              )
            })
          })}
        </group>
        <pointLight position={[10, 10, 10]} />
      </Canvas>
    </div>
  )
}

export default Home
