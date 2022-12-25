import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { checkPosition, getBasePiece } from './'

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
  const { firstMove, color } = piece
  const colorMultiplier = color === `white` ? -1 : 1

  const movesForward = [{ x: 0, y: 1 * colorMultiplier }]
  if (firstMove) {
    movesForward.push({ x: 0, y: 2 * colorMultiplier })
  }
  for (const move of movesForward) {
    const check = checkPosition(piece, board, move)
    if (check === `invalid` || check === `capture`) {
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
    const check = checkPosition(piece, board, move)
    if (check === `capture`) return true
    if (check === `invalid`) return false
  })

  return [...movesForward, ...movesDiagonal]
}

export const createPawn = ({ color, id, position }: PieceFactory): Pawn => {
  const firstMove = true
  return {
    firstMove,
    ...getBasePiece({ color, id, type: `pawn`, position }),
  }
}

export type Pawn = Piece & {
  firstMove: boolean
}
