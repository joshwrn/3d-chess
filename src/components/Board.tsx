import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import { useSpring, animated } from '@react-spring/three'

import type { GameOver, MovingTo, ThreeMouseEvent } from '../../pages'
import type { Position, Tile, Board } from '../logic/board'
import { copyBoard } from '../logic/board'
import type { Color, Move, Piece } from '../logic/pieces'
import {
  detectGameOver,
  oppositeColor,
  shouldPromotePawn,
  checkIfSelectedPieceCanMoveHere,
  movesForPiece,
} from '../logic/pieces'
import { isPawn } from '../logic/pieces/pawn'
import type { ModelProps } from '../models'
import { MeshWrapper } from '../models'
import { BishopComponent } from '../models/Bishop'
import { KingComponent } from '../models/King'
import { KnightComponent } from '../models/Knight'
import { PawnModel } from '../models/Pawn'
import { QueenComponent } from '../models/Queen'
import { RookComponent } from '../models/Rook'
import { TileComponent } from '../models/Tile'
import type { History } from './History'

export const BoardComponent: FC<{
  selected: Piece | null
  setSelected: (piece: Piece | null) => void
  board: Board
  setBoard: React.Dispatch<React.SetStateAction<Board>>
  moves: Move[]
  setGameOver: (gameOver: GameOver | null) => void
  setMoves: (moves: Move[]) => void
  setHistory: React.Dispatch<React.SetStateAction<History[]>>
}> = ({
  selected,
  setSelected,
  board,
  setBoard,
  moves,
  setMoves,
  setGameOver,
  setHistory,
}) => {
  const [lastSelected, setLastSelected] = useState<Tile | null>(null)
  const [movingTo, setMovingTo] = useState<MovingTo | null>(null)
  const [turn, setTurn] = useState<Color>(`white`)
  const [redLightPosition, setRedLightPosition] = useState<Position>({
    x: 0,
    y: 0,
  })

  const selectThisPiece = (e: ThreeMouseEvent, tile: Tile | null) => {
    e.stopPropagation()
    if (!tile?.piece?.type && !selected) return
    if (!tile?.piece) {
      setSelected(null)
      return
    }

    setMovingTo(null)
    setMoves(
      movesForPiece({ piece: tile.piece, board, propagateDetectCheck: true }),
    )
    setSelected(tile.piece)
    setLastSelected(tile)
    setRedLightPosition(tile.position)
  }

  const finishMovingPiece = (tile: Tile | null) => {
    if (!selected) return
    if (!tile) return
    if (!movingTo) return
    setHistory((prev) => {
      return [
        ...prev,
        {
          board: copyBoard(board),
          to: tile.position,
          from: selected.position,
          type: movingTo.move.type,
          piece: selected,
        },
      ]
    })
    setBoard((prev) => {
      const newBoard = copyBoard(prev)
      const selectedTile = newBoard[selected.position.y][selected.position.x]
      const tileToMoveTo = newBoard[tile.position.y][tile.position.x]
      if (isPawn(selectedTile.piece)) {
        selectedTile.piece.firstMove = false
        if (shouldPromotePawn({ tile })) {
          selectedTile.piece.type = `queen`
        }
      }

      tileToMoveTo.piece = selected
        ? Object.assign({}, { ...selected, position: tile.position })
        : null
      selectedTile.piece = null
      return [...newBoard]
    })
    setTurn((prev) => {
      const next = oppositeColor(prev)
      return next
    })

    setMovingTo(null)
    setMoves([])
    setSelected(null)
    setLastSelected(null)
  }

  useEffect(() => {
    const gameOverType = detectGameOver(board, turn)
    if (gameOverType) {
      setGameOver({ type: gameOverType, winner: oppositeColor(turn) })
    }
  }, [board, turn])

  const startMovingPiece = (e: ThreeMouseEvent, tile: Tile, nextTile: Move) => {
    e.stopPropagation()
    setMovingTo({ move: nextTile, tile: tile })
  }

  const { intensity } = useSpring({
    intensity: selected ? 0.35 : 0,
  })

  return (
    <group position={[-4, -0.5, -4]}>
      {/* <mesh position={[3.5, 5, 3.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#d886b7" />
      </mesh> */}
      <pointLight
        shadow-mapSize={[2048, 2048]}
        castShadow
        position={[3.5, 10, 3.5]}
        intensity={0.65}
        color="#ffe0ec"
      />
      <hemisphereLight intensity={0.5} color="#ffa4a4" groundColor="#d886b7" />
      {/* @ts-ignore */}
      <animated.pointLight
        intensity={intensity}
        color="red"
        position={[redLightPosition.x, 0, redLightPosition.y]}
      />
      {board.map((row, i) => {
        return row.map((tile, j) => {
          const bg = `${(i + j) % 2 === 0 ? `white` : `black`}`
          const isSelected =
            tile.piece && selected?.getId() === tile.piece.getId()

          const canMoveHere = checkIfSelectedPieceCanMoveHere({
            tile,
            moves,
            selected,
          })

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
            position: [j, 0.5, i],
            scale: [0.15, 0.15, 0.15],
            color: tile.piece?.color || `white`,
            onClick: handleClick,
            isSelected: isSelected ? true : false,
            wasSelected: lastSelected
              ? lastSelected?.piece?.getId() === tile.piece?.getId()
              : false,
            canMoveHere: canMoveHere?.position ?? null,
            movingTo: isSelected && movingTo ? movingTo : null,
            pieceIsBeingReplaced: pieceIsBeingReplaced ? true : false,
            finishMovingPiece: () => finishMovingPiece(movingTo?.tile ?? null),
          }

          const pieceId = tile.piece?.getId() ?? `empty-${j}-${i}`

          return (
            <group key={`${j}-${i}`}>
              <TileComponent
                color={bg}
                position={[j, 0.25, i]}
                onClick={handleClick}
                canMoveHere={canMoveHere?.position ?? null}
                isSelected={isSelected ? true : false}
              />
              <MeshWrapper key={pieceId} {...props}>
                {tile.piece?.type === `pawn` && <PawnModel />}
                {tile.piece?.type === `rook` && <RookComponent />}
                {tile.piece?.type === `knight` && <KnightComponent />}
                {tile.piece?.type === `bishop` && <BishopComponent />}
                {tile.piece?.type === `queen` && <QueenComponent />}
                {tile.piece?.type === `king` && <KingComponent />}
              </MeshWrapper>
            </group>
          )
        })
      })}
    </group>
  )
}
