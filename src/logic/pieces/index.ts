import type { Board, Position, Tile } from '../board'
import { copyBoard } from '../board'
import { bishopMoves, createBishop, isBishop } from './bishop'
import type { King } from './king'
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
  piece: King | Pawn | Piece | null
  board: Board
  propagateDetectCheck: boolean
}): Move[] => {
  if (!piece) return []
  const props = { piece, board, propagateDetectCheck }
  if (isPawn(piece)) {
    return pawnMoves({ ...props, piece: piece as Pawn })
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
    return kingMoves({ ...props, piece: piece as King })
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
  captureEnPassant: `captureEnPassant` as const,
  castling: `castling` as const,
  willBeInCheck: `willBeInCheck` as const,
}
export type MoveTypes = typeof moveTypes[keyof typeof moveTypes]
export type Move = {
  steps: Position
  type: MoveTypes
  piece: Piece
  capture: Piece | null
  newPosition: Position
  castling?: {
    rook: Piece
    rookNewPosition: Position
    rookSteps: Position
  }
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
  const newBoard = copyBoard(board)
  const tile = getTile(newBoard, piece.position)
  const newTile = getTile(newBoard, {
    x: move.x + piece.position.x,
    y: move.y + piece.position.y,
  })
  if (!tile || !newTile) return false
  newTile.piece = piece
  tile.piece = null

  for (const tile of newBoard.flat()) {
    if (tile.piece?.color === oppositeColor(piece.color)) {
      const moves = movesForPiece({
        piece: tile.piece,
        board: newBoard,
        propagateDetectCheck: false,
      })
      if (moves.find((move) => move.type === `captureKing`)) {
        return true
      }
    }
  }
  return false
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

export const getTile = (board: Board, position: Position): Tile | null => {
  const row = board[position.y]
  if (!row) return null
  const cur = row[position.x]
  if (!cur) return null
  return cur
}

export const getPiece = (board: Board, position: Position): Piece | null => {
  const piece = getTile(board, position)?.piece
  return piece || null
}

export const getMove = ({
  piece,
  board,
  steps,
  propagateDetectCheck,
  getFar,
}: {
  piece: Piece
  board: Board
  steps: Position
  propagateDetectCheck: boolean
  getFar?: boolean
}): Move | null => {
  const { position } = piece
  const { x, y } = steps
  const nextPosition = { x: position.x + x, y: position.y + y }
  const row = board[nextPosition.y]
  if (!row) return null
  const cur = row[nextPosition.x]
  if (!cur) return null
  const props = {
    piece,
    steps,
    newPosition: nextPosition,
  }
  const willBeCheck = propagateDetectCheck && willBeInCheck(piece, board, steps)

  if (cur.piece?.color === oppositeColor(piece.color) && !willBeCheck) {
    return {
      ...props,
      type: cur.piece.type === `king` ? `captureKing` : `capture`,
      capture: cur.piece,
    }
  }
  if (cur.piece) {
    return null
  }

  if (willBeCheck) {
    return getFar
      ? {
          ...props,
          type: `willBeInCheck`,
          capture: null,
        }
      : null
  }

  return {
    steps,
    type: `valid`,
    piece,
    capture: null,
    newPosition: nextPosition,
  }
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
    const getStep = (dir: Position) => ({ x: dir.x * i, y: dir.y * i })
    const steps = getStep(dir)
    const move = getMove({
      piece,
      board,
      steps,
      propagateDetectCheck,
      getFar: true,
    })
    if (!move) break
    if (move.type === `willBeInCheck`) continue
    moves.push(move)
    if (move.type === `capture` || move.type === `captureKing`) break
  }
  return moves
}

export const createId = (piece?: PieceArgs | null): string => {
  if (!piece) return `empty`
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
    if (
      move.newPosition.x === tile.position.x &&
      move.newPosition.y === tile.position.y
    ) {
      return move
    }
  }
  return null
}
