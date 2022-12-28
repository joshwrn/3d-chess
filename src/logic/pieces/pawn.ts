import type { Move, MoveFunction, Piece, PieceFactory } from './'
import { checkPosition, getBasePiece } from './'

export function isPawn(value: Pawn | Piece | null): value is Pawn {
  return value?.type === `pawn`
}

export const pawnMoves: MoveFunction<Pawn> = ({
  piece,
  board,
  propagateWillBeCheck,
}) => {
  const { firstMove, color } = piece
  const colorMultiplier = color === `white` ? -1 : 1

  const movesForward: Move[] = [
    { position: { x: 0, y: 1 * colorMultiplier }, type: `invalid` },
  ]
  if (firstMove) {
    movesForward.push({
      position: { x: 0, y: 2 * colorMultiplier },
      type: `invalid`,
    })
  }
  for (const move of movesForward) {
    const check = checkPosition({ piece, board, move, propagateWillBeCheck })
    if (check === `invalid` || check === `capture`) {
      movesForward.splice(
        movesForward.indexOf(move),
        movesForward.length - movesForward.indexOf(move),
      )
    }
  }

  const allMovesDiagonal: Move[] = [
    {
      position: { x: 1, y: 1 * colorMultiplier },
      type: `invalid`,
    },
    {
      position: { x: -1, y: 1 * colorMultiplier },
      type: `invalid`,
    },
  ]

  const movesDiagonal: Move[] = allMovesDiagonal.filter((move) => {
    const check = checkPosition({ piece, board, move, propagateWillBeCheck })
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
