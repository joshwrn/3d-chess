import type { Board, Position, Tile } from '../board'
import { bishopMoves, createBishop, isBishop } from './bishop'
import { createKing, isKing, kingMoves } from './king'
import { createKnight, isKnight, knightMoves } from './knight'
import type { Pawn } from './pawn'
import { createPawn, isPawn, pawnMoves } from './pawn'
import { createQueen, isQueen, queenMoves } from './queen'
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
  if (isQueen(piece)) {
    return queenMoves({ piece, board })
  }
  if (isKing(piece)) {
    return kingMoves({ piece, board })
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
    case `queen`:
      return createQueen(args)
    case `king`:
      return createKing(args)
    default:
      return null
  }
}

export type MoveTypes = `capture` | `invalid` | `valid`

export const checkPosition = (
  piece: Piece,
  board: Board,
  move: Position,
): MoveTypes => {
  const { position } = piece
  const { x, y } = move
  const nextPosition = { x: position.x + x, y: position.y + y }
  const row = board[nextPosition.y]
  if (!row) return `invalid`
  const cur = row[nextPosition.x]
  if (!cur) return `invalid`
  if (cur.piece) {
    if (cur.piece?.color === oppositeColor(piece.color)) {
      return `capture`
    }
    return `invalid`
  }
  return `valid`
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
  const moves: Position[] = []
  for (let i = 1; i < 8; i++) {
    const getMove = (dir: Position) => ({ x: dir.x * i, y: dir.y * i })
    const move = getMove(dir)
    const check = checkPosition(piece, board, move)
    if (check === `invalid`) break
    moves.push(move)
    if (check === `capture`) break
  }
  return moves
}

export const createId = (piece: PieceArgs | null): string => {
  return `${piece?.type}-${piece?.color}-${piece?.id}`
}

export const checkIfSelectedPieceCanMoveHere = ({
  selected,
  moves,
  tile,
}: {
  selected: Tile | null
  moves: Position[]
  tile: Tile
}): Position | null => {
  if (!selected?.piece) return null

  let theMove: Position | null = null

  for (const move of moves) {
    const pos = selected.position || { x: 0, y: 0 }

    if (
      pos.x + move.x === tile.position.x &&
      pos.y + move.y === tile.position.y
    ) {
      theMove = move
      break
    }
  }
  return theMove
}
