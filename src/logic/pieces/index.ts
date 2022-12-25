import type { Board, Position } from '../board'
import { bishopMoves, createBishop, isBishop } from './bishop'
import { createKnight, isKnight, knightMoves } from './knight'
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
  if (isKnight(piece)) {
    return knightMoves({ piece, board })
  }
  if (isBishop(piece)) {
    return bishopMoves({ piece, board })
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
      return createPawn(args)
    case `rook`:
      return createRook(args)
    case `knight`:
      return createKnight(args)
    case `bishop`:
      return createBishop(args)
    default:
      return null
  }
}

export const getFarMoves = ({
  dir,
  piece,
  board,
}: {
  dir: Position
  piece: Piece
  board: Board
}): Position[] => {
  const { position } = piece
  const moves: Position[] = []
  for (let i = 1; i < 8; i++) {
    const getMove = (dir: Position) => ({ x: dir.x * i, y: dir.y * i })
    const move = getMove(dir)
    const { x, y } = move
    const nextPosition = { x: position.x + x, y: position.y + y }
    const row = board[nextPosition.y]
    if (!row) break
    const cur = row[nextPosition.x]
    if (!cur) break
    if (cur.piece) {
      if (cur.piece?.color === oppositeColor(piece.color)) {
        moves.push(move)
      }
      break
    }
    moves.push(move)
  }
  return moves
}

export const createId = (piece: PieceArgs | null): string => {
  return `${piece?.type}-${piece?.color}-${piece?.id}`
}
