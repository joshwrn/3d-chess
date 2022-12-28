import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { checkPosition, getBasePiece } from './'

export function isKnight(value: Knight | Piece | null): value is Knight {
  return value?.type === `knight`
}

export const knightMoves: MoveFunction = ({
  piece,
  board,
  propagateWillBeCheck,
}) => {
  const allMoves: Move[] = [
    {
      type: `invalid`,
      position: {
        x: 1,
        y: 2,
      },
    },
    {
      type: `invalid`,
      position: {
        x: 2,
        y: 1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: 2,
        y: -1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: 1,
        y: -2,
      },
    },
    {
      type: `invalid`,
      position: {
        x: -1,
        y: -2,
      },
    },
    {
      type: `invalid`,
      position: {
        x: -2,
        y: -1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: -2,
        y: 1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: -1,
        y: 2,
      },
    },
  ]

  const moves = allMoves.filter((move) => {
    const check = checkPosition({ piece, board, move, propagateWillBeCheck })
    if (check === `invalid`) return false
    return true
  })

  return moves
}

export const createKnight = ({ color, id, position }: PieceFactory): Knight => {
  return {
    ...getBasePiece({ color, id, type: `knight`, position }),
  }
}

export type Knight = Piece
