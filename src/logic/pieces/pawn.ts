import type { Position } from '../board'
import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { checkPosition, getBasePiece } from './'

export function isPawn(value: Pawn | Piece | null): value is Pawn {
  return value?.type === `pawn`
}

export const pawnMoves: MoveFunction<Pawn> = ({
  piece,
  board,
  propagateWillBeCheck,
}) => {
  const { firstMove, color } = piece
  const colorMultiplier = color === `white` ? -1 : 1

  const moves: Move[] = []

  const movesForward: Position[] = [{ x: 0, y: 1 * colorMultiplier }]
  if (firstMove) {
    movesForward.push({ x: 0, y: 2 * colorMultiplier })
  }
  for (const move of movesForward) {
    const check = checkPosition({ piece, board, move, propagateWillBeCheck })
    if (check !== `invalid` && check !== `capture`) {
      moves.push({ position: move, type: check })
    }
  }

  const movesDiagonal: Position[] = [
    { x: 1, y: 1 * colorMultiplier },
    { x: -1, y: 1 * colorMultiplier },
  ]

  for (const move of movesDiagonal) {
    const check = checkPosition({ piece, board, move, propagateWillBeCheck })
    if (check !== `capture`) continue
    moves.push({ position: move, type: check })
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
