import type { Board, Position } from '../board'
import type { Pawn } from './pawn'
import { createPawn, isPawn, pawnMoves } from './pawn'
import { createRook, isRook, rookMoves } from './rook'

export type Piece = {
  type: PieceType
  color: Color
  id: number
  getId: () => string
  position: Position
}

export type Color = `black` | `white`
export type PieceType = `bishop` | `king` | `knight` | `pawn` | `queen` | `rook`

export const oppositeColor = (color: Color): Color => {
  return color === `black` ? `white` : `black`
}

export const movesForPiece = (
  piece: Pawn | Piece | null,
  board: Board,
): Position[] => {
  if (!piece) return []
  if (isPawn(piece)) {
    return pawnMoves({ piece, board })
  }
  if (isRook(piece)) {
    return rookMoves({ piece, board })
  }
  return []
}

export type PieceArgs = {
  color: Color
  id: number
  type: PieceType
}

export type PieceFactory = PieceArgs & { position: Position }

export const getBasePiece = (args: PieceFactory): Piece => {
  return {
    color: args.color,
    id: args.id,
    type: args.type,
    getId: () => createId(args),
    position: args.position,
  }
}

export const createPiece = (
  args?: PieceArgs & { position: Position },
): Pawn | Piece | null => {
  if (!args) return null
  switch (args.type) {
    case `pawn`:
      return createPawn({
        color: args.color,
        id: args.id,
        position: args.position,
        type: args.type,
      })
    case `rook`:
      return createRook({
        color: args.color,
        id: args.id,
        position: args.position,
        type: args.type,
      })
    default:
      return null
  }
}

export const createId = (piece: PieceArgs | null): string => {
  return `${piece?.type}-${piece?.color}-${piece?.id}`
}
