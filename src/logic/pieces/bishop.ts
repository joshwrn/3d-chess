import type { MoveFunction, Piece, PieceFactory } from './'
import { getFarMoves, getBasePiece } from './'

export function isBishop(value: Bishop | Piece | null): value is Bishop {
  return value?.type === `bishop`
}

export const bishopMoves: MoveFunction = ({
  piece,
  board,
  propagateWillBeCheck,
}) => {
  const moveRightDown = getFarMoves({
    dir: { x: 1, y: 1 },
    piece,
    board,
    propagateWillBeCheck,
  })
  const moveLeftUp = getFarMoves({
    dir: { x: -1, y: -1 },
    piece,
    board,
    propagateWillBeCheck,
  })
  const moveLeftDown = getFarMoves({
    dir: { x: -1, y: 1 },
    piece,
    board,
    propagateWillBeCheck,
  })
  const moveRightUp = getFarMoves({
    dir: { x: 1, y: -1 },
    piece,
    board,
    propagateWillBeCheck,
  })
  return [...moveRightDown, ...moveLeftUp, ...moveLeftDown, ...moveRightUp]
}

export const createBishop = ({ color, id, position }: PieceFactory): Bishop => {
  return {
    ...getBasePiece({ color, id, type: `bishop`, position }),
  }
}

export type Bishop = Piece
