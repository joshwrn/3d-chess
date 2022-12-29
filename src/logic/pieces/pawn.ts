import type { Position } from '../board'
import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { classifyMoveType, getBasePiece } from './'

export function isPawn(value: Pawn | Piece | null): value is Pawn {
  return value?.type === `pawn`
}

export const pawnMoves: MoveFunction<Pawn> = ({
  piece,
  board,
  propagateDetectCheck,
}) => {
  const { firstMove, color } = piece
  const colorMultiplier = color === `white` ? -1 : 1

  const moves: Move[] = []

  const movesForward: Position[] = [{ x: 0, y: 1 * colorMultiplier }]
  if (firstMove) {
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
  const firstMove = true
  return {
    firstMove,
    ...getBasePiece({ color, id, type: `pawn`, position }),
  }
}

export type Pawn = Piece & {
  firstMove: boolean
}
