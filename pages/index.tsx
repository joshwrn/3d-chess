import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'
import { Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'

import type { Board, Position, Tile } from '../src/logic/board'
import { DEFAULT_BOARD } from '../src/logic/board'
import {
  checkIfSelectedPieceCanMoveHere,
  movesForPiece,
} from '../src/logic/pieces'
import { isPawn } from '../src/logic/pieces/pawn'
import type { ModelProps } from '../src/models'
import { BishopComponent } from '../src/models/Bishop'
import { Border } from '../src/models/Border'
import { KingComponent } from '../src/models/King'
import { KnightComponent } from '../src/models/Knight'
import { PawnModel } from '../src/models/Pawn'
import { QueenComponent } from '../src/models/Queen'
import { RookComponent } from '../src/models/Rook'
import { TileComponent } from '../src/models/Tile'

const tileHeights = Array(64)
  .fill(0)
  .map(() => {
    return Math.random() * 0.05
  })

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
export type MovingTo = {
  move: Position
  tile: Tile
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(DEFAULT_BOARD)

  const [selected, setSelected] = useState<Tile | null>(null)
  const [moves, setMoves] = useState<Position[]>([])
  const [movingTo, setMovingTo] = useState<MovingTo | null>(null)

  const selectThisPiece = (e: ThreeMouseEvent, tile: Tile | null) => {
    e.stopPropagation()
    if (!tile?.piece?.type && !selected) return
    if (!tile?.piece) {
      setSelected(null)
      return
    }

    setMovingTo(null)
    setMoves(movesForPiece(tile.piece, board))
    setSelected(tile)
  }

  const finishMovingPiece = (tile: Tile | null) => {
    if (!selected) return
    if (!tile) return
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

    setMovingTo(null)
    setMoves([])
    setSelected(null)
  }

  const startMovingPiece = (
    e: ThreeMouseEvent,
    tile: Tile,
    theMove: Position,
  ) => {
    e.stopPropagation()
    setMovingTo({ move: theMove, tile: tile })
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
      {/* <MiniMap
        board={board}
        selected={selected}
        moves={moves}
        finishMovingPiece={finishMovingPiece}
        selectThisPiece={selectThisPiece}
      /> */}
      <Canvas shadows camera={{ position: [-5, 2, 10], fov: 70 }}>
        <OrbitControls enableZoom={true} />
        <Environment preset="dawn" />
        <Border />
        <group position={[-4, -0.5, -4]}>
          <pointLight
            shadow-mapSize={[2048, 2048]}
            castShadow
            position={[0, 10, 0]}
            intensity={0.2}
          />

          {board.map((row, i) => {
            return row.map((tile, j) => {
              const bg = `${(i + j) % 2 === 0 ? `white` : `black`}`
              const isSelected =
                tile.piece && selected?.piece?.getId() === tile.piece.getId()

              const canMoveHere = checkIfSelectedPieceCanMoveHere({
                tile,
                moves,
                selected,
              })
              const tileHeight = tileHeights[j * i]
              const tileToMoveToHeight =
                tileHeights[
                  (movingTo?.tile?.position.y ?? 0) *
                    (movingTo?.tile?.position.x ?? 0)
                ]
              const newTileHeight = tileToMoveToHeight - tileHeight

              const props: ModelProps = {
                position: [j, 0.8 + tileHeight, i],
                scale: [0.15, 0.15, 0.15],
                color: tile.piece?.color || `white`,
                onClick: (e: ThreeMouseEvent) =>
                  canMoveHere
                    ? startMovingPiece(e, tile, canMoveHere)
                    : selectThisPiece(e, tile),
                isSelected: isSelected ? true : false,
                canMoveHere: canMoveHere,
                movingTo: isSelected && movingTo ? movingTo : null,
                finishMovingPiece: () =>
                  finishMovingPiece(movingTo?.tile ?? null),
                newTileHeight: newTileHeight,
              }

              return (
                <group key={`${j}-${i}`}>
                  <TileComponent
                    color={bg}
                    position={[j, 0.25 + tileHeight, i]}
                    onClick={(e) =>
                      canMoveHere
                        ? startMovingPiece(e, tile, canMoveHere)
                        : selectThisPiece(e, tile)
                    }
                    canMoveHere={canMoveHere}
                    isSelected={isSelected ? true : false}
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
      </Canvas>
    </div>
  )
}

export default Home
