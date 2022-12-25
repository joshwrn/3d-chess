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
  const rightDown = getFarMoves({ dir: { x: 1, y: 1 }, piece, board })
  const leftUp = getFarMoves({ dir: { x: -1, y: -1 }, piece, board })
  const leftDown = getFarMoves({ dir: { x: -1, y: 1 }, piece, board })
  const rightUp = getFarMoves({ dir: { x: 1, y: -1 }, piece, board })
  return [...rightDown, ...leftUp, ...leftDown, ...rightUp]
}

export const createBishop = ({ color, id, position }: PieceFactory): Bishop => {
  return {
    ...getBasePiece({ color, id, type: `bishop`, position }),
  }
}

export type Bishop = Piece
