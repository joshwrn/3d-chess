import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { createId } from './'

export function isPawn(value: Pawn | Piece | null): value is Pawn {
  return value?.type === `pawn`
}

export const pawnMoves = ({
  piece,
  board,
}: {
  piece: Pawn
  board: Board
}): Position[] => {
  const { firstMove, color, position } = piece
  const colorMultiplier = color === `white` ? -1 : 1

  const movesForward = [{ x: 0, y: 1 * colorMultiplier }]
  if (firstMove) {
    movesForward.push({ x: 0, y: 2 * colorMultiplier })
  }
  for (const move of movesForward) {
    const { x, y } = move
    const nextPosition = { x: position.x + x, y: position.y + y }
    if (board[nextPosition.y]?.[nextPosition.x].piece) {
      movesForward.splice(
        movesForward.indexOf(move),
        movesForward.length - movesForward.indexOf(move),
      )
    }
  }

  const movesDiagonal = [
    { x: 1, y: 1 * colorMultiplier },
    { x: -1, y: 1 * colorMultiplier },
  ].filter((move) => {
    const { x, y } = move
    const nextPosition = { x: position.x + x, y: position.y + y }
    const nextTile = board[nextPosition.y]?.[nextPosition.x]
    if (!nextTile) return false
    if (!nextTile.piece || nextTile.piece.color === color) {
      return false
    }
    return true
  })

  return [...movesForward, ...movesDiagonal]
}

export const createPawn = ({ color, id, position }: PieceFactory): Pawn => {
  const firstMove = true
  return {
    color,
    id,
    type: `pawn`,
    position,
    firstMove,
    getId: () => {
      return createId({ type: `pawn`, color: color, id: id })
    },
  }
}

export type Pawn = Piece & {
  firstMove: boolean
  getId: () => string
}
