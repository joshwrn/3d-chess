import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { checkPosition, getBasePiece } from './'

export function isKing(value: King | Piece | null): value is King {
  return value?.type === `king`
}

export const kingMoves: MoveFunction = ({
  piece,
  board,
  propagateWillBeCheck,
}) => {
  const allMoves: Move[] = [
    {
      type: `invalid`,
      position: {
        x: 0,
        y: -1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: 0,
        y: 1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: -1,
        y: 0,
      },
    },
    {
      type: `invalid`,
      position: {
        x: 1,
        y: 0,
      },
    },
    {
      type: `invalid`,
      position: {
        x: -1,
        y: -1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: 1,
        y: 1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: -1,
        y: 1,
      },
    },
    {
      type: `invalid`,
      position: {
        x: 1,
        y: -1,
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

export const createKing = ({ color, id, position }: PieceFactory): King => {
  return {
    ...getBasePiece({ color, id, type: `king`, position }),
  }
}

export type King = Piece
