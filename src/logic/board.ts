export type Position = { x: number; y: number }

export type Piece = {
  type: PieceType
  color: Color
  id: number
  getId: () => string
  getMoves: (args: { board: Board }) => Position[]
  position: Position
  firstMove?: boolean
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
  }: {
    board: Board
    firstMove: boolean
    color: Color
    position: Position
  }) => Position[]
}

const movesForPiece: MovesForPiece = {
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
    ]
    const mD = []
    for (const move of movesDiagonal) {
      const { x, y } = move
      const nextPosition = { x: position.x + x, y: position.y + y }
      if (board[nextPosition.y][nextPosition.x].piece) {
        mD.push(move)
      }
    }

    return [...movesForward, ...mD]
  },
}

type PieceArgs = { color: Color; id: number; type: PieceType }

const createPiece = (args?: PieceArgs): Piece | null => {
  if (!args) return null
  switch (args.type) {
    case `pawn`:
      return new Pawn(args.color, args.id, { x: 0, y: 0 })
    default:
      return null
  }
}

const newTile = (position: Position, piece?: PieceArgs): Tile => {
  return {
    position,
    piece: createPiece(piece),
  }
}

export class Tile {
  public constructor(position: Position, piece?: PieceArgs) {
    this.position = position
    this.piece = (() => {
      if (piece) {
        switch (piece.type) {
          case `pawn`:
            return new Pawn(piece.color, piece.id, position)
          default:
            return null
        }
      }
      return null
    })()
  }
  public position: Position
  public piece: Piece | null = null
}

class BoardPiece {
  public constructor(
    color: Color,
    id: number,
    position: Position,
    type: PieceType,
  ) {
    this.color = color
    this.id = id
    this.type = type
    this.position = position
  }
  public color: Color
  public id: number
  public type: PieceType
  public position: Position
  public selected = false
}

class Pawn extends BoardPiece {
  public constructor(color: Color, id: number, position: Position) {
    super(color, id, position, `pawn`)
  }
  public firstMove = true
  public getMoves({ board }: { board: Board }) {
    return movesForPiece.pawn({
      firstMove: this.firstMove,
      color: this.color,
      position: this.position,
      board,
    })
  }
  public getId(): string {
    return createId({ type: this.type, color: this.color, id: this.id })
  }
}

export const DEFAULT_BOARD: Board = [
  [
    new Tile(
      { x: 0, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `rook`,
      },
    ),
    new Tile(
      { x: 1, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `knight`,
      },
    ),
    new Tile(
      { x: 2, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `bishop`,
      },
    ),
    new Tile(
      { x: 3, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `queen`,
      },
    ),
    new Tile(
      { x: 4, y: 0 },
      {
        color: `black`,
        id: 1,
        type: `king`,
      },
    ),
    new Tile(
      { x: 5, y: 0 },
      {
        color: `black`,
        id: 2,
        type: `bishop`,
      },
    ),
    new Tile(
      { x: 6, y: 0 },
      {
        color: `black`,
        id: 2,
        type: `knight`,
      },
    ),
    new Tile(
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
      .map(
        (_, i) =>
          new Tile(
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
      .map((_, i) => new Tile({ x: i, y: 2 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => new Tile({ x: i, y: 3 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => new Tile({ x: i, y: 4 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map((_, i) => new Tile({ x: i, y: 5 })),
  ],
  [
    ...Array(8)
      .fill(null)
      .map(
        (_, i) =>
          new Tile(
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
    new Tile(
      { x: 0, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `rook`,
      },
    ),
    new Tile(
      { x: 1, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `knight`,
      },
    ),
    new Tile(
      { x: 2, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `bishop`,
      },
    ),
    new Tile(
      { x: 3, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `queen`,
      },
    ),
    new Tile(
      { x: 4, y: 7 },
      {
        color: `white`,
        id: 1,
        type: `king`,
      },
    ),
    new Tile(
      { x: 5, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `bishop`,
      },
    ),
    new Tile(
      { x: 6, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `knight`,
      },
    ),
    new Tile(
      { x: 7, y: 7 },
      {
        color: `white`,
        id: 2,
        type: `rook`,
      },
    ),
  ],
]
