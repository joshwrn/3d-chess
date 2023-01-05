import type { Position, Tile } from '../board'
import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { getMove, getBasePiece } from './'
import { useHistoryState } from '@/state/history'

export function isPawn(value: Pawn | Piece | null): value is Pawn {
  return value?.type === `pawn`
}

const canEnPassant = (piece: Piece, colorMultiplier: number) => {
  const { history } = useHistoryState.getState()
  const lastMove = history[history.length - 1]
  if (
    lastMove &&
    lastMove.piece.type === `pawn` &&
    Math.abs(lastMove.steps.y) === 2
  ) {
    const isSameY = lastMove.to.y === piece.position.y
    const isOnRight = lastMove.to.x === piece.position.x + 1
    const isOnLeft = lastMove.to.x === piece.position.x - 1

    const canEnPassant = isSameY && (isOnRight || isOnLeft)
    if (canEnPassant) {
      return {
        steps: {
          x: isOnLeft ? -1 : 1,
          y: colorMultiplier,
        },
        piece: lastMove.piece,
      }
    }
  }
  return null
}

export const getPieceFromBoard = (
  board: Tile[][],
  position: Position,
): Piece | null => {
  const { x, y } = position
  const { piece } = board[y][x]
  return piece || null
}

export const pawnMoves: MoveFunction<Pawn> = ({
  piece,
  board,
  propagateDetectCheck,
}) => {
  const { hasMoved, color } = piece
  const colorMultiplier = color === `white` ? -1 : 1

  const moves: Move[] = []

  const movesForward: Position[] = [{ x: 0, y: 1 * colorMultiplier }]
  if (!hasMoved) {
    movesForward.push({ x: 0, y: 2 * colorMultiplier })
  }
  for (const steps of movesForward) {
    const move = getMove({ piece, board, steps, propagateDetectCheck })
    if (move && move.type !== `capture` && move.type !== `captureKing`) {
      moves.push(move)
    } else {
      break
    }
  }

  const enPassant = canEnPassant(piece, colorMultiplier)
  if (enPassant) {
    moves.push({
      piece,
      type: `captureEnPassant`,
      steps: enPassant.steps,
      capture: enPassant.piece,
      newPosition: {
        x: piece.position.x + enPassant.steps.x,
        y: piece.position.y + enPassant.steps.y,
      },
    })
  }

  const movesDiagonal: Position[] = [
    { x: 1, y: 1 * colorMultiplier },
    { x: -1, y: 1 * colorMultiplier },
  ]
  for (const steps of movesDiagonal) {
    const move = getMove({ piece, board, steps, propagateDetectCheck })
    if (move?.type === `capture` || move?.type === `captureKing`) {
      moves.push(move)
    }
  }

  return moves
}

export const createPawn = ({ color, id, position }: PieceFactory): Pawn => {
  const hasMoved = false
  return {
    hasMoved,
    ...getBasePiece({ color, id, type: `pawn`, position }),
  }
}

export type Pawn = Piece & {
  hasMoved: boolean
}
