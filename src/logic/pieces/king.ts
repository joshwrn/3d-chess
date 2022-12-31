import type { Position } from '../board'
import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { getMove, getBasePiece } from './'

export function isKing(value: King | Piece | null): value is King {
  return value?.type === `king`
}

export const kingMoves: MoveFunction = ({
  piece,
  board,
  propagateDetectCheck,
}) => {
  const moves: Move[] = []

  for (const steps of KING_MOVES) {
    const move = getMove({ piece, board, steps, propagateDetectCheck })
    if (!move) continue
    moves.push(move)
  }

  return moves
}

export const createKing = ({ color, id, position }: PieceFactory): King => {
  return {
    hasMoved: false,
    ...getBasePiece({ color, id, type: `king`, position }),
  }
}

export type King = Piece & {
  hasMoved: boolean
}

const KING_MOVES: Position[] = [
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
]
