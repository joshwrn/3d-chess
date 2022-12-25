import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { getBasePiece } from './'

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
  const { position } = piece

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
    const { x, y } = move
    const nextPosition = { x: position.x + x, y: position.y + y }
    const nextTile = board[nextPosition.y]?.[nextPosition.x]
    if (!nextTile) return false
    if (nextTile.piece?.color === piece.color) return false
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
