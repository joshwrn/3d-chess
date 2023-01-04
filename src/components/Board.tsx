import type { FC } from 'react'
import React, { useEffect, useState } from 'react'

import type { Position, Tile, Board } from '@logic/board'
import { copyBoard } from '@logic/board'
import type { Color, Move, Piece } from '@logic/pieces'
import {
  getTile,
  detectGameOver,
  oppositeColor,
  shouldPromotePawn,
  checkIfSelectedPieceCanMoveHere,
  movesForPiece,
} from '@logic/pieces'
import { isPawn } from '@logic/pieces/pawn'
import { BishopComponent } from '@models/Bishop'
import type { ModelProps } from '@models/index'
import { MeshWrapper } from '@models/index'
import { KingComponent } from '@models/King'
import { KnightComponent } from '@models/Knight'
import { PawnModel } from '@models/Pawn'
import { QueenComponent } from '@models/Queen'
import { RookComponent } from '@models/Rook'
import { TileComponent } from '@models/Tile'
import type { GameOver, MovingTo, ThreeMouseEvent } from '@pages/index'
import { useGameSettingsState, useHistoryState } from '@pages/index'
import { useSpring, animated } from '@react-spring/three'

import { isKing } from '@/logic/pieces/king'
import { isRook } from '@/logic/pieces/rook'

export const BoardComponent: FC<{
  selected: Piece | null
  setSelected: (piece: Piece | null) => void
  board: Board
  setBoard: React.Dispatch<React.SetStateAction<Board>>
  moves: Move[]
  setGameOver: (gameOver: GameOver | null) => void
  setMoves: (moves: Move[]) => void
}> = ({
  selected,
  setSelected,
  board,
  setBoard,
  moves,
  setMoves,
  setGameOver,
}) => {
  const [lastSelected, setLastSelected] = useState<Tile | null>(null)
  const [movingTo, setMovingTo] = useState<MovingTo | null>(null)
  const [history, setHistory] = useHistoryState((state) => [
    state.history,
    state.addItem,
  ])
  const [turn, setTurn] = useGameSettingsState((state) => [
    state.turn,
    state.setTurn,
  ])

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
    setHistory({
      board: copyBoard(board),
      to: movingTo.move.newPosition,
      from: movingTo.move.piece.position,
      steps: movingTo.move.steps,
      capture: movingTo.move.capture,
      type: movingTo.move.type,
      piece: movingTo.move.piece,
    })
    setBoard((prev) => {
      const newBoard = copyBoard(prev)
      const selectedTile = getTile(newBoard, selected.position)
      const tileToMoveTo = getTile(newBoard, tile.position)
      if (!selectedTile || !tileToMoveTo) return prev

      if (
        isPawn(selectedTile.piece) ||
        isKing(selectedTile.piece) ||
        isRook(selectedTile.piece)
      ) {
        selectedTile.piece = { ...selectedTile.piece, hasMoved: true }
      }
      if (isPawn(selectedTile.piece) && shouldPromotePawn({ tile })) {
        selectedTile.piece.type = `queen`
        selectedTile.piece.id = selectedTile.piece.id + 1
      }

      if (
        isPawn(selectedTile.piece) &&
        movingTo.move.type === `captureEnPassant`
      ) {
        const latestMove = history[history.length - 1]
        const enPassantTile = newBoard[latestMove.to.y][latestMove.to.x]
        enPassantTile.piece = null
      }

      if (movingTo.move.castling) {
        const rookTile =
          newBoard[movingTo.move.castling.rook.position.y][
            movingTo.move.castling.rook.position.x
          ]
        const rookTileToMoveTo =
          newBoard[movingTo.move.castling.rookNewPosition.y][
            movingTo.move.castling.rookNewPosition.x
          ]
        if (!isRook(rookTile.piece)) return prev

        rookTileToMoveTo.piece = {
          ...rookTile.piece,
          hasMoved: true,
          position: rookTileToMoveTo.position,
        }
        rookTile.piece = null
      }

      tileToMoveTo.piece = selectedTile.piece
        ? { ...selectedTile.piece, position: tile.position }
        : null
      selectedTile.piece = null
      return newBoard
    })

    setTurn()

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
        position={[redLightPosition.x, 1, redLightPosition.y]}
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

          const tileId = tile.piece?.getId()
          const pieceIsBeingReplaced =
            movingTo?.move.piece && tile.piece
              ? tileId === movingTo?.move.capture?.getId()
              : false
          const rookCastled = movingTo?.move.castling?.rook
          const isBeingCastled =
            rookCastled && rookCastled.getId() === tile.piece?.getId()

          const handleClick = (e: ThreeMouseEvent) => {
            if (movingTo) {
              return
            }

            const tileContainsOtherPlayersPiece =
              tile.piece && tile.piece?.color !== turn

            if (tileContainsOtherPlayersPiece && !canMoveHere) {
              setSelected(null)
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
            canMoveHere: canMoveHere?.newPosition ?? null,
            movingTo:
              isSelected && movingTo
                ? movingTo.move.steps
                : isBeingCastled
                ? movingTo.move.castling?.rookSteps ?? null
                : null,
            pieceIsBeingReplaced: pieceIsBeingReplaced ? true : false,
            finishMovingPiece: () =>
              isBeingCastled ? null : finishMovingPiece(movingTo?.tile ?? null),
          }

          const pieceId = tile.piece?.getId() ?? `empty-${j}-${i}`

          return (
            <group key={`${j}-${i}`}>
              <TileComponent
                color={bg}
                position={[j, 0.25, i]}
                onClick={handleClick}
                canMoveHere={canMoveHere?.newPosition ?? null}
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
