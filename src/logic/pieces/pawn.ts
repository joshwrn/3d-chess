import { useHistoryState } from '@pages/index'

import type { Position } from '../board'
import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { classifyMoveType, getBasePiece } from './'

export function isPawn(value: Pawn | Piece | null): value is Pawn {
  return value?.type === `pawn`
}

const canEnPassant = (piece: Piece, colorMultiplier: number) => {
  const { history } = useHistoryState.getState()
  const lastMove = history[history.length - 1]
  if (
    lastMove &&
    lastMove.piece.type === `pawn` &&
    Math.abs(lastMove.steps.y) === 2
  ) {
    const isSameY = lastMove.to.y === piece.position.y
    const isOnRight = lastMove.to.x === piece.position.x + 1
    const isOnLeft = lastMove.to.x === piece.position.x - 1

    const canEnPassant = isSameY && (isOnRight || isOnLeft)
    if (canEnPassant) {
      return {
        x: isOnLeft ? -1 : 1,
        y: colorMultiplier,
      }
    }
  }
  return null
}

export const pawnMoves: MoveFunction<Pawn> = ({
  piece,
  board,
  propagateDetectCheck,
}) => {
  const { hasMoved, color } = piece
  const colorMultiplier = color === `white` ? -1 : 1

  const moves: Move[] = []

  const movesForward: Position[] = [{ x: 0, y: 1 * colorMultiplier }]
  if (!hasMoved) {
    movesForward.push({ x: 0, y: 2 * colorMultiplier })
  }
  for (const move of movesForward) {
    const type = classifyMoveType({ piece, board, move, propagateDetectCheck })
    if (type !== `invalid` && type !== `capture` && type !== `captureKing`) {
      moves.push({ position: move, type: type })
    } else {
      break
    }
  }

  const enPassant = canEnPassant(piece, colorMultiplier)
  if (enPassant) {
    moves.push({
      position: enPassant,
      type: `captureEnPassant`,
    })
  }

  const movesDiagonal: Position[] = [
    { x: 1, y: 1 * colorMultiplier },
    { x: -1, y: 1 * colorMultiplier },
  ]
  for (const move of movesDiagonal) {
    const type = classifyMoveType({ piece, board, move, propagateDetectCheck })
    if (type === `capture` || type === `captureKing`) {
      moves.push({ position: move, type: type })
    }
  }

  return moves
}

export const createPawn = ({ color, id, position }: PieceFactory): Pawn => {
  const hasMoved = false
  return {
    hasMoved,
    ...getBasePiece({ color, id, type: `pawn`, position }),
  }
}

export type Pawn = Piece & {
  hasMoved: boolean
}
