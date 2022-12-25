import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { checkPosition, getBasePiece } from './'

export function isKing(value: King | Piece | null): value is King {
  return value?.type === `king`
}

export const kingMoves = ({
  piece,
  board,
}: {
  piece: King
  board: Board
}): Position[] => {
  const moves: Position[] = [
    {
      x: 0,
      y: -1,
    },
    {
      x: 0,
      y: 1,
    },
    {
      x: -1,
      y: 0,
    },
    {
      x: 1,
      y: 0,
    },
    {
      x: -1,
      y: -1,
    },
    {
      x: 1,
      y: 1,
    },
    {
      x: -1,
      y: 1,
    },
    {
      x: 1,
      y: -1,
    },
  ].filter((move) => {
    const check = checkPosition(piece, board, move)
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
