import type { MoveFunction, Piece, PieceFactory } from './'
import { getFarMoves, getBasePiece } from './'

export function isBishop(value: Bishop | Piece | null): value is Bishop {
  return value?.type === `bishop`
}

export const bishopMoves: MoveFunction = ({
  piece,
  board,
  propagateDetectCheck,
}) => {
  const props = { piece, board, propagateDetectCheck }
  const moveRightDown = getFarMoves({ dir: { x: 1, y: 1 }, ...props })
  const moveLeftUp = getFarMoves({ dir: { x: -1, y: -1 }, ...props })
  const moveLeftDown = getFarMoves({ dir: { x: -1, y: 1 }, ...props })
  const moveRightUp = getFarMoves({ dir: { x: 1, y: -1 }, ...props })
  return [...moveRightDown, ...moveLeftUp, ...moveLeftDown, ...moveRightUp]
}

export const createBishop = ({ color, id, position }: PieceFactory): Bishop => {
  return {
    ...getBasePiece({ color, id, type: `bishop`, position }),
  }
}

export type Bishop = Piece
