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

export const movesForPiece = ({
  piece,
  board,
  propagateDetectCheck,
}: {
  piece: Pawn | Piece | null
  board: Board
  propagateDetectCheck: boolean
}): Move[] => {
  if (!piece) return []
  const props = { piece, board, propagateDetectCheck }
  if (isPawn(piece)) {
    return pawnMoves({ ...props } as {
      piece: Pawn
      board: Board
      propagateDetectCheck: boolean
    })
  }
  if (isRook(piece)) {
    return rookMoves(props)
  }
  if (isKnight(piece)) {
    return knightMoves(props)
  }
  if (isBishop(piece)) {
    return bishopMoves(props)
  }
  if (isQueen(piece)) {
    return queenMoves(props)
  }
  if (isKing(piece)) {
    return kingMoves(props)
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

export const moveTypes = {
  invalid: `invalid` as const,
  valid: `valid` as const,
  captureKing: `captureKing` as const,
  capture: `capture` as const,
}
export type MoveTypes = typeof moveTypes[keyof typeof moveTypes]
export type Move = {
  position: Position
  type: MoveTypes
}
export type MoveFunction<T extends Piece = Piece> = (props: {
  piece: T
  board: Board
  propagateDetectCheck: boolean
}) => Move[]

export const willBeInCheck = (
  piece: Piece,
  board: Board,
  move: Position,
): boolean => {
  let isCheck = false
  const newBoard = board.map((row) =>
    row.map((tile) => {
      if (
        tile.position.x === piece.position.x &&
        tile.position.y === piece.position.y
      ) {
        return {
          ...tile,
          piece: null,
        }
      }
      if (
        tile.position.x === move.x + piece.position.x &&
        tile.position.y === move.y + piece.position.y
      ) {
        return {
          ...tile,
          piece,
        }
      }
      return tile
    }),
  )

  for (const tile of newBoard.flat()) {
    if (tile.piece?.color === oppositeColor(piece.color)) {
      const moves = movesForPiece({
        piece: tile.piece,
        board: newBoard,
        propagateDetectCheck: false,
      })
      if (moves.find((move) => move.type === `captureKing`)) {
        isCheck = true
        return isCheck
      }
    }
  }
  return isCheck
}

export type GameOverType = `checkmate` | `stalemate`

export const detectStalemate = (
  board: Board,
  turn: Color,
): GameOverType | null => {
  for (const tile of board.flat()) {
    if (tile.piece?.color === turn) {
      const moves = movesForPiece({
        piece: tile.piece,
        board,
        propagateDetectCheck: true,
      })
      if (moves.find((move) => move.type !== `invalid`)) {
        return null
      }
    }
  }
  return `stalemate`
}

export const detectCheckmate = (
  board: Board,
  turn: Color,
): GameOverType | null => {
  for (const tile of board.flat()) {
    if (tile.piece?.color !== turn) {
      const moves = movesForPiece({
        piece: tile.piece,
        board,
        propagateDetectCheck: false,
      })
      if (moves.find((move) => move.type === `captureKing`)) {
        return `checkmate`
      }
    }
  }

  return null
}

export const detectGameOver = (
  board: Board,
  turn: Color,
): GameOverType | null => {
  let gameOver = null
  const staleMate = detectStalemate(board, turn)
  if (staleMate) {
    gameOver = staleMate
    const checkMate = detectCheckmate(board, turn)
    if (checkMate) gameOver = checkMate
  }

  return gameOver
}

export const classifyMoveType = ({
  piece,
  board,
  move,
  propagateDetectCheck,
}: {
  piece: Piece
  board: Board
  move: Position
  propagateDetectCheck: boolean
}): MoveTypes => {
  const { position } = piece
  const { x, y } = move
  const nextPosition = { x: position.x + x, y: position.y + y }
  const row = board[nextPosition.y]
  if (!row) return `invalid`
  const cur = row[nextPosition.x]
  if (!cur) return `invalid`
  if (propagateDetectCheck && willBeInCheck(piece, board, move)) return `invalid`
  if (cur.piece) {
    if (cur.piece?.color === oppositeColor(piece.color)) {
      return cur.piece.type === `king` ? `captureKing` : `capture`
    }
    return `invalid`
  }
  return `valid`
}

export const getFarMoves = ({
  dir,
  piece,
  board,
  propagateDetectCheck,
}: {
  dir: Position
  piece: Piece
  board: Board
  propagateDetectCheck: boolean
}): Move[] => {
  const moves: Move[] = []
  for (let i = 1; i < 8; i++) {
    const getMove = (dir: Position) => ({ x: dir.x * i, y: dir.y * i })
    const move = getMove(dir)
    const type = classifyMoveType({ piece, board, move, propagateDetectCheck })
    if (type === `invalid`) break
    moves.push({ position: move, type: type })
    if (type === `capture` || type === `captureKing`) break
  }
  return moves
}

export const createId = (piece: PieceArgs | null): string => {
  return `${piece?.type}-${piece?.color}-${piece?.id}`
}

export const shouldPromotePawn = ({ tile }: { tile: Tile }): boolean => {
  if (tile.position.y === 0 || tile.position.y === 7) {
    return true
  }
  return false
}

export const checkIfSelectedPieceCanMoveHere = ({
  selected,
  moves,
  tile,
}: {
  selected: Piece | null
  moves: Move[]
  tile: Tile
}): Move | null => {
  if (!selected) return null

  for (const move of moves) {
    const pos = selected.position || { x: 0, y: 0 }

    if (
      pos.x + move.position.x === tile.position.x &&
      pos.y + move.position.y === tile.position.y
    ) {
      return move
    }
  }
  return null
}
