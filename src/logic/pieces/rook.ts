import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { getFarMoves, getBasePiece } from './'

export function isRook(value: Piece | Rook | null): value is Rook {
  return value?.type === `rook`
}

export const rookMoves = ({
  piece,
  board,
}: {
  piece: Rook
  board: Board
}): Position[] => {
  const movesForward = getFarMoves({ dir: { x: 0, y: 1 }, piece, board })
  const movesBackward = getFarMoves({ dir: { x: 0, y: -1 }, piece, board })
  const movesLeft = getFarMoves({ dir: { x: -1, y: 0 }, piece, board })
  const movesRight = getFarMoves({ dir: { x: 1, y: 0 }, piece, board })
  return [...movesForward, ...movesBackward, ...movesLeft, ...movesRight]
}

export const createRook = ({ color, id, position }: PieceFactory): Rook => {
  return {
    ...getBasePiece({ color, id, type: `rook`, position }),
  }
}

export type Rook = Piece
