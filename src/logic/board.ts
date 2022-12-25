export type Position = { x: number; y: number }

export type Piece = {
  type: PieceType
  color: Color
  id: number
  getId: () => string
  position: Position
  firstMove: boolean
}
export type Board = Tile[][]

const createId = (piece: PieceArgs | null): string => {
  return `${piece?.type}-${piece?.color}-${piece?.id}`
}

type Color = `black` | `white`
type PieceType = `bishop` | `king` | `knight` | `pawn` | `queen` | `rook`

type MovesForPiece = {
  pawn: ({
    firstMove,
    color,
    board,
    position,
  }: {
    board: Board
    firstMove: boolean
    color: Color
    position: Position
  }) => Position[]
  bishop: () => Position[]
  king: () => Position[]
  knight: () => Position[]
  queen: () => Position[]
  rook: () => Position[]
}

export const movesForPiece: MovesForPiece = {
  pawn: ({ firstMove, color, board, position }) => {
    const colorMultiplier = color === `white` ? -1 : 1

    const movesForward = [{ x: 0, y: 1 * colorMultiplier }]
    if (firstMove) {
      movesForward.push({ x: 0, y: 2 * colorMultiplier })
    }
    for (const move of movesForward) {
      const { x, y } = move
      const nextPosition = { x: position.x + x, y: position.y + y }
      if (board[nextPosition.y][nextPosition.x].piece) {
        movesForward.splice(movesForward.indexOf(move), 1)
      }
    }

    const movesDiagonal = [
      { x: 1, y: 1 * colorMultiplier },
      { x: -1, y: 1 * colorMultiplier },
    ].filter((move) => {
      const { x, y } = move
      const nextPosition = { x: position.x + x, y: position.y + y }
      const nextTile = board[nextPosition.y]?.[nextPosition.x]
      if (!nextTile.piece) {
        return false
      }
      return true
    })

    return [...movesForward, ...movesDiagonal]
  },
  rook: () => [],
  knight: () => [],
  bishop: () => [],
  queen: () => [],
  king: () => [],
}

type PieceArgs = {
  color: Color
  id: number
  type: PieceType
}

const createPiece = (
  args?: PieceArgs & { position: Position },
): Piece | null => {
  if (!args) return null
  switch (args.type) {
    case `pawn`:
      return createPawn({
        color: args.color,
        id: args.id,
        position: args.position,
      })
    default:
      return null
  }
}

export type Tile = {
  position: Position
  piece: Piece | null
}
export const createTile = (position: Position, piece?: PieceArgs): Tile => {
  return {
    position,
    piece: piece ? createPiece({ ...piece, position }) : null,
  }
}

export type BoardPiece = {
  color: Color
  id: number
  type: PieceType
  position: Position
}

export type Pawn = BoardPiece & {
  firstMove: boolean
  getId: () => string
}
export const createPawn = ({
  color,
  id,
  position,
}: {
  color: Color
  id: number
  position: Position
}): Pawn => {
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

export const DEFAULT_BOARD: Board = [
  [
    createTile(
      { x: 0, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `rook`,
      },
    ),
    createTile(
      { x: 1, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `knight`,
      },
    ),
    createTile(
      { x: 2, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `bishop`,
      },
    ),
    createTile(
      { x: 3, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `queen`,
      },
    ),
    createTile(
      { x: 4, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `king`,
      },
    ),
    createTile(
      { x: 5, y: 0 },
      {
        color: `black`,
        id: 2,
        type: `bishop`,
      },
    ),
    createTile(
      { x: 6, y: 0 },
      {
        color: `black`,
        id: 2,
        type: `knight`,
      },
    ),
    createTile(
      { x: 7, y: 0 },
      {
        color: `black`,
        id: 2,
        type: `rook`,
      },
    ),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) =>
        createTile(
          { x: i, y: 1 },
          {
            color: `black`,
            id: i + 1,
            type: `pawn`,
          },
        ),
      ),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => createTile({ x: i, y: 2 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => createTile({ x: i, y: 3 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => createTile({ x: i, y: 4 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => createTile({ x: i, y: 5 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) =>
        createTile(
          { x: i, y: 6 },
          {
            color: `white`,
            id: i + 1,
            type: `pawn`,
          },
        ),
      ),
  ],
  [
    createTile(
      { x: 0, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `rook`,
      },
    ),
    createTile(
      { x: 1, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `knight`,
      },
    ),
    createTile(
      { x: 2, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `bishop`,
      },
    ),
    createTile(
      { x: 3, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `queen`,
      },
    ),
    createTile(
      { x: 4, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `king`,
      },
    ),
    createTile(
      { x: 5, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `bishop`,
      },
    ),
    createTile(
      { x: 6, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `knight`,
      },
    ),
    createTile(
      { x: 7, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `rook`,
      },
    ),
  ],
]
