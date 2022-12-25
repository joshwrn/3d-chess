import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { checkPosition, getBasePiece } from './'

export function isKnight(value: Knight | Piece | null): value is Knight {
  return value?.type === `knight`
}

export const knightMoves = ({
  piece,
  board,
}: {
  piece: Knight
  board: Board
}): Position[] => {
  const moves: Position[] = [
    {
      x: 1,
      y: 2,
    },
    {
      x: 2,
      y: 1,
    },
    {
      x: 2,
      y: -1,
    },
    {
      x: 1,
      y: -2,
    },
    {
      x: -1,
      y: -2,
    },
    {
      x: -2,
      y: -1,
    },
    {
      x: -2,
      y: 1,
    },
    {
      x: -1,
      y: 2,
    },
  ].filter((move) => {
    const check = checkPosition(piece, board, move)
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
