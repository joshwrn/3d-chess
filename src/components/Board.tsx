import type { FC } from 'react'
import React, { useState } from 'react'

import { useFrame } from '@react-three/fiber'
import { useMotionValue } from 'framer-motion'
import { motion } from 'framer-motion-3d'

import type { MovingTo, ThreeMouseEvent } from '../../pages'
import type { Position, Tile, Board } from '../logic/board'
import { DEFAULT_BOARD } from '../logic/board'
import type { Color } from '../logic/pieces'
import { checkIfSelectedPieceCanMoveHere, movesForPiece } from '../logic/pieces'
import { isPawn } from '../logic/pieces/pawn'
import type { ModelProps } from '../models'
import { BishopComponent } from '../models/Bishop'
import { KingComponent } from '../models/King'
import { KnightComponent } from '../models/Knight'
import { PawnModel } from '../models/Pawn'
import { QueenComponent } from '../models/Queen'
import { RookComponent } from '../models/Rook'
import { TileComponent } from '../models/Tile'

const tileHeights = Array(64)
  .fill(0)
  .map(() => {
    return Math.random() * 0.05
  })

const copyBoard = (board: Board): Board => {
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

export const BoardComponent: FC = () => {
  const [board, setBoard] = useState<Board>(DEFAULT_BOARD)

  const [selected, setSelected] = useState<Tile | null>(null)
  const [moves, setMoves] = useState<Position[]>([])
  const [movingTo, setMovingTo] = useState<MovingTo | null>(null)
  const [turn, setTurn] = useState<Color>(`white`)

  const whiteLight = useMotionValue(0.2)
  const blackLight = useMotionValue(0.2)

  useFrame(() => {
    if (turn === `white`) {
      whiteLight.set(1)
      blackLight.set(0.2)
    } else {
      whiteLight.set(0.2)
      blackLight.set(1)
    }
  })
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
    setTurn((prev) => (prev === `white` ? `black` : `white`))
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
    <group position={[-4, -0.5, -4]}>
      {/* <mesh position={[3.5, 3, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#000" />
          </mesh> */}

      <motion.pointLight
        position={[3.5, 3, 7]}
        shadow-mapSize={[2048, 2048]}
        castShadow
        intensity={whiteLight as unknown as number}
      />
      {/* <motion.pointLight
            position={[3.5, 3, 0]}
            shadow-mapSize={[2048, 2048]}
            castShadow
            intensity={whiteLightTransform}
          /> */}

      <pointLight
        shadow-mapSize={[2048, 2048]}
        castShadow
        position={[0, 10, 0]}
        intensity={0.2}
        color="#ffbdd6"
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

          const movingToId = movingTo?.tile?.piece?.getId()
          const tileId = tile.piece?.getId()
          const pieceIsBeingReplaced =
            movingTo?.tile.piece && tile.piece ? tileId === movingToId : false

          const handleClick = (e: ThreeMouseEvent) => {
            if (tile.piece && !canMoveHere && tile.piece?.color !== turn) {
              return
            }
            canMoveHere
              ? startMovingPiece(e, tile, canMoveHere)
              : selectThisPiece(e, tile)
          }

          const props: ModelProps = {
            position: [j, 0.5 + tileHeight, i],
            scale: [0.15, 0.15, 0.15],
            color: tile.piece?.color || `white`,
            onClick: handleClick,
            isSelected: isSelected ? true : false,
            canMoveHere: canMoveHere,
            movingTo: isSelected && movingTo ? movingTo : null,
            pieceIsBeingReplaced: pieceIsBeingReplaced ? true : false,
            finishMovingPiece: () => finishMovingPiece(movingTo?.tile ?? null),
            newTileHeight: newTileHeight,
          }

          return (
            <group key={`${j}-${i}`}>
              <TileComponent
                color={bg}
                position={[j, 0.25 + tileHeight, i]}
                onClick={handleClick}
                canMoveHere={canMoveHere}
                isSelected={isSelected ? true : false}
              />
              {tile.piece?.type === `pawn` && <PawnModel {...props} />}
              {tile.piece?.type === `rook` && <RookComponent {...props} />}
              {tile.piece?.type === `knight` && <KnightComponent {...props} />}
              {tile.piece?.type === `bishop` && <BishopComponent {...props} />}
              {tile.piece?.type === `queen` && <QueenComponent {...props} />}
              {tile.piece?.type === `king` && <KingComponent {...props} />}
            </group>
          )
        })
      })}
    </group>
  )
}
