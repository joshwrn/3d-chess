import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { getFarMoves, getBasePiece } from './'

export function isQueen(value: Piece | Queen | null): value is Queen {
  return value?.type === `queen`
}

export const queenMoves = ({
  piece,
  board,
}: {
  piece: Queen
  board: Board
}): Position[] => {
  const moveRightDown = getFarMoves({ dir: { x: 1, y: 1 }, piece, board })
  const moveLeftUp = getFarMoves({ dir: { x: -1, y: -1 }, piece, board })
  const moveLeftDown = getFarMoves({ dir: { x: -1, y: 1 }, piece, board })
  const moveRightUp = getFarMoves({ dir: { x: 1, y: -1 }, piece, board })

  const movesForward = getFarMoves({ dir: { x: 0, y: 1 }, piece, board })
  const movesBackward = getFarMoves({ dir: { x: 0, y: -1 }, piece, board })
  const movesLeft = getFarMoves({ dir: { x: -1, y: 0 }, piece, board })
  const movesRight = getFarMoves({ dir: { x: 1, y: 0 }, piece, board })

  return [
    ...moveRightDown,
    ...moveLeftUp,
    ...moveLeftDown,
    ...moveRightUp,
    ...movesForward,
    ...movesBackward,
    ...movesLeft,
    ...movesRight,
  ]
}

export const createQueen = ({ color, id, position }: PieceFactory): Queen => {
  return {
    ...getBasePiece({ color, id, type: `queen`, position }),
  }
}

export type Queen = Piece
