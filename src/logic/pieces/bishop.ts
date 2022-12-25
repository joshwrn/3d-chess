import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { getFarMoves, getBasePiece } from './'

export function isBishop(value: Bishop | Piece | null): value is Bishop {
  return value?.type === `bishop`
}

export const bishopMoves = ({
  piece,
  board,
}: {
  piece: Bishop
  board: Board
}): Position[] => {
  const moveRightDown = getFarMoves({ dir: { x: 1, y: 1 }, piece, board })
  const moveLeftUp = getFarMoves({ dir: { x: -1, y: -1 }, piece, board })
  const moveLeftDown = getFarMoves({ dir: { x: -1, y: 1 }, piece, board })
  const moveRightUp = getFarMoves({ dir: { x: 1, y: -1 }, piece, board })
  return [...moveRightDown, ...moveLeftUp, ...moveLeftDown, ...moveRightUp]
}

export const createBishop = ({ color, id, position }: PieceFactory): Bishop => {
  return {
    ...getBasePiece({ color, id, type: `bishop`, position }),
  }
}

export type Bishop = Piece
