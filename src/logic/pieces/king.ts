import type { Board, Position } from '../board'
import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { getFarMoves, getPiece, getMove, getBasePiece } from './'
import { isRook } from './rook'

export function isKing(value: King | Piece | null): value is King {
  return value?.type === `king`
}

const canCastleKing = (king: King, board: Board): Move[] => {
  if (king.hasMoved) return []
  const possibleRookPositions: Move[] = []
  const rook = getPiece(board, {
    x: king.position.x + 3,
    y: king.position.y,
  })
  const spacesToRight = getFarMoves({
    board,
    piece: king,
    dir: { x: 1, y: 0 },
    propagateDetectCheck: false,
  })
  if (isRook(rook) && !rook.hasMoved && spacesToRight.length === 2) {
    possibleRookPositions.push({
      newPosition: { x: 6, y: king.position.y },
      piece: king,
      steps: { x: 2, y: 0 },
      capture: null,
      type: `castling`,
      castling: {
        rook,
        rookSteps: { x: -2, y: 0 },
        rookNewPosition: { x: 5, y: king.position.y },
      },
    })
  }
  const spacesToLeft = getFarMoves({
    board,
    piece: king,
    dir: { x: -1, y: 0 },
    propagateDetectCheck: false,
  })
  const rook2 = getPiece(board, {
    x: king.position.x - 4,
    y: king.position.y,
  })
  if (isRook(rook2) && !rook2.hasMoved && spacesToLeft.length === 3) {
    possibleRookPositions.push({
      newPosition: { x: 2, y: king.position.y },
      piece: king,
      steps: { x: -2, y: 0 },
      capture: null,
      type: `castling`,
      castling: {
        rook: rook2,
        rookSteps: { x: 3, y: 0 },
        rookNewPosition: { x: 3, y: king.position.y },
      },
    })
  }
  return possibleRookPositions
}

export const kingMoves: MoveFunction<King> = ({
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

  const possibleCastles = canCastleKing(piece, board)

  return [...moves, ...possibleCastles]
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
