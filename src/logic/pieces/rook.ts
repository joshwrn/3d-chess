import type { Board, Position } from '../board'
import type { Piece, PieceFactory } from './'
import { getBasePiece, oppositeColor } from './'

export function isRook(value: Piece | Rook | null): value is Rook {
  return value?.type === `rook`
}

const getMoves = ({
  dir,
  piece,
  board,
}: {
  dir: Position
  piece: Rook
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

export const rookMoves = ({
  piece,
  board,
}: {
  piece: Rook
  board: Board
}): Position[] => {
  const movesForward = getMoves({ dir: { x: 0, y: 1 }, piece, board })
  const movesBackward = getMoves({ dir: { x: 0, y: -1 }, piece, board })
  const movesLeft = getMoves({ dir: { x: -1, y: 0 }, piece, board })
  const movesRight = getMoves({ dir: { x: 1, y: 0 }, piece, board })
  return [...movesForward, ...movesBackward, ...movesLeft, ...movesRight]
}

export const createRook = ({ color, id, position }: PieceFactory): Rook => {
  return {
    ...getBasePiece({ color, id, type: `rook`, position }),
  }
}

export type Rook = Piece & {
  getId: () => string
}
